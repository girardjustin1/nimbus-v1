import { cx } from "@/utils/cx";

export type PreviewMode = "demo" | "creative";

export const PreviewModePicker = ({ value, onChange }: { value: PreviewMode; onChange: (value: PreviewMode) => void }) => (
    <div className="flex gap-1 rounded-full bg-secondary p-1 text-xs font-semibold" aria-label="Preview content">
        {(
            [
                { id: "demo", label: "Format demo" },
                { id: "creative", label: "Your creative" },
            ] as const
        ).map((mode) => (
            <button
                key={mode.id}
                type="button"
                aria-pressed={value === mode.id}
                onClick={() => onChange(mode.id)}
                className={cx("rounded-full px-3 py-1.5", value === mode.id ? "bg-primary text-primary shadow-xs" : "text-tertiary hover:text-secondary")}
            >
                {mode.label}
            </button>
        ))}
    </div>
);
