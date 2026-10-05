import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AdUnitType } from "../../../../prototypes/das/v1/screens/das-data";
import { AdUnitGuideModal, AdUnitHelp, AdUnitTypeFieldV3 } from "../../../../prototypes/das/v3/screens/ad-unit";
import { TargetModule } from "../../../../prototypes/das/v3/screens/targeting-section";
import { Surface, Value } from "./harness";

/**
 * Ad Unit — the publisher's four ad unit types as checkbox cards, two across. The ? opens a guide to each.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Targeting/Ad Unit",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing ticked — at least one is required. */
export const NoneSelected: Story = {
    name: "None selected",
    render: () => (
        <Surface>
            <Value<AdUnitType[]> initial={[]}>{(v, set) => (
                    <TargetModule title="Ad Unit" help={<AdUnitHelp />}>
                        <AdUnitTypeFieldV3 value={v} onChange={set} />
                    </TargetModule>
                )}</Value>
        </Surface>
    ),
};

/** Interstitial ticked. */
export const Selected: Story = {
    name: "Selected",
    render: () => (
        <Surface>
            <Value<AdUnitType[]> initial={["Interstitial"]}>{(v, set) => (
                    <TargetModule title="Ad Unit" help={<AdUnitHelp />}>
                        <AdUnitTypeFieldV3 value={v} onChange={set} />
                    </TargetModule>
                )}</Value>
        </Surface>
    ),
};

/** The guide the ? opens: what each unit looks like in an app. */
export const Guide: Story = {
    name: "Guide",
    render: () => (
        <div className="min-h-[900px]">
            <AdUnitGuideModal onClose={() => {}} />
        </div>
    ),
};
