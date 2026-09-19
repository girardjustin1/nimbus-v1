import type { Meta, StoryObj } from "@storybook/react-vite";
import { auctionFunnel } from "../chart-data";
import { ChartCard } from "../chart-kit";
import { Funnel } from "../reporting-charts";

/** Funnel (Nimbus extra) — where requests drop out on the way to an impression. */
const meta = { title: "Performance Insights/Charts/Funnel", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const AuctionFunnel: Story = {
    render: () => (
        <ChartCard title="Auction funnel" subtitle="Last 7 days · all apps" value="35%" change={0.012} className="max-w-3xl">
            <Funnel stages={auctionFunnel} />
        </ChartCard>
    ),
};
