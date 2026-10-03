import { PinkAction } from "../../v1/screens/das-shell";
import { APP_LIST, appById } from "./target-data";
import { ChosenTable, InlineSearchSelect, type SelectableRow, TargetBlock } from "./search-select";

/**
 * Targeting a campaign at apps.
 *
 * Apps were the last picker still working the old way: a tree you opened, with what
 * you had chosen folded into chips inside the field. That was defensible while the
 * list was five long and indefensible at fifty-two, and it left Apps as the odd one
 * out next to Keywords and Creative, which is the exact complaint behind every other
 * change this round — "I want the two sections to kind of be similar."
 *
 * So it is the keyword pattern, unchanged: type to filter, choose from what matched,
 * and read what you have chosen in a table underneath. The table is the point rather
 * than a detail of it. Chips carry one string and nothing else, and the one thing you
 * need while picking an app is which of the two identically-named rows you are looking
 * at — "Trail Tracker" is two apps, and only the platform and the bundle tell them
 * apart. A column can say that; a chip cannot.
 *
 * Geos keep the tree. A country list is a genuine hierarchy where taking a whole
 * branch is the common case, and it was reviewed that way on purpose.
 */

const appRows: SelectableRow[] = APP_LIST.map((a) => ({
    id: a.id,
    label: a.name,
    meta: `${a.platform} · ${a.bundle}`,
}));

export const AppTargetBlock = ({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) => {
    const chosen = value.map((id) => {
        const app = appById(id);
        return {
            id,
            invalid: !app,
            cells: [
                <span key="n" className="font-medium text-primary">
                    {app?.name ?? id}
                </span>,
                app?.platform ?? "—",
                <span key="b" className="font-mono text-xs text-tertiary">
                    {app?.bundle ?? "Not in your account"}
                </span>,
            ],
        };
    });

    return (
        <TargetBlock title="Apps" trailing={value.length > 0 ? <PinkAction onPress={() => onChange([])}>Clear all</PinkAction> : undefined}>
            <InlineSearchSelect
                label="Search apps"
                placeholder="Search your apps"
                rows={appRows}
                chosenIds={value}
                onPick={(row) => onChange([...value, row.id])}
                noun="apps"
            />
            <ChosenTable
                columns={["App", "Platform", "Bundle ID"]}
                rows={chosen}
                onRemove={(id) => onChange(value.filter((v) => v !== id))}
                empty="No apps yet — the campaign runs on all of them. Search above to narrow it."
            />
        </TargetBlock>
    );
};
