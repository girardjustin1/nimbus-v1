/**
 * The deals a campaign can be added to — fifty of them, for Round 3.
 *
 * Round 1 shipped three, which is why Add to existing deal could get away with being a
 * plain dropdown. Three is not what an account looks like after a year: deals accrete,
 * nobody deletes them, and the one you want is the one you set up in March. Fifty is
 * the number Kristen used for the other libraries on 2 Oct, so it is the number used
 * here, and at fifty the control has to be a type-ahead.
 *
 * Two things about the names.
 *
 * **Every letter of the alphabet starts at least one of them.** Whatever you type
 * first, something comes back — a dead end on the first keystroke makes a type-ahead
 * feel broken when it is merely empty. `deal-data.test.ts` holds that property down.
 *
 * **There is no shared prefix.** Round 1's three were "Test Deal — Fall Launch" and so
 * on, and a prefix every row shares is a prefix that filters nothing: typing t, e, s,
 * d, a or l matched all fifty. Real deals are named after what they are for, so these
 * are too. The first three keep Round 1's ids and the words they were known by.
 */

export interface Deal {
    id: string;
    label: string;
    supportingText: string;
}

/**
 * Round 1's three come first and in order: `fill.dealId()` rotates through those ids,
 * and every seeded preset points at D-10482.
 */
const SEEDED_IDS = ["D-10482", "D-10517", "D-10533"];

const NAMES = [
    // Round 1's three, by the names they were reviewed under.
    "Fall Launch",
    "21+",
    "Garden",
    // A–Z, roughly two apiece.
    "Arcade Quest",
    "Autumn Drive",
    "Back to School",
    "Bistro Rewards",
    "Casual Gamers",
    "Cyber Monday",
    "Daily Streak",
    "Dog Lovers",
    "Early Adopters",
    "Endless Runner",
    "Holiday Gifting",
    "Home Improvement",
    "Inline Inventory",
    "iOS Only",
    "January Reset",
    "Junior Leagues",
    "Kid Safe",
    "Kitchen Essentials",
    "Lapsed Users",
    "Luxury Retail",
    "March Madness",
    "Music Festivals",
    "New Parents",
    "Night Owls",
    "Opening Weekend",
    "Outdoor & Camping",
    "Pet Owners",
    "Puzzle Players",
    "Quarterly Brand",
    "Quick Serve Dining",
    "Rewarded Inventory",
    "Road Trip",
    "Streaming Cord-Cutters",
    "Super Bowl",
    "Travel Summer",
    "Trivia Night",
    "Upgrade Nudge",
    "Urban Commuters",
    "Valentine's Day",
    "Video Premium",
    "Weekend Warriors",
    "Winter Sports",
    "X-Platform Pilot",
    "Xmas Countdown",
    "Year End Review",
    "Youth Sports",
    "Zero Spend Winback",
];

export const deals: Deal[] = NAMES.map((label, i) => {
    const id = SEEDED_IDS[i] ?? `D-${10550 + i * 13}`;
    return { id, label, supportingText: id };
});

export const dealById = (id?: string) => deals.find((d) => d.id === id);
