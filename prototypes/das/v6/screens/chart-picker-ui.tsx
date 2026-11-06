import { ChevronDown } from "@untitledui/icons";
import { DELIVERY_OPTIONS, type DeliveryVariant, setDeliveryChoice, useDeliveryChoice } from "./campaign-series";
import { PINK } from "./das-shell";

/**
 * 6 Nov: the Chart menu in the dark prototype toolbar, on every campaign overview. It
 * switches the Delivery chart between Round 6 and concepts A–I in the page itself, and
 * the choice holds as you move between campaigns. Prototype chrome, not product UI: it
 * matches the toolbar's 12px controls, like the Copy switch (see type-rules.test.ts).
 */
export const ChartPicker = () => {
    const chart = useDeliveryChoice();
    // Pink once you've moved off the default, so a screenshot shows it isn't C.
    const changed = chart !== "stacked";
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/60">Chart</span>
            {/* The native arrow is hidden (appearance-none) and drawn instead, as in the Copy switch. */}
            <div className="relative flex items-center">
                <select
                    aria-label="Delivery chart"
                    title="Which Delivery chart the campaign overview shows (6 Nov concepts). C is the default."
                    value={chart}
                    onChange={(e) => setDeliveryChoice(e.target.value as DeliveryVariant)}
                    className="cursor-pointer appearance-none rounded-md border border-white/15 py-1 pr-7 pl-2 text-xs font-semibold outline-none focus:border-white/40"
                    style={
                        changed
                            ? { backgroundColor: PINK, color: "#101828", borderColor: PINK }
                            : { backgroundColor: "rgb(255 255 255 / 0.05)", color: "white" }
                    }
                >
                    {[...new Set(DELIVERY_OPTIONS.map((o) => o.group))].map((group) => (
                        <optgroup key={group} label={group} className="bg-white text-black">
                            {DELIVERY_OPTIONS.filter((o) => o.group === group).map((o) => (
                                <option key={o.id} value={o.id} className="bg-white text-black">
                                    {o.label}
                                    {o.id === "stacked" ? " (default)" : ""}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 size-3.5" style={{ color: changed ? "#101828" : "white" }} aria-hidden="true" />
            </div>
        </div>
    );
};
