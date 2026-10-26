import { useMemo, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SortDescriptor } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";

/**
 * Application UI → Table
 *
 * Nimbus-themed sortable data table. The TableCard + Table compound components
 * render with the Nimbus theme out of the box. Click a sortable column header to
 * toggle sort direction. Below are several common Untitled UI table variants:
 * default, row selection, avatars, row actions, and a compact size.
 */

type Status = "active" | "invited" | "offline";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    status: Status;
    initials: string;
}

interface Column {
    id: string;
    label: string;
    allowsSorting?: boolean;
    isRowHeader?: boolean;
}

const baseColumns: Column[] = [
    { id: "name", label: "Name", allowsSorting: true, isRowHeader: true },
    { id: "email", label: "Email", allowsSorting: true },
    { id: "role", label: "Role", allowsSorting: true },
    { id: "status", label: "Status", allowsSorting: true },
];

const actionsColumn: Column = { id: "actions", label: "" };

const members: Member[] = [
    { id: "1", name: "Vanessa Eng", email: "vanessa@nimbus.com", role: "Product Manager", status: "active", initials: "VE" },
    { id: "2", name: "Kristen Smith", email: "kristen@nimbus.com", role: "Frontend Engineer", status: "active", initials: "KS" },
    { id: "3", name: "Marc Santiago", email: "marc@nimbus.com", role: "Design Lead", status: "invited", initials: "MS" },
    { id: "4", name: "Olivia Rhye", email: "olivia@nimbus.com", role: "Backend Engineer", status: "offline", initials: "OR" },
    { id: "5", name: "Phoenix Baker", email: "phoenix@nimbus.com", role: "Data Analyst", status: "active", initials: "PB" },
];

const statusBadge: Record<Status, ReactNode> = {
    active: <BadgeWithDot color="success" type="pill-color" size="sm">Active</BadgeWithDot>,
    invited: <BadgeWithDot color="warning" type="pill-color" size="sm">Invited</BadgeWithDot>,
    offline: <BadgeWithDot color="gray" type="pill-color" size="sm">Offline</BadgeWithDot>,
};

interface TeamTableProps {
    /** Add a leading multi-select checkbox column. */
    selectable?: boolean;
    /** Show an avatar next to the member name. */
    withAvatars?: boolean;
    /** Add a trailing row-actions (dots menu) column. */
    withActions?: boolean;
    /** Table density. */
    size?: "sm" | "md";
}

const TeamTable = ({ selectable, withAvatars, withActions, size = "md" }: TeamTableProps) => {
    const [sort, setSort] = useState<SortDescriptor>({ column: "name", direction: "ascending" });

    const columns = withActions ? [...baseColumns, actionsColumn] : baseColumns;

    const sortedRows = useMemo(() => {
        if (!sort.column) return members;
        const col = sort.column as keyof Member;
        const sorted = [...members].sort((a, b) => String(a[col]).localeCompare(String(b[col]), undefined, { numeric: true }));
        return sort.direction === "descending" ? sorted.reverse() : sorted;
    }, [sort]);

    return (
        <TableCard.Root size={size}>
            <TableCard.Header title="Team members" badge="5 users" description="Manage your team members and their account permissions here." />
            <Table
                aria-label="Team members"
                size={size}
                selectionMode={selectable ? "multiple" : "none"}
                defaultSelectedKeys={selectable ? ["2", "5"] : undefined}
                sortDescriptor={sort}
                onSortChange={setSort}
            >
                <Table.Header>
                    {columns.map((col) => (
                        <Table.Head key={col.id} id={col.id} label={col.label} isRowHeader={col.isRowHeader} allowsSorting={col.allowsSorting} />
                    ))}
                </Table.Header>
                <Table.Body items={sortedRows}>
                    {(row) => (
                        <Table.Row id={row.id} columns={columns}>
                            {(col: Column) => (
                                <Table.Cell className={col.id === "actions" ? "text-right" : undefined}>
                                    {col.id === "actions" ? (
                                        <TableRowActionsDropdown />
                                    ) : col.id === "status" ? (
                                        statusBadge[row.status]
                                    ) : col.id === "name" ? (
                                        withAvatars ? (
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm" initials={row.initials} alt={row.name} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-primary">{row.name}</span>
                                                    <span className="text-sm text-tertiary">{row.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        )
                                    ) : (
                                        <span className="text-sm text-tertiary">{row[col.id as keyof Member]}</span>
                                    )}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

const meta = {
    title: "Application UI/Table",
    component: Table,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: 'The generic table patterns below are complemented by the current App Screens inventory in <a href="./?path=/docs/application-ui-table-102326-00-audit--docs" target="_top">102326 — table audit and extracted examples</a>. That folder includes complete screen tables, payment and error states, and the actual cell controls used in those screens. <a href="./?path=/docs/application-ui-table-v5-prototype-00-overview--docs" target="_top">V5 Prototype — table locations and matching components</a> maps the current prototype tables to their closest design-system examples, including the charcoal-header references.',
            },
        },
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="bg-secondary p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof TeamTable>;

/** Sortable team-members table wrapped in a TableCard with a header. */
export const Default: Story = {
    render: () => <TeamTable />,
};

/** Multi-select with a leading checkbox column (two rows pre-selected). */
export const WithSelection: Story = {
    render: () => <TeamTable selectable />,
};

/** Identity cell pairs an avatar with the member's name and email. */
export const WithAvatars: Story = {
    render: () => <TeamTable withAvatars />,
};

/** Trailing row-actions column with a dots (⋯) dropdown menu. */
export const WithRowActions: Story = {
    render: () => <TeamTable withActions />,
};

/** Everything combined: selection + avatars + row actions. */
export const WithSelectionAvatarsAndActions: Story = {
    render: () => <TeamTable selectable withAvatars withActions />,
};

/** Compact (small) density for data-dense screens. */
export const Compact: Story = {
    render: () => <TeamTable size="sm" withActions />,
};
