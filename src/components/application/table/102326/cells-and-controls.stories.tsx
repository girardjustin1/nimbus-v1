import type { Meta, StoryObj } from "@storybook/react-vite";
import { CapCell } from "@/pages/app-screens/manage-active-demand";
import { MiniPill, RemoveButton, StatusCell } from "@/pages/app-screens/manage-assets";
import { RowAction } from "@/pages/app-screens/saved-queries";

const meta = {
    title: "Application UI/Table/102326/Cells and Controls",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "The actual cell components used in App Screens. Inputs edit locally; save, remove, copy and test actions are illustrative. Enable toggles and sort headers can be inspected in the complete table examples.",
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="flex flex-wrap items-center gap-8 bg-primary p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const CampaignStatuses: Story = {
    render: () => (
        <>
            <StatusCell status="Running" />
            <StatusCell status="Paused" />
            <StatusCell status="Waiting" />
        </>
    ),
};
export const ImpressionCaps: Story = {
    render: () => (
        <>
            <CapCell cap={{ type: "add" }} />
            <CapCell cap={{ type: "change", value: "72" }} />
            <CapCell cap={{ type: "save", value: "10,000" }} />
        </>
    ),
};
export const CampaignActions: Story = {
    render: () => (
        <>
            <MiniPill>Save</MiniPill>
            <MiniPill color="blue">Copy Test Link</MiniPill>
            <MiniPill>Test Asset</MiniPill>
            <RemoveButton />
        </>
    ),
};
const report = { id: "audit-report", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data" };
export const ReportActions: Story = {
    render: () => (
        <>
            <RowAction row={{ ...report, isDelete: true }} />
            <RowAction row={{ ...report, isDelete: false }} />
        </>
    ),
};
