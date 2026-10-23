import type { ReactNode } from "react";
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronRight, Plus, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

/**
 * Demand → Manage Active Demand.
 *
 * Rebuilds the reference flow (reference/screens - batch 2/DAS - Billing Rates)
 * which is actually a "Manage App-Ads.txt" flow plus the demand-partners table.
 * Composed from the Nimbus Global Nav + Untitled UI Button / Table / Toggle /
 * FeaturedIcon on the global pink/teal theme.
 *
 * States (one Storybook story each):
 *   1. ActionNeeded            — three stacked "Action Needed" error rows
 *   2. ErrorModal              — App-Ads.txt error warning modal over a dim
 *   3. ManageAppAdsTxtDownload — App-Ads.txt code block (Download tab)
 *   4. ManageAppAdsTxtErrors   — missing-lines report (Errors tab)
 *   5. IntegratedDemandPartners — "10 Integrated Demand Partners" table
 */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";

/* ----------------------------------------------------------------- Chrome --- */

const AppShell = ({ children }: { children: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav defaultActiveKey="manage active demand" />

        <main className="flex flex-1 flex-col overflow-x-hidden bg-primary">
            <header className="flex items-center justify-between border-b border-secondary px-8 py-5">
                <h1 className="text-display-xs font-semibold text-primary">Your App</h1>
                <button
                    type="button"
                    aria-label="Account options"
                    className="inline-flex size-9 items-center justify-center rounded-full transition duration-100 ease-linear hover:bg-[#fdf2f7]"
                    style={{ color: PINK }}
                >
                    <ChevronDown className="size-6" aria-hidden="true" />
                </button>
            </header>

            <div className="flex-1">{children}</div>
        </main>
    </div>
);

/** Breadcrumb "← Demand: Manage App-Ads.txt". */
const AppAdsBreadcrumb = () => (
    <div className="flex items-center gap-3 border-b border-secondary px-8 py-5">
        <ArrowLeft className="size-5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
        <span className="text-lg">
            <span className="font-semibold" style={{ color: TEAL }}>
                Demand:
            </span>{" "}
            <span className="font-bold text-primary">Manage App-Ads.txt</span>
        </span>
    </div>
);

/** Download / Errors tab strip. `active` selects which tab is teal (active). */
const AppAdsTabs = ({ active, trailing }: { active: "download" | "errors"; trailing?: ReactNode }) => {
    const tab = (label: string, key: "download" | "errors", first?: boolean) => {
        const isActive = active === key;
        return (
            <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                className={cx(
                    "px-14 py-4 text-lg font-semibold transition duration-100 ease-linear",
                    first && "border-r border-secondary",
                )}
                style={{
                    color: isActive ? TEAL : PINK,
                    backgroundColor: isActive ? `${TEAL}14` : undefined,
                }}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-between border-b border-secondary">
            <div className="flex">
                {tab("Download", "download", true)}
                {tab("Errors", "errors")}
            </div>
            {trailing && <div className="px-8">{trailing}</div>}
        </div>
    );
};

/** Light-gray monospace code block with a line-number gutter. */
const CodeBlock = ({ lines }: { lines: string[] }) => (
    <div className="overflow-x-auto rounded-md bg-secondary py-4">
        <pre className="min-w-max font-mono text-sm leading-6 text-primary">
            {lines.map((line, i) => (
                <div key={i} className="flex gap-4 px-5">
                    <span className="w-6 shrink-0 text-right text-tertiary select-none">{i + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                </div>
            ))}
        </pre>
    </div>
);

/* ==================================================================== *
 * Sample data                                                          *
 * ==================================================================== */

const actionRows = [
    {
        id: "app-ads",
        title: "App-Ads.text Error",
        desc: "Nimbus has detected one or more errors in your accounts app-ads.txt file. Buyers may stop purchasing, as your inventory may not be recognized as legitimate. This can lead to a significant loss in revenue.",
        cta: "Fix App-Ads.txt",
    },
    {
        id: "manager-domain",
        title: "ManagerDomain Error",
        desc: "Nimbus has detected ManagerDomain is missing from your accounts app-ads.txt file. As your mediation provider and inventory manager, it's important to add Nimbus as your ManagerDomain to signal the most efficient supply path for your inventory. As a result of this missing, it could lead to significant revenue loss.",
        cta: "Fix ManagerDomain",
    },
    {
        id: "owner-domain",
        title: "OwnerDomain Error",
        desc: "Nimbus has detected OwnerDomain is missing from your accounts app-ads.txt file. The OwnerDomain field shows that you are the actual owner of the inventory, even if multiple sellers or resellers are involved. Some programmatic DSPs and ad exchanges now require OwnerDomain for verification. Failing to include it can lead to revenue loss.",
        cta: "Fix Owner Domain",
    },
];

const appAdsTxtLines = [
    "adsbynimbus.com, [PublisherSellerID], DIRECT, dd263a8a859bd0e0",
    "media.net, 8CUQC3000, RESELLER",
    "sharethrough.com, Vlox9WTu, RESELLER, d53b998a7bd4ecd2",
    "pubmatic.com, 156557, RESELLER, 5d62403b186f2ace",
    "rubiconproject.com, 18694, RESELLER, 0bfd66d529a55807",
    "openx.com, 540274407, RESELLER, 6a698e2ec38604c6",
    "33across.com, 0013300001kQj2HAAS, RESELLER, bbea06d9c4d2853c",
    "smaato.com, 1100047713, RESELLER, 07bcf65f187117b4",
    "smartadserver.com, 4342, RESELLER",
    "smartadserver.com, 4012, RESELLER",
    "video.unrulymedia.com, 266978658, RESELLER",
    "lunamedia.io, 6bf03349-293b-4b25-9391-c553ba38021d, RESELLER, 524ecb396915caaf",
    "themediagrid.com, R2819J, RESELLER, 35d5010d7789b49d",
    "pubmatic.com, 160493, RESELLER, 5d62403b186f2ace",
    "rubiconproject.com, 24170, RESELLER, 0bfd66d529a55807",
    "video.unrulymedia.com, 4631344382657206988, RESELLER",
    "smartadserver.com, 4539, RESELLER, 060d053dcf45cbf3",
    "contextweb.com, 562329, RESELLER, 89ff185a4c4e857c",
    "inmobi.com, ddb41d8a9f434a918d05a0fc9999d9f9, RESELLER, 83e75a7ae333ca9d",
    "freewheel.tv, 1585279, RESELLER",
    "inmobi.com, 30f3830cfef249a3ad46ee1a0bba7af3, RESELLER, 83e75a7ae333ca9d",
    "inmobi.com, 0c2fa8130b884712913cc0bfc84e1c31, RESELLER, 83e75a7ae333ca9d",
    "inmobi.com, 662fb54f5d15471a80b4ddaa467e84b0, RESELLER, 83e75a7ae333ca9d",
    "inmobi.com, cac51fe616224c3c8f858f34b3267dd7, RESELLER, 83e75a7ae333ca9d",
    "iqzone.com, IQ263, RESELLER",
    "thebrave.io, 1234707, RESELLER, 25b2154543746ac",
    "appnexus.com, 12061, RESELLER, f5ab79cb980f11d1",
    "appnexus.com, 12878, RESELLER, f5ab79cb980f11d1",
    "appnexus.com, 14080, RESELLER, f5ab79cb980f11d1",
    "freewheel.tv, 1601349, RESELLER",
    "freewheel.tv, 1601388, RESELLER",
    "onetag.com, 82bad7d17eccf7c, RESELLER",
    "axonix.com, 59107, RESELLER, bc385f2b4a87b721",
    "triplelift.com, 12908, RESELLER, 6c33edb13117fd86",
    "rubiconproject.com, 24752, RESELLER, 0bfd66d529a55807",
    "inmobi.com, ef083d721beb4c0f8776ced01e262c03, RESELLER, 83e75a7ae333ca9d",
    "video.unrulymedia.com, 3881266972, RESELLER",
    "smartadserver.com, 4343, RESELLER",
    "contextweb.com, 562726, RESELLER, 89ff185a4c4e857c",
];

const missingLines = [
    "freewheel.tv, 1601388, RESELLER",
    "onetag.com, 82bad7d17eccf7c, RESELLER",
    "axonix.com, 59107, RESELLER, bc385f2b4a87b721",
    "triplelift.com, 12908, RESELLER, 6c33edb13117fd86",
    "rubiconproject.com, 24752, RESELLER, 0bfd66d529a55807",
    "inmobi.com, ef083d721beb4c0f8776ced01e262c03, RESELLER, 83e75a7ae333ca9d",
    "video.unrulymedia.com, 3881266972, RESELLER",
    "smartadserver.com, 4343, RESELLER",
    "contextweb.com, 562726, RESELLER, 89ff185a4c4e857c",
];

type PartnerStatus = "Running" | "Capped" | "Paused";
type CapKind = { type: "change"; value: string } | { type: "save"; value: string } | { type: "add" };

interface PartnerRow {
    id: string;
    source: string;
    status: PartnerStatus;
    enabled: boolean;
    cap: CapKind;
    demandType: "ORTB" | "Line Item";
}

const partnerRows: PartnerRow[] = [
    { id: "a9", source: "A9", status: "Running", enabled: true, cap: { type: "change", value: "72" }, demandType: "ORTB" },
    { id: "adview", source: "Adview", status: "Running", enabled: false, cap: { type: "save", value: "10,000" }, demandType: "ORTB" },
    { id: "aermarket", source: "Aermarket", status: "Running", enabled: true, cap: { type: "add" }, demandType: "ORTB" },
    { id: "aol", source: "AOL", status: "Capped", enabled: false, cap: { type: "add" }, demandType: "ORTB" },
    { id: "appnexus", source: "AppNexus", status: "Paused", enabled: true, cap: { type: "add" }, demandType: "Line Item" },
    { id: "aps", source: "APS", status: "Running", enabled: false, cap: { type: "add" }, demandType: "Line Item" },
];

const statusDot: Record<PartnerStatus, string> = {
    Running: TEAL,
    Capped: "#F79009",
    Paused: "#F04438",
};

/* ==================================================================== *
 * State 1 — Action Needed                                              *
 * ==================================================================== */

export const ManageActiveDemandActionNeeded = () => (
    <AppShell>
        <div className="flex flex-col">
            {actionRows.map((row) => (
                <div key={row.id} className="flex items-start justify-between gap-8 border-b border-secondary px-8 py-6">
                    <div className="flex max-w-3xl flex-col gap-2">
                        <h2 className="text-xl font-bold">
                            <span style={{ color: "#E31B54" }}>Action Needed:</span>{" "}
                            <span className="text-primary">{row.title}</span>
                        </h2>
                        <p className="text-md text-tertiary">{row.desc}</p>
                    </div>
                    <Button size="lg" color="primary-pink" className="shrink-0 uppercase">
                        {row.cta}
                    </Button>
                </div>
            ))}
        </div>
    </AppShell>
);

/* ==================================================================== *
 * State 2 — Error Modal                                                *
 * ==================================================================== */

export const ManageActiveDemandErrorModal = () => (
    <div className="relative">
        {/* Dimmed screen behind the modal */}
        <div className="pointer-events-none select-none blur-[1px]">
            <ManageActiveDemandActionNeeded />
        </div>

        {/* Dim overlay + centered card */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d12] p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-primary p-6 shadow-xl">
                <button
                    type="button"
                    aria-label="Close"
                    className="absolute top-5 right-5 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover"
                >
                    <XClose className="size-6" aria-hidden="true" />
                </button>

                <FeaturedIcon icon={AlertTriangle} color="warning" theme="light" size="lg" />

                <div className="mt-5 flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-primary">App-Ads.txt Error</h2>
                    <p className="text-sm text-tertiary">
                        Nimbus has detected one or more errors in your accounts app-ads.txt file. Buyers may stop purchasing, as your inventory may
                        not be recognized as legitimate. This can lead to a significant loss in revenue.
                    </p>
                </div>

                <Button size="lg" color="primary-pink" className="mt-6 w-full uppercase">
                    Fix App-Ads.txt
                </Button>
            </div>
        </div>
    </div>
);

/* ==================================================================== *
 * State 3 — Manage App-Ads.txt (Download tab)                          *
 * ==================================================================== */

export const ManageActiveDemandAppAdsTxtDownload = () => (
    <AppShell>
        <AppAdsBreadcrumb />
        <AppAdsTabs active="download" />

        <div className="flex flex-col gap-6 px-8 py-8 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
                <CodeBlock lines={appAdsTxtLines} />
            </div>
            <Button size="lg" color="primary-pink" className="shrink-0 uppercase">
                Download App-Ads.txt
            </Button>
        </div>
    </AppShell>
);

/* ==================================================================== *
 * State 4 — Manage App-Ads.txt (Errors tab)                            *
 * ==================================================================== */

const ErrorSection = ({
    heading,
    children,
    lines,
}: {
    heading: string;
    children: ReactNode;
    lines: string[];
}) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-primary">{heading}</h2>
            <p className="max-w-4xl text-md text-tertiary">{children}</p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
                <CodeBlock lines={lines} />
            </div>
            <Button size="lg" color="primary-pink" className="shrink-0 uppercase">
                Copy All to Clipboard
            </Button>
        </div>
    </section>
);

export const ManageActiveDemandAppAdsTxtErrors = () => (
    <AppShell>
        <AppAdsBreadcrumb />
        <AppAdsTabs
            active="errors"
            trailing={<span className="text-sm text-tertiary">Last checked August 28, 2024 at 2:38pm</span>}
        />

        <div className="flex flex-col gap-10 px-8 py-8">
            <ErrorSection heading="You are missing app.ads.txt lines" lines={missingLines}>
                Nimbus has detected missing lines in your app-ads.txt file. Buyers may stop purchasing, as your inventory may not be recognized as
                legitimate. This can lead to a significant loss in revenue. Please add the lines listed below.{" "}
                <a href="#" className="font-semibold" style={{ color: TEAL }}>
                    Click here
                </a>{" "}
                for general instructions on how to manage your app's ads.txt lines.
            </ErrorSection>

            <ErrorSection heading="You are missing ManagerDomain" lines={["ManagerDomain=adsbynimbus.co"]}>
                Nimbus has detected ManagerDomain is missing from your accounts app-ads.txt file. As your mediation provider and inventory manager,
                it's important to add Nimbus as your ManagerDomain to signal the most efficient supply path for your inventory. As a result of this
                missing, it could lead to significant revenue loss.{" "}
                <a href="#" className="font-semibold" style={{ color: TEAL }}>
                    Click here for general instructions
                </a>{" "}
                on how to manage your app's ads.txt lines.
            </ErrorSection>

            <ErrorSection heading="You are missing OwnerDomain" lines={["ManagerDomain=adsbynimbus.co"]}>
                Nimbus has detected OwnerDomain is missing from your accounts app-ads.txt file. The OwnerDomain field shows that you are the actual
                owner of the inventory, even if multiple sellers or resellers are involved. Some programmatic DSPs and ad exchanges now require
                OwnerDomain for verification. Failing to include it can lead to revenue loss.{" "}
                <a href="#" className="font-semibold" style={{ color: TEAL }}>
                    Click here for general instructions
                </a>{" "}
                on how to manage you app's ads.txt lines.
            </ErrorSection>
        </div>
    </AppShell>
);

/* ==================================================================== *
 * State 5 — Integrated Demand Partners                                 *
 * ==================================================================== */

/** Small pink pill action (CHANGE / SAVE). */
const PinkPill = ({ children }: { children: ReactNode }) => (
    <button
        type="button"
        className="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold whitespace-nowrap text-white uppercase transition-opacity duration-100 ease-linear hover:opacity-90"
        style={{ backgroundColor: PINK }}
    >
        {children}
    </button>
);

export const CapCell = ({ cap }: { cap: CapKind }) => {
    if (cap.type === "add") {
        return (
            <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase transition-opacity duration-100 ease-linear hover:opacity-80"
                style={{ color: PINK }}
            >
                <Plus className="size-4" aria-hidden="true" />
                Add
            </button>
        );
    }
    if (cap.type === "change") {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-primary">{cap.value}</span>
                <PinkPill>Change</PinkPill>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-3">
            <Input size="sm" defaultValue={cap.value} aria-label="Impression cap" wrapperClassName="w-24" />
            <PinkPill>Save</PinkPill>
        </div>
    );
};

export const ManageActiveDemandIntegratedPartners = () => {
    return (
        <AppShell>
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-display-xs font-semibold text-primary">10 Integrated Demand Partners</h2>
                    <div className="flex flex-wrap gap-3">
                        <Button size="md" color="primary-pink" className="uppercase">
                            Manage App-Ads.txt
                        </Button>
                        <Button size="md" color="primary-pink" className="uppercase">
                            Download SKAN IDs
                        </Button>
                        <Button size="md" color="primary-pink" className="uppercase">
                            Add Deman
                        </Button>
                        <Button size="md" color="primary-pink" className="uppercase">
                            Add N+ Contract
                        </Button>
                    </div>
                </div>

                <IntegratedDemandPartnersTable />
            </div>
        </AppShell>
    );
};

export default ManageActiveDemandActionNeeded;

/** The table used by ManageActiveDemandIntegratedPartners, exposed without page navigation for the 102326 audit. */
export const IntegratedDemandPartnersTable = () => {
    return (
        <TableCard.Root>
            <Table aria-label="Integrated demand partners" selectionMode="none">
                <Table.Header>
                    <Table.Head id="source" isRowHeader label="Demand Source" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="enabled" label="Enabled" />
                    <Table.Head id="cap" label="Impression Cap" />
                    <Table.Head id="type" label="Demand Type" />
                    <Table.Head id="edit" label="Edit Demand Setup" />
                </Table.Header>
                <Table.Body>
                    {partnerRows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <span className="text-sm font-medium text-primary">{row.source}</span>
                            </Table.Cell>
                            <Table.Cell>
                                <span
                                    className="inline-flex items-center gap-2 text-sm font-medium"
                                    style={{ color: row.status === "Paused" ? "#F04438" : undefined }}
                                >
                                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: statusDot[row.status] }} aria-hidden="true" />
                                    <span className={row.status === "Paused" ? "" : "text-primary"}>{row.status}</span>
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Toggle defaultSelected={row.enabled} aria-label={`${row.source} enabled`} />
                            </Table.Cell>
                            <Table.Cell>
                                <CapCell cap={row.cap} />
                            </Table.Cell>
                            <Table.Cell>{row.demandType}</Table.Cell>
                            <Table.Cell>
                                <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: TEAL }}>
                                    Placements
                                    <ChevronRight className="size-4" aria-hidden="true" />
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
