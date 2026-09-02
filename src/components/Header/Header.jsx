import { useLanguage } from "../../i18n/LanguageContext.jsx";
import styles from "./Header.module.css";

const LANGS = [
  { code: "en", short: "En" },
  { code: "ru", short: "Ru" },
];

export default function Header() {
  const { t, lang, changeLanguage } = useLanguage();

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#projects", label: t.nav.projects },
    { href: "#work", label: t.nav.work },
    { href: "#contacts", label: t.nav.contacts },
  ];

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top">
        <span>{t.name[0]}</span>
        <span>{t.name[1]}</span>
      </a>

      <nav className={styles.nav}>
        {links.map((link) => (
          <a key={link.href} className={styles.link} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className={styles.lang}>
        {LANGS.map((item) => (
          <button
            key={item.code}
            type="button"
            className={`${styles.langBtn} ${
              lang === item.code ? styles.langActive : ""
            }`}
            aria-pressed={lang === item.code}
            onClick={() => changeLanguage(item.code)}
          >
            {item.short}
          </button>
        ))}
      </div>
    </header>
  );
}
