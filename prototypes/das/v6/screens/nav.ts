import type { GlobalNavItem, GlobalNavSection } from "@/components/application/global-nav/config";
import { dasNavSections } from "../../v1/screens/das-nav";

/**
 * The DAS nav, wired to v3's own screens.
 *
 * In Round 1 these were labels only. Here each one goes somewhere, because the point of
 * Round 3 keeps Round 2's structure: an asset library and a keyword library you keep, a setup flow
 * that pulls from both, and the campaigns that come out. You should be able to walk that
 * loop from the sidebar rather than the screen picker.
 */
export const V3_NAV_ITEMS: GlobalNavItem[] = [
    { key: "manage assets", label: "manage assets", href: "#/asset-view" },
    { key: "keyword library", label: "manage keywords", href: "#/keyword-view", badge: "new" },
    { key: "deal activation setup", label: "deal activation setup", href: "#/setup-empty" },
    { key: "manage campaigns", label: "manage campaigns", href: "#/campaigns" },
];

/** 27 Oct: "performance insights" opens the early concepts (screen picker › 7). */
export const withReportingLinks = (sections: GlobalNavSection[]): GlobalNavSection[] =>
    sections.map((section) =>
        section.id === "reporting"
            ? { ...section, items: section.items.map((item) => (item.key === "performance insights" ? { ...item, href: "#/start" } : item)) }
            : section,
    );

/** v6's whole Global Nav, linked: what every DAS screen shows, and what the reused Performance Insights screens get too. */
export const V6_NAV_SECTIONS = withReportingLinks(dasNavSections(V3_NAV_ITEMS));
