import type { ReactNode } from "react";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Fillable } from "../../../shared/demo-fill-ui";
import type { FieldError, Setter } from "../../v1/screens/campaign-setup-one-page";
import { Section } from "../../v1/screens/das-shell";
import type { SetupForm } from "../../v1/screens/setup-data";
import { deals } from "./deal-data";
import type { DealDraft, DealMode } from "./deal-draft";
import { type SelectableRow, SingleSearchSelect } from "./search-select";

/**
 * Deal — which deal this campaign nests under.
 *
 * Round 1 called this General and asked one question, "which existing deal?", from a
 * dropdown of three. It is three questions, and which fields you need depends on the
 * answer:
 *
 *   Generate new ID   name the deal; Nimbus assigns the id when it is created
 *   Create new ID     name the deal and give it an id yourself
 *   Add to existing   find the deal; its name and id are already settled
 *
 * The fields sit on the row with the radio that asks for them, so the choice and its
 * consequence read as one line rather than as a radio group with a mystery field
 * underneath. Deal Name and ID are side by side because they are one fact about one
 * thing, and a form that stacks them implies an order that doesn't exist.
 *
 * Picking an existing deal fills its name and id in, read-only. They are not editable
 * here for the same reason you cannot rename a deal from inside a campaign — this
 * screen creates campaigns, not deals — and showing them at all is the point: you
 * should be able to see you picked the right one before moving on to the campaign's
 * own name.
 *
 * Campaign Name used to live at the bottom of this section. It is its own section now;
 * see setup-sections.ts for why.
 *
 * Every field keeps its helper line at all times, including the rows you have not
 * chosen. The first version only showed a hint on the active row, so each row changed
 * height as you moved between them and the whole form shuffled underneath — three
 * radios that move the page every time you compare them. An error replaces the hint in
 * place rather than being added below it, for the same reason.
 */

const dealRows: SelectableRow[] = deals.map((d) => ({ id: d.id, label: d.label, meta: d.supportingText }));

/** Fields line up in one column across all three rows, whatever the radio label's length. */
const RADIO_WIDTH = "lg:w-48";

const ModeRow = ({ value, label, active, children }: { value: DealMode; label: string; active: boolean; children: ReactNode }) => (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
        <RadioButton value={value} label={label} className={`lg:mt-2.5 ${RADIO_WIDTH} lg:shrink-0`} />
        {/* Dimmed rather than hidden: you can see what each choice will ask of you
            before you commit to it, which is the job a radio group is doing anyway.
            The fields themselves are disabled too — dimming alone leaves them in the
            tab order, so a keyboard lands in a field belonging to a mode you did not
            choose. */}
        <div className={`flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start ${active ? "" : "opacity-45"}`}>{children}</div>
    </div>
);

