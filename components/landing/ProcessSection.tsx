import { getTranslations } from "next-intl/server";

import styles from "./landing.module.css";

export default async function ProcessSection() {
  const t = await getTranslations("landing");

  const phases = ["01", "02", "03", "04"] as const;

  return (
    <section id="proceso" className={`${styles.section} ${styles.sectionDark}`}>
      <div className={styles.sectionInner}>
        <div className={styles.processGrid}>
          <aside className={styles.processStickyCard}>
            <div className={styles.eyebrow}>{t("process.eyebrow")}</div>
            <div className={styles.processStickyTitle}>
              {t("process.leftCard.title")}
            </div>
            <div className={styles.processStickyDesc}>
              {t("process.leftCard.description")}
            </div>
            <a href="#contact" className={styles.processStickyBtn}>
              {t("process.leftCard.cta")}
            </a>
          </aside>

          <div className={styles.phasesGrid} aria-label="Process phases">
            {phases.map((key) => (
              <article key={key} className={styles.phaseCard}>
                <div className={styles.phaseNumber}>{key}</div>
                <div className={styles.phaseTitle}>
                  {t(`process.phases.card${key}.title`)}
                </div>
                <div className={styles.phaseDesc}>
                  {t(`process.phases.card${key}.description`)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

