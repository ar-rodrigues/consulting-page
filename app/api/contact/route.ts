import nodemailer from "nodemailer";

type OrgType = "public" | "private";
type Interest = "audit" | "technology" | "both";

type RateEntry = { count: number; resetAt: number };

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateStore: Map<string, RateEntry> = (() => {
  const g = globalThis as unknown as {
    __contactRateStore?: Map<string, RateEntry>;
  };
  if (!g.__contactRateStore) g.__contactRateStore = new Map<string, RateEntry>();
  return g.__contactRateStore;
})();

function getRequestIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Fallback (may be undefined depending on deployment).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyReq = req as any;
  const remote = anyReq?.socket?.remoteAddress;
  return typeof remote === "string" ? remote : "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    const now = Date.now();

    // Basic in-memory rate limiting (per instance).
    const entry = rateStore.get(ip);
    if (!entry || now > entry.resetAt) {
      rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return Response.json(
          { error: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
          { status: 429 },
        );
      }
      entry.count += 1;
    }

    // Cleanup old entries occasionally.
    if (rateStore.size > 1000) {
      for (const [key, value] of rateStore.entries()) {
        if (now > value.resetAt) rateStore.delete(key);
      }
    }

    const body = (await req.json()) as Partial<{
      fullName: string;
      institution: string;
      email: string;
      phone: string;
      website?: string;
      orgType: OrgType;
      interest: Interest;
      challenge: string;
    }>;

    const requiredFields: (keyof typeof body)[] = [
      "fullName",
      "institution",
      "email",
      "phone",
      "orgType",
      "interest",
      "challenge",
    ];

    for (const field of requiredFields) {
      const value = body[field];
      if (typeof value !== "string" || value.trim().length === 0) {
        return Response.json(
          { error: `Missing or invalid field: ${String(field)}` },
          { status: 400 },
        );
      }
    }

    const websiteRaw = (body as Partial<{ website?: unknown }>).website;
    const website = typeof websiteRaw === "string" ? websiteRaw.trim() : websiteRaw;
    if (website !== undefined && website !== null && String(website).trim().length > 0) {
      return Response.json({ error: "Solicitud inválida." }, { status: 400 });
    }

    const allowedOrgTypes: OrgType[] = ["public", "private"];
    const allowedInterests: Interest[] = ["audit", "technology", "both"];
    const orgTypeLabels: Record<OrgType, string> = {
      public: "Publico",
      private: "Privado",
    };

    const interestLabels: Record<Interest, string> = {
      audit: "Auditoria gubernamental",
      technology: "Soluciones tecnologicas",
      both: "Ambas",
    };

    if (!allowedOrgTypes.includes(body.orgType as OrgType)) {
      return Response.json(
        { error: "Missing or invalid field: orgType" },
        { status: 400 },
      );
    }

    if (!allowedInterests.includes(body.interest as Interest)) {
      return Response.json(
        { error: "Missing or invalid field: interest" },
        { status: 400 },
      );
    }

    const {
      fullName,
      institution,
      email,
      phone,
      orgType,
      interest,
      challenge,
    } = body as {
      fullName: string;
      institution: string;
      email: string;
      phone: string;
      orgType: OrgType;
      interest: Interest;
      challenge: string;
    };

    const trimmedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.replace(/\D/g, "");

    const isValidEmail = (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValidEmail(trimmedEmail)) {
      return Response.json({ error: "Correo electrónico inválido." }, { status: 400 });
    }

    if (!/^\d{7,15}$/.test(normalizedPhone)) {
      return Response.json(
        {
          error:
            "Teléfono inválido. Debe contener solo números (7 a 15 dígitos).",
        },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPortRaw = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";

    const contactTo = process.env.CONTACT_TO_EMAIL;
    const contactFrom = process.env.CONTACT_FROM_EMAIL;

    if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass || !contactTo || !contactFrom) {
      return Response.json(
        {
          error:
            "Server email is not configured. Please set SMTP_* and CONTACT_* environment variables.",
        },
        { status: 500 },
      );
    }

    const smtpPort = Number(smtpPortRaw);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `Diagnóstico - ${fullName} (${orgTypeLabels[orgType]})`;

    const escapeHtml = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const interestLabel = interestLabels[interest];
    const text = [
      "Nueva solicitud de diagnóstico",
      "",
      `Nombre completo: ${fullName}`,
      `Institución: ${institution}`,
      `Correo electrónico: ${trimmedEmail}`,
      `Teléfono: ${normalizedPhone}`,
      `Tipo de organización: ${orgTypeLabels[orgType]}`,
      `Interés: ${interestLabel}`,
      "",
      "Desafío principal:",
      challenge,
    ].join("\n");

    const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0a0a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:22px 20px;background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-family:'Playfair Display',Georgia,serif;font-weight:900;color:#C9A84C;font-size:30px;line-height:1;">
                  [AGIL<span style="color:#C9A84C;font-size:26px;margin-left:4px;">&middot;</span>]
                </div>
                <div style="margin-top:10px;font-family:'Playfair Display',Georgia,serif;font-weight:900;color:#F5F2EC;font-size:22px;line-height:1.2;">
                  Nueva solicitud de diagnóstico
                </div>
                <div style="margin-top:8px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.65);font-size:13px;line-height:1.6;">
                  Se generó automáticamente desde el formulario de la página.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Nombre completo
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(fullName)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Institución
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(institution)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Correo electrónico
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(trimmedEmail)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Teléfono
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(normalizedPhone)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Tipo de organización
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(orgTypeLabels[orgType])}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;width:190px;font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                      Interés
                    </td>
                    <td style="padding:8px 0;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-weight:500;font-size:13px;">
                      ${escapeHtml(interestLabel)}
                    </td>
                  </tr>
                </table>

                <div style="margin-top:18px;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
                  <div style="font-family:'DM Sans',Arial,sans-serif;color:rgba(245,242,236,0.86);font-weight:700;font-size:13px;">
                    Desafío principal
                  </div>
                  <div style="margin-top:10px;font-family:'DM Sans',Arial,sans-serif;color:#F5F2EC;font-size:13px;line-height:1.7;white-space:pre-wrap;">
                    ${escapeHtml(challenge)}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 20px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(245,242,236,0.65);font-family:'DM Sans',Arial,sans-serif;font-size:12px;line-height:1.6;">
                <div style="color:rgba(245,242,236,0.78);font-weight:700;">
                  Auditoria &amp; gestion Inteligente de lineamientos
                </div>
                <div style="margin-top:6px;">
                  © ${new Date().getFullYear()} · Ciudad de Mexico, Mexico
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      subject,
      text,
      html,
      replyTo: trimmedEmail,
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unexpected error" },
      { status: 500 },
    );
  }
}

