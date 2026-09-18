import type { ProtoMeta, ProtoVersion } from "../shared/prototype-frame";

/** Every published version of the Performance Insights prototype. Add a row when you cut a new version folder. */
export const versions: ProtoVersion[] = [
    {
        id: "v1",
        label: "Round 1",
        date: "September 22, 2026",
        summary:
            "A publisher opens Performance Insights and starts from a template or saved query instead of a blank wall of checkboxes. They build a question as one readable sentence (“show revenue and eCPM by demand source for the last 7 days…”) that only runs when they ask, see every number next to its change from the previous period, and drill from app to demand source in a pivot view. It's faster, easier to read, and ready for the DAS and keyword dimensions coming next.",
    },
];

export const latest = versions[versions.length - 1].id;

export const meta = (current: string): ProtoMeta => ({
    name: "Performance Insights",
    tagline: "Reporting redesign: templates, a sentence-style query bar and a pivot explorer.",
    accent: "#A94579",
    soft: "#FCE7F1",
    versions,
    current,
});
