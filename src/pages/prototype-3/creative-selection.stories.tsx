import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssetPicker } from "../../../prototypes/das/v3/screens/asset-picker";
import { CreativeTargetBlock } from "../../../prototypes/das/v3/screens/creative-target";
import type { Creative } from "../../../prototypes/das/v1/screens/setup-data";
import { Compare } from "./note";
import { bySlug } from "./feedback";

/**
 * Prototype 3 · Adding creatives.
 *
 * The question these three answer is where the preview belongs. It is genuinely useful
 * and genuinely cannot be rendered a hundred and fifty times, so the proposals keep it
 * and bound it by the search instead.
 */
const item = bySlug("creative-selection");

const meta = {
    title: "Prototype 3/Creative Selection",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const START: Creative[] = [{ name: "SampleApp_Interstitial_A", type: "HTML", size: "Full screen" }];

const Harness = ({ children }: { children: (v: Creative[], set: (n: Creative[]) => void) => React.ReactNode }) => {
    const [value, setValue] = useState<Creative[]>(START);
    return <>{children(value, setValue)}</>;
};

/**
 * What Round 2 shipped: a grid of every asset, each tile running its format animation.
 * Good for twelve assets. The library this is really pointed at has about 150.
 */
export const Original: Story = {
    name: "Round 2 · browse a grid of previews",
    render: () => (
        <Compare item={item} kind="Original" title="Every asset, every preview, all at once">
            <div className="relative min-h-[520px]">
                <AssetPicker chosen={START} returnHref="#/setup-ready" onClose={() => {}} onAdd={() => {}} />
            </div>
        </Compare>
    ),
};

/** A — type-ahead on the page; previews render only on what the search matched. */
export const InlineSearch: Story = {
    name: "A · search on the page",
    render: () => (
        <Compare item={item} quote={1} kind="A" title="Type-ahead on the page, previews only on matches">
            <div className="p-6">
                <Harness>{(value, set) => <CreativeTargetBlock value={value} onChange={set} entry="inline" />}</Harness>
            </div>
        </Compare>
    ),
};

/** B — the same search behind a button, with checkboxes for taking several at once. */
export const ModalSearch: Story = {
    name: "B · search in a modal",
    render: () => (
        <Compare item={item} quote={1} kind="B" title="Find creatives in a modal, previews only on matches">
            <div className="p-6">
                <Harness>{(value, set) => <CreativeTargetBlock value={value} onChange={set} entry="modal" />}</Harness>
            </div>
        </Compare>
    ),
};
