import { useLanguage } from "../../i18n/LanguageContext.jsx";
import photo from "../../assets/photo.webp";
import styles from "./About.module.css";

export default function About() {
  const { t } = useLanguage();
  const [introStart, introRole, introMid, introYears, introEnd] = t.about.intro;
  const [noteStart, noteStrong, noteEnd] = t.about.footnote;

  return (
    <section className={styles.section} id="about">
      <div className={styles.head}>
        <span className={styles.label}>{t.about.label}</span>
        <p className={styles.intro}>
          {introStart}
          <em>{introRole}</em>
          {introMid}
          <em>{introYears}</em>
          {introEnd}
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.stacks}>
          {t.about.stacks.map((stack) => (
            <article key={stack.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{stack.title}</h3>
              <p className={styles.items}>
                {stack.items.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className={styles.divider}> / </span>}
                    {item}
                  </span>
                ))}
              </p>
            </article>
          ))}

          <p className={styles.footnote}>
            {noteStart}
            <em>{noteStrong}</em>
            {noteEnd}
          </p>
        </div>

        <div className={styles.photoWrap}>
          <img className={styles.photo} src={photo} alt={t.about.photoAlt} />
        </div>
      </div>
    </section>
  );
}
