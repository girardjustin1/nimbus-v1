import type { ReactNode } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type Campaign, HEALTH_COLOR, HEALTH_LABEL, HEALTH_MEANING, type Health, healthOf } from "./campaign-data";
import { TEAL } from "./das-shell";
import { LABEL } from "./type-rules";

/**
 * Round 4 building blocks shared by Manage campaigns, the campaign overview and Full
 * performance (16 Oct review).
 */

/* ------------------------------------------------------- Breadcrumb --- */

export interface Crumb {
    label: string;
    href?: string;
}

/**
 * The breadcrumb convention the dashboard already uses — "← Demand : Add Demand Sources"
 * on Manage active demand — in its own strip under the account header. Product asked for
 * it by pointing at that page: the old breadcrumb sat in the page body in grey, with
 * nothing to separate it from the title underneath.
 */
export const BreadcrumbStrip = ({ trail }: { trail: Crumb[] }) => (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-secondary px-8 py-4 text-lg">
        {trail.map((crumb, i) => (
            <span key={crumb.label} className="inline-flex items-center gap-2">
                {i > 0 && (
                    <span className="font-bold text-primary" aria-hidden="true">
                        :
                    </span>
                )}
                {crumb.href ? (
                    <a href={crumb.href} className="inline-flex items-center gap-1.5 font-semibold hover:underline" style={{ color: TEAL }}>
                        {i === 0 && <ArrowLeft className="size-5" aria-hidden="true" />}
                        {crumb.label}
                    </a>
                ) : (
                    <span className="font-bold text-primary" aria-current="page">
                        {crumb.label}
                    </span>
                )}
            </span>
        ))}
    </nav>
);

/* ----------------------------------------------------------- Health --- */

export const HealthDot = ({ health, size = 10 }: { health: Health; size?: number }) => (
    <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, backgroundColor: HEALTH_COLOR[health] }} aria-hidden="true" />
);

/** A campaign's health as a dot and a word, with the meaning on hover. */
export const HealthBadge = ({ campaign }: { campaign: Campaign }) => {
    const health = healthOf(campaign);
    if (!health) return <span className="text-md text-quaternary">—</span>;
    return (
        <span className="inline-flex items-center gap-2 text-md font-semibold whitespace-nowrap text-primary" title={HEALTH_MEANING[health]}>
            <HealthDot health={health} />
            {HEALTH_LABEL[health]}
        </span>
    );
};

/* ------------------------------------------------------------ Chips --- */

/**
 * One of the highlight chips above the table. When `onPress` is given it filters the
 * table, and shows that it is doing so.
 */
export const StatChip = ({
    label,
    children,
    sub,
    onPress,
    active,
    className,
}: {
    label: string;
    children: ReactNode;
    sub?: ReactNode;
    onPress?: () => void;
    active?: boolean;
    className?: string;
}) => {
    const body = (
        <>
            <span className={LABEL}>{label}</span>
            <span className="text-display-xs font-bold text-primary">{children}</span>
            {sub && <span className="text-md text-tertiary">{sub}</span>}
        </>
    );
    const base = "flex min-w-0 flex-col gap-1 rounded-xl p-4 text-left ring-1 transition duration-100 ease-linear";
    if (!onPress) return <div className={cx(base, "ring-secondary", className)}>{body}</div>;
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onPress}
            className={cx(base, active ? "ring-2" : "ring-secondary hover:bg-secondary/50", "outline-focus-ring focus-visible:outline-2", className)}
            style={active ? { ["--tw-ring-color" as string]: TEAL, backgroundColor: `${TEAL}0d` } : undefined}
        >
            {body}
        </button>
    );
};

/* ---------------------------------------------------- Chart tooltip --- */

interface TooltipEntry {
    name?: string | number;
    value?: number | string | (number | string)[];
    color?: string;
    stroke?: string;
}

/**
 * Recharts tooltip with real units. The shared chart tooltip printed "Spend: 11215" —
 * no currency, no separators — at 12px. This one formats every value and keeps to the
 * 15px floor.
 */
export const ChartTooltip = ({
    active,
    payload,
    label,
    format,
    title,
}: {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string | number;
    format: (value: number, name: string) => string;
    title?: (label: string) => string;
}) => {
    const rows = (payload ?? []).filter((p) => typeof p.value === "number");
    if (!active || rows.length === 0) return null;
    return (
        <div className="flex flex-col gap-1 rounded-lg bg-primary-solid px-3 py-2 shadow-lg">
            <p className="text-md font-bold text-white">{title ? title(String(label)) : label}</p>
            {rows.map((p) => (
                <p key={String(p.name)} className="flex items-center gap-2 text-md text-white">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: p.stroke ?? p.color }} aria-hidden="true" />
                    <span className="opacity-80">{p.name}</span>
                    <span className="ml-auto pl-3 font-semibold">{format(p.value as number, String(p.name))}</span>
                </p>
            ))}
        </div>
    );
};
