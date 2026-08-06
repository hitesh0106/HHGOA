"use client";

import { useCallback, useState } from "react";
import { BUILDER_TITLES } from "@/constants";
import { pickRandom } from "@/lib/utils";

/**
 * Random Builder Title generator. Picks a fresh title that never matches the
 * previous one. With 100+ titles in the pool, the chance of collision in
 * normal use is negligible.
 *
 * `initial` is consumed only once during the very first render (lazy
 * useState initializer) so we never need to setState-in-effect — the
 * parent can call `setTitle` directly if it wants to override later.
 */
export function useBuilderTitle(initial?: string) {
  const [title, setTitle] = useState<string>(
    () => initial || pickRandom(BUILDER_TITLES)
  );

  const regenerate = useCallback(() => {
    setTitle((prev) => pickRandom(BUILDER_TITLES, prev));
  }, []);

  const setTitleIfChanged = useCallback(
    (next: string) => {
      setTitle((prev) => (prev === next ? prev : next));
    },
    []
  );

  return { title, setTitle: setTitleIfChanged, regenerate };
}
