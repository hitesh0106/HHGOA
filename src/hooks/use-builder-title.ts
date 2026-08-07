"use client";

import { useCallback, useState } from "react";
import { BUILDER_TITLES } from "@/constants";
import { pickRandom } from "@/lib/utils";
import { generateBuilderTitle } from "@/lib/title-generator";

/**
 * Random Builder Title generator.
 *
 * If a `role` is provided, generates stack-aware titles using the
 * title-generator (e.g. DevOps → "Pipeline Commander"). Each click on
 * `regenerate` produces a different title relevant to the same stack.
 *
 * When `role` changes, the title auto-regenerates with the new stack context.
 *
 * If no role is provided, falls back to the generic 100+ title pool.
 */
export function useBuilderTitle(initial?: string, role?: string) {
  const [title, setTitle] = useState<string>(
    () => initial || (role ? generateBuilderTitle(role) : pickRandom(BUILDER_TITLES))
  );

  // Auto-regenerate when role changes (and no explicit initial title was set).
  const [lastRole, setLastRole] = useState(role);
  if (role !== lastRole) {
    setLastRole(role);
    if (role) {
      setTitle(generateBuilderTitle(role, title));
    }
  }

  const regenerate = useCallback(() => {
    setTitle((prev) => {
      if (role) {
        return generateBuilderTitle(role, prev);
      }
      return pickRandom(BUILDER_TITLES, prev);
    });
  }, [role]);

  const setTitleIfChanged = useCallback(
    (next: string) => {
      setTitle((prev) => (prev === next ? prev : next));
    },
    []
  );

  return { title, setTitle: setTitleIfChanged, regenerate };
}

