import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithLanguage, screen, within } from "../../test/utils.jsx";
import { translations } from "../../i18n/translations";
import Projects from "./Projects.jsx";

const items = translations.en.projects.items;
const card = (title) =>
  screen.getByRole("heading", { name: title, hidden: true }).closest("article");
const track = () => document.querySelector('[style*="--i"]');
const next = () => screen.getByRole("button", { name: "Next" });
const prev = () => screen.getByRole("button", { name: "Previous" });

describe("<Projects />", () => {
  it("renders a card per project", () => {
    renderWithLanguage(<Projects />);

    items.forEach((item) => {
      expect(card(item.title)).toBeInTheDocument();
    });
    expect(document.querySelectorAll("article")).toHaveLength(items.length);
  });

  it("links the public projects to their live sites in a new tab", () => {
    renderWithLanguage(<Projects />);

    items
      .filter((item) => item.href)
      .forEach((item) => {
        const link = within(card(item.title)).getByRole("link", { hidden: true });
        expect(link).toHaveAttribute("href", item.href);
        expect(link).toHaveAttribute("target", "_blank");
        // Without noreferrer the opened tab can reach back through window.opener.
        expect(link).toHaveAttribute("rel", "noreferrer");
      });
  });

  it("locks the NDA projects behind a disabled button instead of a link", () => {
    renderWithLanguage(<Projects />);

    items
      .filter((item) => item.nda)
      .forEach((item) => {
        const locked = card(item.title);
        expect(within(locked).queryByRole("link", { hidden: true })).toBeNull();

        const button = within(locked).getByRole("button", { hidden: true });
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent("NDA");
      });
  });

  it("shows a screenshot only for the projects that have one", () => {
    renderWithLanguage(<Projects />);

    items.forEach((item) => {
      const images = within(card(item.title)).queryAllByRole("img", { hidden: true });
      expect(images).toHaveLength(item.href ? 1 : 0);
    });
  });

  it("exposes only the active card to assistive tech", () => {
    renderWithLanguage(<Projects />);

    const cards = [...document.querySelectorAll("article")];
    expect(cards[0]).not.toHaveAttribute("aria-hidden", "true");
    cards.slice(1).forEach((el) => {
      expect(el).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("moves the track forward and back", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Projects />);

    expect(track()).toHaveStyle({ "--i": "0" });

    await user.click(next());
    expect(track()).toHaveStyle({ "--i": "1" });

    await user.click(next());
    expect(track()).toHaveStyle({ "--i": "2" });

    await user.click(prev());
    expect(track()).toHaveStyle({ "--i": "1" });
  });

  it("disables the arrows at both ends", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Projects />);

    expect(prev()).toBeDisabled();
    expect(next()).toBeEnabled();

    for (let i = 0; i < items.length - 1; i += 1) {
      await user.click(next());
    }

    expect(next()).toBeDisabled();
    expect(prev()).toBeEnabled();
  });

  it("keeps off-screen cards out of the tab order", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Projects />);

    const levada = within(card("Levada")).getByRole("link", { hidden: true });
    expect(levada).toHaveAttribute("tabindex", "-1");

    // Levada is the third card.
    await user.click(next());
    await user.click(next());

    expect(levada).toHaveAttribute("tabindex", "0");
  });
});
