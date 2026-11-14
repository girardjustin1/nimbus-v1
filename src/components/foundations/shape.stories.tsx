import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Styles → Shape
 * The corner-radius scale from the theme (--radius-*).
 */
const meta = {
    title: "Design System/Styles/Shape",
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const RADII = [
    { cls: "rounded-none", name: "none" },
    { cls: "rounded-xs", name: "xs" },
    { cls: "rounded-sm", name: "sm" },
    { cls: "rounded-md", name: "md" },
    { cls: "rounded-lg", name: "lg" },
    { cls: "rounded-xl", name: "xl" },
    { cls: "rounded-2xl", name: "2xl" },
    { cls: "rounded-3xl", name: "3xl" },
    { cls: "rounded-full", name: "full" },
];

export const Radius: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-8 bg-[#f9f7f3] p-12 sm:grid-cols-4 lg:grid-cols-5">
            {RADII.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-3">
                    <div className={`size-24 border-2 border-[#08c6c7] bg-[#cef4f4] ${r.cls}`} />
                    <span className="text-xs font-semibold text-[#181d27]">radius-{r.name}</span>
                </div>
            ))}
        </div>
    ),
};
