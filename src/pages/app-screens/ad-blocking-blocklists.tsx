import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { ChevronDown, ChevronSelectorVertical, Download01, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";

/**
 * AdOps → Ad Blocking — detailed block-list variant.
 *
 * A second, more granular version of the Ad Blocking dashboard that surfaces the
 * four OpenRTB block lists (bcat / badv / badv-domains / bapp) as stacked
 * sections. Each section pairs a titled header (with a "Download .CSV" action), a
 * short description, a search / block input row, and a data table with an
 * "Unblock all" pill in the header, per-row "✕ Unblock" actions, and a centered
 * "Load all" pill. Sortable columns show a teal up/down chevron.
 *
 * NOTE: this is a NEW screen and intentionally does not replace the existing
 * `ad-blocking.tsx` variant — both live side by side in the library.
 */

/* ------------------------------------------------------------------- Types --- */

interface BlockColumn {
    id: string;
    /** Header label text (also used as the count label for the first column). */
    label?: string;
    /** Custom header content (e.g. the "Unblock all" pill). */
    header?: ReactNode;
    isRowHeader?: boolean;
    /** Whether the column shows the teal sort chevron. */
    sortable?: boolean;
    align?: "left" | "right";
}

interface BlockRow {
    id: string;
    [key: string]: ReactNode;
}

interface BlockListSectionProps {
    title: string;
    code: string;
    description: ReactNode;
    /** Search / domain input placeholder. */
    inputPlaceholder: string;
    /** Whether the input shows a leading magnifier icon. */
    inputIcon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    /** Action buttons shown to the right of the input. */
    actions: ReactNode;
    columns: BlockColumn[];
    rows: BlockRow[];
}

/* --------------------------------------------------------------- Sub-parts --- */

/** Small pink text "unblock" action used per-row. */
const UnblockButton = () => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#C33F79] uppercase transition duration-100 ease-linear hover:text-[#c01574]"
    >
        <XClose className="size-4" aria-hidden="true" />
        Unblock
    </button>
);

/** Pink pill used for the header-level "Unblock all" action. */
const UnblockAllPill = () => (
    <button
        type="button"
        className="inline-flex items-center rounded-full bg-[#DA6EA3] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition duration-100 ease-linear hover:bg-[#C33F79]"
    >
        Unblock all
    </button>
);

/** Header label with the teal sort chevron. */
const SortLabel = ({ label }: { label: string }) => (
    <span className="flex items-center gap-1.5">
        <span className="text-sm font-semibold whitespace-nowrap text-secondary">{label}</span>
        <ChevronSelectorVertical className="size-3.5 text-[#37B6B7]" strokeWidth={3} aria-hidden="true" />
    </span>
);

const BlockListSection = ({ title, code, description, inputPlaceholder, inputIcon, actions, columns, rows }: BlockListSectionProps) => (
    <section className="flex flex-col gap-5">
        {/* Header: title + code + download */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold text-primary">
                    {title} <span className="font-normal text-tertiary">({code})</span>
                </h2>
                <p className="max-w-3xl text-sm text-tertiary">{description}</p>
            </div>
            <Button size="sm" color="primary-pink" iconLeading={Download01} className="shrink-0 uppercase">
                Download .CSV
            </Button>
        </div>

        {/* Input + actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input size="md" icon={inputIcon} placeholder={inputPlaceholder} wrapperClassName="flex-1" aria-label={inputPlaceholder} />
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>

        {/* Table */}
        <TableCard.Root>
            <Table aria-label={`${title} (${code})`} selectionMode="none">
                <Table.Header>
                    {columns.map((col) => (
                        <Table.Head
                            key={col.id}
                            id={col.id}
                            isRowHeader={col.isRowHeader}
                            className={col.align === "right" ? "text-right" : undefined}
                        >
                            {col.header ?? (col.sortable ? <SortLabel label={col.label ?? ""} /> : (
                                <span className="text-sm font-semibold text-secondary">{col.label}</span>
                            ))}
                        </Table.Head>
                    ))}
                </Table.Header>
                <Table.Body items={rows}>
                    {(row) => (
                        <Table.Row id={row.id} columns={columns}>
                            {(col: BlockColumn) => (
                                <Table.Cell className={col.align === "right" ? "text-right" : undefined}>
                                    <span className="text-sm text-tertiary">{row[col.id]}</span>
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>

        {/* Load all pill */}
        <div className="flex justify-center">
            <button
                type="button"
                className="inline-flex items-center rounded-full bg-quaternary px-5 py-1.5 text-xs font-semibold tracking-wide text-secondary uppercase transition duration-100 ease-linear hover:bg-tertiary"
            >
                Load all
            </button>
        </div>
    </section>
);

/* -------------------------------------------------------------- Sample data --- */

const blockedBy = ["Vanessa Eng", "Kristen Smith", "Marc Santiago"];

const unblockAllHeader = <UnblockAllPill />;

const categoryRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `cat-${i}`,
    creative: "781212351",
    blockedBy: name,
    blockedOn: ["Core", "Nimbus+", "Core, Nimbus+"][i],
    blockedDate: "01-06-2019",
    unblockDate: "02-06-2019",
    action: <UnblockButton />,
}));

const advertiserAppRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `adv-app-${i}`,
    app: "com.foo.mygame",
    blockedBy: name,
    blockedDate: "01-06-2019",
    action: <UnblockButton />,
}));

