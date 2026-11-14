import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings01, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { SlideoutMenu } from "./slideout-menu";

/**
 * Slideout menus are panels that slide in from the right edge of the viewport,
 * built on React Aria Components. Open one with `SlideoutMenu.Trigger` wrapping a
 * trigger `Button` and the `SlideoutMenu` panel. The panel's children can be a
 * render function receiving a `close` callback. Compose the panel with
 * `SlideoutMenu.Header`, `SlideoutMenu.Content`, and `SlideoutMenu.Footer`.
 */
const meta = {
    title: "Design System/Application UI/Slideout Menu",
    component: SlideoutMenu,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof SlideoutMenu>;

export default meta;
type Story = StoryObj<typeof Button>;

/** A settings panel with a featured icon header, form fields, and sticky cancel / save footer. */
export const Default: Story = {
    render: () => (
        <div className="flex min-h-dvh items-center justify-center bg-secondary p-12">
            <SlideoutMenu.Trigger>
                <Button size="md" iconLeading={Settings01}>
                    Open settings
                </Button>
                <SlideoutMenu>
                    {({ close }) => (
                        <>
                            <SlideoutMenu.Header onClose={close}>
                                <FeaturedIcon icon={Settings01} color="gray" theme="modern" size="lg" />
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Workspace settings</h2>
                                    <p className="text-sm text-tertiary">Update your workspace details. Changes apply to every member on your team.</p>
                                </div>
                            </SlideoutMenu.Header>
                            <SlideoutMenu.Content>
                                <Input label="Workspace name" placeholder="Nimbus Inc." defaultValue="Nimbus Inc." />
                                <Input label="Support email" placeholder="support@nimbus.com" defaultValue="support@nimbus.com" />
                                <Input label="Website" placeholder="www.nimbus.com" defaultValue="www.nimbus.com" />
                            </SlideoutMenu.Content>
                            <SlideoutMenu.Footer>
                                <div className="flex gap-3">
                                    <Button color="secondary" size="md" className="flex-1" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" size="md" className="flex-1" onClick={close}>
                                        Save changes
                                    </Button>
                                </div>
                            </SlideoutMenu.Footer>
                        </>
                    )}
                </SlideoutMenu>
            </SlideoutMenu.Trigger>
        </div>
    ),
};

/** A profile panel that shows how the content area scrolls independently of the header and footer. */
export const ProfilePanel: Story = {
    render: () => (
        <div className="flex min-h-dvh items-center justify-center bg-secondary p-12">
            <SlideoutMenu.Trigger>
                <Button size="md" color="secondary" iconLeading={User01}>
                    Edit profile
                </Button>
                <SlideoutMenu>
                    {({ close }) => (
                        <>
                            <SlideoutMenu.Header onClose={close}>
                                <FeaturedIcon icon={User01} color="gray" theme="modern" size="lg" />
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Edit profile</h2>
                                    <p className="text-sm text-tertiary">Manage how your profile appears to teammates and collaborators.</p>
                                </div>
                            </SlideoutMenu.Header>
                            <SlideoutMenu.Content>
                                <Input label="Full name" placeholder="Olivia Rhye" defaultValue="Olivia Rhye" />
                                <Input label="Email" placeholder="olivia@nimbus.com" defaultValue="olivia@nimbus.com" />
                                <Input label="Job title" placeholder="Product Designer" defaultValue="Product Designer" />
                                <Input label="Location" placeholder="San Francisco, CA" defaultValue="San Francisco, CA" />
                                <Input label="Timezone" placeholder="Pacific Time (PT)" defaultValue="Pacific Time (PT)" />
                            </SlideoutMenu.Content>
                            <SlideoutMenu.Footer>
                                <div className="flex gap-3">
                                    <Button color="secondary" size="md" className="flex-1" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" size="md" className="flex-1" onClick={close}>
                                        Save profile
                                    </Button>
                                </div>
                            </SlideoutMenu.Footer>
                        </>
                    )}
                </SlideoutMenu>
            </SlideoutMenu.Trigger>
        </div>
    ),
};
