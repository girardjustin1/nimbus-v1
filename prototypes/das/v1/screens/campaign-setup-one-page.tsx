import { type ReactNode, useEffect, useState } from "react";
import { type CalendarDate, parseDate } from "@internationalized/date";
import { AlertCircle, CheckCircle, Circle, CurrencyDollar, FilePlus02, InfoCircle, SearchLg, XClose } from "@untitledui/icons";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import type { AuctionRule, MatchLogic } from "./das-data";
import { DasShell, JumpLink, NewFieldBadge, PINK, PinkAction, Section, TEAL } from "./das-shell";
import { AdUnitTypeField, DeviceLanguageField, ExistingTargets, KeywordChipInput, MatchLogicField } from "./keyword-targeting";

/**
 * Deal Activation System → Campaign Setup, one page.
 *
 * Kickoff feedback: "make it a one-pager instead of step-by-step." The five wizard
 * steps (General → Budget → Targeting → Creative → Review) become sections on one
 * scrolling form. Review isn't a page any more: a sticky summary rail tracks what's
 * left, and Publish validates on press — every problem is flagged in place, in the
 * "On this page" rail and in a banner that links to each one.
 */

const SECTIONS = [
    { id: "deal", title: "Deal & campaign" },
    { id: "rules", title: "Auction rules" },
    { id: "budget", title: "Budget & flight" },
    { id: "targeting", title: "Targeting" },
    { id: "creative", title: "Creative" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const rules: { id: AuctionRule; hint: string }[] = [
    { id: "Guaranteed", hint: "Prioritize this campaign over open-marketplace (OMP) auctions." },
    { id: "CPM Priority", hint: "Compare this campaign's eCPM to the winning OMP bid and serve whichever is higher." },
    { id: "Always-on CPM Priority", hint: "Like CPM Priority, always competing. The eCPM is the selling value, not a floor." },
    { id: "Fallback", hint: "Serve only when OMP has no fill. No budget or eCPM." },
];

const deals = [
    { id: "D-10482", label: "Summit Sportswear — Fall Launch", supportingText: "D-10482" },
    { id: "D-10517", label: "Harvest Brewing — 21+", supportingText: "D-10517" },
    { id: "D-10533", label: "GreenThumb Supply", supportingText: "D-10533" },
];

interface Creative {
    name: string;
    type: "HTML" | "VAST";
    size: string;
}

const library: Creative[] = [
    { name: "Summit_FallLaunch_Interstitial_A", type: "HTML", size: "Full screen" },
    { name: "Summit_FallLaunch_Interstitial_B", type: "HTML", size: "Full screen" },
    { name: "Summit_FallLaunch_Video_15s", type: "VAST", size: "N/A" },
    { name: "Summit_FallLaunch_Interstitial_C", type: "HTML", size: "Full screen" },
];

/** The prototype's "today" (UTC). */
const TODAY = parseDate("2026-09-18");

/* ----------------------------------------------------------------- Form --- */

interface SetupForm {
    dealId?: string;
    name: string;
    rule?: AuctionRule;
    budget: string;
    ecpm: string;
    start?: CalendarDate;
    end?: CalendarDate;
    /** Keywords the chip input starts with; the live count is tracked separately. */
    keywords: string[];
    creatives: Creative[];
}

const d = (iso: string) => parseDate(iso);

const presets = {
    ready: {
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "25,000.00",
        ecpm: "8.50",
        start: d("2026-10-01"),
        end: d("2026-10-31"),
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 2),
    },
    errors: {
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "",
        ecpm: "8.50",
        start: d("2026-10-01"),
        end: d("2026-10-31"),
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 3),
    },
    fallback: {
        dealId: "D-10482",
        name: "Fallback · Sports fans",
        rule: "Fallback",
        budget: "",
        ecpm: "",
        start: d("2026-10-01"),
        end: undefined,
        keywords: ["sports"],
        creatives: [],
    },
    datesInvalid: {
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "25,000.00",
        ecpm: "8.50",
        start: d("2026-09-14"),
        end: d("2026-09-10"),
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 2),
    },
    empty: { name: "", budget: "", ecpm: "", keywords: [], creatives: [] },
} satisfies Record<string, SetupForm>;

export type SetupPreset = keyof typeof presets;

interface Issue {
    section: SectionId;
    field: string;
    text: string;
}

