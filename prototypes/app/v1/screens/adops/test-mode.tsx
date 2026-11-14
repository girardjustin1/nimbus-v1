import { useRef, useState } from "react";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { DasShell, Field, PinkAction, Section } from "../das-shell";
import { SortTh, StateAction, TABLE } from "../nimbus-ui";
import { useTableSort } from "../table-sort";
import { ME, OVERRIDE_STATUSES, type OverrideStatus, SAMPLE_OVERRIDES, TODAY, type TestOverride, dateKey } from "./adops-data";

/**
 * AdOps → manage test mode (reference/111326, 9.13.32 PM).
 *
 * Active Overrides — staging's NOTE line and a sortable list (Override Status, Platform,
 * App Version, Date Added, Set By; CANCEL removes one) — then Add Test Mode Override:
 * Override Status, Platform and App Version, and an add button that stays inactive until
 * all three are set. Adding puts the override at the top of the list.
 */

const PLATFORMS = ["Android", "iOS"] as const;

const COLS: { id: keyof TestOverride; label: string }[] = [
    { id: "status", label: "Override Status" },
    { id: "platform", label: "Platform" },
    { id: "version", label: "App Version" },
    { id: "date", label: "Date Added" },
    { id: "by", label: "Set By" },
];

export const TestMode = ({ empty }: { empty?: boolean }) => {
    const [overrides, setOverrides] = useState<TestOverride[]>(empty ? [] : SAMPLE_OVERRIDES);
    const [status, setStatus] = useState<OverrideStatus>();
    const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>();
    const [version, setVersion] = useState("");
    const next = useRef(0);
    const ready = status && platform && version.trim();

    const table = useTableSort(overrides, (r, id) => (id === "date" ? dateKey(r.date) : r[id as keyof TestOverride]));

    const add = () => {
        if (!ready) return;
        setOverrides((cur) => [{ id: `new-${next.current++}`, status, platform, version: version.trim(), date: TODAY, by: ME }, ...cur]);
        setStatus(undefined);
        setPlatform(undefined);
        setVersion("");
    };

    return (
        <DasShell navKey="manage test mode">
            <div className="px-8 py-8">
                <Section title="Active Overrides" description="NOTE: Canceling an override will default to the Nimbus SDK setting.">
                    <div className={TABLE.bleed}>
                        <table className={TABLE.table}>
                            <thead>
                                <tr>
                                    {COLS.map((c) => (
                                        <SortTh key={c.id} id={c.id} sort={table.sort} onSort={table.onSort}>
                                            {c.label}
                                        </SortTh>
                                    ))}
                                    <th scope="col" className={cx(TABLE.list.th, "w-32")}>
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((r, i) => (
                                    <tr key={r.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                        <td className={cx(TABLE.list.td, "font-semibold text-primary")}>{r.status}</td>
                                        <td className={TABLE.list.td}>{r.platform}</td>
                                        <td className={cx(TABLE.list.td, "tabular-nums")}>{r.version}</td>
                                        <td className={cx(TABLE.list.td, "whitespace-nowrap")}>{r.date}</td>
                                        <td className={TABLE.list.td}>{r.by}</td>
                                        <td className={cx(TABLE.list.td, "text-right")}>
                                            <PinkAction onPress={() => setOverrides((cur) => cur.filter((o) => o.id !== r.id))}>Cancel</PinkAction>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section title="Add Test Mode Override">
                    <div className="grid grid-cols-1 items-end gap-x-6 gap-y-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <Field label="Override Status">
                            <Select
                                aria-label="Override Status"
                                placeholder="Select"
                                items={OVERRIDE_STATUSES.map((s) => ({ id: s, label: s }))}
                                selectedKey={status ?? null}
                                onSelectionChange={(k) => setStatus(k ? (String(k) as OverrideStatus) : undefined)}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </Field>
                        <Field label="Platform">
                            <Select
                                aria-label="Platform"
                                placeholder="Select"
                                items={PLATFORMS.map((p) => ({ id: p, label: p }))}
                                selectedKey={platform ?? null}
                                onSelectionChange={(k) => setPlatform(k ? (String(k) as (typeof PLATFORMS)[number]) : undefined)}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </Field>
                        <Field label="App Version">
                            <Input aria-label="App Version" size="md" value={version} onChange={setVersion} />
                        </Field>
                        <div className="pb-0.5">
                            <StateAction disabled={!ready} onPress={add}>
                                Add Override
                            </StateAction>
                        </div>
                    </div>
                </Section>
            </div>
        </DasShell>
    );
};
