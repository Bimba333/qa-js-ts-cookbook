/**
 * Граница между кодом теста и кодом инфраструктуры.
 *
 * Один и тот же сценарий записан дважды. В первом варианте тест знает
 * селекторы и учётные данные, во втором — только то, что проверяет.
 */
type Credentials = { user: string; password: string };

// --- Инфраструктура: знает «как», но не знает «что проверяем» ---

class LoginPage {
  constructor(private readonly open: (path: string) => Promise<void>) {}

  async signIn(credentials: Credentials): Promise<void> {
    await this.open("/login");
    console.log(`вход как ${credentials.user}`);
  }
}

function testUser(): Credentials {
  // Учётные данные приходят из конфигурации, а не из текста теста.
  return { user: "educational_tester", password: "educational-tester-password" };
}

// --- Тест: знает «что проверяем», но не знает «как» ---

async function scenario(loginPage: LoginPage): Promise<string> {
  await loginPage.signIn(testUser());

  return "открыт список задач";
}

const page = new LoginPage(async (path) => console.log(`переход на ${path}`));

console.log(await scenario(page));

export {};
