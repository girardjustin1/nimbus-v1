import type { Meta, StoryObj } from "@storybook/react-vite";
import { allPresets } from "../../../../prototypes/das/v1/screens/setup-data";
import { ReviewModal } from "../../../../prototypes/das/v3/screens/campaign-setup";
import { Surface } from "./harness";

/**
 * Review modal — what the check came back with, then Publish or Publish & Duplicate.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Rail/Review Modal",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing blocking, with what's worth knowing. */
export const Default: Story = {
    name: "Ready to publish",
    render: () => (
        <Surface className="min-h-[720px]">
            <ReviewModal form={allPresets.ready} onCancel={() => {}} onPublish={() => {}} onPublishDuplicate={() => {}} />
        </Surface>
    ),
};
