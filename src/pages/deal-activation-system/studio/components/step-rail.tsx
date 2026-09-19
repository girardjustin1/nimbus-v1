import { AlertCircle, Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { TEAL } from "../../das-shell";
import { type StepId, steps } from "../studio-data";

export type StepState = "done" | "current" | "todo" | "error";

/**
 * StepRail — where you are in the build, as a nested outline: the deal holds the
 * campaign, the campaign holds the creative. Each step shows done, current, to-do or
 * error, and completed steps stay clickable.
 */
export const StepRail = ({
    current,
    states,
    dealName,
    campaignName,
    hrefFor,
}: {
    current: StepId;
    states: Partial<Record<StepId, StepState>>;
    dealName?: string;
    campaignName?: string;
    hrefFor?: (s: StepId) => string;
}) => {
    const groups = [...new Set(steps.map((s) => s.group))];
    return (
        <nav aria-label="Steps" className="flex flex-col gap-4">
            {groups.map((group, gi) => (
                <div key={group} className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 px-2 text-xs font-semibold text-tertiary uppercase">
                        <span className="flex size-5 items-center justify-center rounded-md bg-secondary text-[10px] text-secondary">{gi + 1}</span>
                        {group}
                    </span>
                    {group === "Deal" && dealName && <span className="truncate px-2 pl-9 text-xs text-quaternary">{dealName}</span>}
                    {group === "Campaign" && campaignName && <span className="truncate px-2 pl-9 text-xs text-quaternary">{campaignName}</span>}
                    <ol className="ml-4.5 flex flex-col border-l border-secondary pl-3">
                        {steps
                            .filter((s) => s.group === group)
                            .map((s) => {
                                const state: StepState = s.id === current ? "current" : (states[s.id] ?? "todo");
                                const clickable = state !== "todo" && state !== "current";
                                const Tag = clickable && hrefFor ? "a" : "span";
                                return (
                                    <li key={s.id}>
                                        <Tag
                                            {...(Tag === "a" ? { href: hrefFor!(s.id) } : {})}
                                            aria-current={state === "current" ? "step" : undefined}
                                            className={cx(
                                                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                                                state === "current" ? "bg-secondary font-semibold text-primary" : state === "error" ? "font-medium text-error-primary" : state === "done" ? "text-secondary" : "text-quaternary",
                                                Tag === "a" && "hover:bg-primary_hover",
                                            )}
                                        >
                                            {state === "done" ? (
                                                <Check className="size-4 shrink-0" style={{ color: TEAL }} aria-label="Done" />
                                            ) : state === "error" ? (
                                                <AlertCircle className="size-4 shrink-0" aria-label="Needs attention" />
                                            ) : (
                                                <span className={cx("size-2 shrink-0 rounded-full", state === "current" ? "bg-fg-primary" : "bg-quaternary")} aria-hidden="true" />
                                            )}
                                            {s.title}
                                        </Tag>
                                    </li>
                                );
                            })}
                    </ol>
                </div>
            ))}
        </nav>
    );
};
