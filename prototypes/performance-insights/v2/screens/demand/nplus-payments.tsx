import { type ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { DasShell, PINK } from "../das-shell";
import { ROUTES } from "../nav";
import { PageTabs, SortTh, TABLE, TOTAL_CELL, TOTAL_ROW } from "../nimbus-ui";
import { money } from "../sample-data";
import { useTableSort } from "../table-sort";
import { HEADLINE } from "../type-rules";
import { OPEN_MONTHS, PAID_MONTHS, type PaymentMonth, longDate } from "./demand-data";
import { DemandStatus } from "./demand-ui";

/**
 * Demand → n+ payments (reference/111326, 9.12.47 / 9.13.06 PM).
 *
 * Two tabs, each its own screen: Overview (months not yet paid) and Completed Payments.
 * A section per month, newest first (NEWEST FIRST flips the order), each with its own
 * search, a sortable table and a TOTAL row for the payments shown.
 */

type Tab = "overview" | "completed";

const TABS = [
    { id: "overview", label: "Overview", href: ROUTES.nplusPayments },
    { id: "completed", label: "Completed Payments", href: ROUTES.nplusCompleted },
];

export const NplusPayments = ({ tab = "overview", months }: { tab?: Tab; months?: PaymentMonth[] }) => {
    const list = months ?? (tab === "overview" ? OPEN_MONTHS : PAID_MONTHS);
    const [newest, setNewest] = useState(true);
    const ordered = newest ? list : [...list].reverse();

    const order = (
        <button
            type="button"
            onClick={() => setNewest((n) => !n)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-md font-bold whitespace-nowrap text-white uppercase transition duration-100 ease-linear hover:opacity-90"
            style={{ backgroundColor: PINK }}
        >
            {newest ? "Newest First" : "Oldest First"}
            {newest ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
        </button>
    );

    return (
        <DasShell navKey="n+ payments">
            <PageTabs tabs={TABS} active={tab} />
            <div className="flex flex-col gap-10 px-8 py-6">
                {tab === "overview" && (
                    <p className="text-md text-secondary">
                        "Expected payment date" is calculated by adding the demand partner's payment terms with Nimbus plus three business days. Dates are not
                        guaranteed.
                    </p>
                )}
                {ordered.length === 0 ? (
                    <p className="text-lg text-secondary">There are no {tab === "completed" ? "completed" : "upcoming"} payments at this time.</p>
                ) : (
                    ordered.map((m, i) => (
                        <MonthSection
                            key={m.id}
                            month={m}
                            dateLabel={tab === "completed" ? "Payment Date" : "Expected Payment Date"}
                            trailing={i === 0 ? order : undefined}
                        />
                    ))
                )}
            </div>
        </DasShell>
    );
};

const MonthSection = ({ month, dateLabel, trailing }: { month: PaymentMonth; dateLabel: string; trailing?: ReactNode }) => {
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const shown = month.payments.filter((p) => !q || `${p.demand} ${p.status}`.toLowerCase().includes(q));
    const table = useTableSort(shown, (p, id) => (id === "amount" ? p.amount : id === "date" ? p.date : id === "status" ? p.status : p.demand));
    const total = shown.reduce((sum, p) => sum + p.amount, 0);

    return (
        <section className="flex flex-col gap-4" aria-label={month.label}>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className={cx("text-xl text-primary", HEADLINE)}>{month.label}</h2>
                {trailing}
            </div>
            <Input aria-label={`Search ${month.label}`} icon={SearchLg} placeholder="Search" wrapperClassName="w-full" value={query} onChange={setQuery} />
            <div className={TABLE.bleed}>
                <table className={TABLE.table}>
                    <thead>
                        <tr>
                            <SortTh id="demand" sort={table.sort} onSort={table.onSort} className="w-[28%]">
                                Demand
                            </SortTh>
                            <SortTh id="status" sort={table.sort} onSort={table.onSort}>
                                Status
                            </SortTh>
                            <SortTh id="amount" align="right" sort={table.sort} onSort={table.onSort}>
                                Total Amount
                            </SortTh>
                            <SortTh id="date" sort={table.sort} onSort={table.onSort}>
                                {dateLabel}
                            </SortTh>
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.length === 0 && (
                            <tr>
                                <td colSpan={4} className={cx(TABLE.list.td, "text-tertiary")}>
                                    No payments match “{query.trim()}”.
                                </td>
                            </tr>
                        )}
                        {table.rows.map((p, i) => (
                            <tr key={p.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                <td className={TABLE.list.td}>{p.demand}</td>
                                <td className={TABLE.list.td}>
                                    <DemandStatus status={p.status} />
                                </td>
                                <td className={cx(TABLE.list.td, "text-right tabular-nums")}>{money(p.amount)}</td>
                                <td className={TABLE.list.td}>{longDate(p.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot style={TOTAL_ROW}>
                        <tr>
                            <td className={cx(TABLE.list.td, "uppercase")} style={TOTAL_CELL}>
                                Total
                            </td>
                            <td className={TABLE.list.td} />
                            <td className={TABLE.list.td} style={TOTAL_CELL}>
                                {money(total)}
                            </td>
                            <td className={TABLE.list.td} />
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
};
