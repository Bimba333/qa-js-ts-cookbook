class BasePage {
  open() {
    return 'open page';
  }

  waitReady() {
    return 'wait until page is ready';
  }
}

class LoginPage extends BasePage {
  login() {
    return 'login action';
  }
}

class ProfilePage extends BasePage {
  updateProfile() {
    return 'update profile action';
  }
}

const loginPage = new LoginPage();
const profilePage = new ProfilePage();

console.log(loginPage.open());
console.log(profilePage.waitReady());
