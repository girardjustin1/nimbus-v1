import { type ReactNode, useContext } from "react";
import { ArrowLeft, InfoCircle } from "@untitledui/icons";
import { Button as AriaButton, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { cx } from "@/utils/cx";
import {
    type Campaign,
    PACE_COLOR,
    PACE_LABEL,
    PACE_MEANING,
    type Pace,
    TRUE_UP,
    TRUE_UP_DETAIL,
    formatPct,
    notPacing,
    notPacingShort,
    paceOf,
    pacingPct,
} from "./campaign-data";
import { TEAL } from "./das-shell";
import { CHARCOAL, TEAL_DARK } from "./nimbus-ui";
import { StatLookContext } from "./stat-look";

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

/* ----------------------------------------------------------- Pacing --- */

export const PaceDot = ({ health, size = 10 }: { health: Pace; size?: number }) => (
    <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, backgroundColor: PACE_COLOR[health] }} aria-hidden="true" />
);

/**
 * A campaign's pacing in a table cell: the colour slot, the percentage and its word, with
 * the meaning on hover. Campaigns that aren't pacing say why in grey.
 */
export const PaceBadge = ({ campaign }: { campaign: Campaign }) => {
    const pace = paceOf(campaign);
    const pct = pacingPct(campaign);
    if (!pace || pct === undefined)
        return (
            <span className="text-md whitespace-nowrap text-tertiary" title={notPacing(campaign)}>
                {notPacingShort(campaign)}
            </span>
        );
    return (
        <span className="inline-flex flex-col gap-0.5 whitespace-nowrap" title={PACE_MEANING[pace]}>
            <span className="inline-flex items-center gap-2 text-md font-semibold text-primary tabular-nums">
                <PaceDot health={pace} />
                {formatPct(pct)}
            </span>
            <span className="pl-[18px] text-md text-tertiary">{PACE_LABEL[pace]}</span>
        </span>
    );
};

/* --------------------------------------------------------- True-up --- */

/**
 * The "subject to true-up" hint every spend figure carries (28 Oct review). The figure is
 * the trued-up one Performance Insights shows, so it can still move a little for 48 hours.
 * Built on react-aria's tooltip rather than the base Tooltip, which sets 12px type.
 */
export const TrueUp = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <AriaTooltipTrigger delay={200} closeDelay={0}>
        <AriaButton
            className={cx("inline-flex cursor-help items-center gap-1 rounded-sm outline-focus-ring focus-visible:outline-2", className)}
            aria-label={children ? undefined : TRUE_UP}
        >
            {children}
            <InfoCircle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        </AriaButton>
        <AriaTooltip offset={6} placement="top" className="z-50">
            <div className="flex max-w-xs flex-col gap-1 rounded-lg bg-primary-solid px-3 py-2.5 shadow-lg">
                <span className="text-md font-bold text-white">{TRUE_UP}</span>
                <span className="text-md text-white/80">{TRUE_UP_DETAIL}</span>
            </div>
        </AriaTooltip>
    </AriaTooltipTrigger>
);

/* ------------------------------------------------------------ Chips --- */

/**
 * One of the highlight chips above the table. When `onPress` is given it filters the
 * table, and shows that it is doing so. Shared by the Campaigns chips and the campaign
 * overview cards. Anything a caller colours itself (health dots, "of $X booked") keeps
 * its own colour.
 */
export const StatChip = ({
    label,
    children,
    sub,
    onPress,
    active,
    className,
}: {
    /** A node so a spend card can carry its true-up hint (never inside a pressable chip). */
    label: ReactNode;
    children: ReactNode;
    sub?: ReactNode;
    onPress?: () => void;
    active?: boolean;
    className?: string;
}) => {
    const look = useContext(StatLookContext);
    const flat = look === "flat";
    const body = (
        <>
            <span className={flat ? "text-md font-bold tracking-wide text-tertiary uppercase" : "text-lg font-bold text-primary"}>{label}</span>
            <span className="text-display-xs font-extrabold" style={{ color: flat || active ? TEAL_DARK : CHARCOAL }}>
                {children}
            </span>
            {sub && <span className="text-md text-tertiary">{sub}</span>}
        </>
    );
    const base = flat
        ? "flex min-w-0 flex-col gap-1 border-l border-secondary py-1 pr-2 pl-4 text-left transition duration-100 ease-linear"
        : "flex min-w-0 flex-col gap-1.5 rounded-sm border bg-primary p-5 text-left shadow-[0_1px_4px_rgba(16,24,40,0.08)] transition duration-100 ease-linear";
    const rest = flat ? "" : "border-[#E4E4E4]";
    if (!onPress) return <div className={cx(base, rest, className)}>{body}</div>;
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onPress}
            className={cx(base, !active && rest, !active && "hover:bg-secondary/50", "outline-focus-ring focus-visible:outline-2", className)}
            style={active ? { borderColor: TEAL, backgroundColor: `${TEAL}0f` } : undefined}
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
