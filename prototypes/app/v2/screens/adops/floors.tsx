import { useRef, useState } from "react";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import androidIcon from "../../assets/android-icon.svg";
import iosIcon from "../../assets/ios-icon.svg";
import { StatChip } from "../campaign-ui";
import { DasShell, Field, PINK, PinkAction, Section } from "../das-shell";
import { ROUTES } from "../nav";
import { PageTabs, SortTh, StateAction, TABLE, TEAL_DARK } from "../nimbus-ui";
import { StatLookContext } from "../stat-look";
import { useTableSort } from "../table-sort";
import {
    AD_IDS,
    COUNTRIES,
    type CustomFloor,
    DEFAULT_FLOOR_KEYS,
    type DefaultFloorKey,
    EMPTY_DEFAULT_FLOORS,
    type FloorAdType,
    type FloorPlatform,
    SAMPLE_CUSTOM_FLOORS,
    SAMPLE_DEFAULT_FLOORS,
    SIZES,
    floorPrice,
} from "./adops-data";

/**
 * AdOps → floors (reference/111326, 9.13.27 PM; Configure Floors from the 13 Nov call).
 *
 * Two pages linked by staging's tabs:
 *   Active Floors     the four default floors as flat summary tiles (NOT SET when there
 *                     is none), then every custom floor in a sortable list.
 *   Configure Floors  Default Floors — a price per platform × ad type, with CHANGE and
 *                     REMOVE — and a New Custom Floor form (ADD FLOOR adds a row).
 */

const TABS = [
    { id: "active", label: "Active Floors", href: ROUTES.floors },
    { id: "configure", label: "Configure Floors", href: ROUTES.floorsConfigure },
];

const ICON: Record<FloorPlatform, string> = { Android: androidIcon, iOS: iosIcon };
const platformOf = (k: DefaultFloorKey) => k.split(":")[0] as FloorPlatform;

/** "$1.25", "1.25" → 1.25; anything else → undefined. */
const parsePrice = (s: string) => {
    const n = Number(s.replace(/[$,\s]/g, ""));
    return s.trim() && Number.isFinite(n) && n >= 0 ? n : undefined;
};

