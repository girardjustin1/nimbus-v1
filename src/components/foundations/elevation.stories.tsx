import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Styles → Elevation
 * The shadow scale from the theme (--shadow-*), used for cards, popovers, modals.
 */
const meta = {
    title: "Design System/Styles/Elevation",
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SHADOWS = [
    { cls: "shadow-xs", name: "xs" },
    { cls: "shadow-sm", name: "sm" },
    { cls: "shadow-md", name: "md" },
    { cls: "shadow-lg", name: "lg" },
    { cls: "shadow-xl", name: "xl" },
    { cls: "shadow-2xl", name: "2xl" },
    { cls: "shadow-3xl", name: "3xl" },
];

export const Shadows: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-8 bg-[#f9f7f3] p-12 sm:grid-cols-3 lg:grid-cols-4">
            {SHADOWS.map((s) => (
                <div
                    key={s.name}
                    className={`flex h-28 w-full items-center justify-center rounded-xl bg-white ${s.cls}`}
                >
                    <span className="text-sm font-semibold text-[#181d27]">shadow-{s.name}</span>
                </div>
            ))}
        </div>
    ),
};
