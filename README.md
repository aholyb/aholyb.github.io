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

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```