export const DealSectionV3 = ({
    form,
    set,
    error,
    deal,
    setDeal,
}: {
    form: SetupForm;
    set: Setter;
    error: FieldError;
    deal: DealDraft;
    setDeal: (next: DealDraft) => void;
}) => {
    const chosen = deals.find((d) => d.id === form.dealId);

    const setMode = (mode: DealMode) => {
        // Switching away from an existing deal drops it: the id belongs to that deal,
        // and carrying it into "new deal" would publish a campaign onto the wrong one.
        if (mode !== "existing" && form.dealId) set({ dealId: undefined });
        setDeal({ ...deal, mode });
    };

    /**
     * Both new-deal rows edit the same name. Switching between Generate and Create is
     * a change of mind about the id, not about what the deal is called, and making you
     * retype it would be the form forgetting something you already told it.
     */
    const nameField = (mode: DealMode) => (
        <Fillable filled={Boolean(deal.name)} onFill={() => setDeal({ ...deal, mode, name: "Autumn Drive" })}>
            <Input
                label="Deal Name"
                size="md"
                placeholder="e.g. Autumn Drive"
                value={deal.name}
                onChange={(name) => setDeal({ ...deal, name })}
                isDisabled={deal.mode !== mode}
                isRequired
                isInvalid={deal.mode === mode && Boolean(error("dealName"))}
                hint={(deal.mode === mode && error("dealName")) || "How you'll find this deal later."}
            />
        </Fillable>
    );

    return (
        <Section id="deal" title="Deal" description="Campaigns nest under a deal. Budgets belong to the campaign, not the deal.">
            <RadioGroup size="sm" value={deal.mode} onChange={(v) => setMode(v as DealMode)} className="flex flex-col gap-5" aria-label="Deal">
                <ModeRow value="generate" label="Generate new ID" active={deal.mode === "generate"}>
                    <div className="min-w-0 flex-1">{nameField("generate")}</div>
                    <div className="min-w-0 flex-1">
                        <Input label="Deal ID" size="md" value="" isDisabled placeholder="Assigned by Nimbus" hint="Created with the deal." />
                    </div>
                </ModeRow>

                <ModeRow value="create" label="Create new ID" active={deal.mode === "create"}>
                    <div className="min-w-0 flex-1">{nameField("create")}</div>
                    <div className="min-w-0 flex-1">
                        <Fillable filled={Boolean(deal.id)} onFill={() => setDeal({ ...deal, mode: "create", id: "D-11204" })}>
                            <Input
                                label="Deal ID"
                                size="md"
                                placeholder="e.g. D-11204"
                                value={deal.id}
                                onChange={(id) => setDeal({ ...deal, id })}
                                isDisabled={deal.mode !== "create"}
                                isRequired
                                isInvalid={deal.mode === "create" && Boolean(error("dealCustomId"))}
                                hint={(deal.mode === "create" && error("dealCustomId")) || "Must be unique across your deals."}
                            />
                        </Fillable>
                    </div>
                </ModeRow>

                <ModeRow value="existing" label="Add to existing" active={deal.mode === "existing"}>
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <Fillable filled={Boolean(form.dealId)} onFill={() => set({ dealId: deals[0].id })}>
                            <SingleSearchSelect
                                label="Existing deal"
                                placeholder="Search your deals"
                                noun="deals"
                                rows={dealRows}
                                value={form.dealId}
                                onChange={(dealId) => set({ dealId })}
                                isDisabled={deal.mode !== "existing"}
                                isInvalid={Boolean(error("deal"))}
                                hint={error("deal") ?? "Its name and ID are already set."}
                            />
                        </Fillable>
                        {/* Settled, not editable — and shown so you can check you took
                            the right one before the campaign gets named after it. */}
                        {chosen && (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <div className="min-w-0 flex-1">
                                    <Input label="Deal Name" size="md" value={chosen.label} isDisabled hint="Set on the deal, not here." />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <Input label="Deal ID" size="md" value={chosen.id} isDisabled hint="Set on the deal, not here." />
                                </div>
                            </div>
                        )}
                    </div>
                </ModeRow>
            </RadioGroup>
        </Section>
    );
};

/**
 * Campaign Name, promoted out of the deal and given the same weight as Auction Rules.
 *
 * It is the name this campaign carries in the campaign list, in reporting and in every
 * conversation about it afterwards. A text box at the bottom of the deal section asked
 * for it as an afterthought.
 */
export const CampaignNameSection = ({ form, set, error }: { form: SetupForm; set: Setter; error: FieldError }) => (
    <Section id="campaign" title="Campaign Name" description="What this campaign is called everywhere else — the campaign list, reporting, and Publish & Duplicate.">
        <Fillable filled={Boolean(form.name)} onFill={() => set({ name: "Sports fans · Interstitial" })}>
            <Input
                aria-label="Campaign Name"
                size="md"
                className="max-w-xl"
                placeholder="e.g. Sports fans · Interstitial"
                value={form.name}
                onChange={(name) => set({ name })}
                isRequired
                isInvalid={Boolean(error("name"))}
                hint={error("name") ?? "Used in the campaign list, reporting and Publish & Duplicate."}
            />
        </Fillable>
    </Section>
);
