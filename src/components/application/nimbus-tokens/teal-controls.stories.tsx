import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { TealControls } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Teal Controls",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`TealControls` (and `tealControls` style) — checkboxes and radios as on staging, not the theme's pink: a ticked checkbox is a pale teal box with a teal-grey border and a teal check; a selected radio is a thin teal ring, a white gap and a solid teal dot. Those shapes now live in the base `Checkbox` and `RadioButton` (27 Oct), so they look the same everywhere; the wrapper still turns brand-coloured controls in its region teal. Pink buttons and toggles don't change. `Bands` apply it automatically. Product, 26 Oct: “the checkboxes are green, not pink … the radio has the exact same stroke fill, and when it's selected it gets the green dot.” Same typography for every checkbox and radio.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const ControlSet = () => (
    <div className="flex flex-wrap gap-12">
        <div className="flex flex-col gap-3">
            {["Spend", "Impressions", "eCPM"].map((m, i) => (
                <Checkbox key={m} size="md" label={<span className="text-md font-bold text-primary">{m}</span>} defaultSelected={i < 2} />
            ))}
        </div>
        <RadioGroup size="md" aria-label="Auction rule" defaultValue="guaranteed">
            <RadioButton value="guaranteed" label="Guaranteed Campaign" />
            <RadioButton value="cpm" label="CPM Priority" />
            <RadioButton value="fallback" label="Fallback" />
        </RadioGroup>
    </div>
);

export const Teal: Story = {
    render: () => (
        <TokenPage>
            <Rule title="Teal — Round 5" route="view-d">
                Checkboxes and radios across v5.
            </Rule>
            <TealControls>
                <ControlSet />
            </TealControls>
        </TokenPage>
    ),
};

export const ThemeDefault: Story = {
    name: "Theme default (pink) — for comparison",
    render: () => (
        <TokenPage>
            <Rule title="What the base components do on their own">Round 4's pink, kept here so the change is easy to see.</Rule>
            <ControlSet />
        </TokenPage>
    ),
};
