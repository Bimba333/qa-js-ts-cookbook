class BasePage {
  open() {
    return 'open page';
  }
}

class LoginPage extends BasePage {
  login() {
    return 'submit login form';
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open());
console.log(loginPage.login());
