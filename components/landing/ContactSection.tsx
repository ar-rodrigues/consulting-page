import { getTranslations } from "next-intl/server";

import ContactForm from "./ContactForm";
import styles from "./landing.module.css";

export default async function ContactSection() {
  const t = await getTranslations("landing");

  return (
    <section id="contacto" className={`${styles.section} ${styles.sectionBlack}`}>
      <div className={styles.sectionInner}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfoCard}>
            <div className={styles.eyebrow}>{t("contact.eyebrow")}</div>
            <div className={styles.contactTitle}>{t("contact.title")}</div>
            <div className={styles.contactDesc}>{t("contact.description")}</div>
          </div>

          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

