import { CurrencyDollar } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { PINK, TEAL } from "../../das-shell";
import { usd2 } from "../studio-data";

/**
 * BidRangeField — the eCPM bid with its recommended range drawn as a track, so "where
 * does my bid sit?" is visible, not just described.
 */
export const BidRangeField = ({ value, onChange, recommended, error }: { value?: number; onChange?: (v?: number) => void; recommended: [number, number]; error?: string }) => {
    const [lo, hi] = recommended;
    const min = lo * 0.5;
    const max = hi * 1.5;
    const pos = (v: number) => `${Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))}%`;
    const where = value === undefined ? undefined : value < lo ? "below" : value > hi ? "above" : "within";
    return (
        <div className="flex flex-col gap-3">
            <Input
                label="Bid (eCPM)"
                size="md"
                icon={CurrencyDollar}
                placeholder={lo.toFixed(2)}
                value={value === undefined ? "" : String(value)}
                onChange={(v) => onChange?.(v === "" ? undefined : Number(v.replace(/[^0-9.]/g, "")) || undefined)}
                isInvalid={Boolean(error)}
                hint={error ?? `Recommended ${usd2(lo)} – ${usd2(hi)}. Bidding near the upper end usually wins more auctions.`}
                wrapperClassName="max-w-xs"
            />
            <div className="flex max-w-md flex-col gap-1.5" aria-hidden="true">
                <div className="relative h-2 rounded-full bg-quaternary">
                    <span className="absolute inset-y-0 rounded-full" style={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)})`, backgroundColor: `${TEAL}66` }} />
                    {value !== undefined && (
                        <span
                            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                            style={{ left: pos(value), backgroundColor: where === "within" ? TEAL : PINK }}
                        />
                    )}
                </div>
                <div className="relative h-4 text-[11px] text-tertiary">
                    <span className="absolute -translate-x-1/2" style={{ left: pos(lo) }}>
                        {usd2(lo)}
                    </span>
                    <span className="absolute -translate-x-1/2" style={{ left: pos(hi) }}>
                        {usd2(hi)}
                    </span>
                </div>
                {where && (
                    <span className="text-xs font-medium" style={{ color: where === "within" ? "#1F7F80" : "#A94579" }}>
                        {where === "within" ? "Within the recommended range" : where === "below" ? "Below range: expect fewer wins" : "Above range: likely to overpay"}
                    </span>
                )}
            </div>
        </div>
    );
};
