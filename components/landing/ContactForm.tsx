"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { ContactPayload, useContact } from "@/hooks/useContact";
import styles from "./landing.module.css";

export default function ContactForm() {
  const t = useTranslations("landing");
  const { data, loading, error, refetch, reset } = useContact();

  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [orgType, setOrgType] = useState<ContactPayload["orgType"]>("public");
  const [interest, setInterest] = useState<ContactPayload["interest"]>("audit");
  const [challenge, setChallenge] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const orgOptions = useMemo(
    () => [
      { value: "public" as const, label: t("contact.form.orgTypeOptions.public") },
      { value: "private" as const, label: t("contact.form.orgTypeOptions.private") },
    ],
    [t],
  );

  const interestOptions = useMemo(
    () => [
      { value: "audit" as const, label: t("contact.form.interestOptions.audit") },
      {
        value: "technology" as const,
        label: t("contact.form.interestOptions.technology"),
      },
      { value: "both" as const, label: t("contact.form.interestOptions.both") },
    ],
    [t],
  );

  const contactEmail = t("contact.form.contactEmail");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setClientError(null);

    const normalizedPhone = phone.replace(/\D/g, "");
    const trimmedEmail = email.trim();

    const isValidEmail = (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Phone should be digits only; length/pattern is intentionally not strict.
    if (!/^\d+$/.test(normalizedPhone) || normalizedPhone.length === 0 || normalizedPhone.length > 20) {
      setClientError(t("contact.form.validation.phone"));
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setClientError(t("contact.form.validation.email"));
      return;
    }

    const payload: ContactPayload = {
      fullName: fullName.trim(),
      institution: institution.trim(),
      email: trimmedEmail,
      phone: normalizedPhone,
      website,
      orgType,
      interest,
      challenge: challenge.trim(),
    };

    refetch(payload);
  };

  const activeError = error ?? clientError;

  if (data?.ok) {
    return (
      <div className={styles.successPanel} role="status" aria-live="polite">
        <div className={styles.noticeIconOk} aria-hidden="true">
          <CheckCircle2 size={22} color="currentColor" />
        </div>

        <div className={styles.noticeTitle}>{t("contact.form.successMessage")}</div>
        <div className={styles.noticeText}>{t("contact.form.successSubMessage")}</div>

        <div className={styles.successSummary} aria-label={t("contact.form.summaryLabel")}>
          <div className={styles.successSummaryRow}>
            <span className={styles.successSummaryLabel}>
              {t("contact.form.fields.fullName.label")}
            </span>
            <span className={styles.successSummaryValue}>{fullName || "—"}</span>
          </div>
          <div className={styles.successSummaryRow}>
            <span className={styles.successSummaryLabel}>
              {t("contact.form.fields.institution.label")}
            </span>
            <span className={styles.successSummaryValue}>{institution || "—"}</span>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => {
              reset();
              setFullName("");
              setInstitution("");
              setEmail("");
              setPhone("");
              setWebsite("");
              setOrgType("public");
              setInterest("audit");
              setChallenge("");
            }}
          >
            {t("contact.form.sendAnotherLabel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={t("contact.form.title")}
      // Evita el "Please match the requested format." nativo del navegador.
      noValidate
    >
      <div className={styles.eyebrow}>{t("contact.form.title")}</div>

      {activeError ? (
        <div className={`${styles.noticeCard} ${styles.noticeError}`} role="alert">
          <div className={styles.noticeHeader}>
            <div className={styles.noticeIconErr} aria-hidden="true">
              <AlertTriangle size={22} color="currentColor" />
            </div>
            <div className={styles.noticeTitleSmall}>{t("contact.form.errorHeading")}</div>
          </div>

          <div className={styles.noticeText}>
            {t("contact.form.errorSubMessage")}{" "}
            <a className={styles.noticeLink} href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </div>

          <div className={styles.errorDetails}>{activeError}</div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={loading}
              onClick={() => {
                reset();
                setClientError(null);
              }}
            >
              {t("contact.form.tryAgainLabel")}
            </button>
          </div>
        </div>
      ) : null}

      {/* Honeypot: should stay empty. Bots will often fill it. */}
      <input
        className={styles.honeypot}
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.fullName.label")}</span>
          <input
            className={styles.input}
            disabled={loading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("contact.form.fields.fullName.placeholder")}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.institution.label")}</span>
          <input
            className={styles.input}
            disabled={loading}
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder={t("contact.form.fields.institution.placeholder")}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.email.label")}</span>
          <input
            className={styles.input}
            type="email"
            inputMode="email"
            disabled={loading}
            value={email}
            onChange={(e) => {
              if (error) reset();
              setClientError(null);
              setEmail(e.target.value);
            }}
            placeholder={t("contact.form.fields.email.placeholder")}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.phone.label")}</span>
          <input
            className={styles.input}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            disabled={loading}
            value={phone}
            onChange={(e) => {
              if (error) reset();
              setClientError(null);
              setPhone(e.target.value.replace(/\D/g, ""));
            }}
            placeholder={t("contact.form.fields.phone.placeholder")}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.orgType.label")}</span>
          <select
            className={styles.select}
            disabled={loading}
            value={orgType}
            onChange={(e) => setOrgType(e.target.value as ContactPayload["orgType"])}
          >
            {orgOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("contact.form.fields.interest.label")}</span>
          <select
            className={styles.select}
            disabled={loading}
            value={interest}
            onChange={(e) =>
              setInterest(e.target.value as ContactPayload["interest"])
            }
          >
            {interestOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.label}>{t("contact.form.fields.challenge.label")}</span>
          <textarea
            className={styles.textarea}
            disabled={loading}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder={t("contact.form.fields.challenge.placeholder")}
            required
          />
        </label>
      </div>

      <div className={styles.formActions}>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? t("contact.form.submitLoading") : t("contact.form.submitLabel")}
        </button>
      </div>
    </form>
  );
}

