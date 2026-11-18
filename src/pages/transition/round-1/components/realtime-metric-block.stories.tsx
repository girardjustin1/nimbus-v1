import type { Meta, StoryObj } from "@storybook/react-vite";
import { cx } from "@/utils/cx";
import { StatChip as StatChipV1 } from "../../../../../prototypes/app/v1/screens/campaign-ui";
import { METRIC_COLOR, type RtMetric, platformColor, tint } from "../../../../../prototypes/app/v1/screens/reporting/dashboard/dashboard-data";
import { StatLookContext as StatLookV1 } from "../../../../../prototypes/app/v1/screens/stat-look";
import { StatChip as StatChipV2 } from "../../../../../prototypes/app/v2/screens/campaign-ui";
import { R1 } from "../../../../../prototypes/app/v2/screens/round-1";
import { StatLookContext as StatLookV2 } from "../../../../../prototypes/app/v2/screens/stat-look";
import { BeforeAfter, V2Scope } from "./frame";

/**
 * Round 1 · Components · Realtime metric block (R1-05, R1-06; the label is R1-04).
 * The flat summary blocks over the realtime dashboard's chart: a small upper case label,
 * the main number, then one line per platform. Sample numbers.
 */
const meta = {
    title: "Transition/Round 1/Components/Realtime metric block",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-05", "R1-06", "R1-04"];

/** Sample figures only. */
const BLOCKS: { metric: RtMetric; total: string; platforms: [string, string][] }[] = [
    { metric: "Revenue", total: "$4,210.50", platforms: [["Android", "$2,380.10"], ["iPhone", "$1,830.40"]] },
    { metric: "Requests", total: "1.2M", platforms: [["Android", "700.0K"], ["iPhone", "500.0K"]] },
    { metric: "Impressions", total: "860.0K", platforms: [["Android", "480.0K"], ["iPhone", "380.0K"]] },
    { metric: "ECPM", total: "$4.90", platforms: [["Android", "$4.96"], ["iPhone", "$4.82"]] },
];

/** The coloured key before a label or platform, as realtime.tsx draws it. */
const Dot = ({ color, square }: { color: string; square?: boolean }) => (
    <span className={cx("inline-block size-2.5 shrink-0", square ? "rounded-[2px]" : "rounded-full")} style={{ backgroundColor: color }} aria-hidden="true" />
);
const keyColor = (m: RtMetric, p?: string) => (m === "Revenue" ? tint(p ? platformColor(m, p) : METRIC_COLOR[m], 0.45) : p ? platformColor(m, p) : METRIC_COLOR[m]);

const Label = ({ m }: { m: RtMetric }) => (
    <span className="inline-flex items-center gap-2">
        <Dot color={keyColor(m)} square={m === "Revenue"} />
        {m}
    </span>
);

const V1 = () => (
    <StatLookV1.Provider value="flat">
        <div className="flex flex-wrap gap-x-6 gap-y-4">
            {BLOCKS.map((b) => (
                <StatChipV1
                    key={b.metric}
                    label={<Label m={b.metric} />}
                    sub={
                        <span className="flex flex-col">
                            {b.platforms.map(([p, v]) => (
                                <span key={p} className="inline-flex items-center gap-2 uppercase">
                                    <Dot color={keyColor(b.metric, p)} square={b.metric === "Revenue"} />
                                    {p}
                                    <span className="font-bold text-primary tabular-nums">{v}</span>
                                </span>
                            ))}
                        </span>
                    }
                >
                    <span className="tabular-nums">{b.total}</span>
                </StatChipV1>
            ))}
        </div>
    </StatLookV1.Provider>
);

const V2 = () => (
    <V2Scope>
        <StatLookV2.Provider value="flat">
            <div className="flex flex-wrap gap-x-6 gap-y-4">
                {BLOCKS.map((b) => (
                    <StatChipV2
                        key={b.metric}
                        label={<Label m={b.metric} />}
                        sub={
                            <span className="flex flex-col">
                                {b.platforms.map(([p, v]) => (
                                    <span key={p} className="inline-flex items-center gap-2">
                                        <Dot color={keyColor(b.metric, p)} square={b.metric === "Revenue"} />
                                        <span style={R1.rtPlatformLabel}>{p}</span>
                                        <span style={R1.rtPlatformValue}>{v}</span>
                                    </span>
                                ))}
                            </span>
                        }
                    >
                        {b.total}
                    </StatChipV2>
                ))}
            </div>
        </StatLookV2.Provider>
    </V2Scope>
);

/** R1-05, R1-06 in v1: 24px extra bold dark teal numbers; platform lines at 15px, upper case, number bold. */
export const Before: Story = { render: () => <V1 /> };

/** R1-05, R1-06 in v2: staging's 26px bold #039C9E numbers; platform lines in the 12px tab label style at regular weight, number bold. */
export const After: Story = { render: () => <V2 /> };

/** R1-05, R1-06 (and the R1-04 label): v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    parameters: { layout: "fullscreen" },
    render: () => <BeforeAfter ids={IDS} before={<V1 />} after={<V2 />} />,
};
