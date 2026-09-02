import { render } from "@testing-library/react";
import { LanguageProvider } from "../i18n/LanguageContext.jsx";

/**
 * Every component reads its copy from the language context, so tests render
 * through the provider instead of stubbing the translations.
 */
export function renderWithLanguage(ui, options) {
  return render(ui, { wrapper: LanguageProvider, ...options });
}

export * from "@testing-library/react";
