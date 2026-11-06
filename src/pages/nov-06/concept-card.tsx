import { type Campaign, campaigns } from "../../../prototypes/das/v6/screens/campaign-data";
import type { DeliveryVariant } from "../../../prototypes/das/v6/screens/campaign-series";
import { DeliveryChart } from "../../../prototypes/das/v6/screens/delivery-chart";
import { Variant } from "./note";

/** One Delivery chart concept, shown with what it is, why it works and what to watch for (Nov 6 Edits). */

export interface Concept {
    variant: DeliveryVariant;
    letter: string;
    title: string;
    how: string;
    good: string[];
    watch: string[];
}

const atRisk = campaigns.find((c) => c.id === "c2")!;

export const ConceptCard = ({ concept, c = atRisk }: { concept: Concept; c?: Campaign }) => (
    <Variant
        kind={concept.variant === "overlay" ? "6 Nov" : "Concept"}
        title={`${concept.letter} · ${concept.title}${concept.variant === "overlay" ? " (chosen 6 Nov)" : ""}`}
    >
        <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary">
            <p className="max-w-[820px] text-md text-secondary">{concept.how}</p>
            <DeliveryChart c={c} variant={concept.variant} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p className="text-md font-bold text-primary">Works because</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-md text-secondary">
                        {concept.good.map((g) => (
                            <li key={g}>{g}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-md font-bold text-primary">Watch for</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-md text-secondary">
                        {concept.watch.map((w) => (
                            <li key={w}>{w}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </Variant>
);
