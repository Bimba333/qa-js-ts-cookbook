import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import { isDomainError, type DomainErrorCode } from "../domain/errors.js";
import { DomainError } from "../domain/errors.js";
import type { WorkItem } from "../domain/work-item.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import type { Principal } from "../repositories/auth-repository.js";
import type { AuthService } from "../services/auth-service.js";
import type { WorkItemService } from "../services/work-item-service.js";

/**
 * Перевод доменного кода в gRPC status.
 *
 * `INTERNAL` не используется для известных ошибок валидации, доступа, домена
 * и конкурентности: он остаётся признаком настоящего сбоя.
 */
const STATUS_BY_CODE: Readonly<Record<DomainErrorCode, grpc.status>> =
  Object.freeze({
    VALIDATION_FAILED: grpc.status.INVALID_ARGUMENT,
    PAYLOAD_TOO_LARGE: grpc.status.RESOURCE_EXHAUSTED,
    UNAUTHENTICATED: grpc.status.UNAUTHENTICATED,
    PERMISSION_DENIED: grpc.status.PERMISSION_DENIED,
    SEED_IMMUTABLE: grpc.status.PERMISSION_DENIED,
    CROSS_RUN_CLEANUP_DENIED: grpc.status.PERMISSION_DENIED,
    NOT_FOUND: grpc.status.NOT_FOUND,
    VERSION_CONFLICT: grpc.status.FAILED_PRECONDITION,
    INVALID_TRANSITION: grpc.status.FAILED_PRECONDITION,
  });

const UNSPECIFIED = /_UNSPECIFIED$/;

export type GrpcDependencies = Readonly<{
  authService: AuthService;
  workItemService: WorkItemService;
  host: string;
  port: number;
}>;

function protoDirectory(): string {
  return path.resolve(process.cwd(), "sut/contracts/proto");
}

function loadPackage(file: string): grpc.GrpcObject {
  const definition = protoLoader.loadSync(path.join(protoDirectory(), file), {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [protoDirectory()],
  });

  return grpc.loadPackageDefinition(definition);
}

function metadataValue(
  metadata: grpc.Metadata,
  key: string,
): string | undefined {
  const value = metadata.get(key)[0];

  return typeof value === "string" ? value : undefined;
}

/** Пустая строка и `*_UNSPECIFIED` означают «фильтр не задан». */
function optionalEnum(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;

  return UNSPECIFIED.test(value) ? undefined : value;
}

function toProtoWorkItem(item: WorkItem): Record<string, unknown> {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
    ownerId: item.ownerId,
    createdBy: item.createdBy,
    testRunId: item.testRunId ?? "",
    creatorTestId: item.creatorTestId ?? "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    version: item.version,
  };
}

function toServiceError(error: unknown, correlationId: string): grpc.ServiceError {
  if (isDomainError(error)) {
    return Object.assign(new Error(error.message), {
      code: STATUS_BY_CODE[error.code],
      details: error.message,
      metadata: correlationMetadata(correlationId),
    }) as grpc.ServiceError;
  }

  logEvent("grpc.request.failed", {
    correlationId,
    errorCode: safeErrorCode(error),
  });

  return Object.assign(new Error("Внутренняя ошибка SUT"), {
    code: grpc.status.INTERNAL,
    details: "Внутренняя ошибка SUT",
    metadata: correlationMetadata(correlationId),
  }) as grpc.ServiceError;
}

function correlationMetadata(correlationId: string): grpc.Metadata {
  const metadata = new grpc.Metadata();
  metadata.set("correlation-id", correlationId);

  return metadata;
}

export class GrpcServer {
  readonly #server: grpc.Server;
  readonly #host: string;
  readonly #port: number;
  #serving = false;

