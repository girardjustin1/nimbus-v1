import type { GlobalNavItem } from "@/components/application/global-nav/config";

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
