import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullPerformance } from "../../../../prototypes/das/v4/screens/full-performance";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · how keywords report on Full performance. It depends on how they match, which
 * the charter does not settle (see the note). Shown on Over 21 Midwest, which targets two.
 */
const meta = {
    title: "Oct 17/Concepts/Keyword Reporting",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("keyword-reporting");

export const AsOneSet: Story = {
    name: "A · The campaign's keywords as one set",
    render: () => (
        <Compare item={item} kind="A" title="All-or-nothing: “over21 + midwest” is one row. Pivot it against platform, geo or creative. Inside the charter's guardrail">
            <FullPerformance id="c3" breakdown={["Keywords", "Platform"]} keywordMode="set" />
        </Compare>
    ),
};

export const OneByOne: Story = {
    name: "B · Each keyword on its own",
    render: () => (
        <Compare item={item} quote={1} kind="B" title="ANY matching: each keyword is a row and a line. The charter keeps this to CSV and the API at launch">
            <FullPerformance id="c3" breakdown={["Keywords"]} keywordMode="each" />
        </Compare>
    ),
};
