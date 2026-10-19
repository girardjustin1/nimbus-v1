import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullPerformance } from "../../../../prototypes/das/v4/screens/full-performance";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · how keywords report on Full performance.
 *
 * 19 Oct: keywords match on ANY, so each keyword reports on its own — and on screen.
 * Product chose A ("the harder design") over the charter's CSV-only guardrail; B stays
 * here as the record. Shown on Over 21 Midwest, which targets two keywords.
 */
const meta = {
    title: "Oct 17/Concepts/Keyword Reporting",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("keyword-reporting");

export const OnScreen: Story = {
    name: "A · On screen — chosen",
    render: () => (
        <Compare item={item} quote={2} kind="Chosen" title="A · Keyword is a breakdown like any other: one row per keyword, pivot it against platform">
            <FullPerformance id="c3" breakdown={["Keyword", "Platform"]} />
        </Compare>
    ),
};

export const CsvOnly: Story = {
    name: "B · CSV only (the charter) — not chosen",
    render: () => (
        <Compare item={item} quote={1} kind="B" title="Keyword can't be picked on screen; per-keyword figures come from Download by keyword .CSV">
            <FullPerformance id="c3" breakdown={["Platform"]} keywordMode="csv" />
        </Compare>
    ),
};
