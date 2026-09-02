import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { ArrowIcon } from "../Icons/Icons.jsx";
import levada from "../../assets/project-levada.webp";
import armtek from "../../assets/project-armtek.webp";
import arkmetall from "../../assets/project-arkmetall.webp";
import styles from "./Projects.module.css";

const shots = { levada, armtek, arkmetall };

export default function Projects() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const items = t.projects.items;

  const move = (step) =>
    setIndex((current) =>
      Math.min(Math.max(current + step, 0), items.length - 1)
    );

  return (
    <section className={styles.section} id="projects">
      <div className={styles.head}>
        <span className={styles.label}>{t.projects.label}</span>
        <p className={styles.note}>{t.projects.note}</p>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} style={{ "--i": index }}>
          {items.map((item, i) => {
            const shot = shots[item.id];

            return (
              <article
                key={item.id}
                className={`${styles.card} ${
                  i === index ? styles.cardActive : ""
                }`}
                aria-hidden={i !== index}
              >
                {shot ? (
                  <img
                    className={styles.shot}
                    src={shot}
                    alt={item.title}
                    loading="lazy"
                  />
                ) : (
                  <div className={`${styles.thumb} ${styles[item.id] ?? ""}`} />
                )}

                <div className={styles.body}>
                  <span className={styles.tag}>{item.tag}</span>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.text}>{item.text}</p>

                  {item.href ? (
                    <a
                      className={styles.more}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={i === index ? 0 : -1}
                    >
                      <span className={styles.morePill}>
                        {t.projects.readMore}
                      </span>
                      <span className={styles.moreCircle}>
                        <ArrowIcon direction="upRight" />
                      </span>
                    </a>
                  ) : (
                    <span className={styles.more}>
                      <button
                        type="button"
                        className={styles.lockedPill}
                        disabled
                        title={t.projects.note}
                      >
                        {t.projects.locked}
                      </button>
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => move(-1)}
          disabled={index === 0}
          aria-label="Previous"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => move(1)}
          disabled={index === items.length - 1}
          aria-label="Next"
        >
          <ArrowIcon />
        </button>
      </div>
    </section>
  );
}
