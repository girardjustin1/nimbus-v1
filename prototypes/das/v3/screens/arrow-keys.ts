import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";

/**
 * Arrow keys and Enter over a list that is rebuilt on every keystroke.
 *
 * Six surfaces in setup now search a library the publisher already built — Add to
 * existing deal, Priority, Geos, Apps, Keywords and Creative. They were converging on
 * the same look; this is what makes them converge on the same behaviour, so that
 * learning one teaches you the other five. One module rather than six copies, because
 * six copies is how two of them end up wrapping at the bottom of the list and four
 * don't.
 *
 * The rules, and why:
 *
 *   - **Down opens.** A closed field does nothing on focus — focus is not a request to
 *     see a thousand rows. Down is, so Down shows everything.
 *   - **The highlight is an index, not an id.** A list that re-filters as you type will
 *     drop the row an id points at. Pairing the index with the query it was chosen
 *     under is what makes an index safe: the moment the query changes the stored index
 *     is ignored and the cursor returns to the first row you could actually take. Enter
 *     straight after typing therefore picks the top match, which is nearly always the
 *     one you meant.
 *   - **Clamped, not wrapping.** Arriving back at the top of the list because you
 *     pressed Down once too often is the kind of thing you notice after you've already
 *     hit Enter.
 *   - **Dead rows are stepped over.** Landing on something already added, or blocked by
 *     an ad-type conflict, and having Enter do nothing is worse than skipping it.
 *   - **Hover follows the mouse, not the page.** Rows report hover on `mousemove`,
 *     never `mouseenter`. Keeping the highlight in view scrolls the list, which slides
 *     a row under a mouse that has not moved an inch; `mouseenter` fires for that and
 *     the highlight snaps back to wherever the pointer happens to be sitting, so the
 *     list appears to ignore the second and every later press of Down. `mousemove`
 *     only fires when the pointer actually moves, which is the thing we meant by
 *     "hover" all along.
 *   - **A key we act on stops there.** Two of these controls — Add to existing deal,
 *     and Priority — sit inside a React Aria RadioGroup, which implements its own
 *     roving focus and will happily take ArrowDown, move focus onto the next radio and
 *     select it. That is correct of RadioGroup and wrong here: while the caret is in a
 *     combobox, the combobox owns the arrows. Handlers attach on capture and swallow
 *     only the keys they actually use, so every other key reaches the group untouched.
 */

const firstPickable = (length: number, isPickable: (index: number) => boolean) => {
    for (let i = 0; i < length; i++) if (isPickable(i)) return i;
    return 0;
};

const stepFrom = (from: number, dir: 1 | -1, length: number, isPickable: (index: number) => boolean) => {
    for (let i = from + dir; i >= 0 && i < length; i += dir) if (isPickable(i)) return i;
    return from;
};

export interface ListCursor {
    /** Index of the highlighted row. Rows render `data-active={i === active}`. */
    active: number;
    /** For hover — the mouse and the keyboard share one highlight. Call from `onMouseMove`. */
    move: (index: number) => void;
    /** Goes on whatever wraps the field, so it catches keys bubbling out of the input. */
    onKeyDown: (event: ReactKeyboardEvent) => void;
}

export const useListCursor = ({
    length,
    resetKey,
    isPickable = () => true,
    onEnter,
    isOpen = true,
    onOpen,
    extraKeys,
    initialIndex,
    listRef,
}: {
    length: number;
    /** Anything that re-orders the list — normally the search query. */
    resetKey: string;
    isPickable?: (index: number) => boolean;
    onEnter: (index: number) => void;
    isOpen?: boolean;
    /** Called when Down is pressed on a closed list. */
    onOpen?: () => void;
    /**
     * Where the highlight starts for a new key, when the top of the list is the wrong
     * answer. Priority uses it: opening a field that already says 40 should land on 40,
     * not on 1, so the first Down means 41.
     */
    initialIndex?: number;
    /** Handled before the arrows — Escape, or left/right on a tree. True means taken. */
    extraKeys?: (event: ReactKeyboardEvent, active: number) => boolean;
    /**
     * The scrolling list, so the highlight can be kept in view. The caller owns it
     * rather than the hook handing one back: a ref that arrives as a property of a
     * returned object is a ref read during render, and the lint rule that catches real
     * instances of that cannot tell this one apart.
     */
    listRef?: React.RefObject<HTMLDivElement | null>;
}): ListCursor => {
    const [cursor, setCursor] = useState<{ key: string; index: number }>({ key: resetKey, index: 0 });

    const fresh = initialIndex !== undefined && initialIndex >= 0 ? initialIndex : firstPickable(length, isPickable);
    const active = Math.min(cursor.key === resetKey ? cursor.index : fresh, Math.max(length - 1, 0));

    useEffect(() => {
        listRef?.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
    }, [active, listRef]);

    const move = (index: number) => setCursor((prev) => (prev.key === resetKey && prev.index === index ? prev : { key: resetKey, index }));

    /**
     * Stepping reads the previous cursor rather than this render's `active`, so holding
     * Down moves one row per key press. Two presses that land in the same React batch
     * would otherwise both start from the same index and only one of them would count.
     */
    const moveBy = (dir: 1 | -1) =>
        setCursor((prev) => {
            const from = prev.key === resetKey ? Math.min(prev.index, Math.max(length - 1, 0)) : fresh;
            return { key: resetKey, index: stepFrom(from, dir, length, isPickable) };
        });

    const onKeyDown = (event: ReactKeyboardEvent) => {
        /** Ours now — don't let an enclosing widget act on it as well. */
        const take = () => {
            event.preventDefault();
            event.stopPropagation();
        };

        if (!isOpen) {
            if (event.key === "ArrowDown" && onOpen) {
                take();
                onOpen();
            }
            return;
        }
        if (extraKeys?.(event, active)) {
            event.stopPropagation();
            return;
        }
        if (length === 0) return;

        if (event.key === "ArrowDown") {
            take();
            moveBy(1);
        } else if (event.key === "ArrowUp") {
            take();
            moveBy(-1);
        } else if (event.key === "Enter" && isPickable(active)) {
            take();
            onEnter(active);
        }
    };

    return { active, move, onKeyDown };
};

/** The highlight. Pink at low alpha reads as "you are here" without competing with selection. */
export const activeRowStyle = (pink: string) => ({ backgroundColor: `${pink}14`, outline: `1px solid ${pink}`, outlineOffset: "-1px" });

/** "7 of 50 keywords" while filtering, "50 keywords" while browsing. */
export const resultCount = (matched: number, total: number, noun: string, filtering: boolean) =>
    filtering ? `${matched} of ${total} ${noun}` : `${total} ${noun}`;
