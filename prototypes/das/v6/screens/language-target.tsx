import { Copy } from "./copy-deck-ui";
import { PinkAction } from "./das-shell";
import { ChosenTable, InlineSearchSelect, type SelectableRow, TargetBlock } from "./search-select";
import { LANGUAGES, languageById } from "./target-data";

/**
 * Device Language — restored on 19 Oct.
 *
 * The charter lists it as a new standard target: the language of the device's OS
 * locale, as ISO 639-1 codes. It was dropped on 1 Oct and came back once Product
 * confirmed it is in the charter.
 *
 * Round 1 drew it as a multi-select dropdown. Round 4 uses the pattern every other
 * library field uses — type to narrow, pick, read what you chose in a table — so it
 * behaves exactly like Apps and Keywords beside it.
 */

const rows: SelectableRow[] = LANGUAGES.map((l) => ({ id: l.id, label: l.name, meta: l.id }));

export const LanguageTargetBlock = ({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) => (
    <TargetBlock
        title="Device Language"
        trailing={
            value.length > 0 ? (
                <PinkAction onPress={() => onChange([])}>
                    <Copy>Clear all</Copy>
                </PinkAction>
            ) : undefined
        }
    >
        <InlineSearchSelect
            label="Search languages"
            placeholder="Search languages or codes"
            rows={rows}
            chosenIds={value}
            onPick={(row) => onChange([...value, row.id])}
            noun="languages"
        />
        <ChosenTable
            columns={["Language", "Code"]}
            rows={value.map((id) => ({
                id,
                invalid: !languageById(id),
                cells: [
                    <span key="n" className="font-medium text-primary">
                        {languageById(id)?.name ?? id}
                    </span>,
                    <span key="c" className="font-mono text-md text-tertiary">
                        {id}
                    </span>,
                ],
            }))}
            onRemove={(id) => onChange(value.filter((v) => v !== id))}
            empty="No languages yet — the campaign serves in every device language. Search above to narrow it."
        />
        <p className="text-md text-tertiary">
            <Copy>From the device's OS locale.</Copy>
        </p>
    </TargetBlock>
);
