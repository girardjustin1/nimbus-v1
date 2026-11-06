import { type ReactNode, isValidElement, useState } from "react";

/**
 * Sortable tables — 6 Nov review: "every table needs to be sortable."
 *
 * One rule for every table in DAS, the same one Manage Campaigns has had since Round 6:
 * click a header to sort ascending, again for descending, a third time to go back to the
 * table's own order. Empty values ("—", no budget) always sort last, whichever way.
 * The header itself is `SortTh` in nimbus-ui.tsx.
 */

export type SortValue = string | number | undefined;
export type SortState = { id: string; dir: 1 | -1 } | null;

export const nextSort = (cur: SortState, id: string): SortState => (cur?.id !== id ? { id, dir: 1 } : cur.dir === 1 ? { id, dir: -1 } : null);

export const ariaSort = (sort: SortState, id: string) => (sort?.id === id ? (sort.dir === 1 ? "ascending" : "descending") : "none");

const compare = (x: SortValue, y: SortValue, dir: 1 | -1) => {
    if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
    if (typeof x === "string" && typeof y === "string") return x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" }) * dir;
    return (x < y ? -1 : x > y ? 1 : 0) * dir;
};

export const sortRows = <T>(rows: T[], sort: SortState, key: (row: T, id: string) => SortValue): T[] =>
    sort ? [...rows].sort((a, b) => compare(key(a, sort.id), key(b, sort.id), sort.dir)) : rows;

/** The text a cell shows, for tables whose cells are already rendered (ChosenTable). */
export const nodeText = (node: ReactNode): string => {
    if (node === null || node === undefined || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(nodeText).join("");
    if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
    return "";
};

/** A cell's text as a sort key: numbers sort as numbers, dashes and blanks sort last. */
export const textKey = (node: ReactNode): SortValue => {
    const t = nodeText(node).trim();
    if (!t || t === "—" || t === "None") return undefined;
    const n = Number(t.replace(/[$,%]/g, ""));
    return Number.isFinite(n) ? n : t;
};

export const useTableSort = <T>(rows: T[], key: (row: T, id: string) => SortValue, initial: SortState = null) => {
    const [sort, setSort] = useState<SortState>(initial);
    return {
        sort,
        rows: sortRows(rows, sort, key),
        onSort: (id: string) => setSort((cur) => nextSort(cur, id)),
    };
};
