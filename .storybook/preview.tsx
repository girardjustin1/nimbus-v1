import type { Preview } from "@storybook/react-vite";
// Import the Untitled UI + Nimbus design system styles (Tailwind + theme tokens)
// so components render with the correct teal brand theme inside Storybook.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        options: {
            storySort: {
                method: "alphabetical",
                // Seven folders, top to bottom (14 Nov cleanup; Transition added 17 Nov):
                //   Start Here     what this is, the rules, the plan, how to review
                //   Transition     product's lists, round by round, until Storybook is final
                //   Prototypes     the screens: the full application, then DAS
                //   Design System  what gets ported: styles, tokens, components
                //   Reviews        one folder per review, newest first, same pages in each
                //   Research       audits of the live product, engineering's constraints
                //   Archive        superseded work, kept for reference
                // Old addresses redirect to the new ones (public/legacy-redirects.js).
                order: [
                    "Start Here",
                    ["Overview", "Style guide", "Process & roadmap", "How to review"],
                    "Transition",
                    [
                        "Overview",
                        "Round 1",
                        [
                            "Summary",
                            "Changes",
                            "Before and after",
                            "Style guide",
                            "Components",
                            [
                                "About",
                                "Staff bar and page header",
                                "Key metrics card",
                                "Small upper case labels",
                                "Realtime metric block",
                                "Report controls",
                                "Report table",
                                "Buttons",
                                "Section labels and form options",
                            ],
                            "Screens",
                            ["Reporting", ["Key metrics", "Realtime dashboard", "Performance Insights", "Buyer breakdown", "Nimbus benchmarks"], "*"],
                            "*",
                        ],
                        "*",
                    ],
                    "Prototypes",
                    [
                        "Full application",
                        [
                            "Screen index",
                            "Reporting",
                            ["Key metrics", "Realtime dashboard", "Performance Insights", "Buyer breakdown", "Nimbus benchmarks"],
                            "Demand",
                            ["Configure demand", "Manage active demand", "Manage active n+ demand", "n+ payments"],
                            "Deal Activation System",
                            ["Campaign setup", "Manage assets", "Manage keywords", "Manage campaigns"],
                            "AdOps",
                            ["Ad blocking", "Floors", "Manage test mode", "Discrepancy reports", "Activity"],
                            "SDK & Docs",
                            "Finance",
                            "Settings",
                        ],
                        "Deal Activation System",
                        [
                            "Rounds",
                            "Campaign Setup Spec",
                            "Campaign Setup",
                            [
                                "Page",
                                "Sections",
                                ["Deal", "Campaign Name", "Auction Rules", "Priority", "Budget", "Flight Dates", "Frequency Cap", "Targeting", "Creative"],
                                "Targeting",
                                ["Geos", "Platform", "Apps", "Ad Unit", "Keywords"],
                                "Controls",
                                "Rail",
                                ["Campaign Summary", "Review Modal"],
                            ],
                        ],
                    ],
                    "Design System",
                    [
                        "Styles",
                        ["Color", "Typography", "Icons", "Elevation", "Shape", "Logos"],
                        "Nimbus Tokens",
                        ["Overview", "*"],
                        "Base Components",
                        "Application UI",
                        ["App Navigation - Sidebar", "*"],
                        "Chart library",
                        [
                            "Overview",
                            "Gallery",
                            "Line Chart",
                            "Area Chart",
                            "Bar Chart",
                            "Pie Chart",
                            "Donut Chart",
                            "Radar Chart",
                            "Activity Gauge",
                            "Progress Circle",
                            "Metric Card",
                            "Combo Chart",
                            "Heatmap",
                            "Funnel",
                            "Scatter Chart",
                            "Treemap",
                            "Chart Card & Legend",
                        ],
                        "Imagery",
                        ["Assets", ["Goal Illustrations", "Ad Formats"]],
                        "Account Login",
                        ["Sign up", "Log in", "Forgot Password", "Verify Email"],
                    ],
                    // Every review has the same pages, in this order: Summary, Walkthrough
                    // (where one was written), Changes, Concepts (where there were options).
                    "Reviews",
                    [
                        "Nov 13 · Full application",
                        ["Summary"],
                        "Nov 6 · Delivery chart",
                        ["Summary", "Walkthrough", "Changes", "Concepts", ["A to E", "F to I on one chart"]],
                        "Oct 29 · Reporting",
                        ["Summary", "Walkthrough", "Changes"],
                        "Oct 26 · Nimbus tokens",
                        ["Summary", "Walkthrough", "Changes"],
                        "Oct 17 · After publishing",
                        [
                            "Summary",
                            "Changes",
                            "Concepts",
                            ["Campaign Health", "Campaigns Table", "Overview Summary", "Full Performance Layout", "Keyword Reporting"],
                        ],
                        "Oct 5 · Type rules",
                        ["Summary", "Changes", "Concepts"],
                        "Sept 22 · Round 1",
                        ["Summary", "Changes"],
                    ],
                    "Research",
                    ["Typography Audit", "Typography Rules", "Table audit", ["Audit", "*"], "Engineering constraints"],
                    "Archive",
                    [
                        "About the archive",
                        "App Screens",
                        "DAS early concepts",
                        [
                            "Overview",
                            "Round 1",
                            ["Campaign Setup (One Page)", "Targeting", "Keyword Library", "Manage Campaigns", "Reporting", "Components"],
                            "Round 2 · Oct 1",
                        ],
                        "DAS Studio concept",
                        ["Overview", "Screens", "Components"],
                        "Performance Insights concepts",
                        ["Overview", "Concepts"],
                    ],
                    "*",
                ],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
    },
};

export default preview;
