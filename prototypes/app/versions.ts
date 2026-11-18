import type { ProtoMeta, ProtoVersion } from "../shared/prototype-frame";

/**
 * The full Nimbus publisher application, rebuilt screen by screen on the Nov 13 style
 * guide — the Nimbus tokens, base components and rules settled through DAS Round 6
 * (prototypes/das/v6, forked as this app's starting point). Add a row when you cut a
 * new version folder.
 */
export const versions: ProtoVersion[] = [
    {
        id: "v1",
        label: "Nov 13 style guide",
        date: "November 13, 2026",
        summary:
            "Every screen of the Nimbus publisher dashboard, rebuilt on the Nov 13 style guide: reporting (key metrics, realtime dashboard, Performance Insights, buyer breakdown, benchmarks), demand (configure, active and Nimbus+ demand, Nimbus+ payments), the Deal Activation System as settled in Round 6, AdOps (ad blocking, floors, test mode, discrepancy reports, activity), SDKs, finance and settings. One sidebar that leads everywhere, one set of tables, tabs, fields and charts, nothing under 15px, and pages that state the data rather than coach.",
    },
    {
        id: "v2",
        label: "Round 1 styles",
        date: "November 18, 2026",
        summary:
            "v1 with product's Round 1 list applied (17 Nov 2026): the staff bar, publisher name, headline numbers, small labels, buttons, filter rows and table totals go back to the styles live on the dashboard today, captured from staging on 18 Nov; every number uses tabular figures, every table column lines up on the left, and form options share one hover. Below 15px only where Round 1 asks for the current style; everything else is v1.",
    },
];

export const latest = versions[versions.length - 1].id;

export const meta = (current: string): ProtoMeta => ({
    name: "Nimbus · Full application",
    tagline: "The whole publisher dashboard on the Nov 13 style guide, built on DAS Round 6.",
    accent: "#A94579",
    soft: "#FCE7F1",
    versions,
    current,
});
