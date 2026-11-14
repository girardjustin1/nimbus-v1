import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { UploadCloud02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";

const meta = {
    title: "Design System/Base Components/File Upload",
    component: FileTrigger,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FileTrigger>;

export default meta;
type Story = StoryObj<typeof FileTrigger>;

/** Default file trigger — wraps a Nimbus Button that opens the file dialog. */
export const Default: Story = {
    render: () => (
        <FileTrigger onSelect={() => {}}>
            <Button iconLeading={UploadCloud02}>Upload file</Button>
        </FileTrigger>
    ),
};

/** Allows selecting multiple files at once. */
export const Multiple: Story = {
    render: () => (
        <FileTrigger allowsMultiple onSelect={() => {}}>
            <Button color="secondary" iconLeading={UploadCloud02}>
                Upload files
            </Button>
        </FileTrigger>
    ),
};

/** Restricted to image files, showing the selected file name. */
export const WithSelectedFile: Story = {
    render: () => {
        const FileUploadDemo = () => {
            const [fileName, setFileName] = useState<string | null>(null);
            return (
                <div className="flex flex-col items-start gap-3">
                    <FileTrigger
                        acceptedFileTypes={["image/*"]}
                        onSelect={(files) => setFileName(files?.[0]?.name ?? null)}
                    >
                        <Button iconLeading={UploadCloud02}>Choose image</Button>
                    </FileTrigger>
                    <p className="text-sm text-tertiary">{fileName ? `Selected: ${fileName}` : "No file selected"}</p>
                </div>
            );
        };
        return <FileUploadDemo />;
    },
};
