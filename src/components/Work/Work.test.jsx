import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithLanguage, screen, within } from "../../test/utils.jsx";
import { translations } from "../../i18n/translations";
import Work from "./Work.jsx";

const rows = translations.en.work.rows;
const entry = (company) => screen.getByRole("button", { name: new RegExp(company) });

describe("<Work />", () => {
  it("lists every job", () => {
    renderWithLanguage(<Work />);

    rows.forEach((row) => {
      expect(entry(row.company)).toBeInTheDocument();
      expect(screen.getByText(row.period)).toBeInTheDocument();
    });
  });

  it("opens the current job by default", () => {
    renderWithLanguage(<Work />);

    expect(entry("Alfa-Bank")).toHaveAttribute("aria-expanded", "true");
    expect(entry("Aston")).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByText("Development of internal web applications for bank employees.")
    ).toBeVisible();
  });

  it("keeps the other panels collapsed", () => {
    renderWithLanguage(<Work />);

    const expanded = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-expanded") === "true");

    expect(expanded).toHaveLength(1);
  });

  it("opens another job and closes the previous one", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Work />);

    await user.click(entry("Sber"));

    expect(entry("Sber")).toHaveAttribute("aria-expanded", "true");
    expect(entry("Alfa-Bank")).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses the open job when it is clicked again", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Work />);

    await user.click(entry("Alfa-Bank"));

    expect(entry("Alfa-Bank")).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText("Development of internal web applications for bank employees.")
    ).not.toBeVisible();
  });

  it("renders responsibilities and achievements of the open job", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<Work />);

    const alfa = rows.find((row) => row.id === "alfa");
    const panel = document.getElementById("work-alfa");

    expect(within(panel).getByText("Responsibilities")).toBeInTheDocument();
    expect(within(panel).getByText("Achievements")).toBeInTheDocument();
    alfa.responsibilities.forEach((item) => {
      expect(within(panel).getByText(item)).toBeInTheDocument();
    });

    await user.click(entry("Aston"));
    const aston = document.getElementById("work-aston");

    // Aston has no achievements, so that column is not rendered at all.
    expect(within(aston).getByText("Responsibilities")).toBeInTheDocument();
    expect(within(aston).queryByText("Achievements")).not.toBeInTheDocument();
  });

  it("shows the total experience", () => {
    renderWithLanguage(<Work />);

    expect(screen.getByText("Work experience")).toBeInTheDocument();
    expect(screen.getByText("more than 5 years")).toBeInTheDocument();
  });

  it("connects each row to the panel it controls", () => {
    renderWithLanguage(<Work />);

    rows.forEach((row) => {
      expect(entry(row.company)).toHaveAttribute("aria-controls", `work-${row.id}`);
    });
  });
});
