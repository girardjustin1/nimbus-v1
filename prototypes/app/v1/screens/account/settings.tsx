import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Check, Copy01, SearchLg, XClose } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { DasShell, TEAL } from "../das-shell";
import { SEARCH_WIDTH } from "../manage-campaigns";
import { ROUTES } from "../nav";
import { PageTabs, SortTh, StateAction, TABLE, TEAL_DARK } from "../nimbus-ui";
import { USER } from "../sample-data";
import { useTableSort } from "../table-sort";
import { Button, HEADLINE, LABEL } from "../type-rules";
import { API_ACCOUNTS, SAMPLE_API_KEY, endpointFor, maskKey } from "./account-data";

/**
 * Settings · Sign In and Reporting API (staging, 13 Nov 9.15.46 / 9.15.55 PM).
 *
 * Two tabs, two screens, linked by route. Sign In: the user's name and email (sample
 * user), SAVE CHANGES (inactive until a field changes), and Account Security's two
 * buttons, which open small modals. Reporting API: GENERATE API KEY, search, and the
 * accounts with their reporting endpoints (fictional, on api.example.com).
 */

const TABS = [
    { id: "sign-in", label: "Sign In", href: ROUTES.settings },
    { id: "api", label: "Reporting API", href: ROUTES.reportingApi },
];

const SettingsShell = ({ tab, children }: { tab: "sign-in" | "api"; children: ReactNode }) => (
    <DasShell navKey="settings" title="Settings" header={false}>
        <PageTabs tabs={TABS} active={tab} />
        <div className="flex flex-col gap-8 px-8 py-8">{children}</div>
    </DasShell>
);

/** Staging's field label: bold, uppercase, with a colon. */
const FieldLabel = ({ children }: { children: ReactNode }) => <span className={cx(LABEL, "uppercase")}>{children}:</span>;

const PinkButton = ({ children, onPress, isDisabled }: { children: ReactNode; onPress?: () => void; isDisabled?: boolean }) => (
    <Button size="lg" color="primary-pink" className="font-bold tracking-wide uppercase" onClick={onPress} isDisabled={isDisabled}>
        {children}
    </Button>
);

/* --------------------------------------------------------------- Modal --- */

/** The app's modal pattern (as AdUnitGuideModal): dimmed backdrop, header with ✕, actions in the footer. */
const SettingsModal = ({ title, onClose, footer, children }: { title: string; onClose: () => void; footer: ReactNode; children: ReactNode }) => {
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
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-center justify-between gap-4 border-b border-secondary px-6 py-4">
                    <h2 className={cx("text-lg text-primary", HEADLINE)}>{title}</h2>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 px-6 py-6">{children}</div>
                <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">{footer}</div>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const mismatch = confirm.length > 0 && confirm !== next;
    const ready = current.length > 0 && next.length > 0 && confirm === next;
    return (
        <SettingsModal
            title="Change Password"
            onClose={onClose}
            footer={
                <>
                    <StateAction quiet onPress={onClose}>
                        Cancel
                    </StateAction>
                    <StateAction disabled={!ready} onPress={onClose}>
                        Save
                    </StateAction>
                </>
            }
        >
            <label className="flex flex-col gap-1.5">
                <FieldLabel>Current password</FieldLabel>
                <Input aria-label="Current password" type="password" size="md" value={current} onChange={setCurrent} />
            </label>
            <label className="flex flex-col gap-1.5">
                <FieldLabel>New password</FieldLabel>
                <Input aria-label="New password" type="password" size="md" value={next} onChange={setNext} />
            </label>
            <label className="flex flex-col gap-1.5">
                <FieldLabel>Confirm new password</FieldLabel>
                <Input
                    aria-label="Confirm new password"
                    type="password"
                    size="md"
                    value={confirm}
                    onChange={setConfirm}
                    isInvalid={mismatch}
                    hint={mismatch ? "Passwords don't match." : undefined}
                />
            </label>
        </SettingsModal>
    );
};

const TwoFactorModal = ({ onClose }: { onClose: () => void }) => {
    const [on, setOn] = useState(false);
    return (
        <SettingsModal
            title="Two-Factor Authentication"
            onClose={onClose}
            footer={
                <>
                    <StateAction quiet onPress={onClose}>
                        Cancel
                    </StateAction>
                    <StateAction disabled={!on} onPress={onClose}>
                        Save
                    </StateAction>
                </>
            }
        >
            <Toggle size="md" label="Two-factor authentication" isSelected={on} onChange={setOn} />
        </SettingsModal>
    );
};

