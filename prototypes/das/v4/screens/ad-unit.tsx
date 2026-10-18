import { useEffect, useRef, useState } from "react";
import { HelpCircle, XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { FormatId } from "@/pages/deal-activation-system/studio/studio-data";
import { cx } from "@/utils/cx";
import { type AdUnitType, adUnitTypes } from "../../v1/screens/das-data";
import { Copy } from "./copy-deck-ui";
import { TEAL } from "./das-shell";
import { useScrollLock } from "./scroll-lock";
import { Button } from "./type-rules";
import { AdFormatDemo } from "./type-rules";
import { LABEL } from "./type-rules";

/**
 * Ad Unit, with a way to find out what the four words mean.
 *
 * Forked from Round 1 to add one thing: Learn more. "Interstitial / Inline / Rewarded /
 * Dynamic Unit" is the product's own vocabulary and it is not self-explanatory to
 * anyone outside ad ops — Inline in particular reads like a layout property rather than
 * a unit. The one-line hints next to each checkbox were doing all the explaining, and a
 * line of text cannot show you that a rewarded unit is opt-in and ends on a card.
 *
 * The animations already exist: Studio uses them to show a buyer what they are bidding
 * on. Reusing them here costs nothing and means the two halves of the product describe
 * a unit the same way.
 *
 * It is a modal rather than four tiles inline because this is a reference you read
 * once. Putting it on the page permanently would make the shortest section in Targeting
 * the tallest.
 *
 * The way in is a question mark beside the section heading, grey rather than pink: it
 * is help, not an action, and it should not read as the thing to do next. The tooltip
 * exists so you can find out whether it is worth opening without opening it.
 */

/**
 * Which Studio animation stands for which ad unit.
 *
 * Three of the four map cleanly. Dynamic Unit does not: the only description of it
 * anywhere in the reference material is "Nimbus hybrid unit", and there is no asset for
 * it. Rather than borrow another unit's animation and let it read as fact, its tile
 * cycles the three standard units and says plainly that we are waiting on a spec.
 */
const UNIT_DEMOS: Record<AdUnitType, FormatId[]> = {
    Interstitial: ["interstitial"],
    Inline: ["banner"],
    Rewarded: ["rewarded"],
    "Dynamic Unit": ["interstitial", "banner", "rewarded"],
};

const UNIT_COPY: Record<AdUnitType, string> = {
    Interstitial: "Takes the whole screen at a natural break, then closes back to where the person was.",
    Inline: "Sits inside the content — a banner or an MREC — and stays put while the person scrolls.",
    Rewarded: "The person opts in, watches it through, and is paid in the app's own currency at the end.",
    "Dynamic Unit": "Nimbus hybrid unit.",
};

/** A tile that rotates through more than one demo, for the unit that isn't one format. */
const RotatingDemo = ({ formats }: { formats: FormatId[] }) => {
    const [i, setI] = useState(0);
    useEffect(() => {
        if (formats.length < 2) return;
        const t = setInterval(() => setI((n) => (n + 1) % formats.length), 5000);
        return () => clearInterval(t);
    }, [formats.length]);
    return <AdFormatDemo format={formats[i % formats.length]} bare />;
};

export const AdUnitGuideModal = ({ onClose }: { onClose: () => void }) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    useScrollLock(true, bodyRef);
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
                aria-label="Ad unit types"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-extrabold text-primary">
                            <Copy>Ad unit types</Copy>
                        </h2>
                        <p className="text-md text-tertiary">
                            <Copy>What each unit looks like to someone using the app. You are targeting the publisher's units, not your creative's size.</Copy>
                        </p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {adUnitTypes.map((unit) => (
                            <div key={unit.id} className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary">
                                <div className="mx-auto w-full max-w-40">
                                    <RotatingDemo formats={UNIT_DEMOS[unit.id]} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-md font-semibold text-primary">
                                        <Copy>{unit.id}</Copy>
                                    </span>
                                    <span className="text-md text-tertiary">
                                        <Copy>{UNIT_COPY[unit.id]}</Copy>
                                    </span>
                                    {unit.id === "Dynamic Unit" && (
                                        <span className="text-md text-quaternary">
                                            <Copy>No animation yet — that is all the spec says about it. This cycles the three units it sits alongside.</Copy>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end border-t border-secondary px-6 py-4">
                    <Button color="secondary" className="uppercase" onClick={onClose}>
                        <Copy>Close</Copy>
                    </Button>
                </div>
            </div>
        </div>
    );
};

/** One ad unit type as a checkbox card. The whole card toggles it. */
export const AdUnitCard = ({ unit, on, onToggle }: { unit: (typeof adUnitTypes)[number]; on: boolean; onToggle: () => void }) => (
    <label
            className={cx(
            // Same edge as the text fields and the Auction Rules cards.
            "flex cursor-pointer items-start gap-3 rounded-xl p-4 shadow-xs ring-1 transition-colors duration-100 ring-inset",
            on ? "ring-2" : "ring-primary hover:bg-primary_hover",
        )}
        style={
            on ? { boxShadow: `inset 0 0 0 1px ${TEAL}, var(--shadow-xs)`, backgroundColor: `${TEAL}0f`, ["--tw-ring-color" as string]: TEAL } : undefined
        }
    >
        <Checkbox size="sm" isSelected={on} onChange={onToggle} aria-label={unit.id} />
        <span className="flex flex-col">
            <span className={LABEL}>
                <Copy>{unit.id}</Copy>
            </span>
            <span className="text-md text-tertiary">
                <Copy>{unit.hint}</Copy>
            </span>
        </span>
    </label>
);

export const AdUnitTypeFieldV3 = ({
    initial = ["Interstitial"] as AdUnitType[],
    value,
    onChange,
}: {
    initial?: AdUnitType[];
    /** Controlled mode — the campaign form owns the selection. */
    value?: AdUnitType[];
    onChange?: (v: AdUnitType[]) => void;
}) => {
    const [own, setOwn] = useState<AdUnitType[]>(initial);
    const selected = value ?? own;
    const toggle = (id: AdUnitType) => {
        const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
        if (onChange) onChange(next);
        else setOwn(next);
    };
    return (
        <div className="flex flex-col gap-2">
            {/* Instruction above the cards, under the module title (C1); the requirement
                stays below them, where the choice is. */}
            <p data-intro className="mb-1 text-md text-tertiary">
                <Copy>Targets the publisher's ad units, not creative sizes.</Copy>
            </p>
            {/* Same grid as the Auction Rules cards: two across, never four squeezed into a row. */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {adUnitTypes.map((unit) => (
                    <AdUnitCard key={unit.id} unit={unit} on={selected.includes(unit.id)} onToggle={() => toggle(unit.id)} />
                ))}
            </div>
            {selected.length === 0 && (
                <p className="text-md text-error-primary">
                    <Copy>Select at least one.</Copy>
                </p>
            )}
        </div>
    );
};

/**
 * The question mark that sits beside the "Ad Unit" heading and opens the guide.
 *
 * Separate from the field because it belongs to the section, not to the checkboxes —
 * and because the heading is where you look when a word on a form means nothing to you.
 */
export const AdUnitHelp = () => {
    const [guide, setGuide] = useState(false);
    return (
        <>
            <Tooltip
                title={<Copy>What these ad units look like</Copy>}
                description={
                    <Copy>
                        An animation of each unit — Interstitial, Inline, Rewarded and Dynamic Unit — as someone using the app would see it. Click to learn
                        more.
                    </Copy>
                }
                placement="top"
            >
                <TooltipTrigger
                    aria-label="What these ad units look like"
                    onPress={() => setGuide(true)}
                    className="cursor-pointer rounded-full text-fg-quaternary transition-colors hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                    <HelpCircle className="size-4.5" aria-hidden="true" />
                </TooltipTrigger>
            </Tooltip>
            {guide && <AdUnitGuideModal onClose={() => setGuide(false)} />}
        </>
    );
};
