import type { Meta, StoryObj } from "@storybook/react-vite";
import { cx } from "@/utils/cx";
import { REPORT_STRIPE as STRIPE_V1, SortTh as SortThV1, TABLE as TABLE_V1, TEAL_DARK, tableHead as tableHeadV1 } from "../../../../../prototypes/app/v1/screens/nimbus-ui";
import { useTableSort as useSortV1 } from "../../../../../prototypes/app/v1/screens/table-sort";
import {
    REPORT_STRIPE as STRIPE_V2,
    SortTh as SortThV2,
    TABLE as TABLE_V2,
    TEAL_DARK as TEAL_DARK_V2,
    TOTAL_CELL,
    TOTAL_ROW,
    tableHead as tableHeadV2,
} from "../../../../../prototypes/app/v2/screens/nimbus-ui";
import { useTableSort as useSortV2 } from "../../../../../prototypes/app/v2/screens/table-sort";
import { BeforeAfter, V2Scope } from "./frame";

/**
 * Round 1 · Components · Report table (R1-08, R1-14, R1-15).
 * A small report built from the app's table pieces (TABLE, SortTh, tableHead): text
 * columns, number columns and a totals row. Sample data. The headers sort.
 */
const meta = {
    title: "Transition/Round 1/Components/Report table",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-08", "R1-14", "R1-15"];

interface Row {
    date: string;
    app: string;
    platform: string;
    requests: number;
    impressions: number;
    revenue: number;
}

/** Sample data only. */
const ROWS: Row[] = [
    { date: "Nov 01, 2026", app: "Sample App", platform: "Android", requests: 118400, impressions: 81200, revenue: 401.15 },
    { date: "Nov 01, 2026", app: "Sample App", platform: "iPhone", requests: 97300, impressions: 66900, revenue: 351.8 },
    { date: "Nov 02, 2026", app: "Test App", platform: "Android", requests: 121150, impressions: 84400, revenue: 419.6 },
    { date: "Nov 02, 2026", app: "Test App", platform: "iPhone", requests: 101100, impressions: 71110, revenue: 377.05 },
];

type Num = "requests" | "impressions" | "revenue";
const TEXT_COLS: { id: "date" | "app" | "platform"; label: string }[] = [
    { id: "date", label: "Date" },
    { id: "app", label: "App" },
    { id: "platform", label: "Platform" },
];
const NUM_COLS: { id: Num; label: string }[] = [
    { id: "requests", label: "Requests" },
    { id: "impressions", label: "Impressions" },
    { id: "revenue", label: "Revenue" },
];
const fmt = (id: Num, v: number) => (id === "revenue" ? `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : v.toLocaleString("en-US"));
const total = (id: Num) => ROWS.reduce((s, r) => s + r[id], 0);
const key = (r: Row, id: string) => r[id as keyof Row];

/** v1's report as v1's realtime.tsx draws it: number columns on the right, the totals row from TABLE.report.foot. */
const V1 = () => {
    const table = useSortV1<Row>(ROWS, key);
    return (
        <div className="px-8">
            <div className={TABLE_V1.bleed}>
                <table className={TABLE_V1.table}>
                    <thead style={tableHeadV1("report")}>
                        <tr>
                            {TEXT_COLS.map((c) => (
                                <SortThV1 key={c.id} id={c.id} kind="report" sort={table.sort} onSort={table.onSort}>
                                    {c.label}
                                </SortThV1>
                            ))}
                            {NUM_COLS.map((c) => (
                                <SortThV1 key={c.id} id={c.id} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                    {c.label}
                                </SortThV1>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((r, i) => (
                            <tr key={`${r.date}|${r.platform}`} style={i % 2 === 1 ? { backgroundColor: STRIPE_V1 } : undefined}>
                                {TEXT_COLS.map((c) => (
                                    <td key={c.id} className={cx(TABLE_V1.report.td, "text-secondary")}>
                                        {r[c.id]}
                                    </td>
                                ))}
                                {NUM_COLS.map((c) => (
                                    <td
                                        key={c.id}
                                        className={cx(TABLE_V1.report.td, "text-right tabular-nums", c.id === "revenue" ? "font-bold" : "text-secondary")}
                                        style={c.id === "revenue" ? { color: TEAL_DARK } : undefined}
                                    >
                                        {fmt(c.id, r[c.id])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className={TABLE_V1.report.foot}>
                        <tr style={{ color: TEAL_DARK }}>
                            <td colSpan={TEXT_COLS.length} className={cx(TABLE_V1.report.td, "font-bold uppercase")} style={{ color: TEAL_DARK }}>
                                Total
                            </td>
                            {NUM_COLS.map((c) => (
                                <td key={c.id} className={cx(TABLE_V1.report.td, "text-right font-bold tabular-nums")} style={{ color: TEAL_DARK }}>
                                    {fmt(c.id, total(c.id))}
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

/** v2's report as v2's realtime.tsx draws it: the same markup, every column left aligned, staging's totals row. */
const V2 = () => {
    const table = useSortV2<Row>(ROWS, key);
    return (
        <V2Scope>
            <div className="px-8">
                <div className={TABLE_V2.bleed}>
                    <table className={TABLE_V2.table}>
                        <thead style={tableHeadV2("report")}>
                            <tr>
                                {TEXT_COLS.map((c) => (
                                    <SortThV2 key={c.id} id={c.id} kind="report" sort={table.sort} onSort={table.onSort}>
                                        {c.label}
                                    </SortThV2>
                                ))}
                                {NUM_COLS.map((c) => (
                                    <SortThV2 key={c.id} id={c.id} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                        {c.label}
                                    </SortThV2>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((r, i) => (
                                <tr key={`${r.date}|${r.platform}`} style={i % 2 === 1 ? { backgroundColor: STRIPE_V2 } : undefined}>
                                    {TEXT_COLS.map((c) => (
                                        <td key={c.id} className={cx(TABLE_V2.report.td, "text-secondary")}>
                                            {r[c.id]}
                                        </td>
                                    ))}
                                    {NUM_COLS.map((c) => (
                                        <td
                                            key={c.id}
                                            className={cx(TABLE_V2.report.td, "text-right tabular-nums", c.id === "revenue" ? "font-bold" : "text-secondary")}
                                            style={c.id === "revenue" ? { color: TEAL_DARK_V2 } : undefined}
                                        >
                                            {fmt(c.id, r[c.id])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={TOTAL_ROW}>
                            <tr>
                                <td colSpan={TEXT_COLS.length} className={cx(TABLE_V2.report.td, "uppercase")} style={TOTAL_CELL}>
                                    Total
                                </td>
                                {NUM_COLS.map((c) => (
                                    <td key={c.id} className={TABLE_V2.report.td} style={TOTAL_CELL}>
                                        {fmt(c.id, total(c.id))}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </V2Scope>
    );
};

/** R1-08, R1-14, R1-15 in v1: number columns right aligned; totals 15px bold dark teal under a 2px rule. */
export const Before: Story = { render: () => <V1 /> };

/** R1-08, R1-14, R1-15 in v2: every column left aligned, tabular figures throughout; staging's totals (14px, weight 600, #039C9E, 3px #DDDDDD rule). */
export const After: Story = { render: () => <V2 /> };

/** R1-08, R1-14, R1-15: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    parameters: { layout: "fullscreen" },
    render: () => <BeforeAfter ids={IDS} before={<V1 />} after={<V2 />} />,
};
