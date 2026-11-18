import { useState } from "react";
import { Check, Plus } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { DasShell, PINK } from "../das-shell";
import { SortTh, StateAction, TABLE, TEAL_DARK } from "../nimbus-ui";
import { whole } from "../sample-data";
import { useTableSort } from "../table-sort";
import { HEADLINE, LABEL } from "../type-rules";
import { ACTIVE_DEMAND, type ActiveDemand, NPLUS_DEMAND } from "./demand-data";
import { DemandStatus } from "./demand-ui";

/**
 * Demand → manage active demand and manage active n+ demand (reference/111326, 9.12.35 /
 * 9.12.41 PM). One page, two lists:
 *
 *   "{n} Integrated Demand Partners"         DOWNLOAD SKAN IDS · ADD DEMAND · N+ CONTRACT (inactive)
 *   "{n} Integrated Nimbus+ Demand Partners" DOWNLOAD SKAN IDS · N+ CONTRACT (inactive)
 *
 * Then the partner table (Enabled toggles, + ADD sets an impression cap) and the
 * Third-Party Viewability setting, both as on staging.
 */

const COLUMNS = [
    { id: "source", label: "Demand Source" },
    { id: "status", label: "Status" },
    { id: "enabled", label: "Enabled" },
    { id: "cap", label: "Impression Cap" },
    { id: "type", label: "Demand Type" },
    { id: "placements", label: "Demand Placements" },
    { id: "unpublish", label: "Unpublish" },
];

export const ManageActiveDemand = ({ nplus = false, rows: initial }: { nplus?: boolean; rows?: ActiveDemand[] }) => {
    const [rows, setRows] = useState<ActiveDemand[]>(() => initial ?? (nplus ? NPLUS_DEMAND : ACTIVE_DEMAND));
    const [editing, setEditing] = useState<string>();
    const [draft, setDraft] = useState("");
    const [viewability, setViewability] = useState(false);

    const update = (id: string, patch: Partial<ActiveDemand>) => setRows((cur) => cur.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const commitCap = (id: string) => {
        const n = Number(draft.replace(/[^0-9]/g, ""));
        update(id, { cap: n > 0 ? n : undefined });
        setEditing(undefined);
    };

    const table = useTableSort(rows, (r, id) => {
        switch (id) {
            case "enabled":
                return r.enabled === undefined ? undefined : r.enabled ? 0 : 1;
            case "cap":
                return r.cap;
            case "type":
                return r.type;
            case "placements":
                return r.placements ? 0 : undefined;
            case "unpublish":
                return r.unpublish;
            case "status":
                return r.status;
            default:
                return r.source;
        }
    });

    return (
        <DasShell navKey={nplus ? "manage active n+ demand" : "manage active demand"}>
            <div className="px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <h2 className={cx("text-xl text-primary", HEADLINE)}>
                        {rows.length} Integrated {nplus ? "Nimbus+ " : ""}Demand Partners
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <StateAction onPress={() => undefined}>Download SKAN IDs</StateAction>
                        {!nplus && <StateAction onPress={() => undefined}>Add Demand</StateAction>}
                        <StateAction disabled onPress={() => undefined}>
                            <span className="inline-flex items-center gap-1.5">
                                <Check className="size-4" aria-hidden="true" />
                                N+ Contract
                            </span>
                        </StateAction>
                    </div>
                </div>

                <div className={TABLE.bleed}>
                    <table className={TABLE.table}>
                        <thead>
                            <tr>
                                {COLUMNS.map((c) => (
                                    <SortTh key={c.id} id={c.id} sort={table.sort} onSort={table.onSort}>
                                        {c.label}
                                    </SortTh>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((r, i) => (
                                <tr key={r.id} className={cx("align-middle", i % 2 === 1 && TABLE.list.stripe)}>
                                    <td className={cx(TABLE.list.td, "font-semibold text-primary")}>{r.source}</td>
                                    <td className={TABLE.list.td}>
                                        <DemandStatus status={r.status} />
                                    </td>
                                    <td className={TABLE.list.td}>
                                        {r.enabled !== undefined && (
                                            <Toggle
                                                size="md"
                                                aria-label={`${r.source} enabled`}
                                                isSelected={r.enabled}
                                                onChange={(on) => update(r.id, { enabled: on })}
                                            />
                                        )}
                                    </td>
                                    <td className={TABLE.list.td}>
                                        {r.enabled === undefined ? null : editing === r.id ? (
                                            <Input
                                                aria-label={`${r.source} impression cap`}
                                                autoFocus
                                                inputMode="numeric"
                                                value={draft}
                                                onChange={setDraft}
                                                onBlur={() => commitCap(r.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") commitCap(r.id);
                                                    if (e.key === "Escape") setEditing(undefined);
                                                }}
                                                wrapperClassName="w-40"
                                            />
                                        ) : r.cap ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDraft(String(r.cap));
                                                    setEditing(r.id);
                                                }}
                                                className="tabular-nums hover:underline"
                                            >
                                                {whole(r.cap)}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDraft("");
                                                    setEditing(r.id);
                                                }}
                                                className="inline-flex items-center gap-1 text-md font-bold uppercase"
                                                style={{ color: PINK }}
                                            >
                                                <Plus className="size-4" aria-hidden="true" /> Add
                                            </button>
                                        )}
                                    </td>
                                    <td className={TABLE.list.td}>{r.type}</td>
                                    <td className={TABLE.list.td}>
                                        {r.placements && (
                                            <a
                                                href="#"
                                                onClick={(e) => e.preventDefault()}
                                                className="font-bold whitespace-nowrap hover:underline"
                                                style={{ color: TEAL_DARK }}
                                            >
                                                Manage Placements »
                                            </a>
                                        )}
                                    </td>
                                    <td className={TABLE.list.td}>
                                        {r.unpublish && (
                                            <StateAction quiet disabled={r.unpublish === "off"} onPress={() => undefined}>
                                                Unpublish
                                            </StateAction>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <section className="-mx-8 mt-10 border-t border-secondary">
                    <h2 className={cx("border-b border-secondary px-8 py-5 text-xl text-primary", HEADLINE)}>Third-Party Viewability</h2>
                    <div className="flex flex-wrap items-start justify-between gap-6 px-8 py-6">
                        <div className="flex max-w-4xl flex-col gap-2 text-md text-secondary">
                            <p>This allows for all viewability information sent to Nimbus to be passed to your integrated demand partners.</p>
                            <p>
                                Turning this off will strip <span className="font-bold text-primary">all</span> viewability parameters from your ad requests
                                preventing demand from measuring viewability in your app.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cx(LABEL, "uppercase")} aria-hidden="true">
                                Allow Third-Party Viewability:
                            </span>
                            <Toggle size="md" aria-label="Allow third-party viewability" isSelected={viewability} onChange={setViewability} />
                        </div>
                    </div>
                </section>
            </div>
        </DasShell>
    );
};
