import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

const renderApp = () =>
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );

describe("<App />", () => {
  it("renders every section in order", () => {
    renderApp();

    const ids = [...document.querySelectorAll("main > section")].map((s) => s.id);
    expect(ids).toEqual(["top", "projects", "about", "work", "contacts"]);
  });

  it("shows no loader until the language changes", () => {
    renderApp();

    expect(screen.queryByRole("status")).toBeNull();
  });

  describe("language switch", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("covers the page with the loader and then shows Russian copy", () => {
      renderApp();

      // fireEvent rather than userEvent: the latter waits on real timers.
      fireEvent.click(screen.getByRole("button", { name: "Ru" }));

      // The loader is what hides the reflow while the copy length changes.
      const loader = screen.getByRole("status");
      expect(loader).toHaveTextContent("Switching language");

      act(() => vi.advanceTimersByTime(700));

      expect(screen.queryByRole("status")).toBeNull();
      expect(screen.getByRole("heading", { name: "Опыт" })).toBeInTheDocument();
      expect(screen.getByText("Давайте поговорим")).toBeInTheDocument();
    });
  });
});
