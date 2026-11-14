import { type ReactNode, useState } from "react";
import {
    Area,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { type Campaign, compact } from "./campaign-data";
import { type DeliveryVariant, axis, dailyDelivery, dailyOpportunity, flightDay, flightWeekday } from "./campaign-series";
import { ChartTooltip } from "./campaign-ui";
import { PINK, TEAL } from "./das-shell";

/**
 * The campaign overview's Delivery chart — Round 6, plus the 6 Nov concepts.
 *
 * Product (6 Nov): keep the pacing chart, and give it context — add ad requests (data we
 * have today) and daily active users (backend is pulling it, likely ready before launch),
 * so a dip in pacing can be read against a dip in opportunity. Five ways to show the four
 * series together; `pacing` is Round 6 as reviewed on 29 Oct.
 *
 *   pacing   Round 6: actual against expected, share of the goal. No context.
 *   overlay  A · all four lines on one chart; requests and users on a second axis.
 *   bars     B · users as bars (a volume), requests and pacing as lines, like the
 *            realtime dashboard.
 *   stacked  C · two charts on one timeline: pacing above, opportunity below, one axis
 *            each and a shared hover.
 *   indexed  D · one chart, one axis: every line is a % of a normal day.
 *   strip    E · the pacing chart, with a heat strip of requests and users beneath it.
 *
 * A and B put two scales on one chart: the chart reads correctly only if you check which
 * axis each line belongs to, and the lines cross where the scales happen to meet, not
 * where anything happens. C, D and E keep one scale per chart.
 *
 * Second batch (6 Nov feedback: "Can we overlay them on the same chart rather than 2
 * separate?"). Everything on one chart, each answering A's problem a different way:
 *
 *   labelled  F · A, made to read: each axis titled and tinted to its series, requests
 *             as a soft area, and Requests / DAUs switch on and off above the chart.
 *   backdrop  G · requests as faint bars and users as a faint line behind pacing, with
 *             no second axis: they show shape only, the figures are on hover.
 *   scaled    H · one % axis for all four: pacing as a share of the goal, requests and
 *             users as a share of a normal day.
 *   bands     I · the pacing chart, with the days opportunity fell shaded and labelled
 *             ("Requests −48% · users −45%").
 *
 * Decision (6 Nov, Product): A. "It has to just be actual numbers" — nothing against
 * normal — so A, everything on one chart in real figures, is what the overview shows. The
 * rest stay in Storybook › Nov 6 Edits for reference.
 *
 * Colours: teal and pink stay Actual and Expected (Expected is dashed, so the pair still
 * reads for colour-blind users); Requests navy, DAUs brown — both pass the colour-blind
 * checks against teal and pink, and neither is a pacing status colour.
 */

const REQUESTS = "#2E5AAC";
const DAUS = "#854A0E";

/* ---------------------------------------------------------------- Data --- */

interface Point {
    day: string;
    n: number;
    Actual?: number;
    Expected?: number;
    Requests?: number;
    DAUs?: number;
    /** D: the day's delivery as a % of the daily plan; requests and users as a % of normal. */
    Delivery?: number;
    RequestsIdx?: number;
    DAUsIdx?: number;
}

/** A normal day: the 75th percentile of the days so far, so a long dip doesn't become the norm. */
const normal = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor((sorted.length - 1) * 0.75)] || 1;
};

const points = (c: Campaign): Point[] => {
    const daily = dailyDelivery(c);
    const opp = dailyOpportunity(c);
    const fallback = c.rule === "Fallback";
    const plan = fallback ? normal(daily) : c.budget / c.flightDays;
    const reqNormal = normal(opp.flatMap((o) => (o.requests ? [o.requests] : [])));
    const userNormal = normal(opp.flatMap((o) => (o.daus ? [o.daus] : [])));
    let run = 0;
    return Array.from({ length: c.flightDays }, (_, i) => {
        const has = i < daily.length;
        if (has) run += daily[i];
        const o = opp[i];
        return {
            day: flightDay(c, i),
            n: i + 1,
            Actual: has ? (fallback ? Math.round(run) : +((run / c.budget) * 100).toFixed(1)) : undefined,
            Expected: fallback ? undefined : +(((i + 1) / c.flightDays) * 100).toFixed(1),
            Requests: o.requests,
            DAUs: o.daus,
            Delivery: has ? Math.round((daily[i] / plan) * 100) : undefined,
            RequestsIdx: o.requests ? Math.round((o.requests / reqNormal) * 100) : undefined,
            DAUsIdx: o.daus ? Math.round((o.daus / userNormal) * 100) : undefined,
        };
    });
};

