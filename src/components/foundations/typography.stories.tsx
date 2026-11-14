import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Foundations → Typography
 * The Nimbus type scale from the Figma token export (6. Typography), wired into
 * `theme.css` and rendered here via the Tailwind text-* classes so the samples
 * always reflect the theme. Proxima Nova throughout.
 * Class names are full literal strings so Tailwind v4's scanner generates them.
 */
const meta = {
    title: "Design System/Styles/Typography",
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

type TypeStyle = { name: string; cls: string; spec: string };

// Token type scale — text-*/display-* map to --text-* in theme.css.
const STYLES: TypeStyle[] = [
    { name: "display-2xl", cls: "text-display-2xl font-semibold", spec: "72 / 90" },
    { name: "display-xl", cls: "text-display-xl font-semibold", spec: "60 / 72" },
    { name: "display-lg", cls: "text-display-lg font-semibold", spec: "48 / 60" },
    { name: "display-md", cls: "text-display-md font-semibold", spec: "36 / 44" },
    { name: "display-sm", cls: "text-display-sm font-semibold", spec: "30 / 38" },
    { name: "display-xs", cls: "text-display-xs font-semibold", spec: "24 / 32" },
    { name: "text-xl", cls: "text-xl font-semibold", spec: "26 / 30" },
    { name: "text-lg", cls: "text-lg font-medium", spec: "18 / 28" },
    { name: "text-md", cls: "text-md", spec: "15 / 24" },
    { name: "text-sm", cls: "text-sm", spec: "13 / 20" },
    { name: "text-xs", cls: "text-xs", spec: "12 / 18" },
    { name: "text-xxs", cls: "text-xxs", spec: "10 / 16" },
];

const SAMPLE = "Efficiency at every layer";

const Row = ({ name, cls, spec }: TypeStyle) => (
    <div className="flex flex-col gap-2 border-b border-secondary py-6">
        <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-sm font-semibold text-primary">{name}</span>
            <span className="text-xs text-tertiary">{spec}</span>
        </div>
        <p className={`${cls} text-primary`}>{SAMPLE}</p>
    </div>
);

export const TypeScale: Story = {
    render: () => (
        <div className="flex flex-col gap-10 bg-primary p-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-display-xs font-semibold text-primary">Nimbus typography</h2>
                <p className="text-md text-tertiary">Proxima Nova. Type scale from the Nimbus token export (size / line-height in px).</p>
            </div>

            <section className="flex flex-col">
                {STYLES.map((s) => (
                    <Row key={s.name} {...s} />
                ))}
            </section>

            <section className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-primary">Weights</h3>
                <div className="flex flex-col gap-1 text-display-xs text-primary">
                    <span className="font-normal">Regular 400 — Nimbus</span>
                    <span className="font-medium">Medium 500 — Nimbus</span>
                    <span className="font-semibold">Semibold 600 — Nimbus</span>
                    <span className="font-bold">Bold 700 — Nimbus</span>
                </div>
                <p className="max-w-2xl text-sm text-tertiary">
                    Proxima Nova is loaded via the Adobe Fonts kit in <code>index.html</code>. Ensure the kit ships the
                    weights you use (Regular 400 / Medium 500 / Semibold 600 / Bold 700); missing weights fall back to the
                    nearest available.
                </p>
            </section>
        </div>
    ),
};
