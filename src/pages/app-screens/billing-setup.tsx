import { type ReactNode, useState } from "react";
import { ChevronDown, ChevronSelectorVertical, Percent01, Plus, X as XIcon, Zap } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

/**
 * Account → Billing Setup.
 *
 * Rebuilds the reference screens (reference/screens/Billing Setup/*) with the
 * Nimbus Global Nav + Untitled UI form/table primitives on the pink Nimbus
 * theme. The billing-rate tables are factored into a small data-driven section
 * so every rate group on the page shares one implementation, and the "Set Core
 * Billing Rate" dialog is a single component driven by its `rateType`.
 */

/* ----------------------------------------------------------- Top app header --- */

const topNavLinks = ["TPE Revenue", "Nimbus Revenue", "Users", "Demand Requests", "Kibana Reporting", "Storybook"];

const AppTopBar = () => (
    <header className="flex items-center justify-end gap-8 border-b border-secondary bg-primary px-8 py-6">
        <nav className="flex items-center gap-8">
            {topNavLinks.map((link) => (
                <a
                    key={link}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm font-semibold whitespace-nowrap text-brand-secondary transition-colors duration-100 ease-linear hover:text-brand-secondary_hover"
                >
                    {link}
                </a>
            ))}
        </nav>
    </header>
);

/* ------------------------------------------------------ Billing rate section --- */

type RateBadge = { label: string; color: "purple" | "error" } | undefined;

interface RateRow {
    id: string;
    startDate: string;
    endDate: string;
    country: string;
    position: string;
    billingType: string;
    filledRate: string;
    unfilledRate: string;
}

const columns: { id: keyof Omit<RateRow, "id">; label: string }[] = [
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "country", label: "Country" },
    { id: "position", label: "Position" },
    { id: "billingType", label: "Billing Type" },
    { id: "filledRate", label: "Filled Rate" },
    { id: "unfilledRate", label: "Unfilled Rate" },
];

/** Small teal pill button used for the per-row Edit / Delete controls. */
const ControlPill = ({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "rose" }) => (
    <button
        type="button"
        className={cx(
            "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold text-white uppercase transition-colors duration-100 ease-linear",
            tone === "teal" ? "bg-[#37b6b7] hover:bg-[#2e9c9d]" : "bg-[#DA6EA3] hover:bg-[#c85c92]",
        )}
    >
        {children}
    </button>
);

interface BillingRateSectionProps {
    title: string;
    badge?: RateBadge;
    rows: RateRow[];
    hasControls?: boolean;
    onAdd?: () => void;
}

