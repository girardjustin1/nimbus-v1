import { cx } from "@/utils/cx";
import { type FormatId, formats } from "../studio-data";

/** FormatPicker — ad formats as pill chips, with size notes and a Beta tag where it applies. */
export const FormatPicker = ({ value, onChange }: { value: FormatId; onChange?: (f: FormatId) => void }) => (
    <div className="flex flex-col gap-2">
        <div role="radiogroup" aria-label="Ad format" className="flex flex-wrap gap-2">
            {formats.map((f) => {
                const on = value === f.id;
                return (
                    <button
                        key={f.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => onChange?.(f.id)}
                        className={cx(
                            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                            on ? "bg-[#101828] text-white" : "bg-secondary text-secondary hover:bg-tertiary",
                        )}
                    >
                        {f.label}
                        {f.badge && <span className={cx("text-[10px] font-bold uppercase", on ? "text-white/70" : "text-tertiary")}>{f.badge}</span>}
                    </button>
                );
            })}
        </div>
        <span className="text-xs text-tertiary">{formats.find((f) => f.id === value)?.size}</span>
    </div>
);
