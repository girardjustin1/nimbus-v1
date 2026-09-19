import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type GoalId, goals } from "../studio-data";

/**
 * GoalTiles — the first decision, as four large visual tiles. Each tile names what the
 * campaign will be judged on, so the auction rule is chosen by intent, not by jargon.
 */
export const GoalTiles = ({ value, onChange, invalid }: { value?: GoalId; onChange?: (g: GoalId) => void; invalid?: boolean }) => (
    <div role="radiogroup" aria-label="Campaign goal" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {goals.map((g) => {
            const on = value === g.id;
            return (
                <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onChange?.(g.id)}
                    className={cx(
                        "group flex flex-col overflow-hidden rounded-2xl bg-primary text-left transition-all duration-150",
                        on ? "ring-[3px] ring-offset-2" : invalid ? "ring-1 ring-error_subtle" : "ring-1 ring-secondary hover:-translate-y-0.5 hover:shadow-lg",
                    )}
                    style={on ? { ["--tw-ring-color" as string]: g.art[0] } : undefined}
                >
                    <span className="relative flex aspect-[4/3] items-end overflow-hidden p-4" style={{ background: `linear-gradient(150deg, ${g.art[0]}, ${g.art[1]})` }}>
                        <span className="absolute top-3 right-3 size-16 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }} />
                        <span className="absolute -bottom-6 -left-4 h-20 w-40 rotate-[-14deg] rounded-full opacity-25" style={{ background: g.art[0] }} />
                        {g.badge && <span className="absolute top-3 left-3 rounded-md bg-black/25 px-1.5 py-0.5 text-[11px] font-semibold text-white">{g.badge}</span>}
                        {on && (
                            <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-white">
                                <Check className="size-4" style={{ color: g.art[0] }} aria-hidden="true" />
                            </span>
                        )}
                        <span className="relative text-xl leading-tight font-bold text-white">{g.title}</span>
                    </span>
                    <span className="flex flex-col gap-1 p-4">
                        <span className="text-xs font-semibold text-tertiary uppercase">Judged on</span>
                        <span className="text-sm font-semibold text-primary">{g.measure}</span>
                        <span className="text-sm text-tertiary">{g.hint}</span>
                    </span>
                </button>
            );
        })}
    </div>
);
