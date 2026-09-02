# Anton Holub — portfolio

Personal portfolio site of a frontend developer. Built with React 19 + Vite,
styled with CSS Modules, bilingual (EN default, RU) with a full-screen loader
that covers the relayout while the language switches.

## Stack

- React 19, Vite 8
- CSS Modules, custom properties for the palette
- No UI library, no CSS framework — hand-written components

## Structure

```
src/
├── main.jsx                  entry point, wraps the app in LanguageProvider
├── App.jsx                   page frame and section order
├── styles/global.css         palette tokens and base styles
├── i18n/
│   ├── translations.js       all copy for both languages, projects, work history, links
│   └── LanguageContext.jsx   language state and the switch delay behind the loader
├── assets/                   hero background, portrait, project shots (webp)
└── components/               Header, Hero, Projects, About, Work, Contacts, Loader, Icons
    └── <Name>/<Name>.jsx + <Name>.module.css
```

The palette is sampled from the hero photograph: the sky at its top edge is the
section background, the sun is the accent colour.

## Testing

Unit and component tests run in Vitest with Testing Library and jsdom; the
end-to-end scenarios run in Cypress against the dev server.

```bash
npm test         # 58 unit and component tests
npm run e2e      # starts the dev server, runs 21 Cypress scenarios headlessly
npm run e2e:open # same, in the interactive Cypress runner
```

What is covered:

- `src/i18n/translations.test.js` — both locales stay structurally identical, no
  empty strings, every project card carries a link or an NDA lock but never
  both, social links are real https URLs.
- `src/i18n/LanguageContext.test.jsx` — the language hook: the copy only swaps
  behind the loader, repeated and concurrent switches are ignored, the choice
  lands on `<html lang>`, every consumer sees the same language.
- Component tests for the header, hero, work accordion and project carousel —
  including the NDA cards rendering a disabled button instead of a link.
- `cypress/e2e/portfolio.cy.js` — user journeys: first visit, jumping between
  sections, switching language and back, reading the work history, walking the
  project carousel, checking outbound links, and the phone layout. Every
  scenario also fails if the page logs a console error.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```
