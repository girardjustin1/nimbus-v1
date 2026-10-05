import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DuplicateHandoff, PublishFooter } from "../../../prototypes/das/v3/screens/publish-duplicate";
import { CampaignSetup } from "../../../prototypes/das/v3/screens/campaign-setup";
import { Compare } from "./note";
import { bySlug } from "./feedback";

/**
 * Prototype 3 · Publish & Duplicate.
 *
 * Round 2 reduced the rail to one Review button and lost both publish actions. These
 * stories put them back two ways: in the rail as a pair, and in a footer under the form
 * the way the product does it today.
 */
const item = bySlug("publish-duplicate");

const meta = {
    title: "Prototype 3/Publish & Duplicate",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** What Round 2 shipped: one Review button, and Publish hidden inside the modal. */
export const Original: Story = {
    name: "Round 2 · Review, then Publish in a modal",
    render: () => (
        <Compare item={item} kind="Original" title="One button in the rail; duplicate nowhere">
            <CampaignSetup preset="ready" rail="summary" />
        </Compare>
    ),
};

/** A — the footer the product uses today, carried onto the one-page form. */
export const StagingFooter: Story = {
    name: "A · both actions in a footer",
    render: () => (
        <Compare item={item} kind="A" title="Cancel, Publish & Duplicate, Publish — under the form">
            <CampaignSetup preset="ready" rail="summary" publishMode="staging" />
        </Compare>
    ),
};

/** The footer on its own, including the blocked state when the campaign isn't ready. */
export const FooterStates: Story = {
    name: "A · footer, ready and blocked",
    render: () => (
        <Compare item={item} kind="A" title="Both states of the footer">
            <div className="flex flex-col gap-10 p-6">
                <PublishFooter issues={0} onPublish={() => {}} onPublishDuplicate={() => {}} onCancel={() => {}} />
                <PublishFooter issues={3} onPublish={() => {}} onPublishDuplicate={() => {}} onCancel={() => {}} />
            </div>
        </Compare>
    ),
};

/**
 * B — the hand-off after Publish & Duplicate.
 *
 * The step that makes the pair mean something: the campaign went out, and the duplicate
 * is a separate decision you are now being offered rather than something that happened
 * to you.
 */
export const Handoff: Story = {
    name: "B · the duplicate hand-off",
    render: () => {
        const Demo = () => {
            const [open, setOpen] = useState(true);
            return (
                <div className="relative min-h-[420px]">
                    {!open && (
                        <button type="button" className="m-6 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-primary" onClick={() => setOpen(true)}>
                            Show it again
                        </button>
                    )}
                    {open && <DuplicateHandoff onContinue={() => setOpen(false)} />}
                </div>
            );
        };
        return (
            <Compare item={item} quote={1} kind="B" title="Confirm, then back to the top with the original's values">
                <Demo />
            </Compare>
        );
    },
};
