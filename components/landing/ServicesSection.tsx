import { getTranslations } from "next-intl/server";

import SectionHeading from "./SectionHeading";
import styles from "./landing.module.css";

export default async function ServicesSection() {
  const t = await getTranslations("landing");

  return (
    <section id="servicios" className={`${styles.section} ${styles.sectionDark}`}>
      <div className={styles.sectionInner}>
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          description={t("services.description")}
        />

        <div className={styles.cards4} aria-label="Services">
          {[1, 2, 3, 4].map((n) => {
            const key = n.toString().padStart(2, "0");
            return (
              <article key={n} className={styles.serviceCard}>
                <div className={styles.serviceNumber}>
                  {t(`services.cards.card${key}.number`)}
                </div>
                <div className={styles.serviceCardTitle}>
                  {t(`services.cards.card${key}.title`)}
                </div>
                <div className={styles.serviceCardDesc}>
                  {t(`services.cards.card${key}.description`)}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.servicesPillars} aria-label="Especializacion, Cobertura y Enfoque">
          <div className={styles.servicesPillar}>
            <div className={styles.pillarLabel}>{t("hero.pillars.pillar1.label")}</div>
            <div className={styles.pillarText}>{t("hero.pillars.pillar1.text")}</div>
          </div>
          <div className={styles.servicesPillar}>
            <div className={styles.pillarLabel}>{t("hero.pillars.pillar2.label")}</div>
            <div className={styles.pillarText}>{t("hero.pillars.pillar2.text")}</div>
          </div>
          <div className={styles.servicesPillar}>
            <div className={styles.pillarLabel}>{t("hero.pillars.pillar3.label")}</div>
            <div className={styles.pillarText}>{t("hero.pillars.pillar3.text")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

