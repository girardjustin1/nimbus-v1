import { useState } from "react";
import { AlertTriangle, ArrowLeft, InfoCircle, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { AdFormatDemo } from "@/pages/deal-activation-system/studio/components/ad-format-demo";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, PINK, PinkAction, TEAL } from "../../v1/screens/das-shell";
import { AD_SIZES, AD_TYPES, type AdSize, type AdType, assetById, deleteAsset, findMacros, isWrappedVast, previewFor, updateAsset, useAssets } from "./asset-data";

import { V2_NAV_ITEMS } from "./nav";

/**
 * An asset you already have: change it, add a tracker to it, or delete it.
 *
 * Not in the Extended Targeting charter — the charter covers asset-level *reporting* and
 * "edit active campaigns", never editing an asset. It is in the real product, though: on
 * staging the asset name is a link and each row carries a delete, so this is filling in a
 * screen that exists rather than inventing one. Asked for on 1 Oct: "I need to go in here
 * and be able to add a tracker to this asset or delete it."
 *
 * The part that needed deciding: an asset attached to a live campaign is already serving.
 * Editing its markup changes what people see, with no publish step in between, so the
 * screen says so and delete is blocked outright rather than warned about.
 */

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <span className="text-sm font-semibold text-primary">
        {children}
        {required && " *"}
    </span>
);

