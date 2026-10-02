import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "@/utils/cx";
import { Fillable } from "../../../shared/demo-fill-ui";
import { Section, TEAL } from "./das-shell";
import type { SetupForm } from "./setup-data";

/**
 * Priority and Frequency Cap.
 *
 * Both are sections in their own right rather than a field tucked into a neighbour,
 * because that is the weight the product gives them: each has a heading, a sentence
 * explaining what it does, and a Do not enable / Enable choice before any value.
 *
 * The Enable-first shape matters. Neither setting is on by default, and the default is
 * not "no value" but a defined behaviour — even distribution, and no cap. A disabled
 * control with a blank value would read as "unset"; the radio says which of two
 * behaviours you have chosen.
 */

type Setter = (patch: Partial<SetupForm>) => void;

/** 1 is highest. 100 options is the product's range. */
const PRIORITIES = Array.from({ length: 100 }, (_, i) => i + 1);

const labelFor = (n: number) => (n === 1 ? "1 — highest" : n === 100 ? "100 — lowest" : String(n));

/**
 * A hundred-row dropdown is a scroll, so this one is typeable: focus it and the list
 * opens, type "4" and it narrows to 4, 40–49. Picking from a list still works for anyone
 * who doesn't know the number they want.
 *
 * The product's control is a plain select. Filtering is ours, which is why the section
 * carries an Added chip.
 */
const PriorityPicker = ({ value, onChange, disabled }: { value?: number; onChange: (n: number) => void; disabled?: boolean }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Opening on the current value should show it, not the top of the list.
    useEffect(() => {
        if (!open || !value || query) return;
        listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "center" });
    }, [open, value, query]);

    const q = query.trim();
    const shown = q ? PRIORITIES.filter((n) => String(n).startsWith(q)) : PRIORITIES;

    const pick = (n: number) => {
        onChange(n);
        setQuery("");
        setOpen(false);
    };

    return (
        <div ref={wrapRef} className="relative max-w-xs flex-1">
            <Input
                aria-label="Priority"
                size="md"
                isDisabled={disabled}
                placeholder="Select or type a number"
                value={open ? query : value ? labelFor(value) : ""}
                onChange={(next) => {
                    setQuery(next.replace(/[^0-9]/g, ""));
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
            />
            {open && !disabled && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-label="Priority"
                    className="absolute top-full right-0 left-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-lg bg-primary py-1 shadow-lg ring-1 ring-secondary"
                >
                    {shown.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-tertiary">No priority matches “{q}”.</li>
                    ) : (
                        shown.map((n) => (
                            <li key={n}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={value === n}
                                    data-selected={value === n}
                                    onClick={() => pick(n)}
                                    className={cx("flex w-full items-center px-3 py-2 text-left text-sm hover:bg-secondary", value === n && "font-semibold")}
                                    style={value === n ? { color: TEAL } : undefined}
                                >
                                    {labelFor(n)}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

/**
 * The Do not enable / Enable pair the product uses for both of these settings.
 *
 * The control sits on the Enable row rather than below it, so the radio and the thing it
 * switches on read as one decision.
 */
const EnableChoice = ({
    enabled,
    onToggle,
    label,
    children,
}: {
    enabled: boolean;
    onToggle: (on: boolean) => void;
    /** What "off" means — never just "off", always the behaviour you get instead. */
    label: string;
    children: React.ReactNode;
}) => (
    <RadioGroup size="md" value={enabled ? "on" : "off"} onChange={(v) => onToggle(v === "on")} className="flex flex-col gap-5" aria-label={label}>
        <RadioButton value="off" label="Do not enable" hint={label} />
        <div className="flex flex-wrap items-center gap-4">
            <RadioButton value="on" label="Enable:" />
            {children}
        </div>
    </RadioGroup>
);

export const PrioritySection = ({ form, set }: { form: SetupForm; set: Setter }) => (
    <Section
        id="priority"
        title="Priority"
        description="Set the priority of this campaign versus other active campaigns. 1 is served first."
    >
        <EnableChoice
            enabled={form.priority !== undefined}
            onToggle={(on) => set({ priority: on ? (form.priority ?? 1) : undefined })}
            label="Nimbus defaults to even distribution."
        >
            <Fillable filled={form.priority !== undefined} onFill={() => set({ priority: 1 })}>
                <PriorityPicker value={form.priority} onChange={(priority) => set({ priority })} disabled={form.priority === undefined} />
            </Fillable>
            {form.priority !== undefined && <span className="text-sm text-tertiary">1 to 100. Type to jump to a number.</span>}
        </EnableChoice>
    </Section>
);

export const FrequencyCapSection = ({ form, set }: { form: SetupForm; set: Setter }) => {
    const on = form.freqCap !== undefined;
    const n = Number(form.freqCap);
    // Zero would switch the campaign off while reading as "a cap of none".
    const invalid = on && form.freqCap !== "" && (!Number.isFinite(n) || n < 1);
    return (
        <Section id="freqcap" title="Frequency Cap" description="Maximum number of times an ad from this campaign is shown to an individual user over a 24hr period.">
            <EnableChoice enabled={on} onToggle={(enable) => set({ freqCap: enable ? (form.freqCap ?? "") : undefined })} label="No cap — a user can see this campaign any number of times a day.">
                <Fillable filled={on} onFill={() => set({ freqCap: "3" })}>
                    <Input
                        aria-label="Frequency cap"
                        size="md"
                        inputMode="numeric"
                        className="max-w-xs"
                        isDisabled={!on}
                        placeholder="e.g. 3"
                        value={form.freqCap ?? ""}
                        onChange={(freqCap) => set({ freqCap: freqCap.replace(/[^0-9]/g, "") })}
                        isInvalid={invalid}
                        hint={invalid ? "Enter 1 or more. To stop serving, pause the campaign instead." : on ? "Impressions per user, per 24 hours." : undefined}
                    />
                </Fillable>
            </EnableChoice>
        </Section>
    );
};
