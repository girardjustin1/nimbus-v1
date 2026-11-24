/**
 * v3's own targeting data.
 *
 * Forked from v1 rather than edited there, because Round 1 and Round 2 are the versions
 * that were reviewed and must keep rendering exactly as they did.
 *
 * The app list is long on purpose. Product's note on 2 Oct was that a publisher can
 * have a thousand apps and that these pickers "have to plan on being long searchable
 * lists" — five apps let a browse-first picker look fine while hiding the thing that
 * breaks it.
 *
 * Twenty-six apps on iOS and Android, so fifty-two rows and every letter of the
 * alphabet starts one — plus a Unity build of the four games. Unity became a platform
 * of its own on 19 Oct, at Product's word; a publisher integrating through the Unity
 * SDK targets it next to iOS and Android. A type-ahead whose first keystroke can come back empty
 * reads as broken rather than as a letter nobody used; `library-coverage.test.ts`
 * holds that down for apps the same way it does for deals, keywords and assets.
 */

export type Platform = "iOS" | "Android" | "Unity";

export interface TargetApp {
    id: string;
    name: string;
    platform: Platform;
    /** What the app is actually identified by in a bid request. */
    bundle: string;
}

const PLATFORMS: Platform[] = ["iOS", "Android"];

/** Every platform a campaign can target, in the order the Platform module lists them. */
export const ALL_PLATFORMS: Platform[] = ["iOS", "Android", "Unity"];

/** The games, which also ship a Unity build. */
const UNITY_GAMES = ["Island Golf", "Quiz Night", "Word Streak", "Xtra Innings"];

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
    [...PLATFORMS, ...(UNITY_GAMES.includes(name) ? (["Unity"] as Platform[]) : [])].map((platform) => ({
        id: `${slug(name)}-${platform.toLowerCase()}`,
        name,
        platform,
        bundle: `com.testpublisher.${slug(name)}`,
    })),
);

/* --------------------------------------------------------- Device Language --- */

/**
 * Device Language — back on 19 Oct. The Extended Targeting charter lists it as a new
 * standard target (the device's OS locale, as ISO 639-1 codes); it was dropped on 1 Oct
 * and Product reinstated it once it was confirmed to be in the charter.
 *
 * Long and A–Z like the other libraries, so the type-ahead never comes back empty.
 */
export interface DeviceLanguage {
    id: string;
    name: string;
}

export const LANGUAGES: DeviceLanguage[] = [
    { id: "ar", name: "Arabic" },
    { id: "bn", name: "Bengali" },
    { id: "zh", name: "Chinese" },
    { id: "cs", name: "Czech" },
    { id: "da", name: "Danish" },
    { id: "nl", name: "Dutch" },
    { id: "en", name: "English" },
    { id: "fi", name: "Finnish" },
    { id: "fr", name: "French" },
    { id: "de", name: "German" },
    { id: "el", name: "Greek" },
    { id: "he", name: "Hebrew" },
    { id: "hi", name: "Hindi" },
    { id: "hu", name: "Hungarian" },
    { id: "id", name: "Indonesian" },
    { id: "it", name: "Italian" },
    { id: "ja", name: "Japanese" },
    { id: "kk", name: "Kazakh" },
    { id: "ko", name: "Korean" },
    { id: "lv", name: "Latvian" },
    { id: "ms", name: "Malay" },
    { id: "nb", name: "Norwegian" },
    { id: "or", name: "Odia" },
    { id: "pl", name: "Polish" },
    { id: "pt", name: "Portuguese" },
    { id: "qu", name: "Quechua" },
    { id: "ro", name: "Romanian" },
    { id: "ru", name: "Russian" },
    { id: "es", name: "Spanish" },
    { id: "sv", name: "Swedish" },
    { id: "th", name: "Thai" },
    { id: "tr", name: "Turkish" },
    { id: "uk", name: "Ukrainian" },
    { id: "vi", name: "Vietnamese" },
    { id: "cy", name: "Welsh" },
    { id: "xh", name: "Xhosa" },
    { id: "yo", name: "Yoruba" },
    { id: "zu", name: "Zulu" },
];

export const languageById = (id: string) => LANGUAGES.find((l) => l.id === id);

/** "en" → "English (en)". */
export const languageLabel = (id: string) => {
    const l = languageById(id);
    return l ? `${l.name} (${l.id})` : id;
};

export const appById = (id: string) => APP_LIST.find((a) => a.id === id);
