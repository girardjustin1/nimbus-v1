import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";
import { cx } from "@/utils/cx";

/**
 * Nimbus+ Payouts — internal admin payouts tool.
 *
 * Rebuilds the reference flow (reference/screens - batch 2/MVP January 2024):
 *   - Overview                     — monthly payout tables (Screen.png)
 *   - Publisher Payments states    — Moloco drill-down with per-state statuses:
 *       Unsubmitted (Screen-1), Complete (Screen-2),
 *       Current Billing Period (Screen-3), 1 Issue / Resubmit (Screen-4)
 *
 * All states share the same chrome: Nimbus Global Nav (dark), an internal admin
 * top nav bar, the "Your App" header with a pink chevron, and the teal
 * "Publish Payouts / TBD" sub-tab strip.
 */

/* --------------------------------------------------------------- Palette --- */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";
const CYAN = "#2ec4e6";
const ORANGE_DOT = "#F79009";
const ORANGE_TEXT = "#B54708";
const GREEN_DOT = "#17B26A";
const GRAY_DOT = "#98A2B3";
const RED = "#d92d20";

/* ----------------------------------------------------------------- Chrome --- */

const adminTabs: { label: string; active?: boolean }[] = [
    { label: "Nimbus Publishers" },
    { label: "TPE Revenue" },
    { label: "Nimbus Revenue" },
    { label: "Nimbus+ Payouts", active: true },
    { label: "Users" },
    { label: "Demand Requests" },
    { label: "Kibana Reporting" },
    { label: "Storybook" },
];

/** Internal admin horizontal nav bar (above the "Your App" header). */
const AdminNav = () => (
    <nav className="flex items-center gap-x-8 overflow-x-auto border-b border-secondary bg-secondary px-8 py-3.5">
        {adminTabs.map((tab) => (
            <button
                key={tab.label}
                type="button"
                aria-current={tab.active ? "page" : undefined}
                className={cx(
                    "whitespace-nowrap text-sm transition-colors duration-100 ease-linear",
                    tab.active ? "font-bold text-primary" : "font-medium hover:opacity-80",
                )}
                style={tab.active ? undefined : { color: PINK }}
            >
                {tab.label}
            </button>
        ))}
    </nav>
);

/** Teal "Publish Payouts / TBD" sub-tab strip (matches manage-assets tabs). */
const PayoutTabs = ({ active = "publish" }: { active?: "publish" | "tbd" }) => {
    const tab = (label: string, isActive: boolean, first?: boolean) => (
        <button
            type="button"
            aria-current={isActive ? "page" : undefined}
            className={cx(
                "px-8 py-4 text-lg font-semibold transition-colors duration-100 ease-linear",
                first ? "border-r border-secondary" : "",
                isActive ? "" : "hover:bg-secondary_hover",
            )}
            style={{ color: TEAL, backgroundColor: isActive ? `${TEAL}14` : undefined }}
        >
            {label}
        </button>
    );

    return (
        <div className="flex border-b border-secondary">
            {tab("Publish Payouts", active === "publish", true)}
            {tab("TBD", active === "tbd")}
        </div>
    );
};

const AppShell = ({ children }: { children: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav defaultActiveKey="performance insights" />

        <main className="flex flex-1 flex-col overflow-x-hidden bg-primary">
            <AdminNav />

            <header className="flex items-center justify-between border-b border-secondary px-8 py-5">
                <h1 className="text-display-xs font-semibold text-primary">Your App</h1>
                <button
                    type="button"
                    aria-label="App options"
                    className="inline-flex size-9 items-center justify-center rounded-full transition-colors duration-100 ease-linear hover:bg-[#fdf2f7]"
                    style={{ color: PINK }}
                >
                    <ChevronDown className="size-6" aria-hidden="true" />
                </button>
            </header>

            <PayoutTabs active="publish" />

            {children}
        </main>
    </div>
);

/* ------------------------------------------------------------- Primitives --- */

/** Status dot + label. Pass `color` to tint the label; omit for dark text. */
const StatusDot = ({ label, dot, color, weight = "font-medium" }: { label: string; dot: string; color?: string; weight?: string }) => (
    <span className={cx("inline-flex items-center gap-2 text-sm", weight)} style={color ? { color } : undefined}>
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />
        <span className={color ? undefined : "text-secondary"}>{label}</span>
    </span>
);

/** Orange outline "● 1 Issue" pill shown beside a heading. */
export const IssuePill = () => (
    <span
        className="inline-flex items-center gap-1.5 rounded-full border bg-primary px-2.5 py-1 text-xs font-semibold"
        style={{ color: ORANGE_TEXT, borderColor: `${ORANGE_DOT}66` }}
    >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: ORANGE_DOT }} aria-hidden="true" />
        1 Issue
    </span>
);

/** Gray "NEWEST FIRST ▲" sort pill. */
const SortPill = () => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold tracking-wide text-tertiary uppercase ring-1 ring-secondary transition-colors duration-100 ease-linear hover:bg-secondary_hover"
    >
        Newest first
        <ChevronUp className="size-3.5" aria-hidden="true" />
    </button>
);

