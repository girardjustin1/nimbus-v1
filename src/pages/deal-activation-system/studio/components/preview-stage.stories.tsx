import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleCreative } from "../studio-data";
import { PreviewStage } from "./preview-stage";

/** Studio · Preview stage — full-screen final render with device switch and moments. */
const meta = {
    title: "Deal Activation System/Studio Concept/Components/Preview Stage",
    component: PreviewStage,
    parameters: { layout: "fullscreen" },
    args: { format: "interstitial", creative: sampleCreative, title: "Fall Launch · Sports fans" },
} satisfies Meta<typeof PreviewStage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interstitial: Story = {};
export const Tablet: Story = { args: { initialDevice: "tablet" } };
export const BannerMoments: Story = { args: { format: "banner" } };
export const RewardedEndCard: Story = { args: { format: "rewarded", initialMoment: 1 } };
export const Processing: Story = { args: { format: "native", status: "processing" } };