const DeleteGuard = ({ name, campaigns, onCancel }: { name: string; campaigns: string[]; onCancel: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
        <div role="dialog" aria-modal="true" aria-label={`Can't delete ${name}`} onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-2xl">
            <div className="flex flex-col gap-3 px-6 py-5">
                <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <AlertTriangle className="size-5 shrink-0 text-warning-primary" aria-hidden="true" />
                    This asset is live
                </p>
                <p className="text-sm text-secondary">
                    <span className="font-mono text-xs">{name}</span> is serving in {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}. Deleting it would
                    stop delivery immediately.
                </p>
                <ul className="flex flex-col gap-1 rounded-xl bg-secondary/60 px-4 py-3">
                    {campaigns.map((c) => (
                        <li key={c} className="text-sm font-medium text-primary">
                            {c}
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-tertiary">Remove it from those campaigns first, then delete it here.</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                <Button color="secondary" className="uppercase" onClick={onCancel}>
                    Close
                </Button>
            </div>
        </div>
    </div>
);

export const AssetDetail = ({ id = "a1", confirmingDelete = false }: { id?: string; confirmingDelete?: boolean }) => {
    useAssets(); // re-render when the store changes
    const asset = assetById(id);
    const [name, setName] = useState(asset?.name ?? "");
    const [type, setType] = useState<AdType | undefined>(asset?.type);
    const [size, setSize] = useState<AdSize | undefined>(asset && asset.size !== "N/A" && asset.size !== "Invalid" ? asset.size : undefined);
    const [markup, setMarkup] = useState(asset?.markup ?? "");
    const [imps, setImps] = useState<string[]>([...(asset?.impressionTrackers ?? []), "", ""].slice(0, 3));
    const [clicks, setClicks] = useState<string[]>([...(asset?.clickTrackers ?? []), "", ""].slice(0, 3));
    const [guard, setGuard] = useState(confirmingDelete);
    const [saved, setSaved] = useState(false);

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        setImps((v) => v.map((x, i) => x || (i === 1 ? (bad ? "verify.example-dsp.com/pixel/imp/added" : "https://verify.example-dsp.com/pixel/imp/added") : x)));
        setClicks((v) => v.map((x, i) => x || (i === 0 ? (bad ? "https://track.example.com/clk?cb=%%CACHEBUSTER%%" : "https://track.example.com/clk?cid=10482") : x)));
        setSaved(false);
    });

    if (!asset) {
        return (
            <DasShell navItems={V2_NAV_ITEMS} navKey="manage assets">
                <div className="px-8 py-10 text-sm text-tertiary">No asset with id “{id}”.</div>
            </DasShell>
        );
    }

    const live = asset.campaigns.length > 0;
    const macros = findMacros(markup);
    const wrapped = type === "VAST (xml)" && isWrappedVast(markup);
    const markupError =
        macros.length > 0
            ? `Macros aren't supported. Nimbus serves ${macros.length === 1 ? "this" : "these"} as literal text: ${macros.join(", ")}`
            : wrapped
              ? "This VAST is wrapped. Paste the raw, unwrapped XML."
              : undefined;
    const badTracker = [...imps, ...clicks].some((v) => v && (!/^https?:\/\//.test(v) || findMacros(v).length > 0));
    const canSave = Boolean(name.trim() && type && markup.trim()) && !markupError && !badTracker;
    const preview = previewFor(type ?? "HTML", size ?? asset.size);

    const save = () => {
        updateAsset(asset.id, {
            name,
            type: type ?? asset.type,
            size: size ?? asset.size,
            markup,
            impressionTrackers: imps.filter(Boolean),
            clickTrackers: clicks.filter(Boolean),
        });
        setSaved(true);
    };

    const urlRow = (values: string[], set: (v: string[]) => void, label: string, sample: string) => (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {values.map((v, i) => (
                <Fillable key={i} filled={Boolean(v)} onFill={() => set(values.map((x, j) => (j === i ? sample : x)))}>
                    <Input
                        aria-label={`${label} ${i + 1}`}
                        size="md"
                        value={v}
                        onChange={(next) => {
                            set(values.map((x, j) => (j === i ? next : x)));
                            setSaved(false);
                        }}
                        isInvalid={Boolean(v) && (!/^https?:\/\//.test(v) || findMacros(v).length > 0)}
                        hint={
                            v && !/^https?:\/\//.test(v)
                                ? "Must be a full https:// URL"
                                : v && findMacros(v).length > 0
                                  ? `Macros aren't supported in trackers: ${findMacros(v).join(", ")}`
                                  : undefined
                        }
                    />
                </Fillable>
            ))}
            <span className="text-xs text-tertiary">{values.filter(Boolean).length} of {values.length} used.</span>
        </div>
    );

    return (
        <DasShell
            navItems={V2_NAV_ITEMS}
            navKey="manage assets"
            concept={{
                label: "Round 2 · Added",
                title: "Editing an asset that is already serving",
                notes: [
                    "Not in the charter — it covers asset-level reporting and editing campaigns, never editing an asset. It is in the product: on staging the asset name is a link and each row has a delete.",
                    "An asset in a live campaign is serving now. Changing its markup changes what people see, with no publish step in between, so the page says so rather than letting you find out.",
                    "Delete is blocked, not warned, while a campaign still uses it — the same rule as a keyword in use.",
                ],
            }}
        >
            <div className="flex flex-col gap-5 px-8 py-8">
                <a href="#/asset-view" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold" style={{ color: PINK }}>
                    <ArrowLeft className="size-4" aria-hidden="true" /> All assets
                </a>

                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-semibold text-primary">{asset.name}</h2>
                        <span className="inline-flex items-center gap-2 text-sm text-tertiary">
                            <span className="size-2 rounded-full" style={{ backgroundColor: live ? TEAL : "#98A2B3" }} aria-hidden="true" />
                            {asset.status} · {asset.type} · {asset.size}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <PinkAction>Test Asset</PinkAction>
                        <PinkAction
                            icon={XClose}
                            onPress={() => {
                                if (live) setGuard(true);
                                else {
                                    deleteAsset(asset.id);
                                    window.location.assign("#/asset-view");
                                }
                            }}
                        >
                            Delete
                        </PinkAction>
                    </div>
                </div>

                {live && (
                    <p className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#FFF4E5", color: "#B54708" }}>
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        Serving now in {asset.campaigns.join(", ")}. Changes take effect on the next ad request — there is no publish step for an asset.
                    </p>
                )}

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex min-w-0 flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label required>Creative Name</Label>
                            <Input
                                aria-label="Creative Name"
                                size="md"
                                value={name}
                                onChange={(v) => {
                                    setName(v);
                                    setSaved(false);
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label required>Ad Type</Label>
                                <Select
                                    aria-label="Ad Type"
                                    items={AD_TYPES.map((x) => ({ id: x, label: x }))}
                                    selectedKey={type ?? null}
                                    onSelectionChange={(k) => {
                                        setType(k ? (String(k) as AdType) : undefined);
                                        setSaved(false);
                                    }}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Ad Size</Label>
                                <Select
                                    aria-label="Ad Size"
                                    placeholder={asset.size}
                                    items={AD_SIZES.map((x) => ({ id: x, label: x }))}
                                    selectedKey={size ?? null}
                                    onSelectionChange={(k) => {
                                        setSize(k ? (String(k) as AdSize) : undefined);
                                        setSaved(false);
                                    }}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label required>Add Markup</Label>
                            <textarea
                                aria-label="Add Markup"
                                value={markup}
                                onChange={(e) => {
                                    setMarkup(e.target.value);
                                    setSaved(false);
                                }}
                                rows={9}
                                spellCheck={false}
                                className={cx(
                                    "w-full rounded-lg bg-primary px-3.5 py-3 font-mono text-sm text-primary shadow-xs ring-1 ring-inset outline-none focus:ring-2",
                                    markupError ? "ring-error_subtle" : "ring-primary focus:ring-brand",
                                )}
                            />
                            {markupError && <span className="text-sm text-error-primary">{markupError}</span>}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {urlRow(imps, setImps, "Impression Tracking URL(s)", "https://verify.example-dsp.com/pixel/imp/added")}
                            {urlRow(clicks, setClicks, "Click Tracking URL(s)", "https://track.example.com/clk?cid=10482")}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button color="secondary" className="uppercase" href="#/asset-view">
                                Cancel
                            </Button>
                            <Button color="primary-pink" className="uppercase" isDisabled={!canSave} onClick={save}>
                                Save Changes
                            </Button>
                            {saved && (
                                <span className="text-sm font-medium" style={{ color: "#1F7F80" }}>
                                    Saved. {live ? "Live on the next ad request." : "This asset isn't serving yet."}
                                </span>
                            )}
                        </div>
                    </div>

                    <aside className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary xl:sticky xl:top-14">
                        <h3 className="text-lg font-semibold text-primary">Preview</h3>
                        <div className="mx-auto w-[200px]">
                            <AdFormatDemo format={preview.format} moment={preview.moment} />
                        </div>
                        <p className="text-center text-xs text-tertiary">Approximate placement. Size and position vary by device, screen and app.</p>
                        <div className="flex flex-col gap-1 border-t border-secondary pt-3 text-sm">
                            <span className="text-xs font-semibold text-tertiary uppercase">Associated Campaigns</span>
                            {asset.campaigns.length ? (
                                asset.campaigns.map((c) => (
                                    <span key={c} className="text-secondary">
                                        {c}
                                    </span>
                                ))
                            ) : (
                                <span className="flex items-center gap-1.5 text-tertiary">
                                    <InfoCircle className="size-4" aria-hidden="true" /> None — safe to change freely.
                                </span>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {guard && <DeleteGuard name={asset.name} campaigns={asset.campaigns} onCancel={() => setGuard(false)} />}
        </DasShell>
    );
};