/** Rounded pill action button (pink or cyan). */
export const PillAction = ({ children, variant = "pink", className }: { children: ReactNode; variant?: "pink" | "cyan"; className?: string }) => (
    <button
        type="button"
        className={cx(
            "inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap text-white uppercase transition-opacity duration-100 ease-linear hover:opacity-90",
            className,
        )}
        style={{ backgroundColor: variant === "pink" ? PINK : CYAN }}
    >
        {children}
    </button>
);

/* ==================================================================== *
 * Overview — monthly payout tables (Screen.png)                        *
 * ==================================================================== */

interface OverviewRow {
    id: string;
    demand: string;
    status: { label: string; dot: string; color?: string; weight?: string };
    profit: string;
    expected: string;
    action: "manage" | "view";
    danger?: boolean;
}

const januaryRows: OverviewRow[] = [
    {
        id: "jan-personally",
        demand: "Personally",
        status: { label: "Processing in Tipaiti", dot: ORANGE_DOT, color: ORANGE_TEXT },
        profit: "$12.34",
        expected: "$12.34",
        action: "manage",
    },
    {
        id: "jan-issue",
        demand: "$3,000.00",
        status: { label: "1 Issue", dot: RED, color: RED, weight: "font-semibold" },
        profit: "$124.55",
        expected: "$124.55",
        action: "manage",
        danger: true,
    },
];

const decemberRows: OverviewRow[] = [
    {
        id: "dec-personally",
        demand: "Personally",
        status: { label: "Complete", dot: GREEN_DOT },
        profit: "$425.78",
        expected: "$425.78",
        action: "view",
    },
    {
        id: "dec-issue",
        demand: "1 Issue",
        status: { label: "Complete", dot: GREEN_DOT },
        profit: "$3,579.99",
        expected: "$3,579.99",
        action: "view",
    },
];

