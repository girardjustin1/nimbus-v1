import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudienceSentence, KeywordTargetingInline, KeywordTargetingLibrary } from "./keyword-targeting";

/**
 * Deal Activation System → Targeting.
 *
 * Three concepts for the Extended Targeting charter's new fields: publisher-defined
 * keywords with ANY/ALL matching, Ad Unit Type and Device Language.
 */
const meta = {
    title: "Deal Activation System/Targeting",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Concept A: free-text keyword chips (the charter's field), plus standard targets. Try typing a keyword and pressing Enter. */
export const ConceptAInlineChips: Story = { name: "Concept A · Inline keyword chips", render: () => <KeywordTargetingInline /> };

/** Concept A, ALL match with a keyword that isn't in traffic and one that's new to the library. */
export const ConceptAAllMatchWarnings: Story = {
    name: "Concept A · ALL match + warnings",
    render: () => <KeywordTargetingInline match="ALL" initial={["over21", "77541", "tailgate"]} />,
};

/** Concept B: choose from the Keyword Library with usage and traffic signals; create new inline. */
export const ConceptBLibraryPicker: Story = { name: "Concept B · Pick from library", render: () => <KeywordTargetingLibrary /> };

/** Concept C: the whole target as one editable sentence, which doubles as the review summary. */
export const ConceptCAudienceSentence: Story = { name: "Concept C · Audience sentence", render: () => <AudienceSentence /> };
