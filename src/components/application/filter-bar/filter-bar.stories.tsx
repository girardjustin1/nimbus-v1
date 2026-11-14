import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart01, Calendar, Download01, List, Rows01, SearchLg } from "@untitledui/icons";
import { FilterBar } from "@/components/application/filter-bar/filter-bar";
import { FilterDropdown, type FilterRow } from "@/components/application/filter-bar/filter-dropdown-menu";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

/**
 * Filter bars sit above data tables to search, segment and filter results.
 * The Nimbus theme styles every control globally — these stories just compose
 * the `FilterBar.*` layout parts with a search input, a segmented view control,
 * a channel select, and the advanced `FilterDropdown` popover.
 */
const meta = {
    title: "Design System/Application UI/Filter Bars",
    component: FilterBar.Root,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof FilterBar.Root>;

export default meta;
type Story = StoryObj<typeof FilterBar.Root>;

const channelItems = [
    { id: "all", label: "All channels" },
    { id: "programmatic", label: "Programmatic" },
    { id: "search", label: "Paid search" },
    { id: "social", label: "Paid social" },
    { id: "ctv", label: "Connected TV" },
];

const fieldOptions = [
    { id: "channel", label: "Channel" },
    { id: "region", label: "Region" },
    { id: "status", label: "Status" },
    { id: "spend", label: "Spend" },
];

const operatorOptions = [
    { id: "is", label: "is" },
    { id: "is-not", label: "is not" },
    { id: "contains", label: "contains" },
];

let nextId = 2;

/** Stateful advanced-filter popover wired to the `FilterDropdown` render-row API. */
const AdvancedFilters = () => {
    const [filters, setFilters] = useState<FilterRow[]>([{ id: "f1", field: "channel", operator: "is", value: "Programmatic" }]);
    const [applied, setApplied] = useState(1);

    return (
        <FilterDropdown
            filters={filters}
            appliedCount={applied}
            onAddFilter={() => setFilters((prev) => [...prev, { id: `f${nextId++}`, field: "region", operator: "is", value: "" }])}
            onRemoveFilter={(id) => setFilters((prev) => prev.filter((f) => f.id !== id))}
            onFilterChange={(id, patch) => setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))}
            onClearAll={() => {
                setFilters([]);
                setApplied(0);
            }}
            onApply={(next) => setApplied(next.length)}
            renderFilterRow={(filter, onChange) => (
                <>
                    <div className="w-40 shrink-0">
                        <Select
                            aria-label="Field"
                            size="sm"
                            items={fieldOptions}
                            selectedKey={filter.field}
                            onSelectionChange={(key) => key != null && onChange({ field: String(key) })}
                        >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                    </div>
                    <div className="w-32 shrink-0">
                        <Select
                            aria-label="Operator"
                            size="sm"
                            items={operatorOptions}
                            selectedKey={filter.operator}
                            onSelectionChange={(key) => key != null && onChange({ operator: String(key) })}
                        >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                    </div>
                    <div className="min-w-0 flex-1">
                        <Input aria-label="Value" size="sm" placeholder="Value" value={filter.value} onChange={(value) => onChange({ value })} />
                    </div>
                </>
            )}
        />
    );
};

/** A full filter row: search, segmented view control and channel select on the left; date, export and advanced filters on the right. */
export const Default: Story = {
    render: () => (
        <FilterBar.Root>
            <FilterBar.Content>
                <div className="w-full max-w-xs">
                    <Input aria-label="Search" icon={SearchLg} placeholder="Search campaigns" />
                </div>
                <ButtonGroup defaultSelectedKeys={["list"]}>
                    <ButtonGroupItem id="list" iconLeading={List} aria-label="List view" />
                    <ButtonGroupItem id="rows" iconLeading={Rows01} aria-label="Row view" />
                    <ButtonGroupItem id="chart" iconLeading={BarChart01} aria-label="Chart view" />
                </ButtonGroup>
                <div className="w-48">
                    <Select aria-label="Channel" defaultSelectedKey="all" items={channelItems}>
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                </div>
            </FilterBar.Content>

            <FilterBar.Actions>
                <FilterBar.FilterIconButton icon={Calendar} label="Date range" />
                <FilterBar.FilterIconButton icon={Download01} label="Export" />
                <AdvancedFilters />
            </FilterBar.Actions>
        </FilterBar.Root>
    ),
};

/** Minimal bar — just a search field and the advanced filters dropdown. */
export const SearchAndFilters: Story = {
    render: () => (
        <FilterBar.Root>
            <FilterBar.Content>
                <div className="w-full max-w-sm">
                    <Input aria-label="Search" icon={SearchLg} placeholder="Search demand" />
                </div>
            </FilterBar.Content>
            <FilterBar.Actions>
                <AdvancedFilters />
            </FilterBar.Actions>
        </FilterBar.Root>
    ),
};

/** The empty state of the advanced filter popover, shown when no filters are applied. */
const EmptyFilters = () => {
    const [filters, setFilters] = useState<FilterRow[]>([]);
    return (
        <FilterDropdown
            filters={filters}
            onAddFilter={() => setFilters([{ id: `f${nextId++}`, field: "channel", operator: "is", value: "" }])}
            onRemoveFilter={(id) => setFilters((prev) => prev.filter((f) => f.id !== id))}
            onFilterChange={(id, patch) => setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))}
            onClearAll={() => setFilters([])}
            renderFilterRow={(filter, onChange) => (
                <div className="min-w-0 flex-1">
                    <Input aria-label="Value" size="sm" placeholder="Value" value={filter.value} onChange={(value) => onChange({ value })} />
                </div>
            )}
        />
    );
};

/** Filter bar whose advanced dropdown starts empty (renders the "No filters applied" panel). */
export const EmptyState: Story = {
    render: () => (
        <FilterBar.Root>
            <FilterBar.Content>
                <div className="w-full max-w-sm">
                    <Input aria-label="Search" icon={SearchLg} placeholder="Search campaigns" />
                </div>
            </FilterBar.Content>
            <FilterBar.Actions>
                <EmptyFilters />
            </FilterBar.Actions>
        </FilterBar.Root>
    ),
};
