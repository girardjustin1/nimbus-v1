import { type ReactNode, useRef, useState } from "react";
import { XClose } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import blockingHero from "../../assets/blocking-hero.png";
import { downloadCsv } from "../batch-data";
import { DasShell, PinkAction, Section } from "../das-shell";
import { SortTh, StateAction, TABLE } from "../nimbus-ui";
import { SingleSearchSelect } from "../search-select";
import { useTableSort } from "../table-sort";
import { HEADLINE } from "../type-rules";
import {
    BLOCK_KINDS,
    BLOCK_SECTIONS,
    type BlockEntry,
    type BlockKind,
    type BlockedOn,
    EMPTY_BLOCKS,
    IAB_CATEGORIES,
    ME,
    QUARTER_END,
    SAMPLE_BLOCKS,
    TODAY,
    dateKey,
} from "./adops-data";
import { DocLink } from "./adops-ui";

/**
 * AdOps → ad blocking (reference/111326, 9.13.16 and 9.13.22 PM).
 *
 * Staging's page as it stands: the "Block Bad Ads" hero (✕ HIDE closes it for the visit),
 * then one stacked section per OpenRTB block list — crid, bcat, badv, bapp — each with
 * its description and documentation link, an input, BLOCK CORE / BLOCK N+ / BLOCK BOTH,
 * DOWNLOAD .CSV and a sortable list of what is blocked. Blocking adds rows (badv and
 * bapp take comma-separated lists); UNBLOCK removes them.
 */

const DESCRIPTIONS: Record<BlockKind, ReactNode> = {
    crid: (
        <>
            Blocked creatives from specific advertising campaigns. Creative IDs rotate frequently and are recycled across the programmatic landscape. Therefore,{" "}
            <strong className="font-bold text-secondary">Nimbus only blocks Creative IDs for the current quarter</strong>. When the quarter ends, blocks are
            automatically removed by our system. <DocLink>Read full blocking documentation here.</DocLink>
        </>
    ),
    bcat: (
        <>
            Blocked advertiser categories using the IAB content categories. <DocLink>See the list here.</DocLink> Note: If every child category is selected, the
            top-level parent category will also be restricted. <DocLink>Read full blocking documentation here.</DocLink>
        </>
    ),
    badv: (
        <>
            Block list of advertisers by their domains (e.g., “example.com”). <DocLink>Read full blocking documentation here.</DocLink>
        </>
    ),
    bapp: (
        <>
            Block list of applications by their platform-specific exchange independent application identifiers. On Android, these should be bundle or package
            names (e.g., com.foo.mygame). On iOS, these are numeric IDs. <DocLink>Read full blocking documentation here.</DocLink>
        </>
    ),
};

const Hero = ({ onHide }: { onHide: () => void }) => (
    <section className="relative border-b border-secondary px-8 py-12">
        <button
            type="button"
            onClick={onHide}
            className="absolute top-5 right-8 inline-flex items-center gap-1 text-md font-bold text-tertiary uppercase transition duration-100 ease-linear hover:text-primary"
        >
            <XClose className="size-4" aria-hidden="true" /> Hide
        </button>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <div className="flex max-w-xl flex-col gap-4">
                <h2 className={cx("text-display-xs text-primary", HEADLINE)}>Block Bad Ads</h2>
                <p className="text-md text-tertiary">
                    Protect your brand and the quality of your app’s core user experience by blocking inappropriate and unwanted ads. Nimbus helps to ensure
                    that monetizing your app has as little impact on user perception as possible.
                </p>
                <p className="text-md text-tertiary">
                    Ideally, the ads served in your app are relevant, unobstructive, and seamlessly integrate into the designed UI. Nimbus gives you the access
                    you need to control the ads appearing in your app.
                </p>
            </div>
            <img src={blockingHero} alt="" className="h-[190px] w-[300px]" />
        </div>
    </section>
);

const ON_FOR: Record<"core" | "nplus" | "both", BlockedOn> = { core: "Core", nplus: "N+", both: "Core & N+" };

