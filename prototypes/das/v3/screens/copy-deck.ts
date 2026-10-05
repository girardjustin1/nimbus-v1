import { useSyncExternalStore } from "react";
import { cx } from "@/utils/cx";

/**
 * Copy deck — Original (staging) versus New (Prototype 3) wording, switchable from the
 * prototype toolbar. Product's 5 Oct review asked for two things before the engineering
 * review: mark everything we added, and a way to see only the copy staging already has,
 * "because then that'll show where it's just flat out missing copy".
 *
 *   Original   Staging's wording wherever staging has the element. Anything staging has
 *              no copy for is not rendered, so the gaps show.
 *   New        Prototype 3's wording, as built. Two optional views on top:
 *                Highlight new — tints every string that is not staging's, word for
 *                  word. Rewordings are underlined too; hover one to read staging's version.
 *                Hide new — drops strings staging has no equivalent for.
 *
 * Every string on the campaign setup screens goes through <Copy> or useCopy(). A string
 * with no `original` is new copy. ORIGINAL below is the staging deck, transcribed from
 * reference/das-system/100526/copyAudit (dashboard-stage, captured 5 Oct). It is
 * transcribed as displayed, so uppercase labels and trailing colons are kept.
 *
 * Prototype chrome, not product UI.
 */

/* ------------------------------------------------------------- Staging --- */

export const ORIGINAL = {
    // General step
    dealTitle: "Deal",
    dealGenerate: "Generate new ID:",
    dealCreate: "Create new ID:",
    dealExisting: "Add to existing:",
    dealName: "DEAL NAME:",
    dealId: "ID:",
    campaignNameTitle: "Campaign Name",
    rulesTitle: "Auction Rules",
    rulesDescription: "Determine how this campaign should perform against Open Marketplace auctions.",
    rulesGuaranteed: "Guaranteed Campaign",
    // Staging's form shows the option alone; this sentence is how its Review page describes it.
    rulesGuaranteedHint: "Prioritize this campaign over OMP auctions.",

    // Budget step
    budget: "Budget",
    budgetDescription: "Total campaign spend.",
    bidAmount: "Bid Amount",
    bidDescription: "eCPM for this campaign.",
    freqCapTitle: "Frequency Cap",
    freqCapDescription: "Maximum number of times an ad from this campaign is shown to an individual user over a 24hr period.",
    doNotEnable: "Do not enable",
    enable: "Enable:",

    // Creative step
    creativeTitle: "Add Existing Asset",
    creativeDescription: "If you are using brand new assets, you must add them to your library first.",
    creativeRequired: "Creative(s) must be added before going to review page.",
    creativeCancel: "CANCEL",
    creativeAdd: "ADD",
    // Step footer
    cancelSetup: "CANCEL CAMPAIGN SETUP",
    backToTargeting: "← TARGETING",
    toReview: "REVIEW →",

    // Review step
    reviewTitle: "Review Campaign Settings",
    reviewDescription: 'Please review the details of your campaign to ensure they are accurate. Click on the "Publish" button below to complete.',
    reviewGeneral: "General",
    reviewBudget: "Budget",
    reviewEdit: "EDIT",
    rowDealId: "Deal ID",
    rowDealName: "Deal Name",
    rowCampaignName: "Campaign Name",
    rowAuctionRules: "Auction Rules",
    rowPriority: "Priority",
    rowBudget: "Budget",
    rowBidAmount: "Bid Amount (eCPM)",
    valueDealIdAuto: "Auto Generate",
    valuePriorityOff: "Disabled",
} as const;

/* ---------------------------------------------------------------- Mode --- */

export type CopySet = "original" | "new";
/** Only applies to the New set. */
export type NewView = "plain" | "highlight" | "hide";

let copySet: CopySet = "new";
let newView: NewView = "plain";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

export const setCopySet = (next: CopySet) => {
    copySet = next;
    emit();
};
export const setNewView = (next: NewView) => {
    newView = next;
    emit();
};

export const useCopySet = () => useSyncExternalStore(subscribe, () => copySet);
export const useNewView = () => useSyncExternalStore(subscribe, () => newView);

/* ---------------------------------------------------------------- Fate --- */

export const PINK = "#DA6EA3";

export type Fate = "show" | "original" | "mark-new" | "mark-reworded" | "hide";

/** What happens to one string, given its staging original (if any) and the mode. */
export const fate = (set: CopySet, view: NewView, text: string | undefined, original: string | undefined): Fate => {
    if (set === "original") return original === undefined ? "hide" : "original";
    if (view === "hide") return original === undefined ? "hide" : "show";
    if (view === "highlight") {
        if (original === undefined) return "mark-new";
        if (text !== undefined && text !== original) return "mark-reworded";
    }
    return "show";
};

/**
 * For props the design system types as plain strings (Input/Select `label`,
 * `placeholder`). Text can't carry a <mark>, so the highlight goes on the element instead,
 * through the class `mark()` returns for the field's className.
 */
export const useCopy = () => {
    const set = useCopySet();
    const view = useNewView();
    /** The string to render, or undefined when this mode hides it. */
    const text = (proto: string, original?: string): string | undefined => {
        const f = fate(set, view, proto, original);
        return f === "hide" ? undefined : f === "original" ? original : proto;
    };
    /** Classes for a field whose label and/or placeholder are copy. */
    const mark = ({ label, placeholder }: { label?: [string, string?]; placeholder?: [string, string?] }) => {
        const marked = (pair?: [string, string?]) => {
            if (!pair) return false;
            const f = fate(set, view, pair[0], pair[1]);
            return f === "mark-new" || f === "mark-reworded";
        };
        return cx(
            marked(label) && "**:data-label:w-fit **:data-label:rounded-[3px] **:data-label:bg-[#DA6EA3]/20",
            marked(placeholder) && "**:placeholder:text-[#C2508A]",
        );
    };
    return { text, mark };
};

