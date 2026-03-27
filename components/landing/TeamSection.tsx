import { getTranslations } from "next-intl/server";

import styles from "./landing.module.css";

const credentialKeys = ["01", "02", "03", "04", "05"] as const;
const statKeys = ["01", "02", "03"] as const;
const toolKeys = ["01", "02", "03", "04", "05", "06", "07", "08"] as const;

const milestoneKeys = ["01", "02", "03"] as const;
const techStatKeys = ["01", "02", "03"] as const;
const techToolKeys = ["01", "02", "03", "04", "05", "06"] as const;

export default async function TeamSection() {
  const t = await getTranslations("landing");

  return (
    <section id="equipo" className={`${styles.section} ${styles.sectionDark}`}>
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>{t("team.eyebrow")}</div>
        <div className={styles.h2}>{t("team.title")}</div>

        <div className={styles.teamProfiles}>
          <div className={styles.teamGrid}>
            <div className={styles.teamLeft}>
              <div className={styles.teamAvatar}>
                <span className={styles.teamAvatarInitials}>
                  {t("team.profile.initials")}
                </span>
              </div>

              <div className={styles.teamName}>{t("team.profile.name")}</div>
              <div className={styles.teamRole}>{t("team.profile.role")}</div>

              <div className={styles.teamCredentials}>
                {credentialKeys.map((key) => (
                  <div key={key} className={styles.teamCredentialItem}>
                    <div className={styles.teamCredentialDot} />
                    <div>
                      <div className={styles.teamCredentialLabel}>
                        {t(`team.credentials.item${key}.label`)}
                      </div>
                      <div className={styles.teamCredentialValue}>
                        {t(`team.credentials.item${key}.value`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.teamRight}>
              <div className={styles.teamLeadQuote}>{t("team.quote")}</div>
              <p className={styles.teamBio}>{t("team.bio.paragraph1")}</p>
              <p className={styles.teamBio}>{t("team.bio.paragraph2")}</p>

              <div className={styles.teamStatsGrid}>
                {statKeys.map((key) => (
                  <div key={key} className={styles.teamStatCard}>
                    <span className={styles.teamStatNumber}>
                      {t(`team.stats.item${key}.number`)}
                    </span>
                    <span className={styles.teamStatDescription}>
                      {t(`team.stats.item${key}.description`)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.teamToolsLabel}>{t("team.toolsLabel")}</div>
              <div className={styles.teamToolsRow}>
                {toolKeys.map((key) => (
                  <span key={key} className={styles.teamToolTag}>
                    {t(`team.tools.item${key}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.teamGrid} ${styles.teamGridFollow}`}>
            <div className={styles.teamLeft}>
              <div className={styles.teamAvatar}>
                <span className={styles.teamAvatarInitials}>
                  {t("team.tech.initials")}
                </span>
              </div>

              <div className={`${styles.teamName} ${styles.teamNameMultiline}`}>
                {t("team.tech.name")}
              </div>
              <div className={`${styles.teamRole} ${styles.teamRoleLong}`}>
                {t("team.tech.role")}
              </div>

              <span className={styles.teamPathLabel}>{t("team.tech.pathLabel")}</span>
              <div className={styles.teamMilestones}>
                {milestoneKeys.map((key) => (
                  <div key={key} className={styles.teamMilestoneItem}>
                    <div className={styles.teamMilestoneTitle}>
                      {t(`team.tech.milestones.item${key}.title`)}
                    </div>
                    <div className={styles.teamMilestoneDesc}>
                      {t(`team.tech.milestones.item${key}.description`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.teamRight}>
              <div className={styles.teamLeadQuote}>{t("team.tech.quote")}</div>
              <p className={`${styles.teamBio} ${styles.teamBioJustify}`}>
                {t("team.tech.paragraph1")}
              </p>
              <p className={`${styles.teamBio} ${styles.teamBioJustify}`}>
                {t("team.tech.paragraph2")}
              </p>

              <div className={`${styles.teamStatsGrid} ${styles.teamStatsCompact}`}>
                {techStatKeys.map((key) => (
                  <div key={key} className={styles.teamStatCard}>
                    <span className={styles.teamStatNumber}>
                      {t(`team.tech.stats.item${key}.number`)}
                    </span>
                    <span className={styles.teamStatDescription}>
                      {t(`team.tech.stats.item${key}.description`)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.teamToolsLabel}>{t("team.tech.toolsLabel")}</div>
              <div className={styles.teamToolsRow}>
                {techToolKeys.map((key) => (
                  <span key={key} className={styles.teamToolTag}>
                    {t(`team.tech.tools.item${key}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
