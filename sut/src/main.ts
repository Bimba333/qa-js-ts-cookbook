import { loadDatabaseConfig, loadServerConfig } from "./config/index.js";
import { Database } from "./database/database.js";
import { GrpcServer } from "./grpc/server.js";
import { createHealthRoutes } from "./http/health-routes.js";
import { createPlaygroundRoutes } from "./http/playground-routes.js";
import { createRestRoutes } from "./http/rest-routes.js";
import { HttpServer } from "./http/server.js";
import { createUiRoutes } from "./http/ui-routes.js";
import { installShutdownHandlers } from "./lifecycle/shutdown.js";
import { logEvent, safeErrorCode } from "./logging/logger.js";
import { AuthService } from "./services/auth-service.js";
import { WorkItemService } from "./services/work-item-service.js";

/**
 * Composition Root.
 *
 * Здесь связываются адаптеры и сервисы, но направление зависимостей не
 * меняется: транспорты знают про сервисы, сервисы — про репозитории, и
 * никогда наоборот.
 */
let httpServer: HttpServer | undefined;
let grpcServer: GrpcServer | undefined;
let applicationDatabase: Database | undefined;
let verificationDatabase: Database | undefined;
let removeHandlers: () => void = () => {};

/**
 * Порядок остановки обратный порядку запуска: сначала перестаём принимать
 * запросы, потом закрываем пулы базы.
 */
async function closeAll(): Promise<void> {
  await httpServer?.close();
  await grpcServer?.close();
  await applicationDatabase?.close();
  await verificationDatabase?.close();
}

try {
  const serverConfig = loadServerConfig();

  // Два пула с разными ролями: приложение пишет, проверка готовности только
  // читает. Разделение ролей остаётся видимым в рантайме, а не только в SQL.
  applicationDatabase = new Database(loadDatabaseConfig("application"));
  verificationDatabase = new Database(loadDatabaseConfig("reader"), 2);

  const authService = new AuthService(applicationDatabase);
  const workItemService = new WorkItemService(applicationDatabase);

  httpServer = new HttpServer({
    host: serverConfig.httpHost,
    port: serverConfig.httpPort,
    routes: [
      ...createHealthRoutes(verificationDatabase),
      ...createRestRoutes({ authService, workItemService }),
      ...createPlaygroundRoutes({ authService }),
      ...createUiRoutes({ authService, workItemService }),
    ],
  });

  const httpPort = await httpServer.start();

  grpcServer = new GrpcServer({
    authService,
    workItemService,
    host: serverConfig.grpcHost,
    port: serverConfig.grpcPort,
  });
  const grpcPort = await grpcServer.start();

  removeHandlers = installShutdownHandlers(async () => {
    await closeAll();
    removeHandlers();
  });

  logEvent("sut.started", {
    httpHost: serverConfig.httpHost,
    httpPort,
    grpcHost: serverConfig.grpcHost,
    grpcPort,
    capability: "ui-rest-grpc-health",
  });
} catch (error) {
  removeHandlers();
  try {
    await closeAll();
  } catch {
    // Ошибка запуска остаётся авторитетной; сбой закрытия классифицирован.
  }
  logEvent("sut.startup.failed", {
    errorCode: safeErrorCode(error),
  });
  process.exitCode = 1;
}
