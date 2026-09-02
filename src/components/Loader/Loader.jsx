import styles from "./Loader.module.css";

export default function Loader({ label }) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
