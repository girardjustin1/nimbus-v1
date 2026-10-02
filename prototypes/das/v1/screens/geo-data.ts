/**
 * Countries available as a geo target, grouped by region.
 *
 * Grouped rather than one flat list because a campaign is usually scoped regionally —
 * "Western Europe" is a far more common intent than picking eleven countries one at a
 * time — and because an alphabetical list of this length is only usable by search.
 */

export interface GeoRegion {
    region: string;
    countries: string[];
}

export const GEO_REGIONS: GeoRegion[] = [
    { region: "North America", countries: ["United States", "Canada", "Mexico"] },
    {
        region: "Western Europe",
        countries: ["United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Belgium", "Austria", "Switzerland", "Spain", "Portugal", "Italy"],
    },
    { region: "Nordics", countries: ["Sweden", "Norway", "Denmark", "Finland", "Iceland"] },
    { region: "Central & Eastern Europe", countries: ["Poland", "Czechia", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Croatia", "Ukraine"] },
    { region: "Asia Pacific", countries: ["Japan", "South Korea", "Australia", "New Zealand", "Singapore", "Malaysia", "Indonesia", "Thailand", "Philippines", "Vietnam", "India"] },
    { region: "Latin America", countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru"] },
    { region: "Middle East & Africa", countries: ["United Arab Emirates", "Saudi Arabia", "Israel", "Turkey", "South Africa", "Nigeria", "Kenya", "Egypt"] },
];

export const ALL_GEOS = GEO_REGIONS.flatMap((g) => g.countries);
