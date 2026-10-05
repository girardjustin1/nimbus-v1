import type { ReactNode } from "react";
import { Copy } from "./copy-deck-ui";
import { NewFieldBadge, Section } from "./das-shell";
import { AdUnitHelp, AdUnitTypeFieldV3 } from "./ad-unit";
import type { SetupForm } from "../../v1/screens/setup-data";
import { ExistingTargetsV3 } from "./existing-targets";
import { type KeywordEntry, KeywordTargetBlock } from "./keyword-target";

/**
 * Round 3 targeting — one module per thing you can target on, all at the same level.
 *
 * Forked from v1 rather than shared, because the two rounds genuinely diverge here:
 *
 *   Round 1 (v1) keeps Match Logic and Device Language. Both are in the Extended
 *   Targeting charter — Match Logic has a wireframe in it — and v1 is the record of what
 *   was built to that charter and reviewed on 22 Sep.
 *
 *   Round 2 dropped both, on the 1 Oct instruction: matching is exact, and device
 *   language was never in the charter. Geos, Platform and Apps are promoted out of the
 *   loose row they used to sit in, so everything targetable reads at one level.
 *
 * If the charter is amended, this is the file that stops needing to exist.
 */

type Setter = (p: Partial<SetupForm>) => void;

const TargetModule = ({ title, added, help, children }: { title: string; added?: boolean; /** A question mark, beside the heading. */ help?: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-primary">
                <Copy>{title}</Copy>
            </h3>
            {help}
            {added && <NewFieldBadge />}
        </div>
        {children}
    </div>
);

export const TargetingSectionV3 = ({
    form,
    set,
    empty,
    keywordEntry = "inline",
    screenId,
}: {
    form: SetupForm;
    set: Setter;
    empty: boolean;
    /** Which search-and-select proposal the Keywords module uses. */
    keywordEntry?: KeywordEntry;
    screenId?: string;
}) => (
    <Section id="targeting" title={<Copy>Targeting</Copy>} description={<Copy>Leave a target empty to include everyone.</Copy>}>
        <div className="flex flex-col gap-4">
            <ExistingTargetsV3 empty={empty} />
            <TargetModule title="Ad Unit" help={<AdUnitHelp />}>
                <AdUnitTypeFieldV3 value={form.adUnits} onChange={(adUnits) => set({ adUnits })} />
            </TargetModule>
            <KeywordTargetBlock value={form.keywords} onChange={(keywords) => set({ keywords })} entry={keywordEntry} screenId={screenId} />
        </div>
    </Section>
);
