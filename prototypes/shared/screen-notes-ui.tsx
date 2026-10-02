import { useEffect, useRef, useState } from "react";
import { InfoCircle, XClose } from "@untitledui/icons";
import { hasNotes, useScreenNotesValue } from "./screen-notes";

/**
 * The Info button in the prototype toolbar: concept rationale and the walkthrough, on
 * demand, so neither has to sit inside the screen being reviewed.
 */

const PINK = "#DA6EA3";
const TEAL = "#37B6B7";

export const ScreenInfoButton = () => {
    const notes = useScreenNotesValue();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!hasNotes(notes)) return null;
    const steps = notes.walkthrough ?? [];

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                title="About this screen"
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold transition-colors ${open ? "bg-white/15" : "hover:bg-white/10"}`}
            >
                <InfoCircle className="size-4" aria-hidden="true" /> Info
            </button>

            {open && (
                <div className="absolute top-full right-0 z-50 mt-2 w-[min(460px,90vw)] overflow-hidden rounded-xl bg-white text-[#344054] shadow-2xl ring-1 ring-black/10">
                    <div className="flex items-start justify-between gap-3 border-b border-[#EAECF0] px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                            {notes.label && (
                                <span className="text-xs font-bold tracking-wide uppercase" style={{ color: TEAL }}>
                                    {notes.label}
                                </span>
                            )}
                            {notes.title && <span className="text-sm font-semibold text-[#101828]">{notes.title}</span>}
                        </div>
                        <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded p-1 text-[#667085] hover:bg-[#F2F4F7]">
                            <XClose className="size-4" aria-hidden="true" />
                        </button>
                    </div>

                    {notes.notes && notes.notes.length > 0 && (
                        <ul className="list-disc space-y-1.5 px-4 py-3 pl-8 text-sm leading-relaxed">
                            {notes.notes.map((n, i) => (
                                <li key={i}>{n}</li>
                            ))}
                        </ul>
                    )}

                    {steps.length > 0 && (
                        <div className="border-t border-[#EAECF0] px-4 py-3">
                            <div className="mb-2 text-xs font-bold tracking-wide uppercase" style={{ color: PINK }}>
                                Walkthrough
                            </div>
                            <ol className="flex flex-col gap-0.5">
                                {steps.map((s, i) => {
                                    const here = s.id === notes.currentStep;
                                    return (
                                        <li key={s.id}>
                                            <a
                                                href={`#/${s.id}?keep=1`}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F9FAFB]"
                                                style={here ? { color: "#A94579", fontWeight: 700 } : undefined}
                                            >
                                                <span className="w-4 text-right text-xs text-[#98A2B3]">{i + 1}</span>
                                                {s.label}
                                                {here && <span className="ml-auto text-xs">you are here</span>}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ol>
                            <p className="mt-2 px-2 text-xs text-[#667085]">Keeps what you've filled in. The screen picker starts each screen fresh instead.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
