import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext.jsx";

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>;

// The provider changes the language halfway through the loader, so the two
// halves of the delay are stepped through explicitly.
const HALF_DELAY = 350;

describe("useLanguage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("throws when used outside the provider", () => {
    // React logs the thrown error; silence it so the run stays readable.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    function Orphan() {
      useLanguage();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(
      /useLanguage must be used inside LanguageProvider/
    );

    spy.mockRestore();
  });

  it("starts in English and is not switching", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.lang).toBe("en");
    expect(result.current.isSwitching).toBe(false);
    expect(result.current.t.nav.about).toBe("About");
  });

  it("holds the old copy while the loader is up, then swaps it", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.changeLanguage("ru"));

    // Loader is up immediately, but the copy has not moved yet — that is the
    // whole point of the delay.
    expect(result.current.isSwitching).toBe(true);
    expect(result.current.lang).toBe("en");

    act(() => vi.advanceTimersByTime(HALF_DELAY));
    expect(result.current.lang).toBe("ru");
    expect(result.current.t.nav.about).toBe("Обо мне");
    expect(result.current.isSwitching).toBe(true);

    act(() => vi.advanceTimersByTime(HALF_DELAY));
    expect(result.current.isSwitching).toBe(false);
  });

  it("reflects the language on the document element", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.changeLanguage("ru"));
    act(() => vi.advanceTimersByTime(HALF_DELAY * 2));

    expect(document.documentElement.lang).toBe("ru");
  });

  it("ignores a switch to the language already active", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.changeLanguage("en"));

    expect(result.current.isSwitching).toBe(false);
  });

  it("ignores a second switch while one is in flight", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.changeLanguage("ru"));
    act(() => result.current.changeLanguage("en"));
    act(() => vi.advanceTimersByTime(HALF_DELAY * 2));

    expect(result.current.lang).toBe("ru");
    expect(result.current.isSwitching).toBe(false);
  });

  it("switches back to English", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => result.current.changeLanguage("ru"));
    act(() => vi.advanceTimersByTime(HALF_DELAY * 2));
    act(() => result.current.changeLanguage("en"));
    act(() => vi.advanceTimersByTime(HALF_DELAY * 2));

    expect(result.current.lang).toBe("en");
    expect(result.current.t.nav.about).toBe("About");
  });

  it("shares one language across every consumer", () => {
    function Consumer({ name }) {
      const { t } = useLanguage();
      return <span data-testid={name}>{t.nav.work}</span>;
    }

    function Switcher() {
      const { changeLanguage } = useLanguage();
      return (
        <button type="button" onClick={() => changeLanguage("ru")}>
          switch
        </button>
      );
    }

    render(
      <LanguageProvider>
        <Consumer name="one" />
        <Consumer name="two" />
        <Switcher />
      </LanguageProvider>
    );

    act(() => screen.getByRole("button", { name: "switch" }).click());
    act(() => vi.advanceTimersByTime(HALF_DELAY * 2));

    expect(screen.getByTestId("one")).toHaveTextContent("Опыт");
    expect(screen.getByTestId("two")).toHaveTextContent("Опыт");
  });
});
