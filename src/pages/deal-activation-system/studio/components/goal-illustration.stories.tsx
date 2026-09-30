import type { Meta, StoryObj } from "@storybook/react-vite";
import type { GoalId } from "../studio-data";
import { GoalIllustration } from "./goal-illustration";

const labels: Record<GoalId, string> = {
    guaranteed: "Guaranteed delivery",
    priority: "Price priority",
    "always-on": "Always on",
    fallback: "Fill the gaps",
};

const meta = {
    title: "Imagery/Assets/Goal Illustrations",
    component: GoalIllustration,
    tags: ["autodocs"],
    args: { goal: "guaranteed", active: true },
    argTypes: {
        goal: { control: "inline-radio", options: ["guaranteed", "priority", "always-on", "fallback"] },
        active: { control: "boolean" },
    },
    parameters: {
        docs: {
            description: {
                component: "SVG illustrations used in the campaign goal picker. The active selection loops its animation; inactive illustrations remain still. Reduced-motion preferences show a still composition. Toggle Active to preview the selection behavior.",
            },
        },
    },
    render: (args) => (
        <figure className="w-80 max-w-full">
            <div className="aspect-[13/8] rounded-2xl bg-[#F9F7F3] p-4">
                <GoalIllustration {...args} />
            </div>
            <figcaption className="mt-3 text-center text-sm font-medium text-primary">{labels[args.goal]}</figcaption>
        </figure>
    ),
} satisfies Meta<typeof GoalIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuaranteedDelivery: Story = {};
export const PricePriority: Story = { args: { goal: "priority" } };
export const AlwaysOn: Story = { args: { goal: "always-on" } };
export const FillTheGaps: Story = { args: { goal: "fallback" } };
export const Static: Story = { args: { active: false } };
export const AllGoals: Story = {
    render: (args) => (
        <div className="flex flex-wrap gap-6">
            {(Object.keys(labels) as GoalId[]).map((goal) => (
                <figure key={goal} className="w-64 max-w-full">
                    <div className="aspect-[13/8] rounded-2xl bg-[#F9F7F3] p-3">
                        <GoalIllustration goal={goal} active={args.active} />
                    </div>
                    <figcaption className="mt-3 text-center text-sm font-medium text-primary">{labels[goal]}</figcaption>
                </figure>
            ))}
        </div>
    ),
};
