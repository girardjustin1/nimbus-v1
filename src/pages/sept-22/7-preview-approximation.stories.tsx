import type { Meta, StoryObj } from "@storybook/react-vite";
import { items } from "./feedback";
import { BeforeAfter, ReviewPage } from "./review-note";
import { PreviewCaptionAfter, PreviewCaptionBefore } from "./revised/preview-caption";

/**
 * Sept 22 · 7 — the device preview says it is an approximation.
 *
 * The concept stays. What changes is what it claims, so a publisher does not read a
 * difference on a real handset as a bug.
 */
const meta = {
    title: "Sept 22/7 Preview is an approximation",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A claim of accuracy, then an explicit approximation with the reason attached. */
export const BeforeAndAfter: Story = {
    name: "Preview caption · before and after",
    render: () => (
        <ReviewPage item={items[6]}>
            <BeforeAfter
                before={
                    <div className="flex justify-center py-6">
                        <PreviewCaptionBefore />
                    </div>
                }
                after={
                    <div className="flex justify-center py-6">
                        <PreviewCaptionAfter />
                    </div>
                }
                note="This caption sits under the device frame in the full-screen preview. It is the only part of that screen that changes."
            />
        </ReviewPage>
    ),
};
