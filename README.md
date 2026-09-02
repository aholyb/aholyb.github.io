# aholyb.github.io

Моё портфолио: [aholyb.github.io](https://aholyb.github.io). React 19, Vite,
стили на CSS Modules, без UI-китов.

[English below](#english)

Сайт двуязычный, по умолчанию английский. При переключении меняется сразу много
текста, и страница заметно перекладывалась бы прямо на глазах, поэтому смена
языка спрятана за белым лоудером: он закрывает экран примерно на полсекунды, а
текст подменяется под ним.

Цвета взяты из фотографии в шапке. Я вытащил из неё цвет неба у верхней кромки
(`#838383`) под фон секций и цвет солнца (`#f4632a`) под акценты, чтобы картинка
не выглядела приклеенной поверх страницы.

Опыт работы раскрывается аккордеоном, текущее место открыто сразу. Проекты
лежат в карусели: публичные ведут на живые сайты, банковские под NDA и вместо
ссылки показывают неактивную кнопку. На телефоне навигация прячется, а портрет
из полноэкранного становится небольшой карточкой в начале блока «Обо мне».

## Запуск

Нужен Node 20 или новее.

```bash
npm install
npm run dev
```

Дальше по мелочи: `npm run build` собирает в `dist`, `npm run preview` отдаёт
собранное локально, `npm run lint` запускает oxlint.

## Тесты

```bash
npm test      # 58 юнит- и компонентных тестов, пара секунд
npm run e2e   # поднимает дев-сервер и гоняет 21 сценарий в Cypress
```

Если нужно интерактивно, есть `npm run test:watch` и `npm run e2e:open`.

Юнит-тесты лежат рядом с кодом, который проверяют. Самый полезный, наверное, в
`src/i18n/translations.test.js`: он сравнивает структуру двух локалей, так что
если добавить ключ в английский и забыть про русский, упадут тесты, а не текст
на странице превратится в `undefined`. Остальные проверяют языковой хук (текст
меняется только пока лоудер закрывает экран, повторные клики игнорируются) и
компоненты: в аккордеоне открыт максимум один блок, NDA-карточка не должна
рендерить ссылку, карточки за краем экрана не попадают в таб-порядок.

E2E в `cypress/e2e/portfolio.cy.js` проходят по странице как посетитель:
заходят, прыгают по разделам из шапки, переключают язык туда и обратно, читают
опыт работы, листают карусель до конца, проверяют внешние ссылки и мобильную
раскладку. Любой сценарий падает ещё и если страница что-то написала в
`console.error`.

## CI

`.github/workflows/ci.yml`, запускается на каждый пуш:

```
install → lint, jest, e2e (параллельно) → build → push
```

`push` деплоит на GitHub Pages и работает только с `main`. Зависимости и
бинарник Cypress кешируются по хешу лок-файла, так что за установку платит
только первая джоба. Джоба называется `jest` для читаемости, гоняет её Vitest,
API там тот же.

Чтобы всё это заработало в новом репозитории, Pages нужно один раз переключить
в Settings на источник «GitHub Actions». Базовый путь для ассетов сборка
подставляет сама: корень для user-сайта вида `<owner>.github.io` и `/<repo>/`
для обычного.

## Что где лежит

```
src/
├── main.jsx                  вход, оборачивает приложение в LanguageProvider
├── App.jsx                   рамка страницы и порядок секций
├── styles/global.css         цвета и базовые стили
├── i18n/
│   ├── translations.js       весь текст обоих языков, проекты, опыт, ссылки
│   └── LanguageContext.jsx   состояние языка и задержка под лоудер
├── test/                     настройка Vitest и рендер с провайдером
├── assets/                   фон шапки, портрет, скриншоты проектов
└── components/               Header, Hero, Projects, About, Work, Contacts, Loader, Icons
```

Каждый компонент лежит своей папкой: `Name.jsx`, `Name.module.css` и рядом
`Name.test.jsx`.

Если нужно что-то поправить: тексты, проекты, опыт и ссылки на соцсети живут в
`src/i18n/translations.js`, один файл на оба языка. Цвета собраны в переменные в
начале `src/styles/global.css`. Картинки в `src/assets`, они импортируются по
имени, так что при замене либо сохраняйте имя файла, либо правьте импорт.

---

## English

My portfolio: [aholyb.github.io](https://aholyb.github.io). React 19, Vite,
CSS Modules, no UI kit.

The site is bilingual, English by default. Switching languages replaces a lot of
text at once and the page would visibly reflow while it does, so the switch
happens behind a white loader: it covers the screen for about half a second and
the copy changes underneath.

The colours come from the photograph in the header. I pulled the sky at its top
edge (`#838383`) for the section background and the sun (`#f4632a`) for accents,
so the image doesn't look pasted on top of the page.

Work history opens as an accordion with the current job expanded on load.
Projects live in a carousel: the public ones link to live sites, the bank ones
are under NDA and show a dead button instead of a link. On a phone the
navigation collapses and the portrait shrinks from full screen to a small card
at the top of the About block.

### Running

Node 20 or newer.

```bash
npm install
npm run dev
```

The rest: `npm run build` builds into `dist`, `npm run preview` serves the
build, `npm run lint` runs oxlint.

### Tests

```bash
npm test      # 58 unit and component tests, a couple of seconds
npm run e2e   # boots the dev server and runs 21 Cypress scenarios
```

There is also `npm run test:watch` and `npm run e2e:open` if you want them
interactive.

Unit tests sit next to the code they cover. The most useful one is probably in
`src/i18n/translations.test.js`: it compares the shape of both locales, so
adding a key in English and forgetting the Russian one fails the tests instead
of putting `undefined` on the page. The others cover the language hook (copy
only changes while the loader is up, repeated clicks are ignored) and the
components: at most one accordion entry stays open, an NDA card must not render
a link, cards off the edge of the screen stay out of the tab order.

The e2e specs in `cypress/e2e/portfolio.cy.js` walk the page like a visitor:
land on it, jump between sections from the header, switch language and back,
read the work history, page through the carousel, check outbound links and the
mobile layout. Every scenario also fails if the page writes to `console.error`.

### CI

`.github/workflows/ci.yml` runs on every push:

```
install → lint, jest, e2e (in parallel) → build → push
```

`push` deploys to GitHub Pages and only runs on `main`. Dependencies and the
Cypress binary are cached by lockfile hash, so only the first job pays for the
install. The job is named `jest` for readability; Vitest runs it, the API is the
same.

To set this up in a new repository, switch Pages to the "GitHub Actions" source
once in Settings. The build works out the asset base itself: the root for a
`<owner>.github.io` user site, `/<repo>/` for a regular one.

### Layout

```
src/
├── main.jsx                  entry point, wraps the app in LanguageProvider
├── App.jsx                   page frame and section order
├── styles/global.css         colours and base styles
├── i18n/
│   ├── translations.js       all copy for both languages, projects, work history, links
│   └── LanguageContext.jsx   language state and the delay behind the loader
├── test/                     Vitest setup and the render-with-provider helper
├── assets/                   header background, portrait, project shots
└── components/               Header, Hero, Projects, About, Work, Contacts, Loader, Icons
```

Every component gets its own folder: `Name.jsx`, `Name.module.css` and
`Name.test.jsx` next to them.

To change things: copy, projects, work history and social links are in
`src/i18n/translations.js`, one file for both languages. Colours are the
variables at the top of `src/styles/global.css`. Images are in `src/assets` and
imported by name, so either keep the filename or update the import.
