import type { Locator, Page } from "@playwright/test";

/** Карточка задачи. Идентификатор берётся из адреса, а не из разметки. */
export class WorkItemCardPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  async open(id: string): Promise<void> {
    await this.#page.goto(`/work-items/${id}`);
  }

  heading(): Locator {
    return this.#page.getByRole("heading").first();
  }

  identifier(): string {
    const match = /\/work-items\/([^/?#]+)$/.exec(this.#page.url());

    if (!match) {
      throw new Error("Открыта не карточка задачи: в адресе нет идентификатора");
    }

    return match[1]!;
  }
}
