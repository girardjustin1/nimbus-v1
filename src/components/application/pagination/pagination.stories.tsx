import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationLine } from "./pagination-line";
import { PaginationDot } from "./pagination-dot";
import { PaginationButtonGroup, PaginationCardDefault, PaginationPageDefault } from "./pagination";

const meta = {
    title: "Design System/Application UI/Pagination",
    component: PaginationPageDefault,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof PaginationPageDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Numbered pages with Previous/Next links — Nimbus theme applied globally. */
export const Default: Story = {
    render: (args) => {
        const [page, setPage] = useState(1);
        return (
            <div className="max-w-3xl">
                <PaginationPageDefault {...args} page={page} total={10} onPageChange={setPage} />
            </div>
        );
    },
};

/** Numbered pages inside a card layout, rounded buttons. */
export const Card: Story = {
    render: () => {
        const [page, setPage] = useState(4);
        return (
            <div className="max-w-3xl overflow-hidden rounded-xl ring-1 ring-secondary">
                <PaginationCardDefault rounded page={page} total={10} onPageChange={setPage} />
            </div>
        );
    },
};

/** Page numbers rendered as a connected button group. */
export const ButtonGroup: StoryObj<typeof PaginationButtonGroup> = {
    render: () => {
        const [page, setPage] = useState(3);
        return (
            <div className="max-w-3xl">
                <PaginationButtonGroup align="center" page={page} total={10} onPageChange={setPage} />
            </div>
        );
    },
};

/** Compact line indicator, useful for carousels and onboarding flows. */
export const Line: StoryObj<typeof PaginationLine> = {
    render: () => {
        const [page, setPage] = useState(2);
        return <PaginationLine page={page} total={5} size="md" onPageChange={setPage} />;
    },
};

/** Compact dot indicator, useful for carousels and onboarding flows. */
export const Dot: StoryObj<typeof PaginationDot> = {
    render: () => {
        const [page, setPage] = useState(2);
        return <PaginationDot page={page} total={5} size="lg" onPageChange={setPage} />;
    },
};
