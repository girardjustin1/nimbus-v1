import type { Meta, StoryObj } from "@storybook/react-vite";
import { studioPresets } from "../studio-data";
import { ReviewHero, ReviewSections } from "./review-summary";

/** Studio · Review summary — hero card with a small render, then one section per step. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Review Summary" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = { render: () => <ReviewHero draft={studioPresets.sample} previewHref="#" /> };
export const Sections: Story = { render: () => <ReviewSections draft={studioPresets.sample} hrefFor={() => "#"} /> };
export const SectionsWithProblems: Story = {
    render: () => <ReviewSections draft={studioPresets.incomplete} hrefFor={() => "#"} problemsFor={(s) => (s === "budget" ? ["Pick an end date"] : s === "creative" ? ["Upload an image"] : [])} />,
};
