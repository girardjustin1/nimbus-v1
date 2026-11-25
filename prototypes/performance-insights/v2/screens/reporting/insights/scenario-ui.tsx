import { Fragment, type ReactNode, useSyncExternalStore } from "react";
import { ChevronDown, RefreshCw01 } from "@untitledui/icons";
import { PINK } from "../../das-shell";
import { SCENARIOS, type ScenarioId, type ScenarioQuery, getScenario, scenarioQuery, setScenario, subscribeScenario } from "./scenarios";

/**
 * The scenario switch in the prototype's toolbar (prototype chrome, not product), and the
 * wrapper that hands a concept screen its scenario. A change restarts the screen with it.
 */

const useScenarioChoice = () => useSyncExternalStore(subscribeScenario, getScenario, getScenario);

export const ScenarioControls = () => {
    const choice = useScenarioChoice();
    const current = SCENARIOS.find((s) => s.id === choice.id)!;
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/60">Data</span>
            {/* Closed, it shows only the scenario's short name; the open list keeps each one's description.
                The native select sits invisibly over the label, so it still opens the browser's own list. */}
            <div
                className="relative inline-flex items-center gap-1.5 rounded-md border py-1 pr-2 pl-2 text-xs font-semibold focus-within:border-white/40"
                style={
                    choice.id === "screen"
                        ? { backgroundColor: "rgb(255 255 255 / 0.05)", color: "white", borderColor: "rgb(255 255 255 / 0.15)" }
                        : { backgroundColor: PINK, color: "#101828", borderColor: PINK }
                }
                title={current.title}
            >
                {current.label}
                <ChevronDown className="pointer-events-none size-3.5" aria-hidden="true" />
                <select
                    aria-label="Data scenario"
                    title={current.title}
                    value={choice.id}
                    onChange={(e) => {
                        const id = e.target.value as ScenarioId;
                        setScenario({ id, seed: id === "random" && choice.id !== "random" ? Math.floor(Math.random() * 9999) + 1 : choice.seed });
                    }}
                    className="absolute inset-0 cursor-pointer appearance-none opacity-0"
                >
                    {SCENARIOS.map((s) => (
                        <option key={s.id} value={s.id} className="bg-white text-black">
                            {s.label} · {s.title}
                        </option>
                    ))}
                </select>
            </div>
            {choice.id === "random" && (
                <button
                    type="button"
                    onClick={() => setScenario({ id: "random", seed: Math.floor(Math.random() * 9999) + 1 })}
                    title={`Seed ${choice.seed}. Shuffle for another query.`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2 py-1 text-xs font-semibold text-white hover:bg-white/10"
                >
                    <RefreshCw01 className="size-3.5" aria-hidden="true" />
                    Shuffle <span className="text-white/50 tabular-nums">#{choice.seed}</span>
                </button>
            )}
        </div>
    );
};

/** Hands a concept screen the scenario's query (null: the screen's own), restarting it on a change. */
export const WithScenario = ({ children }: { children: (q: ScenarioQuery | null) => ReactNode }) => {
    const choice = useScenarioChoice();
    return <Fragment key={`${choice.id}:${choice.seed}`}>{children(scenarioQuery(choice.id, choice.seed))}</Fragment>;
};
