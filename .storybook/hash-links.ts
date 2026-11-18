/**
 * Anchor links inside docs pages.
 *
 * A docs page renders in Storybook's preview frame, but its address (and its #anchor) lives on
 * the window around it. Storybook scrolls to the anchor once, when a page first loads. A link
 * to another anchor on the page already open changes only the outer address: nothing reloads,
 * so nothing scrolls. This module does the scrolling for those links:
 *
 *   - a click on a link whose target is an anchor on the open page scrolls there, and writes
 *     the anchor to the outer address so the link can be copied;
 *   - the outer address changing its anchor (back, forward, a pasted link) scrolls there too;
 *   - after a first load, the scroll is repeated once the page's pictures have settled, since
 *     a long page shifts under the first one.
 */

const outer = (): Window => {
    try {
        // Same origin, so this is readable; a sandboxed embed would throw.
        void window.parent.location.href;
        return window.parent;
    } catch {
        return window;
    }
};

/** The id of the page that is open, e.g. "transition-round-1-summary--docs". */
const openPage = (): string | null => {
    const read = (w: Window) => {
        const q = new URLSearchParams(w.location.search);
        return q.get("path")?.split("/")[2] ?? q.get("id");
    };
    return read(outer()) ?? read(window);
};

const scrollToId = (id: string, smooth = true): boolean => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    return true;
};

/** The anchor a link points at, if that anchor is on the page already open. */
const samePageAnchor = (a: HTMLAnchorElement): string | null => {
    const href = a.getAttribute("href") ?? "";
    const hashAt = href.indexOf("#");
    if (hashAt < 0 || hashAt === href.length - 1) return null;
    const id = decodeURIComponent(href.slice(hashAt + 1));
    // A prototype route ("…/app/v2/#/realtime") is not an anchor.
    if (id.startsWith("/")) return null;
    const before = href.slice(0, hashAt);
    if (before === "") return id;
    const path = new URLSearchParams(before.split("?")[1] ?? "").get("path");
    return path && path.split("/")[2] === openPage() ? id : null;
};

const setOuterHash = (id: string) => {
    try {
        const w = outer();
        w.history.replaceState(w.history.state, "", `${w.location.pathname}${w.location.search}#${encodeURIComponent(id)}`);
    } catch {
        /* the scroll already happened; the address is a nicety */
    }
};

let installed = false;

export const installHashLinks = () => {
    if (installed || typeof window === "undefined") return;
    installed = true;

    document.addEventListener("click", (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
        if (!a) return;
        const id = samePageAnchor(a);
        if (!id || !document.getElementById(id)) return;
        e.preventDefault();
        scrollToId(id);
        setOuterHash(id);
    });

    const fromOuterHash = (smooth: boolean) => {
        const hash = outer().location.hash;
        if (hash.length > 1 && !hash.startsWith("#/")) scrollToId(decodeURIComponent(hash.slice(1)), smooth);
    };

    try {
        outer().addEventListener("hashchange", () => fromOuterHash(true));
    } catch {
        /* no outer window to listen to */
    }

    // First load: once more after the pictures above the target have taken their space.
    window.addEventListener("load", () => {
        window.setTimeout(() => fromOuterHash(false), 600);
        window.setTimeout(() => fromOuterHash(false), 1800);
    });
};