const validate = (f: SetupForm): Issue[] => {
    const issues: Issue[] = [];
    if (!f.dealId) issues.push({ section: "deal", field: "deal", text: "Choose a deal" });
    if (!f.name.trim()) issues.push({ section: "deal", field: "name", text: "Name the campaign" });
    if (!f.rule) issues.push({ section: "rules", field: "rule", text: "Pick an auction rule" });
    if (f.rule && f.rule !== "Fallback") {
        if (!f.budget.trim()) issues.push({ section: "budget", field: "budget", text: "Budget is required" });
        if (!f.ecpm.trim()) issues.push({ section: "budget", field: "ecpm", text: "eCPM is required" });
    }
    if (!f.start) issues.push({ section: "budget", field: "start", text: "Pick a start date" });
    else if (f.start.compare(TODAY) < 0) issues.push({ section: "budget", field: "start", text: "Start date is in the past" });
    if (!f.end) issues.push({ section: "budget", field: "end", text: "Pick an end date" });
    else if (f.start && f.end.compare(f.start) < 0) issues.push({ section: "budget", field: "end", text: "End date is before the start date" });
    if (!f.creatives.length) issues.push({ section: "creative", field: "creatives", text: "Add at least one creative" });
    else if (new Set(f.creatives.map((c) => c.type)).size > 1) issues.push({ section: "creative", field: "creatives", text: "Creatives mix HTML and VAST" });
    return issues;
};

/** A section is "started" once any of its inputs has a value — drives the empty-state rail. */
const started = (f: SetupForm, s: SectionId, keywordCount: number) =>
    s === "deal"
        ? Boolean(f.dealId || f.name)
        : s === "rules"
          ? Boolean(f.rule)
          : s === "budget"
            ? Boolean(f.budget || f.ecpm || f.start || f.end)
            : s === "targeting"
              ? keywordCount > 0
              : f.creatives.length > 0;

type FieldError = (field: string) => string | undefined;
type Setter = (p: Partial<SetupForm>) => void;

/* ------------------------------------------------------------ Sections --- */

const FieldMessage = ({ children }: { children: ReactNode }) => (
    <p className="flex items-center gap-2 text-sm font-medium text-error-primary">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {children}
    </p>
);

const DealSection = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => {
    const [mode, setMode] = useState("existing");
    return (
        <Section id="deal" title="Deal & campaign" description="Campaigns nest under a deal. Budgets belong to the campaign, not the deal.">
            <RadioGroup size="sm" value={mode} onChange={setMode} className="gap-4" aria-label="Deal">
                <RadioButton value="generate" label="New deal, generate ID" />
                <RadioButton value="create" label="New deal, custom ID" />
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                    <RadioButton value="existing" label="Add to existing deal" className="lg:mt-2.5 lg:w-52" />
                    <Select
                        aria-label="Existing deal"
                        placeholder="Choose a deal"
                        items={deals}
                        selectedKey={form.dealId ?? null}
                        onSelectionChange={(k) => set({ dealId: k ? String(k) : undefined })}
                        isDisabled={mode !== "existing"}
                        isInvalid={Boolean(error("deal"))}
                        hint={error("deal")}
                        className="flex-1"
                    >
                        {(item) => (
                            <Select.Item id={item.id} supportingText={item.supportingText}>
                                {item.label}
                            </Select.Item>
                        )}
                    </Select>
                </div>
            </RadioGroup>
            <Input
                label="Campaign name"
                size="md"
                placeholder="e.g. Sports fans · Interstitial"
                value={form.name}
                onChange={(name) => set({ name })}
                isRequired
                isInvalid={Boolean(error("name"))}
                hint={error("name")}
            />
        </Section>
    );
};

const RulesSection = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => (
    <Section id="rules" title="Auction rules" description="How this campaign competes with open-marketplace auctions.">
        <RadioGroup size="sm" value={form.rule ?? null} onChange={(v) => set({ rule: v as AuctionRule })} className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Auction rule">
            {rules.map((r) => (
                <div
                    key={r.id}
                    className={cx("rounded-xl p-4 ring-1", form.rule === r.id ? "" : error("rule") ? "ring-error_subtle" : "ring-secondary")}
                    style={form.rule === r.id ? { boxShadow: `inset 0 0 0 2px ${TEAL}`, backgroundColor: `${TEAL}0a` } : undefined}
                >
                    <RadioButton value={r.id} label={r.id} hint={r.hint} />
                </div>
            ))}
        </RadioGroup>
        {error("rule") && <FieldMessage>{error("rule")}</FieldMessage>}
        <Select
            label="Priority vs. other live campaigns"
            items={[
                { id: "even", label: "Even distribution (default)" },
                { id: "1", label: "1 — highest" },
                { id: "2", label: "2" },
                { id: "3", label: "3" },
            ]}
            defaultSelectedKey="even"
            className="max-w-xs"
        >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    </Section>
);

