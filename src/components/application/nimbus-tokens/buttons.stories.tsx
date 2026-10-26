import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Maximize02 } from "@untitledui/icons";
import { CollapseButton, StateAction, UiControlButton } from "../../../../prototypes/das/v5/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

const meta = {
    title: "Application UI/Nimbus Tokens/Buttons",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Two kinds of button from the 26 Oct review. **UI controller** (`UiControlButton`, `CollapseButton`) only changes the UI — expand, collapse — as a grey outline pill. **State action** (`StateAction`) acts on whatever the current state is — Save Query, Download .CSV — as a pink pill, inactive while there is no state to act on (no metric picked). Both names are placeholders: “maybe that's something we should ask” — to confirm with engineering.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const UiController: Story = {
    name: "UI controller",
    render: () => {
        const [collapsed, setCollapsed] = useState(false);
        const [full, setFull] = useState(false);
        return (
            <TokenPage>
                <Rule title="Collapse / Expand" route="view-d">
                    Folds the builder bands away on Full performance in v5.
                </Rule>
                <div className="flex flex-wrap items-center gap-3">
                    <CollapseButton collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
                    <UiControlButton icon={Maximize02} pressed={full} onPress={() => setFull((f) => !f)}>
                        Full screen
                    </UiControlButton>
                </div>
            </TokenPage>
        );
    },
};

export const StateActions: Story = {
    name: "State actions",
    render: () => (
        <TokenPage>
            <Rule title="Enabled, inactive, and quiet" route="view-d">
                Download .CSV on Full performance; Cancel and Save in the filter menu.
            </Rule>
            <div className="flex flex-wrap items-center gap-3">
                <StateAction onPress={() => {}}>Save Query</StateAction>
                <StateAction onPress={() => {}}>Download .CSV</StateAction>
                <StateAction disabled onPress={() => {}}>
                    Save Query
                </StateAction>
                <StateAction disabled onPress={() => {}}>
                    Download .CSV
                </StateAction>
                <StateAction quiet onPress={() => {}}>
                    Cancel
                </StateAction>
            </div>
            <p className="text-md text-tertiary">The pale pair is inactive: nothing selected yet, so there's nothing to save or download.</p>
        </TokenPage>
    ),
};
