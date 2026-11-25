import { useState } from "react";
import { ChevronDown, ChevronRight } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { readHashParams } from "../../../../das/v1/screens/route";
import { DasShell, PINK, TEAL } from "../das-shell";
import { ROUTES } from "../nav";
import { SortTh, StateAction, TABLE, TealControls } from "../nimbus-ui";
import { useTableSort } from "../table-sort";
import { HEADLINE, LABEL } from "../type-rules";
import {
    CONFIG_FIELDS,
    DEFAULT_PARTNER,
    type DemandPartner,
    ENDPOINT_GEOS,
    type EndpointGeo,
    PARTNERS,
    REGIONS,
    endpointsOf,
    partnerBySlug,
} from "./demand-data";
import { ConfigureCrumb } from "./demand-ui";

/**
 * Demand → configure demand (reference/111326, 9.12.10 / 9.12.16 / 9.12.23 PM).
 *
 *   ConfigureDemand   the partner list: Partners / Draft Configuration / Ready to Publish.
 *                     "(+)" marks a partner that also runs as Nimbus+ demand. Each name opens
 *                     that partner's configuration.
 *   ConfigurePartner  one partner's configuration: Final Check bar (SAVE / VALIDATE /
 *                     PUBLISH), Nimbus+, Endpoints, Additional Configuration Data and
 *                     Whitelisted Geos. A partner with no demand template shows staging's
 *                     error instead.
 */

const NAV = "configure demand";

const h2 = cx("text-xl text-primary", HEADLINE);

/* ------------------------------------------------------------------ List --- */

