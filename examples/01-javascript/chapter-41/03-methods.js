class PageObject {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  describePage() {
    return `${this.name}: ${this.url}`;
  }
}

const loginPage = new PageObject('LoginPage', '/login');
const profilePage = new PageObject('ProfilePage', '/profile');

console.log(loginPage.describePage());
console.log(profilePage.describePage());
