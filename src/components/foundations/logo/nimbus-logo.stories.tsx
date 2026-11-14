import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusLogo } from "@/components/foundations/logo/nimbus-logo";

/**
 * Foundations → Logos
 * The Nimbus wordmark assets in both variants.
 */
const meta = {
    title: "Design System/Styles/Logos",
    component: NimbusLogo,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta<typeof NimbusLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Blue wordmark on light surfaces (white + Nimbus cream). */
export const Blue: Story = {
    render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="flex min-h-48 items-center justify-center bg-white p-10">
                <NimbusLogo variant="blue" className="h-8" />
            </div>
            <div className="flex min-h-48 items-center justify-center bg-[#F9F7F3] p-10">
                <NimbusLogo variant="blue" className="h-8" />
            </div>
        </div>
    ),
};

/** White wordmark on dark surfaces (matches the footer navy). */
export const White: Story = {
    render: () => (
        <div className="flex min-h-48 items-center justify-center bg-[#003a5b] p-10">
            <NimbusLogo variant="white" className="h-8" />
        </div>
    ),
};

/** Size range. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-8 bg-white p-10">
            <NimbusLogo variant="blue" className="h-5" />
            <NimbusLogo variant="blue" className="h-7" />
            <NimbusLogo variant="blue" className="h-9" />
            <NimbusLogo variant="blue" className="h-12" />
        </div>
    ),
};
