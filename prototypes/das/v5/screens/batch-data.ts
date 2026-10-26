import { useCallback, useMemo, useState } from "react";

/**
 * Batch selection state for the library tables, and the CSV writer the exports use.
 *
 * Separate from the components because a .tsx that exports hooks and helpers breaks
 * fast refresh, and these are shared by manage assets and manage keywords alike.
 */

export interface Batch<T> {
    /** Is the table in selection mode? */
    on: boolean;
    /** Narrow the table to just the selected rows. */
    onlySelected: boolean;
    setOnlySelected: (v: boolean) => void;
    /** Every row the table is currently showing, selected or not. */
    rows: T[];
    selectAll: () => void;
    clear: () => void;
    start: () => void;
    stop: () => void;
    ids: Set<string>;
    /** The selected rows, in table order. */
    selected: T[];
    toggle: (id: string) => void;
    toggleAll: () => void;
    allOn: boolean;
    someOn: boolean;
}

export const useBatch = <T extends { id: string }>(rows: T[]): Batch<T> => {
    const [on, setOn] = useState(false);
    const [onlySelected, setOnlySelected] = useState(false);
    const [ids, setIds] = useState<Set<string>>(new Set());

    const selected = useMemo(() => rows.filter((r) => ids.has(r.id)), [rows, ids]);
    const allOn = rows.length > 0 && rows.every((r) => ids.has(r.id));
    const someOn = ids.size > 0 && !allOn;

    const stop = useCallback(() => {
        setOn(false);
        setIds(new Set());
        setOnlySelected(false);
    }, []);

    const toggle = useCallback((id: string) => {
        setIds((prev) => {
            const next = new Set(prev);
            if (!next.delete(id)) next.add(id);
            return next;
        });
    }, []);

    /**
     * The header checkbox: anything selected means the next click clears it.
     *
     * It used to fill the selection out to everything when only some rows were ticked,
     * which is the opposite of what a half-ticked box offers to do — you reach for it to
     * get back to nothing. Select all is still one item away in the count menu.
     *
     * Select all follows the table, so a search narrows what "all" means.
     */
    const toggleAll = useCallback(() => {
        setIds((prev) => (prev.size > 0 ? new Set() : new Set(rows.map((r) => r.id))));
        setOnlySelected(false);
    }, [rows]);

    const selectAll = useCallback(() => setIds(new Set(rows.map((r) => r.id))), [rows]);
    // Clearing while the table is filtered to the selection would leave an empty table
    // and no way back, so it drops the filter too.
    const clear = useCallback(() => {
        setIds(new Set());
        setOnlySelected(false);
    }, []);

    return { on, onlySelected, setOnlySelected, rows, start: () => setOn(true), stop, ids, selected, toggle, toggleAll, allOn, someOn, selectAll, clear };
};


/**
 * Turn rows into a CSV file the browser downloads.
 *
 * Real rather than mimed: a prototype that pretends to export teaches nothing about
 * whether the columns are the right ones. Values are quoted and embedded quotes doubled,
 * because a note like 'Age-gated; "21+" only' would otherwise split into three columns.
 */
export const downloadCsv = (name: string, header: string[], rows: (string | number)[][]) => {
    const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [header.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
