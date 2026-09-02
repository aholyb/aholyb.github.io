import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import styles from "./Work.module.css";

export default function Work() {
  const { t } = useLanguage();
  // The current job is the one people look for first, so it starts open.
  const [openId, setOpenId] = useState("alfa");

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section className={styles.section} id="work">
      <h2 className={styles.title}>{t.work.title}</h2>

      <div className={styles.table}>
        {t.work.rows.map((row) => {
          const isOpen = openId === row.id;

          return (
            <article
              key={row.id}
              className={`${styles.entry} ${isOpen ? styles.entryOpen : ""}`}
            >
              <button
                type="button"
                className={styles.row}
                onClick={() => toggle(row.id)}
                aria-expanded={isOpen}
                aria-controls={`work-${row.id}`}
              >
                <span className={styles.period}>
                  {row.period}
                  <span className={styles.duration}>{row.duration}</span>
                </span>
                <span className={styles.company}>{row.company}</span>
                <span className={styles.role}>
                  {row.role}
                  <span className={styles.sep}>|</span>
                  {row.stack}
                </span>
                <span className={styles.toggle} aria-hidden="true">
                  <span className={styles.toggleLabel}>
                    {isOpen ? t.work.collapse : t.work.expand}
                  </span>
                  <span className={styles.chevron} />
                </span>
              </button>

              <div
                className={styles.panel}
                id={`work-${row.id}`}
                hidden={!isOpen}
              >
                <div className={styles.panelInner}>
                  {row.summary && <p className={styles.summary}>{row.summary}</p>}

                  <div className={styles.details}>
                    <div className={styles.detailsGroup}>
                      <h4 className={styles.detailsTitle}>
                        {t.work.responsibilities}
                      </h4>
                      <ul className={styles.list}>
                        {row.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {row.achievements.length > 0 && (
                      <div className={styles.detailsGroup}>
                        <h4 className={styles.detailsTitle}>
                          {t.work.achievements}
                        </h4>
                        <ul className={`${styles.list} ${styles.listAccent}`}>
                          {row.achievements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className={styles.total}>
        {t.work.totalLabel}
        <span className={styles.totalValue}>{t.work.total}</span>
      </p>
    </section>
  );
}
