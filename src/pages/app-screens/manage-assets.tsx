import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Plus, SearchLg, XClose } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";

/**
 * Deal Activation System → Manage Assets.
 *
 * Rebuilds the three reference screens (reference/screens/Manage Assets) with
 * the Nimbus Global Nav + Untitled UI components on the global pink/teal theme:
 *   1. Add Existing Asset  — search + selected-assets table (Screen.png)
 *   2. Create Campaigns    — creative-authoring form            (Screen-1.png)
 *   3. View Campaigns      — sortable live-campaigns table       (Screen-2.png)
 *
 * The account chrome (dark nav, "Your Account" header, sticky footer action
 * bar, and the Create/View tab strip) is factored into small shared pieces so
 * every screen renders from one implementation.
 */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";

/* ----------------------------------------------------------------- Chrome --- */

const AppShell = ({ children, footer }: { children: ReactNode; footer?: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav defaultActiveKey="manage assets" />

        <main className="flex flex-1 flex-col overflow-x-hidden bg-primary">
            <header className="flex items-center justify-between border-b border-secondary px-8 py-5">
                <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                <button type="button" aria-label="Account menu" className="text-[color:var(--pink)]" style={{ ["--pink" as string]: PINK }}>
                    <ChevronDown className="size-6" style={{ color: PINK }} aria-hidden="true" />
                </button>
            </header>

            <div className="flex-1">{children}</div>

            {footer && (
                <footer className="sticky bottom-0 z-10 border-t border-secondary bg-primary px-8 py-5 shadow-[0_-1px_2px_rgba(10,13,18,0.05)]">
                    {footer}
                </footer>
            )}
        </main>
    </div>
);

/** Create / View campaign tab strip, matching the reference teal tabs. */
const CampaignTabs = ({ active }: { active: "create" | "view" }) => {
    const tab = (label: string, isActive: boolean, first?: boolean) => (
        <button
            type="button"
            aria-current={isActive ? "page" : undefined}
            className={[
                "px-8 py-4 text-lg font-semibold transition-colors duration-100",
                first ? "border-r border-secondary" : "",
                isActive ? "bg-[color:var(--tealBg)]" : "hover:bg-secondary_hover",
            ].join(" ")}
            style={{ color: TEAL, ["--tealBg" as string]: `${TEAL}14` }}
        >
            {label}
        </button>
    );

    return (
        <div className="flex border-b border-secondary">
            {tab("Create Campaigns", active === "create", true)}
            {tab("View Campaigns", active === "view")}
        </div>
    );
};

/** Small pink text action used at the end of table rows. */
export const RemoveButton = () => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase transition-colors duration-100 hover:opacity-80"
        style={{ color: PINK }}
    >
        <XClose className="size-4" aria-hidden="true" />
        Remove
    </button>
);

/** Compact pill action button used inside dense table rows. */
export const MiniPill = ({ children, color = "pink" }: { children: ReactNode; color?: "pink" | "blue" }) => (
    <button
        type="button"
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap text-white uppercase transition-opacity duration-100 hover:opacity-90"
        style={{ backgroundColor: color === "pink" ? PINK : "#38BDF8" }}
    >
        {children}
    </button>
);

/* ==================================================================== *
 * Screen 1 — Add Existing Asset                                        *
 * ==================================================================== */

interface AssetRow {
    id: string;
    creative: string;
    adType: string;
    adSize: string;
    dailyCap: string;
}

const assetRows: AssetRow[] = [
    { id: "a1", creative: "Holiday Sale Interstitial", adType: "HTML", adSize: "Medium Rectangle", dailyCap: "1,000" },
    { id: "a2", creative: "Summer Video Preroll", adType: "VAST", adSize: "Full Screen", dailyCap: "1,000" },
    { id: "a3", creative: "App Install Rewarded", adType: "VAST", adSize: "Full Screen", dailyCap: "1,000" },
];

