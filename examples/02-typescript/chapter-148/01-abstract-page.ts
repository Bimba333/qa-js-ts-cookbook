export {};

abstract class BaseScreen {
  constructor(protected readonly baseUrl: string) {}

  abstract route: string;

  openUrl(): string {
    return `${this.baseUrl}${this.route}`;
  }
}

class UsersScreen extends BaseScreen {
  route = "/users";
}

const screen = new UsersScreen("https://app.test");

console.log(screen.openUrl());
