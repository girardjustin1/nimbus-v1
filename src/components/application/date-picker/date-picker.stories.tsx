import { useState } from "react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateValue, RangeValue } from "react-aria-components";
import { DatePicker } from "./date-picker";
import { DateRangePicker } from "./date-range-picker";

const meta = {
    title: "Design System/Application UI/Date Picker",
    component: DatePicker,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-date picker with a preselected value — Nimbus theme applied globally. */
export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState<DateValue | null>(parseDate("2026-01-15"));
        return <DatePicker {...args} value={value} onChange={setValue} />;
    },
};

/** Single-date picker defaulting to today with no preselected value. */
export const Empty: Story = {
    render: (args) => {
        const [value, setValue] = useState<DateValue | null>(null);
        return <DatePicker {...args} value={value} onChange={setValue} />;
    },
};

/** Date range picker with quick presets and a preselected range. */
export const DateRange: StoryObj<typeof DateRangePicker> = {
    render: (args) => {
        const now = today(getLocalTimeZone());
        const [value, setValue] = useState<RangeValue<DateValue> | null>({
            start: now.subtract({ days: 7 }),
            end: now,
        });
        return <DateRangePicker {...args} value={value} onChange={setValue} />;
    },
};
