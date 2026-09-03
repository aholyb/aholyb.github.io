import { act, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage, screen } from "../../test/utils.jsx";
import Header from "../Header/Header.jsx";
import ResumeButton from "./ResumeButton.jsx";

describe("<ResumeButton />", () => {
  it("downloads the English CV by default", () => {
    renderWithLanguage(<ResumeButton />);

    const link = screen.getByRole("link", { name: "Resume" });
    expect(link).toHaveAttribute(
      "href",
      "/resume/Anton_Holub_Frontend_Developer_EN.pdf"
    );
    // Without the attribute the browser would open the PDF instead of saving it.
    expect(link).toHaveAttribute(
      "download",
      "Anton_Holub_Frontend_Developer_EN.pdf"
    );
  });

  describe("after switching the language", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("hands out the Russian file", () => {
      renderWithLanguage(
        <>
          <Header />
          <ResumeButton />
        </>
      );

      fireEvent.click(screen.getByRole("button", { name: "Ru" }));
      act(() => vi.advanceTimersByTime(700));

      const link = screen.getByRole("link", { name: "Резюме" });
      expect(link).toHaveAttribute(
        "href",
        "/resume/Anton_Holub_Frontend_Developer_RU.pdf"
      );
      expect(link).toHaveAttribute(
        "download",
        "Anton_Holub_Frontend_Developer_RU.pdf"
      );
    });
  });
});
