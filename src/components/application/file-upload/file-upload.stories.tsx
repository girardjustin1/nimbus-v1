import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload, FileUploadDropZone } from "@/components/application/file-upload/file-upload-base";

/**
 * Application UI → File Upload
 *
 * Nimbus-themed file upload. `FileUpload.DropZone` is the drop target; files in
 * progress are rendered with `FileUpload.ListItemProgressBar` or
 * `FileUpload.ListItemProgressFill` inside a `FileUpload.List`.
 */
const meta = {
    title: "Design System/Application UI/File Upload",
    component: FileUploadDropZone,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    args: {
        hint: "SVG, PNG, JPG or GIF (max. 800×400px)",
        allowsMultiple: true,
    },
    decorators: [
        (Story) => (
            <div className="mx-auto w-full max-w-lg py-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FileUploadDropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The base drop zone with hint text. */
export const DropZone: Story = {};

/** Disabled drop zone. */
export const Disabled: Story = {
    args: { isDisabled: true },
};

/** A full uploader: drop zone plus a list of files in various upload states (progress bar variant). */
export const WithFileList: Story = {
    render: (args) => (
        <FileUpload.Root>
            <FileUpload.DropZone {...args} />

            <FileUpload.List>
                <FileUpload.ListItemProgressBar name="nimbus-dashboard.fig" size={2_400_000} progress={100} type="empty" fileIconVariant="default" />
                <FileUpload.ListItemProgressBar name="edge-deployment-guide.pdf" size={1_100_000} progress={62} type="pdf" fileIconVariant="default" />
                <FileUpload.ListItemProgressBar name="broken-upload.zip" size={840_000} progress={40} failed type="zip" fileIconVariant="default" />
            </FileUpload.List>
        </FileUpload.Root>
    ),
};

/** Alternative list item that fills the row as it uploads. */
export const ProgressFill: Story = {
    render: (args) => (
        <FileUpload.Root>
            <FileUpload.DropZone {...args} />

            <FileUpload.List>
                <FileUpload.ListItemProgressFill name="release-notes.pdf" size={3_600_000} progress={100} type="pdf" fileIconVariant="solid" />
                <FileUpload.ListItemProgressFill name="cloud-topology.png" size={5_200_000} progress={48} type="img" fileIconVariant="solid" />
            </FileUpload.List>
        </FileUpload.Root>
    ),
};
