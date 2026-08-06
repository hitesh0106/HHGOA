"use client";

import { useCallback, useEffect, useState } from "react";
import { readDraft, writeDraft, clearDraft as clearDraftStore } from "@/lib/draft";
import type { GeneratorMode, PersistedDraft } from "@/types";

const EMPTY_DRAFT: PersistedDraft = {
  name: "",
  role: "",
  college: "",
  github: "",
  xHandle: "",
  builderTitle: "",
  builderLevel: "gold",
  badge: "",
  mode: "builder-id",
  updatedAt: 0,
};

/**
 * Synced persisted draft. SSR-safe (renders empty draft on first paint,
 * hydrates from localStorage on mount).
 */
export function usePersistedDraft() {
  const [draft, setDraft] = useState<PersistedDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setDraft(readDraft());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const update = useCallback((patch: Partial<PersistedDraft>) => {
    setDraft((prev) => {
      const next = writeDraft({ ...prev, ...patch });
      return next;
    });
  }, []);

  const setMode = useCallback(
    (mode: GeneratorMode) => {
      update({ mode });
    },
    [update]
  );

  const clearAll = useCallback(() => {
    clearDraftStore();
    setDraft(EMPTY_DRAFT);
  }, []);

  return { draft, update, setMode, clearAll, hydrated };
}
