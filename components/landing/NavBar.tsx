"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import styles from "./landing.module.css";

type ActiveSection = "servicios" | "tecnologia" | "proceso" | "equipo" | null;

export default function NavBar() {
  const t = useTranslations("landing");
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const ids = ["servicios", "tecnologia", "proceso", "equipo"] as const;

    /** Pixels from viewport top; align with fixed nav (~56px) + small margin */
    const sectionActivationY = 72;

    const computeActiveFromScroll = () => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        const contactTop = contactEl.getBoundingClientRect().top;
        if (contactTop <= sectionActivationY) {
          setActiveSection(null);
          return;
        }
      }

      // Last section (in page order) whose top has crossed the activation line.
      let nextActive: ActiveSection = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= sectionActivationY) {
          nextActive = id;
        }
      }

      setActiveSection(nextActive);
    };

    const setFromHash = () => {
      const rawHash = window.location.hash.replace("#", "");
      if (rawHash === "contact") {
        setActiveSection(null);
        return;
      }
      if (ids.includes(rawHash as (typeof ids)[number])) {
        setActiveSection(rawHash as ActiveSection);
      }
    };

    if (window.location.hash) setFromHash();

    let raf = 0;
    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        computeActiveFromScroll();
      });
    };

    const onHashChange = () => {
      setFromHash();
      window.requestAnimationFrame(() => {
        computeActiveFromScroll();
      });
    };

    computeActiveFromScroll();
    const syncAfterLayout = window.requestAnimationFrame(() => {
      computeActiveFromScroll();
    });

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("hashchange", onHashChange);
      if (raf) window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(syncAfterLayout);
    };
  }, []);

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <a
          href="#top"
          className={styles.brand}
          aria-label={t("nav.brand").replace(/\n/g, " ")}
        >
          <span className={styles.brandIcon} aria-hidden="true">
            <span className={styles.brandAcronym}>AGIL</span>
            <span className={styles.brandDot}>·</span>
          </span>
          <span className={styles.brandText}>{t("nav.brand")}</span>
        </a>

        <nav className={styles.navLinks} aria-label="Primary">
          <a
            href="#servicios"
            className={`${styles.navLink} ${
              activeSection === "servicios" ? styles.navLinkActive : ""
            }`}
          >
            <span className={styles.navLinkText}>{t("nav.links.services")}</span>
          </a>
          <a
            href="#tecnologia"
            className={`${styles.navLink} ${
              activeSection === "tecnologia" ? styles.navLinkActive : ""
            }`}
          >
            <span className={styles.navLinkText}>
              {t("nav.links.technology")}
            </span>
          </a>
          <a
            href="#proceso"
            className={`${styles.navLink} ${
              activeSection === "proceso" ? styles.navLinkActive : ""
            }`}
          >
            <span className={styles.navLinkText}>{t("nav.links.process")}</span>
          </a>
          <a
            href="#equipo"
            className={`${styles.navLink} ${
              activeSection === "equipo" ? styles.navLinkActive : ""
            }`}
          >
            <span className={styles.navLinkText}>{t("nav.links.team")}</span>
          </a>
        </nav>

        <a href="#contact" className={styles.navCta}>
          {t("nav.cta")}
        </a>
      </div>
    </header>
  );
}
