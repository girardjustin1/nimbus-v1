import type { FC, ReactNode } from "react";
import {
    Bank,
    ChevronDown,
    ChevronSelectorVertical,
    ChevronUp,
    Clock,
    CreditCard02,
    CurrencyDollarCircle,
    Download01,
    XClose,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

/**
 * Nimbus+ Payments (Publisher) — Demand → n+ payments screen.
 *
 * Rebuilds the reference screen (reference/screens/See Nimbus+ Payments
 * (Publisher)/Screen.png): a "Your Account" statement view with a running
 * balance summary and month-by-month payout tables. Demand partners that are
 * still "Running" are highlighted and prompt the publisher to update bank info;
 * "Complete" months show a settled Total Paid.
 *
 * Everything is composed from the Nimbus Global Nav + Untitled UI Table /
 * Button / FeaturedIcon components against the globally-applied Nimbus theme
 * (pink primary #DA6EA3, teal secondary).
 */

/* ----------------------------------------------------------------- Types --- */

type PayoutStatus = "running" | "complete" | "pending";

interface PayoutRow {
    id: string;
    /** Demand partner name. */
    partner: string;
    status: PayoutStatus;
    /** Formatted currency string. */
    amount: string;
    /** Running rows prompt the publisher to connect a payout account. */
    needsBankInfo?: boolean;
}

interface PaymentMonth {
    id: string;
    label: string;
    /** Optional subsection heading shown above the table (e.g. "Creative"). */
    subheading?: string;
    /** Show the "Newest first" sort control (top month only, in the reference). */
    showSort?: boolean;
    rows: PayoutRow[];
    totalPaid: string;
}

/* -------------------------------------------------------------- Sample data --- */

const balanceCards: { id: string; label: string; value: string; caption: string; icon: FC; color: "brand" | "success" | "gray" }[] = [
    { id: "available", label: "Available balance", value: "$0.00", caption: "Ready to withdraw", icon: CurrencyDollarCircle, color: "success" },
    { id: "pending", label: "Pending payouts", value: "$260.00", caption: "Across 2 active demand partners", icon: Clock, color: "gray" },
    { id: "lifetime", label: "Lifetime paid", value: "$4,920.00", caption: "Since Jan 2023", icon: CreditCard02, color: "gray" },
];

const months: PaymentMonth[] = [
    {
        id: "2024-01",
        label: "January 2024",
        subheading: "Creative",
        showSort: true,
        totalPaid: "$0.00",
        rows: [
            { id: "jan-personally", partner: "Personally", status: "running", amount: "$50.00", needsBankInfo: true },
            { id: "jan-rtb", partner: "RTB House", status: "running", amount: "$210.00", needsBankInfo: true },
        ],
    },
    {
        id: "2023-12",
        label: "December 2023",
        totalPaid: "$160.00",
        rows: [
            { id: "dec-personally", partner: "Personally", status: "complete", amount: "$30.00" },
            { id: "dec-rtb", partner: "RTB House", status: "complete", amount: "$130.00" },
        ],
    },
    {
        id: "2023-11",
        label: "November 2023",
        totalPaid: "$355.00",
        rows: [
            { id: "nov-personally", partner: "Personally", status: "complete", amount: "$95.00" },
            { id: "nov-rtb", partner: "RTB House", status: "complete", amount: "$180.00" },
            { id: "nov-index", partner: "Index Exchange", status: "complete", amount: "$80.00" },
        ],
    },
];

/* -------------------------------------------------------------- Sub-parts --- */

const statusConfig: Record<PayoutStatus, { label: string; dot: string; text: string }> = {
    running: { label: "Running", dot: "bg-[#DA6EA3]", text: "text-[#c01574] font-medium" },
    complete: { label: "Complete", dot: "bg-[#37b6b7]", text: "text-tertiary" },
    pending: { label: "Pending", dot: "bg-warning-solid", text: "text-warning-primary font-medium" },
};

const StatusIndicator = ({ status }: { status: PayoutStatus }) => {
    const cfg = statusConfig[status];
    return (
        <span className="inline-flex items-center gap-2 text-sm">
            <span className={cx("size-2 shrink-0 rounded-full", cfg.dot)} aria-hidden="true" />
            <span className={cfg.text}>{cfg.label}</span>
        </span>
    );
};

/** A pink pill that keeps its label uppercase, matching the reference. */
const SortPill = () => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold tracking-wide text-tertiary uppercase ring-1 ring-secondary transition-colors duration-100 ease-linear hover:bg-secondary_hover"
    >
        Newest first
        <ChevronUp className="size-3.5" aria-hidden="true" />
    </button>
);

