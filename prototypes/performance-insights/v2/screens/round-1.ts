/**
 * Round 1 (product's list of Nov 17, 2026): the styles v2 takes back from the dashboard
 * live today. The values live in src/pages/transition/round-1-styles.ts, shared with
 * Storybook › Transition › Round 1, so a number is written once.
 */
export { STAGING, TOKENS as R1 } from "@/pages/transition/round-1-styles";

import type { CSSProperties } from "react";
import { STAGING, TOKENS } from "@/pages/transition/round-1-styles";

/**
 * Staging's Start Date / End Date label: R1-04's small upper case, at 11px rather than 12
 * (type scrape of staging's Performance Insights, 25 Nov 2026). Kept here, not in the shared
 * Round 1 tokens, because it is Performance Insights v2's only.
 */
export const DATE_LABEL = { ...TOKENS.smallUpper, fontSize: 11, lineHeight: "15px", color: STAGING.greyLight } satisfies CSSProperties;
