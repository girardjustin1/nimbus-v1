import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "@/utils/cx";
import { Fillable } from "../../../shared/demo-fill-ui";
import { PINK, Section, TEAL } from "./das-shell";
import { LABEL } from "./type-rules";
import { ORIGINAL, useCopy } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import type { SetupForm } from "../../v1/screens/setup-data";
import { activeRowStyle, resultCount, useListCursor } from "./arrow-keys";
import { usePanelPlacement } from "./panel-placement";
import { useScrollLock } from "./scroll-lock";
import { KeyHint } from "./search-select";

/**
 * Priority and Frequency Cap.
 *
 * Forked from Round 1 to put Priority on the same keyboard as the other five
 * search-and-select controls: Down walks the list, Enter takes the highlighted number.
 * It is the one of the six where that matters most — the answer is always a number
 * within a few of the one already in the field, and reaching for the mouse to move from
 * 40 to 41 is absurd. Opening a field that already says 40 lands the highlight on 40,
 * so the first Down means 41.
 *
 * Everything else is Round 1's, unchanged:
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

/** Both settings are a whole number from 1 to 100. */
const ONE_TO_100 = Array.from({ length: 100 }, (_, i) => i + 1);

const priorityLabel = (n: number) => (n === 1 ? "1 — highest" : n === 100 ? "100 — lowest" : String(n));
const freqCapLabel = (n: number) => (n === 1 ? "1 — once a day" : `${n} a day`);

/**
 * A hundred-row dropdown is a scroll, so this one is typeable: focus it and the list
 * opens, type "4" and it narrows to 4, 40–49. Picking from a list still works for anyone
 * who doesn't know the number they want.
 *
 * Priority and Frequency Cap share it. They ask the same question — pick a number
 * between 1 and 100 — and the only reason they ever looked different is that one was
 * built as a select and the other as a text box. That is exactly the kind of accident
 * the 2 Oct review was about.
 *
 * The product's controls are a plain select and a plain input. Filtering is ours, which
 * is why the section carries an Added chip.
 */
