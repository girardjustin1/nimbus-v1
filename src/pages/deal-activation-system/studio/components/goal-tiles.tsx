import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type GoalId, goals } from "../studio-data";
import { GoalIllustration } from "./goal-illustration";

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
                        on ? "ring-[3px] ring-brand ring-offset-2" : invalid ? "ring-1 ring-error_subtle" : "ring-1 ring-secondary hover:-translate-y-0.5 hover:shadow-lg",
                    )}
                >
                    <span className="relative block w-full border-b border-secondary bg-[#F9F7F3] pt-8">
                        <span className="block aspect-[13/8] w-full px-2">
                            <GoalIllustration goal={g.id} active={on} />
                        </span>
                        {g.badge && <span className="absolute top-3 left-3 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#101828] ring-1 ring-[#101828]/10">{g.badge}</span>}
                        {on && (
                            <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-[#101828] text-white">
                                <Check className="size-4" aria-hidden="true" />
                            </span>
                        )}
                        <span className="flex h-20 items-end px-3 pb-4 text-lg leading-tight font-bold text-[#101828] sm:px-4 sm:text-xl lg:text-lg xl:text-xl">{g.title}</span>
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
