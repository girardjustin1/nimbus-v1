import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, DotsVertical } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type Fmt, format, nimbus } from "./chart-theme";

/**
 * Chart kit — the Nimbus chrome every Performance Insights chart shares: the card,
 * headline value with change, legend, tooltip and active dot.
 */

export const ChartCard = ({
    title,
    subtitle,
    value,
    change,
    legend,
    actions,
    children,
    className,
}: {
    title: string;
    subtitle?: string;
    /** Headline figure shown under the title. */
    value?: string;
    /** Relative change vs the previous period, e.g. 0.023 for +2.3%. */
    change?: number;
    legend?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <section className={cx("flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary", className)}>
        <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-md font-semibold text-primary">{title}</h3>
                {subtitle && <p className="text-sm text-tertiary">{subtitle}</p>}
                {value && (
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-display-xs font-semibold text-primary">{value}</span>
                        {change !== undefined && <Change value={change} />}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                {actions}
                <button type="button" aria-label="Chart options" className="rounded-md p-1 text-fg-quaternary hover:bg-secondary">
                    <DotsVertical className="size-5" aria-hidden="true" />
                </button>
            </div>
        </header>
        {legend}
        {children}
    </section>
);

export const Change = ({ value, invert }: { value: number; invert?: boolean }) => {
    const up = value >= 0;
    const good = invert ? !up : up;
    const Icon = up ? ArrowUp : ArrowDown;
    return (
        <span
            className={cx("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold", good ? "text-success-primary" : "text-error-primary")}
            style={{ backgroundColor: good ? nimbus.tealSoft : nimbus.pinkSoft }}
        >
            <Icon className="size-3" aria-hidden="true" />
            {Math.abs(value * 100).toFixed(1)}%
        </span>
    );
};

export interface LegendItem {
    label: string;
    color: string;
    /** Dashed line swatch (e.g. a comparison series). */
    dashed?: boolean;
    value?: string;
}

export const Legend = ({ items, className }: { items: LegendItem[]; className?: string }) => (
    <ul className={cx("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
        {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2 text-sm text-tertiary">
                {it.dashed ? (
                    <span className="w-3.5 border-t-2 border-dashed" style={{ borderColor: it.color }} aria-hidden="true" />
                ) : (
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: it.color }} aria-hidden="true" />
                )}
                {it.label}
                {it.value && <span className="font-semibold text-secondary">{it.value}</span>}
            </li>
        ))}
    </ul>
);

interface TooltipEntry {
    name?: string | number;
    value?: number | string;
    color?: string;
    fill?: string;
    stroke?: string;
    payload?: { fill?: string; color?: string };
}

/**
 * Tooltip content for any Recharts chart: dark card, label on top, one row per series
 * with its colour dot. Pass `fmt` to format values.
 */
export const NimbusTooltip = ({ active, payload, label, fmt = "num", labelSuffix }: { active?: boolean; payload?: TooltipEntry[]; label?: string | number; fmt?: Fmt | Partial<Record<string, Fmt>>; labelSuffix?: string }) => {
    if (!active || !payload?.length) return null;
    const fmtFor = (name: string) => (typeof fmt === "string" ? fmt : (fmt[name] ?? "num"));
    return (
        <div className="min-w-36 rounded-xl bg-[#101828] px-3 py-2.5 shadow-lg">
            {label !== undefined && label !== "" && (
                <p className="mb-1.5 text-xs font-semibold text-white">
                    {label}
                    {labelSuffix}
                </p>
            )}
            <ul className="flex flex-col gap-1">
                {payload.map((p, i) => {
                    const name = String(p.name ?? "");
                    const color = p.color ?? p.stroke ?? p.fill ?? p.payload?.fill ?? p.payload?.color ?? nimbus.pink;
                    return (
                        <li key={`${name}-${i}`} className="flex items-center justify-between gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-white/70">
                                <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                                {name}
                            </span>
                            <span className="font-semibold text-white tabular-nums">{typeof p.value === "number" ? format(p.value, fmtFor(name)) : p.value}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
