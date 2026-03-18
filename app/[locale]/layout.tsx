import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import "../globals.css";

type SupportedLocale = "es" | "en";

function parseLocale(locale: string): SupportedLocale {
  if (locale === "es") return "es";
  if (locale === "en") return "en";
  notFound();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const parsedLocale = parseLocale(locale); // validate locale
  setRequestLocale(parsedLocale);
  const messages = await getMessages();
  const title = messages?.metadata?.title;
  const description = messages?.metadata?.description;

  return {
    title:
      typeof title === "string"
        ? title
        : "Auditoria Gubernamental y Gestion Inteligente | Auditoria & Gestion Inteligente",
    description:
      typeof description === "string"
        ? description
        : "Despacho especializado en auditoria gubernamental, control interno y soluciones tecnologicas de trazabilidad para los tres niveles de gobierno en Mexico.",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const parsedLocale = parseLocale(locale);
  setRequestLocale(parsedLocale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={parsedLocale} messages={messages}>
      <AntdRegistry>{children}</AntdRegistry>
    </NextIntlClientProvider>
  );
}
