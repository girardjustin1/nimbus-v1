import { CurrencyDollar, InfoCircle } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { END_OF_DAY, START_OF_DAY } from "@/pages/deal-activation-system/dates";
import { DateTimePicker } from "@/pages/deal-activation-system/round-1-components/datetime-picker";
import { Fillable } from "../../../shared/demo-fill-ui";
import type { FieldError, Setter } from "../../v1/screens/campaign-setup-one-page";
import { Section } from "./das-shell";
import { LABEL } from "./type-rules";
import { ORIGINAL, useCopy } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import { type SetupForm, TODAY, fill, flightDays } from "../../v1/screens/setup-data";

/**
 * Budget, for Round 3.
 *
 * Forked from Round 1 to drop a field. Daily Impression Cap is gone: it was a bare
 * text box that held nothing — uncontrolled, unvalidated, and happy to accept "sdfsd"
 * — and briefly a dollar amount, at which point it stopped being an impression cap at
 * all and became an unlabelled spend cap. Removed rather than renamed, on 3 Oct. If it
 * comes back it needs a decision about what it counts first.
 *
 * Budget and Bid Amount are the two fields left, so they get half the row each instead
 * of a third and a gap.
 *
 * The flight dates have moved out into a section of their own, directly underneath.
 * When a campaign runs is not a budgeting question — it is the other half of what you
 * are committing to, it is the thing most often wrong on a campaign that didn't serve,
 * and it was four controls tucked under two. It reads at the same level as Budget now,
 * with its own heading and its own sentence saying what it does.
 *
 * The picker row itself is Round 1's, copied across unchanged.
 */

const FlightDates = ({ form, set, error, calendarOpen }: { form: SetupForm; set: Setter; error: FieldError; calendarOpen?: boolean }) => {
    const days = flightDays(form);
    const copy = useCopy();
    const field = (which: "start" | "end") => {
        const err = error(which);
        const isStart = which === "start";
        return (
            <div className="flex flex-col gap-1.5">
                <span className={LABEL}>
                    <Copy>{isStart ? "Start" : "End"}</Copy> <span className="text-brand-tertiary">*</span>
                </span>
                <Fillable filled={Boolean(form[which])} onFill={() => set(isStart ? { start: fill.start() } : { end: fill.end() })}>
                    <DateTimePicker
                        label={isStart ? "Start" : "End"}
                        value={{ date: form[which], time: (isStart ? form.startTime : form.endTime) ?? (isStart ? START_OF_DAY : END_OF_DAY) }}
                        onChange={(v) => set(isStart ? { start: v.date, startTime: v.time } : { end: v.date, endTime: v.time })}
                        minValue={isStart ? TODAY : (form.start ?? TODAY)}
                        today={TODAY}
                        notBefore={!isStart && form.start ? { date: form.start, time: form.startTime ?? START_OF_DAY } : undefined}
                        invalid={Boolean(err)}
                        defaultOpen={calendarOpen && isStart}
                        placeholder={copy.text(isStart ? "Select start" : "Select end") ?? ""}
                    />
                </Fillable>
                {err && (
                    <span className="text-md text-error-primary">
                        <Copy>{err}</Copy>
                    </span>
                )}
            </div>
        );
    };
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                {field("start")}
                <span className="hidden pt-9 text-quaternary sm:block">→</span>
                {field("end")}
                {days && (
                    <span className="text-md text-tertiary sm:pt-9">
                        <Copy>{`${days}-day flight`}</Copy>
                    </span>
                )}
            </div>
            <p className="text-md text-tertiary italic">
                <Copy>All scheduling times are in UTC. Past dates can't be picked.</Copy>
            </p>
        </div>
    );
};

export const BudgetSectionV3 = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => {
    const copy = useCopy();
    const title = <Copy original={ORIGINAL.budget}>Budget</Copy>;
    if (form.rule === "Fallback") {
        return (
            <Section id="budget" title={title}>
                <p className="flex items-center gap-2 text-md text-tertiary">
                    <InfoCircle className="size-4" aria-hidden="true" /> <Copy>Fallback campaigns have no budget or eCPM. Set the flight dates below.</Copy>
                </p>
            </Section>
        );
    }

    return (
        <Section
            id="budget"
            title={title}
            description={<Copy>Pacing is front-loaded hourly: up to 1/24th of the daily budget spends at the start of each hour.</Copy>}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Fillable filled={Boolean(form.budget)} onFill={() => set({ budget: fill.budget() })}>
                    <Input
                        label={copy.text("Budget", ORIGINAL.budget)}
                        size="md"
                        icon={CurrencyDollar}
                        placeholder="0.00"
                        value={form.budget}
                        onChange={(budget) => set({ budget })}
                        isRequired
                        isInvalid={Boolean(error("budget"))}
                        hint={error("budget") ? <Copy>{error("budget")}</Copy> : <Copy original={ORIGINAL.budgetDescription}>Spent across the whole flight.</Copy>}
                    />
                </Fillable>
                <Fillable filled={Boolean(form.ecpm)} onFill={() => set({ ecpm: fill.ecpm() })}>
                    <Input
                        label={copy.text("Bid Amount (eCPM)", ORIGINAL.bidAmount)}
                        className={copy.mark({ label: ["Bid Amount (eCPM)", ORIGINAL.bidAmount] })}
                        size="md"
                        icon={CurrencyDollar}
                        placeholder="0.00"
                        value={form.ecpm}
                        onChange={(ecpm) => set({ ecpm })}
                        isRequired
                        isInvalid={Boolean(error("ecpm"))}
                        hint={error("ecpm") ? <Copy>{error("ecpm")}</Copy> : <Copy original={ORIGINAL.bidDescription}>Selling value, not a floor.</Copy>}
                    />
                </Fillable>
            </div>
        </Section>
    );
};

/**
 * Flight Dates — when the campaign runs.
 *
 * Its own section as of 3 Oct. Every other decision on this form is about who sees the
 * campaign and what it costs; this is the one that decides whether it serves at all,
 * and a campaign whose flight has already ended looks identical to one that is live
 * until you go looking for these two fields.
 */
export const FlightDatesSection = ({ form, set, error, calendarOpen }: { form: SetupForm; set: Setter; error: FieldError; calendarOpen?: boolean }) => (
    <Section
        id="flight"
        title={<Copy>Flight Dates</Copy>}
        description={<Copy>When this campaign starts and stops serving. It won't deliver outside these dates, and it goes live automatically at the start time.</Copy>}
    >
        <FlightDates form={form} set={set} error={error} calendarOpen={calendarOpen} />
    </Section>
);