/* ------------------------------------------------------------- Pieces --- */

const pct = (v: number) => `${v}%`;
const count = (v: number) => v.toLocaleString("en-US");

// Band scale on every chart, so a day sits at the same x in the pacing line, the bars and the
// strip: stacked charts (C, E) line up day for day.
const xAxis = (c: Campaign, hide = false) => (
    <XAxis dataKey="day" scale="band" {...axis} hide={hide} interval={Math.max(1, Math.round(c.flightDays / 6) - 1)} />
);

/** "Sat Sep 5 · day 5 of 30" — the weekday matters once requests swing at weekends. */
const dayTitle = (c: Campaign) => (label: string) => {
    const i = Array.from({ length: c.flightDays }, (_, k) => flightDay(c, k)).indexOf(label);
    return `${flightWeekday(c, i)} ${label} · day ${i + 1} of ${c.flightDays}`;
};

/** One tooltip formatter for every variant, by series name. */
const formatFor = (fallback: boolean) => (v: number, name: string) => {
    if (name === "Requests" || name === "DAUs") return count(v);
    if (name === "Delivery") return `${v}% of the daily plan`;
    if (name === "Requests (vs normal)" || name === "DAUs (vs normal)") return `${v}% of normal`;
    return fallback ? `${count(v)} impressions` : `${v.toFixed(1)}% of goal`;
};

const tip = (c: Campaign) => <Tooltip content={<ChartTooltip format={formatFor(c.rule === "Fallback")} title={dayTitle(c)} />} />;

const ActualArea = ({ c }: { c: Campaign }) => (
    <defs>
        <linearGradient id={`pace-${c.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
            <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
        </linearGradient>
    </defs>
);

const paceSeries = (c: Campaign, yAxisId = "0") => {
    const fallback = c.rule === "Fallback";
    return [
        <Area
            key="actual"
            yAxisId={yAxisId}
            type="monotone"
            dataKey="Actual"
            name={fallback ? "Impressions" : "Actual"}
            stroke={TEAL}
            strokeWidth={2}
            fill={`url(#pace-${c.id})`}
            isAnimationActive={false}
            connectNulls={false}
        />,
        !fallback && (
            <Line
                key="expected"
                yAxisId={yAxisId}
                type="linear"
                dataKey="Expected"
                stroke={PINK}
                strokeDasharray="5 4"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
            />
        ),
    ];
};

const paceAxis = (c: Campaign, yAxisId = "0") => {
    const fallback = c.rule === "Fallback";
    return (
        <YAxis
            yAxisId={yAxisId}
            {...axis}
            width={64}
            domain={fallback ? undefined : [0, 100]}
            ticks={fallback ? undefined : [0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => (fallback ? compact(v) : `${v}%`)}
        />
    );
};

/* ---------------------------------------------------------- Variants --- */

const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };

/** Round 6, and the top half of C and E. */
const PaceOnly = ({ c, data, height, syncId, hideX }: { c: Campaign; data: Point[]; height: number; syncId?: string; hideX?: boolean }) => (
    <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={hideX ? { ...MARGIN, bottom: 10 } : MARGIN} syncId={syncId}>
                <ActualArea c={c} />
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c, hideX)}
                {paceAxis(c)}
                {tip(c)}
                {paceSeries(c)}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** A and B: two scales on one chart. */
