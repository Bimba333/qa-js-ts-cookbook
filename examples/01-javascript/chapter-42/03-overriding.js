class BasePage {
  describe() {
    return 'base page';
  }
}

class LoginPage extends BasePage {
  describe() {
    return 'login page';
  }
}

const loginPage = new LoginPage();

console.log(loginPage.describe());
