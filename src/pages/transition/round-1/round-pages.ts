import { story } from "../../intro/tokens";

/** The pages of Storybook › Transition › Round 1, by id. */
export const PAGES = {
    summary: "transition-round-1-summary--docs",
    changes: "transition-round-1-changes--docs",
    beforeAfter: "transition-round-1-before-and-after--docs",
    styleGuide: "transition-round-1-style-guide--docs",
    components: "transition-round-1-components-about--docs",
} as const;

export type RoundPage = keyof typeof PAGES;

/** The address of an item on one of the round's pages. */
export const at = (page: RoundPage, id: string) => `${story(PAGES[page])}#${id}`;

/** How far below the top of the window an item's card starts when it is jumped to: the Round 1 bar's height and a little air. */
export const NAV_OFFSET = 124;
