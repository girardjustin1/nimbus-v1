import { useEffect } from "react";

/**
 * Hold the page still while a picker is open.
 *
 * Every search-and-select control in Round 3 opens a panel anchored to its field, and
 * the one-page setup form is three thousand pixels tall. Nudge the wheel while a panel
 * is open and the whole form slides, taking the panel with it — you end up chasing the
 * list you were about to choose from, or scrolling clean past the section you were
 * filling in. So the page stops moving until the choice is made.
 *
 * **This does not touch CSS, deliberately.** The obvious implementation is
 * `overflow: hidden` on the document plus padding to replace the scrollbar's width,
 * and it is what this did first. It broke the page: the shell's nav is sticky, and
 * taking the scroll off the document moved the sidebar and shifted the whole form
 * sideways the instant any dropdown opened. A lock that rearranges the page is not a
 * lock, it is a bug with good intentions. Swallowing the scroll events instead leaves
 * every box exactly where it was.
 *
 * What still scrolls: the panel's own list. The test is not "is the pointer over the
 * panel" but "is it over something in the panel that can actually scroll" — a panel has
 * a header and a footer that cannot, and letting the wheel through over those handed
 * the scroll straight back to the page, which is the whole thing we are preventing. It
 * also covers the short list: seven regions fit without scrolling, so the wheel over
 * them does nothing rather than quietly moving the form underneath. The lists carry
 * `overscroll-contain` as well, so reaching the end of a long one doesn't chain either.
 *
 * Keyboard scrolling is left alone. Page Up, Home and the space bar all mean something
 * inside a text field, and the arrow keys already belong to the picker.
 *
 * Escape, a click outside, or picking something all release it, because all three
 * unmount the panel and this unwinds on cleanup.
 */

/** Breathing room between the bottom of a panel and the bottom of the window. */
const MARGIN = 16;

export const useScrollLock = (active: boolean, panel?: React.RefObject<HTMLElement | null>) => {
    useEffect(() => {
        if (!active) return;

        const el = panel?.current;
        if (el) {
            const box = el.getBoundingClientRect();
            const below = box.bottom - window.innerHeight + MARGIN;
            // Only ever downwards: a panel that opens above the fold is already
            // readable, and yanking the page up to "centre" it loses the user's place.
            // Panels with nowhere to go flip upwards instead — see panel-placement.ts.
            if (below > 0) window.scrollBy(0, below);
        }

        /** Walk up from the pointer, within the panel, looking for something scrollable. */
        const overScrollable = (target: EventTarget | null) => {
            let node = target instanceof Element ? target : null;
            while (node && el?.contains(node)) {
                const overflow = getComputedStyle(node).overflowY;
                if ((overflow === "auto" || overflow === "scroll") && node.scrollHeight > node.clientHeight) return true;
                node = node.parentElement;
            }
            return false;
        };

        const swallow = (event: Event) => {
            if (!overScrollable(event.target)) event.preventDefault();
        };

        // Passive must be false or preventDefault is ignored on wheel and touchmove.
        document.addEventListener("wheel", swallow, { passive: false });
        document.addEventListener("touchmove", swallow, { passive: false });
        return () => {
            document.removeEventListener("wheel", swallow);
            document.removeEventListener("touchmove", swallow);
        };
    }, [active, panel]);
};
