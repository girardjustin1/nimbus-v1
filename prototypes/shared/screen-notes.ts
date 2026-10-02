import { useEffect, useSyncExternalStore } from "react";

/**
 * Screen notes — the commentary that used to sit inside the screens.
 *
 * Concept rationale and the walkthrough stepper are notes *about* a design, not part of
 * it. Rendered in the page they distort the thing being reviewed: they take the width the
 * form needs, and a screenshot of the screen comes out with our annotations baked in.
 *
 * So a screen registers its notes here and the toolbar's Info button shows them on
 * demand. The screen itself stays clean.
 */

export interface WalkthroughStep {
    id: string;
    label: string;
}

export interface ScreenNotes {
    /** e.g. "Round 2". */
    label?: string;
    title?: string;
    /** What this screen is exploring. */
    notes?: string[];
    /** Ordered steps through a flow; links carry the draft with ?keep=1. */
    walkthrough?: WalkthroughStep[];
    /** Which walkthrough step this screen is. */
    currentStep?: string;
}

let current: ScreenNotes | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

export const useScreenNotesValue = () => useSyncExternalStore(subscribe, () => current);

/**
 * Called by the screen on display. Cleared automatically when it unmounts.
 *
 * Notes are plain data, so the serialised form is both the change key and the stored
 * snapshot — no ref, and nothing is written during render.
 */
export const useScreenNotes = (notes: ScreenNotes | null) => {
    const json = JSON.stringify(notes ?? null);
    useEffect(() => {
        current = json === "null" ? null : (JSON.parse(json) as ScreenNotes);
        emit();
        return () => {
            current = null;
            emit();
        };
    }, [json]);
};

export const hasNotes = (n: ScreenNotes | null): n is ScreenNotes =>
    Boolean(n && ((n.notes && n.notes.length) || (n.walkthrough && n.walkthrough.length) || n.title));