export const ManageAssetsAddExisting = () => {
    return (
        <AppShell
            footer={
                <div className="flex items-center justify-between">
                    <Button size="lg" color="primary-pink" iconLeading={ArrowLeft} className="uppercase">
                        Priority
                    </Button>
                    <Button size="lg" color="primary-pink" iconTrailing={ArrowRight} className="uppercase">
                        Review
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-primary">Add Existing Asset</h2>
                    <p className="text-sm text-tertiary">
                        If you are using brand new assets,{" "}
                        <a href="#" className="font-semibold underline" style={{ color: TEAL }}>
                            you must add them to your library
                        </a>{" "}
                        first.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input size="md" icon={SearchLg} placeholder="Search Assets" wrapperClassName="flex-1" aria-label="Search Assets" />
                    <Button size="md" color="primary-pink" className="uppercase sm:w-32">
                        Add
                    </Button>
                </div>

                <SelectedAssetsTable />
            </div>
        </AppShell>
    );
};

/* ==================================================================== *
 * Screen 2 — Create Campaigns (creative form)                          *
 * ==================================================================== */

const adTypeItems = [
    { id: "html", label: "HTML" },
    { id: "vast", label: "VAST" },
    { id: "native", label: "Native" },
];

const adSizeItems = [
    { id: "mrec", label: "Medium Rectangle" },
    { id: "full", label: "Full Screen" },
    { id: "banner", label: "Banner" },
    { id: "leaderboard", label: "Leaderboard" },
];

const TrackerColumn = ({ label }: { label: string }) => (
    <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <Input size="md" placeholder="https://track.adsbynimbus.com/imp" aria-label={`${label} 1`} />
        <Input size="md" placeholder="https://track.adsbynimbus.com/imp" aria-label={`${label} 2`} />
        <Input size="md" placeholder="https://track.adsbynimbus.com/imp" aria-label={`${label} 3`} />
    </div>
);

export const ManageAssetsCreateCampaign = () => {
    const [impressionMode, setImpressionMode] = useState("disabled");

    return (
        <AppShell
            footer={
                <div className="flex items-center justify-end">
                    <Button size="lg" color="primary-pink" iconLeading={Plus} className="uppercase">
                        Add Creative
                    </Button>
                </div>
            }
        >
            <CampaignTabs active="create" />

            <div className="flex max-w-6xl flex-col gap-6 px-8 py-8">
                <Input label="Name" placeholder="e.g. Holiday Sale Interstitial" isRequired />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Select label="Ad Type" placeholder="Select ad type" items={adTypeItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                    <Select label="Ad Size" placeholder="Select ad size" items={adSizeItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                </div>

                <TextArea label="Add Markup" placeholder="Add Markup Code" rows={6} />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <TrackerColumn label="Impression Trackers" />
                    <TrackerColumn label="Click Trackers" />
                </div>

                <TextArea
                    label="Description"
                    isRequired
                    tooltip="A short internal note describing this creative."
                    placeholder="Enter a description..."
                    rows={4}
                    hint="This is a hint text to help user."
                />

                <RadioGroup value={impressionMode} onChange={setImpressionMode} className="gap-4">
                    <RadioButton value="disabled" label="Do Not Enable" size="md" />
                    <div className="flex items-center gap-6">
                        <RadioButton value="enabled" label="Enable" size="md" />
                        <Input size="md" defaultValue="100" aria-label="Impression cap" wrapperClassName="w-48" isDisabled={impressionMode !== "enabled"} />
                    </div>
                </RadioGroup>

                <p className="text-sm text-tertiary">If impression caps are not enabled, all creatives are served in even distribution.</p>
            </div>
        </AppShell>
    );
};

/* ==================================================================== *
 * Screen 3 — View Campaigns (live campaigns table)                     *
 * ==================================================================== */

type CampaignStatus = "Running" | "Paused" | "Waiting";
type ActionKind = "change" | "save-copy" | "save-test";

interface CampaignRow {
    id: string;
    status: CampaignStatus;
    creative: string;
    adType: string;
    adSize: string;
    impressionTrackers: number;
    clickTrackers: number;
    dailyCap: string;
    capEditable?: boolean;
    action: ActionKind;
}

const campaignRows: CampaignRow[] = [
    {
        id: "c1",
        status: "Running",
        creative: "Holiday Sale Interstitial",
        adType: "Full Screen",
        adSize: "iOS",
        impressionTrackers: 2,
        clickTrackers: 1,
        dailyCap: "72",
        action: "change",
    },
    {
        id: "c2",
        status: "Paused",
        creative: "Summer Video Preroll",
        adType: "Full Screen",
        adSize: "iOS",
        impressionTrackers: 1,
        clickTrackers: 1,
        dailyCap: "10,000",
        capEditable: true,
        action: "save-copy",
    },
    {
        id: "c3",
        status: "Waiting",
        creative: "App Install Rewarded",
        adType: "Full Screen",
        adSize: "Android",
        impressionTrackers: 3,
        clickTrackers: 1,
        dailyCap: "10,000",
        action: "save-test",
    },
];

const statusColors: Record<CampaignStatus, { dot: string; text: string }> = {
    Running: { dot: TEAL, text: "text-primary" },
    Paused: { dot: "#F04438", text: "text-error-primary" },
    Waiting: { dot: "#F79009", text: "text-primary" },
};

export const StatusCell = ({ status }: { status: CampaignStatus }) => {
    const { dot, text } = statusColors[status];
    return (
        <span className={`inline-flex items-center gap-2 text-sm font-medium ${text}`}>
            <span className="size-2 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />
            {status}
        </span>
    );
};

const getSortValue = (row: CampaignRow, column: string): string | number => {
    switch (column) {
        case "impressionTrackers":
            return row.impressionTrackers;
        case "clickTrackers":
            return row.clickTrackers;
        case "dailyCap":
            return Number(row.dailyCap.replace(/,/g, ""));
        default:
            return String(row[column as keyof CampaignRow] ?? "");
    }
};

export const ManageAssetsViewCampaigns = () => {
    return (
        <AppShell>
            <CampaignTabs active="view" />

            <div className="flex flex-col gap-6 px-8 py-8">
                <Input size="md" icon={SearchLg} placeholder="Search Assets" aria-label="Search Assets" />

                <AssetCampaignsTable />
            </div>
        </AppShell>
    );
};

export default ManageAssetsAddExisting;

/** The table used by ManageAssetsAddExisting, exposed without page navigation for the 102326 audit. */
export const SelectedAssetsTable = () => {
    return (
        <TableCard.Root>
            <Table aria-label="Selected assets" selectionMode="none">
                <Table.Header>
                    <Table.Head id="creative" isRowHeader label="Campaign Creative" />
                    <Table.Head id="adType" label="Ad Type" />
                    <Table.Head id="adSize" label="Ad Size" />
                    <Table.Head id="dailyCap" label="Daily Impression Cap" />
                    <Table.Head id="action" label="" />
                </Table.Header>
                <Table.Body>
                    {assetRows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <span className="text-sm font-medium text-primary">{row.creative}</span>
                            </Table.Cell>
                            <Table.Cell>{row.adType}</Table.Cell>
                            <Table.Cell>{row.adSize}</Table.Cell>
                            <Table.Cell>{row.dailyCap}</Table.Cell>
                            <Table.Cell className="text-right">
                                <RemoveButton />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

/** The table used by ManageAssetsViewCampaigns, exposed without page navigation for the 102326 audit. */
export const AssetCampaignsTable = () => {
    const [sort, setSort] = useState<SortDescriptor>({ column: "status", direction: "ascending" });

    const sortedRows = useMemo(() => {
        const column = String(sort.column);
        const sorted = [...campaignRows].sort((a, b) => {
            const av = getSortValue(a, column);
            const bv = getSortValue(b, column);
            if (typeof av === "number" && typeof bv === "number") return av - bv;
            return String(av).localeCompare(String(bv), undefined, { numeric: true });
        });
        return sort.direction === "descending" ? sorted.reverse() : sorted;
    }, [sort]);

    return (
        <TableCard.Root>
            <Table aria-label="Live campaigns" selectionMode="none" sortDescriptor={sort} onSortChange={setSort}>
                <Table.Header>
                    <Table.Head id="status" isRowHeader allowsSorting label="Status" />
                    <Table.Head id="creative" allowsSorting label="Creative" />
                    <Table.Head id="adType" allowsSorting label="Ad Type" />
                    <Table.Head id="adSize" allowsSorting label="Ad Size" />
                    <Table.Head id="impressionTrackers" allowsSorting label="Impression Trackers" />
                    <Table.Head id="clickTrackers" allowsSorting label="Click Trackers" />
                    <Table.Head id="dailyCap" allowsSorting label="Daily Impression Cap" />
                    <Table.Head id="action" label="" />
                </Table.Header>
                <Table.Body>
                    {sortedRows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <StatusCell status={row.status} />
                            </Table.Cell>
                            <Table.Cell>
                                <a href="#" className="text-sm font-semibold" style={{ color: TEAL }}>
                                    {row.creative}
                                </a>
                            </Table.Cell>
                            <Table.Cell>{row.adType}</Table.Cell>
                            <Table.Cell>{row.adSize}</Table.Cell>
                            <Table.Cell>{row.impressionTrackers}</Table.Cell>
                            <Table.Cell>{row.clickTrackers}</Table.Cell>
                            <Table.Cell>
                                {row.capEditable ? (
                                    <Input size="sm" defaultValue={row.dailyCap} aria-label="Daily impression cap" wrapperClassName="w-28" />
                                ) : (
                                    row.dailyCap
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center justify-end gap-3">
                                    {row.action === "change" && (
                                        <>
                                            <MiniPill>Change</MiniPill>
                                            <MiniPill>Test Asset</MiniPill>
                                        </>
                                    )}
                                    {row.action === "save-copy" && (
                                        <>
                                            <MiniPill>Save</MiniPill>
                                            <MiniPill color="blue">Copy Test Link</MiniPill>
                                        </>
                                    )}
                                    {row.action === "save-test" && (
                                        <>
                                            <MiniPill>Save</MiniPill>
                                            <MiniPill>Test Asset</MiniPill>
                                        </>
                                    )}
                                    <RemoveButton />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
