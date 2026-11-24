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
            {/* The native arrow is hidden and drawn instead, as in the copy deck's select. */}
            <div className="relative flex items-center">
                <select
                    aria-label="Data scenario"
                    title={current.title}
                    value={choice.id}
                    onChange={(e) => {
                        const id = e.target.value as ScenarioId;
                        setScenario({ id, seed: id === "random" && choice.id !== "random" ? Math.floor(Math.random() * 9999) + 1 : choice.seed });
                    }}
                    className="cursor-pointer appearance-none rounded-md border border-white/15 py-1 pr-7 pl-2 text-xs font-semibold outline-none focus:border-white/40"
                    style={
                        choice.id === "screen"
                            ? { backgroundColor: "rgb(255 255 255 / 0.05)", color: "white" }
                            : { backgroundColor: PINK, color: "#101828", borderColor: PINK }
                    }
                >
                    {SCENARIOS.map((s) => (
                        <option key={s.id} value={s.id} className="bg-white text-black">
                            {s.label} · {s.title}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-2 size-3.5"
                    style={{ color: choice.id === "screen" ? "white" : "#101828" }}
                    aria-hidden="true"
                />
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
