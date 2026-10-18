import { useLayoutEffect } from "react";

/**
 * Open a panel upwards when there is no room for it below.
 *
 * Freezing the page while a picker is open (see scroll-lock.ts) only works if the
 * picker is fully visible when the freeze goes on, and usually it can be: the page
 * scrolls down a little first. Creative is the exception. It is the last section on
 * the setup form, so when its panel opens there is nothing left to scroll — the list
 * simply hangs off the bottom of the window, and now the page is locked as well.
 *
 * So: if the panel cannot be brought into view by scrolling, and there is room above
 * the field, it opens the other way. This is a layout effect and it writes to the
 * element directly, both deliberately. Layout, so the position is settled before the
 * browser paints and the panel never visibly jumps; directly, because routing it
 * through state would re-render the list for something that is purely a measurement.
 *
 * The anchor is the panel's own offset parent — the relatively-positioned box the
 * field sits in. That is already what `top-full` is measured against, so there is
 * nothing to pass in and nothing that can be wired up wrong.
 *
 * `resizeKey` is for panels that change height while they are open — the geo tree
 * grows when you twirl a region down. Without it the panel keeps the placement it was
 * given when it opened, and a list that has just doubled in height runs off the
 * bottom of the window.
 *
 * Position is written with setAttribute rather than by assigning to `style.top`. The
 * panel carries no other inline styles, so replacing the attribute wholesale is exact,
 * and it keeps the one-way-data-flow lint rule satisfied: a hook argument is not
 * something to be reached into and mutated field by field.
 */

/** Breathing room between the panel and the edge of the window. */
const MARGIN = 16;

export const usePanelPlacement = (open: boolean, panel: React.RefObject<HTMLElement | null>, resizeKey?: string | number) => {
    useLayoutEffect(() => {
        const el = panel.current;
        if (!open || !el) return;

        const reset = () => el.removeAttribute("style");

        // Measure in the default position, whatever a previous pass left behind.
        reset();

        const field = el.offsetParent as HTMLElement | null;
        if (!field) return reset;

        const height = el.offsetHeight;
        const rect = field.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        /** How much further the document could scroll — room we can still buy below. */
        const roomToScroll = Math.max(0, document.documentElement.scrollHeight - window.scrollY - window.innerHeight);

        const fitsBelow = height + MARGIN <= spaceBelow + roomToScroll;
        const fitsAbove = height + MARGIN <= spaceAbove;

        if (!fitsBelow && fitsAbove) el.setAttribute("style", "top:auto;bottom:100%;margin-top:0;margin-bottom:0.25rem");

        return reset;
    }, [open, panel, resizeKey]);
};
