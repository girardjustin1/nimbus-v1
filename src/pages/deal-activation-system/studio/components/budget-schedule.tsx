import { parseDate } from "@internationalized/date";
import { CurrencyDollar } from "@untitledui/icons";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { type BudgetType, usd0 } from "../studio-data";

/**
 * BudgetSchedule — daily or lifetime budget, then start and (optional) end dates on
 * calendar pickers. The line under the amount turns the choice into money: what a day
 * or the whole flight can cost at most.
 */

const TODAY = parseDate("2026-09-18");

export interface BudgetScheduleValue {
    budgetType: BudgetType;
    budget?: number;
    start?: string;
    end?: string;
    hasEnd: boolean;
}

export const BudgetSchedule = ({
    value,
    onChange,
    days,
    errors = {},
    hideBudget,
    openCalendar,
}: {
    value: BudgetScheduleValue;
    onChange?: (p: Partial<BudgetScheduleValue>) => void;
    days: number;
    errors?: Partial<Record<"budget" | "start" | "end", string>>;
    /** Fallback campaigns have no budget. */
    hideBudget?: boolean;
    openCalendar?: "start" | "end";
}) => {
    const set = (p: Partial<BudgetScheduleValue>) => onChange?.(p);
    const dateField = (which: "start" | "end") => (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">{which === "start" ? "Start date" : "End date"}</span>
            <div className="flex items-center gap-2">
                <div className={cx("rounded-lg", errors[which] && "ring-2 ring-error_subtle ring-offset-1")}>
                    <DatePicker
                        aria-label={which === "start" ? "Start date" : "End date"}
                        size="md"
                        value={value[which] ? parseDate(value[which]!) : null}
                        onChange={(v) => set({ [which]: v ? v.toString() : undefined })}
                        minValue={TODAY}
                        defaultOpen={openCalendar === which}
                    />
                </div>
                <Input aria-label={`${which} time (UTC)`} size="md" defaultValue={which === "start" ? "00:00" : "23:59"} wrapperClassName="w-24" />
            </div>
            {errors[which] && <span className="text-sm text-error-primary">{errors[which]}</span>}
        </div>
    );

    return (
        <div className="flex flex-col gap-5">
            {!hideBudget && (
                <>
                    <div className="flex gap-1" role="radiogroup" aria-label="Budget type">
                        {(["daily", "lifetime"] as BudgetType[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={value.budgetType === t}
                                onClick={() => set({ budgetType: t })}
                                className={cx(
                                    "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
                                    value.budgetType === t ? "bg-[#101828] text-white" : "bg-secondary text-secondary hover:bg-tertiary",
                                )}
                            >
                                {t} budget
                            </button>
                        ))}
                    </div>
                    <Input
                        label={value.budgetType === "daily" ? "Daily budget" : "Lifetime budget"}
                        size="md"
                        icon={CurrencyDollar}
                        placeholder="0"
                        value={value.budget === undefined ? "" : value.budget.toLocaleString("en-US")}
                        onChange={(v) => set({ budget: Number(v.replace(/[^0-9.]/g, "")) || undefined })}
                        isInvalid={Boolean(errors.budget)}
                        hint={
                            errors.budget ??
                            (value.budget
                                ? value.budgetType === "daily"
                                    ? `Up to ${usd0(value.budget * 2)} on busy days, never more than ${usd0(value.budget * days)} over ${days} days.`
                                    : `About ${usd0(value.budget / days)} a day, spread evenly over ${days} days.`
                                : "Spend paces evenly across the flight.")
                        }
                        wrapperClassName="max-w-xs"
                    />
                </>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {dateField("start")}
                {value.hasEnd && dateField("end")}
            </div>
            <Checkbox label="Set an end date" isSelected={value.hasEnd} onChange={(hasEnd) => set({ hasEnd })} hint={value.hasEnd ? undefined : "Runs until you pause it."} />
            <p className="text-xs text-tertiary italic">All times are UTC. Past dates can't be picked.</p>
        </div>
    );
};
