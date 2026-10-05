import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { AlertTriangle, ChevronDown, Trash01, XClose } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { Button } from "./type-rules";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Toggle } from "@/components/base/toggle/toggle";
import type { Batch } from "./batch-data";

/**
 * Batch actions for the library tables.
 *
 * Selection is a mode you turn on, not a column that is always there. Manage assets and
 * manage keywords are read far more often than they are bulk-edited, and a permanent
 * checkbox column puts a destructive affordance in front of every row for the sake of
 * the rarer job. Choosing “Batch actions” from the menu turns the table into a picker,
 * and leaving the mode puts it back.
 *
 * The same hook and bar drive both tables, so the two can't drift apart.
 */

/** The header cell that selects or clears the whole (filtered) table. */
export const BatchHeadCell = ({ batch }: { batch: Batch<{ id: string }> }) => (
    <th className="w-10 px-3 py-2.5">
        <Checkbox size="sm" aria-label="Select all rows" isSelected={batch.allOn} isIndeterminate={batch.someOn} onChange={batch.toggleAll} />
    </th>
);

/** The per-row cell. */
export const BatchCell = ({ batch, id, label }: { batch: Batch<{ id: string }>; id: string; label: string }) => (
    <td className="w-10 px-3 py-3">
        <Checkbox size="sm" aria-label={`Select ${label}`} isSelected={batch.ids.has(id)} onChange={() => batch.toggle(id)} />
    </td>
);

/**
 * An action in the selection bar.
 *
 * Deliberately not a Button. A full secondary button is sized for a page's primary
 * action, and three of them in a toolbar compete with the table they are acting on.
 * This is a chip: one step darker than the bar so it reads as raised without a border
 * or a shadow, and small enough that the row of them stays quieter than the data.
 */
export const BatchAction = ({ icon: Icon, children, onClick }: { icon?: FC<{ className?: string }>; children: ReactNode; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-tertiary px-2.5 py-1 text-md font-semibold text-secondary transition-colors hover:bg-quaternary hover:text-primary"
    >
        {Icon && <Icon className="size-3.5" aria-hidden="true" />}
        {children}
    </button>
);

/**
 * The selection bar, as the table's own top row.
 *
 * Laid out the way the big commerce tables do it, because that pattern is well worn and
 * publishers will have met it: select-all on the far left, the live count next to it as
 * a menu, then the actions inline, with the rest — including anything destructive —
 * under the overflow. The toggle on the right narrows the table to what you picked.
 *
 * It sits inside the table's border rather than floating above it, so the checkbox in
 * the bar lines up with the checkboxes in the rows and the whole thing reads as one
 * object in two states instead of a banner that appeared.
 */
export const BatchBar = ({
    batch,
    actions,
    menu,
}: {
    batch: Batch<{ id: string }>;
    /** Inline pills — the everyday actions. */
    actions?: ReactNode;
    /** Overflow menu items — the rarer and the destructive. */
    menu?: ReactNode;
}) => {
    const n = batch.ids.size;
    return (
        <div className="flex flex-wrap items-center gap-2 border-b border-secondary bg-secondary px-3 py-2">
            <Checkbox size="sm" aria-label="Select all rows" isSelected={batch.allOn} isIndeterminate={batch.someOn} onChange={batch.toggleAll} />

            <Dropdown.Root>
                {/* An Aria Button, not a plain one: Dropdown.Root is a MenuTrigger and
                    wires the press handler onto an Aria child. A bare <button> renders
                    fine and never opens the menu. */}
                <AriaButton className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-md font-semibold text-primary outline-focus-ring hover:bg-tertiary focus-visible:outline-2">
                    {n === 0 ? "None selected" : `${n} selected`}
                    <ChevronDown className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                </AriaButton>
                <Dropdown.Popover className="w-52">
                    <Dropdown.Menu>
                        <Dropdown.Item onAction={batch.selectAll}>Select all {batch.rows.length}</Dropdown.Item>
                        <Dropdown.Item onAction={batch.clear}>Unselect all</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown.Root>

            {n > 0 && (
                <>
                    {actions}
                    {menu && (
                        <Dropdown.Root>
                            <Dropdown.DotsButton className="rotate-90 bg-tertiary p-0.5 hover:bg-quaternary" />
                            <Dropdown.Popover className="w-56">
                                <Dropdown.Menu>{menu}</Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown.Root>
                    )}
                </>
            )}

            <div className="ml-auto flex items-center gap-3">
                {/* The shared Toggle's sm label is 13px; Prototype 3 holds everything to the
                    15px minimum, so bring it up to match the bar rather than fork the component. */}
                <Toggle
                    size="sm"
                    label="Show all selected"
                    className="[&_p]:text-md [&_p]:font-semibold"
                    isSelected={batch.onlySelected}
                    isDisabled={n === 0}
                    onChange={batch.setOnlySelected}
                />
                <button
                    type="button"
                    onClick={batch.stop}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-md font-semibold text-secondary hover:bg-tertiary hover:text-primary"
                >
                    <XClose className="size-3.5" aria-hidden="true" />
                    Done
                </button>
            </div>
        </div>
    );
};

/**
 * The destructive batch action, as a red item at the foot of the overflow menu.
 *
 * Red, not the brand pink. Pink is the colour of every primary action in this product,
 * so a pink Delete beside a pink Publish says nothing about the difference between them.
 */
export const BatchDanger = ({ children, onAction }: { children: ReactNode; onAction: () => void }) => (
    <Dropdown.Item icon={Trash01} onAction={onAction} className="text-error-primary">
        <span className="text-error-primary">{children}</span>
    </Dropdown.Item>
);

/**
 * Why a batch delete didn't happen.
 *
 * The blocked count used to sit in the bar as a line of warning text, which asked you to
 * read a caveat about something you had not tried to do yet. Nothing is wrong until you
 * press Delete, so the explanation waits until then — and it names the rows, because
 * "2 can't be deleted" out of a selection of nine is not enough to act on.
 *
 * One button: nothing has happened, and there is nothing to confirm.
 */
export const BatchBlocked = ({ title, lead, names, onClose }: { title: string; lead: string; names: string[]; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex flex-col gap-3 px-6 py-5">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold text-primary">
                        <AlertTriangle className="size-5 shrink-0" style={{ color: "#B54708" }} aria-hidden="true" />
                        {title}
                    </h2>
                    <p className="text-md text-secondary">{lead}</p>
                    <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-xl bg-secondary px-4 py-3">
                        {names.map((n) => (
                            <li key={n} className="truncate font-mono text-md text-secondary">
                                {n}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-end border-t border-secondary px-6 py-4">
                    <Button color="primary-pink" className="uppercase" onClick={onClose} autoFocus>
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
};
