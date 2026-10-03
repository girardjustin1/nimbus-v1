import { AlertCircle } from "@untitledui/icons";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "@/utils/cx";
import type { AuctionRule } from "../../v1/screens/das-data";
import { Section, TEAL } from "../../v1/screens/das-shell";
import type { FieldError, Setter } from "../../v1/screens/campaign-setup-one-page";
import { type SetupForm, rules } from "../../v1/screens/setup-data";

/**
 * Auction Rules — the whole card is the target, not the dot.
 *
 * Round 1 drew a card and put a radio inside it, which meant the hit area was a
 * sixteen-pixel circle sitting in a box four hundred pixels wide. Everything about the
 * card says "press me" — the border, the hover, the way the selected one lights up —
 * and then only the dot answers. These four options are also the most consequential
 * choice on the form, and the one people read twice before deciding, so the target
 * ought to be the thing they are reading.
 *
 * The fix is to stop nesting: the radio *is* the card. `RadioButton` renders React
 * Aria's `Radio`, which is already the label element, so giving it the card's classes
 * makes the entire box the control and keeps the keyboard and focus behaviour that
 * comes with it.
 *
 * The description goes inside `label` rather than in `hint`, which looks like a
 * detail and isn't: the shared component stops click propagation on `hint` so the
 * text can be selected. Inside a card that is the control, that would carve a dead
 * zone out of the middle of the target — the exact bug this is fixing, in the one
 * place you would never think to test.
 */

export const RulesSectionV3 = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => {
    const invalid = Boolean(error("rule"));
    return (
        <Section id="rules" title="Auction Rules" description="How this campaign competes with open-marketplace auctions.">
            <RadioGroup
                size="sm"
                value={form.rule ?? null}
                onChange={(v) => set({ rule: v as AuctionRule })}
                className="grid grid-cols-1 gap-3 md:grid-cols-2"
                aria-label="Auction rule"
            >
                {rules.map((r) => (
                    <RadioButton
                        key={r.id}
                        value={r.id}
                        className={({ isSelected, isFocusVisible }) =>
                            cx(
                                "cursor-pointer rounded-xl p-4 ring-1 transition-colors",
                                isSelected ? "ring-transparent" : invalid ? "ring-error_subtle hover:bg-primary_hover" : "ring-secondary hover:bg-primary_hover",
                                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                            )
                        }
                        style={form.rule === r.id ? { boxShadow: `inset 0 0 0 2px ${TEAL}`, backgroundColor: `${TEAL}0a` } : undefined}
                        label={
                            <span className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-secondary">{r.id}</span>
                                <span className="text-sm font-normal text-tertiary">{r.hint}</span>
                            </span>
                        }
                    />
                ))}
            </RadioGroup>
            {invalid && (
                <p className="flex items-center gap-2 text-sm font-medium text-error-primary">
                    <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {error("rule")}
                </p>
            )}
        </Section>
    );
};
