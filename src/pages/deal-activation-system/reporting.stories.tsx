import type { Meta, StoryObj } from "@storybook/react-vite";
import { DasOverview, QueryBuilder } from "./reporting";

/**
 * Deal Activation System → Reporting.
 *
 * Reporting that can keep up with keyword targeting, within the charter guardrail
 * (aggregate keyword metrics on screen; per-keyword via CSV/API).
 */
const meta = {
    title: "Deal Activation System/Reporting",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Concept A: a DAS reporting home with DAS vs Open Marketplace split and campaign delivery. */
export const ConceptAOverview: Story = { name: "Concept A · DAS overview", render: () => <DasOverview /> };

/** Concept B: metrics, breakdowns and filters as chips. */
export const ConceptBQueryBuilder: Story = { name: "Concept B · Query builder", render: () => <QueryBuilder /> };

/** Concept B with the grouped, searchable breakdown picker open (Keyword locked: CSV/API only). */
export const ConceptBPickerOpen: Story = { name: "Concept B · Breakdown picker open", render: () => <QueryBuilder pickerOpen /> };