const flightDays = (f: SetupForm) => (f.start && f.end && f.end.compare(f.start) >= 0 ? f.end.compare(f.start) + 1 : undefined);

/** Start and end each get a calendar picker (the design-system DatePicker) plus a UTC time. */
const FlightDates = ({ form, set, error, calendarOpen }: { form: SetupForm; set: Setter; error: FieldError; calendarOpen?: "start" | "end" }) => {
    const days = flightDays(form);
    const field = (which: "start" | "end") => {
        const err = error(which);
        return (
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">
                    {which === "start" ? "Start date" : "End date"} <span className="text-brand-tertiary">*</span>
                </span>
                <div className="flex items-center gap-2">
                    <div className={cx("rounded-lg", err && "ring-2 ring-error_subtle ring-offset-1")}>
                        <DatePicker
                            aria-label={which === "start" ? "Start date" : "End date"}
                            size="md"
                            value={form[which] ?? null}
                            onChange={(v) => set({ [which]: (v as CalendarDate | null) ?? undefined })}
                            minValue={TODAY}
                            defaultOpen={calendarOpen === which}
                            isInvalid={Boolean(err)}
                        />
                    </div>
                    <Input aria-label={`${which} time (UTC)`} size="md" defaultValue={which === "start" ? "00:00" : "23:59"} wrapperClassName="w-24" />
                </div>
                {err && <span className="text-sm text-error-primary">{err}</span>}
            </div>
        );
    };
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {field("start")}
                {field("end")}
                <span className="text-sm text-tertiary sm:pt-9">{days ? `${days}-day flight` : ""}</span>
            </div>
            <p className="text-sm text-tertiary italic">All scheduling times are in UTC. Past dates can't be picked.</p>
        </div>
    );
};

const BudgetSection = ({ form, set, error, calendarOpen }: { form: SetupForm; set: Setter; error: FieldError; calendarOpen?: "start" | "end" }) => {
    const flight = <FlightDates form={form} set={set} error={error} calendarOpen={calendarOpen} />;
    if (form.rule === "Fallback") {
        return (
            <Section id="budget" title="Budget & flight">
                <p className="flex items-center gap-2 text-sm text-tertiary">
                    <InfoCircle className="size-4" aria-hidden="true" /> Fallback campaigns have no budget or eCPM. Set the flight dates only.
                </p>
                {flight}
            </Section>
        );
    }
    return (
        <Section id="budget" title="Budget & flight" description="Pacing is front-loaded hourly: up to 1/24th of the daily budget spends at the start of each hour.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                    label="Total budget"
                    size="md"
                    icon={CurrencyDollar}
                    placeholder="0.00"
                    value={form.budget}
                    onChange={(budget) => set({ budget })}
                    isRequired
                    isInvalid={Boolean(error("budget"))}
                    hint={error("budget")}
                />
                <Input
                    label="eCPM (bid amount)"
                    size="md"
                    icon={CurrencyDollar}
                    placeholder="0.00"
                    value={form.ecpm}
                    onChange={(ecpm) => set({ ecpm })}
                    isRequired
                    isInvalid={Boolean(error("ecpm"))}
                    hint={error("ecpm") ?? "Selling value, not a floor."}
                />
                <Input label="Daily impression cap" size="md" placeholder="No cap" hint="Optional" />
            </div>
            {flight}
        </Section>
    );
};

const TargetingSection = ({ form, empty, keywordCount, setKeywordCount }: { form: SetupForm; empty: boolean; keywordCount: number; setKeywordCount: (n: number) => void }) => {
    const [match, setMatch] = useState<MatchLogic>("ANY");
    return (
        <Section id="targeting" title="Targeting" description="Leave a target empty to include everyone.">
            {!empty && <ExistingTargets />}
            <div className="flex flex-col gap-5 rounded-xl p-5 ring-1 ring-secondary">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-primary">Keywords</h3>
                    <NewFieldBadge />
                </div>
                <KeywordChipInput initial={form.keywords} onCountChange={setKeywordCount} />
                <MatchLogicField value={match} onChange={setMatch} count={keywordCount} />
            </div>
            <div className="flex flex-col gap-5 rounded-xl p-5 ring-1 ring-secondary">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-primary">Standard targets</h3>
                    <NewFieldBadge />
                </div>
                <AdUnitTypeField initial={empty ? [] : ["Interstitial"]} />
                <DeviceLanguageField initial={empty ? [] : ["en"]} />
            </div>
        </Section>
    );
};

