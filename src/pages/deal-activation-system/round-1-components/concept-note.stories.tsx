import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConceptNote } from "../das-shell";

/** Review annotation shown at the top of every concept screen. Not product UI. */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Components/Concept Note",
    component: ConceptNote,
    args: {
        label: "Concept A",
        title: "One-page setup with a live summary rail",
        notes: ["The five wizard steps become five sections on one page.", "Publish checks everything and flags problems in place."],
    },
} satisfies Meta<typeof ConceptNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
