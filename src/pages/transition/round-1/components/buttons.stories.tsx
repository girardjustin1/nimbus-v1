import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ChevronUp } from "@untitledui/icons";
import { StateAction as StateActionV1, UiControlButton as UiControlButtonV1 } from "../../../../../prototypes/app/v1/screens/nimbus-ui";
import { Button as ButtonV1 } from "../../../../../prototypes/app/v1/screens/type-rules";
import { StateAction as StateActionV2, UiControlButton as UiControlButtonV2 } from "../../../../../prototypes/app/v2/screens/nimbus-ui";
import { Button as ButtonV2 } from "../../../../../prototypes/app/v2/screens/type-rules";
import { BeforeAfter, Caption, V2Scope } from "./frame";

/**
 * Round 1 · Components · Buttons (R1-09, R1-10).
 * The pink action button (on and off), the grey UI control button, and the design-system
 * Button as the app wraps it.
 */
const meta = {
    title: "Transition/Round 1/Components/Buttons",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-09", "R1-10"];
const noop = () => {};

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div>
        <Caption>{label}</Caption>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
);

const V1 = () => (
    <div className="flex flex-col gap-6">
        <Row label="StateAction">
            <StateActionV1 onPress={noop}>Download .CSV</StateActionV1>
            <StateActionV1 onPress={noop} disabled>
                Save Query
            </StateActionV1>
            <StateActionV1 onPress={noop} quiet>
                Cancel
            </StateActionV1>
        </Row>
        <Row label="UiControlButton">
            <UiControlButtonV1 icon={ChevronUp} onPress={noop}>
                Collapse
            </UiControlButtonV1>
        </Row>
        <Row label="Button (design system, as the app wraps it)">
            <ButtonV1 color="primary-pink" className="uppercase">
                Save
            </ButtonV1>
            <ButtonV1 color="secondary" className="uppercase">
                Cancel
            </ButtonV1>
        </Row>
    </div>
);

const V2 = () => (
    <V2Scope>
        <div className="flex flex-col gap-6">
            <Row label="StateAction">
                <StateActionV2 onPress={noop}>Download .CSV</StateActionV2>
                <StateActionV2 onPress={noop} disabled>
                    Save Query
                </StateActionV2>
                <StateActionV2 onPress={noop} quiet>
                    Cancel
                </StateActionV2>
            </Row>
            <Row label="UiControlButton">
                <UiControlButtonV2 icon={ChevronUp} onPress={noop}>
                    Collapse
                </UiControlButtonV2>
            </Row>
            <Row label="Button (design system, as the app wraps it)">
                <ButtonV2 color="primary-pink" className="uppercase">
                    Save
                </ButtonV2>
                <ButtonV2 color="secondary" className="uppercase">
                    Cancel
                </ButtonV2>
            </Row>
        </div>
    </V2Scope>
);

/** R1-09, R1-10 in v1: 15px bold upper case text, 40px tall. */
export const Before: Story = { render: () => <V1 /> };

/** R1-09, R1-10 in v2: staging's 13px, weight 800, 0.75px upper case text, 33px tall, the label centred. */
export const After: Story = { render: () => <V2 /> };

/** R1-09, R1-10: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    parameters: { layout: "fullscreen" },
    render: () => <BeforeAfter ids={IDS} before={<V1 />} after={<V2 />} />,
};
