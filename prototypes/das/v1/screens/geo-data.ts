/**
 * The geo taxonomy: regions, and the countries inside them.
 *
 * Region names are the product's own — AFRICA, APAC, EUROPE, LATAM, MIDEAST, NORAM,
 * OTHERS — read off the existing Geos selector rather than invented. An earlier version
 * of this file used our own grouping (Nordics, Western Europe, and so on); that was a
 * nicer taxonomy and the wrong one, because a publisher who knows DAS knows these seven.
 *
 * OTHERS is the product's catch-all for territories that belong to no region, and it is
 * a real selectable group, not a rounding error: it is where Antarctica and the island
 * territories live.
 */

export interface GeoRegion {
    region: string;
    countries: string[];
}

export const GEO_REGIONS: GeoRegion[] = [
    {
        region: "AFRICA",
        countries: ["Algeria", "Egypt", "Ethiopia", "Ghana", "Ivory Coast", "Kenya", "Morocco", "Nigeria", "Senegal", "South Africa", "Tanzania", "Tunisia", "Uganda"],
    },
    {
        region: "APAC",
        countries: [
            "Australia", "Bangladesh", "Cambodia", "China", "Hong Kong", "India", "Indonesia", "Japan", "Malaysia", "New Zealand",
            "Pakistan", "Philippines", "Singapore", "South Korea", "Sri Lanka", "Taiwan", "Thailand", "Vietnam",
        ],
    },
    {
        region: "EUROPE",
        countries: [
            "Austria", "Belgium", "Bulgaria", "Croatia", "Czechia", "Denmark", "Finland", "France", "Germany", "Greece",
            "Hungary", "Iceland", "Ireland", "Italy", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Slovakia",
            "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom",
        ],
    },
    {
        region: "LATAM",
        countries: [
            "Anguilla", "Antigua And Barbuda", "Argentina", "Aruba", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil",
            "Chile", "Colombia", "Costa Rica", "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Honduras",
            "Jamaica", "Mexico", "Panama", "Paraguay", "Peru", "Trinidad And Tobago", "Uruguay", "Venezuela",
        ],
    },
    {
        region: "MIDEAST",
        countries: ["Bahrain", "Israel", "Jordan", "Kuwait", "Lebanon", "Oman", "Qatar", "Saudi Arabia", "Turkey", "United Arab Emirates"],
    },
    { region: "NORAM", countries: ["Canada", "United States"] },
    {
        region: "OTHERS",
        countries: ["Antarctica", "Bouvet Island", "French Southern Territories", "Heard Island And McDonald Islands", "South Georgia And The South Sandwich Islands", "Unknown"],
    },
];

export const ALL_GEOS = GEO_REGIONS.flatMap((g) => g.countries);

/** Which region a country belongs to, for the breadcrumb on a selected chip. */
export const REGION_OF: Record<string, string> = Object.fromEntries(GEO_REGIONS.flatMap((g) => g.countries.map((c) => [c, g.region])));
