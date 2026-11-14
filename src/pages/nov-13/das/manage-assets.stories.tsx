import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssetDetail } from "../../../../prototypes/app/v1/screens/asset-detail";
import { AssetSetup, ViewAllAssets } from "../../../../prototypes/app/v1/screens/asset-library";

/** Full application · Deal Activation System · Manage assets — from DAS Round 6, unchanged. */
const meta = {
    title: "Prototypes/Full application/Deal Activation System/Manage assets",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** View All Assets — every column sorts. */
export const Default: Story = { render: () => <ViewAllAssets /> };

/** Asset Setup — add a creative by pasting its markup. */
export const AssetSetupForm: Story = { name: "Asset setup", render: () => <AssetSetup /> };

/** One asset's detail. */
export const Detail: Story = { render: () => <AssetDetail id="a4" /> };
