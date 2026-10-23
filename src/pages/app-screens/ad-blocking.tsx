import { useMemo, useState, type ReactNode } from "react";
import { Download01, SearchLg, XClose } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";

/**
 * Screen-01 — AdOps → Ad Blocking dashboard.
 *
 * Rebuilds the reference screen (reference/Screen-01.png) with the Nimbus Global
 * Nav + Untitled UI Table/Input/Button components. The block-list section is
 * factored into a reusable, data-driven component so every list on the page —
 * and future screens — share one implementation.
 */

interface BlockColumn {
    id: string;
    /** Header text. Omit when using `header` for custom node content. */
    label?: string;
    /** Custom header content (e.g. the "Unblock all" pill). */
    header?: ReactNode;
    isRowHeader?: boolean;
    allowsSorting?: boolean;
    align?: "left" | "right";
}

interface BlockRow {
    id: string;
    [key: string]: ReactNode;
}

interface BlockListSectionProps {
    title: string;
    badge: string;
    description: ReactNode;
    searchPlaceholder: string;
    /** Action pills shown to the right of the search field. */
    searchActions: ReactNode;
    columns: BlockColumn[];
    rows: BlockRow[];
}

/** Small pink text "unblock" action used per-row. */
const UnblockButton = () => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#DA6EA3] uppercase transition-colors duration-100 hover:text-[#c85c92]"
    >
        <XClose className="size-4" aria-hidden="true" />
        Unblock
    </button>
);

/** Pink pill used for header-level actions like "Unblock all". */
const PinkPill = ({ children }: { children: ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-[#DA6EA3] px-3 py-1 text-xs font-semibold text-white uppercase">{children}</span>
);

const BlockListSection = ({ title, badge, description, searchPlaceholder, searchActions, columns, rows }: BlockListSectionProps) => {
    const [sort, setSort] = useState<SortDescriptor>({
        column: columns.find((c) => c.allowsSorting)?.id ?? columns[0].id,
        direction: "ascending",
    });

    const sortedRows = useMemo(() => {
        if (!sort.column) return rows;
        const col = String(sort.column);
        const toText = (v: ReactNode) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
        const sorted = [...rows].sort((a, b) => toText(a[col]).localeCompare(toText(b[col]), undefined, { numeric: true }));
        return sort.direction === "descending" ? sorted.reverse() : sorted;
    }, [rows, sort]);

    return (
        <section className="flex flex-col gap-5">
            {/* Header: title + badge + download */}
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-primary">
                        {title} <span className="text-tertiary">({badge})</span>
                    </h2>
                    <p className="max-w-3xl text-sm text-tertiary">{description}</p>
                </div>
                <Button size="sm" color="primary-pink" iconLeading={Download01} className="shrink-0">
                    Download .CSV
                </Button>
            </div>

            {/* Search + actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input size="md" icon={SearchLg} placeholder={searchPlaceholder} wrapperClassName="flex-1" aria-label={searchPlaceholder} />
                <div className="flex shrink-0 items-center gap-2">{searchActions}</div>
            </div>

            {/* Table */}
            <TableCard.Root>
                <Table aria-label={title} selectionMode="none" sortDescriptor={sort} onSortChange={setSort}>
                    <Table.Header>
                        {columns.map((col) => (
                            <Table.Head
                                key={col.id}
                                id={col.id}
                                isRowHeader={col.isRowHeader}
                                allowsSorting={col.allowsSorting}
                                label={col.header ? undefined : col.label}
                                className={col.align === "right" ? "text-right" : undefined}
                            >
                                {col.header}
                            </Table.Head>
                        ))}
                    </Table.Header>
                    <Table.Body items={sortedRows}>
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
                <div className="flex justify-center border-t border-secondary bg-primary py-3">
                    <Button size="sm" color="secondary">
                        Load all
                    </Button>
                </div>
            </TableCard.Root>
        </section>
    );
};

/* ------------------------------------------------------------- Sample data --- */

const blockedBy = ["Vanessa Eng", "Kristen Smith", "Marc Santiago"];

const categoryRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `cat-${i}`,
    creative: "781212351",
    blockedBy: name,
    blockedOn: ["Core", "Nimbus+", "Core, Nimbus+"][i],
    blockedDate: "01-06-2019",
    unblockDate: "02-06-2019",
    action: <UnblockButton />,
}));

const advertiserRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `adv-${i}`,
    domain: "com.foo.mygame",
    blockedBy: name,
    blockedDate: "01-06-2019",
    action: <UnblockButton />,
}));

const applicationRows: BlockRow[] = blockedBy.map((name, i) => ({
    id: `app-${i}`,
    bundle: "com.foo.mygame",
    blockedBy: name,
    blockedDate: "01-06-2019",
    action: <UnblockButton />,
}));

