import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    ManageActiveDemandActionNeeded,
    ManageActiveDemandAppAdsTxtDownload,
    ManageActiveDemandAppAdsTxtErrors,
    ManageActiveDemandErrorModal,
    ManageActiveDemandIntegratedPartners,
} from "./manage-active-demand";

const meta = {
    title: "Archive/App Screens/Manage Active Demand",
    component: ManageActiveDemandActionNeeded,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ManageActiveDemandActionNeeded>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default landing view: three stacked "Action Needed" error rows (App-Ads.txt,
 * ManagerDomain, OwnerDomain), each with a description and a pink fix button.
 */
export const ActionNeeded: Story = {};

/**
 * App-Ads.txt error modal — an amber warning featured icon, body copy, and a
 * full-width pink "Fix App-Ads.txt" button, shown over a dimmed screen.
 */
export const ErrorModal: StoryObj = {
    render: () => <ManageActiveDemandErrorModal />,
};

/**
 * Manage App-Ads.txt — Download tab. A monospace code block (with line numbers)
 * listing the account's ads.txt entries, plus a pink download button.
 */
export const ManageAppAdsTxtDownload: StoryObj = {
    render: () => <ManageActiveDemandAppAdsTxtDownload />,
};

/**
 * Manage App-Ads.txt — Errors tab. Three report sections (missing lines,
 * ManagerDomain, OwnerDomain), each with a code block and a copy button.
 */
export const ManageAppAdsTxtErrors: StoryObj = {
    render: () => <ManageActiveDemandAppAdsTxtErrors />,
};

/**
 * 10 Integrated Demand Partners table — status dots (Running/Capped/Paused),
 * enable toggles, editable impression caps, demand type, and placement links.
 */
export const IntegratedDemandPartners: StoryObj = {
    render: () => <ManageActiveDemandIntegratedPartners />,
};
