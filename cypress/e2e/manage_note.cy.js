describe("Note Operations", () => {

  const GUESS_WEB_URL = "http://localhost:3000";
  let userData;

  before(() => {
    cy.fixture("noteData").then((data) => {
      userData = data;
    });
  });

  // login step
  const login = () => {
    cy.visit(GUESS_WEB_URL + "/login");
    cy.get('[data-cy="email-input"]').type("adit@test.com");
    cy.get('[data-cy="password-input"]').type("test123");
    cy.get('[data-cy="submit"]').click();
  }

  // submit note step
  const submitNote = (title, desc, checkbox) => {
    if (title) cy.get('[data-cy="title"]').type(title)
    if (desc) cy.get('[data-cy="description"]').type(desc)
    if (checkbox) cy.get('[data-cy="checkbox"]').check()

    cy.get('[id="save_button"]').should('be.visible').click();
  }

  // Outer describe block for creating notes
  describe("Create Note", () => {

    beforeEach(() => {
      login();
    });

    describe("When some fields are not filled", () => {
      it("should fail to save note with not filled title, description, and checkbox unchecked", () => {
        cy.get('[id="save_button"]').should('be.visible').click();

        cy.url().should("include", "/dashboard");
        cy.get("#title_error").should("be.visible").and("contain", "Title is required");
        cy.get("#description_error").should("be.visible").and("contain", "Description is required");
        cy.get("#check_error").should("be.visible").and("contain", "You must check the box");
      })
    })

    // Nested describe block for specific scenarios
    describe("When all fields are filled", () => {
      it("should successfully save note with filled title, description, and checkbox checked", () => {
        submitNote(userData.NOTE_TITLE, userData.NOTE_DESC, true);

        cy.url().should("include", "/dashboard");
        cy.get("#alert_form")
          .should("be.visible")
          .and("contain", "Memo created successfully!");
      });

    });
  });

  // Outer describe block for deleting notes
  describe("Delete Note", () => {
    
    beforeEach(() => {
      login();
    });

    describe("data is available case", () => {
      it("should successfully delete a note", () => {
        // Assume the note was successfully created and now exists
        // submitNote(userData.NOTE_TITLE, userData.NOTE_DESC, true);

        // Ensure memo card is visible before deletion
        cy.get('.memo-title').contains(userData.NOTE_TITLE).should("be.visible");

        // Perform the delete action by clicking on the note card
        cy.get('.memo-title').contains(userData.NOTE_TITLE).click();

        // Ensure the delete confirmation alert is shown
        cy.get("#alert_form")
          .should("be.visible")
          .and("contain", "Memo deleted successfully!");

      });
    })

  });

});