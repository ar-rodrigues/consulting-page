import { Boxes, DoorOpen, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import styles from "./landing.module.css";

export default async function TechnologySection() {
  const t = await getTranslations("landing");

  const cards = [
    { key: "01", Icon: DoorOpen },
    { key: "02", Icon: Users },
    { key: "03", Icon: Boxes },
  ] as const;

  return (
    <section id="tecnologia" className={`${styles.section} ${styles.sectionBlack}`}>
      <div className={styles.sectionInner}>
        <div className={styles.techHeaderGrid}>
          <div>
            <div className={styles.eyebrow}>{t("technology.eyebrow")}</div>
            <div className={styles.h2}>{t("technology.title")}</div>
            <div className={styles.p}>{t("technology.description")}</div>
          </div>

          <div className={styles.quote}>{t("technology.quote")}</div>
        </div>

        <div className={styles.cards3} aria-label="Technology">
          {cards.map(({ key, Icon }) => (
            <article key={key} className={styles.techCard}>
              <div className={styles.techIconWrap}>
                <Icon size={24} color="currentColor" />
              </div>
              <div className={styles.techCardTitle}>
                {t(`technology.cards.card${key}.title`)}
              </div>
              <div className={styles.techCardDesc}>
                {t(`technology.cards.card${key}.description`)}
              </div>
              <div className={styles.techCardScenario}>
                {t(`technology.cards.card${key}.scenario`)}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.moduleNote}>{t("technology.modularNote")}</div>
      </div>
    </section>
  );
}

