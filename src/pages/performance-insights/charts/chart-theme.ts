/**
 * Nimbus chart theme — one palette, axis style and set of number formats shared by every
 * Performance Insights chart, so a line, a donut and a heatmap all read as one family.
 */

/** Series colours in the order charts use them. Pink leads, teal follows (brand primary / secondary). */
export const series = ["#DA6EA3", "#37B6B7", "#6172F3", "#F79009", "#A94579", "#1F7F80", "#98A2B3"] as const;

export const nimbus = {
    pink: "#DA6EA3",
    pinkDeep: "#A94579",
    pinkSoft: "#FCE7F1",
    teal: "#37B6B7",
    tealDeep: "#1F7F80",
    tealSoft: "#E3F5F5",
    indigo: "#6172F3",
    orange: "#F79009",
    gray: "#98A2B3",
    grid: "#EAECF0",
    track: "#F2F4F7",
    ink: "#101828",
    muted: "#667085",
} as const;

export const colorAt = (i: number) => series[i % series.length];

/** Axis props: no lines or ticks, small muted labels. */
export const axis = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: nimbus.muted }, tickMargin: 8 } as const;

/** Horizontal, dashed gridlines only. */
export const grid = { vertical: false, stroke: nimbus.grid, strokeDasharray: "4 4" } as const;

export type Fmt = "usd" | "usd2" | "compact" | "pct" | "num";

export const format = (v: number, f: Fmt = "num"): string => {
    switch (f) {
        case "usd":
            return Math.abs(v) >= 10_000 ? `$${compactNum(v)}` : `$${Math.round(v).toLocaleString("en-US")}`;
        case "usd2":
            return `$${v.toFixed(2)}`;
        case "pct":
            return `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`;
        case "compact":
            return compactNum(v);
        default:
            return Math.round(v).toLocaleString("en-US");
    }
};

const compactNum = (v: number) => v.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** Active dot for line/area charts: white centre, ring in the series colour. */
export const activeDot = (color: string) => ({ r: 5, fill: "#fff", stroke: color, strokeWidth: 2.5 });

/** Tooltip cursor for bar charts: soft column highlight. */
export const barCursor = { fill: nimbus.track, opacity: 0.7 };

/** Tooltip cursor for line/area charts: thin dashed guide. */
export const lineCursor = { stroke: nimbus.gray, strokeDasharray: "4 4", strokeWidth: 1 };

export interface SeriesDef {
    key: string;
    /** Defaults to the palette colour for its position. */
    color?: string;
    /** Dashed stroke, e.g. a comparison period. */
    dashed?: boolean;
}
