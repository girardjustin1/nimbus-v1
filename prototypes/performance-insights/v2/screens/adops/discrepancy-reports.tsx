import { useState } from "react";
import { cx } from "@/utils/cx";
import dr1 from "../../assets/dr-template-1.png";
import dr2 from "../../assets/dr-template-2.png";
import dr3 from "../../assets/dr-template-3.png";
import dr4 from "../../assets/dr-template-4.png";
import sampleTable from "../../assets/sample-table.svg";
import { downloadCsv } from "../batch-data";
import { DasShell } from "../das-shell";
import { tableHead, Bands, DateCell, DateRow, SortTh, StateAction, TABLE, TOTAL_CELL, TOTAL_ROW } from "../nimbus-ui";
import { WEEK_RANGE, money, percent } from "../sample-data";
import { useTableSort } from "../table-sort";
import { HEADLINE } from "../type-rules";
import { DISCREPANCY_SOURCES, type DiscrepancyRow, discrepancyRows } from "./adops-data";
import { ChecklistMenu } from "./adops-ui";

/**
 * AdOps → discrepancy reports (reference/111326, 9.13.48 PM).
 *
 * Staging's date row — START DATE / END DATE, the Demand Sources picker, SEE REPORT and
 * DOWNLOAD .CSV — over the "Build a Nimbus Discrepancy Report" hero and the four
 * "Using Our Template" steps. SEE REPORT swaps the hero for the report itself: one row
 * per demand partner (all of them when none is picked), sortable, figures only.
 */

const STEPS = [
    { img: dr1, text: "Select Your Demand Partners and Date Range" },
    { img: dr2, text: "Download all Nimbus Data, Adjusted to the Proper Reporting Time Zones" },
    { img: dr3, text: "Add Your Demand Source Data" },
    { img: dr4, text: "Contact your Demand Partners About Discrepancies Over 10%" },
];

const Intro = () => (
    <>
        <section className="border-b border-secondary px-8 py-12">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
                <div className="flex max-w-xl flex-col gap-4">
                    <h2 className={cx("text-display-xs text-primary", HEADLINE)}>Build a Nimbus Discrepancy Report</h2>
                    <p className="text-md text-tertiary">
                        Conducting regular impression discrepancy reports is important. If the numbers are not aligned between you and your demand partner, you
                        could be missing out on additional revenue for impressions not being counted.
                    </p>
                    <p className="text-md text-tertiary">
                        Nimbus provides the foundation to create this report quickly and easily. We normalize demand partners’ reporting to their respective
                        time zones and organize all available data in a downloadable template.
                    </p>
                </div>
                <img src={sampleTable} alt="" className="h-auto w-[280px]" />
            </div>
        </section>
        <section className="flex flex-col items-center gap-10 px-8 py-12">
            <h2 className={cx("text-display-xs text-primary", HEADLINE)}>Using Our Template</h2>
            <ol className="grid w-full max-w-5xl grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
                {STEPS.map((s, i) => (
                    <li key={s.text} className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-40 items-end">
                            <img src={s.img} alt="" className="max-h-40 w-auto" />
                        </div>
                        <span className={cx("text-display-sm text-primary", HEADLINE)}>{i + 1}</span>
                        <span className="max-w-56 text-md text-secondary">{s.text}</span>
                    </li>
                ))}
            </ol>
        </section>
    </>
);

const COLS: { id: keyof DiscrepancyRow; label: string; right?: boolean }[] = [
    { id: "partner", label: "Demand Partner" },
    { id: "demand", label: "Demand Revenue", right: true },
    { id: "nimbus", label: "Nimbus Revenue", right: true },
    { id: "pct", label: "Revenue Discrepancy %", right: true },
];

const Report = ({ rows }: { rows: DiscrepancyRow[] }) => {
    const table = useTableSort(rows, (r, id) => r[id as keyof DiscrepancyRow]);
    const demand = rows.reduce((s, r) => s + r.demand, 0);
    const nimbus = rows.reduce((s, r) => s + r.nimbus, 0);
    return (
        <div className="px-8 py-8">
            <div className={TABLE.bleed}>
                <table className={TABLE.table}>
                    <thead style={tableHead("report")}>
                        <tr>
                            {COLS.map((c) => (
                                <SortTh key={c.id} id={c.id} kind="report" align={c.right ? "right" : "left"} sort={table.sort} onSort={table.onSort}>
                                    {c.label}
                                </SortTh>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((r, i) => (
                            <tr key={r.partner} className={cx(i % 2 === 1 && TABLE.report.stripe)}>
                                <td className={cx(TABLE.report.td, "font-semibold")}>{r.partner}</td>
                                <td className={cx(TABLE.report.td, "text-right tabular-nums")}>{money(r.demand)}</td>
                                <td className={cx(TABLE.report.td, "text-right tabular-nums")}>{money(r.nimbus)}</td>
                                <td className={cx(TABLE.report.td, "text-right tabular-nums")}>{percent(r.pct)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot style={TOTAL_ROW}>
                        <tr>
                            <td className={TABLE.report.td} style={TOTAL_CELL}>Total</td>
                            <td className={TABLE.report.td} style={TOTAL_CELL}>{money(demand)}</td>
                            <td className={TABLE.report.td} style={TOTAL_CELL}>{money(nimbus)}</td>
                            <td className={TABLE.report.td} style={TOTAL_CELL}>
                                {percent(nimbus ? ((nimbus - demand) / nimbus) * 100 : 0)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export const DiscrepancyReports = ({ report }: { report?: boolean }) => {
    const [sources, setSources] = useState<string[]>([]);
    const [shown, setShown] = useState(report ?? false);
    const rows = discrepancyRows(sources.length ? DISCREPANCY_SOURCES.filter((s) => sources.includes(s)) : DISCREPANCY_SOURCES);

    const exportCsv = () =>
        downloadCsv(
            "discrepancy-report",
            ["Demand Partner", "Demand Revenue", "Nimbus Revenue", "Revenue Discrepancy %"],
            rows.map((r) => [r.partner, r.demand.toFixed(2), r.nimbus.toFixed(2), r.pct.toFixed(2)]),
        );

    return (
        <DasShell navKey="discrepancy reports">
            <div className="px-8">
                <Bands className="border-t-0">
                    <DateRow
                        trailing={
                            <>
                                <StateAction onPress={() => setShown(true)}>See Report</StateAction>
                                <StateAction onPress={exportCsv}>Download .CSV</StateAction>
                            </>
                        }
                    >
                        <DateCell label="Start date">{WEEK_RANGE.start}</DateCell>
                        <DateCell label="End date">{WEEK_RANGE.end}</DateCell>
                        <ChecklistMenu variant="cell" align="left" label="Demand Sources" options={DISCREPANCY_SOURCES} value={sources} onChange={setSources} />
                    </DateRow>
                </Bands>
            </div>
            {shown ? <Report rows={rows} /> : <Intro />}
        </DasShell>
    );
};
