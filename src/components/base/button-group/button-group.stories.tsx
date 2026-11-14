import { BarChart01, List, Menu02, Rows01 } from "@untitledui/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";

/**
 * Components → Button Group
 * A single-select segmented control built on React Aria's ToggleButtonGroup.
 * The Nimbus theme styles the selected/hover states globally.
 */
const meta = {
    title: "Design System/Base Components/Button Group",
    component: ButtonGroup,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
    args: { size: "md" },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["12m"]}>
            <ButtonGroupItem id="12m">12 months</ButtonGroupItem>
            <ButtonGroupItem id="30d">30 days</ButtonGroupItem>
            <ButtonGroupItem id="7d">7 days</ButtonGroupItem>
            <ButtonGroupItem id="24h">24 hours</ButtonGroupItem>
        </ButtonGroup>
    ),
};

/** Items with a leading icon. */
export const WithIcons: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["list"]}>
            <ButtonGroupItem id="list" iconLeading={List}>
                List
            </ButtonGroupItem>
            <ButtonGroupItem id="rows" iconLeading={Rows01}>
                Rows
            </ButtonGroupItem>
            <ButtonGroupItem id="chart" iconLeading={BarChart01}>
                Chart
            </ButtonGroupItem>
        </ButtonGroup>
    ),
};

/** Icon-only items render as square buttons. */
export const IconOnly: Story = {
    render: (args) => (
        <ButtonGroup {...args} defaultSelectedKeys={["grid"]}>
            <ButtonGroupItem id="list" iconLeading={List} aria-label="List view" />
            <ButtonGroupItem id="grid" iconLeading={Menu02} aria-label="Grid view" />
            <ButtonGroupItem id="rows" iconLeading={Rows01} aria-label="Row view" />
        </ButtonGroup>
    ),
};

/** All three sizes. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <ButtonGroup key={size} size={size} defaultSelectedKeys={["month"]}>
                    <ButtonGroupItem id="week">Week</ButtonGroupItem>
                    <ButtonGroupItem id="month">Month</ButtonGroupItem>
                    <ButtonGroupItem id="year">Year</ButtonGroupItem>
                </ButtonGroup>
            ))}
        </div>
    ),
};
