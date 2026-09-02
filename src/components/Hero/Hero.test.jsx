import { describe, expect, it } from "vitest";
import { renderWithLanguage, screen } from "../../test/utils.jsx";
import { socials } from "../../i18n/translations";
import Hero from "./Hero.jsx";

describe("<Hero />", () => {
  it("states the role in the page heading", () => {
    renderWithLanguage(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Frontend");
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("sends the call to action to the projects section", () => {
    renderWithLanguage(<Hero />);

    expect(screen.getByRole("link", { name: /Projects/ })).toHaveAttribute(
      "href",
      "#projects"
    );
  });

  it("renders every social link with a safe target", () => {
    renderWithLanguage(<Hero />);

    socials.forEach((item) => {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });
});
