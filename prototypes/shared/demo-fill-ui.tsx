import type { ReactNode } from "react";
import { AlertTriangle, Zap } from "@untitledui/icons";
import { type FillMode, setFillMode, useCanFillPage, useFillMode } from "./demo-fill";

/**
 * Demo fill — the clickable chrome.
 *
 * <Fillable> wraps a control that is still empty. The first click fills it and is
 * swallowed, so the field populates instead of opening a menu or placing a caret; once
 * filled the wrapper gets out of the way entirely and the control behaves normally.
 */

const PINK = "#DA6EA3";
const AMBER = "#F79009";

export const Fillable = ({
    filled,
    onFill,
    children,
    hint = "Click to fill",
}: {
    /** When true the wrapper is inert — the real control takes over. */
    filled: boolean;
    onFill: () => void;
    children: ReactNode;
    hint?: string;
}) => {
    const mode = useFillMode();
    if (filled) return <>{children}</>;
    const tone = mode === "bad" ? AMBER : PINK;
    return (
        <span
            className="group relative block rounded-lg ring-offset-2 transition-shadow hover:ring-2"
            style={{ ["--tw-ring-color" as string]: `${tone}66` }}
            onClickCapture={(e) => {
                // Swallow the first click so it fills rather than opening/focusing.
                e.preventDefault();
                e.stopPropagation();
                onFill();
            }}
            onKeyDownCapture={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onFill();
                }
            }}
        >
            {children}
            <span
                className="pointer-events-none absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: "white", backgroundColor: tone }}
            >
                {mode === "bad" ? "Fill bad" : hint}
            </span>
        </span>
    );
};

/* ------------------------------------------------------------- Toolbar --- */

const modes: { id: FillMode; label: string; title: string }[] = [
    { id: "good", label: "Good", title: "Fill valid data — the flow proceeds" },
    { id: "bad", label: "Bad", title: "Fill data that breaks a rule — shows the error states" },
];

/** Lives in the dark prototype toolbar: fill the page, and choose what gets filled. */
export const DemoFillControls = ({ onFillPage }: { onFillPage: () => void }) => {
    const mode = useFillMode();
    const canFill = useCanFillPage();
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onFillPage}
                disabled={!canFill}
                title={canFill ? "Fill every empty field on this screen" : "Nothing to fill on this screen"}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold transition-colors ${
                    canFill ? "hover:bg-white/10" : "cursor-not-allowed opacity-30"
                }`}
                style={canFill ? { color: mode === "bad" ? AMBER : PINK } : undefined}
            >
                {mode === "bad" ? <AlertTriangle className="size-4" aria-hidden="true" /> : <Zap className="size-4" aria-hidden="true" />}
                Fill page
            </button>
            <div className="flex items-center gap-0.5 rounded-md bg-white/10 p-0.5" role="radiogroup" aria-label="Fill mode">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={mode === m.id}
                        title={m.title}
                        onClick={() => setFillMode(m.id)}
                        className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
                            mode === m.id ? "text-[#101828]" : "text-white/60 hover:text-white"
                        }`}
                        style={mode === m.id ? { backgroundColor: m.id === "bad" ? AMBER : PINK, color: "#101828" } : undefined}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
