import { useState } from "react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Copy } from "./copy-deck-ui";
import { PinkAction } from "./das-shell";
import { LABEL } from "./type-rules";
import { GEO_REGIONS } from "../../v1/screens/geo-data";
import { type TaxonomyNode, TaxonomyPicker } from "./taxonomy-picker";
import { APP_LIST } from "./target-data";
import { AppTargetBlock } from "./app-target";

/**
 * Geos, Platform and Apps for Round 3.
 *
 * Forked from v1 so Rounds 1 and 2 keep rendering exactly as they were reviewed.
 *
 * Apps has since moved off the tree entirely and onto the keyword pattern — a search
 * and a table of what you chose. It holds fifty-two rows rather than five, which is
 * the volume Kristen asked us to design against, and at that size the thing you need
 * while choosing is which of two identically-named apps you are looking at. See
 * app-target.tsx.
 *
 * Geos keep the tree, and keep Round 3's keyboard: Down to open and walk, Right and
 * Left to open and close a region, Enter to tick. A country list is a real hierarchy
 * where taking a whole branch is the common case; an app list is not.
 */

const GEO_TREE: TaxonomyNode[] = GEO_REGIONS.map((g) => ({ id: g.region, label: g.region, children: g.countries.map((c) => ({ id: c, label: c })) }));

const TargetCard = ({ title, onClear, children }: { title: string; onClear?: () => void; children: React.ReactNode }) => (
    <div className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-primary">
                <Copy>{title}</Copy>
            </h3>
            {onClear && (
                <PinkAction onPress={onClear}>
                    <Copy>Clear all</Copy>
                </PinkAction>
            )}
        </div>
        {children}
    </div>
);

export const ExistingTargetsV3 = ({ empty = false }: { empty?: boolean }) => {
    const [geos, setGeos] = useState<string[]>(empty ? [] : ["United States", "Canada"]);
    const [platforms, setPlatforms] = useState<string[]>(empty ? [] : ["iOS", "Android"]);
    const [appList, setAppList] = useState<string[]>(empty ? [] : APP_LIST.slice(0, 2).map((a) => a.id));
    const togglePlatform = (p: string) => setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
    return (
        <>
            <TargetCard title="Geos" onClear={geos.length ? () => setGeos([]) : undefined}>
                <TaxonomyPicker label="Region" nodes={GEO_TREE} value={geos} onChange={setGeos} placeholder="Search countries…" noun="countries" one="country" />
            </TargetCard>
            <TargetCard title="Platform" onClear={platforms.length ? () => setPlatforms([]) : undefined}>
                <div className="flex gap-6">
                    {["iOS", "Android"].map((p) => (
                        <Checkbox key={p} size="md" label={<span className={LABEL}>{p}</span>} isSelected={platforms.includes(p)} onChange={() => togglePlatform(p)} />
                    ))}
                </div>
                <p className="text-md text-tertiary">{platforms.length === 0 ? <Copy>Not Specified — includes every platform.</Copy> : platforms.join(", ")}</p>
            </TargetCard>
            <AppTargetBlock value={appList} onChange={setAppList} />
        </>
    );
};
