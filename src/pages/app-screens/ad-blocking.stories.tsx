import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdBlockingScreen } from "./ad-blocking";

const meta = {
    title: "Archive/App Screens/Ad Blocking",
    component: AdBlockingScreen,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof AdBlockingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * AdOps → Ad Blocking dashboard: Global Nav + reusable block-list sections
 * (Blocked Categories / Advertisers / Applications) built from Untitled UI
 * Table, Input and Button components with the Nimbus theme.
 */
export const Default: Story = {};
