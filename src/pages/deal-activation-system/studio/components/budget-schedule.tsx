import { parseDate } from "@internationalized/date";
import { CurrencyDollar } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { END_OF_DAY, START_OF_DAY, timeString, toTime, todayDate } from "../../dates";
import { DateTimePicker } from "../../round-1-components/datetime-picker";
import { type BudgetType, usd0 } from "../studio-data";

/**
 * BudgetSchedule — daily or lifetime budget, then start and (optional) end on the shared
 * date & time picker (calendar + available times, UTC). The line under the amount turns
 * the choice into money: what a day or the whole flight can cost at most.
 */

export interface BudgetScheduleValue {
    budgetType: BudgetType;
    budget?: number;
    start?: string;
    end?: string;
    startTime?: string;
    endTime?: string;
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
    const today = todayDate();
    const dateField = (which: "start" | "end") => {
        const isStart = which === "start";
        const date = value[which] ? parseDate(value[which]!) : undefined;
        const start = value.start ? parseDate(value.start) : undefined;
        return (
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">{isStart ? "Start" : "End"}</span>
                <DateTimePicker
                    label={isStart ? "Start" : "End"}
                    value={{ date, time: toTime(isStart ? value.startTime : value.endTime, isStart ? START_OF_DAY : END_OF_DAY) }}
                    onChange={(v) =>
                        set(isStart ? { start: v.date?.toString(), startTime: timeString(v.time) } : { end: v.date?.toString(), endTime: timeString(v.time) })
                    }
                    minValue={isStart ? today : (start ?? today)}
                    notBefore={!isStart && start ? { date: start, time: toTime(value.startTime, START_OF_DAY) } : undefined}
                    invalid={Boolean(errors[which])}
                    defaultOpen={openCalendar === which}
                    placeholder={isStart ? "Select start" : "Select end"}
                />
                {errors[which] && <span className="text-sm text-error-primary">{errors[which]}</span>}
            </div>
        );
    };

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                {dateField("start")}
                {value.hasEnd && <span className="hidden pt-9 text-quaternary sm:block">→</span>}
                {value.hasEnd && dateField("end")}
            </div>
            <Checkbox label="Set an end date" isSelected={value.hasEnd} onChange={(hasEnd) => set({ hasEnd })} hint={value.hasEnd ? undefined : "Runs until you pause it."} />
            <p className="text-xs text-tertiary italic">All times are UTC. Past dates can't be picked.</p>
        </div>
    );
};
