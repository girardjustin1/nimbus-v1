import { type FC, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronRight, Copy01, DotsHorizontal, Download01, Edit03, FilePlus02, FlipBackward, Link01, RefreshCw01, Trash01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { StateAction, TEAL_DARK, tealControls } from "../../nimbus-ui";
import { R1 } from "../../round-1";

/**
 * Performance Insights · Round 2 · C16: the “⋯” menu beside Save Query.
 *
 * After Mixpanel's report menu: Delete, Rename, Duplicate, Undo, then New query, Export,
 * then Refresh data with how old the data is. Delete asks first; Rename opens a small
 * dialog. Every action is real in the prototype: Undo steps back through the query's
 * changes (⌘Z too), Export downloads the table as a CSV or copies the link.
 */

export interface QueryMenuProps {
    name: string;
    canUndo: boolean;
    /** Minutes since the data was fetched. */
    dataAge: number;
    refreshing: boolean;
    onRename: (name: string) => void;
    onDuplicate: () => void;
    onUndo: () => void;
    onNew: () => void;
    onDelete: () => void;
    onDownloadCsv: () => void;
    onCopyLink: () => void;
    onRefresh: () => void;
    /** Open when the screen loads (for the prototype's states). */
    defaultOpen?: boolean;
}

/** The staging button's shape (R1-09/R1-10), for the dialogs' submit and destructive buttons. */
const BUTTON = R1.button;

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const Item = ({
    icon: Icon,
    children,
    onPress,
    disabled,
    danger,
    trailing,
    sub,
    ...rest
}: {
    icon: FC<{ className?: string }>;
    children: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    danger?: boolean;
    trailing?: ReactNode;
    sub?: ReactNode;
    "aria-haspopup"?: "menu";
    "aria-expanded"?: boolean;
}) => (
    <button
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={onPress}
        {...rest}
        className={cx(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-md font-semibold",
            disabled ? "cursor-not-allowed text-secondary opacity-40" : "text-secondary hover:bg-secondary",
        )}
        style={danger && !disabled ? { color: "#b42318" } : undefined}
    >
        <Icon className="size-5 shrink-0" aria-hidden="true" />
        <span className="flex min-w-0 flex-1 flex-col">
            {children}
            {sub && <span className="text-md font-normal text-tertiary">{sub}</span>}
        </span>
        {trailing}
    </button>
);

const ageText = (min: number) => (min <= 0 ? "Data from just now" : min === 1 ? "Data from 1 min ago" : `Data from ${min} min ago`);

/** A centred dialog over the page (Rename, Delete). */
const Dialog = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => {
    useEffect(() => {
        const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", key);
        return () => window.removeEventListener("keydown", key);
    }, [onClose]);
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ backgroundColor: "rgb(16 24 40 / 0.5)" }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div role="dialog" aria-modal="true" aria-label={title} className="flex w-[28rem] flex-col gap-5 rounded-2xl bg-primary p-6 shadow-xl" style={tealControls}>
                <h2 className="text-lg font-bold text-primary">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export const QueryMenu = (p: QueryMenuProps) => {
    const [open, setOpen] = useState(Boolean(p.defaultOpen));
    const [exportOpen, setExportOpen] = useState(false);
    const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);
    const [draft, setDraft] = useState(p.name);
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        const down = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
        window.addEventListener("keydown", key);
        window.addEventListener("mousedown", down);
        return () => {
            window.removeEventListener("keydown", key);
            window.removeEventListener("mousedown", down);
        };
    }, [open]);

    const run = (f: () => void) => () => {
        f();
        setOpen(false);
        setExportOpen(false);
    };

    return (
        <div ref={box} className="relative">
            <button
                type="button"
                aria-label="More actions"
                title="More actions"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => {
                    setOpen((o) => !o);
                    setExportOpen(false);
                }}
                className="inline-flex size-9 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary"
                style={open ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f`, boxShadow: `inset 0 0 0 1px ${TEAL}66` } : undefined}
            >
                <DotsHorizontal className={cx("size-5", !open && "text-fg-quaternary")} aria-hidden="true" />
            </button>

            {open && (
                <div role="menu" aria-label="Query actions" className="absolute top-11 right-0 z-30 flex w-72 flex-col rounded-xl bg-primary p-1.5 shadow-xl ring-1 ring-secondary">
                    <Item icon={Trash01} danger onPress={run(() => setDialog("delete"))}>
                        Delete
                    </Item>
                    <Item
                        icon={Edit03}
                        onPress={run(() => {
                            setDraft(p.name);
                            setDialog("rename");
                        })}
                    >
                        Rename
                    </Item>
                    <Item icon={Copy01} onPress={run(p.onDuplicate)}>
                        Duplicate
                    </Item>
                    <Item
                        icon={FlipBackward}
                        disabled={!p.canUndo}
                        onPress={run(p.onUndo)}
                        trailing={<span className="text-md font-normal text-quaternary">{isMac ? "⌘Z" : "Ctrl+Z"}</span>}
                    >
                        Undo
                    </Item>
                    <div className="my-1 h-px bg-border-secondary" role="separator" />
                    <Item icon={FilePlus02} onPress={run(p.onNew)}>
                        New query
                    </Item>
                    <div className="relative">
                        <Item
                            icon={Download01}
                            aria-haspopup="menu"
                            aria-expanded={exportOpen}
                            onPress={() => setExportOpen((o) => !o)}
                            trailing={<ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />}
                        >
                            Export
                        </Item>
                        {exportOpen && (
                            // Opens to the left: the menu sits at the page's right edge.
                            <div role="menu" aria-label="Export" className="absolute top-0 right-full mr-2 flex w-60 flex-col rounded-xl bg-primary p-1.5 shadow-xl ring-1 ring-secondary">
                                <Item icon={Download01} onPress={run(p.onDownloadCsv)}>
                                    Download CSV
                                </Item>
                                <Item icon={Link01} onPress={run(p.onCopyLink)}>
                                    Copy link
                                </Item>
                            </div>
                        )}
                    </div>
                    <div className="my-1 h-px bg-border-secondary" role="separator" />
                    <Item
                        icon={({ className }) => <RefreshCw01 className={cx(className, p.refreshing && "animate-spin")} />}
                        disabled={p.refreshing}
                        onPress={p.onRefresh}
                        sub={p.refreshing ? "Refreshing…" : ageText(p.dataAge)}
                    >
                        Refresh data
                    </Item>
                </div>
            )}

            {dialog === "rename" && (
                <Dialog title="Rename query" onClose={() => setDialog(null)}>
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!draft.trim()) return;
                            p.onRename(draft.trim());
                            setDialog(null);
                        }}
                    >
                        <label className="flex flex-col gap-1.5">
                            <span className="text-md font-semibold text-secondary">Name</span>
                            <input
                                autoFocus
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                maxLength={80}
                                className="h-11 rounded-lg px-3 text-md text-primary ring-1 ring-primary outline-none focus:ring-2"
                                style={{ ["--tw-ring-color" as string]: TEAL }}
                            />
                        </label>
                        <div className="flex justify-end gap-3">
                            <StateAction quiet onPress={() => setDialog(null)}>
                                Cancel
                            </StateAction>
                            <button type="submit" disabled={!draft.trim()} className="whitespace-nowrap text-white disabled:opacity-35" style={{ backgroundColor: PINK, ...BUTTON }}>
                                Rename
                            </button>
                        </div>
                    </form>
                </Dialog>
            )}

            {dialog === "delete" && (
                <Dialog title={`Delete “${p.name}”?`} onClose={() => setDialog(null)}>
                    <p className="text-md text-tertiary">The query and its chart are removed. Undo brings them back.</p>
                    <div className="flex justify-end gap-3">
                        <StateAction quiet onPress={() => setDialog(null)}>
                            Cancel
                        </StateAction>
                        <button
                            type="button"
                            autoFocus
                            onClick={() => {
                                p.onDelete();
                                setDialog(null);
                            }}
                            className="whitespace-nowrap text-white hover:opacity-90"
                            style={{ backgroundColor: "#d92d20", ...BUTTON }}
                        >
                            Delete
                        </button>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

/** A short note at the bottom of the screen after an action (Duplicated, Link copied, …). */
export const Toast = ({ text, onUndo, onClose }: { text: string; onUndo?: () => void; onClose: () => void }) => {
    const close = useRef(onClose);
    useEffect(() => {
        close.current = onClose;
    });
    useEffect(() => {
        const t = window.setTimeout(() => close.current(), 4000);
        return () => window.clearTimeout(t);
    }, [text]);
    return (
        <div role="status" className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-xl bg-[#101828] px-5 py-3 text-md font-semibold text-white shadow-xl">
            {text}
            {onUndo && (
                <button type="button" onClick={onUndo} className="font-bold underline-offset-2 hover:underline" style={{ color: PINK }}>
                    Undo
                </button>
            )}
        </div>
    );
};
