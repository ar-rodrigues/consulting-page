"use client";

import { useCallback, useState } from "react";

export type ContactPayload = {
  fullName: string;
  institution: string;
  email: string;
  phone: string;
  // Honeypot field: bots typically fill hidden fields.
  website?: string;
  orgType: "public" | "private";
  interest: "audit" | "technology" | "both";
  challenge: string;
};

export type ContactResponse = {
  ok: boolean;
  message?: string;
};

export function useContact() {
  const [data, setData] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const refetch = useCallback(async (payload: ContactPayload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => null)) as
        | ContactResponse
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(
          (json as { error?: string } | null)?.error ??
            `Request failed with status ${res.status}`,
        );
        return;
      }

      const next = json as ContactResponse | null;
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch, reset } as const;
}

