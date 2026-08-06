"use client";

import { useCallback, useEffect, useState } from "react";
import { readDraft, writeDraft, clearDraft as clearDraftStore } from "@/lib/draft";
import type { GeneratorMode, PersistedDraft } from "@/types";

const EMPTY_DRAFT: PersistedDraft = {
  name: "",
  role: "",
  builderTitle: "",
  mode: "builder-id",
  updatedAt: 0,
};

/**
 * Synced persisted draft. Single source of truth for the optional "remember"
 * functionality. All writes go through the lib/draft helper which is a
 * safe, type-checked localStorage wrapper.
 *
 * The initial render uses an EMPTY draft (SSR-safe), then a mount effect
 * reads localStorage and applies the real values once on the client.
 */
export function usePersistedDraft() {
  const [draft, setDraft] = useState<PersistedDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // Mount-only: pull the persisted draft into state once. This is a
    // legitimate use of setState-in-effect because we are syncing from
    // an external store (localStorage) on the client.
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
