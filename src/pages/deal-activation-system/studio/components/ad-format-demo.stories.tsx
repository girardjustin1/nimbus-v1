import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdFormatDemo } from "./ad-format-demo";

const meta = {
    title: "Imagery/Assets/Ad Formats",
    component: AdFormatDemo,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: "Animated SVG previews of the consumer app experience for each ad format. Use the device and moment controls to explore phone, tablet, medium rectangle, and reward end-card variants. Pause and replay controls are included; reduced-motion preferences show a still composition.",
            },
        },
    },
    args: { format: "banner", device: "phone", moment: "default" },
    argTypes: {
        format: { control: "inline-radio", options: ["banner", "interstitial", "rewarded", "native"] },
        device: { control: "inline-radio", options: ["phone", "tablet"] },
        moment: { control: "inline-radio", options: ["default", "mrec", "end-card"] },
    },
} satisfies Meta<typeof AdFormatDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Banner: Story = {};
export const Interstitial: Story = { args: { format: "interstitial" } };
export const RewardedVideo: Story = { args: { format: "rewarded" } };
export const Native: Story = { args: { format: "native" } };
export const MediumRectangle: Story = { args: { moment: "mrec" } };
export const RewardedEndCard: Story = { args: { format: "rewarded", moment: "end-card" } };
export const AllFormats: Story = {
    render: () => (
        <div className="flex flex-wrap gap-8">
            {(["banner", "interstitial", "rewarded", "native"] as const).map((format) => (
                <AdFormatDemo key={format} format={format} scale={0.8} />
            ))}
        </div>
    ),
};
