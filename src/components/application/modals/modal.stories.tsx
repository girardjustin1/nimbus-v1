import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle, Trash01, UploadCloud02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "./modal";

/**
 * Modals are overlay dialogs built on React Aria Components. Open them with a
 * `DialogTrigger` wrapping a trigger `Button` and the overlay tree:
 * `ModalOverlay` → `Modal` → `Dialog`. The `Dialog` accepts a render function
 * that receives a `close` callback to dismiss the modal from any action.
 */
const meta = {
    title: "Design System/Application UI/Modal",
    component: Modal,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Button>;

/** Confirmation modal with a featured icon, heading, body copy, and cancel / confirm actions. */
export const Default: Story = {
    render: () => (
        <DialogTrigger>
            <Button size="md" iconLeading={UploadCloud02}>
                Publish changes
            </Button>
            <ModalOverlay>
                <Modal>
                    <Dialog>
                        {({ close }) => (
                            <div className="w-full max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                                <FeaturedIcon icon={CheckCircle} color="gray" theme="modern" size="lg" />
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Publish changes</h2>
                                    <p className="text-sm text-tertiary">
                                        Your updates will go live immediately and be visible to everyone on your team. You can revert from the version history at any time.
                                    </p>
                                </div>
                                <div className="mt-8 flex gap-3">
                                    <Button color="secondary" size="md" className="flex-1" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" size="md" className="flex-1" onClick={close}>
                                        Publish
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};

/** Destructive confirmation using an error-themed featured icon and a `primary-destructive` confirm button. */
export const Destructive: Story = {
    render: () => (
        <DialogTrigger>
            <Button size="md" color="primary-destructive" iconLeading={Trash01}>
                Delete project
            </Button>
            <ModalOverlay>
                <Modal>
                    <Dialog>
                        {({ close }) => (
                            <div className="w-full max-w-100 rounded-xl bg-primary p-6 shadow-xl ring-1 ring-secondary_alt">
                                <FeaturedIcon icon={Trash01} color="error" theme="light" size="lg" />
                                <div className="mt-4 flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold text-primary">Delete project</h2>
                                    <p className="text-sm text-tertiary">
                                        Are you sure you want to delete this project? This action cannot be undone and all associated data will be permanently removed.
                                    </p>
                                </div>
                                <div className="mt-8 flex gap-3">
                                    <Button color="secondary" size="md" className="flex-1" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary-destructive" size="md" className="flex-1" onClick={close}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    ),
};
