import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown, FilterLines } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { PINK } from "../das-shell";
import { TEAL_DARK, tealControls } from "../nimbus-ui";

/**
 * Small pieces the AdOps pages share (Nov 13 style guide). Everything else comes from the
 * app's tokens in ../nimbus-ui and ../das-shell.
 */

/** Staging's teal documentation link ("Read full blocking documentation here."). Goes nowhere in the prototype. */
export const DocLink = ({ children }: { children: ReactNode }) => (
    <a href="https://docs.example.com/blocking" onClick={(e) => e.preventDefault()} className="font-bold hover:underline" style={{ color: TEAL_DARK }}>
        {children}
    </a>
);

/**
 * A dropdown of checkboxes — staging's "Demand Sources" picker and the activity log's
 * "Filter by Block Type" / "Filter by Demand Source". In production this is the select
 * library's multi-select; here it is the plainest version of it.
 *
 *   cell  the trigger fills a date-row cell, like the BareSelect next to it
 *   text  pink label with the filter icon, at the right of a band
 */
export const ChecklistMenu = ({
    label,
    options,
    value,
    onChange,
    variant = "text",
    align = "right",
}: {
    label: string;
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    variant?: "cell" | "text";
    align?: "left" | "right";
}) => {
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const away = (e: PointerEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", away);
        document.addEventListener("keydown", esc);
        return () => {
            document.removeEventListener("pointerdown", away);
            document.removeEventListener("keydown", esc);
        };
    }, [open]);

    const toggle = (o: string) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
    const count = value.length;

    return (
        <div ref={box} className={cx("relative", variant === "cell" && "flex border-r border-secondary")}>
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen((o) => !o)}
                className={cx(
                    "inline-flex items-center text-md font-bold whitespace-nowrap transition duration-100 ease-linear",
                    variant === "cell" ? "w-64 justify-between gap-3 px-6 py-3 hover:bg-secondary" : "gap-3 hover:opacity-80",
                )}
                style={{ color: PINK }}
            >
                <span>
                    {label}
                    {count > 0 && <span className="ml-1.5 font-semibold text-tertiary">({count})</span>}
                </span>
                {variant === "cell" ? <ChevronDown className="size-5" aria-hidden="true" /> : <FilterLines className="size-5" aria-hidden="true" />}
            </button>
            {open && (
                <div
                    role="group"
                    aria-label={label}
                    className={cx(
                        "absolute top-full z-30 mt-1 flex w-80 flex-col rounded-lg bg-primary shadow-lg ring-1 ring-secondary",
                        align === "right" ? "right-0" : "left-0",
                    )}
                    style={tealControls}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-secondary px-4 py-2.5">
                        <span className="min-w-0 truncate text-md font-bold text-primary">{label}</span>
                        <button
                            type="button"
                            onClick={() => onChange([])}
                            disabled={!count}
                            className="text-md font-semibold whitespace-nowrap underline disabled:opacity-40"
                            style={{ color: PINK }}
                        >
                            Clear Selections
                        </button>
                    </div>
                    <ul className="max-h-80 overflow-y-auto overscroll-contain py-1">
                        {options.map((o) => (
                            <li key={o} className="px-4 py-1.5">
                                <Checkbox
                                    size="md"
                                    label={<span className="text-md text-primary">{o}</span>}
                                    isSelected={value.includes(o)}
                                    onChange={() => toggle(o)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
