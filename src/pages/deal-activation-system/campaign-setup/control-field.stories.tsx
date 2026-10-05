import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/base/input/input";
import { Field } from "../../../../prototypes/das/v3/screens/das-shell";
import { Surface } from "./harness";

/**
 * Field — label, then the instruction, then the control (staging's order). Errors go under the control.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Field",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The common case. */
export const Default: Story = {
    name: "Label and instruction",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <Field label="Deal Name" hint="How you'll find this deal later.">
                    <Input aria-label="Deal Name" size="md" placeholder="e.g. Autumn Drive" />
                </Field>
            </div>
        </Surface>
    ),
};

/** With the required mark. */
export const Required: Story = {
    name: "Required",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <Field label="Deal ID" required hint="Must be unique across your deals.">
                    <Input aria-label="Deal ID" size="md" placeholder="e.g. D-11204" isRequired />
                </Field>
            </div>
        </Surface>
    ),
};

/** The error sits under the control, not where the instruction is. */
export const WithError: Story = {
    name: "With error",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <Field label="Deal Name" required hint="How you'll find this deal later.">
                    <Input aria-label="Deal Name" size="md" isRequired isInvalid hint="Name the deal" />
                </Field>
            </div>
        </Surface>
    ),
};
