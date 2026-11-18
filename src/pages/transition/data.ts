/**
 * The transition's one list: every change product asks for, and every step the team owes.
 *
 * Two readers share this file:
 *   - Storybook › Transition (./transition-sections.tsx) renders it.
 *   - `npm run monday:export` (scripts/monday-export.mjs) turns it into the file
 *     that is imported into the monday.com board.
 * Change a title or a status here and both follow. The `id` is what ties a row here
 * to its item on the board, so an id never changes and is never reused.
 *
 * The site is public: owners are roles, never people's names. The export swaps roles
 * for names from a local file that is not committed (monday/people.json).
 *
 * Plain TypeScript only (no enums, no path aliases): Node reads this file directly.
 */

export const SITE = "https://girardjustin1.github.io/nimbus-v1/";
export const BOARD = "https://adsbynimbus.monday.com/boards/18440322031";

export type Owner = "Product" | "Engineering" | "Design";

/** One status column on the board carries an item from the list to the live dashboard. */
export const STATUSES = ["To do", "In design", "Ready for review", "Changes requested", "Approved", "Ported", "On staging", "Live", "Done"] as const;
export type Status = (typeof STATUSES)[number];

export type Kind = "Back to current style" | "Adjustment" | "Step";

export interface TransitionItem {
    /** Stable key shared with the board, e.g. "R1-04". */
    id: string;
    round: string;
    kind: Kind;
    title: string;
    /** What was asked, in the words it was asked in. */
    request: string;
    /** The part of the product the change belongs to. On the board, one subitem per area under the round's item. */
    area: string;
    owner: Owner;
    status: Status;
    /** Prototype screens where the item shows: [label, screen id in the full application (v2 for Round 1)]. */
    where: [string, string][];
    /** A step that gets its own subitem on the board, under this short name. (Changes reach the board as their area's subitem.) */
    board?: string;
}

export interface Round {
    id: string;
    name: string;
    date: string;
    /** Storybook docs id of the round's page. */
    page: string;
    summary: string;
}

export const ROUNDS: Round[] = [
    {
        id: "R1",
        name: "Round 1",
        date: "Nov 17, 2026",
        page: "transition-round-1-changes--docs",
        summary: "Thirteen styles go back to the current dashboard's, and three adjustments apply everywhere.",
    },
];

const R1 = "Round 1";
const change =
    (kind: Kind) =>
    (n: string, title: string, request: string, area: string, where: [string, string][]): TransitionItem => ({
        id: `R1-${n}`,
        round: R1,
        kind,
        title,
        request,
        area,
        owner: "Design",
        // Built in the full application v2 on Nov 18, 2026, from staging's styles (./round-1-styles.ts).
        status: "Ready for review",
        where,
    });
const back = change("Back to current style");
const adjust = change("Adjustment");

const KEY: [string, string] = ["Key metrics", "key-metrics"];
const REALTIME: [string, string] = ["Realtime dashboard", "realtime"];
const QUERY: [string, string] = ["Performance Insights", "pi-query"];
const SETUP: [string, string] = ["Campaign setup", "setup-empty"];
const CAMPAIGNS: [string, string] = ["Manage campaigns", "campaigns"];

