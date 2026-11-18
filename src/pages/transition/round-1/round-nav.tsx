import { useEffect, useState } from "react";
import { INK, LINE, MUTED, PINK_DARK, story } from "../../intro/tokens";
import { ITEMS } from "../data";
import { FINDINGS } from "../round-1-styles";
import { NAV_OFFSET, PAGES, type RoundPage, at } from "./round-pages";

/**
 * The bar that stays at the top of every Round 1 page: the round's pages on one line, and
 * its 16 items on the next. The item being read is filled in as the page scrolls, with its
 * title beside the row, so an ID is never a bare number.
 *
 * Item links are full addresses (page + #id), so they can be copied. On the page already
 * open, .storybook/hash-links.ts turns the click into a scroll.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';

const TABS: [RoundPage, string][] = [
    ["summary", "Summary"],
    ["changes", "Changes"],
    ["beforeAfter", "Before and after"],
    ["styleGuide", "Style guide"],
    ["components", "Components"],
];

const CHANGES = ITEMS.filter((i) => i.round === "Round 1");
const IDS = CHANGES.map((i) => i.id);
const OPEN = new Set(FINDINGS.filter((f) => f.open).map((f) => f.id));

/** The item a link points at, if it is one of the round's: "…#R1-09" gives "R1-09". */
const itemOf = (href: string | null) => {
    const id = href?.split("#")[1];
    return id && IDS.includes(id) ? id : null;
};

/**
 * The item being read: the lowest card that has passed under the bar. A card near the end
 * of a page cannot scroll that far, so an item that was just jumped to stays the answer
 * until the reader scrolls away from where the jump landed.
 */
const useItemInView = () => {
    const [active, setActive] = useState<string | null>(null);
    useEffect(() => {
        let frame = 0;
        // While a jump settles (the scroll runs, pictures above it load and push the page), wherever the page is counts as where it landed.
        let jumped: { id: string; y: number; settling: boolean } | null = null;
        let settle = 0;

        const read = () => {
            frame = 0;
            if (jumped) {
                if (jumped.settling) jumped.y = window.scrollY;
                if (Math.abs(window.scrollY - jumped.y) < 32) return setActive(jumped.id);
                jumped = null;
            }
            let current: string | null = null;
            let top = -Infinity;
            for (const id of IDS) {
                const y = document.getElementById(id)?.getBoundingClientRect().top;
                if (y !== undefined && y <= NAV_OFFSET + 12 && y > top) {
                    top = y;
                    current = id;
                }
            }
            setActive(current);
        };
        const queue = () => {
            if (!frame) frame = requestAnimationFrame(read);
        };
        const hold = (id: string, ms: number) => {
            if (!document.getElementById(id)) return;
            const mine = { id, y: window.scrollY, settling: true };
            jumped = mine;
            window.clearTimeout(settle);
            settle = window.setTimeout(() => {
                mine.y = window.scrollY;
                mine.settling = false;
            }, ms);
            queue();
        };
        /** The reader scrolling by hand lets go of the held item at once. */
        const release = () => {
            if (!jumped) return;
            jumped = null;
            queue();
        };
        const onKey = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) release();
        };
        const onClick = (e: MouseEvent) => {
            const id = itemOf((e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href") ?? null);
            if (id) hold(id, 1400);
        };

        // A page opened on an item (a link from the board, or from another page): its pictures are still arriving.
        try {
            const id = itemOf(window.parent.location.hash);
            if (id) hold(id, 3500);
        } catch {
            /* no outer window to read */
        }
        read();
        document.addEventListener("click", onClick);
        window.addEventListener("scroll", queue, { passive: true });
        window.addEventListener("resize", queue);
        window.addEventListener("wheel", release, { passive: true });
        window.addEventListener("touchmove", release, { passive: true });
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("click", onClick);
            window.removeEventListener("scroll", queue);
            window.removeEventListener("resize", queue);
            window.removeEventListener("wheel", release);
            window.removeEventListener("touchmove", release);
            window.removeEventListener("keydown", onKey);
            window.clearTimeout(settle);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);
    return active;
};

export const RoundNav = ({ page }: { page: RoundPage }) => {
    const active = useItemInView();
    const [hover, setHover] = useState<string | null>(null);
    const shown = CHANGES.find((i) => i.id === (hover ?? active));
    return (
        <>
            {/* A jumped-to card stops below the bar, not under it. */}
            <style>{`[id^="R1-"], #open-questions, #recheck, #gallery { scroll-margin-top: ${NAV_OFFSET}px; }`}</style>
            <nav
                aria-label="Round 1"
                className="sb-unstyled"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    margin: "0 -14px 10px",
                    padding: "6px 14px 10px",
                    background: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(8px)",
                    borderBottom: `1px solid ${LINE}`,
                    fontFamily: FONT,
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2px 22px" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: PINK_DARK }}>Round 1</span>
                    {TABS.map(([key, label]) => {
                        const here = key === page;
                        return (
                            <a
                                key={key}
                                href={story(PAGES[key])}
                                target="_top"
                                aria-current={here ? "page" : undefined}
                                style={{
                                    fontSize: 15,
                                    fontWeight: here ? 800 : 600,
                                    color: here ? INK : MUTED,
                                    textDecoration: "none",
                                    padding: "8px 0 6px",
                                    borderBottom: `3px solid ${here ? PINK_DARK : "transparent"}`,
                                }}
                            >
                                {label}
                            </a>
                        );
                    })}
                </div>
                {page !== "components" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {CHANGES.map((i) => {
                                const on = i.id === active;
                                return (
                                    <a
                                        key={i.id}
                                        href={at(page, i.id)}
                                        target="_top"
                                        title={`${i.id} · ${i.title}`}
                                        aria-label={`${i.id}, ${i.title}`}
                                        aria-current={on ? "location" : undefined}
                                        onMouseEnter={() => setHover(i.id)}
                                        onMouseLeave={() => setHover(null)}
                                        onFocus={() => setHover(i.id)}
                                        onBlur={() => setHover(null)}
                                        style={{
                                            position: "relative",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 36,
                                            height: 30,
                                            borderRadius: 8,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            fontVariantNumeric: "tabular-nums",
                                            textDecoration: "none",
                                            color: on ? "#FFFFFF" : INK,
                                            background: on ? INK : i.id === hover ? "#F2F4F7" : "#FFFFFF",
                                            border: `1px solid ${on ? INK : "#D0D5DD"}`,
                                        }}
                                    >
                                        {i.id.slice(3)}
                                        {OPEN.has(i.id) && (
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    position: "absolute",
                                                    top: -3,
                                                    right: -3,
                                                    width: 9,
                                                    height: 9,
                                                    borderRadius: 99,
                                                    background: PINK_DARK,
                                                    border: "2px solid #FFFFFF",
                                                }}
                                            />
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                        <div
                            aria-live="off"
                            style={{ minWidth: 0, flex: "1 1 0", fontSize: 15, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                            {shown ? (
                                <>
                                    <b style={{ color: INK }}>{shown.id}</b> {shown.title}
                                </>
                            ) : (
                                <>
                                    {CHANGES.length} items
                                    {OPEN.size > 0 && (
                                        <>
                                            {" · "}
                                            <span
                                                aria-hidden="true"
                                                style={{ display: "inline-block", width: 8, height: 8, borderRadius: 99, background: PINK_DARK, margin: "0 5px 1px 2px" }}
                                            />
                                            open question
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};
