import { RestClient, toResult } from "./rest-client.js";
import { assertSearchResult, assertWorkItem } from "./validate-response.js";
import type {
  ApiResult,
  CreateWorkItemInput,
  SearchQuery,
  SearchResult,
  WorkItem,
  WorkItemStatus,
} from "./types.js";

/**
 * Клиент ресурса: говорит о задачах, а не о запросах.
 *
 * Сценарий вызывает `create`, а не `POST /work-items`. Смена адреса или
 * формата тела остаётся внутри этого файла.
 */
export class WorkItemsClient {
  readonly #rest: RestClient;

  constructor(rest: RestClient) {
    this.#rest = rest;
  }

  async create(input: CreateWorkItemInput): Promise<ApiResult<WorkItem>> {
    return toResult(await this.#rest.post("/work-items", input), assertWorkItem);
  }

  async getById(id: string): Promise<ApiResult<WorkItem>> {
    return toResult(await this.#rest.get(`/work-items/${id}`), assertWorkItem);
  }

  async search(query: SearchQuery = {}): Promise<ApiResult<SearchResult>> {
    const params: Record<string, string> = {};

    if (query.status) params["status"] = query.status;
    if (query.priority) params["priority"] = query.priority;
    if (query.limit !== undefined) params["limit"] = String(query.limit);
    if (query.offset !== undefined) params["offset"] = String(query.offset);

    return toResult(await this.#rest.get("/work-items", params), assertSearchResult);
  }

  /**
   * Обновление требует версии: стенд отклонит запрос, если запись изменилась
   * между чтением и записью. Версия приходит из предыдущего ответа, а не
   * придумывается сценарием.
   */
  async transition(
    id: string,
    status: WorkItemStatus,
    expectedVersion: number,
  ): Promise<ApiResult<WorkItem>> {
    return toResult(
      await this.#rest.patch(`/work-items/${id}`, { status, expectedVersion }),
      assertWorkItem,
    );
  }

  async remove(id: string): Promise<ApiResult<null>> {
    return toResult(await this.#rest.delete(`/work-items/${id}`), () => null);
  }
}
