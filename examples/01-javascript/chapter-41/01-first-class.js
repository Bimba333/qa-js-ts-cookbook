class PageObject {
  describeType() {
    return 'PageObject instance';
  }
}

const loginPage = new PageObject();

console.log(loginPage.describeType());
