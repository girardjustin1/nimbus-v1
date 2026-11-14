import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordDetail } from "../../../../prototypes/app/v1/screens/keyword-detail";
import { KeywordSetup, ViewAllKeywords } from "../../../../prototypes/app/v1/screens/keyword-library-v3";

/** November 13th, 2026 · Deal Activation System · Manage keywords — from DAS Round 6, unchanged. */
const meta = {
    title: "November 13th, 2026/Deal Activation System/Manage keywords",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** View All Keywords. */
export const Default: Story = { render: () => <ViewAllKeywords /> };

/** Keyword Setup. */
export const KeywordSetupForm: Story = { name: "Keyword setup", render: () => <KeywordSetup /> };

/** One keyword's detail: its campaigns and history. */
export const Detail: Story = { render: () => <KeywordDetail id="k1" /> };
