import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Band, Bands, type FilterDim, FilterControl, type FilterState, filterExcluded } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const DIMS: FilterDim[] = [
    { id: "Platform", label: "Platform", values: ["iOS", "Android", "Unity"] },
    { id: "Geo", label: "Geo", values: ["United States", "Canada", "Mexico", "Other"] },
    { id: "Creative", label: "Creative", values: ["FallLaunch_Interstitial_Stadium", "FallLaunch_Interstitial_Jersey", "FallLaunch_Interstitial_Countdown"] },
];

const meta = {
    title: "Application UI/Nimbus Tokens/Filter Control",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`FilterControl` — Performance Insights' filter menu, replacing Round 4's DAS-only chips. **+ ADD** opens two panes — categories on the left, that category's values on the right with Clear Selections — then CANCEL / SAVE. Saved values sit in the Filters band as checkboxes you can toggle to compare (add iOS and Android, turn one off), and the ✕ at the far right clears every filter. A dimension can't be toggled down to nothing. `filterExcluded` turns the state into what to leave out of the data. Product, 26 Oct: “you're using a completely different filter UI here. Let's use this one, because we have it so many places in the UI … people are constantly comparing one platform to another.”",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const Example = ({ initial = {} }: { initial?: FilterState }) => {
    const [value, setValue] = useState<FilterState>(initial);
    const excluded = filterExcluded(DIMS, value);
    return (
        <>
            <Bands>
                <Band label="Filters">
                    <FilterControl dims={DIMS} value={value} onChange={setValue} />
                </Band>
            </Bands>
            <p className="text-md text-tertiary">
                Left out of the data:{" "}
                {Object.entries(excluded)
                    .filter(([, v]) => v.length)
                    .map(([d, v]) => `${d}: ${v.join(", ")}`)
                    .join(" · ") || "nothing"}
            </p>
        </>
    );
};

export const Empty: Story = {
    name: "Empty — + ADD",
    render: () => (
        <TokenPage>
            <Rule title="No filters yet" route="view-d">
                Click + ADD, pick a category and its values, then Save. Full performance in v5.
            </Rule>
            <Example />
        </TokenPage>
    ),
};

export const ComparingPlatforms: Story = {
    name: "Comparing platforms — one toggled off",
    render: () => (
        <TokenPage>
            <Rule title="iOS and Android chosen, Android toggled off">Toggle the checkboxes to flip between platforms; the ✕ on the right clears everything.</Rule>
            <Example initial={{ Platform: { values: ["iOS", "Android"], off: ["Android"] }, Geo: { values: ["United States", "Canada"], off: [] } }} />
        </TokenPage>
    ),
};
