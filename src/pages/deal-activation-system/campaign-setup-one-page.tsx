import { type ReactNode, useState } from "react";
import { AlertCircle, CheckCircle, CurrencyDollar, InfoCircle, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import type { AuctionRule, MatchLogic } from "./das-data";
import { DasShell, KeywordChip, NewFieldBadge, PINK, PinkAction, Section, TEAL } from "./das-shell";
import { AdUnitTypeField, DeviceLanguageField, ExistingTargets, KeywordChipInput, MatchLogicField } from "./keyword-targeting";

/**
 * Deal Activation System → Campaign Setup, one page.
 *
 * Kickoff feedback: "make it a one-pager instead of step-by-step." The five wizard
 * steps (General → Budget → Targeting → Creative → Review) become sections on one
 * scrolling form. Review isn't a page any more: a sticky summary rail validates as you
 * go, lists what's missing (each item jumps to its section) and holds Publish /
 * Publish & Duplicate.
 */

type SetupState = "ready" | "errors";

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

/* ------------------------------------------------------------ Sections --- */

const DealSection = () => {
    const [mode, setMode] = useState("existing");
    return (
        <Section id="deal" title="Deal & campaign" description="Campaigns nest under a deal. Budgets belong to the campaign, not the deal.">
            <RadioGroup size="sm" value={mode} onChange={setMode} className="gap-4" aria-label="Deal">
                <RadioButton value="generate" label="New deal, generate ID" />
                <RadioButton value="create" label="New deal, custom ID" />
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <RadioButton value="existing" label="Add to existing deal" className="lg:w-52" />
                    <Select aria-label="Existing deal" items={deals} selectedKey="D-10482" isDisabled={mode !== "existing"} className="flex-1">
                        {(item) => (
                            <Select.Item id={item.id} supportingText={item.supportingText}>
                                {item.label}
                            </Select.Item>
                        )}
                    </Select>
                </div>
            </RadioGroup>
            <Input label="Campaign name" size="md" defaultValue="Sports fans · Interstitial" isRequired />
        </Section>
    );
};

const RulesSection = ({ rule, setRule }: { rule: AuctionRule; setRule: (r: AuctionRule) => void }) => (
    <Section id="rules" title="Auction rules" description="How this campaign competes with open-marketplace auctions.">
        <RadioGroup
            size="sm"
            value={rule}
            onChange={(v) => setRule(v as AuctionRule)}
            className="grid grid-cols-1 gap-3 md:grid-cols-2"
            aria-label="Auction rule"
        >
            {rules.map((r) => (
                <div
                    key={r.id}
                    className={cx("rounded-xl p-4 ring-1", rule === r.id ? "" : "ring-secondary")}
                    style={rule === r.id ? { boxShadow: `inset 0 0 0 2px ${TEAL}`, backgroundColor: `${TEAL}0a` } : undefined}
                >
                    <RadioButton value={r.id} label={r.id} hint={r.hint} />
                </div>
            ))}
        </RadioGroup>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Select
                label="Priority vs. other live campaigns"
                items={[
                    { id: "even", label: "Even distribution (default)" },
                    { id: "1", label: "1 — highest" },
                    { id: "2", label: "2" },
                    { id: "3", label: "3" },
                ]}
                selectedKey="even"
                className="max-w-xs"
            >
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </div>
    </Section>
);

const BudgetSection = ({ rule, state }: { rule: AuctionRule; state: SetupState }) => {
    if (rule === "Fallback") {
        return (
            <Section id="budget" title="Budget & flight">
                <p className="flex items-center gap-2 text-sm text-tertiary">
                    <InfoCircle className="size-4" aria-hidden="true" /> Fallback campaigns have no budget or eCPM. Set the flight dates only.
                </p>
                <FlightDates />
            </Section>
        );
    }
    return (
        <Section
            id="budget"
            title="Budget & flight"
            description="Pacing is front-loaded hourly: up to 1/24th of the daily budget spends at the start of each hour."
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                    label="Total budget"
                    size="md"
                    icon={CurrencyDollar}
                    placeholder="0.00"
                    defaultValue={state === "errors" ? undefined : "25,000.00"}
                    isRequired
                    isInvalid={state === "errors"}
                    hint={state === "errors" ? "Enter a budget to publish." : undefined}
                />
                <Input label="eCPM (bid amount)" size="md" icon={CurrencyDollar} defaultValue="8.50" isRequired hint="Selling value, not a floor." />
                <Input label="Daily impression cap" size="md" placeholder="No cap" hint="Optional" />
            </div>
            <FlightDates />
        </Section>
    );
};

const FlightDates = () => (
    <div className="flex flex-col gap-2">
        <div className="grid max-w-xl grid-cols-2 overflow-hidden rounded-xl ring-1 ring-secondary">
            <button type="button" className="flex flex-col gap-0.5 border-r border-secondary px-4 py-3 text-left transition-colors hover:bg-primary_hover">
                <span className="text-xs font-medium text-tertiary uppercase">Start</span>
                <span className="text-md font-semibold text-primary">Oct 1, 2026 · 00:00</span>
            </button>
            <button type="button" className="flex flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-primary_hover">
                <span className="text-xs font-medium text-tertiary uppercase">End</span>
                <span className="text-md font-semibold text-primary">Oct 31, 2026 · 23:59</span>
            </button>
        </div>
        <p className="text-sm text-tertiary italic">All scheduling times are in UTC.</p>
    </div>
);

const TargetingSection = () => {
    const [match, setMatch] = useState<MatchLogic>("ANY");
    const [count, setCount] = useState(2);
    return (
        <Section id="targeting" title="Targeting" description="Leave a target empty to include everyone.">
            <ExistingTargets />
            <div className="flex flex-col gap-5 rounded-xl p-5 ring-1 ring-secondary">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-primary">Keywords</h3>
                    <NewFieldBadge />
                </div>
                <KeywordChipInput initial={["sports", "power-user"]} onCountChange={setCount} />
                <MatchLogicField value={match} onChange={setMatch} count={count} />
            </div>
            <div className="flex flex-col gap-5 rounded-xl p-5 ring-1 ring-secondary">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-primary">Standard targets</h3>
                    <NewFieldBadge />
                </div>
                <AdUnitTypeField />
                <DeviceLanguageField />
            </div>
        </Section>
    );
};

const creatives = [
    { name: "Summit_FallLaunch_Interstitial_A", type: "HTML", size: "Full screen" },
    { name: "Summit_FallLaunch_Interstitial_B", type: "HTML", size: "Full screen" },
    { name: "Summit_FallLaunch_Video_15s", type: "VAST", size: "N/A" },
];

const CreativeSection = ({ state }: { state: SetupState }) => {
    const rows = state === "errors" ? creatives : creatives.slice(0, 2);
    return (
        <Section
            id="creative"
            title="Creative"
            description="Add creatives from your asset library. A campaign can hold many creatives, all of the same type. For another format or language, use Publish & Duplicate."
            trailing={<PinkAction>Upload new asset</PinkAction>}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input aria-label="Search assets" size="md" icon={SearchLg} placeholder="Search your asset library" wrapperClassName="flex-1" />
                <Button color="primary-pink" className="uppercase">
                    Add
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                {rows.map((c, i) => {
                    const mismatched = state === "errors" && c.type === "VAST";
                    return (
                        <div
                            key={c.name}
                            className={cx(
                                "flex items-center gap-4 border-b border-secondary px-4 py-3 last:border-b-0",
                                i % 2 === 1 && "bg-secondary/40",
                                mismatched && "bg-error-primary",
                            )}
                        >
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-secondary">{c.name}</span>
                            <span className={cx("w-20 text-sm", mismatched ? "font-semibold text-error-primary" : "text-tertiary")}>{c.type}</span>
                            <span className="hidden w-28 text-sm text-tertiary sm:block">{c.size}</span>
                            <PinkAction icon={XClose}>Remove</PinkAction>
                        </div>
                    );
                })}
            </div>
            {state === "errors" && (
                <p className="flex items-center gap-2 text-sm font-medium text-error-primary">
                    <AlertCircle className="size-4" aria-hidden="true" /> Mixed creative types. Remove the VAST creative, or publish it as a duplicate campaign.
                </p>
            )}
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

const issuesFor = (state: SetupState, rule: AuctionRule): { section: SectionId; text: string }[] =>
    state === "errors"
        ? [
              ...(rule === "Fallback" ? [] : [{ section: "budget" as const, text: "Budget is required" }]),
              { section: "creative", text: "Creatives mix HTML and VAST" },
          ]
        : [];

const SummaryRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
        <span className="shrink-0 text-tertiary">{label}</span>
        <span className="text-right font-medium text-primary">{children}</span>
    </div>
);

const SummaryRail = ({ state, rule }: { state: SetupState; rule: AuctionRule }) => {
    const issues = issuesFor(state, rule);
    const done = SECTIONS.length - new Set(issues.map((i) => i.section)).size;
    return (
        <aside className="flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary">Ready to publish?</h2>
                    <span className="text-sm font-semibold" style={{ color: issues.length ? PINK : TEAL }}>
                        {done}/{SECTIONS.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    {SECTIONS.map((s) => {
                        const bad = issues.some((i) => i.section === s.id);
                        return <span key={s.id} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: bad ? PINK : TEAL }} title={s.title} />;
                    })}
                </div>
            </div>

            {issues.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {issues.map((issue) => (
                        <li key={issue.text}>
                            <a
                                href={`#${issue.section}`}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error-primary transition-colors hover:bg-error-primary"
                                style={{ backgroundColor: `${PINK}14` }}
                            >
                                <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                                {issue.text}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="flex items-center gap-2 text-sm font-medium" style={{ color: TEAL }}>
                    <CheckCircle className="size-4" aria-hidden="true" /> Everything checks out.
                </p>
            )}

            <div className="divide-y divide-secondary border-y border-secondary">
                <SummaryRow label="Deal">Summit Sportswear — Fall Launch</SummaryRow>
                <SummaryRow label="Rule">{rule}</SummaryRow>
                {rule !== "Fallback" && (
                    <SummaryRow label="Budget · eCPM">{state === "errors" ? <span className="text-error-primary">—</span> : "$25,000"} · $8.50</SummaryRow>
                )}
                {rule !== "Fallback" && state !== "errors" && <SummaryRow label="Est. delivery">≈ 2.9M impressions · $806/day</SummaryRow>}
                <SummaryRow label="Flight">Oct 1 – Oct 31 (UTC)</SummaryRow>
                <SummaryRow label="Keywords">
                    <span className="inline-flex flex-wrap justify-end gap-1">
                        <span className="text-xs text-tertiary">ANY of</span>
                        <KeywordChip value="sports" />
                        <KeywordChip value="power-user" />
                    </span>
                </SummaryRow>
                <SummaryRow label="Units · Language">Interstitial · en</SummaryRow>
                <SummaryRow label="Creatives">{state === "errors" ? "3 (mixed)" : "2 × HTML full screen"}</SummaryRow>
            </div>

            <div className="flex flex-col gap-2">
                <Button color="primary-pink" className="uppercase" isDisabled={issues.length > 0}>
                    Publish
                </Button>
                <Button color="secondary" className="uppercase" isDisabled={issues.length > 0}>
                    Publish &amp; duplicate
                </Button>
                <Button color="link-gray" size="sm">
                    Save draft
                </Button>
            </div>
            <p className="text-xs text-tertiary">
                Use Publish &amp; Duplicate for the same campaign in another format or language: duplicate, then swap the creative or geo.
            </p>
        </aside>
    );
};

/* ------------------------------------------------------------ Section nav --- */

const SectionNav = ({ state, rule }: { state: SetupState; rule: AuctionRule }) => {
    const issues = issuesFor(state, rule);
    return (
        <nav aria-label="Form sections" className="hidden flex-col gap-1 2xl:sticky 2xl:top-6 2xl:flex">
            <span className="mb-2 px-3 text-xs font-semibold text-tertiary uppercase">On this page</span>
            {SECTIONS.map((s, i) => {
                const bad = issues.some((x) => x.section === s.id);
                return (
                    <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={cx(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary_hover",
                            i === 0 ? "text-primary" : "text-secondary",
                        )}
                    >
                        {bad ? (
                            <AlertCircle className="size-4 text-fg-error-secondary" aria-hidden="true" />
                        ) : (
                            <CheckCircle className="size-4" style={{ color: TEAL }} aria-hidden="true" />
                        )}
                        {s.title}
                    </a>
                );
            })}
        </nav>
    );
};

/* ------------------------------------------------------------------ Page --- */

export interface CampaignSetupOnePageProps {
    state?: SetupState;
    initialRule?: AuctionRule;
}

export const CampaignSetupOnePage = ({ state = "ready", initialRule = "CPM Priority" }: CampaignSetupOnePageProps) => {
    const [rule, setRule] = useState<AuctionRule>(initialRule);
    return (
        <DasShell
            navKey="deal activation setup"
            tabs={[{ label: "Create Campaign", active: true }, { label: "View Campaigns" }]}
            concept={{
                label: "Concept A",
                title: "One-page setup with a live summary rail",
                notes: [
                    "The five wizard steps become five sections on one page. The left rail jumps between them and shows which still need attention.",
                    "Review is always visible on the right: problems link straight to their section, and Publish only enables when the campaign is valid.",
                    "Budget and eCPM hide for Fallback campaigns, so fields that don't apply never show.",
                ],
            }}
        >
            <div className="grid grid-cols-1 gap-8 px-8 py-8 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[180px_minmax(0,1fr)_360px]">
                <SectionNav state={state} rule={rule} />
                <div className="min-w-0">
                    <DealSection />
                    <RulesSection rule={rule} setRule={setRule} />
                    <BudgetSection rule={rule} state={state} />
                    <TargetingSection />
                    <CreativeSection state={state} />
                </div>
                <div>
                    <SummaryRail state={state} rule={rule} />
                </div>
            </div>
        </DasShell>
    );
};

export default CampaignSetupOnePage;
