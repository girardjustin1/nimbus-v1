import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BareSelect, Bands, CollapseButton, DateCell, DateRow, StateAction } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Dates and Dropdowns",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`DateCell`, `BareSelect` and `DateRow` — Performance Insights' date row. A date is a small uppercase label over its value, divided from the next by a rule; it is the same token whether or not it opens a picker (engineering's React date picker replaces the picker itself in the build). `BareSelect` is the quick picker (“Last 7 days”) and the group-by (“By Day”). Product, 26 Oct: “when you represent dates, even if they're not selectable, they should share the layout of this.” Labels stay at the 15px type floor, so they read larger than staging's.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const QUICK = [
    { id: "yesterday", label: "Yesterday" },
    { id: "7", label: "Last 7 days" },
    { id: "30", label: "Last 30 days" },
    { id: "month", label: "This Month" },
    { id: "quarter", label: "This Quarter" },
] as const;
const GROUP = [
    { id: "day", label: "By Day" },
    { id: "week", label: "By Week" },
] as const;

export const StaticDates: Story = {
    name: "Dates · not selectable (Full performance)",
    render: () => (
        <TokenPage>
            <Rule title="Start and end of the flight, shown, not picked" route="view-d">
                Full performance in v5.
            </Rule>
            <Bands>
                <DateRow>
                    <DateCell label="Start date">Sep 1, 2026</DateCell>
                    <DateCell label="End date">Sep 17, 2026</DateCell>
                </DateRow>
            </Bands>
        </TokenPage>
    ),
};

export const SelectableDates: Story = {
    name: "Dates · selectable (Performance Insights)",
    render: () => {
        const [opened, setOpened] = useState(0);
        return (
            <TokenPage>
                <Rule title="The same token, opening a picker">Click a date: in the build this opens engineering's date picker. Opened {opened}×.</Rule>
                <Bands>
                    <DateRow>
                        <DateCell label="Start date" onPress={() => setOpened((n) => n + 1)}>
                            Oct 19, 2026
                        </DateCell>
                        <DateCell label="End date" onPress={() => setOpened((n) => n + 1)}>
                            Oct 25, 2026
                        </DateCell>
                    </DateRow>
                </Bands>
            </TokenPage>
        );
    },
};

export const DateRowComplete: Story = {
    name: "Date row · dates, quick picker, group-by, actions",
    render: () => {
        const [quick, setQuick] = useState<(typeof QUICK)[number]["id"]>("7");
        const [group, setGroup] = useState<(typeof GROUP)[number]["id"]>("day");
        const [collapsed, setCollapsed] = useState(false);
        return (
            <TokenPage>
                <Rule title="The whole row, as Performance Insights lays it out" route="view-d">
                    Quick picker and group-by are `BareSelect`; Download .CSV is a state action; Collapse is a UI controller.
                </Rule>
                <Bands>
                    <DateRow
                        trailing={
                            <>
                                <span className="text-md text-tertiary">All reports are in UTC.</span>
                                <CollapseButton collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
                                <StateAction onPress={() => {}}>Download .CSV</StateAction>
                            </>
                        }
                    >
                        <DateCell label="Start date">Oct 19, 2026</DateCell>
                        <DateCell label="End date">Oct 25, 2026</DateCell>
                        <BareSelect label="Quick picker" value={quick} onChange={setQuick} options={[...QUICK]} />
                        <BareSelect label="Group by" value={group} onChange={setGroup} options={[...GROUP]} />
                    </DateRow>
                </Bands>
            </TokenPage>
        );
    },
};
