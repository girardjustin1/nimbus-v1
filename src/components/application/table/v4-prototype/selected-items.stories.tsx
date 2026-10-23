import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChosenTable } from "../../../../../prototypes/das/v4/screens/search-select";
import { PrototypeTableContext } from "./context";

const presets = {
    apps: { columns: ["App", "Platform", "Bundle ID"], rows: [{ id: "app-1", cells: ["Aurora Alarm", "iOS", "com.testpublisher.auroraalarm"] }] },
    languages: {
        columns: ["Language", "Code"],
        rows: [
            { id: "en", cells: ["English", "en"] },
            { id: "es", cells: ["Spanish", "es"] },
        ],
    },
    keywords: { columns: ["Keyword", "In traffic", "Also used by"], rows: [{ id: "sports", cells: ["sports", "Seen", "2 campaigns"] }] },
    creatives: { columns: ["Creative", "Ad Type", "Ad Size"], rows: [{ id: "creative-1", cells: ["Summer Banner", "HTML", "Banner"] }] },
};

const SelectedExample = ({ kind = "apps", empty = false }: { kind?: keyof typeof presets; empty?: boolean }) => {
    const preset = presets[kind];
    const [rows, setRows] = useState(empty ? [] : preset.rows);
    return (
        <PrototypeTableContext id="chosen">
            <div className="p-6">
                <ChosenTable
                    columns={preset.columns}
                    rows={rows}
                    onRemove={(id) => setRows((current) => current.filter((row) => row.id !== id))}
                    empty="Nothing selected. Add an item to see it here."
                />
            </div>
        </PrototypeTableContext>
    );
};

const meta = {
    title: "Application UI/Table/V4 Prototype/Selected Items",
    component: SelectedExample,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Exact ChosenTable component imported from v4. Small illustrative rows expose each caller's column shape; the existing Campaign Setup Chosen Table story uses this same component. Remove buttons work locally. Apps, Device Language and Keywords are in Targeting; creatives are in Creative.",
            },
        },
    },
} satisfies Meta<typeof SelectedExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Apps: Story = {};
export const Languages: Story = { args: { kind: "languages" } };
export const Keywords: Story = { args: { kind: "keywords" } };
export const Creatives: Story = { args: { kind: "creatives" } };
export const Empty: Story = { args: { empty: true } };
