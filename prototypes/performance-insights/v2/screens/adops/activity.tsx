import { useState } from "react";
import { Zap } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { DasShell, TEAL } from "../das-shell";
import { Band, Bands, BareSelect, DateCell, DateRow, SortTh, TABLE } from "../nimbus-ui";
import { DEMAND_PARTNERS } from "../sample-data";
import { useTableSort } from "../table-sort";
import {
    ACTIVITY_GROUP,
    ACTIVITY_RANGES,
    type ActivityEntry,
    type ActivityRange,
    type ActivityType,
    BLOCK_TYPES,
    SAMPLE_ACTIVITY,
    longDay,
} from "./adops-data";
import { ChecklistMenu } from "./adops-ui";

/**
 * AdOps → activity (reference/111326, 9.14.44 PM).
 *
 * Staging's date row (START DATE / END DATE, the range picker and the data-availability
 * note), then three bands of checkboxes — Blocking Activity, Demand Management, More —
 * with Filter by Block Type and Filter by Demand Source at the right. The log underneath
 * shows the kinds of change that are ticked, inside the range and filters; Show Notes
 * adds each group's notes. Nothing left → "No data to display in this date range."
 */

const minutes = (t: string) => {
    const [, h, m, ap] = t.match(/(\d+):(\d+) (AM|PM)/) ?? [];
    return ((Number(h) % 12) + (ap === "PM" ? 12 : 0)) * 60 + Number(m);
};

const Tick = ({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) => (
    <Checkbox size="md" label={<span className="text-md text-primary">{label}</span>} isSelected={on} onChange={onChange} />
);

const BANDS: { label: string; types: ActivityType[]; notes?: "blocking" | "demand" }[] = [
    { label: "Blocking Activity", types: ["Block", "Unblock"], notes: "blocking" },
    { label: "Demand Management", types: ["Frequency Cap", "Pause Demand", "Enable Demand", "Floors"], notes: "demand" },
    { label: "More", types: ["DAS", "Other"] },
];

export const Activity = ({ empty }: { empty?: boolean }) => {
    const [rangeId, setRangeId] = useState<ActivityRange>("last7");
    const [types, setTypes] = useState<ActivityType[]>(BANDS.flatMap((b) => b.types));
    const [notes, setNotes] = useState({ blocking: true, demand: true });
    const [blockTypes, setBlockTypes] = useState<string[]>([]);
    const [sources, setSources] = useState<string[]>([]);
    const range = ACTIVITY_RANGES.find((r) => r.id === rangeId)!;

    const rows = (empty ? [] : SAMPLE_ACTIVITY).filter(
        (r) =>
            r.day >= range.from &&
            r.day <= range.to &&
            types.includes(r.type) &&
            (!r.blockType || !blockTypes.length || blockTypes.includes(r.blockType)) &&
            (!r.source || !sources.length || sources.includes(r.source)),
    );
    const table = useTableSort(rows, (r, id) => (id === "date" ? `${r.day} ${String(minutes(r.time)).padStart(4, "0")}` : r[id as keyof ActivityEntry]));
    const noteFor = (r: ActivityEntry) => {
        const g = ACTIVITY_GROUP[r.type];
        return (g === "blocking" && notes.blocking) || (g === "demand" && notes.demand) ? r.note : undefined;
    };
    const showNotes = notes.blocking || notes.demand;
    const toggle = (t: ActivityType) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

    return (
        <DasShell navKey="activity">
            <div className="px-8">
                <Bands className="border-t-0">
                    <DateRow>
                        <DateCell label="Start date">{longDay(range.from)}</DateCell>
                        <DateCell label="End date">{longDay(range.to)}</DateCell>
                        <BareSelect label="Date range" value={rangeId} options={ACTIVITY_RANGES} onChange={setRangeId} />
                        {/* Staging's note sits in the row after the picker; it wraps inside its cell rather than dropping below. */}
                        <p className="flex max-w-xl min-w-80 flex-1 items-center gap-2 px-6 py-3 text-md text-tertiary">
                            <Zap className="size-5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                            Note: Demand data is available from 12/3/19. Blocked ad data is available from 1/6/19.
                        </p>
                    </DateRow>
                    {BANDS.map((b) => (
                        <Band
                            key={b.label}
                            label={b.label}
                            trailing={
                                b.notes === "blocking" ? (
                                    <ChecklistMenu label="Filter by Block Type" options={BLOCK_TYPES} value={blockTypes} onChange={setBlockTypes} />
                                ) : b.notes === "demand" ? (
                                    <ChecklistMenu label="Filter by Demand Source" options={DEMAND_PARTNERS} value={sources} onChange={setSources} />
                                ) : undefined
                            }
                        >
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                {b.types.map((t) => (
                                    <Tick key={t} label={t} on={types.includes(t)} onChange={() => toggle(t)} />
                                ))}
                                {b.notes && (
                                    <Tick label="Show Notes" on={notes[b.notes]} onChange={() => setNotes((cur) => ({ ...cur, [b.notes!]: !cur[b.notes!] }))} />
                                )}
                            </div>
                        </Band>
                    ))}
                </Bands>

                {rows.length === 0 ? (
                    <p className="py-10 text-md text-tertiary">No data to display in this date range.</p>
                ) : (
                    <div className={cx(TABLE.bleed, "mt-8 mb-10")}>
                        <table className={TABLE.table}>
                            <thead>
                                <tr>
                                    <SortTh id="date" sort={table.sort} onSort={table.onSort} className="w-56">
                                        Date
                                    </SortTh>
                                    <SortTh id="type" sort={table.sort} onSort={table.onSort} className="w-48">
                                        Type
                                    </SortTh>
                                    <SortTh id="change" sort={table.sort} onSort={table.onSort}>
                                        Change
                                    </SortTh>
                                    <SortTh id="by" sort={table.sort} onSort={table.onSort} className="w-44">
                                        By
                                    </SortTh>
                                    {showNotes && (
                                        <SortTh id="note" sort={table.sort} onSort={table.onSort}>
                                            Notes
                                        </SortTh>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((r, i) => (
                                    <tr key={r.id} className={cx("align-top", i % 2 === 1 && TABLE.list.stripe)}>
                                        <td className={cx(TABLE.list.td, "whitespace-nowrap")}>
                                            <span className="block text-primary">{longDay(r.day)}</span>
                                            <span className="block text-tertiary">{r.time}</span>
                                        </td>
                                        <td className={cx(TABLE.list.td, "font-semibold whitespace-nowrap text-primary")}>{r.type}</td>
                                        <td className={cx(TABLE.list.td, "text-primary")}>{r.change}</td>
                                        <td className={cx(TABLE.list.td, "whitespace-nowrap")}>{r.by}</td>
                                        {showNotes && <td className={TABLE.list.td}>{noteFor(r) ?? "—"}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DasShell>
    );
};
