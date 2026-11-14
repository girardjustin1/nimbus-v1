import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChartSquare02, FileSearch02, LineChartUp03, PlusCircle, Rocket02, Settings01, Target04, Users01 } from "@untitledui/icons";
import { CommandMenu, type CommandMenuGroupType } from "@/components/application/command-menus/command-menu";

/**
 * The command menu is an overlay palette for fast keyboard-driven navigation and actions.
 * The Nimbus theme is applied globally, so these stories render the palette pre-opened
 * (`isOpen`) with realistic demand-side commands, grouped sections, icons, shortcuts and a footer.
 */
const meta = {
    title: "Design System/Application UI/Command Menu",
    component: CommandMenu,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
} satisfies Meta<typeof CommandMenu>;

export default meta;
type Story = StoryObj<typeof CommandMenu>;

const commandGroups: CommandMenuGroupType[] = [
    {
        id: "quick-actions",
        title: "Quick actions",
        items: [
            {
                id: "new-campaign",
                type: "icon",
                icon: Rocket02,
                label: "New campaign",
                description: "Launch a demand campaign",
                shortcutKeys: ["⌘", "N"],
            },
            {
                id: "new-audience",
                type: "icon",
                icon: Users01,
                label: "New audience",
                description: "Build a targeted segment",
                shortcutKeys: ["⌘", "A"],
            },
            {
                id: "create-report",
                type: "icon",
                icon: PlusCircle,
                label: "Create report",
                shortcutKeys: ["⌘", "R"],
            },
        ],
    },
    {
        id: "go-to",
        title: "Go to",
        items: [
            { id: "reporting", type: "icon", icon: BarChartSquare02, label: "Go to reporting" },
            { id: "search-demand", type: "icon", icon: LineChartUp03, label: "Search demand" },
            { id: "campaigns", type: "icon", icon: Target04, label: "View campaigns" },
            { id: "insights", type: "icon", icon: FileSearch02, label: "Open insights" },
            { id: "settings", type: "icon", icon: Settings01, label: "Open settings", shortcutKeys: ["⌘", "K"] },
        ],
    },
];

/** The full command palette: search input, two grouped sections with icons + shortcuts, and the navigation footer. */
export const Default: Story = {
    render: () => (
        <CommandMenu isOpen items={commandGroups} placeholder="Search demand, campaigns, reports…" shortcut="⌘/">
            <CommandMenu.Group>
                <CommandMenu.List>
                    {(group) => (
                        <CommandMenu.Section id={group.id} title={group.title} items={group.items}>
                            {(item) => <CommandMenu.Item {...item} />}
                        </CommandMenu.Section>
                    )}
                </CommandMenu.List>
            </CommandMenu.Group>
            <CommandMenu.Footer />
        </CommandMenu>
    ),
};

const teamGroups: CommandMenuGroupType[] = [
    {
        id: "people",
        title: "Jump to a teammate",
        items: [
            {
                id: "phoenix",
                type: "avatar",
                src: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
                alt: "Phoenix Baker",
                label: "Phoenix Baker",
                description: "Head of Demand",
            },
            {
                id: "olivia",
                type: "avatar",
                src: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
                alt: "Olivia Rhye",
                label: "Olivia Rhye",
                description: "Campaign Manager",
            },
            {
                id: "lana",
                type: "avatar",
                src: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
                alt: "Lana Steiner",
                label: "Lana Steiner",
                description: "Data Analyst",
            },
        ],
    },
];

/** People-search variant using avatar items with supporting roles. */
export const TeamMembers: Story = {
    render: () => (
        <CommandMenu isOpen items={teamGroups} placeholder="Search teammates…" shortcut="⌘/">
            <CommandMenu.Group>
                <CommandMenu.List>
                    {(group) => (
                        <CommandMenu.Section id={group.id} title={group.title} items={group.items}>
                            {(item) => <CommandMenu.Item {...item} />}
                        </CommandMenu.Section>
                    )}
                </CommandMenu.List>
            </CommandMenu.Group>
            <CommandMenu.Footer />
        </CommandMenu>
    ),
};

/** A compact palette without the footer — a single flat list of actions. */
export const Compact: Story = {
    render: () => (
        <CommandMenu isOpen items={[commandGroups[1]]} placeholder="Where to?" shortcut="⌘/">
            <CommandMenu.Group>
                <CommandMenu.List>
                    {(group) => (
                        <CommandMenu.Section id={group.id} items={group.items}>
                            {(item) => <CommandMenu.Item {...item} />}
                        </CommandMenu.Section>
                    )}
                </CommandMenu.List>
            </CommandMenu.Group>
        </CommandMenu>
    ),
};
