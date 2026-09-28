import { InfoCircle, Link01 } from "@untitledui/icons";

/**
 * Sept 22 · item 7 — the caption under the device preview, before and after.
 *
 * The concern raised on the call was not about the preview itself but about what it
 * claims: a publisher who reads it as exact will treat any difference on a real handset
 * as a bug. The copy changes from a statement about how the ad renders to a statement
 * that this is an approximation, with the reason attached, so the caveat travels with the
 * screenshot when it is shared out of context.
 */

/** What was reviewed on Sep 22 — reads as a claim of accuracy. */
export const PreviewCaptionBefore = () => (
    <p className="flex max-w-md items-center gap-2 text-center text-xs text-tertiary">
        <Link01 className="size-4 shrink-0" aria-hidden="true" />
        This preview shows how the ad renders in a Nimbus-served app. Anyone with the preview link can see it.
    </p>
);

/** Revised — an approximation, and why. */
export const PreviewCaptionAfter = () => (
    <div className="flex max-w-md flex-col items-center gap-1.5">
        <p className="flex items-start gap-2 text-center text-xs font-medium text-secondary">
            <InfoCircle className="mt-px size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
            Approximate preview. Size and placement vary by device, screen and app.
        </p>
        <p className="flex items-center gap-2 text-center text-xs text-tertiary">
            <Link01 className="size-4 shrink-0" aria-hidden="true" />
            Anyone with the preview link can see it.
        </p>
    </div>
);