/* ------------------------------------------------------------- Sign In --- */

export const SignInSettings = ({ modal }: { modal?: "password" | "two-factor" }) => {
    const [saved, setSaved] = useState({ ...USER });
    const [form, setForm] = useState({ ...USER });
    const [open, setOpen] = useState<"password" | "two-factor" | undefined>(modal);
    const changed = form.first !== saved.first || form.last !== saved.last || form.email !== saved.email;
    const set = (k: keyof typeof USER) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <SettingsShell tab="sign-in">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                    <FieldLabel>First name</FieldLabel>
                    <Input aria-label="First name" size="md" value={form.first} onChange={set("first")} />
                </label>
                <label className="flex flex-col gap-2">
                    <FieldLabel>Last name</FieldLabel>
                    <Input aria-label="Last name" size="md" value={form.last} onChange={set("last")} />
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                    <FieldLabel>Email address</FieldLabel>
                    <Input aria-label="Email address" type="email" size="md" value={form.email} onChange={set("email")} />
                </label>
            </div>
            <div>
                <PinkButton isDisabled={!changed} onPress={() => setSaved(form)}>
                    Save Changes
                </PinkButton>
            </div>

            <section className="flex flex-col gap-4">
                <h2 className={cx("text-xl text-primary", HEADLINE)}>Account Security</h2>
                <div className="flex flex-wrap gap-3">
                    <PinkButton onPress={() => setOpen("password")}>Change Password</PinkButton>
                    <PinkButton onPress={() => setOpen("two-factor")}>Two-Factor Authentication</PinkButton>
                </div>
            </section>

            {open === "password" && <ChangePasswordModal onClose={() => setOpen(undefined)} />}
            {open === "two-factor" && <TwoFactorModal onClose={() => setOpen(undefined)} />}
        </SettingsShell>
    );
};

/* -------------------------------------------------------- Reporting API --- */

const ApiKeyRow = () => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        void navigator.clipboard?.writeText(SAMPLE_API_KEY).catch(() => undefined);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex flex-wrap items-center gap-4">
            <FieldLabel>API key</FieldLabel>
            <code className="rounded-md bg-secondary px-3 py-2 font-mono text-md text-primary ring-1 ring-secondary">{maskKey(SAMPLE_API_KEY)}</code>
            <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 text-md font-bold uppercase transition-opacity duration-100 hover:opacity-80"
                style={{ color: copied ? TEAL_DARK : TEAL }}
            >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy01 className="size-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
};

export const ReportingApiSettings = ({ generated = false }: { generated?: boolean }) => {
    const [key, setKey] = useState(generated);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const rows = useMemo(() => API_ACCOUNTS.filter((a) => !q || a.name.toLowerCase().includes(q) || a.slug.includes(q)), [q]);
    const sorted = useTableSort(rows, (a, id) => (id === "account" ? a.name : a.slug));

    return (
        <SettingsShell tab="api">
            <div className="flex flex-col gap-4">
                <div>
                    <PinkButton onPress={() => setKey(true)}>Generate API Key</PinkButton>
                </div>
                {key && <ApiKeyRow />}
            </div>

            <div className="flex flex-col gap-0">
                <Input aria-label="Search" size="md" icon={SearchLg} placeholder="Search" wrapperClassName={SEARCH_WIDTH} value={query} onChange={setQuery} />
                <div className={cx(TABLE.bleed, "mt-6")}>
                    <table className={TABLE.table}>
                        <thead>
                            <tr>
                                <SortTh id="account" sort={sorted.sort} onSort={sorted.onSort} className="w-1/3">
                                    Account
                                </SortTh>
                                <SortTh id="endpoint" sort={sorted.sort} onSort={sorted.onSort}>
                                    Reporting Endpoint
                                </SortTh>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.rows.map((a, i) => (
                                <tr key={a.slug} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                    <td className={TABLE.list.td}>{a.name}</td>
                                    <td className={cx(TABLE.list.td, "font-semibold break-all")} style={{ color: TEAL_DARK }}>
                                        {endpointFor(a.slug)}
                                    </td>
                                </tr>
                            ))}
                            {sorted.rows.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-8 py-10 text-center text-md text-tertiary">
                                        No accounts match “{query}”.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SettingsShell>
    );
};
