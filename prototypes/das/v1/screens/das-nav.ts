import { type GlobalNavItem, type GlobalNavSection, navSections } from "@/components/application/global-nav/config";

/**
 * The Deal Activation System section of the global nav.
 *
 * A prototype version sets its own items once, from its entry point. v2 points them at
 * v2 screens; v1 leaves them as labels, the way it was reviewed. Doing it here rather
 * than passing a prop down means the screens v2 reuses from v1 — manage campaigns, the
 * campaign views — get the links too, without v1 needing to know v2 exists.
 *
 * Each prototype version is its own page and so its own module instance, so one version's
 * nav can never leak into another's.
 */

/** Reference nav, plus the proposed "manage keywords" entry. Labels only, no links. */
export const DAS_NAV_ITEMS: GlobalNavItem[] = [
    { key: "manage assets", label: "manage assets" },
    { key: "keyword library", label: "manage keywords", badge: "new" },
    { key: "deal activation setup", label: "deal activation setup" },
    { key: "manage campaigns", label: "manage campaigns" },
];

let current: GlobalNavItem[] = DAS_NAV_ITEMS;

export const setDasNavItems = (items: GlobalNavItem[]) => {
    current = items;
};

/** Swap the DAS section's items; everything else in the reference nav stays put. */
export const dasNavSections = (items?: GlobalNavItem[]): GlobalNavSection[] => {
    const use = items ?? current;
    return navSections.map((section) => (section.id === "das" ? { ...section, items: use } : section));
};
