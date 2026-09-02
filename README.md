# Anton Holub — portfolio

A single-page portfolio site for a frontend developer. React 19 + Vite, styled
with CSS Modules, no UI kit and no CSS framework — every component is written by
hand.

[Русская версия ниже ↓](#портфолио--антон-голуб)

## What is inside

- **Two languages.** English by default, Russian behind a toggle in the header.
  All copy lives in one file and is swapped through React context.
- **A loader instead of a jump.** Russian and English strings differ in length,
  so switching the language would visibly reflow the page. The switch is covered
  by a full-screen white loader with a black spinner, and the copy changes
  behind it, halfway through the animation.
- **A palette taken from the photograph.** The hero image is sampled: the sky at
  its top edge (`#838383`) is the section background, the sun (`#f4632a`) is the
  accent colour. That is why the picture melts into the page instead of sitting
  on it as a rectangle.
- **Work history as an accordion.** Four employers; the current job is expanded
  on load, and each entry opens responsibilities and achievements.
- **Projects as a carousel.** Public work links out to the live sites; the bank
  products are under NDA and render a disabled `NDA` button instead of a link.
- **Responsive.** On a phone the navigation collapses, the portrait becomes a
  small card at the top of the About section instead of taking over the screen,
  and nothing scrolls sideways.

## Stack

| | |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Styles | CSS Modules, custom properties for the palette |
| Unit tests | Vitest, Testing Library, jsdom |
| E2E | Cypress |
| CI | GitHub Actions |

## Getting started

Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
```

Other commands:

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Testing

```bash
npm test          # unit and component tests, ~2s
npm run test:watch # the same suite in watch mode
npm run test:ui   # Vitest browser UI
npm run e2e       # boots the dev server and runs Cypress headlessly
npm run e2e:open  # the same, in the interactive Cypress runner
```

58 unit and component tests, 21 end-to-end scenarios.

**Unit and component** — `src/**/*.test.{js,jsx}`:

- `i18n/translations.test.js` — the data itself. Both locales are compared by
  structural signature, so a key added in English and forgotten in Russian fails
  the suite instead of rendering `undefined` in production. It also checks that
  no string is empty, that every project card carries either a link or an NDA
  lock but never both, and that the social links are real https URLs.
- `i18n/LanguageContext.test.jsx` — the language hook on fake timers: the copy
  only swaps while the loader covers the page, a switch to the active language
  is ignored, a second switch during an in-flight one is ignored, the choice
  lands on `<html lang>`, and every consumer sees the same language.
- Component tests for the header, hero, work accordion and project carousel —
  including the rules that are easy to break by accident: NDA cards must render
  a disabled button rather than a link, off-screen carousel cards stay out of
  the tab order, and only one work entry is open at a time.

**End-to-end** — `cypress/e2e/portfolio.cy.js`, written as user journeys: the
first visit, jumping between sections from the header, switching language and
back, reading the work history, walking the carousel to its last card, checking
that outbound links open in a new tab with `rel="noreferrer"`, and the phone
layout. Every scenario also fails if the page writes to `console.error`.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request:

| Job | What it does |
|---|---|
| `install` | `npm ci`, then caches `node_modules` and the Cypress binary by lockfile hash |
| `lint` | `npm run lint` |
| `jest` | `npm test` — Vitest driven with the Jest API |
| `e2e` | `npm run e2e` — dev server plus headless Cypress |
| `build` | `npm run build`, uploads `dist/` as an artifact |
| `push` | publishes the artifact to GitHub Pages — only on `main` |

`lint`, `jest` and `e2e` run in parallel after `install`; `build` waits for all
three; `push` waits for `build`.

To use GitHub Pages, enable it once in **Settings → Pages → Source: GitHub
Actions**. The build sets `VITE_BASE=/<repo>/` so assets resolve on a project
page. If the site is hosted elsewhere (Vercel, Netlify), drop the `push` job —
those platforms build the repository themselves and serve it from the root, and
`vite.config.js` falls back to `base: '/'` when `VITE_BASE` is not set.

## Structure

```
src/
├── main.jsx                  entry point, wraps the app in LanguageProvider
├── App.jsx                   page frame and section order
├── styles/global.css         palette tokens and base styles
├── i18n/
│   ├── translations.js       all copy for both languages, projects, work history, links
│   └── LanguageContext.jsx   language state and the switch delay behind the loader
├── test/                     Vitest setup and the render-with-provider helper
├── assets/                   hero background, portrait, project shots (webp)
└── components/               Header, Hero, Projects, About, Work, Contacts, Loader, Icons
    └── <Name>/<Name>.jsx + <Name>.module.css + <Name>.test.jsx
```

Where to edit what:

- **Copy, projects, work history, social links** — `src/i18n/translations.js`,
  one file for both languages. Keep the two locales in the same shape; the test
  suite enforces it.
- **Colours** — the custom properties at the top of `src/styles/global.css`.
- **Images** — `src/assets/`. They are imported by name in components, so either
  keep the filename or update the import.

---

# Портфолио — Антон Голуб

Одностраничный сайт-портфолио фронтенд-разработчика. React 19 + Vite, стили на
CSS Modules, без UI-китов и CSS-фреймворков — все компоненты написаны руками.

[English version above ↑](#anton-holub--portfolio)

## Что внутри

- **Два языка.** Английский по умолчанию, русский — по тоглу в шапке. Весь текст
  лежит в одном файле и переключается через React-контекст.
- **Лоудер вместо прыжка.** Русские и английские строки разной длины, поэтому
  при переключении вёрстка бы заметно дёргалась. Переключение закрыто
  полноэкранным белым лоудером с чёрным спиннером, а текст меняется за ним, на
  середине анимации.
- **Палитра взята из фотографии.** Фон героя просэмплирован: небо у верхней
  кромки (`#838383`) стало фоном секций, солнце (`#f4632a`) — акцентом. Поэтому
  картинка растворяется в странице, а не лежит на ней прямоугольником.
- **Опыт работы аккордеоном.** Четыре места; текущее раскрыто сразу, каждая
  запись разворачивает обязанности и достижения.
- **Проекты каруселью.** Публичные работы ведут на живые сайты; банковские
  продукты под NDA и вместо ссылки показывают заблокированную кнопку `NDA`.
- **Адаптивность.** На телефоне навигация скрывается, портрет становится
  небольшой карточкой в начале секции «Обо мне» вместо экрана во всю высоту,
  горизонтального скролла нет.

## Стек

| | |
|---|---|
| UI | React 19 |
| Сборка | Vite 8 |
| Стили | CSS Modules, CSS-переменные для палитры |
| Юнит-тесты | Vitest, Testing Library, jsdom |
| E2E | Cypress |
| CI | GitHub Actions |

## Запуск

Нужен Node.js 20 или новее.

```bash
npm install
npm run dev      # http://localhost:5173
```

Остальные команды:

```bash
npm run build    # продакшен-сборка в dist/
npm run preview  # локально отдать собранный проект
npm run lint     # oxlint
```

## Тесты

```bash
npm test           # юнит- и компонентные тесты, ~2с
npm run test:watch # то же самое в watch-режиме
npm run test:ui    # браузерный интерфейс Vitest
npm run e2e        # поднимает дев-сервер и гоняет Cypress headless
npm run e2e:open   # то же самое в интерактивном раннере Cypress
```

58 юнит- и компонентных тестов, 21 e2e-сценарий.

**Юнит и компоненты** — `src/**/*.test.{js,jsx}`:

- `i18n/translations.test.js` — сами данные. Локали сравниваются по структурной
  сигнатуре: ключ, добавленный в английский и забытый в русском, роняет тесты,
  а не выводит `undefined` на проде. Плюс проверки, что нет пустых строк, что у
  каждой карточки проекта есть либо ссылка, либо NDA-замок (но не оба), и что
  ссылки на соцсети — настоящие https-адреса.
- `i18n/LanguageContext.test.jsx` — языковой хук на фейковых таймерах: текст
  меняется только пока лоудер закрывает экран, переключение на активный язык
  игнорируется, второе переключение во время первого игнорируется, выбор
  проставляется в `<html lang>`, все потребители контекста видят один язык.
- Компонентные тесты шапки, героя, аккордеона с опытом и карусели проектов —
  включая правила, которые легко сломать по неосторожности: NDA-карточка обязана
  рендерить заблокированную кнопку, а не ссылку; карточки вне экрана не должны
  попадать в таб-порядок; открытой может быть только одна запись об опыте.

**E2E** — `cypress/e2e/portfolio.cy.js`, написаны как пользовательские
сценарии: первый заход, переходы по разделам из шапки, переключение языка туда и
обратно, чтение опыта работы, прокрутка карусели до последней карточки, проверка
что внешние ссылки открываются в новой вкладке с `rel="noreferrer"`, и мобильная
раскладка. Каждый сценарий дополнительно падает, если страница что-то написала в
`console.error`.

## Непрерывная интеграция

`.github/workflows/ci.yml` запускается на каждый push и pull request:

| Джоба | Что делает |
|---|---|
| `install` | `npm ci`, кеширует `node_modules` и бинарник Cypress по хешу лок-файла |
| `lint` | `npm run lint` |
| `jest` | `npm test` — Vitest с Jest-совместимым API |
| `e2e` | `npm run e2e` — дев-сервер и Cypress в headless-режиме |
| `build` | `npm run build`, кладёт `dist/` в артефакты |
| `push` | публикует артефакт на GitHub Pages — только для `main` |

`lint`, `jest` и `e2e` идут параллельно после `install`; `build` ждёт все три;
`push` ждёт `build`.

Чтобы заработал GitHub Pages, его нужно один раз включить в **Settings → Pages →
Source: GitHub Actions**. Сборка выставляет `VITE_BASE=/<repo>/`, чтобы пути к
ассетам сходились на project-странице. Если сайт живёт на другом хостинге
(Vercel, Netlify) — джобу `push` можно удалить: эти платформы собирают
репозиторий сами и отдают его из корня, а `vite.config.js` без `VITE_BASE`
падает обратно на `base: '/'`.

## Структура

```
src/
├── main.jsx                  точка входа, оборачивает приложение в LanguageProvider
├── App.jsx                   рамка страницы и порядок секций
├── styles/global.css         токены палитры и базовые стили
├── i18n/
│   ├── translations.js       весь текст обоих языков, проекты, опыт, ссылки
│   └── LanguageContext.jsx   состояние языка и задержка переключения под лоудер
├── test/                     настройка Vitest и хелпер рендера с провайдером
├── assets/                   фон героя, портрет, скриншоты проектов (webp)
└── components/               Header, Hero, Projects, About, Work, Contacts, Loader, Icons
    └── <Name>/<Name>.jsx + <Name>.module.css + <Name>.test.jsx
```

Что где править:

- **Тексты, проекты, опыт работы, ссылки на соцсети** —
  `src/i18n/translations.js`, один файл на оба языка. Локали нужно держать
  одинаковой формы, это проверяется тестами.
- **Цвета** — CSS-переменные в начале `src/styles/global.css`.
- **Картинки** — `src/assets/`. Они импортируются по имени в компонентах, так что
  либо сохраняйте имя файла, либо правьте импорт.
