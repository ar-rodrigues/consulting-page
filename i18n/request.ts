import { getRequestConfig } from "next-intl/server";

import esMessages from "../messages/es.json";
import enMessages from "../messages/en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = (await requestLocale) === "en" ? "en" : "es";
  const messages = resolvedLocale === "es" ? esMessages : enMessages;

  return {
    locale: resolvedLocale,
    messages,
  };
});