const CreativeSection = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => {
    const rows = form.creatives;
    const mixed = new Set(rows.map((c) => c.type)).size > 1;
    const next = library.find((c) => !rows.includes(c) && c.type === "HTML");
    const err = error("creatives");
    return (
        <Section
            id="creative"
            title="Creative"
            description="Add creatives from your asset library. A campaign can hold many creatives, all of the same type. For another format or language, use Publish & Duplicate."
            trailing={<PinkAction>Upload new asset</PinkAction>}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input aria-label="Search assets" size="md" icon={SearchLg} placeholder="Search your asset library" wrapperClassName="flex-1" />
                <Button color="primary-pink" className="uppercase" isDisabled={!next} onClick={() => next && set({ creatives: [...rows, next] })}>
                    Add
                </Button>
            </div>
            {rows.length === 0 ? (
                <div className={cx("flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center", err ? "border-error_subtle" : "border-secondary")} style={err ? { backgroundColor: `${PINK}0a` } : undefined}>
                    <FilePlus02 className="size-6 text-fg-quaternary" aria-hidden="true" />
                    <p className="text-sm font-semibold text-primary">No creatives yet</p>
                    <p className="max-w-sm text-sm text-tertiary">Search your asset library above, or upload a new asset. HTML and VAST can't be mixed in one campaign.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                    {rows.map((c, i) => {
                        const bad = mixed && c.type === "VAST";
                        return (
                            <div key={c.name} className={cx("flex items-center gap-4 border-b border-secondary px-4 py-3 last:border-b-0", i % 2 === 1 && "bg-secondary/40", bad && "bg-error-primary")}>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-secondary">{c.name}</span>
                                <span className={cx("w-20 text-sm", bad ? "font-semibold text-error-primary" : "text-tertiary")}>{c.type}</span>
                                <span className="hidden w-28 text-sm text-tertiary sm:block">{c.size}</span>
                                <PinkAction icon={XClose} onPress={() => set({ creatives: rows.filter((x) => x !== c) })}>
                                    Remove
                                </PinkAction>
                            </div>
                        );
                    })}
                </div>
            )}
            {err && <FieldMessage>{err === "Creatives mix HTML and VAST" ? "Mixed creative types. Remove the VAST creative, or publish it as a duplicate campaign." : err}</FieldMessage>}
            <details className="rounded-xl bg-secondary/50 px-4 py-3 text-sm text-secondary">
                <summary className="cursor-pointer font-semibold text-primary">Creative requirements</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>HTML (static): 320×50 banner, 300×250 medium rectangle, 320×480 full screen.</li>
                    <li>VAST (video): raw, unwrapped VAST XML. No tags or URLs.</li>
                    <li>No macros in creatives or third-party trackers. 300×600, 620×250 and 970×250 may render full screen.</li>
                </ul>
            </details>
        </Section>
    );
};

/* ---------------------------------------------------------- Summary rail --- */

const SummaryRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
        <span className="shrink-0 text-tertiary">{label}</span>
        <span className="text-right font-medium text-primary">{children}</span>
    </div>
);

const Missing = () => <span className="text-quaternary">—</span>;

