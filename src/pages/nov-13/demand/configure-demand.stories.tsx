import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfigureDemand, ConfigurePartner } from "../../../../prototypes/app/v1/screens/demand/configure-demand";
import { ERROR_PARTNER } from "../../../../prototypes/app/v1/screens/demand/demand-data";

/** Demand → configure demand: the partner list, one partner's configuration, and its error state. */
const meta = {
    title: "November 13th, 2026/Demand/Configure Demand",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.12.10 PM" — the partner list. */
export const Default: Story = { render: () => <ConfigureDemand /> };

/** Rebuilds "Screenshot 2026-11-13 at 9.12.23 PM" — a partner's configuration form. */
export const PartnerConfiguration: Story = { name: "Partner configuration", render: () => <ConfigurePartner /> };

/** Rebuilds "Screenshot 2026-11-13 at 9.12.16 PM" — a partner with no demand template. */
export const ErrorState: Story = { name: "Error", render: () => <ConfigurePartner partner={ERROR_PARTNER} /> };
