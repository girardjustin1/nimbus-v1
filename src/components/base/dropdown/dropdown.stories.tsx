import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy01, Download01, Edit01, Settings01, Trash01, UserPlus01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";

const meta = {
    title: "Design System/Base Components/Dropdown",
    component: Dropdown.Root,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
} satisfies Meta<typeof Dropdown.Root>;

export default meta;
type Story = StoryObj<typeof Dropdown.Root>;

/** Default dropdown — a trigger button with a few menu items using icons. */
export const Default: Story = {
    render: () => (
        <Dropdown.Root>
            <Button color="secondary">Options</Button>

            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item icon={Edit01} label="Edit" />
                    <Dropdown.Item icon={Copy01} label="Copy link" />
                    <Dropdown.Item icon={UserPlus01} label="Invite people" />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** Triggered by the dots (kebab) button — the pattern used for table row actions. */
export const DotsButton: Story = {
    render: () => (
        <Dropdown.Root>
            <Dropdown.DotsButton />

            <Dropdown.Popover className="w-min">
                <Dropdown.Menu>
                    <Dropdown.Item icon={Edit01}>
                        <span className="pr-4">Edit</span>
                    </Dropdown.Item>
                    <Dropdown.Item icon={Copy01}>
                        <span className="pr-4">Copy link</span>
                    </Dropdown.Item>
                    <Dropdown.Item icon={Trash01}>
                        <span className="pr-4">Delete</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};

/** Items with keyboard-shortcut addons, a separator, and a disabled item. */
export const WithSeparatorAndAddons: Story = {
    render: () => (
        <Dropdown.Root>
            <Button color="secondary">Actions</Button>

            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item icon={Edit01} label="Edit" addon="⌘E" />
                    <Dropdown.Item icon={Copy01} label="Duplicate" addon="⌘D" />
                    <Dropdown.Item icon={Download01} label="Download" addon="⌘S" />
                    <Dropdown.Separator />
                    <Dropdown.Item icon={Settings01} label="Settings" />
                    <Dropdown.Item icon={Trash01} label="Delete" isDisabled />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    ),
};
