"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import styles from "./landing.module.css";

type ActiveSection = "servicios" | "tecnologia" | "proceso" | null;

export default function NavBar() {
  const t = useTranslations("landing");
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const ids = ["servicios", "tecnologia", "proceso"] as const;

    const computeActiveFromScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenterY = viewportHeight / 2;

      // La sección activa es la más cercana al centro del viewport.
      const closestByCenter = (() => {
        let best: { id: ActiveSection; dist: number } | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const center = (r.top + r.bottom) / 2;
          const dist = Math.abs(center - viewportCenterY);
          if (!best || dist < best.dist) best = { id, dist };
        }
        return best;
      })();

      const nextActive: ActiveSection = closestByCenter?.id ?? null;

      setActiveSection(nextActive);
    };

    const setFromHash = () => {
      const rawHash = window.location.hash.replace("#", "");
      if (ids.includes(rawHash as (typeof ids)[number])) {
        setActiveSection(rawHash as ActiveSection);
      }
    };

    // Inicial: hash primero (si existe), si no, el cálculo por scroll.
    if (window.location.hash) setFromHash();

    let raf = 0;
    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        computeActiveFromScroll();
      });
    };

    computeActiveFromScroll();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) window.cancelAnimationFrame(raf);
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
        </nav>

        <a href="#contacto" className={styles.navCta}>
          {t("nav.cta")}
        </a>
      </div>
    </header>
  );
}
