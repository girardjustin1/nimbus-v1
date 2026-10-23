import { useState, type ReactNode } from "react";
import { ChevronDown, CurrencyDollar, Percent03, XClose, Zap } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Table, TableCard } from "@/components/application/table/table";

/**
 * DAS — Billing Rates screen (reference/screens/DAS - Billing Rates).
 *
 * Recreates the Nimbus DAS billing-rates admin view: a top link bar, an
 * "Your Account" section header, and one billing-rate table per rate group
 * (Creative / DAS Billing Rates). Each table lists start/end dates, country,
 * position, billing type and filled/unfilled rates with per-row Edit/Delete
 * controls. The "Set Core Billing Rate" modals (add / tiered / fixed) are
 * exported as standalone panels the stories render open over the screen.
 */

/* ----------------------------------------------------------------- Top bar --- */

const TOP_LINKS = ["TPE Revenue", "Nimbus Revenue", "Users", "Demand Requests", "Kibana Reporting", "Storybook"];

const TopBar = () => (
    <div className="flex h-14 items-center justify-end gap-8 border-b border-secondary bg-secondary px-8">
        {TOP_LINKS.map((label) => (
            <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-semibold whitespace-nowrap text-[#DA6EA3] transition-colors duration-100 ease-linear hover:text-[#c85c92]"
            >
                {label}
            </a>
        ))}
    </div>
);

/* ------------------------------------------------------------ Control pills --- */

const ControlPill = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-xs transition-colors duration-100 ease-linear ${className ?? ""}`}
    >
        {children}
    </button>
);

/* --------------------------------------------------------------- Rate table --- */

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

interface RateSectionProps {
    title: string;
    badge: ReactNode;
    rows: RateRow[];
    onAdd?: () => void;
    onEdit?: () => void;
}

const COLUMNS = [
    { id: "startDate", label: "Start Date", isRowHeader: true },
    { id: "endDate", label: "End Date" },
    { id: "country", label: "Country" },
    { id: "position", label: "Position" },
    { id: "billingType", label: "Billing Type" },
    { id: "filledRate", label: "Filled Rate" },
    { id: "unfilledRate", label: "Unfilled Rate" },
    { id: "controls", label: "Controls" },
] as const;

const RateSection = ({ title, badge, rows, onAdd, onEdit }: RateSectionProps) => (
    <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-primary">{title}</h2>
                {badge}
            </div>
            <Button size="sm" color="primary-pink" className="px-6 font-bold uppercase" onClick={onAdd}>
                Add
            </Button>
        </div>

        <TableCard.Root>
            <Table aria-label={title} selectionMode="none">
                <Table.Header>
                    {COLUMNS.map((col) => (
                        <Table.Head key={col.id} id={col.id} isRowHeader={"isRowHeader" in col ? col.isRowHeader : undefined} allowsSorting label={col.label} />
                    ))}
                </Table.Header>
                <Table.Body items={rows}>
                    {(row) => (
                        <Table.Row id={row.id} columns={COLUMNS}>
                            {(col: (typeof COLUMNS)[number]) => (
                                <Table.Cell>
                                    {col.id === "controls" ? (
                                        <div className="flex items-center gap-2">
                                            <ControlPill className="bg-[#22B8E6] hover:bg-[#0ea5d4]" onClick={onEdit}>
                                                Edit
                                            </ControlPill>
                                            <ControlPill className="bg-[#E12D39] hover:bg-[#c4232e]">Delete</ControlPill>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-primary">{row[col.id as keyof RateRow]}</span>
                                    )}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    </section>
);

/* ------------------------------------------------------------- Sample data --- */

const creativeRows: RateRow[] = [
    {
        id: "creative-1",
        startDate: "1/1/2025",
        endDate: "",
        country: "Global",
        position: "",
        billingType: "ePCM",
        filledRate: "$0.17",
        unfilledRate: "$0.0000000",
    },
];

const dasRows: RateRow[] = [
    {
        id: "das-1",
        startDate: "1/1/2025",
        endDate: "",
        country: "Global",
        position: "",
        billingType: "ePCM",
        filledRate: "$0.17",
        unfilledRate: "$0.0000000",
    },
];

/* --------------------------------------------------------------- The screen --- */

export interface BillingRatesScreenProps {
    onAdd?: () => void;
    onEdit?: () => void;
}

export const BillingRatesScreen = ({ onAdd, onEdit }: BillingRatesScreenProps = {}) => {
    return (
        <div className="flex min-h-screen bg-primary">
            <GlobalNav defaultCollapsed defaultActiveKey="billing rates" />

            <main className="flex-1 overflow-x-hidden">
                <TopBar />

                {/* Section header */}
                <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-6">
                    <h1 className="text-display-xs font-bold text-primary">Your Account</h1>
                    <button type="button" aria-label="Collapse section" className="text-[#DA6EA3] transition-colors duration-100 hover:text-[#c85c92]">
                        <ChevronDown className="size-6" />
                    </button>
                </header>

                <div className="flex flex-col gap-10 px-8 py-8">
                    <RateSection
                        title="Creative"
                        badge={
                            <Badge color="purple" type="pill-color" size="md">
                                Tiered Rate
                            </Badge>
                        }
                        rows={creativeRows}
                        onAdd={onAdd}
                        onEdit={onEdit}
                    />

                    <RateSection
                        title="DAS Billing Rates"
                        badge={
                            <Badge color="pink" type="pill-color" size="md">
                                Fixed Rate
                            </Badge>
                        }
                        rows={dasRows}
                        onAdd={onAdd}
                        onEdit={onEdit}
                    />
                </div>
            </main>
        </div>
    );
};

/* --------------------------------------------------------- Modal primitives --- */

/** White card shell used by all three billing-rate modals. */
const ModalShell = ({
    title,
    description,
    children,
    onClose,
}: {
    title: string;
    description?: string;
    children: ReactNode;
    onClose?: () => void;
}) => (
    <div className="relative w-full max-w-[640px] rounded-2xl bg-primary p-6 text-left shadow-xl">
        <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover"
        >
            <XClose className="size-5" />
        </button>

        {/* Header with decorative ring pattern behind the featured icon */}
        <div className="relative mb-4">
            <div aria-hidden className="pointer-events-none absolute -top-2 -left-2 size-40 opacity-70">
                <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-secondary/60" />
                <div className="absolute top-1/2 left-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-secondary/40" />
            </div>
            <div className="relative flex flex-col gap-2">
                <FeaturedIcon icon={Zap} color="gray" theme="modern" size="md" />
                <div className="flex flex-col gap-1">
                    <h2 className="text-md font-bold text-primary">{title}</h2>
                    {description && <p className="text-sm text-tertiary">{description}</p>}
                </div>
            </div>
        </div>

        {children}
    </div>
);

const spendItems = [
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "spend", label: "Spend" },
];

const companyItems = [
    { id: "acme", label: "Acme Media" },
    { id: "globex", label: "Globex" },
    { id: "initech", label: "Initech" },
];

const billingTypeItems = [
    { id: "epcm", label: "ePCM" },
    { id: "cpm", label: "CPM" },
    { id: "cpc", label: "CPC" },
];

const Divider = () => <div className="my-5 h-px w-full bg-border-secondary" />;

/** Modal.png — minimal "Set Core Billing Rate" add form. */
export const AddRateModalContent = ({ onClose }: { onClose?: () => void }) => (
    <ModalShell title="Set Core Billing Rate" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Start Date" placeholder="Search for company" />
            <Input label="End Date" placeholder="Search for company" />
        </div>
        <div className="mt-4">
            <Input label="Start Date" icon={CurrencyDollar} placeholder="0.000010" />
        </div>

        <Divider />

        <Button size="lg" color="primary-pink" className="w-full font-bold uppercase" onClick={onClose}>
            Save
        </Button>
    </ModalShell>
);

/** Modal-1.png — tiered rate form with rate-type toggle, tiers and apply-all. */
export const TieredRateModalContent = ({ onClose }: { onClose?: () => void }) => {
    const tiers = [
        { label: "Tier 1:", value: "$0.00" },
        { label: "Tier 2", value: "$1,000,000.00" },
        { label: "Tier 3:", value: "$3,000,000.00 and above" },
    ];

    return (
        <ModalShell title="Set Core Billing Rate" description="Integer posuere erat a ante venenatis dapibus posuere velit aliquet." onClose={onClose}>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-primary">Rate Type:</span>
                <RadioGroup defaultValue="tiered" orientation="horizontal" className="flex-row gap-6">
                    <RadioButton value="fixed" label="Fixed" />
                    <RadioButton value="tiered" label="Tiered" />
                </RadioGroup>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Start Date" placeholder="Search for company" />
                <Input label="End Date" placeholder="Search for company" />
                <Select label="Include Spend:" placeholder="Search for company" items={spendItems}>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
                <Select label="Company" tooltip="Company this rate applies to" placeholder="Search for company" items={companyItems}>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>

            <h3 className="mt-6 mb-3 text-sm font-bold text-primary">Set Tiers</h3>
            <div className="flex flex-col gap-3">
                {tiers.map((tier) => (
                    <div key={tier.label} className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
                        <p className="text-sm text-tertiary">
                            <span className="text-primary">{tier.label}</span> {tier.value}
                        </p>
                        <Input aria-label={`${tier.label} rate`} placeholder="" />
                    </div>
                ))}
            </div>

            <Divider />

            <Checkbox size="md" defaultSelected label="Optional: Apply this rate to all apps in this account" />

            <div className="mt-4 rounded-lg bg-utility-blue-50 px-4 py-2.5 text-center text-sm font-medium text-utility-blue-700">
                This rate will be applied to [N] apps for [ACCOUNT NAME]
            </div>

            <div className="mt-5">
                <Button size="lg" color="primary-pink" className="w-full font-bold uppercase" onClick={onClose}>
                    Save
                </Button>
            </div>
        </ModalShell>
    );
};

/** Modal-2.png — fixed rate form with billing-type + filled-rate fields. */
export const FixedRateModalContent = ({ onClose }: { onClose?: () => void }) => (
    <ModalShell title="Set Core Billing Rate" description="Integer posuere erat a ante venenatis dapibus posuere velit aliquet." onClose={onClose}>
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-primary">Rate Type:</span>
            <RadioGroup defaultValue="fixed" orientation="horizontal" className="flex-row gap-6">
                <RadioButton value="fixed" label="Fixed" />
                <RadioButton value="tiered" label="Tiered" />
            </RadioGroup>
        </div>

        <Divider />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Start Date" placeholder="Search for company" />
            <Input label="End Date" placeholder="Search for company" />
            <Select label="Include Spend:" placeholder="Search for company" items={spendItems}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
            <Select label="Company" tooltip="Company this rate applies to" placeholder="Search for company" items={companyItems}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </div>

        <div className="mt-4">
            <Select label="Billing Type" placeholder="Search for company" items={billingTypeItems}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </div>

        <div className="mt-4">
            <Input label="Filled Rate" icon={Percent03} placeholder="Search for company" />
        </div>

        <Divider />

        <Button size="lg" color="secondary" isDisabled className="w-full font-bold uppercase">
            Adjust Amount
        </Button>
    </ModalShell>
);

/* ----------------------------------------------- Screen + open-modal wrapper --- */

type ModalKind = "add" | "tiered" | "fixed";

const MODAL_CONTENT: Record<ModalKind, (props: { onClose?: () => void }) => ReactNode> = {
    add: AddRateModalContent,
    tiered: TieredRateModalContent,
    fixed: FixedRateModalContent,
};

/** Renders the billing-rates screen with one modal shown open on top. */
export const BillingRatesScreenWithModal = ({ modal }: { modal: ModalKind }) => {
    const [isOpen, setIsOpen] = useState(true);
    const Content = MODAL_CONTENT[modal];

    return (
        <>
            <BillingRatesScreen onAdd={() => setIsOpen(true)} onEdit={() => setIsOpen(true)} />

            <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen} isDismissable>
                <Modal>
                    <Dialog>
                        <Content onClose={() => setIsOpen(false)} />
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </>
    );
};

export default BillingRatesScreen;

/** Existing App Screens section presets for the 102326 table inventory. */
export const DasRateTableExamples = () => (
    <div className="flex flex-col gap-10">
        <RateSection
            title="Creative"
            badge={
                <Badge color="purple" type="pill-color" size="md">
                    Tiered Rate
                </Badge>
            }
            rows={creativeRows}
        />
        <RateSection
            title="DAS Billing Rates"
            badge={
                <Badge color="pink" type="pill-color" size="md">
                    Fixed Rate
                </Badge>
            }
            rows={dasRows}
        />
    </div>
);
