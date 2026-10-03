import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Demo fill — type-free walkthroughs of the prototypes.
 *
 * These prototypes exist to be clicked through in front of people, and typing a budget
 * and four keywords on every screen is the slowest part of that. So every empty field is
 * clickable: one click puts plausible content in it, and the toolbar can fill a whole
 * page at once.
 *
 * Two modes. **Good** fills valid data and the flow proceeds. **Bad** fills data that
 * breaks a rule — an end date before the start, a blank budget, mixed creative types —
 * so the error states can be shown on demand rather than by luck.
 *
 * Click-to-fill can also be switched off entirely. Swallowing the first click is what
 * makes a walkthrough fast, and it is exactly what gets in the way when the thing you
 * are testing is the typing: whether a field accepts what you give it, what the
 * validation says, how a type-ahead behaves on a real query. Off, every field is an
 * ordinary field. "Fill page" still works either way, because that is an explicit
 * press rather than a click taken out of your hands.
 *
 * This is prototype chrome, not product UI. Nothing here ships in a real screen.
 */

export type FillMode = "good" | "bad";

/* ------------------------------------------------------------------- Mode --- */

let mode: FillMode = "good";
const modeListeners = new Set<() => void>();

const emitMode = () => modeListeners.forEach((l) => l());

export const setFillMode = (next: FillMode) => {
    mode = next;
    emitMode();
};

const subscribeMode = (l: () => void) => {
    modeListeners.add(l);
    return () => modeListeners.delete(l);
};

/** Read the mode without subscribing — for fill callbacks, which run on click. */
export const currentFillMode = () => mode;

export const useFillMode = () => useSyncExternalStore(subscribeMode, () => mode);

/** Pick one of two values by the active mode. Used all over the fill data. */
export const byMode = <T,>(good: T, bad: T): T => (mode === "bad" ? bad : good);

/* ----------------------------------------------------- Click-to-fill on/off --- */

let clickToFill = true;
const enabledListeners = new Set<() => void>();

export const setClickToFill = (next: boolean) => {
    clickToFill = next;
    enabledListeners.forEach((l) => l());
};

const subscribeEnabled = (l: () => void) => {
    enabledListeners.add(l);
    return () => enabledListeners.delete(l);
};

export const useClickToFill = () => useSyncExternalStore(subscribeEnabled, () => clickToFill);

/* -------------------------------------------------------------- Page fill --- */

/**
 * The screen on display registers how to fill itself, and the toolbar button calls it.
 * Only one screen is mounted at a time (the frame remounts on every route change), so a
 * single slot is enough.
 */
let pageFill: (() => void) | null = null;
const fillListeners = new Set<() => void>();

const subscribeFill = (l: () => void) => {
    fillListeners.add(l);
    return () => fillListeners.delete(l);
};

/** Called by a screen that knows how to populate itself. */
export const useRegisterPageFill = (fn: (() => void) | null) => {
    const ref = useRef(fn);
    // Keep the latest closure without re-registering: the ref is written after render,
    // never during it.
    useEffect(() => {
        ref.current = fn;
    });
    const has = Boolean(fn);
    useEffect(() => {
        if (!has) return;
        pageFill = () => ref.current?.();
        fillListeners.forEach((l) => l());
        return () => {
            pageFill = null;
            fillListeners.forEach((l) => l());
        };
    }, [has]);
};

/** True when the current screen can fill itself. */
export const useCanFillPage = () => useSyncExternalStore(subscribeFill, () => pageFill !== null);

export const runPageFill = () => pageFill?.();

/* ------------------------------------------------------------ Fill helpers --- */

/** Deterministic pick from a list, so a demo repeats the same way twice. */
let turn = 0;
export const rotate = <T,>(options: readonly T[]): T => options[turn++ % options.length];
export const resetRotation = () => {
    turn = 0;
};
