import type { ProtoScreen } from "../../shared/prototype-frame";
import { Explorer, QuestionBar, StartPage } from "./screens/pi-concepts";

/**
 * Performance Insights prototype v1 — screen registry (frozen copy of the Round 1 concepts).
 * Order here is the order of the toolbar's previous/next arrows.
 */
export const screens: ProtoScreen[] = [
    {
        id: "start",
        area: "A · Start page",
        title: "Templates & saved queries",
        description: "Begin from a ready-made question instead of a blank form.",
        render: () => <StartPage />,
    },
    {
        id: "question-bar",
        area: "B · Question bar",
        title: "Results",
        description: "The query as one sentence; deltas vs the previous period.",
        render: () => <QuestionBar />,
    },
    {
        id: "question-bar-draft",
        area: "B · Question bar",
        title: "Edited, not yet run",
        description: "Results go stale; nothing reloads until Run.",
        render: () => <QuestionBar draft />,
    },
    {
        id: "explorer",
        area: "C · Explorer",
        title: "Pivot with drill-down",
        description: "Rows / Columns / Values, App → Demand Source, heatmap cells.",
        render: () => <Explorer />,
    },
];
