import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListTableExample, ReportTableExample } from "./table-examples";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Tables",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`TABLE` and `tableHead` — table styles by context. **Report**: charcoal #101828 header with white labels, warm alternating rows, totals. **List**: light header with bold black labels. Striped rows alternate white `#FFF` and `#FCFAF9` in both (27 Oct). Both have vertical rules between columns and run full bleed on a page (`TABLE.bleed`), the first and last cells taking the page padding back so text lines up with what's above. The full rule, and where each v5 table sits, is in Application UI › Table › List vs Report.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const List: Story = {
    render: () => (
        <TokenPage>
            <Rule title="List — an organised set of things" route="asset-view">
                View All Assets in v5: light header, bold black labels, column rules, full bleed.
            </Rule>
            <ListTableExample />
        </TokenPage>
    ),
};

export const Report: Story = {
    render: () => (
        <TokenPage>
            <Rule title="Report — numbers about delivery" route="view-d">
                Full performance in v5: charcoal header, warm alternating rows, totals, full bleed.
            </Rule>
            <ReportTableExample />
        </TokenPage>
    ),
};
