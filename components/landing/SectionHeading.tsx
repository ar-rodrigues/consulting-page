import styles from "./landing.module.css";

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <div className={styles.h2}>{title}</div>
      {description ? <div className={styles.p}>{description}</div> : null}
    </div>
  );
}

