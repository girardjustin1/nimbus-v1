import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordLibrary } from "./keyword-library";

/**
 * Deal Activation System → Keyword Library (proposed new page).
 *
 * Where publishers create, edit and delete the keywords their campaigns target.
 */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Keyword Library",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The library with usage, live-campaign counts and traffic signal per keyword. */
export const Default: Story = { render: () => <KeywordLibrary /> };

/** Bulk add: paste one per line or comma-separated; duplicates and traffic suggestions shown. */
export const AddKeywords: Story = { render: () => <KeywordLibrary view="add" /> };

/** Deleting a keyword used by a live campaign shows the impact before anything changes. */
export const DeleteInUseKeyword: Story = { name: "Delete keyword in use", render: () => <KeywordLibrary view="delete" /> };

/** First run: what keywords are, the RTB field the app sends, and suggestions from traffic. */
export const EmptyState: Story = { render: () => <KeywordLibrary view="empty" /> };
