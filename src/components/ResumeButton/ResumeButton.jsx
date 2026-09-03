import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { DownloadIcon } from "../Icons/Icons.jsx";
import styles from "./ResumeButton.module.css";

/**
 * Downloads the CV in the language the site is currently showing.
 * The files live in public/, so the URL has to carry Vite's base path.
 */
export default function ResumeButton() {
  const { t } = useLanguage();
  const href = `${import.meta.env.BASE_URL}resume/${t.resume.file}`;

  return (
    <a className={styles.button} href={href} download={t.resume.file}>
      <DownloadIcon />
      {t.resume.label}
    </a>
  );
}
