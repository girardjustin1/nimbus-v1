import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordChipInput } from "../../../prototypes/das/v1/screens/keyword-targeting";
import { KeywordTargetBlock } from "../../../prototypes/das/v3/screens/keyword-target";
import { TargetBlock } from "../../../prototypes/das/v3/screens/search-select";
import { Compare } from "./note";
import { bySlug } from "./feedback";

/**
 * Prototype 3 · Targeting keywords.
 *
 * The library behind all three stories is the same fifty keywords, which is the point:
 * chips looked reasonable against five and stop being reasonable here.
 */
const item = bySlug("keyword-targeting");

const meta = {
    title: "Prototype 3/Keyword Targeting",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Harness = ({ children }: { children: (v: string[], set: (n: string[]) => void) => React.ReactNode }) => {
    const [value, setValue] = useState<string[]>(["sports", "over21"]);
    return <>{children(value, setValue)}</>;
};

/** What Round 2 shipped: chips in the field, no columns, no sense of scale. */
export const Original: Story = {
    name: "Round 2 · chips in the field",
    render: () => (
        <Compare item={item} kind="Original" title="Chips in the field">
            <div className="p-6">
                <Harness>
                    {(value, set) => (
                        <TargetBlock title="Keywords">
                            <KeywordChipInput value={value} onChange={set} />
                        </TargetBlock>
                    )}
                </Harness>
            </div>
        </Compare>
    ),
};

/**
 * A — the search is on the page.
 *
 * Fewest clicks, and what you are building stays visible while you build it. Costs
 * vertical space on a page that already has six other sections.
 */
export const InlineSearch: Story = {
    name: "A · search on the page",
    render: () => (
        <Compare item={item} quote={1} kind="A" title="Type-ahead on the page, chosen keywords in a table">
            <div className="p-6">
                <Harness>{(value, set) => <KeywordTargetBlock value={value} onChange={set} entry="inline" />}</Harness>
            </div>
        </Compare>
    ),
};

/**
 * B — the search is a modal.
 *
 * The section stays short whatever happens, and the modal has room for checkboxes, so
 * several keywords go in on one pass and commit with a button. That button is also the
 * answer to the other complaint on the call: that clicking away to commit is a weird
 * way to save.
 */
export const ModalSearch: Story = {
    name: "B · search in a modal",
    render: () => (
        <Compare item={item} quote={1} kind="B" title="Find keywords in a modal, chosen keywords in the same table">
            <div className="p-6">
                <Harness>{(value, set) => <KeywordTargetBlock value={value} onChange={set} entry="modal" />}</Harness>
            </div>
        </Compare>
    ),
};
