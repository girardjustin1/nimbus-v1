import type { ReactNode } from "react";
import { MessageTextSquare02 } from "@untitledui/icons";
import { PINK } from "../deal-activation-system/das-shell";
import type { FeedbackItem } from "./feedback";

/**
 * Oct 17 — annotation chrome for the Round 4 stories.
 *
 * Review artefacts, not product UI, and pink so they are never mistaken for the teal
 * notes that annotate a concept's own thinking. Same convention as the Oct 2 batch,
 * held to the 15px floor like the screens it sits above.
 */

const TONE: Record<FeedbackItem["status"], string> = {
    Applied: "#1F7F80",
    Decided: "#1F7F80",
    Concepts: "#B54708",
    "To confirm": "#A94579",
};

export const ReviewNote = ({ item, quote = 0 }: { item: FeedbackItem; quote?: number }) => (
    <aside className="flex gap-3 rounded-xl border border-dashed px-4 py-3" style={{ borderColor: `${PINK}80`, backgroundColor: `${PINK}0d` }}>
        <MessageTextSquare02 className="mt-0.5 size-5 shrink-0" style={{ color: PINK }} aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-2">
            <p className="text-md font-bold text-primary">
                <span style={{ color: PINK }}>{item.decidedOn ? `Decided ${item.decidedOn}` : "Oct 16 review"}</span> · {item.title}
                <span className="ml-2 rounded-full px-2 py-0.5 text-md font-semibold" style={{ color: TONE[item.status], backgroundColor: `${PINK}24` }}>
                    {item.status}
                </span>
            </p>
            <blockquote className="border-l-2 pl-3 text-md text-secondary italic" style={{ borderColor: `${PINK}66` }}>
                “{item.quotes[quote]}”
                <footer className="mt-0.5 text-md text-tertiary not-italic">Product, {item.quoteDates?.[quote] ?? "16 Oct review"}</footer>
            </blockquote>
            <ul className="list-disc space-y-0.5 pl-4 text-md text-tertiary">
                {item.decision.map((d, i) => (
                    <li key={i}>{d}</li>
                ))}
            </ul>
        </div>
    </aside>
);

export type VariantKind = "Round 3" | "Round 4" | "A" | "B" | "C" | "Chosen";

/** A label above a story so you know which one you are looking at. */
export const Variant = ({ kind, title, children }: { kind: VariantKind; title: string; children: ReactNode }) => {
    const before = kind === "Round 3";
    const chosen = kind === "Chosen";
    return (
        <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-md font-semibold">
                <span
                    className="rounded-md px-2 py-0.5 text-md font-bold uppercase"
                    style={before ? { color: "#667085", backgroundColor: "#F2F4F7" } : { color: "white", backgroundColor: chosen ? "#1F7F80" : PINK }}
                >
                    {kind}
                </span>
                <span className="text-primary">{title}</span>
            </p>
            {children}
        </div>
    );
};

/** Wraps a story so the annotation and the screen share one scroll. */
export const Compare = ({ item, quote, kind, title, children }: { item: FeedbackItem; quote?: number; kind: VariantKind; title: string; children: ReactNode }) => (
    <div className="flex flex-col gap-5 bg-secondary p-6">
        <ReviewNote item={item} quote={quote} />
        <Variant kind={kind} title={title}>
            <div className="overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary">{children}</div>
        </Variant>
    </div>
);
