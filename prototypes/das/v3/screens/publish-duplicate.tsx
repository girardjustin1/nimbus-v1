import { useEffect } from "react";
import { CheckCircle, Copy01, InfoCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { TEAL } from "../../v1/screens/das-shell";

/**
 * Publish, and Publish & Duplicate.
 *
 * Round 2 reduced the rail to a single Review button and put Publish inside the modal.
 * That lost something the product has and publishers lean on: Kristen was unambiguous
 * on 2 Oct — "I need publish and duplicate... those buttons need to maintain themselves,
 * because that's where publishers use that a lot."
 *
 * Duplicating is not a convenience here, it is the main way a second campaign gets made.
 * The same deal and the same targeting go out again for another format or another
 * language, and typing it all a second time is both slow and how the two drift apart.
 *
 * Staging's flow, which this follows: publish, then a modal confirming the campaign was
 * created and offering to continue, then back to the top of setup with the original's
 * values already in the form. The confirm matters because publishing and starting a
 * second campaign are two things, and doing both off one click with no acknowledgement
 * leaves you unsure whether the first one actually went out.
 */

export type PublishMode = "modal" | "staging";

/** Shown after Publish & Duplicate. Staging's wording, near enough verbatim. */
export const DuplicateHandoff = ({ onContinue }: { onContinue: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Enter" && onContinue();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onContinue]);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
            <div role="dialog" aria-modal="true" aria-label="Campaign created" className="w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-2xl">
                <div className="flex flex-col gap-3 px-6 py-6">
                    <p className="flex items-start gap-2 text-md font-semibold text-primary">
                        <CheckCircle className="mt-0.5 size-5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                        Your campaign was created. Continue to set up a duplicate campaign.
                    </p>
                    <p className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                        <InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        The duplicate starts with everything the original had. Change what differs — usually the creative or the geo — and publish again.
                    </p>
                </div>
                <div className="flex justify-end border-t border-secondary px-6 py-4">
                    <Button color="primary-pink" className="uppercase" onClick={onContinue} autoFocus>
                        Continue to duplicate setup
                    </Button>
                </div>
            </div>
        </div>
    );
};

/**
 * The footer staging puts under Review, carried onto the one-page form.
 *
 * Both publish actions are in the open rather than one of them hiding in a menu, which
 * is the point: a publisher who duplicates every campaign should not have to go looking
 * for it each time.
 */
export const PublishFooter = ({
    issues,
    onPublish,
    onPublishDuplicate,
    onCancel,
}: {
    issues: number;
    onPublish: () => void;
    onPublishDuplicate: () => void;
    onCancel: () => void;
}) => (
    <div className="flex flex-col gap-3 border-t border-secondary pt-5">
        {issues > 0 && (
            <p className="text-sm text-error-primary">
                {issues} {issues === 1 ? "thing needs" : "things need"} fixing before this can publish.
            </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
            <Button color="link-gray" className="uppercase" onClick={onCancel}>
                Cancel campaign setup
            </Button>
            <div className="flex flex-wrap gap-3">
                <Button color="secondary" className="uppercase" iconLeading={Copy01} isDisabled={issues > 0} onClick={onPublishDuplicate}>
                    Publish &amp; Duplicate
                </Button>
                <Button color="primary-pink" className="uppercase" isDisabled={issues > 0} onClick={onPublish}>
                    Publish
                </Button>
            </div>
        </div>
        <p className="text-xs text-tertiary">
            Publish &amp; Duplicate creates this campaign, then opens a copy of it so you can change what differs and publish that too.
        </p>
    </div>
);
