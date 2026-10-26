import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapseButton, PageTabs } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Page Tabs",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`PageTabs` — tabs across the top of a page, as on staging (Saved Queries / New Query, Asset Setup / View All Assets). Bold labels, thin rules between tabs, the active tab filled teal with a teal rule under it; inactive tabs read pink like staging's links. Used in v5 on Manage assets (Asset Setup / View All Assets) and Manage keywords (Keyword Setup / View All Keywords / Keyword Health). Product, 26 Oct: “these tabs should be a thing.”",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const ASSETS = [
    { id: "setup", label: "Asset Setup", href: "#/asset-setup" },
    { id: "view", label: "View All Assets", href: "#/asset-view" },
];

export const Assets: Story = {
    render: () => (
        <div className="bg-primary">
            <PageTabs tabs={ASSETS} active="view" />
            <TokenPage>
                <Rule title="Two tabs, the second active" route="asset-view">
                    Manage assets in v5.
                </Rule>
            </TokenPage>
        </div>
    ),
};

export const Keywords: Story = {
    render: () => (
        <div className="bg-primary">
            <PageTabs
                tabs={[
                    { id: "setup", label: "Keyword Setup", href: "#/keyword-setup" },
                    { id: "view", label: "View All Keywords", href: "#/keyword-view" },
                    { id: "health", label: "Keyword Health", href: "#/keyword-health" },
                ]}
                active="setup"
            />
            <TokenPage>
                <Rule title="Three tabs, the first active" route="keyword-setup">
                    Manage keywords in v5.
                </Rule>
            </TokenPage>
        </div>
    ),
};

export const WithTrailingControls: Story = {
    name: "With trailing controls (Performance Insights)",
    render: () => (
        <div className="bg-primary">
            <PageTabs
                tabs={[
                    { id: "saved", label: "Saved Queries", href: "#" },
                    { id: "new", label: "New Query", href: "#" },
                ]}
                active="new"
                trailing={
                    <>
                        <span className="text-md text-tertiary">All reports are in UTC.</span>
                        <CollapseButton collapsed={false} onToggle={() => {}} />
                    </>
                }
            />
            <TokenPage>
                <Rule title="Tabs with the UTC note and Collapse on the right">How Performance Insights lays out its tab row on staging; ready for the redesign.</Rule>
            </TokenPage>
        </div>
    ),
};
