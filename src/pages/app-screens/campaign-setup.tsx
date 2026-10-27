import { type ReactNode, useState } from "react";
import { AlertCircle, ChevronDown, ChevronRight, CurrencyDollar, Percent02, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { Table, TableCard } from "@/components/application/table/table";
import { cx } from "@/utils/cx";
import { CampaignSetupLayout, WizardFooter } from "./campaign-setup-layout";

/**
 * Campaign Setup wizard — step bodies.
 *
 * Each exported component below is one screen of the reference wizard, wrapped
 * in the shared <CampaignSetupLayout/> (nav + tabs + stepper + footer). They are
 * surfaced as Storybook stories from campaign-setup.stories.tsx.
 */

const PINK = "#DA6EA3";
const TEAL = "#37b6b7";

/* --------------------------------------------------------- Shared building blocks --- */

const Section = ({
    title,
    description,
    trailing,
    children,
    className,
}: {
    title: string;
    description?: ReactNode;
    trailing?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <section className={cx("flex flex-col gap-5 border-b border-secondary py-8 first:pt-0 last:border-b-0", className)}>
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-primary">{title}</h2>
                {description && <p className="max-w-3xl text-sm text-tertiary">{description}</p>}
            </div>
            {trailing}
        </div>
        {children}
    </section>
);

/** Pink uppercase link-style action (Clear All, Edit, the geo cascade links). */
const PinkAction = ({ children, icon: Icon }: { children: ReactNode; icon?: typeof XClose }) => (
    <button type="button" className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase transition-opacity duration-100 hover:opacity-80" style={{ color: PINK }}>
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {children}
    </button>
);

const teamMembers = [
    { id: "olivia", label: "Olivia Rhye", supportingText: "olivia@nimbus.com" },
    { id: "phoenix", label: "Phoenix Baker", supportingText: "phoenix@nimbus.com" },
    { id: "lana", label: "Lana Steiner", supportingText: "lana@nimbus.com" },
];

/* ==================================================================== STEP 1 — TARGETING === */

/** Deal ID + Campaign Name + Geos + Platform + Apps, shared by both targeting screens. */
const DealIdSection = () => {
    const [dealId, setDealId] = useState("generate");
    return (
        <Section title="Deal ID">
            <RadioGroup size="md" value={dealId} onChange={setDealId} className="gap-5">
                <RadioButton value="generate" label="Generate New" />

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <RadioButton value="create" label="Create New:" className="lg:w-48" />
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                        <Input size="md" label="ID" placeholder="100" wrapperClassName="flex-1" isDisabled={dealId !== "create"} />
                        <Input size="md" label="Name" placeholder="100" wrapperClassName="flex-1" isDisabled={dealId !== "create"} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <RadioButton value="existing" label="Add to Existing" className="lg:w-48" />
                    <Select
                        aria-label="Team member"
                        placeholder="Select team member"
                        items={teamMembers}
                        isDisabled={dealId !== "existing"}
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
        </Section>
    );
};

const CampaignNameSection = () => (
    <Section title="Campaign Name">
        <Input aria-label="Campaign name" size="md" placeholder="Enter Campaign Name" />
    </Section>
);

const PlatformSection = () => (
    <Section title="Platform">
        <div className="flex flex-wrap items-center gap-8">
            <Checkbox size="md" label="IOS" />
            <Checkbox size="md" label="Android" />
            <Checkbox size="md" label="CTV" />
        </div>
    </Section>
);

/** Apps search row + optional targeted-apps list. */
const AppsSection = ({ targetedApps = [] as string[] }) => (
    <Section title="Apps">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input aria-label="Search apps" size="md" icon={SearchLg} placeholder="Search Apps" wrapperClassName="flex-1" />
            <Button color="primary-pink" className="uppercase">
                Add
            </Button>
        </div>

        {targetedApps.length > 0 && (
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-secondary">Targeted Apps</p>
                <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                    {targetedApps.map((app, i) => (
                        <div key={app} className={cx("flex items-center justify-between px-4 py-3.5", i % 2 === 1 && "bg-[#FCFAF9]")}>
                            <span className="text-sm text-secondary">{app}</span>
                            <PinkAction icon={XClose}>Remove</PinkAction>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </Section>
);

/* -------------------------------------------------- Geos: simple radios (Screen-1) --- */

const GeosSectionSimple = () => {
    const [geo, setGeo] = useState("all");
    return (
        <Section title="Geos">
            <RadioGroup size="md" value={geo} onChange={setGeo}>
                <RadioButton value="all" label="All" />
                <RadioButton value="regions" label="Specify Regions" />
                <RadioButton value="countries" label="Specify Countries" />
            </RadioGroup>
        </Section>
    );
};

/* --------------------------------- Geos: expanded country cascade (Screen) --- */

const CascadeColumn = ({ children }: { children: ReactNode }) => (
    <div className="flex min-w-0 flex-1 flex-col gap-1 border-r border-secondary py-2 last:border-r-0">{children}</div>
);

const CascadeItem = ({
    children,
    active,
    hasChildren,
    leading,
}: {
    children: ReactNode;
    active?: boolean;
    hasChildren?: boolean;
    leading?: ReactNode;
}) => (
    <button
        type="button"
        className={cx(
            "flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-100",
            active ? "font-semibold" : "text-secondary hover:bg-secondary/50",
        )}
        style={active ? { color: TEAL, backgroundColor: `${TEAL}14` } : undefined}
    >
        {leading}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {hasChildren && <ChevronRight className="size-4 shrink-0" aria-hidden="true" />}
    </button>
);

const GeosSectionCountries = () => (
    <Section title="Geos" trailing={<PinkAction>Clear All</PinkAction>}>
        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
            <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Column 1 — targeting mode */}
                <CascadeColumn>
                    <CascadeItem leading={<RadioDot />}>All</CascadeItem>
                    <CascadeItem leading={<RadioDot />}>Specify Regions</CascadeItem>
                    <CascadeItem leading={<RadioDot selected />} active hasChildren>
                        Specify Countries
                    </CascadeItem>
                </CascadeColumn>

                {/* Column 2 — regions */}
                <CascadeColumn>
                    {["AFRICA", "APAC", "EUROPE", "LATAM", "MIDEAST", "NORAM"].map((r) => (
                        <CascadeItem key={r}>{r}</CascadeItem>
                    ))}
                    <CascadeItem active hasChildren>
                        OTHERS
                    </CascadeItem>
                </CascadeColumn>

                {/* Column 3 — countries */}
                <CascadeColumn>
                    <CascadeItem>Antarctica</CascadeItem>
                    <CascadeItem>French Southern Territories</CascadeItem>
                    <CascadeItem active hasChildren>
                        South Georgia and the South Sandwich Islands
                    </CascadeItem>
                </CascadeColumn>

                {/* Column 4 — sub-territories */}
                <CascadeColumn>
                    <CascadeItem>Bouvet Island</CascadeItem>
                    <CascadeItem>Heard Island and McDonald Islands</CascadeItem>
                </CascadeColumn>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-secondary bg-primary px-4 py-3">
                <Button color="secondary" className="uppercase">
                    Cancel
                </Button>
                <Button color="primary-pink" className="uppercase">
                    Save
                </Button>
            </div>
        </div>
    </Section>
);

/** Static teal radio dot used inside the geo cascade column. */
const RadioDot = ({ selected }: { selected?: boolean }) => (
    <span
        className={cx("flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", selected ? "" : "bg-primary ring-primary")}
        style={selected ? { backgroundColor: TEAL, boxShadow: `inset 0 0 0 1px ${TEAL}` } : undefined}
    >
        {selected && <span className="size-1.5 rounded-full bg-white" />}
    </span>
);

/* ============================================================== STEP 1 pages === */

export const Step1Targeting = () => (
    <CampaignSetupLayout currentStep={0} footer={<WizardFooter nextLabel="Budget" />}>
        <DealIdSection />
        <CampaignNameSection />
        <GeosSectionSimple />
        <PlatformSection />
        <AppsSection />
    </CampaignSetupLayout>
);

export const Step1TargetingCountries = () => (
    <CampaignSetupLayout currentStep={0} footer={<WizardFooter nextLabel="Budget" />}>
        <DealIdSection />
        <CampaignNameSection />
        <GeosSectionCountries />
        <PlatformSection />
        <AppsSection targetedApps={["App 1", "App 2", "App 3"]} />
    </CampaignSetupLayout>
);

/* ==================================================================== STEP 2 — BUDGET === */

const BudgetFields = () => (
    <>
        <Section title="Budget" description="Total Campaign Spend">
            <Input aria-label="Total campaign spend" size="md" icon={CurrencyDollar} placeholder="0.00" wrapperClassName="max-w-xs" />
        </Section>

        <Section title="Bid Amount" description="eCPM for this campaign.">
            <Input aria-label="Bid amount" size="md" icon={CurrencyDollar} placeholder="0.00" wrapperClassName="max-w-xs" />
        </Section>
    </>
);

const ScheduleSummary = () => (
    <section className="flex flex-col gap-2 border-b border-secondary py-8">
        <div className="grid max-w-2xl grid-cols-2 overflow-hidden rounded-xl ring-1 ring-secondary">
            <div className="flex flex-col gap-1 border-r border-secondary px-5 py-4">
                <span className="text-sm text-tertiary">Start Date:</span>
                <span className="text-lg font-semibold text-primary">June 1st, 2021</span>
            </div>
            <div className="flex flex-col gap-1 px-5 py-4">
                <span className="text-sm text-tertiary">End Date</span>
                <span className="text-lg font-semibold text-primary">None</span>
            </div>
        </div>
        <p className="text-sm text-tertiary italic">All scheduling times are in UTC</p>
    </section>
);

const DailyImpressionCap = () => {
    const [cap, setCap] = useState("off");
    return (
        <Section title="Daily Impression Cap">
            <RadioGroup size="md" value={cap} onChange={setCap} className="gap-5">
                <RadioButton value="off" label="Do Not Enable" />
                <div className="flex items-center gap-4">
                    <RadioButton value="on" label="Enable" />
                    <Input aria-label="Daily impression cap" size="md" placeholder="1000" wrapperClassName="max-w-xs" isDisabled={cap !== "on"} />
                </div>
            </RadioGroup>
        </Section>
    );
};

export const Step2Budget = () => (
    <CampaignSetupLayout currentStep={1} footer={<WizardFooter backLabel="Targeting" nextLabel="Priority" />}>
        <BudgetFields />
        <ScheduleSummary />
        <DailyImpressionCap />
    </CampaignSetupLayout>
);

/* ------------------------------------------------ Step 2 with date-picker open (Screen-3) --- */

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const buildMonthCells = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday = 0
    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(year, month, 1 - startDay + i);
        return { day: date.getDate(), inMonth: date.getMonth() === month };
    });
};

const MiniMonth = ({
    year,
    month,
    label,
    selected = [],
    range = [],
}: {
    year: number;
    month: number;
    label: string;
    selected?: number[];
    range?: number[];
}) => (
    <div className="flex flex-col gap-3">
        <p className="text-center text-sm font-semibold text-primary">{label}</p>
        <div className="grid grid-cols-7 gap-y-1">
            {WEEKDAYS.map((w) => (
                <span key={w} className="py-1 text-center text-xs font-medium text-tertiary">
                    {w}
                </span>
            ))}
            {buildMonthCells(year, month).map((cell, i) => {
                const isSelected = cell.inMonth && selected.includes(cell.day);
                const inRange = cell.inMonth && range.includes(cell.day);
                return (
                    <div key={i} className="flex justify-center">
                        <span
                            className={cx(
                                "flex size-9 items-center justify-center rounded-full text-sm",
                                !cell.inMonth && "text-quaternary",
                                cell.inMonth && !isSelected && "text-secondary",
                                inRange && "bg-secondary",
                                isSelected && "font-semibold text-white",
                            )}
                            style={isSelected ? { backgroundColor: PINK } : undefined}
                        >
                            {cell.day}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);

const HourSelect = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary shadow-xs ring-1 ring-primary ring-inset">
            {value}
            <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
        </div>
    </div>
);

const DatePickerPanel = () => (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-primary shadow-lg ring-1 ring-secondary">
        <div className="flex flex-col gap-6 p-6 md:flex-row">
            <MiniMonth year={2025} month={0} label="January 2025" selected={[10, 16]} range={[13, 14, 15]} />
            <MiniMonth year={2025} month={1} label="February 2025" />
        </div>
        <div className="flex flex-col gap-4 border-t border-secondary p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-3">
                <HourSelect label="Start Hour" value="00:00 UTC" />
                <HourSelect label="End Hour" value="17:00 UTC" />
            </div>
            <div className="flex items-center gap-3">
                <Button color="secondary">Clear</Button>
                <Button color="primary-pink" className="uppercase">
                    Done
                </Button>
            </div>
        </div>
    </div>
);

export const Step2BudgetSchedule = () => (
    <CampaignSetupLayout currentStep={1} footer={<WizardFooter backLabel="Targeting" nextLabel="Priority" />}>
        <BudgetFields />
        <section className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-primary">Flight Dates</h2>
                <p className="text-sm text-tertiary italic">All scheduling times are in UTC</p>
            </div>
            <DatePickerPanel />
        </section>
    </CampaignSetupLayout>
);

/* ==================================================================== STEP 3 — PRIORITY === */

const AuctionRulesSection = () => {
    const [rule, setRule] = useState("guaranteed");
    return (
        <Section
            title="Auction Rules"
            description="Please review the details of your campaign to ensure they are accurate, then click the Publish button below."
        >
            <RadioGroup size="md" value={rule} onChange={setRule} className="gap-5">
                <RadioButton value="guaranteed" label="Guaranteed Campaign" hint="Prioritize this campaign over OMP auctions." />
                <RadioButton
                    value="ecpm"
                    label="eCPM Priority"
                    hint="Compare this campaign's eCPM to the winning OMP bid price and serve whichever is higher."
                />
                <RadioButton value="fallback" label="Fallback" hint="Serve campaign when OMP has no fill." />
            </RadioGroup>
        </Section>
    );
};

const PrioritySection = () => {
    const [priority, setPriority] = useState("off");
    return (
        <Section title="Priority" description="Set the priority of this campaign versus other active campaigns.">
            <RadioGroup size="md" value={priority} onChange={setPriority} className="gap-5">
                <RadioButton value="off" label="Do not enable" hint="Nimbus defaults to even distribution" />
                <div className="flex flex-col gap-3">
                    <RadioButton value="on" label="Enable" />
                    <div className="ml-7 flex max-w-xs flex-col gap-3">
                        <Select aria-label="Priority tier" items={[{ id: "1", label: "1" }, { id: "2", label: "2" }, { id: "3", label: "3" }]} selectedKey="1" isDisabled={priority !== "on"}>
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                        <Input aria-label="Priority weight" size="md" icon={Percent02} placeholder="100" isDisabled={priority !== "on"} />
                    </div>
                </div>
            </RadioGroup>
        </Section>
    );
};

export const Step3Priority = () => (
    <CampaignSetupLayout currentStep={2} footer={<WizardFooter backLabel="Budget" nextLabel="Creative" />}>
        <AuctionRulesSection />
        <PrioritySection />
    </CampaignSetupLayout>
);

/* ==================================================================== STEP 4 — CREATIVE === */

interface CreativeCol {
    id: string;
    label?: string;
    isRowHeader?: boolean;
    align?: "left" | "right";
}
interface CreativeRow {
    id: string;
    [key: string]: ReactNode;
}

const creativeColumns: CreativeCol[] = [
    { id: "creative", label: "Campaign Creative", isRowHeader: true },
    { id: "adType", label: "Ad Type" },
    { id: "adSize", label: "Ad Size" },
    { id: "cap", label: "Daily Impression Cap" },
    { id: "action", label: "", align: "right" },
];

const creativeRows: CreativeRow[] = [
    { id: "c1", creative: "Creative Name from the form above", adType: "HTML", adSize: "Medium Rectangle", cap: "1000", action: <PinkAction icon={XClose}>Remove</PinkAction> },
    { id: "c2", creative: "Creative Name from the form above", adType: "VAST", adSize: "Full Screen", cap: "1000", action: <PinkAction icon={XClose}>Remove</PinkAction> },
    { id: "c3", creative: "Creative Name from the form above", adType: "VAST", adSize: "Full Screen", cap: "1000", action: <PinkAction icon={XClose}>Remove</PinkAction> },
];

export const Step4Creative = () => (
    <CampaignSetupLayout currentStep={3} footer={<WizardFooter backLabel="Priority" nextLabel="Review" />}>
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-primary">Add Existing Asset</h2>
                <p className="text-sm text-tertiary">
                    If you are using brand new assets,{" "}
                    <span className="font-semibold" style={{ color: TEAL }}>
                        you must add them to your library
                    </span>{" "}
                    first.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input aria-label="Search assets" size="md" icon={SearchLg} placeholder="Search Assets" wrapperClassName="flex-1" />
                <Button color="primary-pink" className="uppercase">
                    Add
                </Button>
            </div>

            <CampaignCreativeTable />
        </div>
    </CampaignSetupLayout>
);

/* ==================================================================== STEP 5 — REVIEW === */

const ErrorBadge = ({ children }: { children: ReactNode }) => (
    <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{ color: PINK, backgroundColor: `${PINK}1f` }}
    >
        {children}
    </span>
);

const ReviewCard = ({ title, badge, children }: { title: string; badge?: ReactNode; children: ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-primary">{title}</h2>
            {badge}
        </div>
        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">{children}</div>
    </section>
);

const ReviewRow = ({ label, value, isError, index }: { label: string; value: ReactNode; isError?: boolean; index: number }) => (
    <div className={cx("grid grid-cols-[160px_1fr_auto] items-center gap-4 border-b border-secondary px-5 py-4 last:border-b-0", index % 2 === 1 && "bg-[#FCFAF9]")}>
        <span className="text-sm text-tertiary">{label}</span>
        <span className={cx("flex items-center gap-2 text-sm", isError ? "font-semibold text-error-primary" : "text-secondary")}>
            {value}
            {isError && <AlertCircle className="size-4 text-fg-error-secondary" aria-hidden="true" />}
        </span>
        <PinkAction>Edit</PinkAction>
    </div>
);

const setupRows: { label: string; value: string }[] = [
    { label: "Deal ID", value: "Auto Generate" },
    { label: "Name", value: "GTM-Mexico" },
    { label: "Geos", value: "Mexico, United States" },
    { label: "Platform", value: "Android, iOS" },
    { label: "Apps", value: "Not Specified" },
];

const budgetRows: { label: string; value: string }[] = [
    { label: "Budget", value: "$25,000.00" },
    { label: "Bid Amount (eCPM)", value: "$4.50" },
    { label: "Flight Dates", value: "Jun 1 – Jun 30, 2025" },
    { label: "Daily Impression Cap", value: "1000" },
    { label: "Apps", value: "Not Specified" },
];

interface ReviewCreativeCol {
    id: string;
    label?: string;
    isRowHeader?: boolean;
    isError?: boolean;
}
const reviewCreativeColumns: ReviewCreativeCol[] = [
    { id: "name", label: "Name", isRowHeader: true },
    { id: "cap", label: "Daily Impression Cap" },
    { id: "adType", label: "Ad Type" },
    { id: "impTrackers", label: "Impression Trackers" },
    { id: "clickTrackers", label: "Click Trackers" },
    { id: "action", label: "" },
];

export const ReviewCreativeTable = ({ firstRowError }: { firstRowError?: boolean } = {}) => {
    const rows = [
        { id: "r1", name: "GTM-Mexico-Banner-300x250", cap: "1000", adType: "HTML", impTrackers: "2", clickTrackers: "1" },
        { id: "r2", name: "GTM-Mexico-Banner-300x50", cap: "1000", adType: "HTML", impTrackers: "2", clickTrackers: "1" },
    ];
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
                <thead className="bg-secondary">
                    <tr>
                        {reviewCreativeColumns.map((col) => (
                            <th key={col.id} className="px-5 py-3 text-xs font-semibold text-tertiary">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr key={row.id} className={cx("border-t border-secondary", ri % 2 === 1 && "bg-[#FCFAF9]")}>
                            <td className="px-5 py-4 text-sm font-medium text-secondary">{row.name}</td>
                            <td className="px-5 py-4 text-sm text-tertiary">{row.cap}</td>
                            <td className="px-5 py-4 text-sm">
                                {firstRowError && ri === 0 ? (
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-error-primary" title="Invalid HTML Markup">
                                        {row.adType}
                                        <AlertCircle className="size-4 text-fg-error-secondary" aria-hidden="true" />
                                    </span>
                                ) : (
                                    <span className="text-tertiary">{row.adType}</span>
                                )}
                            </td>
                            <td className="px-5 py-4 text-sm text-tertiary">{row.impTrackers}</td>
                            <td className="px-5 py-4 text-sm text-tertiary">{row.clickTrackers}</td>
                            <td className="px-5 py-4 text-right">
                                <PinkAction>Edit</PinkAction>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ReviewHeader = () => (
    <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-primary">Review Campaign Settings</h1>
        <p className="text-sm text-tertiary">Please review the details of your campaign to ensure they are accurate, then click the Publish button below.</p>
    </div>
);

const ReviewFooter = () => (
    <WizardFooter
        backLabel="Creative"
        extra={
            <Button color="secondary" className="uppercase">
                Publish &amp; Duplicate
            </Button>
        }
        nextLabel="Publish"
    />
);

export const Step5Review = () => (
    <CampaignSetupLayout currentStep={4} footer={<ReviewFooter />}>
        <div className="flex flex-col gap-10">
            <ReviewHeader />

            <ReviewCard title="Setup">
                {setupRows.map((row, i) => (
                    <ReviewRow key={row.label} label={row.label} value={row.value} index={i} />
                ))}
            </ReviewCard>

            <ReviewCard title="Budget">
                {budgetRows.map((row, i) => (
                    <ReviewRow key={row.label} label={row.label} value={row.value} index={i} />
                ))}
            </ReviewCard>

            <ReviewCard title="Creative">
                <ReviewCreativeTable />
            </ReviewCard>
        </div>
    </CampaignSetupLayout>
);

export const Step5ReviewErrors = () => (
    <CampaignSetupLayout currentStep={4} footer={<ReviewFooter />}>
        <div className="flex flex-col gap-10">
            <ReviewHeader />

            <ReviewCard title="Setup">
                {setupRows.map((row, i) => (
                    <ReviewRow key={row.label} label={row.label} value={row.value} index={i} />
                ))}
            </ReviewCard>

            <ReviewCard title="Budget" badge={<ErrorBadge>1 Error Found</ErrorBadge>}>
                {budgetRows.map((row, i) => (
                    <ReviewRow key={row.label} label={row.label} value={row.label === "Budget" ? "Not Specified" : row.value} isError={row.label === "Budget"} index={i} />
                ))}
            </ReviewCard>

            <ReviewCard title="Rules" badge={<ErrorBadge>2 Errors Found</ErrorBadge>}>
                <ReviewCreativeTable firstRowError />
            </ReviewCard>
        </div>
    </CampaignSetupLayout>
);

/** The table used by Step4Creative, exposed without page navigation for the 102326 audit. */
export const CampaignCreativeTable = () => {
    return (
        <TableCard.Root>
            <Table aria-label="Campaign creatives" selectionMode="none">
                <Table.Header>
                    {creativeColumns.map((col) => (
                        <Table.Head
                            key={col.id}
                            id={col.id}
                            isRowHeader={col.isRowHeader}
                            label={col.label}
                            className={col.align === "right" ? "text-right" : undefined}
                        />
                    ))}
                </Table.Header>
                <Table.Body items={creativeRows}>
                    {(row) => (
                        <Table.Row id={row.id} columns={creativeColumns}>
                            {(col: CreativeCol) => (
                                <Table.Cell className={col.align === "right" ? "text-right" : undefined}>
                                    <span className={cx("text-sm", col.isRowHeader ? "font-medium text-secondary" : "text-tertiary")}>{row[col.id]}</span>
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