const advertiserDomainRows: BlockRow[] = ["2", "1", "3"].map((count, i) => ({
    id: `adv-dom-${i}`,
    domain: "Full Screen",
    blockedBy: count,
    blockDate: "01-06-2019",
    action: <UnblockButton />,
}));

const applicationRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `app-${i}`,
    bundle: "com.foo.mygame",
    blockedBy: name,
    blockedDate: "01-06-2019",
    action: <UnblockButton />,
}));

/* --------------------------------------------------------------- The screen --- */

export const AdBlockingBlocklistsScreen = () => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="manage active demand" />

            <main className="flex-1 overflow-x-hidden">
                {/* App header */}
                <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-5">
                    <h1 className="text-display-xs font-semibold text-primary">Your App</h1>
                    <button
                        type="button"
                        aria-label="App options"
                        className="inline-flex size-9 items-center justify-center rounded-full text-[#DA6EA3] transition duration-100 ease-linear hover:bg-[#fdf2f7]"
                    >
                        <ChevronDown className="size-5" aria-hidden="true" />
                    </button>
                </header>

                <div className="flex flex-col gap-12 px-8 py-8">
                    {/* 1 — Blocked Categories (bcat) */}
                    <BlockListSection
                        title="Blocked Categories"
                        code="bcat"
                        description="Blocked creatives from specific advertising campaigns. Creative IDs rotate frequently and are recycled across the programmatic landscape. Therefore, Nimbus only blocks Creative IDs for the current quarter. When the quarter ends, blocks are automatically removed by our system."
                        inputPlaceholder="Search the IAB Category List"
                        actions={
                            <>
                                <Button size="md" color="primary-pink" className="uppercase">Block core</Button>
                                <Button size="md" color="primary-pink" className="uppercase">Block N+</Button>
                                <Button size="md" color="primary-pink" className="uppercase">Block both</Button>
                            </>
                        }
                        columns={[
                            { id: "creative", label: "25 blocked creatives", isRowHeader: true, sortable: true },
                            { id: "blockedBy", label: "Blocked By", sortable: true },
                            { id: "blockedOn", label: "Blocked On", sortable: true },
                            { id: "blockedDate", label: "Blocked Date", sortable: true },
                            { id: "unblockDate", label: "Unblock Date", sortable: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={categoryRows}
                    />

                    {/* 2 — Blocked Advertisers (badv) — IAB categories */}
                    <BlockListSection
                        title="Blocked Advertisers"
                        code="badv"
                        description={
                            <>
                                Blocked advertiser categories using the IAB content categories.{" "}
                                <a href="#" className="font-semibold text-[#37B6B7] transition duration-100 ease-linear hover:text-[#2c9192]">
                                    See the list here
                                </a>
                            </>
                        }
                        inputPlaceholder="Enter one or more domains (CSV supported)"
                        inputIcon={SearchLg}
                        actions={<Button size="md" color="primary-pink" className="uppercase">Block</Button>}
                        columns={[
                            { id: "app", label: "33 blocked apps", isRowHeader: true, sortable: true },
                            { id: "blockedBy", label: "Blocked By", sortable: true },
                            { id: "blockedDate", label: "Blocked Date", sortable: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={advertiserAppRows}
                    />

                    {/* 3 — Blocked Advertisers (badv) — domains */}
                    <BlockListSection
                        title="Blocked Advertisers"
                        code="badv"
                        description={'Block list of advertisers by their domains (e.g., "ford.com").'}
                        inputPlaceholder="Enter one more domains (CSV supported)"
                        actions={<Button size="md" color="primary-pink" className="uppercase">Block</Button>}
                        columns={[
                            { id: "domain", label: "17 blocked domains", isRowHeader: true, sortable: true },
                            { id: "blockedBy", label: "Blocked By", sortable: true },
                            { id: "blockDate", label: "Block Date", sortable: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={advertiserDomainRows}
                    />

                    {/* 4 — Blocked Applications (bapp) */}
                    <BlockListSection
                        title="Blocked Applications"
                        code="bapp"
                        description="Block list of applications by their platform-specific exchange independent application identifiers. On Android, these should be bundle or package names (e.g., com.foo.mygame). On IOS, these are numeric IDs."
                        inputPlaceholder="com.foo.mygame"
                        actions={<Button size="md" color="primary-pink" className="uppercase">Block</Button>}
                        columns={[
                            { id: "bundle", label: "33 blocked apps", isRowHeader: true, sortable: true },
                            { id: "blockedBy", label: "Blocked By", sortable: true },
                            { id: "blockedDate", label: "Blocked Date", sortable: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={applicationRows}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdBlockingBlocklistsScreen;

/** Existing App Screens section presets for the 102326 table inventory. */
export const DetailedBlocklistTableExamples = () => (
    <div className="flex flex-col gap-10">
        <BlockListSection
            title="Blocked Categories"
            code="bcat"
            description="Blocked creatives from specific advertising campaigns. Creative IDs rotate frequently and are recycled across the programmatic landscape. Therefore, Nimbus only blocks Creative IDs for the current quarter. When the quarter ends, blocks are automatically removed by our system."
            inputPlaceholder="Search the IAB Category List"
            actions={
                <>
                    <Button size="md" color="primary-pink" className="uppercase">
                        Block core
                    </Button>
                    <Button size="md" color="primary-pink" className="uppercase">
                        Block N+
                    </Button>
                    <Button size="md" color="primary-pink" className="uppercase">
                        Block both
                    </Button>
                </>
            }
            columns={[
                { id: "creative", label: "25 blocked creatives", isRowHeader: true, sortable: true },
                { id: "blockedBy", label: "Blocked By", sortable: true },
                { id: "blockedOn", label: "Blocked On", sortable: true },
                { id: "blockedDate", label: "Blocked Date", sortable: true },
                { id: "unblockDate", label: "Unblock Date", sortable: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={categoryRows}
        />
        <BlockListSection
            title="Blocked Advertisers"
            code="badv"
            description={
                <>
                    Blocked advertiser categories using the IAB content categories.{" "}
                    <a href="#" className="font-semibold text-[#37B6B7] transition duration-100 ease-linear hover:text-[#2c9192]">
                        See the list here
                    </a>
                </>
            }
            inputPlaceholder="Enter one or more domains (CSV supported)"
            inputIcon={SearchLg}
            actions={
                <Button size="md" color="primary-pink" className="uppercase">
                    Block
                </Button>
            }
            columns={[
                { id: "app", label: "33 blocked apps", isRowHeader: true, sortable: true },
                { id: "blockedBy", label: "Blocked By", sortable: true },
                { id: "blockedDate", label: "Blocked Date", sortable: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={advertiserAppRows}
        />
        <BlockListSection
            title="Blocked Advertisers"
            code="badv"
            description={'Block list of advertisers by their domains (e.g., "ford.com").'}
            inputPlaceholder="Enter one more domains (CSV supported)"
            actions={
                <Button size="md" color="primary-pink" className="uppercase">
                    Block
                </Button>
            }
            columns={[
                { id: "domain", label: "17 blocked domains", isRowHeader: true, sortable: true },
                { id: "blockedBy", label: "Blocked By", sortable: true },
                { id: "blockDate", label: "Block Date", sortable: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={advertiserDomainRows}
        />
        <BlockListSection
            title="Blocked Applications"
            code="bapp"
            description="Block list of applications by their platform-specific exchange independent application identifiers. On Android, these should be bundle or package names (e.g., com.foo.mygame). On IOS, these are numeric IDs."
            inputPlaceholder="com.foo.mygame"
            actions={
                <Button size="md" color="primary-pink" className="uppercase">
                    Block
                </Button>
            }
            columns={[
                { id: "bundle", label: "33 blocked apps", isRowHeader: true, sortable: true },
                { id: "blockedBy", label: "Blocked By", sortable: true },
                { id: "blockedDate", label: "Blocked Date", sortable: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={applicationRows}
        />
    </div>
);
