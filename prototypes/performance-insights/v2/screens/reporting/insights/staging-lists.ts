import { useEffect, useState } from "react";
import type { FilterDim } from "../../nimbus-ui";

/**
 * Performance Insights · C0: staging's real filter lists, on this machine only.
 *
 * The prototype's dev server serves them from the gitignored reference folder
 * (prototypes/vite.config.ts, localStagingLists); a build has no such endpoint, so the
 * deployed prototype and Storybook keep the sample data. Automated browsers (the
 * screenshot scripts, whose pictures go into Storybook) skip them too.
 */
export type StagingLists = Record<string, { values: string[]; group?: { label: string; of: Record<string, string> } }>;

let cache: StagingLists | null | undefined;
let pending: Promise<StagingLists | null> | undefined;

const load = () =>
    (pending ??= fetch("/__local/pi-filter-values.json")
        .then((r) => (r.ok ? (r.json() as Promise<StagingLists>) : null))
        .catch(() => null)
        .then((lists) => (cache = lists)));

export const useStagingLists = (): StagingLists | null => {
    const off = !import.meta.env.DEV || (typeof navigator !== "undefined" && navigator.webdriver);
    const [lists, setLists] = useState<StagingLists | null>(off ? null : (cache ?? null));
    useEffect(() => {
        if (off || cache !== undefined) return;
        let live = true;
        void load().then((l) => live && setLists(l));
        return () => {
            live = false;
        };
    }, [off]);
    return lists;
};

/**
 * Categories with staging's values (and Country's and App's groups) where staging has them.
 * Staging gives no volumes, so a search-first category's "top" values (C8) become the first
 * ones alphabetically; the panel still says how many there are in all.
 */
export const withStagingLists = <T extends FilterDim & { top?: string[] }>(dims: T[], lists: StagingLists | null): T[] =>
    lists
        ? dims.map((d) => {
              const real = lists[d.id];
              if (!real) return d;
              return { ...d, values: real.values, group: real.group, ...(d.top ? { top: real.values.slice(0, d.top.length) } : {}) };
          })
        : dims;
