import { TEAL_DARK } from "../../nimbus-ui";
import type { Dim, Range } from "./insights-data";
import { periodName, reportFacts } from "./report-facts";

/**
 * Performance Insights · Round 2 · C15: what changed, beside the chart.
 *
 * From “I studied 2,108 dashboards”: the ones that stick put the key insight next to the
 * chart. Here that is three or four facts worked out from the report's own data, for the
 * dates and filters set. Facts only: the page states what changed and leaves the reading
 * to the publisher (the 6 Nov “no coaching” rule).
 */
export const InsightNotes = ({ range, excluded }: { range: Range; excluded: Partial<Record<Dim, string[]>> }) => {
    const facts = reportFacts(range, excluded);
    return (
        <aside aria-label="What changed" className="flex flex-col gap-3">
            <div className="text-md font-bold text-tertiary">What changed vs {periodName(range)}</div>
            {facts.map((f) => (
                <div
                    key={f.id}
                    className="flex flex-col gap-1 border-l-2 py-1 pl-4"
                    style={{ borderColor: f.trend === "up" ? TEAL_DARK : f.trend === "down" ? "#B42318" : "#D0D5DD" }}
                >
                    <span className="text-md font-bold text-primary">{f.title}</span>
                    <span className="text-md leading-snug text-tertiary">{f.detail}</span>
                </div>
            ))}
        </aside>
    );
};
