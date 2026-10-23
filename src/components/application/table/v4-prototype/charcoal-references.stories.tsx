import type { Meta, StoryObj } from "@storybook/react-vite";
import { BenchmarksTable } from "@/pages/app-screens/nimbus-benchmarks";
import { DataTable, SavedQueriesView } from "@/pages/app-screens/performance-insights";
import { prototypeHref, storyHref } from "./catalog";

const meta = {
    title: "Application UI/Table/V4 Prototype/Charcoal References",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Existing App Screens components with #101828 charcoal headers, white header text, teal accents and alternating rows. These are visual references for the requested current-product look; v4 currently renders different, light-header HTML tables. Exact production parity needs comparison with the current live screen.",
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="bg-primary p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const ReportingMetrics: Story = {
    render: () => (
        <>
            <p className="mb-4 text-sm text-secondary">
                Closest reference for{" "}
                <a href={prototypeHref("view-d")} target="_blank" rel="noreferrer" className="font-semibold text-brand-secondary">
                    Full performance in v4 ↗
                </a>
                . Charcoal header, light labels, metric rows, teal revenue and totals.{" "}
                <a href={storyHref("application-ui-table-102326-performance-insights--metrics")} target="_top" className="font-semibold text-brand-secondary">
                    Original design-system example
                </a>
                .
            </p>
            <DataTable />
        </>
    ),
};
export const SavedQueries: Story = {
    render: () => (
        <>
            <p className="mb-4 text-sm text-secondary">
                Library/list reference for{" "}
                <a href={prototypeHref("asset-view")} target="_blank" rel="noreferrer" className="font-semibold text-brand-secondary">
                    assets ↗
                </a>{" "}
                and{" "}
                <a href={prototypeHref("keyword-view")} target="_blank" rel="noreferrer" className="font-semibold text-brand-secondary">
                    keywords ↗
                </a>
                : charcoal header, linked names and circular row actions.{" "}
                <a
                    href={storyHref("application-ui-table-102326-performance-insights--saved-queries")}
                    target="_top"
                    className="font-semibold text-brand-secondary"
                >
                    Original design-system example
                </a>
                .
            </p>
            <SavedQueriesView />
        </>
    ),
};
export const Benchmarks: Story = {
    render: () => (
        <>
            <p className="mb-4 text-sm text-secondary">
                Closest app/metric reference for{" "}
                <a href={prototypeHref("keyword-health")} target="_blank" rel="noreferrer" className="font-semibold text-brand-secondary">
                    Keyword Health in v4 ↗
                </a>
                . Charcoal header, white labels, teal chevrons and striped metric rows.{" "}
                <a href={storyHref("application-ui-table-102326-benchmarks--metrics")} target="_top" className="font-semibold text-brand-secondary">
                    Original design-system example
                </a>
                .
            </p>
            <BenchmarksTable />
        </>
    ),
};
