import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChartSquare02, Grid01, Settings01, Users01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";

/**
 * Application UI → Tabs
 *
 * Nimbus-themed tabs. The theme is applied globally, so the selected/hover
 * states pick up the Nimbus teal brand automatically. The `type` prop on
 * `Tabs.List` switches between the supported horizontal styles.
 */

const items = [
    { id: "overview", label: "Overview", icon: Grid01, badge: undefined as number | undefined },
    { id: "analytics", label: "Analytics", icon: BarChartSquare02, badge: 4 },
    { id: "members", label: "Members", icon: Users01, badge: 12 },
    { id: "settings", label: "Settings", icon: Settings01, badge: undefined },
];

const panels: Record<string, string> = {
    overview: "A high-level summary of your workspace activity and recent updates.",
    analytics: "Charts and metrics tracking performance over the current quarter.",
    members: "Manage the people in your workspace and their access levels.",
    settings: "Configure workspace preferences, billing, and integrations.",
};

const Panels = () => (
    <>
        {items.map((item) => (
            <Tabs.Panel key={item.id} id={item.id} className="pt-5 text-sm text-tertiary">
                {panels[item.id]}
            </Tabs.Panel>
        ))}
    </>
);

const type = ["button-brand", "button-gray", "button-border", "button-minimal", "underline"] as const;

const meta = {
    title: "Design System/Application UI/Tabs",
    component: Tabs,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default brand-button tabs with icons, labels, and count badges. */
export const Default: Story = {
    render: () => (
        <Tabs defaultSelectedKey="overview">
            <Tabs.List type="button-brand" items={items}>
                {(item) => <Tabs.Item id={item.id} label={item.label} icon={item.icon} badge={item.badge} />}
            </Tabs.List>
            <Panels />
        </Tabs>
    ),
};

/** All supported horizontal tab styles, stacked for comparison. */
export const Types: Story = {
    render: () => (
        <div className="flex flex-col gap-10">
            {type.map((t) => (
                <div key={t} className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-quaternary uppercase">{t}</p>
                    <Tabs defaultSelectedKey="overview">
                        <Tabs.List type={t} items={items}>
                            {(item) => <Tabs.Item id={item.id} label={item.label} icon={item.icon} badge={item.badge} />}
                        </Tabs.List>
                    </Tabs>
                </div>
            ))}
        </div>
    ),
};

/** Underline tabs, the classic content-navigation style, with panel content. */
export const Underline: Story = {
    render: () => (
        <Tabs defaultSelectedKey="analytics">
            <Tabs.List type="underline" items={items}>
                {(item) => <Tabs.Item id={item.id} label={item.label} badge={item.badge} />}
            </Tabs.List>
            <Panels />
        </Tabs>
    ),
};
