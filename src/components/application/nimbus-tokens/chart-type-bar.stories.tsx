import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Band, Bands, ChartTypeBar, DEFAULT_CHART_ICONS } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

type Kind = keyof typeof DEFAULT_CHART_ICONS;
const LABEL: Record<Kind, string> = { table: "Table", line: "Line", area: "Area", bar: "Bar", stacked: "Stacked bar", pie: "Pie" };
const OPTIONS = (Object.keys(DEFAULT_CHART_ICONS) as Kind[]).map((id) => ({ id, label: LABEL[id], icon: DEFAULT_CHART_ICONS[id] }));

const meta = {
    title: "Application UI/Nimbus Tokens/Chart Type Bar",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`ChartTypeBar` — chart type buttons that fill the band's height, the chosen one teal on a teal tint, the rest pink. Each option carries its own icon so the chart icons from the original Sketch files can be swapped in without touching the component (pending: Product is sending them). Product, 26 Oct: “You can tokenize these buttons though. See how they fill the bar.”",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const InABand: Story = {
    name: "In a band",
    render: () => {
        const [chart, setChart] = useState<Kind>("line");
        return (
            <TokenPage>
                <Rule title="Fills the Chart Type band" route="view-d">
                    Full performance in v5. Icons are placeholders until the Sketch icons arrive.
                </Rule>
                <Bands>
                    <Band label="Chart Type" flush>
                        <ChartTypeBar options={OPTIONS} value={chart} onChange={setChart} />
                    </Band>
                </Bands>
            </TokenPage>
        );
    },
};

export const TableSelected: Story = {
    name: "Table selected",
    render: () => {
        const [chart, setChart] = useState<Kind>("table");
        return (
            <TokenPage>
                <Bands>
                    <Band label="Chart Type" flush>
                        <ChartTypeBar options={OPTIONS} value={chart} onChange={setChart} />
                    </Band>
                </Bands>
            </TokenPage>
        );
    },
};
