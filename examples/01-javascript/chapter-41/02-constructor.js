class PageObject {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}

const loginPage = new PageObject('LoginPage', '/login');
const profilePage = new PageObject('ProfilePage', '/profile');

console.log(loginPage.name);
console.log(profilePage.url);
