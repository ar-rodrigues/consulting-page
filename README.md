## Consulting Page (Next.js)

Marketing/landing site built with **Next.js App Router**, **next-intl** (ES/EN routing), and an API route for the **contact form** (email via Nodemailer).

## Requirements

- **Node.js**: latest LTS recommended
- **Package manager**: npm (commands below use npm)

## Setup

Install dependencies:

```bash
npm install
```

## Environment variables

The contact form sends emails via `POST /api/contact` and requires SMTP configuration.

Create your environment variables in your deployment platform (or locally, e.g. in `.env.local`) with:

```bash
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false

CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Notes:

- `CONTACT_TO_EMAIL` supports **one or more recipients**, separated by commas or semicolons.
- `SMTP_SECURE` should be `"true"` for implicit TLS (commonly port 465); otherwise keep it `"false"`.

## Development

First, run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Pages live under `app/`:

- `app/[locale]/...` is the locale-aware version (ES/EN).
- `app/api/contact/route.ts` handles the contact form email sending.

## Components (landing)

The main landing page (`app/[locale]/page.tsx`) composes the UI from `components/landing/`:

- **`NavBar`**: sticky top navigation with active-section highlighting while scrolling (anchors to `#servicios`, `#tecnologia`, `#proceso`, `#contact`).
- **`HeroSection`**: above-the-fold headline, supporting “cards”, and primary CTAs that jump to services/contact.
- **`ServicesSection`**: 4 service cards plus “pillars” content; uses the reusable **`SectionHeading`**.
- **`TechnologySection`**: 3 technology cards with Lucide icons and a short scenario/quote block.
- **`ProcessSection`**: left “sticky” CTA card + 4 step/phases grid describing the delivery process.
- **`ContactSection`**: intro card + **`ContactForm`**.
  - **`ContactForm`**: client-side form with validation + async submit via `useContact` (hits `POST /api/contact`); shows success/error states.
- **`Footer`**: brand + **`LanguageSwitcher`**.
  - **`LanguageSwitcher`**: toggles `es/en` by rewriting the locale segment in the URL (keeps query + hash).
- **`TeamSection`**: team/profile section (currently not rendered; component exists and is commented out in the page).

Styling is shared via `components/landing/landing.module.css`.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production server
npm run lint     # run eslint
```

## i18n (ES/EN)

This project uses `next-intl` with localized routes under `app/[locale]`.

## Deploy on Vercel

Deploy as a standard Next.js app, and make sure to set the **SMTP** and **CONTACT** environment variables in your hosting provider.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
