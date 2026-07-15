export {};

interface LoginPage {
  open(): Promise<void>;
  login(email: string, password: string): Promise<void>;
}

class BasicLoginPage implements LoginPage {
  constructor(private readonly baseUrl: string) {}

  async open(): Promise<void> {
    console.log(`open ${this.baseUrl}/login`);
  }

  async login(email: string, password: string): Promise<void> {
    console.log(`login ${email} with password length ${password.length}`);
  }
}

async function runLoginScenario(page: LoginPage): Promise<void> {
  await page.open();
  await page.login("admin@example.test", "secret");
}

void runLoginScenario(new BasicLoginPage("https://staging.example.test"));