const unblockAllHeader = <PinkPill>Unblock all</PinkPill>;

/* --------------------------------------------------------------- The screen --- */

export const AdBlockingScreen = () => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="ad blocking" />

            <main className="flex-1 overflow-x-hidden">
                {/* App header */}
                <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-5">
                    <h1 className="text-display-xs font-semibold text-primary">Your App</h1>
                </header>

                <div className="flex flex-col gap-12 px-8 py-8">
                    <BlockListSection
                        title="Blocked Categories"
                        badge="bcat"
                        description="Blocked creatives from specific advertising campaigns. Creative IDs rotate frequently and are recycled across the programmatic landscape. Nimbus only blocks Creative IDs for the current quarter; when the quarter ends, blocks are automatically removed."
                        searchPlaceholder="Search the IAB Category List"
                        searchActions={
                            <>
                                <Button size="sm" color="primary-pink">Block core</Button>
                                <Button size="sm" color="primary-pink">Block N+</Button>
                                <Button size="sm" color="primary-pink">Block both</Button>
                            </>
                        }
                        columns={[
                            { id: "creative", label: "25 blocked creatives", isRowHeader: true, allowsSorting: true },
                            { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                            { id: "blockedOn", label: "Blocked On", allowsSorting: true },
                            { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                            { id: "unblockDate", label: "Unblock Date", allowsSorting: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={categoryRows}
                    />

                    <BlockListSection
                        title="Blocked Advertisers"
                        badge="badv"
                        description="Blocked advertiser categories using the IAB content categories."
                        searchPlaceholder="Enter one or more domains (CSV supported)"
                        searchActions={<Button size="sm" color="primary-pink">Block</Button>}
                        columns={[
                            { id: "domain", label: "33 blocked apps", isRowHeader: true, allowsSorting: true },
                            { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                            { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={advertiserRows}
                    />

                    <BlockListSection
                        title="Blocked Applications"
                        badge="bapp"
                        description="Block list of applications by their platform-specific, exchange-independent application identifiers. On Android these are bundle or package names (e.g. com.foo.mygame); on iOS these are numeric IDs."
                        searchPlaceholder="com.foo.mygame"
                        searchActions={<Button size="sm" color="primary-pink">Block</Button>}
                        columns={[
                            { id: "bundle", label: "33 blocked apps", isRowHeader: true, allowsSorting: true },
                            { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                            { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                            { id: "action", header: unblockAllHeader, align: "right" },
                        ]}
                        rows={applicationRows}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdBlockingScreen;

/** Existing App Screens section presets for the 102326 table inventory. */
export const AdBlockingTableExamples = () => (
    <div className="flex flex-col gap-10">
        <BlockListSection
            title="Blocked Categories"
            badge="bcat"
            description="Blocked creatives from specific advertising campaigns. Creative IDs rotate frequently and are recycled across the programmatic landscape. Nimbus only blocks Creative IDs for the current quarter; when the quarter ends, blocks are automatically removed."
            searchPlaceholder="Search the IAB Category List"
            searchActions={
                <>
                    <Button size="sm" color="primary-pink">
                        Block core
                    </Button>
                    <Button size="sm" color="primary-pink">
                        Block N+
                    </Button>
                    <Button size="sm" color="primary-pink">
                        Block both
                    </Button>
                </>
            }
            columns={[
                { id: "creative", label: "25 blocked creatives", isRowHeader: true, allowsSorting: true },
                { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                { id: "blockedOn", label: "Blocked On", allowsSorting: true },
                { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                { id: "unblockDate", label: "Unblock Date", allowsSorting: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={categoryRows}
        />
        <BlockListSection
            title="Blocked Advertisers"
            badge="badv"
            description="Blocked advertiser categories using the IAB content categories."
            searchPlaceholder="Enter one or more domains (CSV supported)"
            searchActions={
                <Button size="sm" color="primary-pink">
                    Block
                </Button>
            }
            columns={[
                { id: "domain", label: "33 blocked apps", isRowHeader: true, allowsSorting: true },
                { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={advertiserRows}
        />
        <BlockListSection
            title="Blocked Applications"
            badge="bapp"
            description="Block list of applications by their platform-specific, exchange-independent application identifiers. On Android these are bundle or package names (e.g. com.foo.mygame); on iOS these are numeric IDs."
            searchPlaceholder="com.foo.mygame"
            searchActions={
                <Button size="sm" color="primary-pink">
                    Block
                </Button>
            }
            columns={[
                { id: "bundle", label: "33 blocked apps", isRowHeader: true, allowsSorting: true },
                { id: "blockedBy", label: "Blocked By", allowsSorting: true },
                { id: "blockedDate", label: "Blocked Date", allowsSorting: true },
                { id: "action", header: unblockAllHeader, align: "right" },
            ]}
            rows={applicationRows}
        />
    </div>
);
