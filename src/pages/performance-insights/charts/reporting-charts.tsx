import { Fragment, useId } from "react";
import { Area, AreaChart, CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, Treemap, XAxis, YAxis, ZAxis } from "recharts";
import { cx } from "@/utils/cx";
import { Change, NimbusTooltip } from "./chart-kit";
import { type Fmt, axis, colorAt, format, grid, nimbus } from "./chart-theme";

/**
 * Reporting charts: metric card, heatmap, auction funnel, scatter / bubble and treemap.
 * The heatmap and funnel are plain HTML so labels stay crisp and wrap; the rest use Recharts.
 */

/* ------------------------------------------------------------ Metric card --- */

export const MetricCard = ({
    label,
    value,
    prev,
    fmt = "num",
    trend,
    color = nimbus.pink,
    variant = "chart",
    invert,
}: {
    label: string;
    value: number;
    prev: number;
    fmt?: Fmt;
    trend?: number[];
    color?: string;
    /** "chart" adds a small area trend; "simple" is number + change only. */
    variant?: "chart" | "simple";
    /** A fall is good (e.g. latency). */
    invert?: boolean;
}) => {
    const id = useId().replace(/:/g, "");
    const change = prev ? (value - prev) / prev : 0;
    return (
        <div className="flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
            <span className="text-sm font-medium text-tertiary">{label}</span>
            <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-display-sm font-semibold text-primary">{format(value, fmt)}</span>
                    <span className="flex items-center gap-2 text-sm text-tertiary">
                        <Change value={change} invert={invert} /> vs last week
                    </span>
                </div>
                {variant === "chart" && trend && (
                    <div className="h-14 w-28 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trend.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                                <defs>
                                    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <YAxis hide domain={["dataMin", "dataMax"]} />
                                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------------------------------------------------------- Heatmap --- */

/** Rows × columns grid; cell tint scales with value (teal, or pink for `tone="pink"`). */
export const Heatmap = ({ rows, columns, fmt = "usd", tone = "teal", showValues = true }: { rows: { label: string; values: number[] }[]; columns: string[]; fmt?: Fmt; tone?: "teal" | "pink"; showValues?: boolean }) => {
    const all = rows.flatMap((r) => r.values);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const rgb = tone === "teal" ? "55,182,183" : "218,110,163";
    const alpha = (v: number) => 0.08 + ((v - min) / (max - min || 1)) * 0.82;
    return (
        <div className="flex flex-col gap-3">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `minmax(120px, 1.3fr) repeat(${columns.length}, minmax(64px, 1fr))` }}>
                <span />
                {columns.map((c) => (
                    <span key={c} className="text-center text-xs font-medium text-tertiary">
                        {c}
                    </span>
                ))}
                {rows.map((r) => (
                    <Fragment key={r.label}>
                        <span className="flex items-center truncate pr-2 text-sm text-secondary">{r.label}</span>
                        {r.values.map((v, i) => {
                            const a = alpha(v);
                            return (
                                <span
                                    key={i}
                                    title={`${r.label} · ${columns[i]}: ${format(v, fmt)}`}
                                    className={cx("flex h-11 items-center justify-center rounded-lg text-xs font-semibold tabular-nums", a > 0.55 ? "text-white" : "text-secondary")}
                                    style={{ backgroundColor: `rgba(${rgb},${a.toFixed(2)})` }}
                                >
                                    {showValues ? format(v, fmt) : ""}
                                </span>
                            );
                        })}
                    </Fragment>
                ))}
            </div>
            <div className="flex items-center gap-2 self-end text-xs text-tertiary">
                {format(min, fmt)}
                <span className="h-2 w-28 rounded-full" style={{ background: `linear-gradient(90deg, rgba(${rgb},0.08), rgba(${rgb},0.9))` }} />
                {format(max, fmt)}
            </div>
        </div>
    );
};

/* ----------------------------------------------------------------- Funnel --- */

/** Stages as centred, narrowing bars, with the step-to-step conversion between them. */
export const Funnel = ({ stages, fmt = "compact" }: { stages: { stage: string; value: number }[]; fmt?: Fmt }) => {
    const top = stages[0]?.value || 1;
    return (
        <ol className="flex flex-col">
            {stages.map((s, i) => {
                const width = Math.max(8, (s.value / top) * 100);
                const next = stages[i + 1];
                return (
                    <li key={s.stage} className="flex flex-col">
                        <div className="grid grid-cols-[140px_1fr_90px] items-center gap-4">
                            <span className="text-sm font-medium text-secondary">{s.stage}</span>
                            <div className="flex justify-center">
                                <span className="h-10 rounded-lg" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${colorAt(i)}, ${colorAt(i)}cc)` }} />
                            </div>
                            <span className="text-right text-sm font-semibold text-primary tabular-nums">{format(s.value, fmt)}</span>
                        </div>
                        {next && (
                            <div className="grid grid-cols-[140px_1fr_90px] gap-4 py-1">
                                <span />
                                <span className="text-center text-xs text-tertiary">
                                    ↓ {((next.value / s.value) * 100).toFixed(1)}% continue
                                </span>
                                <span />
                            </div>
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

/* ---------------------------------------------------------------- Scatter --- */

/** Scatter / bubble chart. Points are grouped into series by `groupKey`; bubble size by `sizeKey`. */
export const NimbusScatterChart = ({
    data,
    xKey,
    yKey,
    sizeKey,
    groupKey,
    xFmt = "num",
    yFmt = "num",
    xLabel,
    yLabel,
    height = 320,
}: {
    data: Record<string, string | number>[];
    xKey: string;
    yKey: string;
    sizeKey?: string;
    groupKey?: string;
    xFmt?: Fmt;
    yFmt?: Fmt;
    xLabel?: string;
    yLabel?: string;
    height?: number;
}) => {
    const groups = groupKey ? [...new Set(data.map((d) => String(d[groupKey])))] : ["All"];
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: xLabel ? 18 : 0, left: yLabel ? 16 : 0 }}>
                    <CartesianGrid {...grid} vertical />
                    <XAxis type="number" dataKey={xKey} name={xLabel ?? xKey} {...axis} tickFormatter={(v: number) => format(v, xFmt)} label={xLabel ? { value: xLabel, position: "insideBottom", offset: -12, fontSize: 12, fill: nimbus.muted } : undefined} />
                    <YAxis type="number" dataKey={yKey} name={yLabel ?? yKey} {...axis} width={52} tickFormatter={(v: number) => format(v, yFmt)} label={yLabel ? { value: yLabel, angle: -90, position: "left", offset: 4, fontSize: 12, fill: nimbus.muted } : undefined} />
                    {sizeKey && <ZAxis type="number" dataKey={sizeKey} range={[80, 900]} />}
                    <Tooltip
                        cursor={{ strokeDasharray: "4 4", stroke: nimbus.gray }}
                        content={({ active, payload }) => {
                            const p = payload?.[0]?.payload as Record<string, string | number> | undefined;
                            if (!active || !p) return null;
                            return (
                                <NimbusTooltip
                                    active
                                    label={String(p.name ?? "")}
                                    fmt={{ [xLabel ?? xKey]: xFmt, [yLabel ?? yKey]: yFmt, ...(sizeKey ? { [sizeKey]: "usd" as Fmt } : {}) }}
                                    payload={[
                                        { name: xLabel ?? xKey, value: Number(p[xKey]), color: nimbus.gray },
                                        { name: yLabel ?? yKey, value: Number(p[yKey]), color: nimbus.gray },
                                        ...(sizeKey ? [{ name: sizeKey, value: Number(p[sizeKey]), color: nimbus.gray }] : []),
                                    ]}
                                />
                            );
                        }}
                    />
                    {groups.map((g, i) => {
                        const points = groupKey ? data.filter((d) => String(d[groupKey]) === g) : data;
                        return (
                            <Scatter key={g} name={g} data={points} fill={colorAt(i)} isAnimationActive={false}>
                                {points.map((_, j) => (
                                    <Cell key={j} fill={colorAt(i)} fillOpacity={0.8} stroke="#fff" strokeWidth={1.5} />
                                ))}
                            </Scatter>
                        );
                    })}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ---------------------------------------------------------------- Treemap --- */

interface TileProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    name?: string;
    value?: number;
    depth?: number;
}

/** One treemap tile; Recharts clones this element with each node's geometry. */
const Tile = ({ x = 0, y = 0, width = 0, height = 0, index = 0, name, value = 0, depth, fmt = "usd", total = 1 }: TileProps & { fmt?: Fmt; total?: number }) => {
    if (depth === 0) return null;
    const roomy = width > 90 && height > 48;
    return (
        <g>
            <rect x={x + 2} y={y + 2} width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={10} fill={colorAt(index)} />
            {roomy && (
                <>
                    <text x={x + 14} y={y + 26} fill="#fff" fontSize={13} fontWeight={600}>
                        {name}
                    </text>
                    <text x={x + 14} y={y + 44} fill="#ffffffcc" fontSize={12}>
                        {format(value, fmt)} · {Math.round((value / total) * 100)}%
                    </text>
                </>
            )}
        </g>
    );
};

/** Area-proportional tiles; labels show when a tile is big enough. */
export const NimbusTreemap = ({ data, fmt = "usd", height = 300 }: { data: { name: string; value: number }[]; fmt?: Fmt; height?: number }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <Treemap data={data} dataKey="value" nameKey="name" aspectRatio={4 / 3} isAnimationActive={false} content={<Tile fmt={fmt} total={total} />}>
                    <Tooltip content={<NimbusTooltip fmt={fmt} />} />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
};