const OverviewTable = ({ rows, sortable }: { rows: OverviewRow[]; sortable?: boolean }) => (
    <TableCard.Root>
        <Table aria-label="Payouts" selectionMode="none">
            <Table.Header>
                <Table.Head id="demand" isRowHeader allowsSorting={sortable} label="Demand" />
                <Table.Head id="status" allowsSorting={sortable} label="Status" />
                <Table.Head id="profit" label="Profit" />
                <Table.Head id="expected" label="Expected Amount" />
                <Table.Head id="actions" label="Actions" />
            </Table.Header>
            <Table.Body>
                {rows.map((row) => (
                    <Table.Row key={row.id} id={row.id} className={row.danger ? "bg-[#fdf2f7] hover:bg-[#fbe8f0]" : undefined}>
                        <Table.Cell>
                            <span className={cx("text-sm font-semibold", row.danger ? undefined : "text-primary")} style={row.danger ? { color: RED } : undefined}>
                                {row.demand}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <StatusDot {...row.status} />
                        </Table.Cell>
                        <Table.Cell>
                            <span className={cx("text-sm font-semibold", row.danger ? undefined : "text-primary")} style={row.danger ? { color: RED } : undefined}>
                                {row.profit}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <span className={cx("text-sm font-semibold", row.danger ? undefined : "text-primary")} style={row.danger ? { color: RED } : undefined}>
                                {row.expected}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            {row.action === "manage" ? (
                                <PillAction variant="pink">Manage Publish Payments</PillAction>
                            ) : (
                                <PillAction variant="cyan">View Publisher Payments</PillAction>
                            )}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </TableCard.Root>
);

export const NimbusPlusPayoutsOverview = () => (
    <AppShell>
        <div className="flex flex-col gap-10 px-8 py-8">
            <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-primary">January 2024</h2>
                        <IssuePill />
                    </div>
                    <SortPill />
                </div>
                <OverviewTable rows={januaryRows} />
            </section>

            <section className="flex flex-col gap-5">
                <h2 className="text-xl font-semibold text-primary">December 2023</h2>
                <OverviewTable rows={decemberRows} sortable />
            </section>
        </div>
    </AppShell>
);

/* ==================================================================== *
 * Publisher Payments — Moloco drill-down (Screen-1/2/3/4)              *
 * ==================================================================== */

type PublisherState = "unsubmitted" | "complete" | "billing" | "issue";

interface PublisherRow {
    id: string;
    demand: string;
    status?: { label: string; dot: string; color?: string; weight?: string };
    total: string;
    danger?: boolean;
    resubmit?: boolean;
    isTotal?: boolean;
}

const publisherRowsByState: Record<PublisherState, PublisherRow[]> = {
    unsubmitted: [
        { id: "timehop", demand: "Timehop", status: { label: "Unsubmitted", dot: ORANGE_DOT, color: ORANGE_TEXT }, total: "$53.91" },
        { id: "kidoodle", demand: "Kidoodle", status: { label: "Unsubmitted", dot: ORANGE_DOT, color: ORANGE_TEXT }, total: "$124.55" },
        { id: "total-row", demand: "Total", total: "$95.31", isTotal: true },
    ],
    complete: [
        { id: "timehop", demand: "Timehop", status: { label: "Complete", dot: GREEN_DOT }, total: "$53.91" },
        { id: "kidoodle", demand: "Kidoodle", status: { label: "Complete", dot: GREEN_DOT }, total: "$124.55" },
        { id: "total-row", demand: "Total", total: "$95.31", isTotal: true },
    ],
    billing: [
        { id: "timehop", demand: "Timehop", status: { label: "Current Billing Period", dot: GRAY_DOT, color: "#667085" }, total: "$53.91" },
        { id: "kidoodle", demand: "Kidoodle", status: { label: "Current Billing Period", dot: GRAY_DOT, color: "#667085" }, total: "$124.55" },
        { id: "total-row", demand: "Total", total: "$95.31", isTotal: true },
    ],
    issue: [
        { id: "personally", demand: "Personally", status: { label: "Processing in Tipaiti", dot: ORANGE_DOT, color: ORANGE_TEXT }, total: "$53.91" },
        {
            id: "issue",
            demand: "$3,000.00",
            status: { label: "1 Issue", dot: RED, color: RED, weight: "font-semibold" },
            total: "$124.55",
            danger: true,
            resubmit: true,
        },
        { id: "total-row", demand: "Total", total: "$95.31", isTotal: true },
    ],
};

const PublisherFooter = ({ state }: { state: PublisherState }) => {
    if (state === "unsubmitted") {
        return (
            <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
                <p className="text-sm text-tertiary">Initiates transfer of funds via Tipalt. Ensure demand payments have been collected.</p>
                <PillAction variant="pink" className="px-6 py-3.5 text-sm">
                    Submit Payments to Tipalti
                </PillAction>
            </div>
        );
    }

    if (state === "issue") {
        return (
            <p className="text-right text-sm text-tertiary">
                There is an issue with one or more publisher payments. Resubmit payment to try again. For more information on errors, contact{" "}
                <a href="#" className="font-semibold" style={{ color: TEAL }}>
                    Tipalti support
                </a>
                .
            </p>
        );
    }

    // complete & billing: helper text only
    return <p className="text-right text-sm text-tertiary">Initiates transfer of funds via Tipalt. Ensure demand payments have been collected.</p>;
};

const PublisherPayments = ({ state }: { state: PublisherState }) => {
    const showIssuePill = state === "issue";

    return (
        <AppShell>
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-primary">January 2024 Publisher Payments for Moloco</h2>
                    {showIssuePill && <IssuePill />}
                </div>

                <PublisherPaymentsTable state={state} />

                <PublisherFooter state={state} />
            </div>
        </AppShell>
    );
};

export const NimbusPlusPayoutsPublisherUnsubmitted = () => <PublisherPayments state="unsubmitted" />;
export const NimbusPlusPayoutsPublisherComplete = () => <PublisherPayments state="complete" />;
export const NimbusPlusPayoutsPublisherBilling = () => <PublisherPayments state="billing" />;
export const NimbusPlusPayoutsPublisherIssue = () => <PublisherPayments state="issue" />;

export default NimbusPlusPayoutsOverview;

/** The table used by PublisherPayments, exposed without page navigation for the 102326 audit. */
export const PublisherPaymentsTable = ({ state = "unsubmitted" }: { state?: PublisherState } = {}) => {
    const rows = publisherRowsByState[state];
    return (
        <TableCard.Root>
            <Table aria-label="Publisher payments" selectionMode="none">
                <Table.Header>
                    <Table.Head id="demand" isRowHeader label="Demand" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="total" label="Total Amount" />
                </Table.Header>
                <Table.Body>
                    {rows.map((row) => (
                        <Table.Row key={row.id} id={row.id} className={row.danger ? "bg-[#fdf2f7] hover:bg-[#fbe8f0]" : undefined}>
                            <Table.Cell>
                                <span
                                    className={cx(
                                        "text-sm",
                                        row.isTotal ? "font-medium text-tertiary" : "font-semibold",
                                        row.danger ? undefined : !row.isTotal && "text-primary",
                                    )}
                                    style={row.danger ? { color: RED } : undefined}
                                >
                                    {row.demand}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center justify-between gap-4">
                                    {row.status ? <StatusDot {...row.status} /> : <span aria-hidden="true" />}
                                    {row.resubmit && <PillAction variant="pink">Resubmit Payment</PillAction>}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <span
                                    className={cx("text-sm font-semibold", row.danger ? undefined : "text-primary")}
                                    style={row.danger ? { color: RED } : undefined}
                                >
                                    {row.total}
                                </span>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

/** Existing sample data and table implementations, without page navigation. */
export const PayoutOverviewTableExamples = () => (
    <div className="flex flex-col gap-10">
        <OverviewTable rows={januaryRows} />
        <OverviewTable rows={decemberRows} sortable />
    </div>
);
