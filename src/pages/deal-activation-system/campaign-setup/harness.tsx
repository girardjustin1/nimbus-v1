import { type ReactNode, useLayoutEffect, useState } from "react";
import { cx } from "@/utils/cx";
import { setClickToFill } from "../../../../prototypes/shared/demo-fill";
import type { FieldError, Setter } from "../../../../prototypes/das/v1/screens/campaign-setup-one-page";
import { type SetupForm, type SetupPreset, allPresets } from "../../../../prototypes/das/v1/screens/setup-data";
import { type DealDraft, dealDraftFor } from "../../../../prototypes/das/v3/screens/deal-draft";
import { type IssueV3, validateV3 } from "../../../../prototypes/das/v3/screens/setup-sections";
import { FIELD_TYPE } from "../../../../prototypes/das/v3/screens/type-rules";

/**
 * Story harness for Deal Activation System › Campaign Setup.
 *
 * Every story here renders Prototype 3's own components — the ones on
 * prototypes/das/v3 #/setup-empty — so the inventory cannot drift from the page.
 *
 * Click-to-fill is prototype chrome for walkthroughs; it is switched off while a story
 * is on screen so every field behaves like a field. It comes back on when the story
 * unmounts, so the Prototype 3 stories that rely on it are unaffected.
 */
export const NoFill = ({ children }: { children: ReactNode }) => {
    useLayoutEffect(() => {
        setClickToFill(false);
        return () => setClickToFill(true);
    }, []);
    return <>{children}</>;
};

/** The page surface: Prototype 3's type rules (labels, hints) and a white page. */
export const Surface = ({ children, className }: { children: ReactNode; className?: string }) => (
    <NoFill>
        <div className={cx(FIELD_TYPE, "min-h-full bg-primary p-8", className)}>{children}</div>
    </NoFill>
);

export interface SetupState {
    form: SetupForm;
    set: Setter;
    error: FieldError;
    deal: DealDraft;
    setDeal: (next: DealDraft) => void;
    issues: IssueV3[];
}

/**
 * Local campaign state for one story — the page's own draft store is global, and
 * stories rendered side by side on a docs page would share it.
 */
export const Setup = ({
    preset = "empty",
    patch,
    attempted = false,
    deal: dealPatch,
    children,
}: {
    preset?: SetupPreset;
    patch?: Partial<SetupForm>;
    /** True once Review has been pressed: errors show. */
    attempted?: boolean;
    deal?: Partial<DealDraft>;
    children: (s: SetupState) => ReactNode;
}) => {
    const [form, setForm] = useState<SetupForm>(() => ({ ...allPresets[preset], ...patch }));
    const [deal, setDeal] = useState<DealDraft>(() => ({ ...dealDraftFor(form), ...dealPatch }));
    const issues = validateV3(form, deal);
    const error: FieldError = (field) => (attempted ? issues.find((i) => i.field === field)?.text : undefined);
    const set: Setter = (p) => setForm((f) => ({ ...f, ...p }));
    return <>{children({ form, set, error, deal, setDeal, issues })}</>;
};

/** Plain local state for a control's value. */
export const Value = <T,>({ initial, children }: { initial: T; children: (value: T, set: (next: T) => void) => ReactNode }) => {
    const [value, setValue] = useState<T>(initial);
    return <>{children(value, setValue)}</>;
};
