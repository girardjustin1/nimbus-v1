import type { Meta, StoryObj } from "@storybook/react-vite";
import { SdkDocumentationScreen } from "./sdk-documentation";

const meta = {
    title: "Archive/App Screens/SDK & Documentation",
    component: SdkDocumentationScreen,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof SdkDocumentationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Nimbus SDKs: two equal cards presenting the iOS and Android SDKs, each with a
 * teal circular-outline platform glyph, description, "Latest SDK Version" (2.1.0
 * in teal), a pink "View Documentation" link, and a pink "BLOCK" button.
 */
export const Default: Story = {};
