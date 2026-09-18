/**
 * Tag entries with stable IDs, shared by InputTags and InputTagsOuter.
 *
 * Kept as plain state (not refs) so rendering stays pure: the ID counter lives in
 * the state object, and reconciling a new controlled `value` is a pure function.
 */

export interface TagEntry<Id> {
    id: Id;
    label: string;
}

export interface TagEntriesState<Id> {
    entries: TagEntry<Id>[];
    /** Next number to hand to `toId` for a new entry. */
    nextId: number;
    /** The controlled `value` these entries were built from (undefined when uncontrolled). */
    source?: string[];
}

export const createTagEntries = <Id>(labels: string[], toId: (n: number) => Id, source?: string[]): TagEntriesState<Id> => ({
    entries: labels.map((label, i) => ({ id: toId(i), label })),
    nextId: labels.length,
    source,
});

/**
 * Rebuild entries for a new controlled value, reusing the IDs of labels that are
 * still present so React keys don't shift; only genuinely new labels get new IDs.
 */
export const reconcileTagEntries = <Id>(state: TagEntriesState<Id>, value: string[], toId: (n: number) => Id): TagEntriesState<Id> => {
    const used = new Set<number>();
    let nextId = state.nextId;
    const entries = value.map((label) => {
        const oldIndex = state.entries.findIndex((e, i) => e.label === label && !used.has(i));
        if (oldIndex !== -1) {
            used.add(oldIndex);
            return state.entries[oldIndex];
        }
        return { id: toId(nextId++), label };
    });
    return { entries, nextId, source: value };
};
