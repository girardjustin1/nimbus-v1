import { type Issue, type SetupForm, started, validate } from "../../v1/screens/setup-data";
import type { DealDraft } from "./deal-draft";

/**
 * Round 3's sections, and the two rules that follow from the way they changed.
 *
 * Two changes from Round 1:
 *
 *   - **"General" is now "Deal".** It was never general; it was the deal, plus the
 *     campaign's name riding along because there was nowhere else to put it. A section
 *     named after what it is can be scanned for.
 *   - **Flight Dates is a section of its own**, directly under Budget. When a campaign
 *     runs is not a budgeting detail, and it was two pickers sharing a heading with
 *     two currency fields.
 *   - **Campaign Name is a section of its own**, at the same level as Auction Rules.
 *     It is one of the two things on this form that identify the campaign to everybody
 *     who sees it afterwards — in the campaign list, in reporting, in a support ticket
 *     — and it was a text box at the bottom of someone else's section.
 *
 * Splitting it means the rail has to split too, so validation and the started/complete
 * counts are remapped here rather than in Round 1's file, which this round does not
 * edit.
 */

export const SECTIONS_V3 = [
    { id: "deal", title: "Deal" },
    { id: "campaign", title: "Campaign Name" },
    { id: "rules", title: "Auction Rules" },
    { id: "priority", title: "Priority" },
    { id: "budget", title: "Budget" },
    { id: "flight", title: "Flight Dates" },
    { id: "freqcap", title: "Frequency Cap" },
    { id: "targeting", title: "Targeting" },
    { id: "creative", title: "Creative" },
] as const;

export type SectionIdV3 = (typeof SECTIONS_V3)[number]["id"];

/**
 * The five milestones the rail counts, as opposed to the nine headings on the page.
 *
 * These are the product's own steps, transcribed from the 18 Sep capture of the
 * wizard: General, Budget, Targeting, Creative, Review. Round 1 turned that wizard
 * into one page and the rail quietly started listing every heading instead, which is
 * how a rail meant to say "where am I" ended up saying "3/9" — a number that goes up
 * when you name a campaign and means nothing to anybody.
 *
 * The groups follow the wizard exactly where the audit records it: Deal, Campaign
 * Name, Auction Rules and Priority were step 1; Budget, Bid Amount and the date range
 * were step 2. Frequency Cap is the one the audit doesn't place — it appears in the
 * campaign table, never in a captured step — so it sits with Budget, next to the other
 * controls that decide how fast a campaign spends and where it already is on the page.
 *
 * Review has no sections of its own. It is the last step in the product and it is the
 * question this rail exists to answer, so it completes when nothing is outstanding.
 */
export const MILESTONES_V3 = [
    { id: "general", title: "General", sections: ["deal", "campaign", "rules", "priority"] },
    { id: "budget", title: "Budget", sections: ["budget", "flight", "freqcap"] },
    { id: "targeting", title: "Targeting", sections: ["targeting"] },
    { id: "creative", title: "Creative", sections: ["creative"] },
    { id: "review", title: "Review", sections: [] },
] as const satisfies readonly { id: string; title: string; sections: readonly SectionIdV3[] }[];

export type Milestone = (typeof MILESTONES_V3)[number];

/** Where clicking a milestone takes you — its first heading, or nowhere for Review. */
export const milestoneTarget = (m: Milestone): SectionIdV3 | undefined => m.sections[0];

export interface MilestoneState {
    started: boolean;
    issues: number;
    done: boolean;
}

export const milestoneState = (form: SetupForm, deal: DealDraft, issues: IssueV3[], m: Milestone): MilestoneState => {
    if (m.id === "review") {
        // Everything else has been both attempted and left clean.
        const rest = MILESTONES_V3.filter((x) => x.id !== "review");
        const ready = issues.length === 0 && rest.every((x) => milestoneState(form, deal, issues, x).done);
        return { started: ready, issues: 0, done: ready };
    }
    const mine = issues.filter((i) => (m.sections as readonly SectionIdV3[]).includes(i.section)).length;
    const started = m.sections.some((id) => startedV3(form, deal, id));
    return { started, issues: mine, done: started && mine === 0 };
};

export interface IssueV3 {
    section: SectionIdV3;
    field: string;
    text: string;
}

/**
 * Round 1 asked one question of this section — "is a deal chosen?" — because choosing
 * was the only thing you could do. There are three ways through it now, and each is
 * finished by something different: a generated deal needs a name, a custom one needs a
 * name and an id, and an existing one needs to have been picked.
 */
const dealIssues = (form: SetupForm, deal: DealDraft): IssueV3[] => {
    if (deal.mode === "existing") return form.dealId ? [] : [{ section: "deal", field: "deal", text: "Choose a deal" }];
    const issues: IssueV3[] = [];
    if (!deal.name.trim()) issues.push({ section: "deal", field: "dealName", text: "Name the deal" });
    if (deal.mode === "create" && !deal.id.trim()) issues.push({ section: "deal", field: "dealCustomId", text: "Give the deal an ID" });
    return issues;
};

export const validateV3 = (form: SetupForm, deal: DealDraft): IssueV3[] => {
    const rest = validate(form)
        // Round 1's deal check assumed the only way to have a deal was to pick one.
        .filter((i: Issue) => i.field !== "deal")
        // Two of Round 1's sections have split, so their problems move with them.
        .map((i: Issue): IssueV3 => (i.field === "name" ? { ...i, section: "campaign" } : i))
        .map((i: IssueV3): IssueV3 => (i.field === "start" || i.field === "end" ? { ...i, section: "flight" } : i));
    return [...dealIssues(form, deal), ...rest];
};

export const startedV3 = (form: SetupForm, deal: DealDraft, section: SectionIdV3) => {
    if (section === "campaign") return Boolean(form.name);
    if (section === "deal") return Boolean(deal.name.trim() || form.dealId);
    // Round 1's "budget" counted the dates too; they answer for themselves now.
    if (section === "budget") return Boolean(form.budget || form.ecpm);
    if (section === "flight") return Boolean(form.start || form.end);
    return started(form, section);
};
