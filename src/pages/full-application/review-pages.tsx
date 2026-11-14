import { Pill, protoUrl, td, th } from "../nov-13/doc-ui";

/**
 * Full Application · How to review — the pages to compare with staging, in the order
 * that matters most (13 Nov call: Performance Insights first, then the pages that share
 * its pieces). Each row opens the full application at that page.
 */
const PAGES: { area: string; page: string; route: string; look: string }[] = [
    {
        area: "Reporting",
        page: "Performance Insights",
        route: "pi-query",
        look: "Date row, metric and breakdown bands, chart type bar, report table — the pattern every reporting page reuses.",
    },
    { area: "Reporting", page: "Realtime dashboard", route: "realtime", look: "Summary tiles, the revenue and metrics chart, the grouped report table." },
    { area: "Reporting", page: "Key metrics", route: "key-metrics", look: "The card grid and each card's tabs." },
    { area: "Reporting", page: "Buyer breakdown", route: "buyer-breakdown", look: "Donuts, the shared legend, the table view." },
    { area: "Reporting", page: "Nimbus benchmarks", route: "benchmarks", look: "Paired tiles and the charts (an open decision: one chart or one per metric)." },
    { area: "Demand", page: "Configure demand", route: "demand-configure", look: "The partner list, then a partner's configuration form." },
    { area: "Demand", page: "Manage active demand", route: "demand-active", look: "The list table, toggles and Third-Party Viewability." },
    { area: "Demand", page: "n+ payments", route: "nplus-payments", look: "Month sections, search, totals." },
    { area: "DAS", page: "Manage campaigns", route: "campaigns", look: "As DAS Round 6 left it." },
    { area: "AdOps", page: "Ad blocking", route: "ad-blocking", look: "The stacked sections — inputs, block buttons, lists." },
    { area: "AdOps", page: "Floors", route: "floors", look: "Tiles, custom floors, the Configure Floors tab." },
    { area: "AdOps", page: "Activity", route: "activity", look: "Filter bands and the log." },
    { area: "Settings", page: "Sign in · Reporting API", route: "settings", look: "Form fields and the endpoints list." },
];

export const ReviewPages = () => (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0" }}>
        <thead>
            <tr>
                <th style={th}>#</th>
                <th style={th}>Page</th>
                <th style={th}>Look at</th>
                <th style={th}>Open</th>
            </tr>
        </thead>
        <tbody>
            {PAGES.map((p, i) => (
                <tr key={p.route}>
                    <td style={{ ...td, color: "#98A2B3" }}>{i + 1}</td>
                    <td style={td}>
                        <div style={{ fontWeight: 700, color: "#101828" }}>{p.page}</div>
                        <div style={{ color: "#667085" }}>{p.area}</div>
                    </td>
                    <td style={td}>{p.look}</td>
                    <td style={td}>
                        <Pill href={protoUrl(p.route)}>Prototype</Pill>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);
