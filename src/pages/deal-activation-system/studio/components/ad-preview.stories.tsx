import type { Meta, StoryObj } from "@storybook/react-vite";
import { emptyCreative, sampleCreative } from "../studio-data";
import { AdPreview } from "./ad-preview";

/** Studio · Ad preview — the creative rendered in a device running a sample app, per format and moment. */
const meta = {
    title: "Deal Activation System/Studio Concept/Components/Ad Preview",
    component: AdPreview,
    args: { format: "interstitial", creative: sampleCreative, device: "phone", moment: "default" },
    argTypes: {
        format: { control: "inline-radio", options: ["banner", "interstitial", "rewarded", "native"] },
        device: { control: "inline-radio", options: ["phone", "tablet"] },
        moment: { control: "inline-radio", options: ["default", "mrec", "end-card"] },
    },
} satisfies Meta<typeof AdPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interstitial: Story = {};
export const Banner: Story = { args: { format: "banner" } };
export const MediumRectangle: Story = { args: { format: "banner", moment: "mrec" } };
export const RewardedPlaying: Story = { args: { format: "rewarded" } };
export const RewardedEndCard: Story = { args: { format: "rewarded", moment: "end-card" } };
export const Native: Story = { args: { format: "native" } };
export const Tablet: Story = { args: { device: "tablet" } };
export const EmptyCreative: Story = { args: { creative: emptyCreative } };
export const AllFormats: Story = {
    render: () => (
        <div className="flex flex-wrap gap-6">
            {(["banner", "interstitial", "rewarded", "native"] as const).map((f) => (
                <AdPreview key={f} format={f} creative={sampleCreative} scale={0.8} />
            ))}
        </div>
    ),
};
