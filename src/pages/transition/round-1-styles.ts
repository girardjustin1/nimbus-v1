/**
 * Round 1's style values: what the dashboard uses today, what v1 of the full application
 * used, and what v2 uses.
 *
 * Three readers share this file:
 *   - Storybook › Transition › Round 1 (Summary, Before and after, Style guide, Components) renders it.
 *   - The v2 prototype (prototypes/app/v2/screens/round-1.ts) styles its screens from TOKENS.
 *   - prototypes/app/v2/screens/round-1.test.ts checks that v2's tokens are the ones listed here.
 *
 * "Staging" values were read from the staging dashboard on Nov 18, 2026: the browser's
 * computed style of each element, and the stylesheet rule that sets it. Engineering
 * confirmed staging carries the current production version except for DAS. "v1" values
 * were measured in prototypes/app/v1 the same day.
 *
 * Read again after the release later on Nov 18, which put production's DAS back on staging:
 * every value below held. What the release did change is in RECHECK.
 *
 * Values only: no figures, account names or screenshots from staging (this repo is public).
 */
import type { CSSProperties } from "react";

/* ----------------------------------------------------------------- Colours --- */

/** Colours as staging's stylesheet writes them. */
export const STAGING = {
    teal: "#039C9E",
    tealLight: "#37B6B7",
    tealTint: "#C1ECEB",
    pink: "#DB6FA3",
    staffPink: "#CC6899",
    staffPinkHover: "#A53E70",
    black: "#000000",
    grey: "#666666",
    greyLight: "#888888",
    staffBar: "#EFEFEF",
    staffBarLine: "#BBBBBB",
    tableLine: "#DDDDDD",
    checkboxLine: "#999999",
    checkboxOnFill: "rgba(123, 202, 205, 0.2)",
} as const;

/* ------------------------------------------------------------------ Tokens --- */

/**
 * The one small upper case style product asked for in R1-04: staging's tab label
 * (12px, weight 800, 0.75px spacing). Tab labels, coloured background labels, form
 * labels, the start and end date labels and the metric block labels all use it.
 */
const SMALL_UPPER: CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: "0.75px", lineHeight: "15px", textTransform: "uppercase" };