const BillingRateSection = ({ title, badge, rows, hasControls = true, onAdd }: BillingRateSectionProps) => (
    <section className="flex flex-col gap-4">
        {/* Section header */}
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-primary">{title}</h2>
                {badge && (
                    <Badge type="pill-color" color={badge.color} size="md">
                        {badge.label}
                    </Badge>
                )}
            </div>
            <Button size="sm" color="primary" iconLeading={Plus} onClick={onAdd}>
                Add
            </Button>
        </div>

        {/* Rate table */}
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr className="border-b border-secondary">
                        {columns.map((col) => (
                            <th key={col.id} className="px-4 py-3 text-left align-top">
                                <span className="flex items-start gap-1 text-sm font-semibold text-secondary">
                                    {col.label}
                                    <ChevronSelectorVertical className="mt-0.5 size-4 shrink-0 text-[#37b6b7]" aria-hidden="true" />
                                </span>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left align-top">
                            <span className="flex items-start gap-1 text-sm font-semibold text-secondary">
                                Controls
                                <ChevronSelectorVertical className="mt-0.5 size-4 shrink-0 text-[#37b6b7]" aria-hidden="true" />
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-secondary">
                            {columns.map((col) => (
                                <td key={col.id} className="px-4 py-4 text-sm whitespace-nowrap text-tertiary">
                                    {row[col.id] || "—"}
                                </td>
                            ))}
                            <td className="px-4 py-4">
                                {hasControls && (
                                    <div className="flex items-center gap-2">
                                        <ControlPill>Edit</ControlPill>
                                        <ControlPill tone="rose">Delete</ControlPill>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);

/* ------------------------------------------------------------- Sample data --- */

const makeRow = (id: string): RateRow => ({
    id,
    startDate: "1/1/2025",
    endDate: "",
    country: "Global",
    position: "",
    billingType: "ePCM",
    filledRate: "$0.17",
    unfilledRate: "$0.0000000",
});

const sections: Omit<BillingRateSectionProps, "onAdd">[] = [
    { title: "Creative", badge: { label: "Tiered Rate", color: "purple" }, rows: [makeRow("creative-1")] },
    { title: "DAS Billing Rates", badge: { label: "Fixed Rate", color: "error" }, rows: [makeRow("das-1")] },
    { title: "Unfilled Billing Rates", rows: [makeRow("unfilled-1")] },
    { title: "DAS Fallback Billing Rates", rows: [makeRow("fallback-1")], hasControls: false },
];

/* ----------------------------------------------------- Set Core Billing Rate --- */

const spendItems = [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
];

const companyItems = [
    { id: "acme", label: "Acme Media" },
    { id: "northwind", label: "Northwind Publishing" },
    { id: "globex", label: "Globex Digital" },
];

const billingTypeItems = [
    { id: "epcm", label: "ePCM" },
    { id: "cpm", label: "CPM" },
    { id: "cpc", label: "CPC" },
    { id: "flat", label: "Flat" },
];

/** Faded concentric rings that sit behind the header featured icon. */
const HeaderRings = () => (
    <div aria-hidden="true" className="pointer-events-none absolute -top-4 -left-4 size-40 [mask-image:radial-gradient(circle,black_0%,transparent_70%)]">
        <div className="absolute inset-0 rounded-full border border-secondary" />
        <div className="absolute inset-6 rounded-full border border-secondary" />
        <div className="absolute inset-12 rounded-full border border-secondary" />
    </div>
);

export interface BillingRateModalProps {
    /** Which variant of the rate form to render. */
    rateType?: "fixed" | "tiered";
    /** Render the dialog centered on a dark backdrop (used by the modal stories). */
    withBackdrop?: boolean;
}

/**
 * The "Set Core Billing Rate" dialog. Rendered as a plain card so it can be
 * shown open in a story; `rateType` switches between the Fixed and Tiered
 * layouts from the two modal references.
 */
export const BillingRateModal = ({ rateType: defaultRateType = "fixed", withBackdrop = true }: BillingRateModalProps) => {
    const [rateType, setRateType] = useState<"fixed" | "tiered">(defaultRateType);
    const [applyToAll, setApplyToAll] = useState(rateType === "tiered");

    const card = (
        <div className="relative w-full max-w-[640px] overflow-hidden rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-secondary">
            {/* Header */}
            <div className="relative flex items-start justify-between">
                <div className="relative">
                    <HeaderRings />
                    <FeaturedIcon className="relative" icon={Zap} color="gray" theme="modern" size="md" />
                </div>
                <button
                    type="button"
                    aria-label="Close"
                    className="rounded-md p-1 text-fg-quaternary transition-colors duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover"
                >
                    <XIcon className="size-5" />
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">Set Core Billing Rate</h2>
                <p className="text-sm text-tertiary">Choose how this account is billed for filled and unfilled impressions.</p>
            </div>

            {/* Rate type */}
            <div className="mt-5 flex items-center gap-6">
                <span className="text-sm font-semibold text-secondary">Rate Type:</span>
                <RadioGroup
                    aria-label="Rate type"
                    orientation="horizontal"
                    value={rateType}
                    onChange={(value) => setRateType(value as "fixed" | "tiered")}
                    className="!flex-row items-center gap-6"
                >
                    <RadioButton value="fixed" label="Fixed" />
                    <RadioButton value="tiered" label="Tiered" />
                </RadioGroup>
            </div>

            <hr className="my-5 border-secondary" />

            {/* Shared top fields */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <Input label="Start Date" placeholder="Select start date" />
                <Input label="End Date" placeholder="Select end date" />

                <Select label="Include Spend:" placeholder="Select option" items={spendItems}>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
                <Select label="Company" tooltip="The account this billing rate applies to." placeholder="Select company" items={companyItems}>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>

            {rateType === "fixed" ? (
                <div className="mt-4 flex flex-col gap-4">
                    <Select label="Billing Type" placeholder="Select billing type" items={billingTypeItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                    <Input label="Filled Rate" icon={Percent01} placeholder="0.00" />
                </div>
            ) : (
                <TieredFields applyToAll={applyToAll} onApplyToAllChange={setApplyToAll} />
            )}

            {/* Footer */}
            <div className="mt-6">
                {rateType === "fixed" ? (
                    <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-full bg-secondary py-3 text-sm font-semibold text-quaternary uppercase"
                    >
                        Save
                    </button>
                ) : (
                    <Button size="lg" color="primary" className="w-full justify-center uppercase">
                        Save
                    </Button>
                )}
            </div>
        </div>
    );

    if (!withBackdrop) return card;

    return <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0d12] p-8">{card}</div>;
};

const tiers = [
    { id: "tier-1", label: "Tier 1:", amount: "$0.00" },
    { id: "tier-2", label: "Tier 2:", amount: "$1,000,000.00" },
    { id: "tier-3", label: "Tier 3:", amount: "$3,000,000.00 and above" },
];

const TieredFields = ({ applyToAll, onApplyToAllChange }: { applyToAll: boolean; onApplyToAllChange: (v: boolean) => void }) => (
    <div className="mt-5 flex flex-col gap-5">
        <h3 className="text-md font-semibold text-primary">Set Tiers</h3>

        <div className="flex flex-col gap-4">
            {tiers.map((tier) => (
                <div key={tier.id} className="grid grid-cols-1 items-center gap-x-5 gap-y-2 sm:grid-cols-2">
                    <span className="text-sm text-secondary">
                        <span className="font-semibold text-primary">{tier.label}</span> {tier.amount}
                    </span>
                    <Input aria-label={`${tier.label} rate`} placeholder="0.00" icon={Percent01} />
                </div>
            ))}
        </div>

        <hr className="border-secondary" />

        <Checkbox
            size="md"
            isSelected={applyToAll}
            onChange={onApplyToAllChange}
            label="Optional: Apply this rate to all apps in this account"
        />

        <div className="rounded-lg bg-utility-blue-50 px-4 py-2.5 text-center text-sm font-medium text-utility-blue-700">
            This rate will be applied to 128 apps for Acme Media
        </div>
    </div>
);

/* --------------------------------------------------------------- The screen --- */

export const BillingSetupScreen = () => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="profile" />

            <main className="flex-1 overflow-x-hidden bg-primary">
                <AppTopBar />

                {/* Page title */}
                <div className="flex items-center justify-between border-b border-secondary px-8 py-6">
                    <h1 className="text-display-xs font-bold text-primary">Your Account</h1>
                    <button
                        type="button"
                        aria-label="Collapse account section"
                        className="text-[#DA6EA3] transition-colors duration-100 ease-linear hover:text-[#c85c92]"
                    >
                        <ChevronDown className="size-6" />
                    </button>
                </div>

                <div className="flex flex-col gap-12 px-8 py-8">
                    {sections.map((section) => (
                        <BillingRateSection key={section.title} {...section} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BillingSetupScreen;

/** Existing sample data and table implementations, without page navigation. */
export const BillingSetupTableExamples = () => (
    <div className="flex flex-col gap-10">
        {sections.map((section) => (
            <BillingRateSection key={section.title} {...section} />
        ))}
    </div>
);
