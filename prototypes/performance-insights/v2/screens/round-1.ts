/**
 * Round 1 (product's list of Nov 17, 2026): the styles v2 takes back from the dashboard
 * live today. The values live in src/pages/transition/round-1-styles.ts, shared with
 * Storybook › Transition › Round 1, so a number is written once.
 */
import type { CSSProperties } from "react";
import { STAGING, TOKENS } from "@/pages/transition/round-1-styles";

export { STAGING };

/**
 * Round 1's tokens, with one change from the design-refresh type specimen (25 Nov 2026):
 * the text beside a check box sets its 20px line height (13 / 700 / 20 / #666).
 */
export const R1 = { ...TOKENS, checkboxText: { ...TOKENS.checkboxText, lineHeight: "20px" } };

/**
 * Staging's Start Date / End Date label: R1-04's small upper case, at 11px rather than 12
 * (type scrape of staging's Performance Insights, 25 Nov 2026; the type specimen agrees).
 * Kept here, not in the shared Round 1 tokens, because it is Performance Insights v2's only.
 */
export const DATE_LABEL = { ...TOKENS.smallUpper, fontSize: 11, lineHeight: "15px", color: STAGING.greyLight } satisfies CSSProperties;

/** The type specimen's sidebar section title ("Reporting"): 12 / 700 / 0.04em / upper case / #A4A7AE. */
export const NAV_SECTION = { fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: "#A4A7AE" } as const;

/** The type specimen's hint, empty-state and disclaimer colour (15 / 400 / 24). */
export const MUTED_TEXT = "#667085";
