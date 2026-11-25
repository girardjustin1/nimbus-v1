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
    {
        id: "v2",
        label: "Round 2 · Concepts",
        date: "November 24, 2026",
        summary:
            "The 24 Nov PI sync, started. Performance Insights becomes the one reporting page and replaces the realtime dashboard, so it opens on realtime's view (four metrics by day and platform, scoped to one app) instead of a blank query. Forked from the full application with the Round 1 styles (itself built on DAS Round 6), so key metrics, the realtime dashboard, DAS and today's Performance Insights are all here as the control. Concepts for the filter band and the field tiers (Default, Quick add, Explore, Nimbus internal) are added screen by screen.",
    },
];

export const latest = versions[versions.length - 1].id;

export const meta = (current: string): ProtoMeta => ({
    name: "Performance Insights",
    tagline: "Reporting redesign: one page for realtime and detailed reporting, with a tidier filter band and field tiers.",
    accent: "#A94579",
    soft: "#FCE7F1",
    versions,
    current,
});
