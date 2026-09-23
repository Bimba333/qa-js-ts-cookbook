import type { Locator, Page } from "@playwright/test";

import { WorkItemsFilter } from "./work-items-filter.js";

/** Список задач: страница собирается из компонентов, а не из набора селекторов. */
export class WorkItemsPage {
  readonly #page: Page;
  readonly filter: WorkItemsFilter;

  constructor(page: Page) {
    this.#page = page;
    this.filter = new WorkItemsFilter(
      page.getByRole("form", { name: "Фильтр задач" }),
    );
  }

  async open(): Promise<void> {
    await this.#page.goto("/work-items");
  }

  heading(): Locator {
    return this.#page.getByRole("heading", { name: "Задачи" });
  }

  rows(): Locator {
    return this.#page.locator("tbody tr");
  }

  statusCells(): Locator {
    return this.#page.locator("tbody tr td:nth-child(2)");
  }

  /** Ссылка карточки — это заголовок задачи в таблице. */
  firstLink(): Locator {
    return this.#page.getByRole("table").getByRole("link").first();
  }

  async openFirst(): Promise<void> {
    await this.firstLink().click();
    await this.#page.waitForURL(/\/work-items\/[^/]+$/);
  }
}
