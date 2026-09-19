import { useState, useSyncExternalStore } from "react";
import { type StudioDraft, sampleDraft } from "./studio-data";

/**
 * One in-memory draft shared by every Studio screen, so choices carry from step to
 * step in the standalone prototype (each step is its own #/route).
 *
 * A screen opened directly (a deep link, or a Storybook story) starts from its own
 * preset. Moving with Back / Next adds `keep=1` to the link, which keeps the draft.
 */

let draft: StudioDraft = sampleDraft;
const listeners = new Set<() => void>();

const setDraft = (next: StudioDraft) => {
    draft = next;
    listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

const keepRequested = () => typeof window !== "undefined" && /[?&]keep=1\b/.test(window.location.hash);

/** Link to another step that keeps the current draft. */
export const stepHref = (id: string) => `#/${id}?keep=1`;

export const useStudioDraft = (preset: StudioDraft) => {
    // Runs once per screen mount: start from the preset unless we arrived via Back / Next.
    useState(() => {
        if (!keepRequested()) draft = preset;
        return null;
    });
    const value = useSyncExternalStore(subscribe, () => draft);
    const update = (p: Partial<StudioDraft>) => setDraft({ ...draft, ...p });
    const updateCreative = (p: Partial<StudioDraft["creative"]>) => setDraft({ ...draft, creative: { ...draft.creative, ...p } });
    return { draft: value, update, updateCreative };
};