const CustomFloorsTable = ({ rows, onRemove }: { rows: CustomFloor[]; onRemove?: (id: string) => void }) => {
    const table = useTableSort(rows, (r, id) => r[id as keyof CustomFloor]);
    const cols: { id: keyof CustomFloor; label: string; right?: boolean }[] = [
        { id: "country", label: "Country" },
        { id: "platform", label: "Platform" },
        { id: "adType", label: "Ad Type" },
        { id: "adId", label: "Ad ID" },
        { id: "size", label: "Size" },
        { id: "price", label: "Floor Price", right: true },
    ];
    return (
        <div className={TABLE.bleed}>
            <table className={TABLE.table}>
                <thead>
                    <tr>
                        {cols.map((c) => (
                            <SortTh key={c.id} id={c.id} align={c.right ? "right" : "left"} sort={table.sort} onSort={table.onSort}>
                                {c.label}
                            </SortTh>
                        ))}
                        {onRemove && (
                            <th scope="col" className={cx(TABLE.list.th, "w-32")}>
                                <span className="sr-only">Actions</span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((r, i) => (
                        <tr key={r.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                            <td className={cx(TABLE.list.td, "text-primary")}>{r.country}</td>
                            <td className={TABLE.list.td}>
                                <span className="inline-flex items-center gap-2">
                                    <img src={ICON[r.platform]} alt="" className="h-5 w-auto" />
                                    {r.platform}
                                </span>
                            </td>
                            <td className={TABLE.list.td}>{r.adType}</td>
                            <td className={cx(TABLE.list.td, "font-mono")}>{r.adId}</td>
                            <td className={TABLE.list.td}>{r.size}</td>
                            <td className={cx(TABLE.list.td, "text-right font-semibold text-primary tabular-nums")}>{floorPrice(r.price)}</td>
                            {onRemove && (
                                <td className={cx(TABLE.list.td, "text-right")}>
                                    <PinkAction onPress={() => onRemove(r.id)}>Remove</PinkAction>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* -------------------------------------------------------- Active Floors --- */

export const ActiveFloors = ({ empty }: { empty?: boolean }) => {
    const defaults = empty ? EMPTY_DEFAULT_FLOORS : SAMPLE_DEFAULT_FLOORS;
    const custom = empty ? [] : SAMPLE_CUSTOM_FLOORS;
    return (
        <DasShell navKey="floors">
            <PageTabs tabs={TABS} active="active" />
            <div className="flex flex-col gap-10 px-8 py-8">
                <StatLookContext.Provider value="flat">
                    <div className="flex flex-wrap gap-x-10 gap-y-4">
                        {DEFAULT_FLOOR_KEYS.map((k) => (
                            <StatChip key={k} label={k}>
                                {floorPrice(defaults[k])}
                            </StatChip>
                        ))}
                    </div>
                </StatLookContext.Provider>

                <Section
                    title="Custom Floors"
                    description="Below is a list of all of your custom-set floors. Unspecified combinations will respect the default floor for the creative type listed above."
                >
                    {custom.length ? (
                        <CustomFloorsTable rows={custom} />
                    ) : (
                        <p className="text-md text-tertiary">
                            No custom floors yet.{" "}
                            <a href={ROUTES.floorsConfigure} className="font-bold hover:underline" style={{ color: PINK }}>
                                Add custom floors
                            </a>{" "}
                            to see them listed here.
                        </p>
                    )}
                </Section>
            </div>
        </DasShell>
    );
};

/* ----------------------------------------------------- Configure Floors --- */

const DefaultFloorTile = ({ k, value, onSet }: { k: DefaultFloorKey; value: number | undefined; onSet: (v: number | undefined) => void }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const price = parsePrice(draft);
    const showField = editing || value === undefined;
    const save = () => {
        if (price === undefined) return;
        onSet(price);
        setDraft("");
        setEditing(false);
    };
    return (
        <div className="flex min-w-0 flex-col gap-3 border-l border-secondary py-1 pl-5">
            <span className="inline-flex items-center gap-2 text-md font-bold tracking-wide text-tertiary uppercase">
                <img src={ICON[platformOf(k)]} alt="" className="h-5 w-auto" />
                {k}
            </span>
            <span className="text-display-xs font-extrabold" style={{ color: TEAL_DARK }}>
                {floorPrice(value)}
            </span>
            {showField ? (
                <div className="flex flex-wrap items-center gap-3">
                    <Input aria-label={`${k} floor price`} size="md" placeholder="$0.00" value={draft} onChange={setDraft} wrapperClassName="w-32" />
                    <StateAction disabled={price === undefined} onPress={save}>
                        {value === undefined ? "Set" : "Save"}
                    </StateAction>
                    {editing && (
                        <PinkAction
                            onPress={() => {
                                setDraft("");
                                setEditing(false);
                            }}
                        >
                            Cancel
                        </PinkAction>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-5">
                    <PinkAction
                        onPress={() => {
                            setDraft(value.toFixed(2));
                            setEditing(true);
                        }}
                    >
                        Change
                    </PinkAction>
                    <PinkAction onPress={() => onSet(undefined)}>Remove</PinkAction>
                </div>
            )}
        </div>
    );
};

const options = (list: readonly string[]) => list.map((v) => ({ id: v, label: v }));

const Pick = ({ label, list, value, onChange }: { label: string; list: readonly string[]; value?: string; onChange: (v: string | undefined) => void }) => (
    <Field label={label}>
        <Select
            aria-label={label}
            placeholder="Select"
            items={options(list)}
            selectedKey={value ?? null}
            onSelectionChange={(k) => onChange(k ? String(k) : undefined)}
        >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    </Field>
);

export const ConfigureFloors = () => {
    const [defaults, setDefaults] = useState(SAMPLE_DEFAULT_FLOORS);
    const [custom, setCustom] = useState<CustomFloor[]>(SAMPLE_CUSTOM_FLOORS);
    const [country, setCountry] = useState<string>();
    const [platform, setPlatform] = useState<string>();
    const [adType, setAdType] = useState<string>();
    const [adId, setAdId] = useState<string>();
    const [size, setSize] = useState<string>();
    const [price, setPrice] = useState("");
    const next = useRef(0);
    const amount = parsePrice(price);
    const ready = country && platform && adType && adId && size && amount !== undefined;

    const addFloor = () => {
        if (!ready) return;
        setCustom((cur) => [
            { id: `new-${next.current++}`, country, platform: platform as FloorPlatform, adType: adType as FloorAdType, adId, size, price: amount },
            ...cur,
        ]);
        setCountry(undefined);
        setPlatform(undefined);
        setAdType(undefined);
        setAdId(undefined);
        setSize(undefined);
        setPrice("");
    };

    return (
        <DasShell navKey="floors">
            <PageTabs tabs={TABS} active="configure" />
            <div className="px-8 py-8">
                <Section title="Default Floors">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
                        {DEFAULT_FLOOR_KEYS.map((k) => (
                            <DefaultFloorTile key={k} k={k} value={defaults[k]} onSet={(v) => setDefaults((cur) => ({ ...cur, [k]: v }))} />
                        ))}
                    </div>
                </Section>

                <Section title="New Custom Floor">
                    <div className="grid grid-cols-1 items-end gap-x-6 gap-y-5 md:grid-cols-3 2xl:grid-cols-6">
                        <Pick label="Country" list={COUNTRIES} value={country} onChange={setCountry} />
                        <Pick label="Platform" list={["Android", "iOS"]} value={platform} onChange={setPlatform} />
                        <Pick label="Ad Type" list={["Static", "Video"]} value={adType} onChange={setAdType} />
                        <Pick label="Ad ID" list={AD_IDS} value={adId} onChange={setAdId} />
                        <Pick label="Size" list={SIZES} value={size} onChange={setSize} />
                        <Field label="Floor Price">
                            <Input aria-label="Floor Price" size="md" placeholder="$0.00" value={price} onChange={setPrice} />
                        </Field>
                    </div>
                    <div>
                        <StateAction disabled={!ready} onPress={addFloor}>
                            Add Floor
                        </StateAction>
                    </div>
                </Section>

                <Section title="Custom Floors">
                    {custom.length ? (
                        <CustomFloorsTable rows={custom} onRemove={(id) => setCustom((cur) => cur.filter((r) => r.id !== id))} />
                    ) : (
                        <p className="text-md text-tertiary">No custom floors yet.</p>
                    )}
                </Section>
            </div>
        </DasShell>
    );
};
