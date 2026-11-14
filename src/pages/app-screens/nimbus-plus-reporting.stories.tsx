import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusPlusReportingFilterUpsellPanel, NimbusPlusReportingUpsellModal } from "./nimbus-plus-reporting";

const meta = {
    title: "Archive/App Screens/Nimbus+ Reporting",
    component: NimbusPlusReportingFilterUpsellPanel,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof NimbusPlusReportingFilterUpsellPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The reporting query-builder with the Filter drill-down panel open. Selecting
 * the "Nimbus+ Demand" category reveals a three-column Nimbus+ upsell: a filter
 * category list, an intro block with an "Activate Nimbus+" button, and four
 * feature blocks — plus a Cancel / Save footer.
 */
export const FilterUpsellPanel: Story = {};

/**
 * The standalone Nimbus+ upsell modal centered over a dimmed reporting screen:
 * teal "Introducing Nimbus+" eyebrow, bold headline, intro paragraph, four
 * feature blocks, a divider, and a full-width pink "Activate Nimbus+" button.
 */
export const UpsellModal: StoryObj = {
    render: () => <NimbusPlusReportingUpsellModal />,
};
