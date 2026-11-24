import { useMemo } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "@untitledui/icons";
import { CONCEPTS } from "../../../src/pages/pi-prototypes/round-2";
import type { ProtoScreen, ScreenPicker } from "../../shared/prototype-frame";
import { conceptOf } from "./concept-of";

/**
 * Performance Insights · Round 2: the toolbar's screen picker (prototype chrome).
 *
 * Two menus instead of one long list: Concept (C0 to C16, grouped as the Storybook page
 * groups them), then the concept's screens, its main screen first and its edge cases under
 * it. Picking a concept opens its main screen. The arrows step through every screen in order.
 */

/** Concept names as Storybook's Round 2 page gives them (one list, src/pages/pi-prototypes/round-2.ts). */
const NAMES: Record<number, string> = Object.fromEntries(CONCEPTS.map((c) => [Number(c.id.slice(1)), c.title]));

const withoutId = (title: string) => title.replace(/^C\d+ · /, "");

const selectClass =
    "cursor-pointer appearance-none rounded-md border border-white/15 bg-white/5 py-1 pr-7 pl-2 text-sm text-white outline-none focus:border-white/40 disabled:cursor-default disabled:opacity-50";

const Select = ({ label, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <label className="flex items-center gap-2">
        <span className="text-xs font-semibold whitespace-nowrap text-white/60">{label}</span>
        <span className="relative flex items-center">
            <select aria-label={label} {...props} className={`${selectClass} ${props.className ?? ""}`} />
            <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-white/70" aria-hidden="true" />
        </span>
    </label>
);

interface ConceptEntry {
    num: number;
    area: string;
    screens: ProtoScreen[];
}

export const ConceptPicker: ScreenPicker = ({ screens, activeId }) => {
    const concepts = useMemo(() => {
        const list: ConceptEntry[] = [];
        for (const s of screens) {
            const num = conceptOf(s.id);
            if (num === null) continue;
            const entry = list.find((c) => c.num === num);
            if (entry) entry.screens.push(s);
            else list.push({ num, area: s.area, screens: [s] });
        }
        return list;
    }, [screens]);

    const current = concepts.find((c) => c.screens.some((s) => s.id === activeId)) ?? concepts[0];
    const [main, ...cases] = current.screens;
    const at = current.screens.findIndex((s) => s.id === activeId);
    const all = concepts.flatMap((c) => c.screens);
    const index = all.findIndex((s) => s.id === activeId);
    const prev = index > 0 ? all[index - 1] : undefined;
    const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;
    const areas = [...new Set(concepts.map((c) => c.area))];
    const go = (id: string) => (window.location.hash = `#/${id}`);

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <a
                href={prev ? `#/${prev.id}` : undefined}
                aria-label="Previous screen"
                className={`rounded-md p-1 ${prev ? "hover:bg-white/10" : "pointer-events-none opacity-30"}`}
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
            </a>
            <Select label="Concept" value={current.num} onChange={(e) => go(concepts.find((c) => c.num === Number(e.target.value))!.screens[0].id)}>
                {areas.map((area) => (
                    <optgroup key={area} label={area.replace(/^Round 2 · /, "")} className="text-black">
                        {concepts
                            .filter((c) => c.area === area)
                            .map((c) => (
                                <option key={c.num} value={c.num} className="text-black">
                                    C{c.num} · {NAMES[c.num] ?? withoutId(c.screens[0].title)}
                                </option>
                            ))}
                    </optgroup>
                ))}
            </Select>
            <Select label="Screen" value={activeId} onChange={(e) => go(e.target.value)} disabled={cases.length === 0} className="max-w-[24rem]">
                <option value={main.id} className="text-black">
                    Main screen
                </option>
                {cases.length > 0 && (
                    <optgroup label="Edge cases" className="text-black">
                        {cases.map((s) => (
                            <option key={s.id} value={s.id} className="text-black">
                                {withoutId(s.title)}
                            </option>
                        ))}
                    </optgroup>
                )}
            </Select>
            <a
                href={next ? `#/${next.id}` : undefined}
                aria-label="Next screen"
                className={`rounded-md p-1 ${next ? "hover:bg-white/10" : "pointer-events-none opacity-30"}`}
            >
                <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <span className="text-xs whitespace-nowrap opacity-60">{at === 0 ? "Main screen" : `Edge case ${at} of ${cases.length}`}</span>
        </div>
    );
};
