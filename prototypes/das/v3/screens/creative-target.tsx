import { useEffect, useState } from "react";
import { Eye, UploadCloud01, XClose } from "@untitledui/icons";
import type { Creative } from "../../v1/screens/setup-data";
import { type Asset, previewFor, setReturnTo, useAssets } from "./asset-data";
import { useCopy } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import { PinkAction } from "./das-shell";
import { useScrollLock } from "./scroll-lock";
import { ChosenTable, InlineSearchSelect, ModalSearchSelect, type SelectableRow, TargetBlock } from "./search-select";
import { Button } from "./type-rules";
import { AdFormatDemo } from "./type-rules";

/**
 * Adding creatives to a campaign.
 *
 * Round 2 opened a grid of every asset with a live animation in each tile. That is a
 * good way to pick from twelve and an impossible way to pick from a hundred and fifty,
 * which is what Locket Labs actually has. Kristen: "you're not going to load a preview
 * of 150 assets — that's not realistic. Also, I'm not going to scroll down a table to
 * see those assets. I'm going to do a type ahead and then it's going to filter down my
 * giant list for me."
 *
 * The preview is not thrown away, because she liked it: "I like the preview from when
 * you search it." It renders on the handful of rows a search has already narrowed to,
 * never on an unfiltered list. That is the whole difference — same component, bounded
 * by the search instead of by the library.
 *
 * Once a creative is in the campaign it gets a Preview button instead. The thumbnail
 * in the results list is nine pixels wide — enough to tell an interstitial from a
 * banner while you are scanning, nowhere near enough to check you took the right one.
 * Opening it full size is a deliberate act on one asset, so it costs nothing, and it
 * is the last chance to catch a wrong creative before the campaign goes out.
 */

export type CreativeEntry = "inline" | "modal";

const asCreative = (a: Asset): Creative => ({ name: a.name, type: a.type, size: a.size === "Invalid" ? "N/A" : a.size });

/**
 * How many matches may still carry a preview.
 *
 * "I like the preview from when you search it" and "you're not going to load a preview
 * of 150 assets" are both true, and this number is where they meet. Below it you are
 * looking at a handful and the artwork is the fastest way to tell them apart; above it
 * you have not finished searching yet, and fifty animations is the thing she objected
 * to whether they arrived by scrolling or by typing one letter.
 */
const PREVIEW_LIMIT = 12;

/** A small, bounded preview — only ever rendered for rows a search matched. */
const Thumb = ({ asset }: { asset: Asset }) => {
    const p = previewFor(asset.type, asset.size);
    // Small enough that a result row stays a row. The preview is here to tell an
    // interstitial from a banner at a glance, not to be watched.
    return (
        <span className="block w-9 shrink-0">
            <AdFormatDemo format={p.format} moment={p.moment} bare />
        </span>
    );
};

/** One creative, full size, with the Studio animation and its play controls. */
const CreativePreview = ({ creative, onClose }: { creative: Creative; onClose: () => void }) => {
    const p = previewFor(creative.type, creative.size);
    useScrollLock(true);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Preview ${creative.name}`}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-extrabold text-primary">{creative.name}</h2>
                        <p className="text-md text-tertiary">
                            {creative.type} · {creative.size}
                        </p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>
                <div className="flex min-h-0 flex-1 justify-center overflow-y-auto overscroll-contain px-6 py-6">
                    <div className="w-full max-w-60">
                        <AdFormatDemo format={p.format} moment={p.moment} />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-secondary px-6 py-4">
                    {/* Say what it is, so nobody takes the animation for the asset. */}
                    <span className="text-md text-quaternary">
                        <Copy>How this format behaves in an app — not a render of the markup.</Copy>
                    </span>
                    <Button color="secondary" className="uppercase" onClick={onClose}>
                        <Copy>Close</Copy>
                    </Button>
                </div>
            </div>
        </div>
    );
};

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
    const [previewing, setPreviewing] = useState<Creative | null>(null);

    // One type per campaign — whichever is in first decides what else is allowed.
    const lockedType = value[0]?.type;

    const rows: SelectableRow[] = assets.map((a) => {
        // Type and size are data; only the campaign count is copy.
        const usedBy = a.campaigns.length ? copy.text(`${a.campaigns.length} campaign${a.campaigns.length === 1 ? "" : "s"}`) : undefined;
        return {
            id: a.name,
            label: a.name,
            meta: `${a.type} · ${a.size}${usedBy ? ` · ${usedBy}` : ""}`,
            trailing: <Thumb asset={a} />,
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
                    maxTrailing={PREVIEW_LIMIT}
                />
            )}

            <ChosenTable
                columns={[copy.text("Creative") ?? "", copy.text("Ad Type") ?? "", copy.text("Ad Size") ?? "", ""]}
                rows={value.map((c) => ({
                    id: c.name,
                    invalid: mixed && c.type === "VAST (xml)",
                    cells: [
                        <span key="n" className="font-medium text-primary">
                            {c.name}
                        </span>,
                        c.type,
                        c.size,
                        <PinkAction key="p" icon={Eye} onPress={() => setPreviewing(c)}>
                            <Copy>Preview</Copy>
                        </PinkAction>,
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

            {previewing && <CreativePreview creative={previewing} onClose={() => setPreviewing(null)} />}

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
                    maxTrailing={PREVIEW_LIMIT}
                />
            )}
        </TargetBlock>
    );
};
