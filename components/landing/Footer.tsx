import { getTranslations } from "next-intl/server";

import LanguageSwitcher from "./LanguageSwitcher";

import styles from "./landing.module.css";

export default async function Footer() {
  const t = await getTranslations("landing");

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">
            <span className={styles.brandAcronym}>AGIL</span>
            <span className={styles.brandDot}>·</span>
          </span>
          <span className={styles.brandText}>{t("footer.brand")}</span>
        </div>

        <div className={styles.footerColRight}>
          <LanguageSwitcher />
          <div>{t("footer.rightLine")}</div>
        </div>
      </div>
    </footer>
  );
}
