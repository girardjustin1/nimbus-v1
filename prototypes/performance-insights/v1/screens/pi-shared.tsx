import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { DasShell, TEAL } from "./das-shell";
import { type ReportType, initials, typeColors } from "./sq-data";

/**
 * Performance Insights — shared chrome and small pieces used by every PI screen.
 * Tabs are real links, so Start / Saved Queries / New Query move between screens.
 */

export type PiTab = "Start" | "Saved Queries" | "New Query";

const tabLinks: Record<PiTab, string> = {
    Start: "#/start",
    "Saved Queries": "#/saved",
    "New Query": "#/question-bar",
};

export const PiShell = ({
    concept,
    active,
    children,
    bodyClassName,
}: {
    concept?: Parameters<typeof DasShell>[0]["concept"];
    active: PiTab;
    children: ReactNode;
    bodyClassName?: string;
}) => (
    <DasShell
        navKey="performance insights"
        concept={concept}
        tabs={(Object.keys(tabLinks) as PiTab[]).map((label) => ({ label, href: tabLinks[label], active: label === active }))}
    >
        <div className={cx("flex flex-col gap-6 px-8 py-8", bodyClassName)}>{children}</div>
    </DasShell>
);

/** Min–max scaled line, so small movements (e.g. a fill rate) stay visible. */
export const Sparkline = ({ points, color = TEAL, className = "h-10 w-full", fill }: { points: number[]; color?: string; className?: string; fill?: boolean }) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const span = max - min || 1;
    const xy = points.map((p, i) => [(i / (points.length - 1)) * 100, 28 - ((p - min) / span) * 24] as const);
    const d = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    return (
        <svg viewBox="0 0 100 32" className={className} preserveAspectRatio="none" aria-hidden="true">
            {fill && <path d={`${d} L100,32 L0,32 Z`} fill={color} opacity={0.12} />}
            <path d={d} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

export const Delta = ({ now, prev, digits = 0, invert }: { now: number; prev: number; digits?: number; invert?: boolean }) => {
    const pct = ((now - prev) / prev) * 100;
    const up = pct >= 0;
    const good = invert ? !up : up;
    const Icon = up ? ArrowUp : ArrowDown;
    return (
        <span className={cx("inline-flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap", good ? "text-success-primary" : "text-error-primary")}>
            <Icon className="size-3" aria-hidden="true" />
            {Math.abs(pct).toFixed(digits || 1)}%
        </span>
    );
};

export const TypeBadge = ({ type, size = "sm" }: { type: ReportType; size?: "sm" | "xs" }) => (
    <span
        className={cx("inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap", size === "sm" ? "px-2 py-0.5 text-xs" : "px-1.5 text-[11px]")}
        style={{ color: typeColors[type].fg, backgroundColor: typeColors[type].bg }}
    >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: typeColors[type].solid }} aria-hidden="true" />
        {type}
    </span>
);

const accountTones = ["#1F7F80", "#A94579", "#3538CD", "#B54708"];

export const AccountChip = ({ account, compact }: { account: string; compact?: boolean }) => {
    const all = account === "All accounts";
    const tone = accountTones[account.length % accountTones.length];
    return (
        <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap text-secondary">
            <span
                className={cx("flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", all && "ring-1 ring-secondary")}
                style={all ? { color: "#667085" } : { color: "white", backgroundColor: tone }}
                aria-hidden="true"
            >
                {all ? "ALL" : initials(account)}
            </span>
            {!compact && account}
        </span>
    );
};

export const RecommendedPill = () => (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap uppercase" style={{ color: "#A94579", backgroundColor: "#FCE7F1" }}>
        ✦ Recommended
    </span>
);

/** Static overlay for dialog states (the prototype shows the open state, not the transition). */
export const DialogFrame = ({ title, description, children, footer, width = "max-w-lg" }: { title: string; description?: ReactNode; children?: ReactNode; footer: ReactNode; width?: string }) => (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0C111D]/50 p-4 backdrop-blur-[2px]">
        <div role="dialog" aria-modal="true" aria-label={title} className={cx("flex w-full flex-col gap-5 rounded-2xl bg-primary p-6 shadow-xl", width)}>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
            {children}
            <div className="flex justify-end gap-3">{footer}</div>
        </div>
    </div>
);

export const Toast = ({ children }: { children: ReactNode }) => (
    <div role="status" className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-[#101828] px-4 py-3 text-sm text-white shadow-lg">
        {children}
    </div>
);

export const Skeleton = ({ className }: { className?: string }) => <span className={cx("block animate-pulse rounded-md bg-quaternary", className)} />;
