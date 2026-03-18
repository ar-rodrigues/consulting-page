import styles from "./landing.module.css";

export default function EyebrowTag({ text }: { text: string }) {
  return <div className={styles.eyebrow}>{text}</div>;
}

