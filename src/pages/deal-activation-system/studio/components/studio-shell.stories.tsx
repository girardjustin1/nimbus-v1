import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepRail } from "./step-rail";
import { StudioShell } from "./studio-shell";

/** Studio · Shell — focused full-screen frame: top bar, step rail, form, optional right panel, sticky footer. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Studio Shell", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = ({ label, h = "h-96" }: { label: string; h?: string }) => (
    <div className={`flex ${h} items-center justify-center rounded-2xl border border-dashed border-secondary text-sm text-tertiary`}>{label}</div>
);

export const WithPanel: Story = {
    render: () => (
        <StudioShell title="New deal campaign" rail={<StepRail current="audience" states={{ goal: "done", deal: "done" }} />} aside={<Placeholder label="Right panel" h="h-72" />} backHref="#" nextHref="#" footerNote="Step 3 of 6">
            <Placeholder label="Form" />
        </StudioShell>
    ),
};
export const FormOnly: Story = {
    render: () => (
        <StudioShell title="New deal campaign" rail={<StepRail current="goal" states={{}} />} nextHref="#" footerNote="Step 1 of 6">
            <Placeholder label="Form" />
        </StudioShell>
    ),
};
