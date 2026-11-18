import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/base/input/input";
import { RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { rules } from "../../../../../prototypes/das/v1/screens/setup-data";
import { Field as FieldV1, Section as SectionV1 } from "../../../../../prototypes/app/v1/screens/das-shell";
import { tealControls as tealV1 } from "../../../../../prototypes/app/v1/screens/nimbus-ui";
import { RuleCard as RuleCardV1 } from "../../../../../prototypes/app/v1/screens/rules-section";
import { Field as FieldV2, Section as SectionV2 } from "../../../../../prototypes/app/v2/screens/das-shell";
import { tealControls as tealV2 } from "../../../../../prototypes/app/v2/screens/nimbus-ui";
import { RuleCard as RuleCardV2 } from "../../../../../prototypes/app/v2/screens/rules-section";
import { BeforeAfter, Caption, V2Scope } from "./frame";

/**
 * Round 1 · Components · Section labels and form options (R1-07, R1-16).
 * A campaign setup section with its label and a field, then two auction rule cards.
 * Hover can't show in a still story: Hovered forces it on the cards that aren't selected.
 */
const meta = {
    title: "Transition/Round 1/Components/Section labels and form options",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-07", "R1-16"];
const SELECTED = "Guaranteed";
const SHOWN = rules.slice(0, 2);

const HOVER_V1 = "Hover: none on Deal choices; grey (#FAFAFA) on auction rule cards.";
const HOVER_V2 = "Hover: #FCFAF9 on both Deal choices and auction rule cards.";

/**
 * Forces the hover background onto the cards that aren't selected, using the colour each
 * version's card uses on hover (v1: the theme's primary hover grey; v2: the --r1-option-hover tint).
 */
const FORCE_HOVER = `
.r1-force-hover-v1 [role="radiogroup"] label:not([data-selected]) { background-color: var(--color-bg-primary_hover); }
.r1-force-hover-v2 [role="radiogroup"] label:not([data-selected]) { background-color: var(--r1-option-hover); }
`;

const V1 = ({ hovered }: { hovered?: boolean }) => (
    <div className={hovered ? "r1-force-hover-v1" : undefined}>
        <SectionV1 title="Campaign Name">
            <div className="max-w-md">
                <FieldV1 label="Name" required hint="How you'll find this campaign later.">
                    <Input aria-label="Name" size="md" defaultValue="Sample Campaign" />
                </FieldV1>
            </div>
        </SectionV1>
        <SectionV1 title="Auction Rules">
            <RadioGroup style={tealV1} size="md" defaultValue={SELECTED} className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Auction rule">
                {SHOWN.map((r) => (
                    <RuleCardV1 key={r.id} rule={r} selected={r.id === SELECTED} />
                ))}
            </RadioGroup>
            <Caption>{HOVER_V1}</Caption>
        </SectionV1>
    </div>
);

const V2 = ({ hovered }: { hovered?: boolean }) => (
    <V2Scope>
        <div className={hovered ? "r1-force-hover-v2" : undefined}>
            <SectionV2 title="Campaign Name">
                <div className="max-w-md">
                    <FieldV2 label="Name" required hint="How you'll find this campaign later.">
                        <Input aria-label="Name" size="md" defaultValue="Sample Campaign" />
                    </FieldV2>
                </div>
            </SectionV2>
            <SectionV2 title="Auction Rules">
                <RadioGroup style={tealV2} size="md" defaultValue={SELECTED} className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Auction rule">
                    {SHOWN.map((r) => (
                        <RuleCardV2 key={r.id} rule={r} selected={r.id === SELECTED} />
                    ))}
                </RadioGroup>
                <Caption>{HOVER_V2}</Caption>
            </SectionV2>
        </div>
    </V2Scope>
);

/** R1-07, R1-16 in v1: 26px extra bold section labels; grey hover on rule cards, none on Deal choices. */
export const Before: Story = { render: () => <V1 /> };

/** R1-07, R1-16 in v2: staging's 20px bold section label (−0.13px); one #FCFAF9 hover on rule cards and Deal choices. */
export const After: Story = { render: () => <V2 /> };

/** R1-07, R1-16: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    parameters: { layout: "fullscreen" },
    render: () => <BeforeAfter ids={IDS} before={<V1 />} after={<V2 />} />,
};

/** R1-16: v1 above v2 with the hover forced on the cards that aren't selected. */
export const Hovered: Story = {
    parameters: { layout: "fullscreen" },
    render: () => (
        <>
            <style>{FORCE_HOVER}</style>
            <BeforeAfter
                ids={["R1-16"]}
                note="The second card in each shows its hover colour. Deal choices aren't shown here; they take the same hover as the cards in v2 and none in v1."
                before={<V1 hovered />}
                after={<V2 hovered />}
            />
        </>
    ),
};
