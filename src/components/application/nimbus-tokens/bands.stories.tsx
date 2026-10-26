import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Band, Bands, ChartTypeBar, DEFAULT_CHART_ICONS } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Bands",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`Bands` / `Band` — Performance Insights' full-span sections of UI. Each band runs edge to edge of the content area with one rule between bands; the band label (“Metrics:”) sits in its own 150px column, then the controls, then optional trailing controls. `flush` drops the vertical padding so a control can fill the band's height (the chart type bar). Bands also make every checkbox and radio inside them teal. Used in v5 on Full performance. Product, 26 Oct: “metrics is in its own band, breakdowns are in its own band, and then inside of it you've got the band label.”",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const Example = () => {
    const [metrics, setMetrics] = useState(["Spend", "Impressions"]);
    const [dims, setDims] = useState(["Creative"]);
    const [chart, setChart] = useState<keyof typeof DEFAULT_CHART_ICONS>("line");
    const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
    return (
        <Bands>
            <Band label="Metrics">
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {["Spend", "Impressions", "eCPM"].map((m) => (
                        <Checkbox key={m} size="md" label={<span className="text-md font-bold text-primary">{m}</span>} isSelected={metrics.includes(m)} onChange={() => toggle(metrics, setMetrics, m)} />
                    ))}
                </div>
            </Band>
            <Band label="Breakdown">
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {["Creative", "Platform", "Geo", "App", "Keyword", "Device Language"].map((d) => (
                        <Checkbox key={d} size="md" label={<span className="text-md font-bold text-primary">{d}</span>} isSelected={dims.includes(d)} onChange={() => toggle(dims, setDims, d)} />
                    ))}
                </div>
            </Band>
            <Band label="Chart Type" flush>
                <ChartTypeBar
                    value={chart}
                    onChange={setChart}
                    options={(Object.keys(DEFAULT_CHART_ICONS) as (keyof typeof DEFAULT_CHART_ICONS)[]).map((id) => ({ id, label: id === "stacked" ? "Stacked bar" : id[0].toUpperCase() + id.slice(1), icon: DEFAULT_CHART_ICONS[id] }))}
                />
            </Band>
        </Bands>
    );
};

export const Builder: Story = {
    render: () => (
        <TokenPage>
            <Rule title="Metrics, Breakdown and Chart Type as bands" route="view-d">
                Full performance in v5. Checkboxes inside bands take staging's look.
            </Rule>
            <Example />
        </TokenPage>
    ),
};

export const WithTrailing: Story = {
    name: "With trailing control",
    render: () => (
        <TokenPage>
            <Rule title="A band with a control at the far right">The ✕ that clears a band sits here, as on staging's Metrics and Filters rows.</Rule>
            <Bands>
                <Band label="Metrics" trailing={<span className="text-md font-semibold text-tertiary">Clear</span>}>
                    <Checkbox size="md" label={<span className="text-md font-bold text-primary">Requests</span>} isSelected />
                </Band>
            </Bands>
        </TokenPage>
    ),
};
