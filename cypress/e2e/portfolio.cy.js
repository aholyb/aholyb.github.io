/// <reference types="cypress" />

const SECTIONS = ["top", "projects", "about", "work", "contacts"];

const activeCard = () => cy.get('#projects article:not([aria-hidden="true"])');
const nextProject = () => cy.get('#projects button[aria-label="Next"]');
const prevProject = () => cy.get('#projects button[aria-label="Previous"]');
const workEntry = (company) =>
  cy.contains("#work button", company).should("exist");

describe("first visit", () => {
  it("lands on the English hero", () => {
    cy.get("h1").should("have.text", "Frontend");
    cy.contains("Developer").should("be.visible");
    cy.contains("My goal is to").should("be.visible");
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("renders every section of the page", () => {
    SECTIONS.forEach((id) => cy.get(`#${id}`).should("exist"));
  });

  it("shows the hero photograph and the portrait", () => {
    cy.get('img[alt="Anton Holub"]')
      .should("be.visible")
      .and(($img) => {
        expect($img[0].naturalWidth, "portrait is decoded").to.be.greaterThan(0);
      });

    // The hero background is a decorative ::after layer, not an <img>.
    cy.get("#top").then(($hero) => {
      const layer = getComputedStyle($hero[0], "::after").backgroundImage;
      expect(layer).to.include("hero-bg");
    });
  });
});

describe("navigating the page", () => {
  it("jumps to a section from the header", () => {
    cy.contains("header a", "Work").click();

    cy.url().should("include", "#work");
    cy.get("#work").should("be.visible");
    cy.window().its("scrollY").should("be.greaterThan", 0);
  });

  it("returns to the top from the hero call to action", () => {
    cy.contains("header a", "Contacts").click();
    cy.contains("Let's talk").should("be.visible");

    cy.contains("header a", "Projects").click();
    cy.get("#projects").should("be.visible");
  });
});

describe("switching the language", () => {
  it("covers the page with the loader, then shows Russian copy", () => {
    cy.contains("button", "Ru").click();

    // The loader is what hides the reflow while the copy length changes.
    cy.get('[role="status"]').should("exist").and("contain.text", "Switching");
    cy.get('[role="status"]', { timeout: 4000 }).should("not.exist");

    cy.get("html").should("have.attr", "lang", "ru");
    cy.contains("header a", "Обо мне").should("be.visible");
    cy.contains("h2", "Опыт").should("be.visible");
    cy.contains("Давайте поговорим").should("be.visible");
    cy.contains("button", "Ru").should("have.attr", "aria-pressed", "true");
  });

  it("switches back to English", () => {
    cy.contains("button", "Ru").click();
    cy.get('[role="status"]', { timeout: 4000 }).should("not.exist");

    cy.contains("button", "En").click();
    cy.get('[role="status"]', { timeout: 4000 }).should("not.exist");

    cy.get("html").should("have.attr", "lang", "en");
    cy.contains("header a", "About").should("be.visible");
  });

  it("keeps the work history readable in Russian", () => {
    cy.contains("button", "Ru").click();
    cy.get('[role="status"]', { timeout: 4000 }).should("not.exist");

    workEntry("Альфа-Банк").should("have.attr", "aria-expanded", "true");
    cy.contains("#work", "Обязанности").should("be.visible");
    cy.contains("#work", "более 5 лет").should("be.visible");
  });
});

describe("reading the work history", () => {
  it("opens the current job by default", () => {
    workEntry("Alfa-Bank").should("have.attr", "aria-expanded", "true");
    cy.contains(
      "#work",
      "Development of internal web applications for bank employees."
    ).should("be.visible");
  });

  it("opens another job and closes the previous one", () => {
    workEntry("Sber").click();

    workEntry("Sber").should("have.attr", "aria-expanded", "true");
    workEntry("Alfa-Bank").should("have.attr", "aria-expanded", "false");
    cy.contains("#work", "Feature development using React and MobX").should(
      "be.visible"
    );
  });

  it("collapses a job when its row is clicked again", () => {
    workEntry("Alfa-Bank").click().should("have.attr", "aria-expanded", "false");
    cy.get("#work [aria-expanded='true']").should("not.exist");
  });

  it("lists all four employers", () => {
    ["Alfa-Bank", "Aston", "Sber", "AskerWeb"].forEach((company) =>
      workEntry(company)
    );
  });
});

describe("browsing the projects", () => {
  it("starts on an NDA project with no link to follow", () => {
    activeCard().within(() => {
      cy.contains("h3", "SberOffice").should("be.visible");
      cy.contains("button", "NDA").should("be.disabled");
      cy.get("a").should("not.exist");
    });

    prevProject().should("be.disabled");
  });

  it("walks the carousel to a public project and back", () => {
    nextProject().click();
    activeCard().contains("h3", "Internal banking products").should("be.visible");

    nextProject().click();
    activeCard().contains("h3", "Levada").should("be.visible");

    prevProject().click();
    activeCard().contains("h3", "Internal banking products").should("be.visible");
  });

  it("links a public project to its live site in a new tab", () => {
    nextProject().click();
    nextProject().click();

    // Assert the link instead of following it: the target is a third-party site.
    activeCard()
      .find("a")
      .should("have.attr", "href", "https://levada-b-h.by/")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noreferrer");
  });

  it("stops at the last project", () => {
    for (let i = 0; i < 4; i += 1) nextProject().click();

    activeCard().contains("h3", "ArkMetall").should("be.visible");
    nextProject().should("be.disabled");
  });
});

describe("contacting", () => {
  const expected = {
    Github: "https://github.com/aholyb",
    Linkedin: "https://www.linkedin.com/in/anton-holub-b0314a377/",
    Telegram: "https://t.me/gggoluba",
    Instagram: "https://instagram.com/uvthevoid",
  };

  it("offers every social link from the contacts section", () => {
    Object.entries(expected).forEach(([label, href]) => {
      cy.contains("#contacts a", label)
        .should("have.attr", "href", href)
        .and("have.attr", "target", "_blank");
    });
  });

  it("repeats the links in the hero", () => {
    Object.entries(expected).forEach(([label, href]) => {
      cy.contains("#top a", label).should("have.attr", "href", href);
    });
  });
});

describe("on a phone", () => {
  beforeEach(() => {
    cy.viewport(375, 812);
  });

  it("hides the desktop navigation", () => {
    cy.get("header nav").should("not.be.visible");
    cy.contains("button", "Ru").should("be.visible");
  });

  it("keeps the portrait small and above the stack cards", () => {
    cy.get('img[alt="Anton Holub"]').then(($img) => {
      const photo = $img[0].getBoundingClientRect();
      expect(photo.height, "portrait does not fill the screen").to.be.lessThan(
        Cypress.config("viewportHeight") * 0.75
      );

      const firstCard = Cypress.$("#about h3")[0].getBoundingClientRect();
      expect(photo.top, "portrait comes first").to.be.lessThan(firstCard.top);
    });
  });

  it("never scrolls sideways", () => {
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        doc.documentElement.clientWidth
      );
    });
  });
});
