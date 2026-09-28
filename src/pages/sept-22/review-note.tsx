import type { ReactNode } from "react";
import { MessageTextSquare02 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../deal-activation-system/das-shell";
import type { FeedbackItem } from "./feedback";

/**
 * Sept 22 review — annotation and comparison chrome.
 *
 * These are review artefacts, not product UI. They are pink so they never get mistaken
 * for the teal ConceptNote that annotates the concepts themselves: teal means "here is
 * what this concept explores", pink means "here is what the review asked us to change".
 */

const GRAY = "#98A2B3";

/** What was said on the call, and what we decided to do about it. */
export const ReviewNote = ({ item, compact: isCompact }: { item: FeedbackItem; compact?: boolean }) => (
    <aside className="flex gap-3 rounded-xl border border-dashed px-4 py-3" style={{ borderColor: `${PINK}80`, backgroundColor: `${PINK}0d` }}>
        <MessageTextSquare02 className="mt-0.5 size-5 shrink-0" style={{ color: PINK }} aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-semibold text-primary">
                <span style={{ color: PINK }}>Sept 22 · {item.n}</span> · {item.title}
                <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ color: "#A94579", backgroundColor: `${PINK}24` }}>
                    {item.status}
                </span>
            </p>
            <blockquote className="border-l-2 pl-3 text-sm text-secondary italic" style={{ borderColor: `${PINK}66` }}>
                “{item.quotes[0]}”
                <footer className="mt-0.5 text-xs text-tertiary not-italic">Product, Sep 22 review</footer>
            </blockquote>
            {!isCompact && (
                <ul className="list-disc space-y-0.5 pl-4 text-sm text-tertiary">
                    {item.decision.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            )}
        </div>
    </aside>
);

/**
 * Two panes with a label above each. `before` is what was reviewed on Sep 22; `after` is
 * the revision. Stacks on narrow screens so nothing gets squeezed into illegibility.
 */
export const BeforeAfter = ({
    before,
    after,
    beforeLabel = "Reviewed Sep 22",
    afterLabel = "Revised",
    note,
    stacked,
}: {
    before: ReactNode;
    after: ReactNode;
    beforeLabel?: string;
    afterLabel?: string;
    /** One line under the pair, e.g. what to look at. */
    note?: ReactNode;
    /** Force one above the other — for wide things like charts. */
    stacked?: boolean;
}) => (
    <div className="flex flex-col gap-3">
        <div className={cx("grid gap-5", stacked ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
            <Pane label={beforeLabel} tone="before">
                {before}
            </Pane>
            <Pane label={afterLabel} tone="after">
                {after}
            </Pane>
        </div>
        {note && <p className="text-sm text-tertiary">{note}</p>}
    </div>
);

const Pane = ({ label, tone, children }: { label: string; tone: "before" | "after"; children: ReactNode }) => {
    const color = tone === "after" ? TEAL : GRAY;
    return (
        <section className="flex min-w-0 flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase" style={{ color, backgroundColor: `${color}1f` }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                {label}
            </span>
            <div className="min-w-0 rounded-2xl bg-primary p-5 ring-1 ring-secondary">{children}</div>
        </section>
    );
};

/** Page wrapper for the non-fullscreen comparison stories. */
export const ReviewPage = ({ item, children }: { item: FeedbackItem; children: ReactNode }) => (
    <div className="flex min-h-screen flex-col gap-6 bg-secondary px-8 py-8">
        <ReviewNote item={item} />
        {children}
    </div>
);
