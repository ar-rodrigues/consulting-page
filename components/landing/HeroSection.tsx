import { getTranslations } from "next-intl/server";

import styles from "./landing.module.css";

export default async function HeroSection() {
  const t = await getTranslations("landing");

  return (
    <section className={styles.hero} aria-label="Hero" id="top">
      <div className={styles.heroGrid} />
      <div className={styles.heroGlow} />

      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div
            className={`${styles.eyebrow} ${styles.fadeUp}`}
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.eyebrow")}
          </div>

          <h1 className={`${styles.heroTitle} ${styles.fadeUp}`} style={{ animationDelay: "0.25s" }}>
            {t("hero.title.line1")}
            <br />
            <span className={styles.heroTitleEm}>{t("hero.title.emphasis")}</span>
            <br />
            {t("hero.title.line3")}
          </h1>

          <p
            className={`${styles.heroSubtitle} ${styles.fadeUp}`}
            style={{ animationDelay: "0.4s" }}
          >
            {t("hero.subtitle")}
          </p>

          <div
            className={`${styles.heroCtas} ${styles.fadeUp}`}
            style={{ animationDelay: "0.55s" }}
          >
            <a href="#servicios" className={styles.btnPrimary}>
              {t("hero.ctaPrimary")}
            </a>
            <a href="#contact" className={styles.btnSecondary}>
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>

        <div className={styles.heroRight} aria-hidden>
          <div className={styles.supportGrid}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>{t("hero.supportCards.card1.label")}</div>
              <div className={styles.cardTitle}>{t("hero.supportCards.card1.title")}</div>
              <div className={styles.cardSub}>{t("hero.supportCards.card1.sub")}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>{t("hero.supportCards.card2.label")}</div>
              <div className={styles.cardTitle}>{t("hero.supportCards.card2.title")}</div>
              <div className={styles.cardSub}>{t("hero.supportCards.card2.sub")}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>{t("hero.supportCards.card3.label")}</div>
              <div className={styles.cardTitle}>{t("hero.supportCards.card3.title")}</div>
              <div className={styles.cardSub}>{t("hero.supportCards.card3.sub")}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>{t("hero.supportCards.card4.label")}</div>
              <div className={styles.cardTitle}>{t("hero.supportCards.card4.title")}</div>
              <div className={styles.cardSub}>{t("hero.supportCards.card4.sub")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

