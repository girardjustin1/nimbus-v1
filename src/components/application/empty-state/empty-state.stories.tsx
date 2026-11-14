import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, SearchLg, UploadCloud02 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";

/**
 * Application UI → Empty State
 *
 * Nimbus-themed empty states for "no data" scenarios. Built from compound
 * sub-components: `EmptyState.Header`, `EmptyState.FeaturedIcon` /
 * `EmptyState.Illustration`, `EmptyState.Content`, `EmptyState.Title`,
 * `EmptyState.Description`, and `EmptyState.Footer`.
 */
const meta = {
    title: "Design System/Application UI/Empty State",
    component: EmptyState,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
    args: { size: "lg" },
    decorators: [
        (Story) => (
            <div className="mx-auto flex min-h-100 max-w-2xl items-center justify-center py-10">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Realistic "no results found" state with a featured icon and two actions. */
export const NoSearchResults: Story = {
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header>
                <EmptyState.FeaturedIcon icon={SearchLg} color="gray" theme="modern" />
            </EmptyState.Header>

            <EmptyState.Content>
                <EmptyState.Title>No projects found</EmptyState.Title>
                <EmptyState.Description>
                    Your search "cloud edge" did not match any projects. Try adjusting your filters or create a new project to get started.
                </EmptyState.Description>
            </EmptyState.Content>

            <EmptyState.Footer>
                <Button color="secondary" size="lg">
                    Clear search
                </Button>
                <Button color="primary" size="lg" iconLeading={Plus}>
                    New project
                </Button>
            </EmptyState.Footer>
        </EmptyState>
    ),
};

/** Empty upload area using the built-in illustration. */
export const NoFilesYet: Story = {
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header pattern="none">
                <EmptyState.Illustration type="documents" />
            </EmptyState.Header>

            <EmptyState.Content>
                <EmptyState.Title>No files uploaded</EmptyState.Title>
                <EmptyState.Description>You haven't uploaded any documents yet. Upload your first file to start organizing your workspace.</EmptyState.Description>
            </EmptyState.Content>

            <EmptyState.Footer>
                <Button color="secondary" size="lg">
                    Learn more
                </Button>
                <Button color="primary" size="lg" iconLeading={UploadCloud02}>
                    Upload file
                </Button>
            </EmptyState.Footer>
        </EmptyState>
    ),
};

/** Compact variant suitable for cards and panels. */
export const Small: Story = {
    args: { size: "sm" },
    render: (args) => (
        <EmptyState {...args}>
            <EmptyState.Header>
                <EmptyState.FeaturedIcon icon={SearchLg} color="gray" theme="modern" />
            </EmptyState.Header>

            <EmptyState.Content>
                <EmptyState.Title>No members added</EmptyState.Title>
                <EmptyState.Description>Invite teammates to collaborate on this workspace.</EmptyState.Description>
            </EmptyState.Content>

            <EmptyState.Footer>
                <Button color="secondary" size="md">
                    Cancel
                </Button>
                <Button color="primary" size="md" iconLeading={Plus}>
                    Invite
                </Button>
            </EmptyState.Footer>
        </EmptyState>
    ),
};
