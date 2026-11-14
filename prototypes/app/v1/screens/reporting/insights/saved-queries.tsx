import { useState } from "react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { DasShell, PINK } from "../../das-shell";
import { ROUTES } from "../../nav";
import { Band, Bands, PageTabs, REPORT_STRIPE, SortTh, TABLE, tableHead } from "../../nimbus-ui";
import { useTableSort } from "../../table-sort";
import { LABEL } from "../../type-rules";
import { PI_TABS, type SavedQuery, rangeLabel, savedQueries } from "./insights-data";

/**
 * Performance Insights · Saved Queries — Nov 13 style guide, rebuilt from staging
 * (reference/111326, 9.11.58 PM): the two page tabs, "All reports are in UTC.", Show:
 * Saved / Recommended, and the report list. A row opens its query in New Query.
 */

const COLUMNS = [
    { id: "name", label: "Report Name" },
    { id: "range", label: "Report Date Range" },
    { id: "created", label: "Date Created" },
    { id: "account", label: "Account" },
    { id: "type", label: "Report Type" },
] as const;

const cellOf = (q: SavedQuery, id: string) =>
    id === "name" ? q.name : id === "range" ? rangeLabel(q.range) : id === "created" ? q.created : id === "account" ? q.account : q.type;

const openQuery = (q: SavedQuery) => `${ROUTES.piQuery}?q=${q.id}`;

export const SavedQueries = ({ empty = false }: { empty?: boolean }) => {
    const [show, setShow] = useState({ Saved: true, Recommended: true });
    const all = empty ? [] : savedQueries();
    const rows = all.filter((q) => show[q.type]);
    const table = useTableSort(rows, (q, id) => (id === "created" ? Date.parse(q.created) : cellOf(q, id)));

    return (
        <DasShell navKey="performance insights" account="exchange">
            <PageTabs tabs={PI_TABS} active="saved" trailing={<span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>} />
            <div className="flex flex-col px-8 pb-12">
                <Bands className="border-t-0">
                    <Band label="Show">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                            {(["Saved", "Recommended"] as const).map((k) => (
                                <Checkbox
                                    key={k}
                                    size="md"
                                    label={<span className={LABEL}>{k}</span>}
                                    isSelected={show[k]}
                                    onChange={(on) => setShow((cur) => ({ ...cur, [k]: on }))}
                                />
                            ))}
                        </div>
                    </Band>
                </Bands>
                <div className={cx(TABLE.bleed, "border-t-0")}>
                    <table className={TABLE.table}>
                        <thead style={tableHead("report")}>
                            <tr>
                                {COLUMNS.map((c) => (
                                    <SortTh key={c.id} id={c.id} kind="report" sort={table.sort} onSort={table.onSort}>
                                        {c.label}
                                    </SortTh>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((q, i) => (
                                <tr
                                    key={q.id}
                                    onClick={() => (window.location.hash = openQuery(q))}
                                    className="cursor-pointer transition duration-100 ease-linear hover:bg-secondary"
                                    style={i % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}
                                >
                                    <td className={TABLE.report.td}>
                                        <a
                                            href={openQuery(q)}
                                            className="font-bold hover:underline"
                                            style={{ color: PINK }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {q.name}
                                        </a>
                                    </td>
                                    <td className={TABLE.report.td}>{rangeLabel(q.range)}</td>
                                    <td className={cx(TABLE.report.td, "whitespace-nowrap")}>{q.created}</td>
                                    <td className={TABLE.report.td}>{q.account}</td>
                                    <td className={TABLE.report.td}>{q.type}</td>
                                </tr>
                            ))}
                            {table.rows.length === 0 && (
                                <tr>
                                    <td colSpan={COLUMNS.length} className={cx(TABLE.report.td, "py-10 text-center text-tertiary")}>
                                        No saved queries.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DasShell>
    );
};