export const ConfigureDemand = () => {
    const table = useTableSort(PARTNERS, (p, id) =>
        id === "draft" ? (p.draft ? Date.parse(p.draft) : undefined) : id === "ready" ? (p.ready ? 1 : undefined) : p.name,
    );
    return (
        <DasShell navKey={NAV}>
            <div className="px-8">
                <div className={cx(TABLE.bleed, "border-t-0")}>
                    <table className={TABLE.table}>
                        <thead>
                            <tr>
                                <SortTh id="name" sort={table.sort} onSort={table.onSort} className="w-[42%]">
                                    Partners
                                </SortTh>
                                <SortTh id="draft" sort={table.sort} onSort={table.onSort}>
                                    Draft Configuration
                                </SortTh>
                                <SortTh id="ready" sort={table.sort} onSort={table.onSort}>
                                    Ready to Publish
                                </SortTh>
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((p, i) => (
                                <tr key={p.slug} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                    <td className={cx(TABLE.list.td, "py-3")}>
                                        <a href={`${ROUTES.configurePartner}?p=${p.slug}`} className="font-bold hover:underline" style={{ color: PINK }}>
                                            {p.name}
                                            {p.plus && " (+)"}
                                        </a>
                                    </td>
                                    <td className={cx(TABLE.list.td, "py-3")}>{p.draft && `Saved ${p.draft}`}</td>
                                    <td className={cx(TABLE.list.td, "py-3")}>{p.ready && "Yes"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DasShell>
    );
};

/* ------------------------------------------------------------ Partner --- */

/** Opens the partner in the link (`?p=<slug>`), else `partner`. */
export const ConfigurePartner = ({ partner = DEFAULT_PARTNER }: { partner?: string }) => {
    const [p] = useState(() => partnerBySlug(readHashParams().get("p")) ?? partnerBySlug(partner) ?? PARTNERS[0]);
    return (
        <DasShell navKey={NAV}>
            <ConfigureCrumb partner={p.name} />
            {p.template ? <PartnerForm key={p.slug} p={p} /> : <ConfigError p={p} />}
        </DasShell>
    );
};

/** Staging's error when a partner has no demand template: what failed, what's missing, the request error. */
const ConfigError = ({ p }: { p: DemandPartner }) => (
    <div className="flex flex-col gap-3 px-8 py-14" role="alert">
        <p className="text-xl text-primary">There was an error loading the demand config data.</p>
        <p className={cx("text-xl text-primary", HEADLINE)}>Please set demand template for {p.slug} first.</p>
        <p className="pt-3 text-md text-tertiary">Error reading demand config — Request failed with status code 500</p>
    </div>
);

const PartnerForm = ({ p }: { p: DemandPartner }) => {
    const [saved, setSaved] = useState(() => ({
        plus: p.plus,
        endpoints: endpointsOf(p),
        fields: Object.fromEntries(CONFIG_FIELDS.map((f) => [f, ""])),
        geos: [] as string[],
    }));
    const [plus, setPlus] = useState(saved.plus);
    const [endpoints, setEndpoints] = useState(saved.endpoints);
    const [fields, setFields] = useState(saved.fields);
    const [geos, setGeos] = useState<string[]>(saved.geos);
    const current = { plus, endpoints, fields, geos };
    const dirty = JSON.stringify(current) !== JSON.stringify(saved);

    const endpointTable = useTableSort([...ENDPOINT_GEOS], (g, id) => (id === "endpoint" ? endpoints[g] || undefined : g));
    const fieldTable = useTableSort(CONFIG_FIELDS, (f, id) => (id === "value" ? fields[f] || undefined : f));

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-secondary px-8 py-4">
                <p className="text-lg text-primary">
                    <span className="font-bold">Final Check.</span> All sections must be validated. Publishing writes this data to Nimbus.
                </p>
                <div className="flex gap-3">
                    <StateAction disabled={!dirty} onPress={() => setSaved(current)}>
                        Save
                    </StateAction>
                    <StateAction onPress={() => undefined}>Validate</StateAction>
                    <StateAction onPress={() => undefined}>Publish</StateAction>
                </div>
            </div>

            <div className="flex flex-col gap-10 px-8 py-8">
                <section className="flex flex-col gap-4">
                    <h2 className={h2}>Nimbus+</h2>
                    <Toggle size="md" aria-label="Nimbus+" isSelected={plus} onChange={setPlus} />
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className={h2}>Endpoints</h2>
                    <div className={TABLE.bleed}>
                        <table className={TABLE.table}>
                            <thead>
                                <tr>
                                    <SortTh id="geo" sort={endpointTable.sort} onSort={endpointTable.onSort} className="w-[30%]">
                                        Geo
                                    </SortTh>
                                    <SortTh id="endpoint" sort={endpointTable.sort} onSort={endpointTable.onSort}>
                                        Endpoint
                                    </SortTh>
                                </tr>
                            </thead>
                            <tbody>
                                {endpointTable.rows.map((g: EndpointGeo, i) => (
                                    <tr key={g} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                        <td className={cx(TABLE.list.td, "py-2.5")}>{g}</td>
                                        <td className={cx(TABLE.list.td, "py-2.5")}>
                                            <Input
                                                aria-label={`${g} endpoint`}
                                                value={endpoints[g]}
                                                onChange={(v) => setEndpoints((e) => ({ ...e, [g]: v }))}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className={h2}>Additional Configuration Data</h2>
                    <div className={TABLE.bleed}>
                        <table className={TABLE.table}>
                            <thead>
                                <tr>
                                    <SortTh id="field" sort={fieldTable.sort} onSort={fieldTable.onSort} className="w-[30%]">
                                        Field
                                    </SortTh>
                                    <SortTh id="value" sort={fieldTable.sort} onSort={fieldTable.onSort}>
                                        Value
                                    </SortTh>
                                </tr>
                            </thead>
                            <tbody>
                                {fieldTable.rows.map((f, i) => (
                                    <tr key={f} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                        <td className={cx(TABLE.list.td, "py-2.5")}>{f}</td>
                                        <td className={cx(TABLE.list.td, "py-2.5")}>
                                            <Input aria-label={f} value={fields[f]} onChange={(v) => setFields((cur) => ({ ...cur, [f]: v }))} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className={h2}>Whitelisted Geos</h2>
                    <WhitelistedGeos value={geos} onChange={setGeos} />
                </section>
            </div>
        </>
    );
};

/* ------------------------------------------------------- Whitelisted geos --- */

const ALL_COUNTRIES = REGIONS.flatMap((r) => r.countries);

/**
 * Region / Country: a checkbox per region (all its countries), the arrow opens the region's
 * countries in the Country column. Select All picks every country; Clear Filter empties it.
 */
const WhitelistedGeos = ({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) => {
    const [open, setOpen] = useState<string[]>([]);
    const [countryDir, setCountryDir] = useState<1 | -1 | null>(null);
    const table = useTableSort(REGIONS, (r, id) => (id === "country" ? r.countries.filter((c) => value.includes(c)).length || undefined : r.id));
    const onSort = (id: string) => {
        table.onSort(id);
        if (id === "country") setCountryDir((d) => (d === null ? 1 : d === 1 ? -1 : null));
    };
    const has = (c: string) => value.includes(c);
    const setMany = (countries: string[], on: boolean) => onChange(on ? [...new Set([...value, ...countries])] : value.filter((c) => !countries.includes(c)));
    const allOn = ALL_COUNTRIES.every(has);
    const someOn = value.length > 0;
    const ordered = (list: string[]) => (countryDir ? [...list].sort((a, b) => a.localeCompare(b) * countryDir) : list);

    return (
        <TealControls className={TABLE.bleed}>
            <table className={TABLE.table}>
                <thead>
                    <tr>
                        <SortTh id="region" sort={table.sort} onSort={onSort} className="w-[36%]">
                            Region
                        </SortTh>
                        <SortTh id="country" sort={table.sort} onSort={onSort}>
                            Country
                        </SortTh>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={cx(TABLE.list.td, "py-3")}>
                            <div className="flex items-center gap-8">
                                <Checkbox
                                    size="md"
                                    label={<span className={LABEL}>Select All</span>}
                                    isSelected={allOn}
                                    isIndeterminate={someOn && !allOn}
                                    onChange={(on) => onChange(on ? ALL_COUNTRIES : [])}
                                />
                                <button
                                    type="button"
                                    onClick={() => onChange([])}
                                    disabled={!someOn}
                                    className="text-md font-semibold underline disabled:opacity-50"
                                    style={{ color: PINK }}
                                >
                                    Clear Filter
                                </button>
                            </div>
                        </td>
                        <td className={cx(TABLE.list.td, "py-3")} />
                    </tr>
                    {table.rows.map((r, i) => {
                        const on = r.countries.filter(has);
                        const expanded = open.includes(r.id);
                        const Chevron = expanded ? ChevronDown : ChevronRight;
                        return (
                            <tr key={r.id} className={cx("align-top", i % 2 === 0 && TABLE.list.stripe)}>
                                <td className={cx(TABLE.list.td, "py-3")}>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            size="md"
                                            label={<span className="text-md font-semibold text-primary uppercase">{r.id}</span>}
                                            isSelected={on.length === r.countries.length}
                                            isIndeterminate={on.length > 0 && on.length < r.countries.length}
                                            onChange={(sel) => setMany(r.countries, sel)}
                                        />
                                        <button
                                            type="button"
                                            aria-expanded={expanded}
                                            aria-label={`${expanded ? "Hide" : "Show"} ${r.id} countries`}
                                            onClick={() => setOpen((cur) => (expanded ? cur.filter((x) => x !== r.id) : [...cur, r.id]))}
                                            className="rounded p-1 hover:bg-secondary"
                                        >
                                            <Chevron className="size-5" style={{ color: TEAL }} aria-hidden="true" />
                                        </button>
                                    </div>
                                </td>
                                <td className={cx(TABLE.list.td, "py-3")}>
                                    {expanded && (
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3">
                                            {ordered(r.countries).map((c) => (
                                                <Checkbox
                                                    key={c}
                                                    size="md"
                                                    label={<span className="text-md text-primary">{c}</span>}
                                                    isSelected={has(c)}
                                                    onChange={(sel) => setMany([c], sel)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TealControls>
    );
};
