import type { ReactNode } from "react";
import { Fillable } from "../../../shared/demo-fill-ui";
import { NewFieldBadge, Section } from "../../v1/screens/das-shell";
import { AdUnitTypeField, ExistingTargets, KeywordChipInput } from "../../v1/screens/keyword-targeting";
import { type SetupForm, fill } from "../../v1/screens/setup-data";

/**
 * Round 2 targeting — one module per thing you can target on, all at the same level.
 *
 * Forked from v1 rather than shared, because the two rounds genuinely diverge here:
 *
 *   Round 1 (v1) keeps Match Logic and Device Language. Both are in the Extended
 *   Targeting charter — Match Logic has a wireframe in it — and v1 is the record of what
 *   was built to that charter and reviewed on 22 Sep.
 *
 *   Round 2 (here) drops both, on the 1 Oct instruction: matching is exact, and device
 *   language was never in the charter. Geos, Platform and Apps are promoted out of the
 *   loose row they used to sit in, so everything targetable reads at one level.
 *
 * If the charter is amended, this is the file that stops needing to exist.
 */

type Setter = (p: Partial<SetupForm>) => void;

const TargetModule = ({ title, added, children }: { title: string; added?: boolean; children: ReactNode }) => (
    <div className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            {added && <NewFieldBadge />}
        </div>
        {children}
    </div>
);

export const TargetingSectionV2 = ({ form, set, empty }: { form: SetupForm; set: Setter; empty: boolean }) => (
    <Section id="targeting" title="Targeting" description="Leave a target empty to include everyone.">
        <div className="flex flex-col gap-4">
            <ExistingTargets empty={empty} />
            <TargetModule title="Ad Unit">
                <AdUnitTypeField value={form.adUnits} onChange={(adUnits) => set({ adUnits })} />
            </TargetModule>
            <TargetModule title="Keywords" added>
                <Fillable filled={form.keywords.length > 0} onFill={() => set({ keywords: fill.keywords() })}>
                    <KeywordChipInput value={form.keywords} onChange={(keywords) => set({ keywords })} />
                </Fillable>
            </TargetModule>
        </div>
    </Section>
);