  constructor(dependencies: GrpcDependencies) {
    const { authService, workItemService } = dependencies;
    this.#host = dependencies.host;
    this.#port = dependencies.port;
    this.#server = new grpc.Server();

    const workItemsPackage = loadPackage("work_items.proto");
    const healthPackage = loadPackage("health.proto");

    const workItemService_ = (
      (
        (workItemsPackage["qa"] as grpc.GrpcObject)["educational"] as grpc.GrpcObject
      )["workitems"] as grpc.GrpcObject
    )["v1"] as grpc.GrpcObject;
    const healthService = (
      (healthPackage["grpc"] as grpc.GrpcObject)["health"] as grpc.GrpcObject
    )["v1"] as grpc.GrpcObject;

    const authenticate = async (
      metadata: grpc.Metadata,
    ): Promise<Principal> => {
      const authorization = metadataValue(metadata, "authorization");
      const match = authorization
        ? /^Bearer\s+(?<token>[A-Za-z0-9._~+/=-]{16,512})$/.exec(authorization)
        : null;

      if (!match?.groups?.token) {
        throw new DomainError(
          "UNAUTHENTICATED",
          "Требуется metadata authorization с bearer token",
        );
      }

      return authService.authenticateBearer(match.groups.token);
    };

    const correlationOf = (metadata: grpc.Metadata): string =>
      metadataValue(metadata, "correlation-id") ?? "grpc-request";

    this.#server.addService(
      (workItemService_["WorkItemService"] as grpc.ServiceClientConstructor)
        .service,
      {
        GetWorkItem: (
          call: grpc.ServerUnaryCall<{ id: string }, unknown>,
          callback: grpc.sendUnaryData<unknown>,
        ) => {
          const correlationId = correlationOf(call.metadata);
          void (async () => {
            try {
              const principal = await authenticate(call.metadata);
              const item = await workItemService.getById(
                principal,
                call.request.id,
              );
              callback(null, toProtoWorkItem(item));
            } catch (error) {
              callback(toServiceError(error, correlationId));
            }
          })();
        },

        SearchWorkItems: (
          call: grpc.ServerUnaryCall<Record<string, unknown>, unknown>,
          callback: grpc.sendUnaryData<unknown>,
        ) => {
          const correlationId = correlationOf(call.metadata);
          void (async () => {
            try {
              const principal = await authenticate(call.metadata);
              const request = call.request;
              const result = await workItemService.search(principal, {
                status: optionalEnum(request["status"]),
                priority: optionalEnum(request["priority"]),
                ownerId:
                  typeof request["ownerId"] === "string" &&
                  request["ownerId"].length > 0
                    ? request["ownerId"]
                    : undefined,
                limit:
                  typeof request["limit"] === "number" && request["limit"] > 0
                    ? request["limit"]
                    : undefined,
                offset:
                  typeof request["offset"] === "number" && request["offset"] > 0
                    ? request["offset"]
                    : undefined,
              });

              callback(null, {
                items: result.items.map(toProtoWorkItem),
                total: result.total,
              });
            } catch (error) {
              callback(toServiceError(error, correlationId));
            }
          })();
        },

        TransitionWorkItem: (
          call: grpc.ServerUnaryCall<Record<string, unknown>, unknown>,
          callback: grpc.sendUnaryData<unknown>,
        ) => {
          const correlationId = correlationOf(call.metadata);
          void (async () => {
            try {
              const principal = await authenticate(call.metadata);
              const request = call.request;
              const item = await workItemService.transition(
                principal,
                request["id"],
                optionalEnum(request["targetStatus"]) ?? request["targetStatus"],
                request["expectedVersion"],
                correlationId,
              );

              callback(null, { item: toProtoWorkItem(item) });
            } catch (error) {
              callback(toServiceError(error, correlationId));
            }
          })();
        },
      },
    );

    this.#server.addService(
      (healthService["Health"] as grpc.ServiceClientConstructor).service,
      {
        Check: (
          _call: grpc.ServerUnaryCall<{ service: string }, unknown>,
          callback: grpc.sendUnaryData<unknown>,
        ) => {
          callback(null, {
            status: this.#serving ? "SERVING" : "NOT_SERVING",
          });
        },
      },
    );
  }

  async start(): Promise<number> {
    const port = await new Promise<number>((resolve, reject) => {
      this.#server.bindAsync(
        `${this.#host}:${this.#port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
          if (error) reject(error);
          else resolve(boundPort);
        },
      );
    });

    this.#serving = true;

    return port;
  }

  /**
   * Graceful shutdown: текущие вызовы завершаются, новые не принимаются.
   * Принудительное завершение допустимо только после таймаута.
   */
  async close(timeoutMs = 3_000): Promise<void> {
    if (!this.#serving) return;
    this.#serving = false;

    await new Promise<void>((resolve) => {
      const force = setTimeout(() => {
        this.#server.forceShutdown();
        resolve();
      }, timeoutMs);
      force.unref();

      this.#server.tryShutdown(() => {
        clearTimeout(force);
        resolve();
      });
    });
  }
}