export const ITEMS: TransitionItem[] = [
    back("01", "Internal nav bar", "Internal nav bar.", "App frame", [KEY]),
    back("02", "Publisher name dropdown", "Drop down pub name.", "App frame", [KEY]),
    back("03", "Key metrics main numbers", "Key metrics main numbers.", "Headline numbers", [KEY]),
    back(
        "04",
        "One small upper case style for small labels",
        "Small tab labels (like in key metrics), colored background labels, form labels can all share a small upper case style. We can add “start date” and “end date” in the date selector and the labels of metric blocks like “requests” / “impressions” etc. at the top of the chart in realtime reporting.",
        "Small labels",
        [KEY, REALTIME, SETUP],
    ),
    back(
        "05",
        "Realtime metric blocks: main numbers",
        "Main numbers in the above lockup (the current realtime block: a small upper case label, the large number, then one line per platform).",
        "Headline numbers",
        [REALTIME],
    ),
    back(
        "06",
        "Realtime metric blocks: platform lines",
        "“Android” / “iPhone” in the realtime metric blocks can be the same styling as the tab labels, but regular instead of bold. The little numbers next to them can be bold like the button and start/end date styling.",
        "Headline numbers",
        [REALTIME],
    ),
    back("07", "Section labels", "Section labels (e.g. “Campaign Name”).", "Small labels", [SETUP]),
    back("08", "Table totals", "Table totals (lighter green).", "Tables and numbers", [QUERY, KEY]),
    back("09", "Button text", "Buttons (bolder text, but make sure they are vertically centered in the button - they are all 1px too high now).", "Buttons", [
        QUERY,
        SETUP,
    ]),
    back("10", "Button height", "Buttons - increased in height in prototype - bring them back down.", "Buttons", [QUERY, SETUP]),
    back("11", "Height of filter, breakdown and date blocks", "Height of filter/breakdown/date blocks (too tall in prototype).", "Filters", [KEY, REALTIME]),
    back("12", "Filter and breakdown section labels", "Filter/breakdown section labels (e.g. “Totals only”).", "Filters", [KEY, REALTIME]),
    back("13", "Filter and breakdown check box text", "Filter/breakdown check box text.", "Filters", [KEY, REALTIME]),
    adjust("14", "Tabular numbers everywhere", "Ensure all numbers are the tabular version.", "Tables and numbers", [KEY, QUERY]),
    adjust(
        "15",
        "Table column labels and contents left align",
        "Ensure all table column labels and contents left align. Labels seem to be shifting all over the place in production and then this got mirrored in the prototype as well.",
        "Tables and numbers",
        [QUERY, CAMPAIGNS],
    ),
    adjust(
        "16",
        "One hover state for form options",
        "Make hover states consistent and intentional - the forms for “Deal” have a different hover than the auction rules options. I checked to see if it was mirroring the check box hover state, but it’s not (they don’t have one which is fine).",
        "Form hover states",
        [SETUP],
    ),
];

const step = (n: string, owner: Owner, title: string, request: string, board?: string, status: Status = "To do"): TransitionItem => ({
    id: `R1-S${n}`,
    round: R1,
    kind: "Step",
    title,
    request,
    area: "Team to-do",
    owner,
    status,
    where: [],
    board,
});

/** Who owes what to move Round 1 along, in order. */
export const STEPS: TransitionItem[] = [
    step(
        "1",
        "Engineering",
        "Re-stage the current production version",
        "What is live in production today, before any changes, goes back on staging so the current styles can be read from it. Engineering confirmed on Nov 18 that staging already carries it. That day's release put production DAS back too, so staging now matches production everywhere.",
        "Re-stage current production",
        "Done",
    ),
    step(
        "2",
        "Design",
        "Import the current styles from staging",
        "For each item going back, record the current style from staging next to the prototype's. Read on Nov 18: Round 1 › Style guide.",
        undefined,
        "Done",
    ),
    step(
        "3",
        "Design",
        "Make the Round 1 changes in the prototype",
        "Every item on the list, in the full application v2 and in the tokens behind it. v1 stays as it was reviewed.",
        undefined,
        "Done",
    ),
    step("4", "Design", "Tell product Round 1 is ready", "Set Round 1 to ready for review on the board and send the Round 1 link."),
    step("5", "Product", "Review Round 1", "Look at each item in the prototype and say which are approved and which need another pass.", "Review"),
    step("6", "Engineering", "Stage the Round 1 changes", "Once design's changes are in, the same changes go to staging."),
    step("7", "Product", "Send the next list", "Assess again and start Round 2."),
];

export const ALL = [...ITEMS, ...STEPS];

/** The areas of a round, in list order: the subitems of the round's item on the board. */
export const areasOf = (round: string) => [...new Set(ITEMS.filter((i) => i.round === round).map((i) => i.area))];

/** Round 1 is built in v2 of the full application. */
export const protoUrl = (screen: string) => `${SITE}app/v2/#/${screen}`;
export const pageUrl = (docsId: string) => `${SITE}?path=/docs/${docsId}`;