/** v2's Round 1 styles, one entry per element. The prototype reads these; nothing in v2 repeats the numbers. */
export const TOKENS = {
    /** R1-01: the bar of staff links across the top. */
    staffBar: { height: 50, backgroundColor: STAGING.staffBar, borderBottom: `1px solid ${STAGING.staffBarLine}`, gap: 25 } satisfies CSSProperties,
    staffLink: { fontSize: 13, fontWeight: 700, lineHeight: "50px", color: STAGING.staffPink } satisfies CSSProperties,
    /** R1-02: the account name in the page header, and its badge. */
    pubName: { fontSize: 26, fontWeight: 700, lineHeight: "36px", letterSpacing: "normal", color: STAGING.black } satisfies CSSProperties,
    pubBadge: { ...SMALL_UPPER, letterSpacing: "0.96px", padding: "4px 7px", borderRadius: 3, color: STAGING.teal, backgroundColor: STAGING.tealTint } satisfies CSSProperties,
    /** R1-03: key metrics cards. */
    kmNumber: { fontSize: 40, fontWeight: 700, lineHeight: "normal", letterSpacing: "normal" } satisfies CSSProperties,
    kmTitle: { fontSize: 18, fontWeight: 700, color: STAGING.black } satisfies CSSProperties,
    kmNote: { fontSize: 14, fontWeight: 400, lineHeight: "18px", color: STAGING.grey } satisfies CSSProperties,
    kmNoteValue: { fontWeight: 600, color: STAGING.black } satisfies CSSProperties,
    /** R1-04: one small upper case style. Colour is set where it is used. */
    smallUpper: SMALL_UPPER,
    /** The key metrics tab strip: staging's 43px row of small upper case labels. */
    kmTab: { ...SMALL_UPPER, lineHeight: "43px", padding: "0 8px" } satisfies CSSProperties,
    /** R1-05: the main number in a realtime metric block. */
    rtNumber: { fontSize: 26, fontWeight: 700, lineHeight: "30px", color: STAGING.teal } satisfies CSSProperties,
    /** R1-06: Android / iPhone under it: the tab label style at regular weight, the number bold. */
    rtPlatformLabel: { ...SMALL_UPPER, fontWeight: 400, color: STAGING.grey } satisfies CSSProperties,
    rtPlatformValue: { fontSize: 12, fontWeight: 700, lineHeight: "15px", color: STAGING.grey } satisfies CSSProperties,
    /** R1-07: form section labels (DAS). */
    sectionLabel: { fontSize: 20, fontWeight: 700, lineHeight: "36px", letterSpacing: "-0.13px", color: STAGING.black } satisfies CSSProperties,
    /** R1-08: the totals row of a report table. */
    tableTotal: { fontSize: 14, fontWeight: 600, color: STAGING.teal, borderTop: `3px solid ${STAGING.tableLine}` } satisfies CSSProperties,
    /** R1-09 and R1-10: buttons. */
    button: {
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.75px",
        lineHeight: 1,
        textTransform: "uppercase",
        height: 33,
        padding: "0 20px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    } satisfies CSSProperties,
    /** R1-11: row heights in the report controls. */
    dateRowHeight: 62,
    checkboxRowHeight: 42,
    filterRowHeight: 43,
    /** R1-12: section labels in the filter and breakdown rows ("Totals Only", "Platform", "Filters:"). */
    filterLabel: { fontSize: 16, fontWeight: 700, color: STAGING.black } satisfies CSSProperties,
    /** Staging's smaller label at the end of the checkbox row. */
    showActivityLabel: { fontSize: 13, fontWeight: 700, color: STAGING.black } satisfies CSSProperties,
    /** R1-13: the text beside a check box in those rows. */
    checkboxText: { fontSize: 13, fontWeight: 700, color: STAGING.grey } satisfies CSSProperties,
    /** R1-14: every number. */
    numbers: { fontVariantNumeric: "tabular-nums" } satisfies CSSProperties,
    /** R1-16: the one hover for a form option (a deal choice, an auction rule, …). */
    optionHover: { backgroundColor: "#FCFAF9" } satisfies CSSProperties,
} as const;

/* ------------------------------------------------------------- The record --- */

export interface Measure {
    /** e.g. "Size", "Weight", "Height". */
    label: string;
    staging: string;
    v1: string;
    v2: string;
}

export interface RoundOneStyle {
    /** Matches the item in ./data.ts. */
    id: string;
    element: string;
    /** Staging page the value was read from. */
    page: string;
    /** The stylesheet rule that sets it on staging, trimmed to the properties that matter. */
    css: string;
    measures: Measure[];
    /** A v2 size under the 15px floor, kept because Round 1 asks for the current style. */
    belowFloor?: boolean;
    note?: string;
}

const m = (label: string, staging: string, v1: string, v2: string): Measure => ({ label, staging, v1, v2 });

export const STYLES: RoundOneStyle[] = [
    {
        id: "R1-01",
        element: "Staff bar (the links only Nimbus staff see, across the top)",
        page: "Every page",
        css: "#admin-nav { background: #efefef; border-bottom: 1px solid #bbb; height: 50px; }\n#admin-nav .nav-items { font-size: 13px; }\n#admin-nav .nav-items ul li a { color: #cc6899; margin-right: 25px; }",
        measures: [
            m("Bar height", "50px", "45px", "50px"),
            m("Bar colour", "#EFEFEF, #BBBBBB line", "#FAFAFA, light line", "#EFEFEF, #BBBBBB line"),
            m("Link text", "13px, weight 700", "15px, weight 600", "13px, weight 700"),
            m("Link colour", "#CC6899", "#A94579", "#CC6899"),
            m("Space between links", "25px", "20px", "25px"),
        ],
        belowFloor: true,
        note: "Product's list says \"internal nav bar\". Read as the staff bar: the black sidebar is not on the list.",
    },
    {
        id: "R1-02",
        element: "Publisher name in the page header, and its badge",
        page: "Realtime dashboard, key metrics",
        css: "/* react-select single value */ font-size: 26px; font-weight: 700; line-height: 36px;\n#pub-nav .account-label { font-size: 12px; font-weight: 800; letter-spacing: .96px; padding: 4px 7px; border-radius: 3px; text-transform: uppercase; background: #c1eceb; color: #039c9e; }",
        measures: [
            m("Name", "26px, weight 700", "24px, weight 800", "26px, weight 700"),
            m("Badge text", "12px, weight 800, 0.96px, upper case", "15px, weight 600", "12px, weight 800, 0.96px, upper case"),
            m("Badge shape", "4px 7px padding, 3px corners", "2px 8px padding, 8px corners", "4px 7px padding, 3px corners"),
        ],
        belowFloor: true,
    },
    {
        id: "R1-03",
        element: "Key metrics main numbers",
        page: "Key metrics",
        css: ".widget-number { font: 700 40px proxima-nova; }\n.widget-label { color: #000; font: 700 18px proxima-nova; }",
        measures: [
            m("Number", "40px, weight 700", "36px, weight 800, −0.9px", "40px, weight 700"),
            m("Card title", "18px, weight 700", "18px, weight 700", "18px, weight 700"),
            m("Today / High lines", "14px grey, value 600 black", "15px grey, value 700", "14px grey, value 600 black"),
        ],
        belowFloor: true,
    },
    {
        id: "R1-04",
        element: "One small upper case style for small labels",
        page: "Key metrics tabs, realtime dashboard, DAS setup",
        css: ".widget-btns .link-style { font: 800 12px / 43px proxima-nova; text-transform: uppercase; } /* + 0.75px */\n.DateInput_label { color: #888; font-size: 10px; font-weight: 700; text-transform: uppercase; }\nlabel.description-label { font-size: 11px; font-weight: 700; } /* .upper-case .spacing: 0.75px */",
        measures: [
            m("Tab labels", "12px, weight 800, 0.75px", "15px, weight 700", "12px, weight 800, 0.75px"),
            m("Start / end date", "10px, weight 700, grey", "15px, weight 600, 0.375px", "12px, weight 800, 0.75px"),
            m("Metric block labels", "11px, weight 700, 0.75px", "15px, weight 700, 0.375px", "12px, weight 800, 0.75px"),
            m("Form labels", "12px, weight 700, 0.8px", "15px, weight 700", "12px, weight 800, 0.75px"),
        ],
        belowFloor: true,
        note: "Staging has four versions of this label. v2 uses the tab label for all of them, as product asked.",
    },
    {
        id: "R1-05",
        element: "Realtime metric blocks: main numbers",
        page: "Realtime dashboard",
        css: "label.value-label { color: #039c9e; font-size: 26px; font-weight: 700; line-height: 30px; }",
        measures: [m("Number", "26px, weight 700, #039C9E", "24px, weight 800, #1F7F80", "26px, weight 700, #039C9E")],
    },
    {
        id: "R1-06",
        element: "Realtime metric blocks: platform lines",
        page: "Realtime dashboard",
        css: ".totals-wrap .totals-platform-row { color: #666; font-size: 11px; }\n.totals-wrap .totals-platform-label { letter-spacing: .4px; text-transform: uppercase; } /* weight 300 */\n.totals-wrap .totals-platform-value { font-weight: 700; }",
        measures: [
            m("Platform name", "11px, weight 300, 0.4px, upper case", "15px, weight 400, upper case", "12px, weight 400, 0.75px, upper case"),
            m("Its number", "11px, weight 700", "15px, weight 700", "12px, weight 700"),
        ],
        belowFloor: true,
        note: "Product: the tab label style at regular weight, the number bold.",
    },
    {
        id: "R1-07",
        element: "Section labels (\"Campaign Name\")",
        page: "Deal activation setup",
        css: "h6.bold { font-size: 20px; font-weight: 700; letter-spacing: -0.13px; line-height: 36px; }",
        measures: [m("Label", "20px, weight 700, −0.13px", "26px, weight 800", "20px, weight 700, −0.13px")],
        note: "First read from engineering's DAS port, then again from production DAS after the Nov 18 release: the same value.",
    },
    {
        id: "R1-08",
        element: "Table totals",
        page: "Realtime dashboard (table), buyer breakdown",
        css: ".beau-table-virtualized .total-cell { border-top: 3px solid #ddd; color: #039c9e; font-weight: 600; padding: 17px 14px; }",
        measures: [
            m("Text", "14px, weight 600, #039C9E", "15px, weight 700, #1F7F80, upper case", "14px, weight 600, #039C9E"),
            m("Line above", "3px #DDDDDD", "2px light grey", "3px #DDDDDD"),
        ],
        belowFloor: true,
    },
    {
        id: "R1-09",
        element: "Button text",
        page: "Every page with a button",
        css: "button.medium-button { font-size: 0.8125rem; letter-spacing: .75px; padding: 9px 20px; } /* weight 800, upper case */",
        measures: [
            m("Text", "13px, weight 800, 0.75px, upper case", "15px, weight 700, upper case", "13px, weight 800, 0.75px, upper case"),
            m("Centring", "padding only", "padding only (sits 1px high)", "centred in the box"),
        ],
        belowFloor: true,
        note: "Staging's button rule sets no font, so its buttons fall back to Arial. v2 keeps Proxima Nova; say if Arial is intended.",
    },
    {
        id: "R1-10",
        element: "Button height",
        page: "Every page with a button",
        css: "button.medium-button { padding: 9px 20px; } /* 33px tall, fully rounded */",
        measures: [m("Height", "33px", "40px", "33px")],
    },
    {
        id: "R1-11",
        element: "Height of filter, breakdown and date blocks",
        page: "Realtime dashboard",
        css: ".select-block-container { height: 62px; } /* date bar */\n.table-control-group /* checkbox row */ 42px; .dashboard-control-row /* filter row */ 43px",
        measures: [
            m("Date bar", "62px", "75px", "62px"),
            m("Checkbox row", "42px", "93px (wraps to two lines)", "42px"),
            m("Totals, platform and filters row", "43px", "56px", "43px"),
        ],
    },
    {
        id: "R1-12",
        element: "Filter and breakdown section labels",
        page: "Realtime dashboard",
        css: "/* \"Totals Only\", \"Platform\", \"Filters:\" */ font-size: 16px; font-weight: 700; color: #000;",
        measures: [m("Label", "16px, weight 700", "15px, weight 700", "16px, weight 700")],
    },
    {
        id: "R1-13",
        element: "Filter and breakdown check box text",
        page: "Realtime dashboard",
        css: "label.checkbox-container { font-size: 13px; font-weight: 700; color: #666; }\n.checkbox-container .checkmark { 20px square; border: 1px solid #999; border-radius: 3px; }",
        measures: [m("Text", "13px, weight 700, grey", "15px, weight 700, black", "13px, weight 700, grey")],
        belowFloor: true,
    },
    {
        id: "R1-14",
        element: "Tabular numbers everywhere",
        page: "Every page",
        css: ".beau-table-virtualized .data-cell { font-variant-numeric: tabular-nums; } /* tables only */",
        measures: [m("Numbers", "tables only", "most numbers", "every number")],
    },
    {
        id: "R1-15",
        element: "Table column labels and contents left align",
        page: "Every report table",
        css: ".beau-table-virtualized .header-cell { padding: 17px 14px 17px 40px; text-align: left; }\n.beau-table-virtualized .data-cell { padding: 17px 14px; }",
        measures: [
            m("Number columns", "left", "right-aligned (label and values)", "left"),
            m("Left padding, header / cell", "40px / 14px", "the same (32px first column, 16px others)", "the same as v1"),
        ],
        note: "Two shifts: on staging every header starts 26px to the right of its values; in v1 the number columns sat on the right while text columns sat on the left.",
    },
    {
        id: "R1-16",
        element: "One hover state for form options",
        page: "Deal activation setup",
        css: "/* No hover style on either the Deal options or the Auction Rules options. */",
        measures: [m("Hover", "none on either", "none on Deal, grey #FAFAFA on Auction Rules", "#FCFAF9 on both")],
        note: "Staging has no hover on these options, so there was no current style to copy.",
    },
];

/* --------------------------------------------------------------- Findings --- */

export interface Finding {
    id: string;
    /** What staging showed, in one or two sentences. */
    found: string;
    /** What v2 does about it. */
    v2: string;
    /** A question for product or engineering, if one is left. */
    open?: string;
}

/** What the Nov 18 staging capture showed for each Round 1 item, and what v2 does. Rendered on Round 1 › Summary. */
export const FINDINGS: Finding[] = [
    {
        id: "R1-01",
        found: "The staff bar is 50px tall on #EFEFEF with a #BBBBBB rule. Its links are 13px bold #CC6899, 25px apart. v1 drew it 45px tall with 15px links.",
        v2: "Staging's bar, exactly.",
        open: "\"Internal nav bar\" was read as this staff bar. If product meant the black sidebar, it is not changed yet.",
    },
    {
        id: "R1-02",
        found: "The account name is 26px, weight 700, black. Its badge is a 12px, weight 800 upper case label on a pale teal tint with 3px corners. v1 used 24px at weight 800 and a 15px badge.",
        v2: "Staging's name and badge.",
    },
    {
        id: "R1-03",
        found: "Key metrics numbers are 40px, weight 700, in teal #039C9E, blue #0275AF or black. Card titles are 18px bold. The Today and High lines are 14px grey with the value at weight 600. v1 used 36px at weight 800 with tighter spacing.",
        v2: "Staging's numbers, colours, titles and Today / High lines.",
    },
    {
        id: "R1-04",
        found: "Staging has four small upper case labels, not one: tab labels at 12px / 800 / 0.75px, date labels at 10px / 700 grey, metric block labels at 11px / 700 / 0.75px, and form labels at 12px / 700 / 0.8px.",
        v2: "One style for all of them, staging's tab label: 12px, weight 800, 0.75px, upper case. Colour follows the context.",
    },
    {
        id: "R1-05",
        found: "The realtime block's main number is 26px, weight 700, teal #039C9E, on a 30px line. v1 used 24px at weight 800 in a darker teal.",
        v2: "Staging's number.",
    },
    {
        id: "R1-06",
        found: "The platform lines are 11px grey: the platform name at weight 300 with 0.4px spacing, the number at weight 700.",
        v2: "As product asked: the name in the tab label style at regular weight (12px, 400, 0.75px), the number bold (12px, 700).",
    },
    {
        id: "R1-07",
        found: "Form section labels (\"Campaign Name\") are 20px, weight 700, -0.13px. First read from engineering's DAS port, then confirmed on production DAS after the Nov 18 release.",
        v2: "20px, weight 700, -0.13px on every form section title. v1 used 26px at weight 800.",
    },
    {
        id: "R1-08",
        found: "The totals row is lighter teal #039C9E at 14px, weight 600, under a 3px #DDDDDD rule. Read on Realtime and Buyer breakdown.",
        v2: "Staging's totals row on every report table (Realtime, Buyer breakdown, Full performance, Discrepancy reports, n+ payments, and Nimbus benchmarks since the Nov 18 release).",
        open: "Performance Insights shows a totals row only after a saved query runs, so it was not read there.",
    },
    {
        id: "R1-09",
        found: "Button text is 13px, weight 800, 0.75px, upper case. Staging's button rule sets no font, so its buttons fall back to Arial. The text sits on padding alone, which is why it looks 1px high.",
        v2: "13px, weight 800, 0.75px, upper case, centred in the box, in Proxima Nova.",
        open: "Is Arial intended on buttons? v2 assumes not.",
    },
    {
        id: "R1-10",
        found: "Buttons are 33px tall (9px top and bottom padding), fully rounded. v1's were 40px.",
        v2: "33px.",
    },
    {
        id: "R1-11",
        found: "On the realtime dashboard the date bar is 62px, the checkbox row 42px, and the Totals / Platform / Filters row 43px. v1's were 75px, 93px (wrapping to two lines) and 56px.",
        v2: "62px, 42px and 43px. The checkbox row fits on one line at 1440px.",
    },
    {
        id: "R1-12",
        found: "\"Totals Only\", \"Platform\" and \"Filters:\" are 16px bold black. \"Show Activity:\" is a smaller 13px bold.",
        v2: "16px bold on every filter and breakdown section label, including Performance Insights' bands. \"Show Activity:\" stays 13px, as on staging.",
    },
    {
        id: "R1-13",
        found: "Check box text in these rows is 13px, weight 700, grey #666. The box is 20px with a #999 border and 3px corners.",
        v2: "13px, weight 700, grey on the realtime, Performance Insights, buyer breakdown, benchmarks and filter check boxes.",
    },
    {
        id: "R1-14",
        found: "Staging uses tabular figures only inside tables. Numbers elsewhere (key metrics, metric blocks) use proportional figures.",
        v2: "Tabular figures on every number in the app, set once on the shell.",
    },
    {
        id: "R1-15",
        found: "Two different shifts. On staging every table header has 40px of left padding while its cells have 14px, so labels start 26px right of their values. In v1, number columns were right-aligned while text columns sat on the left.",
        v2: "Every column label and value aligns left. Header and cell share one left edge.",
    },
    {
        id: "R1-16",
        found: "Staging has no hover on either the Deal options or the Auction Rules options. v1 had no hover on Deal and a grey #FAFAFA on the rule cards.",
        v2: "One hover for both, the warm #FCFAF9 staging uses for a hovered dropdown option.",
        open: "Staging had no hover to copy, so the tint is a choice for product to confirm.",
    },
];

/* ----------------------------------------------------------------- Re-check --- */

export interface RecheckNote {
    /** What the release changed on staging. */
    change: string;
    /** What that means for Round 1. */
    effect: string;
    /** The Round 1 item it touches, if any. */
    id?: string;
}

/**
 * Staging read a second time on Nov 18, after that day's release: every page, its computed
 * styles and its stylesheet, compared element by element with the first read.
 * Rendered on Round 1 › Summary.
 */
export const RECHECK: RecheckNote[] = [
    {
        change: "Engineering's DAS port is off staging. Production's DAS is back: the one-page setup form and the campaigns table.",
        effect: "Staging now matches production everywhere. Section labels and form labels read the same on production DAS, so R1-07's open question is closed.",
        id: "R1-07",
    },
    {
        change: "Production DAS still has no hover on the Deal options or the Auction Rules options.",
        effect: "R1-16 stays as it is, and its question for product stays open.",
        id: "R1-16",
    },
    {
        change: "Nimbus benchmarks now has a totals row, in the same style as every other report table.",
        effect: "v2's Nimbus benchmarks table gets the same totals row.",
        id: "R1-08",
    },
    {
        change: "Passkeys were added to the login page and to Profile. The sidebar lost its manage keywords link.",
        effect: "Not part of Round 1. Nothing to change.",
    },
    {
        change: "Every other Round 1 element: the staff bar, account badge, key metrics, realtime blocks, small labels, tables, buttons, date bar, checkboxes and filters.",
        effect: "No change. Every value read the same as the first time.",
    },
];
