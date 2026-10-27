import type { FC } from "react";
import { cx } from "@/utils/cx";

/**
 * Chart type tabs, as on staging's Performance Insights (27 Oct): Nimbus' own chart
 * icons (the Sketch exports) beside bold uppercase labels, pink until chosen; the chosen
 * one is teal on a pale teal block that fills the row's height. No rounding and no ring
 * on click; keyboard focus still shows the focus ring.
 *
 * Table, Line, Bar and Pie are the Sketch files' paths (Bar and Pie verbatim); Area (two stacked lines) and
 * Stacked bar are drawn to match them from the staging screenshot.
 */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";
const TEAL_TINT = "#E5F4F5";

type IconProps = { className?: string };

export const ChartTableIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 17 15" fill="none" aria-hidden="true" className={className}>
        <path d="M3 1h11a2 2 0 0 1 2 2v1H1V3a2 2 0 0 1 2-2Z" fill="currentColor" />
        <rect x="1" y="8" width="15" height="1" fill="currentColor" />
        <rect x="8" y="3" width="1" height="11" fill="currentColor" />
        <rect x="1" y="1" width="15" height="13" rx="2" stroke="currentColor" />
    </svg>
);

export const ChartLineIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 16 15" fill="none" aria-hidden="true" className={className}>
        <polyline points="1.5 8.5 5.5 1.5 9.65 13.5 14.5 5.5" stroke="currentColor" />
        <circle cx="1.5" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="5.5" cy="1.5" r="1.5" fill="currentColor" />
        <circle cx="9.5" cy="13.5" r="1.5" fill="currentColor" />
        <circle cx="14.5" cy="5.5" r="1.5" fill="currentColor" />
    </svg>
);

/** Two of the line icon's dotted lines, one above the other. */
export const ChartAreaIcon = ({ className }: IconProps) => {
    const line = [
        [1.75, 6.25],
        [5.5, 1.75],
        [9.75, 6.75],
        [15.25, 3],
    ];
    return (
        <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" className={className}>
            {[0, 8].map((dy) => (
                <g key={dy}>
                    <polyline points={line.map(([x, y]) => `${x} ${y + dy}`).join(" ")} stroke="currentColor" strokeWidth="1.25" />
                    {line.map(([x, y]) => (
                        <circle key={x} cx={x} cy={y + dy} r="1.5" fill="currentColor" />
                    ))}
                </g>
            ))}
        </svg>
    );
};

export const ChartBarIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 18 15" aria-hidden="true" className={className} fill="currentColor">
        <path d="M4.37124476,3.40909091 L1.42223748,3.40909091 C1.00251172,3.40909091 0.6470625,3.78954545 0.6470625,4.24090909 L0.6470625,14.1988636 C0.6470625,14.6481818 0.987728119,15 1.42223748,15 L4.37124476,15 C4.79932646,15 5.1470625,14.6406818 5.1470625,14.1988636 L5.1470625,4.24090909 C5.14641973,3.78954545 4.79161328,3.40909091 4.37124476,3.40909091 Z" />
        <path d="M10.3717902,6.81886364 L7.42300446,6.81886364 C7.00321875,6.81886364 6.64771875,7.2 6.64771875,7.65068182 L6.64771875,14.1988636 C6.64771875,14.6481818 6.98843304,15 7.42300446,15 L10.3717902,15 C10.799933,15 11.1477187,14.6406818 11.1477187,14.1988636 L11.1477187,7.65 C11.1477187,7.19931818 10.7928616,6.81886364 10.3717902,6.81886364 Z" />
        <path d="M16.3724464,-0.000681818182 L13.4230179,-0.000681818182 C13.0032321,-0.000681818182 12.648375,0.380454545 12.648375,0.831136364 L12.648375,14.1981818 C12.648375,14.6475 12.9884464,14.9993182 13.4230179,14.9993182 L16.3724464,14.9993182 C16.8005893,14.9993182 17.148375,14.64 17.148375,14.1981818 L17.148375,0.831136364 C17.148375,0.380454545 16.7935179,-0.000681818182 16.3724464,-0.000681818182 Z" />
    </svg>
);