const BlockSection = ({
    kind,
    rows,
    onAdd,
    onRemove,
}: {
    kind: BlockKind;
    rows: BlockEntry[];
    onAdd: (values: string[], on: BlockedOn) => void;
    onRemove: (id: string) => void;
}) => {
    const meta = BLOCK_SECTIONS[kind];
    const [text, setText] = useState("");
    const [category, setCategory] = useState<string>();
    const crid = kind === "crid";

    const pending =
        kind === "bcat"
            ? category
                ? [category]
                : []
            : meta.csv
              ? text
                    .split(/[,\s]+/)
                    .map((v) => v.trim())
                    .filter(Boolean)
              : text.trim()
                ? [text.trim()]
                : [];
    const block = (which: keyof typeof ON_FOR) => {
        onAdd(pending, ON_FOR[which]);
        setText("");
        setCategory(undefined);
    };

    const table = useTableSort(rows, (r, id) => {
        if (id === "date") return dateKey(r.date);
        if (id === "unblock") return r.unblock ? dateKey(r.unblock) : undefined;
        return r[id as "value" | "by" | "on"];
    });

    const exportCsv = () =>
        downloadCsv(
            meta.file,
            [meta.noun, "Blocked By", "Blocked On", "Block Date", ...(crid ? ["Unblock Date"] : [])],
            table.rows.map((r) => [r.value, r.by, r.on, r.date, ...(crid ? [r.unblock ?? ""] : [])]),
        );

    const blocked = new Set(rows.map((r) => r.value));

    return (
        <Section
            title={meta.title}
            description={DESCRIPTIONS[kind]}
            trailing={
                <StateAction onPress={exportCsv} disabled={rows.length === 0}>
                    Download .CSV
                </StateAction>
            }
        >
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                <div className="min-w-80 flex-1">
                    {kind === "bcat" ? (
                        <SingleSearchSelect
                            label="IAB category"
                            noun="categories"
                            placeholder={meta.placeholder}
                            rows={IAB_CATEGORIES.map((c) => ({ id: c, label: c, disabledReason: blocked.has(c) ? "Already blocked" : undefined }))}
                            value={category}
                            onChange={setCategory}
                        />
                    ) : (
                        <Input aria-label={meta.placeholder} size="md" placeholder={meta.placeholder} value={text} onChange={setText} />
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <StateAction disabled={!pending.length} onPress={() => block("core")}>
                        Block Core
                    </StateAction>
                    <StateAction disabled={!pending.length} onPress={() => block("nplus")}>
                        Block N+
                    </StateAction>
                    <StateAction disabled={!pending.length} onPress={() => block("both")}>
                        Block Both
                    </StateAction>
                </div>
            </div>

            <div className={TABLE.bleed}>
                <table className={TABLE.table}>
                    <thead>
                        <tr>
                            <SortTh id="value" sort={table.sort} onSort={table.onSort} className="w-1/4">
                                {rows.length} {meta.noun}
                            </SortTh>
                            <SortTh id="by" sort={table.sort} onSort={table.onSort}>
                                Blocked By
                            </SortTh>
                            <SortTh id="on" sort={table.sort} onSort={table.onSort}>
                                Blocked On
                            </SortTh>
                            <SortTh id="date" sort={table.sort} onSort={table.onSort}>
                                Block Date
                            </SortTh>
                            {crid && (
                                <SortTh id="unblock" sort={table.sort} onSort={table.onSort}>
                                    Unblock Date
                                </SortTh>
                            )}
                            <th scope="col" className={cx(TABLE.list.th, "w-32")}>
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((r, i) => (
                            <tr key={r.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                <td className={cx(TABLE.list.td, "text-primary", kind === "bcat" ? "font-semibold" : "font-mono font-medium")}>{r.value}</td>
                                <td className={TABLE.list.td}>{r.by}</td>
                                <td className={TABLE.list.td}>{r.on}</td>
                                <td className={cx(TABLE.list.td, "whitespace-nowrap")}>{r.date}</td>
                                {crid && <td className={cx(TABLE.list.td, "whitespace-nowrap")}>{r.unblock}</td>}
                                <td className={cx(TABLE.list.td, "text-right")}>
                                    <PinkAction onPress={() => onRemove(r.id)}>Unblock</PinkAction>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
};

export const AdBlocking = ({ empty }: { empty?: boolean }) => {
    const [hero, setHero] = useState(true);
    const [blocks, setBlocks] = useState(empty ? EMPTY_BLOCKS : SAMPLE_BLOCKS);
    const next = useRef(0);

    const add = (kind: BlockKind) => (values: string[], on: BlockedOn) =>
        setBlocks((cur) => {
            const have = new Set(cur[kind].map((r) => r.value));
            const fresh = [...new Set(values)]
                .filter((v) => !have.has(v))
                .map((value) => ({ id: `new-${kind}-${next.current++}`, value, by: ME, on, date: TODAY, unblock: kind === "crid" ? QUARTER_END : undefined }));
            return { ...cur, [kind]: [...fresh, ...cur[kind]] };
        });
    const remove = (kind: BlockKind) => (id: string) => setBlocks((cur) => ({ ...cur, [kind]: cur[kind].filter((r) => r.id !== id) }));

    return (
        <DasShell navKey="ad blocking">
            {hero && <Hero onHide={() => setHero(false)} />}
            <div className="px-8 py-10">
                {BLOCK_KINDS.map((kind) => (
                    <BlockSection key={kind} kind={kind} rows={blocks[kind]} onAdd={add(kind)} onRemove={remove(kind)} />
                ))}
            </div>
        </DasShell>
    );
};
