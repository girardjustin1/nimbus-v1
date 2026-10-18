import type { SetupForm } from "../../v1/screens/setup-data";
import { dealById } from "./deal-data";

/**
 * The three ways to answer "which deal?", and what each one needs from you.
 *
 * Kept apart from the component so that validation and the summary rail can read it
 * without importing a screen, and apart from SetupForm because SetupForm belongs to
 * Round 1 and this round does not edit Round 1.
 *
 * Only `generate` and `create` carry a name and an id of their own. An existing deal
 * already has both, so they are read back off the library rather than copied — a copy
 * is a second answer to a question that already has one, and copies go stale.
 */

export type DealMode = "generate" | "create" | "existing";

export interface DealDraft {
    mode: DealMode;
    /** The new deal's name. Unused in `existing` mode. */
    name: string;
    /** The new deal's id, typed by hand. Only `create` asks for it. */
    id: string;
}

/**
 * Where the section starts. A preset that already points at a deal opens on Add to
 * existing, because that is what the form is describing.
 */
export const dealDraftFor = (form: SetupForm): DealDraft => ({ mode: form.dealId ? "existing" : "generate", name: "", id: "" });

/**
 * What to call this deal in the summary rail.
 *
 * The fallback matters for the demo toolbar: filling the whole page sets a deal id
 * without touching the name field, and a rail reading "Not Specified" next to a filled
 * form would look like a bug in the form rather than a shortcut in the toolbar.
 */
export const dealDisplayName = (form: SetupForm, deal: DealDraft): string | undefined =>
    (deal.mode !== "existing" && deal.name.trim()) || dealById(form.dealId)?.label || undefined;

/** What the deal's id will be, as far as the form can know it. */
export const dealDisplayId = (form: SetupForm, deal: DealDraft): string | undefined =>
    deal.mode === "existing" ? form.dealId : deal.mode === "create" ? deal.id.trim() || undefined : undefined;