const NumberPicker = ({
    name,
    labelFor,
    value,
    onChange,
    disabled,
}: {
    /** Names the field and the panel — "Priority", "Frequency cap". */
    name: string;
    labelFor: (n: number) => string;
    value?: number;
    onChange: (n: number) => void;
    disabled?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const copy = useCopy();
    const wrapRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    usePanelPlacement(open && !disabled, panelRef);
    useScrollLock(open && !disabled, panelRef);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    const q = query.trim();
    const shown = q ? ONE_TO_100.filter((n) => String(n).startsWith(q)) : ONE_TO_100;

    const pick = (n: number) => {
        onChange(n);
        setQuery("");
        setOpen(false);
    };

    const cursor = useListCursor({
        length: shown.length,
        resetKey: q,
        listRef,
        isOpen: open,
        onOpen: () => setOpen(true),
        // Opening on the current value should show it, not the top of the list.
        initialIndex: value ? shown.indexOf(value) : 0,
        onEnter: (i) => pick(shown[i]),
        extraKeys: (e) => {
            if (e.key !== "Escape") return false;
            setQuery("");
            setOpen(false);
            return true;
        },
    });

    return (
        <div ref={wrapRef} className="relative w-72 max-w-full" onKeyDownCapture={cursor.onKeyDown}>
            <Input
                aria-label={name}
                size="md"
                isDisabled={disabled}
                className={copy.mark({ placeholder: ["Select or type a number"] })}
                placeholder={copy.text("Select or type a number")}
                value={open ? query : value ? labelFor(value) : ""}
                onChange={(next) => {
                    setQuery(next.replace(/[^0-9]/g, ""));
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
            />
            {open && !disabled && (
                <div ref={panelRef} className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-lg bg-primary shadow-lg ring-1 ring-secondary">
                    <div className="flex items-center justify-between gap-3 border-b border-secondary px-3 py-2">
                        <span className="text-md font-semibold text-tertiary uppercase">
                            <Copy>{name}</Copy>
                        </span>
                        <span className="text-md font-medium text-tertiary tabular-nums"><Copy>{resultCount(shown.length, ONE_TO_100.length, "options", Boolean(q))}</Copy>
                        </span>
                    </div>
                    <div ref={listRef} role="listbox" aria-label={name} className="max-h-64 overflow-y-auto overscroll-contain py-1">
                        {shown.length === 0 ? (
                            <p className="px-3 py-2 text-md text-tertiary">
                                <Copy>{`No number matches “${q}”.`}</Copy>
                            </p>
                        ) : (
                            shown.map((n, i) => {
                                const active = i === cursor.active;
                                return (
                                    <button
                                        key={n}
                                        type="button"
                                        role="option"
                                        aria-selected={value === n}
                                        data-active={active}
                                        onMouseMove={() => cursor.move(i)}
                                        onClick={() => pick(n)}
                                        className={cx("flex w-full items-center px-3 py-2 text-left text-md", !active && "hover:bg-secondary", value === n && "font-semibold")}
                                        style={{ ...(value === n ? { color: TEAL } : {}), ...(active ? activeRowStyle(PINK) : {}) }}
                                    >
                                        {labelFor(n)}
                                    </button>
                                );
                            })
                        )}
                    </div>
                    <div className="border-t border-secondary px-3 py-2">
                        <KeyHint />
                    </div>
                </div>
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
        <RadioButton
            value="off"
            label={
                <span className={LABEL}>
                    <Copy original={ORIGINAL.doNotEnable}>Do not enable</Copy>
                </span>
            }
            hint={<Copy>{label}</Copy>}
        />
        <div className="flex flex-wrap items-center gap-4">
            <RadioButton
                value="on"
                label={
                    <span className={LABEL}>
                        <Copy original={ORIGINAL.enable}>Enable:</Copy>
                    </span>
                }
            />
            {children}
        </div>
    </RadioGroup>
);

export const PrioritySection = ({ form, set }: { form: SetupForm; set: Setter }) => (
    <Section
        id="priority"
        title={<Copy>Priority</Copy>}
        description={<Copy>Set the priority of this campaign versus other active campaigns. 1 is served first.</Copy>}
    >
        <EnableChoice
            enabled={form.priority !== undefined}
            onToggle={(on) => set({ priority: on ? (form.priority ?? 1) : undefined })}
            label="Nimbus defaults to even distribution."
        >
            <Fillable filled={form.priority !== undefined} onFill={() => set({ priority: 1 })}>
                <NumberPicker name="Priority" labelFor={priorityLabel} value={form.priority} onChange={(priority) => set({ priority })} disabled={form.priority === undefined} />
            </Fillable>
            {/* Always present: a hint that appears only once the radio is on makes the
                row reflow at the moment you are reading it. */}
            <span className="text-md text-tertiary">
                <Copy>1 to 100. Type to jump to a number, or ↑ ↓ to step through them.</Copy>
            </span>
        </EnableChoice>
    </Section>
);

export const FrequencyCapSection = ({ form, set }: { form: SetupForm; set: Setter }) => {
    const on = form.freqCap !== undefined;
    // The form carries this as a string; the picker deals in numbers. An empty string
    // is "enabled, nothing chosen yet", which is a different thing from a zero — zero
    // would switch the campaign off while reading as "a cap of none", and the picker
    // starting at 1 means it can no longer be typed.
    const chosen = form.freqCap ? Number(form.freqCap) : undefined;
    return (
        <Section
            id="freqcap"
            title={<Copy original={ORIGINAL.freqCapTitle}>Frequency Cap</Copy>}
            description={
                <Copy original={ORIGINAL.freqCapDescription}>Maximum number of times an ad from this campaign is shown to an individual user over a 24hr period.</Copy>
            }
        >
            <EnableChoice
                enabled={on}
                onToggle={(enable) => set({ freqCap: enable ? (form.freqCap ?? "") : undefined })}
                label="No cap — a user can see this campaign any number of times a day."
            >
                <Fillable filled={on} onFill={() => set({ freqCap: "3" })}>
                    <NumberPicker
                        name="Frequency cap"
                        labelFor={freqCapLabel}
                        value={chosen}
                        onChange={(n) => set({ freqCap: String(n) })}
                        disabled={!on}
                    />
                </Fillable>
                <span className="text-md text-tertiary">
                    <Copy>Impressions per user, per 24 hours. Type to jump to a number, or ↑ ↓ to step through them.</Copy>
                </span>
            </EnableChoice>
        </Section>
    );
};
