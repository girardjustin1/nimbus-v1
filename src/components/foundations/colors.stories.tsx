import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { colorScales, type ColorStep } from "./color-scales.data";

/**
 * Foundations → Colors
 * Rendered directly from the theme variables in `src/styles/theme.css`, which
 * come from the Nimbus Figma token export (reference/styles).
 * Brand = pink (primary) with teal as the secondary / _alt accent.
 */
const meta = {
    title: "Design System/Styles/Color",
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Swatch driven by a live CSS variable so it always matches the theme. */
const VarSwatch = ({ varName, label }: { varName: string; label: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="h-16 w-full rounded-lg ring-1 ring-black/10 ring-inset" style={{ background: `var(${varName})` }} />
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary">{label}</span>
            <span className="text-xs text-tertiary lowercase">{varName.replace("--color-", "")}</span>
        </div>
    </div>
);

const Section = ({ title, description, children }: { title: string; description?: string; children: ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            {description && <p className="text-sm text-tertiary">{description}</p>}
        </div>
        {children}
    </section>
);

const Grid = ({ children }: { children: ReactNode }) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">{children}</div>
);

/* ------------------------------------------------------------------------ *
 * All Colors — every color scale from the Figma variable panel
 * (reference/colors/072326/), rendered with the same swatch, section and grid
 * template as the Palette story below.
 *
 * Reference view only: these values are NOT wired into theme.css yet.
 * ------------------------------------------------------------------------ */

const totalSwatches = colorScales.reduce((n, s) => n + s.steps.length, 0);

/** Hex-driven twin of VarSwatch, for raw scale values. */
const StepSwatch = ({ scale, step }: { scale: string; step: ColorStep }) => (
    <div className="flex flex-col gap-1.5">
        <div className="h-16 w-full rounded-lg ring-1 ring-black/10 ring-inset" style={{ background: step.hex }} />
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary" title={`${scale} / ${step.step}`}>
                {step.step}
            </span>
            <span className="text-xs text-tertiary lowercase">{step.hex}</span>
        </div>
    </div>
);

const brandSteps = ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const graySteps = ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

export const Palette: Story = {
    render: () => (
        <div className="flex flex-col gap-12 bg-primary p-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-display-xs font-semibold text-primary">Nimbus colors</h2>
                <p className="text-md text-tertiary">Brand = pink (primary), teal = secondary / _alt accent, Untitled UI gray neutrals.</p>
            </div>

            <Section title="Brand — Pink (primary)" description="Buttons, links, focus rings and primary brand accents.">
                <Grid>
                    {brandSteps.map((s) => (
                        <VarSwatch key={s} varName={`--color-brand-${s}`} label={`Brand ${s}`} />
                    ))}
                </Grid>
            </Section>

            <Section title="Secondary — Teal (_alt)" description="Secondary / _alt brand slots — e.g. the Global Nav active bar.">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    <VarSwatch varName="--color-teal-secondary" label="Teal" />
                    <VarSwatch varName="--color-teal-secondary_hover" label="Teal · hover" />
                    <VarSwatch varName="--color-teal-subtle" label="Teal · subtle" />
                </div>
            </Section>

            <Section title="Gray (neutrals)" description="Untitled UI gray scale from the token export.">
                <Grid>
                    {graySteps.map((s) => (
                        <VarSwatch key={s} varName={`--color-neutral-${s}`} label={`Gray ${s}`} />
                    ))}
                </Grid>
            </Section>

            <Section title="Semantic — Backgrounds" description="Resolved brand/surface backgrounds used by components.">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    <VarSwatch varName="--color-bg-brand-solid" label="bg-brand-solid" />
                    <VarSwatch varName="--color-bg-brand-solid_hover" label="bg-brand-solid_hover" />
                    <VarSwatch varName="--color-bg-brand-secondary" label="bg-brand-secondary" />
                    <VarSwatch varName="--color-bg-brand-primary" label="bg-brand-primary" />
                    <VarSwatch varName="--color-bg-primary" label="bg-primary" />
                    <VarSwatch varName="--color-bg-secondary" label="bg-secondary" />
                </div>
            </Section>

            <Section title="Semantic — Foreground, Text & Border">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    <VarSwatch varName="--color-fg-brand-primary" label="fg-brand-primary" />
                    <VarSwatch varName="--color-fg-brand-secondary" label="fg-brand-secondary" />
                    <VarSwatch varName="--color-text-brand-primary" label="text-brand-primary" />
                    <VarSwatch varName="--color-border-brand" label="border-brand" />
                    <VarSwatch varName="--color-border-brand_alt" label="border-brand_alt" />
                    <VarSwatch varName="--color-focus-ring" label="focus-ring" />
                </div>
            </Section>

            <Section title="Semantic — States">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    <VarSwatch varName="--color-bg-error-solid" label="error" />
                    <VarSwatch varName="--color-bg-warning-solid" label="warning" />
                    <VarSwatch varName="--color-bg-success-solid" label="success" />
                </div>
            </Section>
        </div>
    ),
};

/** Every color scale from the Figma variable panel, in Figma order. */
export const AllColors: Story = {
    render: () => (
        <div className="flex flex-col gap-12 bg-primary p-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-display-xs font-semibold text-primary">All colors</h2>
                <p className="text-md text-tertiary">
                    All {colorScales.length} Nimbus color scales ({totalSwatches} colors), 25 through 950. Reference only — not yet connected to the theme.
                </p>
            </div>

            {colorScales.map((scale) => (
                <Section key={scale.name} title={scale.name} description={`${scale.steps.length} steps`}>
                    <Grid>
                        {scale.steps.map((step) => (
                            <StepSwatch key={step.step} scale={scale.name} step={step} />
                        ))}
                    </Grid>
                </Section>
            ))}
        </div>
    ),
};
