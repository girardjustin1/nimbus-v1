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
                    // 1) Styles / foundations
                    "Styles",
                    ["Color", "Typography", "Icons", "Elevation", "Shape", "Logos"],
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
                    ["Overview", "Campaign Setup (One Page)", "Targeting", "Keyword Library", "Manage Campaigns", "Reporting"],
                    // 7) Active project — Performance Insights redesign concepts
                    "Performance Insights",
                    ["Overview", "Concepts"],
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
