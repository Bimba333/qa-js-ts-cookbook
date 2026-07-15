export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
interface LoginPage {
  open(): Promise<void>;
  login(email: string, password: string): Promise<void>;
}

class BrokenLoginPage implements LoginPage {
  async open(): Promise<void> {
    console.log("open login page");
  }

  // @ts-expect-error Метод login должен возвращать Promise<void>.
  login(email: string, password: string): string {
    console.log(password.length);
    console.log(`login ${email}`);
    return email;
  }
}

console.log(BrokenLoginPage);
