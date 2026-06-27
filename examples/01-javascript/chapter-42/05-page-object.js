class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }

  waitReady(pageName) {
    return `${pageName} is ready`;
  }
}

class LoginPage extends BasePage {
  login() {
    return 'login with user credentials';
  }
}

class ProfilePage extends BasePage {
  updateProfile() {
    return 'update user profile';
  }
}

const loginPage = new LoginPage();
const profilePage = new ProfilePage();

console.log(loginPage.open('LoginPage'));
console.log(loginPage.login());
console.log(profilePage.waitReady('ProfilePage'));
