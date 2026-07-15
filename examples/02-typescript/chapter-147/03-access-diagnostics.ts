export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
class LoginActions {
  constructor(private readonly baseUrl: string) {}

  getLoginUrl(): string {
    return `${this.baseUrl}/login`;
  }
}

const actions = new LoginActions("https://example.test");

// @ts-expect-error baseUrl is private and readonly.
actions.baseUrl = "https://other.test";

console.log(actions.getLoginUrl());
