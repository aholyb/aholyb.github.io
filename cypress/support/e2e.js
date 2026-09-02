/**
 * Every spec starts on a freshly loaded page with console.error spied on, so a
 * scenario also fails when the page merely logs an error while passing
 * visually.
 */
beforeEach(() => {
  cy.visit("/", {
    onBeforeLoad(win) {
      cy.spy(win.console, "error").as("consoleError");
    },
  });
});

afterEach(() => {
  cy.get("@consoleError").should("not.have.been.called");
});
