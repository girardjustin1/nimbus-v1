import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlobalNav } from "./global-nav";

const meta = {
    title: "Design System/Application UI/App Navigation - Sidebar",
    component: GlobalNav,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The Nimbus sidebar app navigation — a collapsible dark rail (280px ↔ 64px) with a static, icon-backed Reporting section, collapsible text sections, a teal active indicator, NEW/PRO badges, and a footer. Data-driven via `config.ts`; state (collapse, open sections, active item) is managed locally. See the **Expanded**, **Collapsed**, and **Nav Only** stories below.",
            },
        },
    },
    argTypes: {
        defaultActiveKey: { control: "text" },
        defaultCollapsed: { control: "boolean" },
        defaultAllExpanded: { control: "boolean" },
    },
} satisfies Meta<typeof GlobalNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nav mounted against a light page frame, matching the reference layout. */
const PageFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        {children}
        <main className="flex-1 p-12">
            <h1 className="text-display-xs font-semibold text-primary capitalize">Performance insights</h1>
            <p className="mt-2 max-w-xl text-md text-tertiary">
                Click the chevron on the edge of the nav to collapse / expand. Click any item to switch the active row.
            </p>
        </main>
    </div>
);

export const Expanded: Story = {
    args: {
        defaultActiveKey: "performance insights",
        defaultCollapsed: false,
    },
    render: (args) => (
        <PageFrame>
            <GlobalNav {...args} />
        </PageFrame>
    ),
};

export const Collapsed: Story = {
    args: {
        defaultActiveKey: "performance insights",
        defaultCollapsed: true,
    },
    render: (args) => (
        <PageFrame>
            <GlobalNav {...args} />
        </PageFrame>
    ),
};

/** The bare nav with every section expanded — shows all menu items at once. */
export const AllMenuItems: Story = {
    args: {
        defaultActiveKey: "key metrics",
        defaultAllExpanded: true,
    },
};
