import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocusignAccountScreen, DocusignAddContractScreen } from "./docusign-contracts";

const meta = {
    title: "Archive/App Screens/Add DocuSign Contracts",
    component: DocusignAccountScreen,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof DocusignAccountScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Your Account" — integrated demand partners overview with the contract
 * management actions (Download ads.txt / SKAN IDs, Add N+ Contract, Add Demand
 * Sources) and the Third-Party Viewability section.
 */
export const Default: Story = {};

/**
 * "Add a Docusign Contract" — the form reached from Demand → Add Nimbus
 * Contract, with signatory + completed Docusign links + date-signed fields and
 * the pink Save action.
 */
export const AddContract: Story = {
    render: () => <DocusignAddContractScreen />,
};
