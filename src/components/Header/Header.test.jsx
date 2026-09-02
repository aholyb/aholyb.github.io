import { act, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage, screen } from "../../test/utils.jsx";
import Header from "./Header.jsx";

describe("<Header />", () => {
  it("links to every section of the page", () => {
    renderWithLanguage(<Header />);

    const expected = {
      About: "#about",
      Projects: "#projects",
      Work: "#work",
      Contacts: "#contacts",
    };

    Object.entries(expected).forEach(([label, href]) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    });
  });

  it("marks English as the active language", () => {
    renderWithLanguage(<Header />);

    expect(screen.getByRole("button", { name: "En" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Ru" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  describe("language toggle", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("translates the navigation and moves the active mark", () => {
      renderWithLanguage(<Header />);

      // fireEvent rather than userEvent: the latter waits on real timers.
      fireEvent.click(screen.getByRole("button", { name: "Ru" }));
      act(() => vi.advanceTimersByTime(700));

      expect(screen.getByRole("link", { name: "Обо мне" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Опыт" })).toHaveAttribute(
        "href",
        "#work"
      );
      expect(screen.getByRole("button", { name: "Ru" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: "En" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });
});
