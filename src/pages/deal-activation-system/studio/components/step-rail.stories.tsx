import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepRail } from "./step-rail";

/** Studio · Step rail — nested Deal › Campaign › Creative outline with done, current, to-do and error states. */
const meta = {
    title: "Deal Activation System/Studio Concept/Components/Step Rail",
    component: StepRail,
    args: { current: "budget", states: { goal: "done", deal: "done", audience: "done" }, dealName: "Summit Sportswear — Fall Launch", campaignName: "Fall Launch · Sports fans" },
    decorators: [(Story) => <div className="w-56">{Story()}</div>],
} satisfies Meta<typeof StepRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {};
export const Start: Story = { args: { current: "goal", states: {}, dealName: "", campaignName: "" } };
export const WithErrors: Story = { args: { current: "review", states: { goal: "done", deal: "done", audience: "done", budget: "error", creative: "error" } } };
