import type { Preview } from "@storybook/react-vite";

// Import the Untitled UI + Nimbus design system styles (Tailwind + theme tokens)
// so components render with the correct teal brand theme inside Storybook.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        options: {
            storySort: {
                method: "alphabetical",
                order: [
                    // 0) Welcome / overview page (always first)
                    "Introduction",
                    // 0b) Research on the live product, directly under the introduction.
                    //     These document another application and change nothing here.
                    "Audits",
                    // 1) Styles / foundations
                    "Styles",
                    ["Color", "Typography", "Icons", "Elevation", "Shape", "Logos"],
                    // Shared SVG illustrations and animated consumer ad previews.
                    "Imagery",
                    ["Assets", ["Goal Illustrations", "Ad Formats"]],
                    // 2) Base components (flat — no sub-folders)
                    "Base Components",
                    // 3) Application UI (complex components) — nav first
                    "Application UI",
                    ["App Navigation - Sidebar", "*"],
                    // 4) Auth page templates
                    "Account Login",
                    ["Sign up", "Log in", "Forgot Password", "Verify Email"],
                    // 5) App Screens
                    "App Screens",
                    // 6) Active project — DAS screen concepts
                    "Deal Activation System",
                    [
                        "Overview",
                        "Round 2 · Oct 1",
                        "Round 1 Concepts",
                        ["Campaign Setup (One Page)", "Targeting", "Keyword Library", "Manage Campaigns", "Reporting", "Components"],
                        "Studio Concept",
                        ["Overview", "Screens", "Components"],
                    ],
                    // 7) Active project — Performance Insights redesign concepts
                    "Performance Insights",
                    [
                        "Overview",
                        "Concepts",
                        "Charts",
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
                    ],
                    "*",
                    // 8) Sept 22 review — staged revisions, last so it reads as a batch
                    //    of pending changes rather than part of the concepts themselves.
                    "Sept 22",
                    [
                        "Overview",
                        "1 Reporting placement",
                        "2 Date only, no time",
                        "3 Stacked revenue chart",
                        "4 Behind pace is clickable",
                        "5 Sample advertisers stay fictional",
                        "6 The stepper is recorded, not recommended",
                        "7 Preview is an approximation",
                        "8 Concept letters get a scope",
                    ],
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
