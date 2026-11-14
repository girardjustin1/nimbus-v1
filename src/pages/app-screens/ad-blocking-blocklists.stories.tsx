import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdBlockingBlocklistsScreen } from "./ad-blocking-blocklists";

const meta = {
    title: "Archive/App Screens/Ad Blocking – Blocklists",
    component: AdBlockingBlocklistsScreen,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof AdBlockingBlocklistsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Detailed Ad Blocking variant: four stacked OpenRTB block-list sections
 * (bcat / badv / badv-domains / bapp), each with a Download .CSV action, a
 * search / block input row, a data table with an "Unblock all" pill and per-row
 * "✕ Unblock" actions, and a centered "Load all" pill.
 */
export const Default: Story = {};
