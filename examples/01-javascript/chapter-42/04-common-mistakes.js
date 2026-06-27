class BasePage {
  open() {
    return 'open page';
  }
}

class LoginPage extends BasePage {}

const loginPage = new LoginPage();

console.log(Object.prototype.hasOwnProperty.call(loginPage, 'open'));
console.log(loginPage.open());
