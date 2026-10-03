/**
 * v3's own targeting data.
 *
 * Forked from v1 rather than edited there, because Round 1 and Round 2 are the versions
 * that were reviewed and must keep rendering exactly as they did.
 *
 * The app list is long on purpose. Kristen's note on 2 Oct was that a publisher can
 * have a thousand apps and that these pickers "have to plan on being long searchable
 * lists" — five apps let a browse-first picker look fine while hiding the thing that
 * breaks it.
 *
 * Twenty-six apps on two platforms each, so there are fifty-two rows and every letter
 * of the alphabet starts one. A type-ahead whose first keystroke can come back empty
 * reads as broken rather than as a letter nobody used; `library-coverage.test.ts`
 * holds that down for apps the same way it does for deals, keywords and assets.
 */

export type Platform = "iOS" | "Android";

export interface TargetApp {
    id: string;
    name: string;
    platform: Platform;
    /** What the app is actually identified by in a bid request. */
    bundle: string;
}

const PLATFORMS: Platform[] = ["iOS", "Android"];

const APP_NAMES = [
    "Aurora Alarm",
    "Budget Jar",
    "Commute Cast",
    "Daily Scores",
    "Echo Notes",
    "Fit Log",
    "Garage Sale",
    "Habit Loop",
    "Island Golf",
    "Jetlag Journal",
    "Kitchen Timer",
    "Local News Now",
    "Match Report",
    "Night Sky",
    "Ocean Tides",
    "Pocket Radio",
    "Quiz Night",
    "Recipe Box",
    "Sample App",
    "Trail Tracker",
    "Urban Transit",
    "Vinyl Crate",
    "Word Streak",
    "Xtra Innings",
    "Yoga Daily",
    "Zen Garden",
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

export const APP_LIST: TargetApp[] = APP_NAMES.flatMap((name) =>
    PLATFORMS.map((platform) => ({
        id: `${slug(name)}-${platform.toLowerCase()}`,
        name,
        platform,
        bundle: `com.testpublisher.${slug(name)}`,
    })),
);

export const appById = (id: string) => APP_LIST.find((a) => a.id === id);
