import type { Meta, StoryObj } from "@storybook/react";
import { KeyMetricsDashboardScreen } from "./key-metrics-dashboard";

const meta = {
    title: "Archive/App Screens/Key Metrics Dashboard",
    component: KeyMetricsDashboardScreen,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof KeyMetricsDashboardScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
