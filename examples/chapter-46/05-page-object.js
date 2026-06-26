class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }

  waitReady(pageName) {
    return `${pageName} is ready`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    const baseResult = super.open(pageName);
    return `${baseResult}, then focus username field`;
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open('LoginPage'));
console.log(loginPage.waitReady('LoginPage'));
