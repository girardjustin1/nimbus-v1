import { useState, useSyncExternalStore } from "react";
import type { SetupForm } from "./setup-data";
import { allPresets } from "./setup-data";

/**
 * One in-memory campaign draft shared by every Campaign Setup screen, so what you fill
 * in on one step is still there on the next.
 *
 * Same contract as Studio's draft store: a screen opened cold (from the index, the
 * toolbar screen picker, or a deep link) starts from its own preset, which is what keeps
 * the edge-case screens showing exactly the state they are meant to demonstrate. Moving
 * with the in-page Back / Continue buttons adds `keep=1`, which carries the draft.
 */

let draft: SetupForm = allPresets.ready;
const listeners = new Set<() => void>();

const setDraft = (next: SetupForm) => {
    draft = next;
    listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

const keepRequested = () => typeof window !== "undefined" && /[?&]keep=1\b/.test(window.location.hash);

/** Link to another setup screen that keeps the current draft. */
export const stepHref = (id: string) => `#/${id}?keep=1`;

export const useSetupDraft = (preset: SetupForm) => {
    // Runs once per screen mount: start from the preset unless we arrived via Back / Continue.
    useState(() => {
        if (!keepRequested()) draft = preset;
        return null;
    });
    const value = useSyncExternalStore(subscribe, () => draft);
    const update = (p: Partial<SetupForm>) => setDraft({ ...draft, ...p });
    return { form: value, update };
};
