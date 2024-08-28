describe("Login Test with Fixtures", () => {

  const GUESS_WEB_URL = "http://localhost:3000";

  let loginDataVar

  before(() => {
    cy.fixture("loginData").then((data) => {
      loginDataVar = data;
    });
  });

  // create reusable step
  // visit login
  const visitLoginPage = () => {
    cy.visit(GUESS_WEB_URL + "/login");
  };

  // create reusable step
  // submit login form
  const submitLoginForm = (email, password) => {
    if (email) cy.get('[data-cy="email-input"]').type(email);
    if (password) cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="submit"]').click();
  };

  // CASE 1
  it("should fail log in with not filled password", function () {
    visitLoginPage();
    submitLoginForm(loginDataVar.invalidUser.email, "");
    cy.url().should("include", "/login");
    cy.contains(loginDataVar.messages.fieldsRequired).should("be.visible");
  });

  // CASE 2
  it("should fail log in with not filled email", function () {
    visitLoginPage();
    submitLoginForm("", loginDataVar.validUser.password); 
    cy.url().should("include", "/login");
    cy.contains(loginDataVar.messages.fieldsRequired).should("be.visible");
  });

  // CASE 3
  it("should fail log in with wrong email", function () {
    visitLoginPage();
    submitLoginForm(loginDataVar.invalidUser.email, loginDataVar.validUser.password); 
    cy.url().should("include", "/login");
    cy.contains(loginDataVar.messages.loginFailed).should("be.visible");
  });

  // CASE 4
  it("should fail log in with wrong password", function () {
    visitLoginPage();
    submitLoginForm(loginDataVar.validUser.email, loginDataVar.invalidUser.password); 
    cy.url().should("include", "/login");
    cy.contains(loginDataVar.messages.loginFailed).should("be.visible");
  });

  // CASE 5
  it("should successfully log in with valid credentials", function () {
    visitLoginPage();
    submitLoginForm(loginDataVar.validUser.email, loginDataVar.validUser.password); 
    cy.contains("Memo").should("be.visible");
  });

});
