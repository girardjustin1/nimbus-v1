import type { ReactNode } from "react";
import { MessageTextSquare02 } from "@untitledui/icons";
import { PINK } from "../deal-activation-system/das-shell";
import type { FeedbackItem } from "./feedback";

/**
 * Oct 29 Edits — annotation chrome for the Round 6 stories.
 *
 * Same convention as Oct 17 and Oct 26: review artefacts in pink, so they're never
 * mistaken for a concept's own teal notes, held to the 15px floor like the screens.
 */

const TONE: Record<FeedbackItem["status"], string> = {
    Applied: "#1F7F80",
    Concept: "#3538CD",
    "To confirm": "#A94579",
    Pending: "#B54708",
};

export const ReviewNote = ({ item, quote = 0 }: { item: FeedbackItem; quote?: number }) => {
    const q = item.quotes[Math.min(quote, item.quotes.length - 1)];
    return (
        <aside className="flex gap-3 rounded-xl border border-dashed px-4 py-3" style={{ borderColor: `${PINK}80`, backgroundColor: `${PINK}0d` }}>
            <MessageTextSquare02 className="mt-0.5 size-5 shrink-0" style={{ color: PINK }} aria-hidden="true" />
            <div className="flex min-w-0 flex-col gap-2">
                <p className="text-md font-bold text-primary">
                    <span style={{ color: PINK }}>28 Oct review</span> · {item.title}
                    <span className="ml-2 rounded-full px-2 py-0.5 text-md font-semibold" style={{ color: TONE[item.status], backgroundColor: `${PINK}24` }}>
                        {item.status}
                    </span>
                </p>
                {q && (
                    <blockquote className="border-l-2 pl-3 text-md text-secondary italic" style={{ borderColor: `${PINK}66` }}>
                        “{q.text}”<footer className="mt-0.5 text-md text-tertiary not-italic">{q.who}, 28 Oct review</footer>
                    </blockquote>
                )}
                <ul className="list-disc space-y-0.5 pl-4 text-md text-tertiary">
                    {item.decision.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export type VariantKind = "Round 5" | "Round 6" | "Concept";

const KIND_STYLE: Record<VariantKind, { color: string; backgroundColor: string }> = {
    "Round 5": { color: "#667085", backgroundColor: "#F2F4F7" },
    "Round 6": { color: "white", backgroundColor: PINK },
    Concept: { color: "white", backgroundColor: "#3538CD" },
};

/** A label above a story so you know which round you are looking at. */
export const Variant = ({ kind, title, children }: { kind: VariantKind; title: string; children: ReactNode }) => (
    <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-md font-semibold">
            <span className="rounded-md px-2 py-0.5 text-md font-bold uppercase" style={KIND_STYLE[kind]}>
                {kind}
            </span>
            <span className="text-primary">{title}</span>
        </p>
        {children}
    </div>
);

/** Wraps a story so the annotations and the screen share one scroll. */
export const Compare = ({ items, kind, title, children }: { items: FeedbackItem[]; kind: VariantKind; title: string; children: ReactNode }) => (
    <div className="flex flex-col gap-5 bg-secondary p-6">
        {items.map((item) => (
            <ReviewNote key={item.slug} item={item} />
        ))}
        <Variant kind={kind} title={title}>
            <div className="overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary">{children}</div>
        </Variant>
    </div>
);
