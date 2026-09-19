import { Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";
import { cx } from "@/utils/cx";
import { NimbusTooltip } from "./chart-kit";
import { type Fmt, type SeriesDef, colorAt, format, nimbus } from "./chart-theme";

/**
 * Radial charts in the Nimbus style: pie, donut, radar, activity gauge and progress
 * circle. Legends with values sit beside or under the chart.
 */

/* ------------------------------------------------------------- Pie / donut --- */

export const NimbusPieChart = ({
    data,
    donut = false,
    fmt = "usd",
    centerLabel,
    size = 220,
    showList = true,
}: {
    data: { name: string; value: number; color?: string }[];
    donut?: boolean;
    fmt?: Fmt;
    /** Text under the total in the middle of a donut. */
    centerLabel?: string;
    size?: number;
    /** Legend list with values and shares beside the chart. */
    showList?: boolean;
}) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<NimbusTooltip fmt={fmt} />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={donut ? "68%" : 0}
                            outerRadius="100%"
                            paddingAngle={donut ? 2 : 1}
                            cornerRadius={donut ? 6 : 2}
                            stroke="#fff"
                            strokeWidth={donut ? 0 : 2}
                            startAngle={90}
                            endAngle={-270}
                            isAnimationActive={false}
                        >
                            {data.map((d, i) => (
                                <Cell key={d.name} fill={d.color ?? colorAt(i)} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {donut && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-semibold text-primary">{format(total, fmt)}</span>
                        {centerLabel && <span className="text-xs text-tertiary">{centerLabel}</span>}
                    </div>
                )}
            </div>
            {showList && (
                <ul className="flex w-full min-w-44 flex-col gap-2.5">
                    {data.map((d, i) => (
                        <li key={d.name} className="flex items-center justify-between gap-4 text-sm">
                            <span className="flex items-center gap-2 text-secondary">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color ?? colorAt(i) }} aria-hidden="true" />
                                {d.name}
                            </span>
                            <span className="flex items-baseline gap-2">
                                <span className="font-semibold text-primary tabular-nums">{format(d.value, fmt)}</span>
                                <span className="w-10 text-right text-xs text-tertiary tabular-nums">{Math.round((d.value / total) * 100)}%</span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ Radar --- */

export const NimbusRadarChart = ({ data, angleKey, series, height = 320, fmt = "num" }: { data: Record<string, string | number>[]; angleKey: string; series: SeriesDef[]; height?: number; fmt?: Fmt }) => (
    <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="75%">
                <PolarGrid stroke={nimbus.grid} />
                <PolarAngleAxis dataKey={angleKey} tick={{ fontSize: 12, fill: nimbus.muted }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<NimbusTooltip fmt={fmt} />} />
                {series.map((s, i) => {
                    const c = s.color ?? colorAt(i);
                    return <Radar key={s.key} dataKey={s.key} stroke={c} strokeWidth={2} fill={c} fillOpacity={0.14} dot={{ r: 3, fill: c, strokeWidth: 0 }} isAnimationActive={false} />;
                })}
            </RadarChart>
        </ResponsiveContainer>
    </div>
);

/* ---------------------------------------------------------- Activity gauge --- */

/** Concentric progress rings (0–100), one per goal, with the lead value in the centre. */
export const ActivityGauge = ({ data, size = 240, centerLabel }: { data: { name: string; value: number; color?: string }[]; size?: number; centerLabel?: string }) => {
    const rings = data.map((d, i) => ({ ...d, fill: d.color ?? colorAt(i) })).reverse();
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart data={rings} innerRadius="46%" outerRadius="100%" barSize={Math.max(10, size / 22)} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background={{ fill: nimbus.track }} cornerRadius={20} isAnimationActive={false} />
                    <Tooltip content={<NimbusTooltip fmt="num" labelSuffix="" />} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-primary">{data[0]?.value}%</span>
                <span className="max-w-[40%] text-center text-xs leading-tight text-tertiary">{centerLabel ?? data[0]?.name}</span>
            </div>
        </div>
    );
};

/* --------------------------------------------------------- Progress circle --- */

const circleSizes = { sm: { d: 88, stroke: 8, text: "text-md" }, md: { d: 128, stroke: 10, text: "text-xl" }, lg: { d: 176, stroke: 14, text: "text-display-xs" } };

/** Single progress ring (or half ring) with the value in the middle. */
export const ProgressCircle = ({ value, label, size = "md", half = false, color = nimbus.pink }: { value: number; label?: string; size?: keyof typeof circleSizes; half?: boolean; color?: string }) => {
    const { d, stroke, text } = circleSizes[size];
    const r = (d - stroke) / 2;
    const full = 2 * Math.PI * r;
    const length = half ? full / 2 : full;
    const pct = Math.min(100, Math.max(0, value)) / 100;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: d, height: half ? d / 2 + stroke / 2 : d }}>
                <svg width={d} height={half ? d / 2 + stroke / 2 : d} viewBox={`0 0 ${d} ${half ? d / 2 + stroke / 2 : d}`} className={cx(!half && "-rotate-90")} aria-hidden="true">
                    {[nimbus.track, color].map((c, i) => (
                        <circle
                            key={i}
                            cx={d / 2}
                            cy={d / 2}
                            r={r}
                            fill="none"
                            stroke={c}
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${i === 0 ? length : length * pct} ${full}`}
                            transform={half ? `rotate(180 ${d / 2} ${d / 2})` : undefined}
                        />
                    ))}
                </svg>
                <span className={cx("absolute inset-x-0 flex flex-col items-center font-semibold text-primary", half ? "bottom-0" : "inset-y-0 justify-center", text)}>{Math.round(value)}%</span>
            </div>
            {label && <span className="text-sm font-medium text-tertiary">{label}</span>}
        </div>
    );
};
