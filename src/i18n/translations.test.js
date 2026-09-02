import { describe, expect, it } from "vitest";
import { socials, translations } from "./translations";

const LOCALES = ["en", "ru"];

/**
 * Describes an object by its keys and value types, recursively. Two locales
 * with the same shape must produce the same signature — that is what keeps a
 * component from reading `t.work.expand` and finding `undefined` in Russian.
 */
function shapeOf(value) {
  if (Array.isArray(value)) {
    return { type: "array", length: value.length, items: value.map(shapeOf) };
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: shapeOf(value[key]) }), {});
  }
  return typeof value;
}

describe("translations", () => {
  it("exposes exactly the supported locales", () => {
    expect(Object.keys(translations).sort()).toEqual(LOCALES);
  });

  it("keeps both locales structurally identical", () => {
    expect(shapeOf(translations.ru)).toEqual(shapeOf(translations.en));
  });

  it.each(LOCALES)("has no empty strings in %s", (locale) => {
    const empties = [];

    const walk = (value, path) => {
      if (typeof value === "string") {
        if (!value.trim()) empties.push(path);
        return;
      }
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([key, child]) =>
          walk(child, `${path}.${key}`)
        );
      }
    };

    walk(translations[locale], locale);
    expect(empties).toEqual([]);
  });

  describe("hero", () => {
    it.each(LOCALES)("splits the %s goal into the 5 rendered parts", (locale) => {
      // Hero destructures exactly five fragments to wrap two of them in <em>.
      expect(translations[locale].hero.goal).toHaveLength(5);
    });
  });

  describe("about", () => {
    it.each(LOCALES)("splits the %s intro into the 5 rendered parts", (locale) => {
      expect(translations[locale].about.intro).toHaveLength(5);
    });

    it.each(LOCALES)("splits the %s footnote into 3 parts", (locale) => {
      expect(translations[locale].about.footnote).toHaveLength(3);
    });

    it.each(LOCALES)("lists non-empty stacks in %s", (locale) => {
      const { stacks } = translations[locale].about;
      expect(stacks.length).toBeGreaterThan(0);
      stacks.forEach((stack) => {
        expect(stack.title).toBeTruthy();
        expect(stack.items.length).toBeGreaterThan(0);
      });
    });
  });

  describe("projects", () => {
    it("keeps the same items in the same order across locales", () => {
      const ids = (locale) => translations[locale].projects.items.map((i) => i.id);
      expect(ids("ru")).toEqual(ids("en"));
    });

    it.each(LOCALES)("gives every %s card a link or an NDA lock, never both", (locale) => {
      translations[locale].projects.items.forEach((item) => {
        const hasLink = Boolean(item.href);
        const isLocked = Boolean(item.nda);
        expect(hasLink !== isLocked).toBe(true);
      });
    });

    it.each(LOCALES)("only links out over https in %s", (locale) => {
      translations[locale].projects.items
        .filter((item) => item.href)
        .forEach((item) => {
          expect(item.href).toMatch(/^https:\/\//);
        });
    });

    it("points the public cards at the expected sites", () => {
      const byId = Object.fromEntries(
        translations.en.projects.items.map((item) => [item.id, item])
      );

      expect(byId.levada.href).toBe("https://levada-b-h.by/");
      expect(byId.armtek.href).toBe("https://armtek.by/");
      expect(byId.arkmetall.href).toBe(
        "https://askerweb.by/portfolio/arkmetal/"
      );
      expect(byId.sberoffice.nda).toBe(true);
      expect(byId.alfa.nda).toBe(true);
    });
  });

  describe("work", () => {
    it("keeps the same entries in the same order across locales", () => {
      const ids = (locale) => translations[locale].work.rows.map((r) => r.id);
      expect(ids("ru")).toEqual(ids("en"));
      expect(new Set(ids("en")).size).toBe(ids("en").length);
    });

    it("starts with the current job", () => {
      expect(translations.en.work.rows[0].id).toBe("alfa");
    });

    it.each(LOCALES)("describes every %s entry", (locale) => {
      translations[locale].work.rows.forEach((row) => {
        expect(row.period).toBeTruthy();
        expect(row.company).toBeTruthy();
        expect(row.role).toBeTruthy();
        expect(row.stack).toBeTruthy();
        expect(row.summary).toBeTruthy();
        expect(row.responsibilities.length).toBeGreaterThan(0);
        expect(Array.isArray(row.achievements)).toBe(true);
      });
    });
  });
});

describe("socials", () => {
  it("has no placeholder links left", () => {
    socials.forEach((item) => {
      expect(item.href).toMatch(/^https:\/\//);
      expect(item.label).toBeTruthy();
    });
  });

  it("opens Telegram as a direct chat", () => {
    const telegram = socials.find((item) => item.id === "telegram");
    expect(telegram.href).toBe("https://t.me/gggoluba");
  });

  it("covers every network the icons are drawn for", () => {
    expect(socials.map((item) => item.id)).toEqual([
      "github",
      "linkedin",
      "telegram",
      "instagram",
    ]);
  });
});
