import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { PinkAction } from "../../v1/screens/das-shell";
import { useKeywords } from "./keyword-data";
import { setReturnTo } from "./asset-data";
import { ChosenTable, InlineSearchSelect, ModalSearchSelect, type SelectableRow, TargetBlock, TrafficBadge } from "./search-select";

/**
 * Targeting a campaign at keywords.
 *
 * Round 2 put the chosen keywords in the field as chips. Kristen's instruction on 2 Oct
 * was blunt — "I don't want chips, I want it down here in a list" — and the reason is
 * the same one behind every other change this round: the library is long. Chips have no
 * columns, so they cannot tell you the one thing you need while choosing, which is
 * whether a keyword is actually arriving in traffic. Targeting a keyword no app sends
 * is the quietest way to build a campaign that never serves.
 *
 * Two entry points, both ending in the same table. A keeps the search on the page; B
 * puts it behind a button. Round 3 ships with A and keeps B a story.
 */

export type KeywordEntry = "inline" | "modal";

/** The library, shaped for the picker. */
const useKeywordRows = (): SelectableRow[] => {
    const keywords = useKeywords();
    return keywords.map((k) => ({
        id: k.value,
        label: k.value,
        meta: k.campaigns.length ? `${k.campaigns.length} campaign${k.campaigns.length === 1 ? "" : "s"}` : "No campaign targets it",
        trailing: <TrafficBadge seen={k.seenInTraffic} />,
    }));
};

export const KeywordTargetBlock = ({
    value,
    onChange,
    entry = "inline",
    screenId,
}: {
    value: string[];
    onChange: (next: string[]) => void;
    entry?: KeywordEntry;
    /** Where Keyword Setup should return to after the round trip. */
    screenId?: string;
}) => {
    const rows = useKeywordRows();
    const byId = new Map(rows.map((r) => [r.id, r]));
    const [browsing, setBrowsing] = useState(false);

    const add = (ids: string[]) => onChange([...value, ...ids.filter((id) => !value.includes(id))]);

    /**
     * The escape hatch, mirroring "Upload new asset" on Creative. You are halfway
     * through a campaign and the keyword you want was never added to the library —
     * without this the only way out is to abandon the form.
     */
    const createKeyword = () => {
        setReturnTo(`#/${screenId ?? "setup-ready"}`);
        window.location.assign("#/keyword-setup");
    };

    const chosen = value.map((v) => {
        const row = byId.get(v);
        return {
            id: v,
            cells: [
                <span key="k" className="font-mono font-medium text-primary">
                    {v}
                </span>,
                row?.trailing ?? <TrafficBadge seen={false} />,
                <span key="c" className="text-tertiary">
                    {row?.meta ?? "Not in your library"}
                </span>,
            ],
            invalid: !row,
        };
    });

    return (
        <TargetBlock
            title="Keywords"
            trailing={
                entry === "modal" ? (
                    <Button color="secondary" className="uppercase" onClick={() => setBrowsing(true)}>
                        Find keywords
                    </Button>
                ) : (
                    <PinkAction onPress={createKeyword}>Add keyword</PinkAction>
                )
            }
        >
            {entry === "inline" && (
                <InlineSearchSelect
                    label="Search keywords"
                    placeholder="Search your keyword library"
                    rows={rows}
                    chosenIds={value}
                    onPick={(row) => add([row.id])}
                    noun="keywords"
                />
            )}

            <ChosenTable
                columns={["Keyword", "In traffic", "Also used by"]}
                rows={chosen}
                onRemove={(id) => onChange(value.filter((v) => v !== id))}
                empty={
                    entry === "inline"
                        ? "No keywords yet. Search above to target one, or add a new keyword to your library."
                        : "No keywords yet. Find keywords to target one."
                }
            />

            {browsing && (
                <ModalSearchSelect
                    title="Find keywords"
                    placeholder="Search your keyword library"
                    rows={rows}
                    chosenIds={value}
                    noun="keywords"
                    onAdd={(picked) => add(picked.map((p) => p.id))}
                    onClose={() => setBrowsing(false)}
                    createLabel="Add a keyword instead"
                    onCreate={createKeyword}
                />
            )}
        </TargetBlock>
    );
};
