import type { Meta, StoryObj } from "@storybook/react-vite";
import { BenchmarkRankExamples, BenchmarksTable } from "@/pages/app-screens/nimbus-benchmarks";

const meta = {
    title: "Application UI/Table/102326/Benchmarks",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Dark-header benchmark metrics, plus the two ranked definition lists used by the leaderboard. The lists are table-like content, not semantic tables. These examples render the components and fixtures used by App Screens, without page navigation.",
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen overflow-x-auto bg-primary p-4 md:p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Metrics: Story = { render: () => <BenchmarksTable /> };
export const Leaderboard: Story = { render: () => <BenchmarkRankExamples /> };
