class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    return `focus form on ${pageName}`;
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open('LoginPage'));