const DualAxis = ({ c, data, bars }: { c: Campaign; data: Point[]; bars: boolean }) => (
    <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={MARGIN} barCategoryGap={2}>
                <ActualArea c={c} />
                <CartesianGrid yAxisId="pace" vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                {paceAxis(c, "pace")}
                <YAxis yAxisId="vol" orientation="right" {...axis} width={64} tickFormatter={compact} />
                {tip(c)}
                {bars && <Bar yAxisId="vol" dataKey="DAUs" fill={DAUS} fillOpacity={0.28} radius={[4, 4, 0, 0]} isAnimationActive={false} />}
                {paceSeries(c, "pace")}
                <Line yAxisId="vol" type="monotone" dataKey="Requests" stroke={REQUESTS} strokeWidth={2} dot={false} isAnimationActive={false} />
                {!bars && <Line yAxisId="vol" type="monotone" dataKey="DAUs" stroke={DAUS} strokeWidth={2} dot={false} isAnimationActive={false} />}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** C: opportunity under the pacing chart — requests as bars (a volume), users as a line, one count axis. */
const Opportunity = ({ c, data, syncId }: { c: Campaign; data: Point[]; syncId: string }) => (
    <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={MARGIN} syncId={syncId} barCategoryGap={2}>
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                <YAxis {...axis} width={64} tickFormatter={compact} />
                {tip(c)}
                <Bar dataKey="Requests" fill={REQUESTS} fillOpacity={0.85} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Line type="monotone" dataKey="DAUs" stroke={DAUS} strokeWidth={2} dot={false} isAnimationActive={false} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** D: one axis — each line is a % of its own normal day; 100% is a normal day. */
const Indexed = ({ c, data }: { c: Campaign; data: Point[] }) => (
    <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={MARGIN}>
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                <YAxis {...axis} width={64} domain={[0, 150]} ticks={[0, 50, 100, 150]} tickFormatter={pct} allowDataOverflow />
                {tip(c)}
                <ReferenceLine y={100} stroke="#98A2B3" strokeDasharray="5 4" />
                <Line type="monotone" dataKey="Delivery" stroke={TEAL} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line
                    type="monotone"
                    dataKey="RequestsIdx"
                    name="Requests (vs normal)"
                    stroke={REQUESTS}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
                <Line type="monotone" dataKey="DAUsIdx" name="DAUs (vs normal)" stroke={DAUS} strokeWidth={2} dot={false} isAnimationActive={false} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** One hue, light to dark, by the day's share of the flight's busiest day. */
const shade = (hex: string, t: number) => {
    const n = parseInt(hex.slice(1), 16);
    const mix = (ch: number) => Math.round(255 + (ch - 255) * (0.12 + 0.88 * t));
    return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
};

const StripTooltip = ({ active, payload, title }: { active?: boolean; payload?: { payload: Point }[]; title: (l: string) => string }) => {
    const p = payload?.[0]?.payload;
    if (!active || !p?.Requests) return null;
    return (
        <div className="flex flex-col gap-1 rounded-lg bg-primary-solid px-3 py-2 shadow-lg">
            <p className="text-md font-bold text-white">{title(p.day)}</p>
            {(
                [
                    ["Requests", p.Requests, REQUESTS],
                    ["DAUs", p.DAUs, DAUS],
                ] as const
            ).map(([name, v, color]) => (
                <p key={name} className="flex items-center gap-2 text-md text-white">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                    <span className="opacity-80">{name}</span>
                    <span className="ml-auto pl-3 font-semibold">{v?.toLocaleString("en-US")}</span>
                </p>
            ))}
        </div>
    );
};

/** E: a heat strip of requests and users under the pacing chart, one cell a day. */
const Strip = ({ c, data, syncId }: { c: Campaign; data: Point[]; syncId: string }) => {
    const maxR = Math.max(...data.map((d) => d.Requests ?? 0)) || 1;
    const maxU = Math.max(...data.map((d) => d.DAUs ?? 0)) || 1;
    const rows = data.map((d) => ({ ...d, r: 1, u: 1 }));
    return (
        <div className="relative" style={{ height: 76 }}>
            <div className="pointer-events-none absolute top-0 left-0 flex h-[68px] w-16 flex-col justify-around pr-2 text-right text-md text-tertiary">
                <span>Requests</span>
                <span>DAUs</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={MARGIN} syncId={syncId} barCategoryGap={1}>
                    <XAxis dataKey="day" scale="band" hide />
                    <YAxis width={64} hide={false} tick={false} axisLine={false} tickLine={false} domain={[0, 2]} />
                    <Tooltip cursor={{ fill: "transparent" }} content={<StripTooltip title={dayTitle(c)} />} />
                    <Bar dataKey="u" stackId="s" isAnimationActive={false}>
                        {rows.map((d) => (
                            <Cell key={d.day} fill={d.DAUs ? shade(DAUS, d.DAUs / maxU) : "#F2F4F7"} stroke="#fff" strokeWidth={2} />
                        ))}
                    </Bar>
                    <Bar dataKey="r" stackId="s" isAnimationActive={false}>
                        {rows.map((d) => (
                            <Cell key={d.day} fill={d.Requests ? shade(REQUESTS, d.Requests / maxR) : "#F2F4F7"} stroke="#fff" strokeWidth={2} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ------------------------------------------------- Overlays (F to I) --- */

const TEAL_TEXT = "#1F7F80";

/** F: two axes, but each titled and tinted to its series; Requests and DAUs switch on and off. */
const Labelled = ({ c, data }: { c: Campaign; data: Point[] }) => {
    const [show, setShow] = useState({ Requests: true, DAUs: true });
    const vol = show.Requests || show.DAUs;
    const toggle = (k: keyof typeof show) => setShow((cur) => ({ ...cur, [k]: !cur[k] }));
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-md font-semibold text-secondary">Show on the chart</span>
                {(
                    [
                        ["Requests", REQUESTS],
                        ["DAUs", DAUS],
                    ] as const
                ).map(([k, color]) => (
                    <button
                        key={k}
                        type="button"
                        aria-pressed={show[k]}
                        onClick={() => toggle(k)}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-md font-semibold ring-1 transition-colors"
                        style={
                            show[k] ? { color, backgroundColor: `${color}14`, borderColor: color, boxShadow: `inset 0 0 0 1px ${color}` } : { color: "#667085" }
                        }
                    >
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: show[k] ? color : "#D0D5DD" }} aria-hidden="true" />
                        {k === "DAUs" ? "Daily active users" : "Requests"}
                    </button>
                ))}
            </div>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ ...MARGIN, left: 8 }}>
                        <ActualArea c={c} />
                        <CartesianGrid yAxisId="pace" vertical={false} className="[&_line]:stroke-border-secondary" />
                        {xAxis(c)}
                        <YAxis
                            yAxisId="pace"
                            {...axis}
                            tick={{ ...axis.tick, fill: TEAL_TEXT }}
                            width={76}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tickFormatter={pct}
                            label={{ value: "% of goal", angle: -90, position: "insideLeft", fill: TEAL_TEXT, fontSize: 15, fontWeight: 700, dy: 36 }}
                        />
                        {vol && (
                            <YAxis
                                yAxisId="vol"
                                orientation="right"
                                {...axis}
                                tick={{ ...axis.tick, fill: REQUESTS }}
                                width={84}
                                tickFormatter={compact}
                                label={{ value: "Per day", angle: 90, position: "insideRight", fill: REQUESTS, fontSize: 15, fontWeight: 700, dy: -24 }}
                            />
                        )}
                        {tip(c)}
                        {show.Requests && (
                            <Area
                                yAxisId="vol"
                                type="monotone"
                                dataKey="Requests"
                                stroke={REQUESTS}
                                strokeWidth={1.5}
                                fill={REQUESTS}
                                fillOpacity={0.1}
                                isAnimationActive={false}
                            />
                        )}
                        {show.DAUs && <Line yAxisId="vol" type="monotone" dataKey="DAUs" stroke={DAUS} strokeWidth={2} dot={false} isAnimationActive={false} />}
                        {paceSeries(c, "pace")}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

/** G: opportunity as a faint backdrop on a hidden scale — its shape behind pacing, its figures on hover. */
const Backdrop = ({ c, data }: { c: Campaign; data: Point[] }) => (
    <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={MARGIN} barCategoryGap={2}>
                <ActualArea c={c} />
                <CartesianGrid yAxisId="pace" vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                {paceAxis(c, "pace")}
                {/* Headroom so the tallest bar stays below the 100% line. */}
                <YAxis yAxisId="vol" hide domain={[0, (max: number) => max * 1.25]} />
                {tip(c)}
                <Bar yAxisId="vol" dataKey="Requests" fill={REQUESTS} fillOpacity={0.16} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Line yAxisId="vol" type="monotone" dataKey="DAUs" stroke={DAUS} strokeOpacity={0.55} strokeWidth={2} dot={false} isAnimationActive={false} />
                {paceSeries(c, "pace")}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** H: one % axis — pacing as a share of the goal, requests and users as a share of a normal day. */
const Scaled = ({ c, data }: { c: Campaign; data: Point[] }) => (
    <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={MARGIN}>
                <ActualArea c={c} />
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                <YAxis {...axis} width={64} domain={[0, 150]} ticks={[0, 25, 50, 75, 100, 125, 150]} tickFormatter={pct} allowDataOverflow />
                {tip(c)}
                <Line
                    type="monotone"
                    dataKey="RequestsIdx"
                    name="Requests (vs normal)"
                    stroke={REQUESTS}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
                <Line type="monotone" dataKey="DAUsIdx" name="DAUs (vs normal)" stroke={DAUS} strokeWidth={2} dot={false} isAnimationActive={false} />
                {paceSeries(c)}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/** Runs of days when requests or users were at least 20% under a normal day. */
const dips = (data: Point[]) => {
    const low = (d: Point) => (d.RequestsIdx ?? 100) < 80 || (d.DAUsIdx ?? 100) < 80;
    const runs: { from: number; to: number }[] = [];
    data.forEach((d, i) => {
        if (!low(d)) return;
        const last = runs[runs.length - 1];
        if (last && last.to === i - 1) last.to = i;
        else runs.push({ from: i, to: i });
    });
    const avg = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / (xs.length || 1));
    return runs.map((r) => {
        const days = data.slice(r.from, r.to + 1);
        const req = 100 - avg(days.map((d) => d.RequestsIdx ?? 100));
        const users = 100 - avg(days.map((d) => d.DAUsIdx ?? 100));
        const part = (name: string, drop: number) => (drop >= 10 ? `${name} −${drop}%` : `${name} steady`);
        return { ...r, label: `${part("Requests", req)} · ${part("users", users)}` };
    });
};

/** I: the pacing chart, with the days opportunity fell shaded and labelled. Hover any day for the figures. */
const Bands = ({ c, data }: { c: Campaign; data: Point[] }) => (
    <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ ...MARGIN, top: 36 }}>
                <ActualArea c={c} />
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                {xAxis(c)}
                {paceAxis(c)}
                <YAxis yAxisId="vol" hide />
                {dips(data).map((d) => (
                    <ReferenceArea
                        key={d.from}
                        yAxisId="0"
                        x1={data[d.from].day}
                        x2={data[d.to].day}
                        fill="#98A2B3"
                        fillOpacity={0.16}
                        ifOverflow="visible"
                        label={{ value: d.label, position: "top", fill: "#344054", fontSize: 15, fontWeight: 600, offset: 10 }}
                    />
                ))}
                {tip(c)}
                {/* Invisible, so the hover lists the day's requests and users too. */}
                <Line yAxisId="vol" dataKey="Requests" stroke={REQUESTS} strokeOpacity={0} dot={false} activeDot={false} isAnimationActive={false} />
                <Line yAxisId="vol" dataKey="DAUs" stroke={DAUS} strokeOpacity={0} dot={false} activeDot={false} isAnimationActive={false} />
                {paceSeries(c)}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

/* ------------------------------------------------------------- Legend --- */

type Mark = "line" | "dash" | "bar" | "cell" | "area" | "band";
const Key = ({ mark, color, children }: { mark: Mark; color: string; children: ReactNode }) => (
    <span className="inline-flex items-center gap-1.5">
        {mark === "line" && <span className="h-0.5 w-4 rounded" style={{ backgroundColor: color }} />}
        {mark === "dash" && <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: color }} />}
        {mark === "bar" && <span className="size-3 rounded-sm" style={{ backgroundColor: color }} />}
        {mark === "cell" && <span className="h-3 w-5 rounded-sm" style={{ background: `linear-gradient(90deg, ${shade(color, 0)}, ${color})` }} />}
        {mark === "area" && <span className="h-3 w-4 rounded-sm border-t-2" style={{ borderColor: color, backgroundColor: `${color}1a` }} />}
        {mark === "band" && <span className="h-3 w-5 rounded-sm" style={{ backgroundColor: color }} />}
        {children}
    </span>
);

const LEGEND: Record<DeliveryVariant, [Mark, string, string][]> = {
    pacing: [],
    overlay: [
        ["line", REQUESTS, "Requests per day (right axis)"],
        ["line", DAUS, "Daily active users (right axis)"],
    ],
    bars: [
        ["bar", DAUS, "Daily active users (bars, right axis)"],
        ["line", REQUESTS, "Requests per day (right axis)"],
    ],
    stacked: [
        ["bar", REQUESTS, "Requests per day"],
        ["line", DAUS, "Daily active users"],
    ],
    indexed: [],
    strip: [
        ["cell", REQUESTS, "Requests per day"],
        ["cell", DAUS, "Daily active users · darker is busier"],
    ],
    labelled: [
        ["area", REQUESTS, "Requests per day (right axis)"],
        ["line", DAUS, "Daily active users (right axis)"],
    ],
    backdrop: [
        ["bar", `${REQUESTS}40`, "Requests per day, behind (shape only; hover for figures)"],
        ["line", `${DAUS}8c`, "Daily active users, behind"],
    ],
    scaled: [
        ["line", REQUESTS, "Requests against a normal day"],
        ["line", DAUS, "Daily active users against a normal day"],
    ],
    bands: [["band", "#98A2B329", "Shaded: requests or users at least 20% under a normal day (hover for figures)"]],
};

const Legend = ({ c, variant }: { c: Campaign; variant: DeliveryVariant }) => {
    const fallback = c.rule === "Fallback";
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-md text-tertiary">
                {variant === "indexed" ? (
                    <>
                        <Key mark="line" color={TEAL}>
                            Delivery: the day's spend against the daily plan
                        </Key>
                        <Key mark="line" color={REQUESTS}>
                            Requests against a normal day
                        </Key>
                        <Key mark="line" color={DAUS}>
                            Daily active users against a normal day
                        </Key>
                        <Key mark="dash" color="#98A2B3">
                            100%: on plan, a normal day
                        </Key>
                    </>
                ) : (
                    <>
                        <Key mark="line" color={TEAL}>
                            {fallback ? "Cumulative impressions" : "Actual: share of the goal delivered"}
                        </Key>
                        {!fallback && (
                            <Key mark="dash" color={PINK}>
                                Expected: the share due by each day
                            </Key>
                        )}
                        {LEGEND[variant].map(([mark, color, label]) => (
                            <Key key={label} mark={mark} color={color}>
                                {label}
                            </Key>
                        ))}
                    </>
                )}
            </div>
            {variant !== "pacing" && <p className="text-md text-tertiary">Daily active users are sample data until the backend feed is ready.</p>}
        </div>
    );
};

/* -------------------------------------------------------------- Chart --- */

export const DeliveryChart = ({ c, variant = "overlay" }: { c: Campaign; variant?: DeliveryVariant }) => {
    const data = points(c);
    // A Fallback campaign has no goal: the views built on a share of the goal or of a normal
    // day show it as A, impressions on the left and the day's opportunity on the right.
    const v: DeliveryVariant = c.rule === "Fallback" && ["indexed", "scaled", "labelled"].includes(variant) ? "overlay" : variant;
    const sync = `delivery-${c.id}`;
    return (
        <div className="flex flex-col gap-4">
            {v === "pacing" && <PaceOnly c={c} data={data} height={280} />}
            {(v === "overlay" || v === "bars") && <DualAxis c={c} data={data} bars={v === "bars"} />}
            {v === "stacked" && (
                <div className="flex flex-col gap-1">
                    <PaceOnly c={c} data={data} height={240} syncId={sync} hideX />
                    <p className="pl-16 text-md font-semibold text-secondary">Opportunity</p>
                    <Opportunity c={c} data={data} syncId={sync} />
                </div>
            )}
            {v === "indexed" && <Indexed c={c} data={data} />}
            {v === "labelled" && <Labelled c={c} data={data} />}
            {v === "backdrop" && <Backdrop c={c} data={data} />}
            {v === "scaled" && <Scaled c={c} data={data} />}
            {v === "bands" && <Bands c={c} data={data} />}
            {v === "strip" && (
                <div className="flex flex-col gap-2">
                    <PaceOnly c={c} data={data} height={260} syncId={sync} />
                    <Strip c={c} data={data} syncId={sync} />
                </div>
            )}
            <Legend c={c} variant={v} />
        </div>
    );
};