/** Three columns of blocks: three small, two (one taller), and a tall one over two thin. */
export const ChartStackedBarIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 17 15" aria-hidden="true" className={className} fill="currentColor">
        <rect x="0" y="0" width="4.5" height="4" rx="1" />
        <rect x="0" y="5.5" width="4.5" height="4" rx="1" />
        <rect x="0" y="11" width="4.5" height="4" rx="1" />
        <rect x="6.25" y="3" width="4.5" height="6.5" rx="1" />
        <rect x="6.25" y="11" width="4.5" height="4" rx="1" />
        <rect x="12.5" y="0" width="4.5" height="8.5" rx="1" />
        <rect x="12.5" y="10" width="4.5" height="2" rx="0.75" />
        <rect x="12.5" y="13" width="4.5" height="2" rx="0.75" />
    </svg>
);

export const ChartPieIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 17 17" aria-hidden="true" className={className} fill="currentColor">
        <path d="M14.7545833,7.14283333 C14.579625,7.04933333 14.55625,7.03941667 8.085625,9.00645833 L9.71195833,2.41258333 C9.734625,2.32191667 9.71975,2.224875 9.670875,2.14483333 C9.62270833,2.06479167 9.543375,2.00670833 9.45270833,1.98404167 C5.42016667,0.99025 1.33166667,3.46091667 0.336458333,7.49275 C-0.65875,11.5252917 1.812625,15.6159167 5.84445833,16.6104167 C6.44725,16.7591667 7.05641667,16.832125 7.66204167,16.832125 C9.01779167,16.832125 10.3522917,16.4630833 11.543,15.744125 C13.2656667,14.7035833 14.4790417,13.0545833 14.9607083,11.1017083 C15.263875,9.87345833 15.2518333,8.58075 14.9274167,7.36241667 C14.9033333,7.26891667 14.8395833,7.188875 14.7545833,7.14283333 Z" />
        <path d="M16.7655417,4.60770833 C16.12025,2.38566667 14.328875,0.659458333 12.0877083,0.101291667 C11.8943333,0.0545416667 11.7052083,0.169291667 11.6584583,0.359833333 L10.1709583,6.33179167 C10.1405,6.45433333 10.1780417,6.58395833 10.2687083,6.67179167 C10.336,6.73625 10.4245417,6.77095833 10.5152083,6.77095833 C10.5477917,6.77095833 10.5810833,6.76670833 10.6129583,6.75679167 L16.52825,5.059625 C16.63025,5.03058333 16.713125,4.95833333 16.7549167,4.862 C16.7889167,4.78125 16.7931667,4.689875 16.7655417,4.60770833 Z" />
    </svg>
);

/** The six staging chart types, keyed as Full performance keys them. */
export const NIMBUS_CHART_ICONS = { table: ChartTableIcon, line: ChartLineIcon, area: ChartAreaIcon, bar: ChartBarIcon, stacked: ChartStackedBarIcon, pie: ChartPieIcon };

export interface ChartTypeBarOption<T extends string> {
    id: T;
    label: string;
    icon: FC<{ className?: string }>;
}

/**
 * The tabs. `value` null means none chosen (an empty query); without `onChange` the
 * tabs are static, as in the App Screens replicas.
 */
export const ChartTypeBar = <T extends string>({
    options,
    value,
    onChange,
    className,
}: {
    options: ChartTypeBarOption<T>[];
    value: T | null;
    onChange?: (v: T) => void;
    className?: string;
}) => (
    <div role="radiogroup" aria-label="Chart type" className={cx("flex flex-wrap items-stretch", className)}>
        {options.map((t) => {
            const on = value === t.id;
            return (
                <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onChange?.(t.id)}
                    className={cx(
                        "inline-flex items-center gap-2 px-4 py-4 text-md font-bold whitespace-nowrap uppercase outline-focus-ring transition-colors duration-100 ease-linear focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2",
                        !on && "hover:bg-secondary",
                    )}
                    style={on ? { color: TEAL, backgroundColor: TEAL_TINT } : { color: PINK }}
                >
                    <t.icon className="h-[18px] w-5 shrink-0" />
                    {t.label}
                </button>
            );
        })}
    </div>
);
