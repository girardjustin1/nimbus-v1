import type { GlobalNavSection } from "@/components/application/global-nav/config";

/**
 * Lets a prototype that reuses these screens supply its own Global Nav.
 *
 * Standalone, Performance Insights Round 1 keeps its nav as reviewed: labels, no links.
 * DAS v6 shows these screens in its screen picker (section 7), and there the sidebar has
 * to lead back to DAS, so v6 hands over its own linked sections from its entry point.
 * Each prototype is its own page and module instance, so one never leaks into another.
 */
let override: GlobalNavSection[] | undefined;

export const setNavSectionsOverride = (sections: GlobalNavSection[]) => {
    override = sections;
};

export const navSectionsOverride = () => override;
