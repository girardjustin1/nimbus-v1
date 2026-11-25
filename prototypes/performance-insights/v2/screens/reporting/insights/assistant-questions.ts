import type { FilterState } from "../../nimbus-ui";
import type { ChartKind, Dim, Metric, Range } from "./insights-data";

/** Round 2 · C14: the questions the prototype's assistant answers (see ./assistant.tsx). */
export type QuestionId = "revenue" | "countries" | "fill";

export interface ReportChange {
    metrics?: Metric[];
    breakdown?: Dim[];
    chart?: ChartKind;
    charted?: Metric[];
    /** C16's chat builds a whole query: its filters, dates and comparison too. */
    filters?: FilterState;
    range?: Range;
    compare?: boolean;
}

export const QUESTIONS: Record<QuestionId, string> = {
    revenue: "Why did revenue change?",
    countries: "Which countries earn the most?",
    fill: "Where is fill rate weakest?",
};

/** Typed questions, matched to the three this prototype answers. */
export const matchQuestion = (text: string): QuestionId | null => {
    const t = text.toLowerCase();
    if (/countr|geo|where.*(earn|revenue)/.test(t)) return "countries";
    if (/fill|unfilled/.test(t)) return "fill";
    if (/revenue|drop|down|up|change|why/.test(t)) return "revenue";
    return null;
};
