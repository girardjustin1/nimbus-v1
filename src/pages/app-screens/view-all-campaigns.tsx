import { type ReactNode, useState } from "react";
import { ChevronDown, ChevronSelectorVertical, Plus, SearchLg } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";

/**
 * Deal Activation System → View All Campaigns.
 *
 * Rebuilds the two reference screens (reference/screens - batch 2/
 * DAS - View All Campaigns) with the Nimbus Global Nav + Untitled UI
 * components on the global pink/teal theme:
 *   1. View Campaigns — a very wide, horizontally-scrolling campaign table.
 *   2. Add Asset      — a creative-authoring form.
 *
 * The account chrome (header + teal "Add Asset / View Campaigns" tab strip)
 * is shared between the two tab views.
 */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";

/* ----------------------------------------------------------------- Chrome --- */

const AppShell = ({ children, footer }: { children: ReactNode; footer?: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav defaultActiveKey="deal activation setup" />

        <main className="flex flex-1 flex-col overflow-x-hidden bg-primary">
            <header className="flex items-center justify-between border-b border-secondary px-8 py-5">
                <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                <button type="button" aria-label="Account menu" className="transition duration-100 ease-linear hover:opacity-80">
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

/** Add Asset / View Campaigns tab strip, matching the reference teal tabs. */
const CampaignTabs = ({ active }: { active: "add" | "view" }) => {
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
            {tab("Add Asset", active === "add", true)}
            {tab("View Campaigns", active === "view")}
        </div>
    );
};

/** Compact pink pill action button used inside the dense table rows. */
const MiniPill = ({ children }: { children: ReactNode }) => (
    <button
        type="button"
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap text-white uppercase transition-opacity duration-100 ease-linear hover:opacity-90"
        style={{ backgroundColor: PINK }}
    >
        {children}
    </button>
);

/** Decorative teal sort chevron shown in sortable column headers. */
const SortChevron = () => <ChevronSelectorVertical className="size-3.5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />;

/* ==================================================================== *
 * Story 1 — View Campaigns (wide campaign table)                       *
 * ==================================================================== */

type CampaignStatus = "Running" | "Paused" | "Waiting";

interface CampaignRow {
    id: string;
    status: CampaignStatus;
    dealId: string;
    name: string;
    geos: string;
    platform: string;
    apps: string;
    budget: string;
    bidAmount: string;
    startDate: string;
    endDate: string;
    campaignCap: string;
    rules: string;
    adTypes: string;
    creativeCaps: string;
    priority: string;
    priorityEditable?: boolean;
    /** Action pill shown next to the priority value. */
    priorityAction: "change" | "save";
    enabled: boolean;
}

const campaignRows: CampaignRow[] = [
    {
        id: "c1",
        status: "Running",
        dealId: "Full Screen",
        name: "Creative Name One",
        geos: "Full Screen",
        platform: "iOS",
        apps: "2",
        budget: "1",
        bidAmount: "1",
        startDate: "1",
        endDate: "1",
        campaignCap: "1",
        rules: "1",
        adTypes: "1",
        creativeCaps: "1",
        priority: "72",
        priorityAction: "change",
        enabled: true,
    },
    {
        id: "c2",
        status: "Paused",
        dealId: "Full Screen",
        name: "Another Creative Name",
        geos: "Full Screen",
        platform: "iOS",
        apps: "1",
        budget: "1",
        bidAmount: "1",
        startDate: "1",
        endDate: "1",
        campaignCap: "1",
        rules: "1",
        adTypes: "1",
        creativeCaps: "1",
        priority: "10,000",
        priorityEditable: true,
        priorityAction: "save",
        enabled: false,
    },
    {
        id: "c3",
        status: "Waiting",
        dealId: "Full Screen",
        name: "Name of Next Creative",
        geos: "Full Screen",
        platform: "Android",
        apps: "3",
        budget: "1",
        bidAmount: "1",
        startDate: "1",
        endDate: "1",
        campaignCap: "1",
        rules: "1",
        adTypes: "1",
        creativeCaps: "1",
        priority: "10,000",
        priorityAction: "save",
        enabled: true,
    },
];

const statusColors: Record<CampaignStatus, { dot: string; text: string }> = {
    Running: { dot: TEAL, text: "text-primary" },
    Paused: { dot: "#D92D20", text: "text-error-primary font-medium" },
    Waiting: { dot: "#F79009", text: "text-primary" },
};

const StatusCell = ({ status }: { status: CampaignStatus }) => {
    const { dot, text } = statusColors[status];
    return (
        <span className={`inline-flex items-center gap-2 text-sm whitespace-nowrap ${text}`}>
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />
            {status}
        </span>
    );
};

/** Column definitions — `sortable` renders a teal sort chevron in the header. */
const columns: { id: string; label: string; sortable?: boolean }[] = [
    { id: "status", label: "Status", sortable: true },
    { id: "dealId", label: "Deal ID", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "geos", label: "Geos", sortable: true },
    { id: "platform", label: "Platform", sortable: true },
    { id: "apps", label: "Apps", sortable: true },
    { id: "budget", label: "Budget", sortable: true },
    { id: "bidAmount", label: "Bid Amount", sortable: true },
    { id: "startDate", label: "Start Date", sortable: true },
    { id: "endDate", label: "End Date", sortable: true },
    { id: "campaignCap", label: "Campaign Impression Cap", sortable: true },
    { id: "rules", label: "Rules", sortable: true },
    { id: "adTypes", label: "Ad Types", sortable: true },
    { id: "creativeCaps", label: "Creative Impression Caps", sortable: true },
    { id: "priority", label: "Priority" },
    { id: "enable", label: "Enable" },
    { id: "actions", label: "" },
];

export const ViewCampaignsScreen = () => {
    return (
        <AppShell>
            <CampaignTabs active="view" />

            <div className="flex flex-col gap-6 px-8 py-8">
                {/* Full-width search bar */}
                <div className="rounded-lg bg-secondary p-1.5">
                    <Input size="md" icon={SearchLg} placeholder="Search Assets" aria-label="Search Assets" />
                </div>

                {/* Very wide table — scrolls horizontally inside its own container. */}
                <div className="overflow-x-auto">
                    <ViewCampaignsTable />
                </div>
            </div>
        </AppShell>
    );
};

/* ==================================================================== *
 * Story 2 — Add Asset (creative-authoring form)                        *
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
        <Input size="md" aria-label={`${label} 1`} />
        <Input size="md" aria-label={`${label} 2`} />
        <Input size="md" aria-label={`${label} 3`} />
    </div>
);

export const AddAssetScreen = () => {
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
            <CampaignTabs active="add" />

            <div className="flex max-w-6xl flex-col gap-6 px-8 py-8">
                <Input label="Name" aria-label="Name" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Select label="Ad Type" placeholder="" items={adTypeItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                    <Select label="Ad Size" placeholder="" items={adSizeItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                </div>

                <TextArea label="Add Markup" placeholder="Add Markup Code" rows={6} />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <TrackerColumn label="Impression Tracking URL(s)" />
                    <TrackerColumn label="Click Tracking URL(s)" />
                </div>

                <div className="flex flex-col gap-4">
                    <span className="text-sm font-medium text-secondary">Daily Impression Cap</span>
                    <RadioGroup value={impressionMode} onChange={setImpressionMode} size="md" className="gap-4">
                        <RadioButton value="disabled" label="Do Not Enable" size="md" />
                        <div className="flex items-center gap-6">
                            <RadioButton value="enabled" label="Enable" size="md" />
                            <Input
                                size="md"
                                defaultValue="100"
                                aria-label="Daily impression cap value"
                                wrapperClassName="w-48"
                                isDisabled={impressionMode !== "enabled"}
                            />
                        </div>
                    </RadioGroup>
                    <p className="text-sm text-tertiary">If impression caps are not enabled, all creatives are served in even distribution.</p>
                </div>
            </div>
        </AppShell>
    );
};

export default ViewCampaignsScreen;

/** The table used by ViewCampaignsScreen, exposed without page navigation for the 102326 audit. */
export const ViewCampaignsTable = () => {
    return (
        <TableCard.Root className="min-w-max">
            <Table aria-label="View campaigns" selectionMode="none">
                <Table.Header>
                    {columns.map((col) => (
                        <Table.Head key={col.id} id={col.id} isRowHeader={col.id === "status"} label={col.label}>
                            {col.sortable ? <SortChevron /> : null}
                        </Table.Head>
                    ))}
                </Table.Header>
                <Table.Body>
                    {campaignRows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <StatusCell status={row.status} />
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">{row.dealId}</Table.Cell>
                            <Table.Cell>
                                <a href="#" className="text-sm font-semibold whitespace-nowrap" style={{ color: TEAL }}>
                                    {row.name}
                                </a>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">{row.geos}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap">{row.platform}</Table.Cell>
                            <Table.Cell>{row.apps}</Table.Cell>
                            <Table.Cell>{row.budget}</Table.Cell>
                            <Table.Cell>{row.bidAmount}</Table.Cell>
                            <Table.Cell>{row.startDate}</Table.Cell>
                            <Table.Cell>{row.endDate}</Table.Cell>
                            <Table.Cell>{row.campaignCap}</Table.Cell>
                            <Table.Cell>{row.rules}</Table.Cell>
                            <Table.Cell>{row.adTypes}</Table.Cell>
                            <Table.Cell>{row.creativeCaps}</Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center gap-2">
                                    {row.priorityEditable ? (
                                        <Input size="sm" defaultValue={row.priority} aria-label="Priority" wrapperClassName="w-24" />
                                    ) : (
                                        <span className="whitespace-nowrap text-primary">{row.priority}</span>
                                    )}
                                    <MiniPill>{row.priorityAction === "change" ? "Change" : "Save"}</MiniPill>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <Toggle size="sm" defaultSelected={row.enabled} aria-label="Enable campaign" />
                            </Table.Cell>
                            <Table.Cell>
                                <MiniPill>Duplicate</MiniPill>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
