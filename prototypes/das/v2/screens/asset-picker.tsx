import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, InfoCircle, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { AdFormatDemo } from "@/pages/deal-activation-system/studio/components/ad-format-demo";
import { cx } from "@/utils/cx";
import { TEAL } from "../../v1/screens/das-shell";
import type { Creative } from "../../v1/screens/setup-data";
import { type Asset, previewFor, setReturnTo, useAssets } from "./asset-data";

/**
 * Browse the asset library and pick creatives for a campaign.
 *
 * Search-and-add gave you a name and nothing else — you had to already know which asset
 * you wanted. Here each one renders the format it serves in, so you pick by looking.
 *
 * A modal is the right shape for this, where it was the wrong shape for Asset Setup: you
 * are choosing from something, not filling something in, and you come straight back to
 * the form you left. Creating a new asset still leaves for the full section.
 *
 * The rule that matters: a campaign holds creatives of one type only. Once an HTML asset
 * is in, VAST is unselectable and says why, rather than letting you build an invalid
 * campaign and failing at Review.
 */

const asCreative = (a: Asset): Creative => ({ name: a.name, type: a.type, size: a.size === "Invalid" ? "N/A" : a.size });


/**
 * Leaving the campaign to make an asset.
 *
 * The copy says what actually happens rather than asking a question the publisher can't
 * answer. They are not choosing whether to save — the draft is kept either way — they are
 * deciding whether to break off now, so the one thing worth telling them is that nothing
 * is lost and they land back where they were.
 */
const LeaveToCreate = ({ onStay, onGo }: { onStay: () => void; onGo: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onStay();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onStay]);
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4" onClick={onStay}>
            <div role="dialog" aria-modal="true" aria-label="Create a new asset" onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-2xl">
                <div className="flex flex-col gap-3 px-6 py-5">
                    <h2 className="text-lg font-semibold text-primary">Create a new asset?</h2>
                    <p className="text-sm text-secondary">
                        Your campaign is kept as a draft. You'll go to Asset Setup to paste the markup, and come straight back here with the new creative already
                        attached.
                    </p>
                    <p className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                        <InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        Nothing you've filled in is lost.
                    </p>
                </div>
                <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                    <Button color="secondary" className="uppercase" onClick={onStay}>
                        Stay here
                    </Button>
                    <Button color="primary-pink" className="uppercase" onClick={onGo}>
                        Go to Asset Setup
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const AssetPicker = ({
    chosen,
    onClose,
    onAdd,
    returnHref,
}: {
    /** Creatives already on the campaign. */
    chosen: Creative[];
    onClose: () => void;
    onAdd: (added: Creative[]) => void;
    /** Where Asset Setup should come back to if you leave to make a new one. */
    returnHref: string;
}) => {
    const assets = useAssets();
    const [query, setQuery] = useState("");
    const [picked, setPicked] = useState<string[]>([]);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const q = query.trim().toLowerCase();
    const rows = q ? assets.filter((a) => `${a.name} ${a.type} ${a.size}`.toLowerCase().includes(q)) : assets;

    // One type per campaign — whichever is already in decides what else is allowed.
    const lockedType = chosen[0]?.type ?? (picked.length ? assets.find((a) => a.id === picked[0])?.type : undefined);

    const onCampaign = (a: Asset) => chosen.some((c) => c.name === a.name);
    const blocked = (a: Asset) => Boolean(lockedType && a.type !== lockedType);

    const toggle = (a: Asset) => {
        if (onCampaign(a) || blocked(a)) return;
        setPicked((p) => (p.includes(a.id) ? p.filter((x) => x !== a.id) : [...p, a.id]));
    };

    const add = () => {
        onAdd(assets.filter((a) => picked.includes(a.id)).map(asCreative));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Browse assets"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-semibold text-primary">Add Existing Asset</h2>
                        <p className="text-sm text-tertiary">
                            {lockedType ? `This campaign is ${lockedType}. Only ${lockedType} assets can be added.` : "A campaign holds creatives of one type."}
                        </p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-b border-secondary px-6 py-3">
                    <Input aria-label="Search assets" size="md" icon={SearchLg} placeholder="Search assets" value={query} onChange={setQuery} wrapperClassName="flex-1 min-w-56" />
                    <Button color="secondary" iconLeading={Plus} onClick={() => setLeaving(true)}>
                        New asset
                    </Button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    {rows.length === 0 ? (
                        <p className="py-10 text-center text-sm text-tertiary">No assets match “{query}”.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                            {rows.map((a) => {
                                const already = onCampaign(a);
                                const no = blocked(a);
                                const on = picked.includes(a.id);
                                const preview = previewFor(a.type, a.size);
                                return (
                                    <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => toggle(a)}
                                        aria-pressed={on}
                                        disabled={already || no}
                                        title={already ? "Already on this campaign" : no ? `This campaign is ${lockedType}` : undefined}
                                        className={cx(
                                            "flex flex-col gap-2 rounded-xl p-3 text-left ring-1 transition-colors",
                                            on ? "ring-2" : "ring-secondary",
                                            already || no ? "cursor-not-allowed opacity-45" : "hover:bg-secondary/50",
                                        )}
                                        style={on ? { ["--tw-ring-color" as string]: TEAL, backgroundColor: `${TEAL}0d` } : undefined}
                                    >
                                        <span className="relative mx-auto block w-full max-w-[96px]">
                                            <AdFormatDemo format={preview.format} moment={preview.moment} bare />
                                            {on && (
                                                <span className="absolute -top-1 -right-1 rounded-full bg-primary" aria-hidden="true">
                                                    <CheckCircle className="size-5" style={{ color: TEAL }} />
                                                </span>
                                            )}
                                        </span>
                                        <span className="truncate text-xs font-semibold text-primary">{a.name}</span>
                                        <span className="flex flex-wrap items-center gap-1 text-xs text-tertiary">
                                            {a.type} · {a.size}
                                        </span>
                                        {already && <span className="text-xs font-semibold text-tertiary">Already added</span>}
                                        {no && (
                                            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#B54708" }}>
                                                <AlertTriangle className="size-3" aria-hidden="true" /> Wrong type
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-secondary px-6 py-4">
                    <span className="text-sm text-tertiary">
                        {picked.length ? `${picked.length} selected` : `${rows.length} asset${rows.length === 1 ? "" : "s"} in your library`}
                    </span>
                    <div className="flex gap-3">
                        <Button color="secondary" className="uppercase" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary-pink" className="uppercase" isDisabled={!picked.length} onClick={add}>
                            Add {picked.length || ""}
                        </Button>
                    </div>
                </div>
            </div>
            {leaving && (
                <LeaveToCreate
                    onStay={() => setLeaving(false)}
                    onGo={() => {
                        setReturnTo(returnHref);
                        window.location.assign("#/asset-setup");
                    }}
                />
            )}
        </div>
    );
};
