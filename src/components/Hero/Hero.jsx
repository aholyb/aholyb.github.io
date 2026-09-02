import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { socials } from "../../i18n/translations";
import { ArrowIcon, socialIcons } from "../Icons/Icons.jsx";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useLanguage();
  const [goalStart, goalStrongOne, goalMid, goalStrongTwo, goalEnd] =
    t.hero.goal;

  return (
    <section className={styles.hero} id="top">
      <div className={styles.titleRow}>
        <h1 className={styles.titleTop}>{t.hero.titleTop}</h1>

        <a className={styles.cta} href="#projects">
          <span className={styles.ctaPill}>{t.hero.cta}</span>
          <span className={styles.ctaCircle}>
            <ArrowIcon />
          </span>
        </a>

        <p className={styles.titleBottom}>{t.hero.titleBottom}</p>
      </div>

      <p className={styles.goal}>
        {goalStart}
        <em>{goalStrongOne}</em>
        {goalMid}
        <em>{goalStrongTwo}</em>
        {goalEnd}
      </p>

      <div className={styles.socials}>
        {socials.map((item) => {
          const Icon = socialIcons[item.id];
          return (
            <a
              key={item.id}
              className={styles.social}
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
    </section>
  );
}
