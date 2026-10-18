import { useState } from "react";
import { UploadCloud01 } from "@untitledui/icons";
import type { Creative } from "../../v1/screens/setup-data";
import { type Asset, setReturnTo, useAssets } from "./asset-data";
import { useCopy } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import { PinkAction } from "./das-shell";
import { ChosenTable, InlineSearchSelect, ModalSearchSelect, type SelectableRow, TargetBlock } from "./search-select";
import { Button } from "./type-rules";

/**
 * Adding creatives to a campaign.
 *
 * Round 2 opened a grid of every asset with a live animation in each tile, which is a
 * good way to pick from twelve and an impossible way to pick from a hundred and fifty.
 * Round 3 made search the way in, and kept a small preview on the rows a search matched.
 *
 * Round 4 (16 Oct review) takes the previews out altogether. Engineering can't render a
 * publisher's real markup, and a stand-in animation only invites the question "why
 * isn't this my creative?". So a creative is what the library knows about it: its name,
 * its Ad Type and its Ad Size — nothing that hints at a render.
 */

export type CreativeEntry = "inline" | "modal";

const asCreative = (a: Asset): Creative => ({ name: a.name, type: a.type, size: a.size === "Invalid" ? "N/A" : a.size });

export const CreativeTargetBlock = ({
    value,
    onChange,
    entry = "inline",
    screenId,
}: {
    value: Creative[];
    onChange: (next: Creative[]) => void;
    entry?: CreativeEntry;
    screenId?: string;
}) => {
    const assets = useAssets();
    const copy = useCopy();
    const [browsing, setBrowsing] = useState(false);

    // One type per campaign — whichever is in first decides what else is allowed.
    const lockedType = value[0]?.type;

    const rows: SelectableRow[] = assets.map((a) => {
        // Type and size are data; only the campaign count is copy.
        const usedBy = a.campaigns.length ? copy.text(`${a.campaigns.length} campaign${a.campaigns.length === 1 ? "" : "s"}`) : undefined;
        return {
            id: a.name,
            label: a.name,
            meta: `${a.type} · ${a.size}${usedBy ? ` · ${usedBy}` : ""}`,
            // Doubles as the disabled flag, so it stays a raw string: hiding the copy
            // must not make a blocked row pickable. search-select renders it.
            disabledReason: lockedType && a.type !== lockedType ? `Campaign is ${lockedType}` : a.size === "Invalid" ? "Invalid size" : undefined,
        };
    });

    const add = (names: string[]) => {
        const picked = assets.filter((a) => names.includes(a.name) && !value.some((c) => c.name === a.name));
        onChange([...value, ...picked.map(asCreative)]);
    };

    const uploadNew = () => {
        setReturnTo(`#/${screenId ?? "setup-ready"}`);
        window.location.assign("#/asset-setup");
    };

    const mixed = new Set(value.map((c) => c.type)).size > 1;

    return (
        <TargetBlock
            title={copy.text("Creative") ?? ""}
            trailing={
                entry === "modal" ? (
                    <Button color="secondary" className="uppercase" onClick={() => setBrowsing(true)}>
                        <Copy>Find creatives</Copy>
                    </Button>
                ) : (
                    <PinkAction icon={UploadCloud01} onPress={uploadNew}>
                        <Copy>Upload new asset</Copy>
                    </PinkAction>
                )
            }
        >
            {entry === "inline" && (
                <InlineSearchSelect
                    label={copy.text("Search assets") ?? ""}
                    placeholder={copy.text("Search your asset library") ?? ""}
                    rows={rows}
                    chosenIds={value.map((c) => c.name)}
                    onPick={(row) => add([row.id])}
                    noun="assets"
                />
            )}

            <ChosenTable
                columns={[copy.text("Creative") ?? "", copy.text("Ad Type") ?? "", copy.text("Ad Size") ?? ""]}
                rows={value.map((c) => ({
                    id: c.name,
                    invalid: mixed && c.type === "VAST (xml)",
                    cells: [
                        <span key="n" className="font-medium text-primary">
                            {c.name}
                        </span>,
                        c.type,
                        c.size,
                    ],
                }))}
                onRemove={(name) => onChange(value.filter((c) => c.name !== name))}
                empty={
                    <Copy>
                        {entry === "inline" ? "No creatives yet. Search above, or upload a new asset." : "No creatives yet. Find creatives to add one."}
                    </Copy>
                }
            />

            {mixed && (
                <p className="text-md text-error-primary">
                    <Copy>A campaign can't mix HTML and VAST (xml). Remove one type.</Copy>
                </p>
            )}

            {browsing && (
                <ModalSearchSelect
                    title={copy.text("Find creatives") ?? ""}
                    placeholder={copy.text("Search your asset library") ?? ""}
                    rows={rows}
                    chosenIds={value.map((c) => c.name)}
                    noun="assets"
                    onAdd={(picked) => add(picked.map((p) => p.id))}
                    onClose={() => setBrowsing(false)}
                    createLabel={copy.text("Upload a new asset instead")}
                    onCreate={uploadNew}
                />
            )}
        </TargetBlock>
    );
};
