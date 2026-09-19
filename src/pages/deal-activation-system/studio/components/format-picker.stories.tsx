import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormatId } from "../studio-data";
import { FormatPicker } from "./format-picker";

/** Studio · Format picker — ad formats as chips, with size notes. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Format Picker" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ initial }: { initial: FormatId }) => {
    const [v, setV] = useState<FormatId>(initial);
    return <FormatPicker value={v} onChange={setV} />;
};
export const Interstitial: Story = { render: () => <Demo initial="interstitial" /> };
export const Native: Story = { render: () => <Demo initial="native" /> };
