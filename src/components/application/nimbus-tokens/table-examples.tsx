import { ChevronSelectorVertical } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { TABLE, type TableKind, tableHead } from "../../../../prototypes/das/v5/screens/nimbus-ui";

/**
 * Live examples of the 26 Oct table rule, drawn with the same TABLE / tableHead tokens
 * the v5 screens use, so these change when the rule does.
 */

const LIST_COLS = ["Status", "Asset Name", "Associated Campaigns", "Ad Type", "Ad Size"];
const LIST_ROWS = [
    ["Running", "SampleApp_Interstitial_A", "Sports fans", "HTML", "Full screen"],
    ["Running", "SampleApp_MREC_Garden", "Plant lovers · Always on", "HTML", "Medium Rectangle"],
    ["Paused", "SampleApp_Video_15s", "None", "VAST (xml)", "N/A"],
    ["Paused", "Arcade_Quest_Interstitial", "Sports fans", "HTML", "Full screen"],
];

const REPORT_COLS = ["Creative", "Spend", "Impressions", "Share of spend"];
const REPORT_ROWS = [
    ["FallLaunch_Interstitial_Stadium", "$6,041", "720,483", "41.7%"],
    ["FallLaunch_Interstitial_Jersey", "$5,419", "626,035", "37.4%"],
    ["FallLaunch_Interstitial_Countdown", "$3,040", "368,742", "21.0%"],
];

const Sortable = ({ kind, label }: { kind: TableKind; label: string }) => (
    <span className="flex items-center justify-between gap-3">
        {label}
        <ChevronSelectorVertical className={cx("size-4 shrink-0", TABLE[kind].sortIcon)} aria-hidden="true" />
    </span>
);

/** A list: light header, bold black labels, vertical rules, rows alternating #FFF / #FCFAF9. Full bleed. */
export const ListTableExample = ({ bleed = true }: { bleed?: boolean }) => (
    <div className={bleed ? TABLE.bleed : "overflow-x-auto rounded-xl ring-1 ring-secondary"}>
        <table className={TABLE.table}>
            <thead style={tableHead("list")}>
                <tr>
                    {LIST_COLS.map((c) => (
                        <th key={c} scope="col" className={TABLE.list.th}>
                            <Sortable kind="list" label={c} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {LIST_ROWS.map((r, i) => (
                    <tr key={r[1]} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                        {r.map((v, j) => (
                            <td key={j} className={TABLE.list.td}>
                                {j === 1 ? (
                                    <span className="font-semibold" style={{ color: "#37B6B7" }}>
                                        {v}
                                    </span>
                                ) : (
                                    v
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/** A report: charcoal header, white labels, rows alternating #FFF / #FCFAF9, totals. Full bleed. */
export const ReportTableExample = ({ bleed = true }: { bleed?: boolean }) => (
    <div className={bleed ? TABLE.bleed : "overflow-x-auto rounded-xl ring-1 ring-secondary"}>
        <table className={TABLE.table}>
            <thead style={tableHead("report")}>
                <tr>
                    {REPORT_COLS.map((c, i) => (
                        <th key={c} scope="col" className={cx(TABLE.report.th, i > 0 && "text-right")}>
                            <Sortable kind="report" label={c} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {REPORT_ROWS.map((r, i) => (
                    <tr key={r[0]} className={cx(i % 2 === 1 && TABLE.report.stripe)}>
                        {r.map((v, j) => (
                            <td key={j} className={cx(TABLE.report.td, j > 0 && "text-right tabular-nums")}>
                                {v}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot className={TABLE.report.foot}>
                <tr>
                    {["Total", "$14,500", "1,715,260", "100%"].map((v, j) => (
                        <td key={j} className={cx(TABLE.report.td, "font-bold", j > 0 && "text-right tabular-nums")}>
                            {v}
                        </td>
                    ))}
                </tr>
            </tfoot>
        </table>
    </div>
);