const PaymentMonthSection = ({ month }: { month: PaymentMonth }) => (
    <section className="flex flex-col gap-5">
        {/* Month header + optional sort */}
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">{month.label}</h2>
            {month.showSort && <SortPill />}
        </div>

        {month.subheading && <h3 className="-mb-1 text-md font-semibold text-primary">{month.subheading}</h3>}

        <TableCard.Root>
            <Table aria-label={`${month.label} payouts`} selectionMode="none">
                <Table.Header>
                    <Table.Head id="partner" isRowHeader label="Demand partner" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="amount" label="Total amount" className="text-right" />
                </Table.Header>
                <Table.Body>
                    {month.rows.map((row) => {
                        const isRunning = row.status === "running";
                        return (
                            <Table.Row
                                key={row.id}
                                id={row.id}
                                className={isRunning ? "bg-[#fdf2f7] hover:bg-[#fbe8f0]" : undefined}
                            >
                                <Table.Cell>
                                    <span className={cx("text-sm font-medium", isRunning ? "text-[#c01574]" : "text-primary")}>{row.partner}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <StatusIndicator status={row.status} />
                                        {row.needsBankInfo && (
                                            <Button size="xs" color="primary-pink" iconLeading={Bank} className="uppercase">
                                                Update bank info
                                            </Button>
                                        )}
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="text-right">
                                    <span className={cx("text-sm font-semibold", isRunning ? "text-[#c01574]" : "text-primary")}>{row.amount}</span>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}

                    {/* Total paid summary row */}
                    <Table.Row id={`${month.id}-total`} className="bg-secondary/50">
                        <Table.Cell>
                            <span className="text-sm font-semibold text-primary">Total paid</span>
                        </Table.Cell>
                        <Table.Cell>
                            <span aria-hidden="true" />
                        </Table.Cell>
                        <Table.Cell className="text-right">
                            <span className="text-sm font-bold text-primary">{month.totalPaid}</span>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </TableCard.Root>
    </section>
);

/* --------------------------------------------------------------- The screen --- */

export const NimbusPaymentsScreen = () => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="n+ payments" />

            <main className="flex-1 overflow-x-hidden">
                {/* App header */}
                <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-5">
                    <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                    <div className="flex items-center gap-3">
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export statements
                        </Button>
                        <button
                            type="button"
                            aria-label="Account options"
                            className="inline-flex size-9 items-center justify-center rounded-full text-[#DA6EA3] transition-colors duration-100 ease-linear hover:bg-[#fdf2f7]"
                        >
                            <ChevronDown className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </header>

                <div className="flex flex-col gap-10 px-8 py-8">
                    {/* Balance summary */}
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {balanceCards.map((card) => (
                            <div key={card.id} className="flex items-start gap-4 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
                                <FeaturedIcon icon={card.icon} color={card.color} theme="light" size="lg" />
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-medium text-tertiary">{card.label}</p>
                                    <p className="text-display-xs font-semibold text-primary">{card.value}</p>
                                    <p className="text-sm text-tertiary">{card.caption}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Monthly statements */}
                    <div className="flex flex-col gap-10">
                        {months.map((month) => (
                            <PaymentMonthSection key={month.id} month={month} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NimbusPaymentsScreen;

/* =================================================================== *
 *  Redesigned "Overview / Completed Payments" tabbed views            *
 *                                                                     *
 *  Additional exported screens rebuilt from the batch-3 reference     *
 *  (reference/screens - batch 3/See Nimbus+ Payments (Publisher)/).   *
 *  A publisher-payments experience split across two tabs — "Overview" *
 *  (monthly demand-partner payouts) and "Completed Payments" (Tipalti *
 *  settlement history). Shares the Nimbus Global Nav + Untitled UI     *
 *  Table components with the statement screen above.                  *
 * =================================================================== */

const TEAL = "#37B6B7";
const PINK = "#DA6EA3";

/* -------------------------------------------------------- Shared layout --- */

/** Nav + "Your Account" header wrapper used by the redesigned views. */
const AccountLayout = ({ children }: { children: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav defaultActiveKey="n+ payments" />

        <main className="flex-1 overflow-x-hidden">
            <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-5">
                <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                <button
                    type="button"
                    aria-label="Account options"
                    className="inline-flex size-9 items-center justify-center rounded-full text-[#DA6EA3] transition-colors duration-100 ease-linear hover:bg-[#fdf2f7]"
                >
                    <ChevronDown className="size-5" aria-hidden="true" />
                </button>
            </header>

            {children}
        </main>
    </div>
);

/* ------------------------------------------------------------ Tab strip --- */

interface AccountTab {
    label: string;
    /** Text color of the tab — teal or pink accent. */
    color: "teal" | "pink";
    /** Active tabs get a light-teal fill. */
    active?: boolean;
    /** Trailing close affordance (e.g. a saved-query chip). */
    showClose?: boolean;
}

/**
 * Segmented tab strip matching the reference: a bordered, rounded-top group of
 * tabs where the active tab carries a subtle teal wash. Teal/pink accents echo
 * the tab styling used elsewhere in the Nimbus screens (see manage-assets).
 */
const AccountTabStrip = ({ tabs }: { tabs: AccountTab[] }) => (
    <div className="border-b border-secondary bg-primary px-8">
        <div className="flex w-fit overflow-hidden rounded-t-xl border border-b-0 border-secondary">
            {tabs.map((tab, i) => (
                <button
                    key={`${tab.label}-${i}`}
                    type="button"
                    aria-current={tab.active ? "page" : undefined}
                    className={cx(
                        "flex min-w-[240px] items-center justify-center gap-2 px-8 py-4 text-lg font-semibold transition-colors duration-100 ease-linear",
                        i > 0 && "border-l border-secondary",
                        !tab.active && "hover:bg-secondary_hover",
                    )}
                    style={{
                        color: tab.color === "teal" ? TEAL : PINK,
                        backgroundColor: tab.active ? `${TEAL}14` : undefined,
                    }}
                >
                    {tab.label}
                    {tab.showClose && <XClose className="size-5" aria-hidden="true" />}
                </button>
            ))}
        </div>
    </div>
);

/* ----------------------------------------------------------------- Pills --- */

/** Solid-pink uppercase pill used for row-level actions (e.g. DETAILS). */
const PinkPill = ({ children, icon: Icon }: { children: ReactNode; icon?: FC<{ className?: string }> }) => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition-opacity duration-100 ease-linear hover:opacity-90"
        style={{ backgroundColor: PINK }}
    >
        {children}
        {Icon && <Icon className="size-3.5" aria-hidden="true" />}
    </button>
);

/* ----------------------------------------------------------------------- *
 *  View 1 — CompletedPaymentsSimple (Screen.png)                          *
 * ----------------------------------------------------------------------- */

interface SimplePaymentRow {
    id: string;
    period: string;
    app: string;
    partner: string;
    amount: string;
}

const simplePayments: SimplePaymentRow[] = [
    { id: "sp-1", period: "May 2024", app: "App Name", partner: "DSP", amount: "$12.49" },
    { id: "sp-2", period: "May 2024", app: "Another App Name", partner: "Another DSP", amount: "$12.49" },
    { id: "sp-3", period: "April 2024", app: "A Third App Name", partner: "DSP Name", amount: "$12.49" },
];

/** Shared Period | App | Demand Partner | Gross Amount $USD table. */
const SimplePaymentsTable = ({ label, rows }: { label: string; rows: SimplePaymentRow[] }) => (
    <TableCard.Root>
        <Table aria-label={label} selectionMode="none">
            <Table.Header>
                <Table.Head id="period" isRowHeader label="Period" />
                <Table.Head id="app" label="App" />
                <Table.Head id="partner" label="Demand Partner" />
                <Table.Head id="amount" label="Gross Amount $USD" />
            </Table.Header>
            <Table.Body>
                {rows.map((row) => (
                    <Table.Row key={row.id} id={row.id}>
                        <Table.Cell>
                            <span className="text-sm font-medium text-primary">{row.period}</span>
                        </Table.Cell>
                        <Table.Cell>{row.app}</Table.Cell>
                        <Table.Cell>{row.partner}</Table.Cell>
                        <Table.Cell>
                            <span className="text-sm font-medium text-primary">{row.amount}</span>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </TableCard.Root>
);

const CompletedPaymentsTabs = () => (
    <AccountTabStrip
        tabs={[
            { label: "Save Queries", color: "pink" },
            { label: "Save Queries", color: "pink" },
            { label: "May 13, 2024", color: "teal", active: true, showClose: true },
        ]}
    />
);

export const CompletedPaymentsSimple = () => (
    <AccountLayout>
        <CompletedPaymentsTabs />

        <div className="flex flex-col gap-6 px-8 py-8">
            <h2 className="text-xl font-semibold text-primary">Completed Payments via Tipalti</h2>
            <SimplePaymentsTable label="Completed payments via Tipalti" rows={simplePayments} />
        </div>
    </AccountLayout>
);

/* ----------------------------------------------------------------------- *
 *  View 1b — CompletedPaymentsWithAdjustments (Screen-3.png)              *
 * ----------------------------------------------------------------------- */

const adjustments: SimplePaymentRow[] = [
    { id: "adj-1", period: "May 2024", app: "DSP 1", partner: "Note from dashboard UI", amount: "$-1.34" },
    { id: "adj-2", period: "May 2024", app: "DSP 2", partner: "Note from dashboard UI", amount: "$-298.07" },
    { id: "adj-3", period: "April 2024", app: "DSP 3", partner: "Note from dashboard UI", amount: "$-0.60" },
];

export const CompletedPaymentsWithAdjustments = () => (
    <AccountLayout>
        <CompletedPaymentsTabs />

        <div className="flex flex-col gap-8 px-8 py-8">
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold text-primary">Completed Payments via Tipalti</h2>
                <SimplePaymentsTable label="Completed payments via Tipalti" rows={simplePayments} />
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold text-primary">Adjustments</h2>
                <SimplePaymentsTable label="Adjustments" rows={adjustments} />
            </div>
        </div>
    </AccountLayout>
);

/* ----------------------------------------------------------------------- *
 *  View 2 — CompletedPaymentsDetailed (Screen-2.png)                      *
 * ----------------------------------------------------------------------- */

interface DetailedPaymentRow {
    id: string;
    date: string;
    method: string;
    gross: string;
    fees: string;
    net: string;
}

const detailedPayments: DetailedPaymentRow[] = [
    { id: "dp-1", date: "May 13, 2024", method: "ACH", gross: "$134.56", fees: "$12.99", net: "$111.57" },
    { id: "dp-2", date: "May 1, 2024", method: "ACH", gross: "$130.00", fees: "$130.00", net: "$130.00" },
    { id: "dp-3", date: "April 19, 2024", method: "ACH", gross: "$130.00", fees: "$130.00", net: "$130.00" },
];

export const CompletedPaymentsDetailed = () => (
    <AccountLayout>
        <AccountTabStrip
            tabs={[
                { label: "Overview", color: "pink" },
                { label: "Completed Payments", color: "teal", active: true },
            ]}
        />

        <div className="flex flex-col gap-6 px-8 py-8">
            <h2 className="text-xl font-semibold text-primary">Completed Payments via Tipalti</h2>

            <DetailedPaymentsTable />
        </div>
    </AccountLayout>
);

/* ----------------------------------------------------------------------- *
 *  View 3 — OverviewMonthlyPayouts (Screen-4.png)                         *
 * ----------------------------------------------------------------------- */

type OverviewStatusKind = "unsubmitted" | "complete";

interface OverviewRow {
    id: string;
    partner: string;
    status: OverviewStatusKind;
    amount: string;
    date: string;
}

interface OverviewMonth {
    id: string;
    label: string;
    /** Only the newest month shows the sort pill in the reference. */
    showSort?: boolean;
    rows: OverviewRow[];
    /** Teal total summary row (top month only in the reference). */
    total?: string;
}

const overviewPartners: { partner: string; amount: string }[] = [
    { partner: "ShareThrough", amount: "$222.34" },
    { partner: "LoopMe", amount: "$2,163.58" },
    { partner: "Accelerate DSP", amount: "$107,607.89" },
    { partner: "Nexxen", amount: "$221.80" },
    { partner: "Gitberry", amount: "$60.81" },
    { partner: "Brave", amount: "$421.37" },
    { partner: "Sovrn", amount: "$120.10" },
    { partner: "Kayzen", amount: "$418.38" },
    { partner: "Edge226", amount: "$15.98" },
    { partner: "Smadex", amount: "$367.06" },
];

const makeOverviewRows = (prefix: string, completeIndex?: number): OverviewRow[] =>
    overviewPartners.map((p, i) => ({
        id: `${prefix}-${i}`,
        partner: p.partner,
        status: i === completeIndex ? "complete" : "unsubmitted",
        amount: p.amount,
        date: "November 1, 2024",
    }));

const overviewMonths: OverviewMonth[] = [
    { id: "jul-2024", label: "July 2024", showSort: true, rows: makeOverviewRows("jul"), total: "$112,515.67" },
    // June repeats the demand partners with Accelerate DSP already settled (Complete).
    { id: "jun-2024", label: "June 2024", rows: makeOverviewRows("jun", 2) },
];

const overviewStatusConfig: Record<OverviewStatusKind, { label: string; dot: string }> = {
    unsubmitted: { label: "Unsubmitted", dot: "bg-[#f79009]" },
    complete: { label: "Complete", dot: "bg-[#17b26a]" },
};

const OverviewStatusIndicator = ({ status }: { status: OverviewStatusKind }) => {
    const cfg = overviewStatusConfig[status];
    return (
        <span className="inline-flex items-center gap-2 text-sm text-tertiary">
            <span className={cx("size-2 shrink-0 rounded-full", cfg.dot)} aria-hidden="true" />
            {cfg.label}
        </span>
    );
};

/** Column header with a teal sort chevron, matching the reference. */
const SortableHead = ({ id, label, isRowHeader }: { id: string; label: string; isRowHeader?: boolean }) => (
    <Table.Head id={id} isRowHeader={isRowHeader}>
        <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-primary">
            {label}
            <ChevronSelectorVertical className="size-4" style={{ color: TEAL }} aria-hidden="true" />
        </span>
    </Table.Head>
);

const OverviewMonthSection = ({ month }: { month: OverviewMonth }) => (
    <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">{month.label}</h2>
            {month.showSort && <PinkPill icon={ChevronUp}>Newest first</PinkPill>}
        </div>

        <TableCard.Root>
            <Table aria-label={`${month.label} demand payouts`} selectionMode="none">
                <Table.Header>
                    <SortableHead id="demand" label="Demand" isRowHeader />
                    <SortableHead id="blocked" label="Blocked By" />
                    <SortableHead id="amount" label="Demand" />
                    <SortableHead id="date" label="Demand" />
                </Table.Header>
                <Table.Body>
                    {month.rows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <span className="text-sm font-medium text-primary">{row.partner}</span>
                            </Table.Cell>
                            <Table.Cell>
                                <OverviewStatusIndicator status={row.status} />
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-primary">{row.amount}</span>
                            </Table.Cell>
                            <Table.Cell>{row.date}</Table.Cell>
                        </Table.Row>
                    ))}

                    {month.total && (
                        <Table.Row id={`${month.id}-total`}>
                            <Table.Cell>
                                <span className="text-sm font-semibold" style={{ color: TEAL }}>
                                    TOTAL
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <span aria-hidden="true" />
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm font-bold" style={{ color: TEAL }}>
                                    {month.total}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <span aria-hidden="true" />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    </section>
);

export const OverviewMonthlyPayouts = () => (
    <AccountLayout>
        <AccountTabStrip
            tabs={[
                { label: "Overview", color: "teal", active: true },
                { label: "Completed Payments", color: "pink" },
            ]}
        />

        <div className="flex flex-col gap-10 px-8 py-8">
            <p className="text-sm text-tertiary">
                &ldquo;Payment date&rdquo; is calculated by adding the demand partner&rsquo;s payment terms with Nimbus plus three business days.
            </p>

            {overviewMonths.map((month) => (
                <OverviewMonthSection key={month.id} month={month} />
            ))}
        </div>
    </AccountLayout>
);

/** The table used by CompletedPaymentsDetailed, exposed without page navigation for the 102326 audit. */
export const DetailedPaymentsTable = () => {
    return (
        <TableCard.Root>
            <Table aria-label="Completed payments via Tipalti — detailed" selectionMode="none">
                <Table.Header>
                    <Table.Head id="date" isRowHeader label="Payment Date" />
                    <Table.Head id="method" label="Payment Method" />
                    <Table.Head id="gross" label="Gross Payment ($USD)" />
                    <Table.Head id="fees" label="Tipalti Fees ($USD)" />
                    <Table.Head id="net" label="Net Payment ($MXN)" />
                    <Table.Head id="actions" label="" />
                </Table.Header>
                <Table.Body>
                    {detailedPayments.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <span className="text-sm font-medium text-primary">{row.date}</span>
                            </Table.Cell>
                            <Table.Cell>{row.method}</Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-primary">{row.gross}</span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-primary">{row.fees}</span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-primary">{row.net}</span>
                            </Table.Cell>
                            <Table.Cell className="text-right">
                                <PinkPill>Details</PinkPill>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

/** Existing sample data and table implementations, without page navigation. */
export const PaymentMonthTableExamples = () => (
    <div className="flex flex-col gap-10">
        {months.map((month) => (
            <PaymentMonthSection key={month.id} month={month} />
        ))}
    </div>
);
export const SimplePaymentTableExample = () => <SimplePaymentsTable label="Completed payments via Tipalti" rows={simplePayments} />;
export const AdjustmentTableExample = () => <SimplePaymentsTable label="Adjustments" rows={adjustments} />;
export const MonthlyOverviewTableExamples = () => (
    <div className="flex flex-col gap-10">
        {overviewMonths.map((month) => (
            <OverviewMonthSection key={month.id} month={month} />
        ))}
    </div>
);