const fmtDate = (c?: CalendarDate) => (c ? new Date(Date.UTC(c.year, c.month - 1, c.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : undefined);

interface ProgressProps {
    form: SetupForm;
    issues: Issue[];
    attempted: boolean;
    keywordCount: number;
}

const sectionState = ({ form, issues, attempted, keywordCount }: ProgressProps, s: SectionId) => {
    const bad = issues.some((x) => x.section === s);
    const blank = SECTIONS.every((x) => !started(form, x.id, keywordCount));
    const isStarted = started(form, s, keywordCount) || (s === "targeting" && !blank);
    return bad && attempted ? "error" : bad || !isStarted ? "todo" : "done";
};

const SummaryRail = (props: ProgressProps & { onPublish: () => void }) => {
    const { form, issues, attempted, keywordCount, onPublish } = props;
    const blank = SECTIONS.every((s) => !started(form, s.id, keywordCount));
    const done = SECTIONS.filter((s) => sectionState(props, s.id) === "done").length;
    const deal = deals.find((x) => x.id === form.dealId);

    return (
        <aside className="flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-14">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary">{blank ? "Campaign summary" : "Ready to publish?"}</h2>
                    <span className="text-sm font-semibold" style={{ color: issues.length ? PINK : TEAL }}>
                        {done}/{SECTIONS.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    {SECTIONS.map((s) => {
                        const st = sectionState(props, s.id);
                        return <span key={s.id} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: st === "error" ? PINK : st === "done" ? TEAL : "#EAECF0" }} title={s.title} />;
                    })}
                </div>
            </div>

            {blank && !attempted ? (
                <div className="flex flex-col gap-2 rounded-xl border border-dashed border-secondary p-4 text-sm">
                    <p className="font-semibold text-primary">Your summary builds here</p>
                    <p className="text-tertiary">As you fill in the form, each choice shows up below and the checklist tells you what's left. Start with the deal.</p>
                    <JumpLink to="deal" className="font-semibold" style={{ color: PINK }}>
                        Start with Deal &amp; campaign →
                    </JumpLink>
                </div>
            ) : issues.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-tertiary uppercase">{attempted ? "Fix before publishing" : `${issues.length} left to finish`}</span>
                    <ul className="flex flex-col gap-1.5">
                        {issues.map((issue) => (
                            <li key={issue.field + issue.text}>
                                <JumpLink
                                    to={issue.section}
                                    className={cx("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors", attempted ? "text-error-primary" : "bg-secondary/60 text-secondary hover:bg-primary_hover")}
                                    style={attempted ? { backgroundColor: `${PINK}14` } : undefined}
                                >
                                    {attempted ? <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                                    {issue.text}
                                </JumpLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="flex items-center gap-2 text-sm font-medium" style={{ color: TEAL }}>
                    <CheckCircle className="size-4" aria-hidden="true" /> Everything checks out.
                </p>
            )}

            <div className="divide-y divide-secondary border-y border-secondary">
                <SummaryRow label="Deal">{deal?.label ?? <Missing />}</SummaryRow>
                <SummaryRow label="Rule">{form.rule ?? <Missing />}</SummaryRow>
                {form.rule !== "Fallback" && (
                    <SummaryRow label="Budget · eCPM">
                        {form.budget ? `$${form.budget.replace(/\.00$/, "")}` : <Missing />} · {form.ecpm ? `$${form.ecpm}` : <Missing />}
                    </SummaryRow>
                )}
                {form.rule && form.rule !== "Fallback" && form.budget && form.ecpm && flightDays(form) && <SummaryRow label="Est. delivery">≈ 2.9M impressions · $806/day</SummaryRow>}
                <SummaryRow label="Flight">{form.start || form.end ? `${fmtDate(form.start) ?? "?"} – ${fmtDate(form.end) ?? "?"} (UTC)` : <Missing />}</SummaryRow>
                <SummaryRow label="Keywords">{keywordCount ? `${keywordCount} · ANY match` : <span className="text-tertiary">Everyone</span>}</SummaryRow>
                <SummaryRow label="Creatives">{form.creatives.length ? `${form.creatives.length} × ${[...new Set(form.creatives.map((c) => c.type))].join(" + ")}` : <Missing />}</SummaryRow>
            </div>

            <div className="flex flex-col gap-2">
                <Button color="primary-pink" className="uppercase" onClick={onPublish}>
                    Publish
                </Button>
                <Button color="secondary" className="uppercase" onClick={onPublish}>
                    Publish &amp; duplicate
                </Button>
                <Button color="link-gray" size="sm">
                    Save draft
                </Button>
            </div>
            <p className="text-xs text-tertiary">Publish checks everything first. Anything missing is flagged on the page, and nothing goes live until it's fixed.</p>
        </aside>
    );
};

/* ------------------------------------------------------------ Section nav --- */

const SectionNav = (props: ProgressProps) => {
    const { form, issues, attempted, keywordCount } = props;
    const blank = SECTIONS.every((s) => !started(form, s.id, keywordCount));
    return (
        <nav aria-label="Form sections" className="hidden flex-col gap-1 xl:sticky xl:top-14 xl:flex xl:self-start">
            <span className="mb-2 px-3 text-xs font-semibold text-tertiary uppercase">On this page</span>
            {SECTIONS.map((s, i) => {
                const state = sectionState(props, s.id);
                const count = issues.filter((x) => x.section === s.id).length;
                return (
                    <JumpLink
                        key={s.id}
                        to={s.id}
                        className={cx(
                            "flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary_hover",
                            state === "error" ? "text-error-primary" : state === "done" ? "text-primary" : "text-tertiary",
                        )}
                    >
                        {state === "error" ? (
                            <AlertCircle className="mt-0.5 size-4 shrink-0 text-fg-error-secondary" aria-hidden="true" />
                        ) : state === "done" ? (
                            <CheckCircle className="mt-0.5 size-4 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                        ) : (
                            <span
                                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-fg-quaternary text-[9px] font-bold text-quaternary"
                                aria-hidden="true"
                            >
                                {i + 1}
                            </span>
                        )}
                        <span className="flex flex-col">
                            {s.title}
                            {state === "error" && (
                                <span className="text-xs font-normal">
                                    {count} to fix
                                </span>
                            )}
                            {s.id === "targeting" && state === "todo" && <span className="text-xs font-normal">Optional</span>}
                        </span>
                    </JumpLink>
                );
            })}
            {blank && !attempted && <p className="mt-3 rounded-lg bg-secondary px-3 py-2.5 text-xs text-tertiary">Nothing filled in yet. Sections tick off as you complete them.</p>}
        </nav>
    );
};

/* ------------------------------------------------------------------ Page --- */

export interface CampaignSetupOnePageProps {
    preset?: SetupPreset;
    /** Publish has been pressed: show every error in place. */
    attempted?: boolean;
    /** A flight-date calendar is open on load. */
    calendarOpen?: "start" | "end";
}

export const CampaignSetupOnePage = ({ preset = "ready", attempted: initialAttempted = false, calendarOpen }: CampaignSetupOnePageProps) => {
    const [form, setForm] = useState<SetupForm>(presets[preset]);
    const [attempted, setAttempted] = useState(initialAttempted);
    const [keywordCount, setKeywordCount] = useState(presets[preset].keywords.length);
    const set: Setter = (p) => setForm((f) => ({ ...f, ...p }));
    const issues = validate(form);
    const error: FieldError = (field) => (attempted ? issues.find((i) => i.field === field)?.text : undefined);
    const progress = { form, issues, attempted, keywordCount };

    // Deep link to an open calendar: bring the flight dates into view first.
    useEffect(() => {
        if (calendarOpen) document.getElementById("budget")?.scrollIntoView({ block: "center" });
    }, [calendarOpen]);

    const publish = () => {
        if (issues.length) {
            setAttempted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.location.hash = "#/setup-published";
        }
    };

    return (
        <DasShell
            navKey="deal activation setup"
            tabs={[
                { label: "Create Campaign", active: true, href: "#/setup-empty" },
                { label: "View Campaigns", href: "#/campaigns" },
            ]}
            concept={{
                label: "Concept A",
                title: "One-page setup with a live summary rail",
                notes: [
                    "The five wizard steps become five sections on one page. The left rail jumps between them and shows what's done, what's left and, after Publish, what's wrong.",
                    "Publish is never greyed out. Pressing it checks everything: problems are flagged on the fields, in the rail and in a banner that links to each one.",
                    "Flight dates use the calendar picker. Past dates can't be picked, and an end date before the start is caught. Budget and eCPM hide for Fallback campaigns.",
                ],
            }}
        >
            <div className="grid grid-cols-1 gap-8 px-8 py-8 xl:grid-cols-[190px_minmax(0,1fr)_340px]">
                <SectionNav {...progress} />
                <div className="min-w-0">
                    {attempted && issues.length > 0 && (
                        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl p-4 ring-1 ring-error_subtle" style={{ backgroundColor: `${PINK}0f` }}>
                            <p className="flex items-center gap-2 text-sm font-semibold text-error-primary">
                                <AlertCircle className="size-5" aria-hidden="true" />
                                Can't publish yet: {issues.length} {issues.length === 1 ? "thing needs" : "things need"} fixing
                            </p>
                            <ul className="flex flex-wrap gap-2">
                                {issues.map((i) => (
                                    <li key={i.field + i.text}>
                                        <JumpLink to={i.section} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-error-primary ring-1 ring-error_subtle">
                                            {i.text} →
                                        </JumpLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <DealSection form={form} set={set} error={error} />
                    <RulesSection form={form} set={set} error={error} />
                    <BudgetSection form={form} set={set} error={error} calendarOpen={calendarOpen} />
                    <TargetingSection form={form} empty={preset === "empty"} keywordCount={keywordCount} setKeywordCount={setKeywordCount} />
                    <CreativeSection form={form} set={set} error={error} />
                </div>
                <div>
                    <SummaryRail {...progress} onPublish={publish} />
                </div>
            </div>
        </DasShell>
    );
};

export default CampaignSetupOnePage;
