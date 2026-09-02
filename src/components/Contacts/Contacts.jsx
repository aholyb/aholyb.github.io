import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { socials } from "../../i18n/translations";
import { socialIcons } from "../Icons/Icons.jsx";
import styles from "./Contacts.module.css";

export default function Contacts() {
  const { t } = useLanguage();

  return (
    <section className={styles.section} id="contacts">
      <div className={styles.head}>
        <span className={styles.label}>{t.contacts.label}</span>

        <div>
          <h2 className={styles.title}>{t.contacts.title}</h2>
          <p className={styles.text}>{t.contacts.text}</p>

          <div className={styles.links}>
            {socials.map((item) => {
              const Icon = socialIcons[item.id];
              return (
                <a
                  key={item.id}
                  className={styles.link}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          {t.name[0]} {t.name[1]} © {new Date().getFullYear()}
        </span>
        <span>{t.footer.rights}</span>
      </div>
    </section>
  );
}
