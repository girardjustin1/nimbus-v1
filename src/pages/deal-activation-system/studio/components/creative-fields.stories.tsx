import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Creative, type FormatId, emptyCreative, sampleCreative } from "../studio-data";
import { AdPreview } from "./ad-preview";
import { CreativeFields } from "./creative-fields";

/** Studio · Creative fields — uploads and message, shown here next to the live preview they drive. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Creative Fields" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ format, initial, errors }: { format: FormatId; initial: Creative; errors?: Record<string, string> }) => {
    const [c, setC] = useState(initial);
    return (
        <div className="flex items-start gap-8">
            <div className="max-w-xl flex-1">
                <CreativeFields format={format} value={c} onChange={(p) => setC((x) => ({ ...x, ...p }))} errors={errors} />
            </div>
            <AdPreview format={format} creative={c} />
        </div>
    );
};
export const Filled: Story = { render: () => <Demo format="interstitial" initial={sampleCreative} /> };
export const Empty: Story = { render: () => <Demo format="interstitial" initial={emptyCreative} /> };
export const RewardedVideo: Story = { render: () => <Demo format="rewarded" initial={sampleCreative} /> };
export const Errors: Story = { render: () => <Demo format="native" initial={emptyCreative} errors={{ brand: "Add the advertiser name", media: "Upload an image" }} /> };
