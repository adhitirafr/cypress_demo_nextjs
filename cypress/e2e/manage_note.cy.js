describe("Note Operations", () => {
  let userData;

  before(() => {
    cy.fixture("user").then((data) => {
      userData = data;
    });
  });

  // Outer describe block for creating notes
  describe("Create Note", () => {
    beforeEach(() => {
      login();
    });

    it("should fail to save note with not filled title, description, and checkbox unchecked", () => {
      submitNote("", "", false);

      cy.url().should("include", "/dashboard");
      cy.contains("Title is required").should("be.visible");
      cy.contains("Description is required").should("be.visible");
      cy.contains("You must check the box").should("be.visible");
    });

    // Other test cases for creating notes...

    // Nested describe block for specific scenarios
    describe("When all fields are filled", () => {
      it("should successfully save note with filled title, description, and checkbox checked", () => {
        submitNote(userData.NOTE_TITLE, userData.NOTE_DESC, true);

        cy.url().should("include", "/dashboard");
        cy.get("#alert_form")
          .should("be.visible")
          .and("contain", "Memo created successfully!");
      });

      // Additional related test cases...
    });
  });

  // Outer describe block for deleting notes
  describe("Delete Note", () => {
    beforeEach(() => {
      login();
      submitNote(userData.NOTE_TITLE, userData.NOTE_DESC, true);
    });

    it("should successfully delete a note", () => {
      deleteNote(userData.NOTE_TITLE);

      cy.get("#alert_form")
        .should("be.visible")
        .and("contain", "Memo deleted successfully!");
    });

    // Additional test cases for deleting notes...
  });
});
