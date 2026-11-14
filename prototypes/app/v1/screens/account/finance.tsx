import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import { DasShell } from "../das-shell";
import { SortTh, TABLE } from "../nimbus-ui";
import { type SortValue, useTableSort } from "../table-sort";
import { LABEL } from "../type-rules";
import { FINANCE_TITLES, type FinancePage, INVOICES, type Invoice, NO_PERMISSION, PAYEE_FIELDS, PAYMENTS, type Payment, shortDate, usd } from "./account-data";

/**
 * Finance · Payee registration, Payment history, Invoice history (staging, 13 Nov
 * 9.15.26 / 9.15.32 / 9.15.37 PM).
 *
 * Staging shows the three pages to an account without access, so each has two states:
 *   - No permission — staging's message, word for word.
 *   - Default — in production these pages embed the payments provider's frame, which
 *     can't be restyled. Our chrome (nav, page title) stays; the frame is drawn as a
 *     labelled, bordered area with placeholder provider content inside, so nobody mistakes
 *     it for something we design.
 */

const NAV_KEYS: Record<FinancePage, string> = {
    payee: "n+ payee registration",
    payments: "n+ payment history",
    invoices: "n+ invoice history",
};

/** The provider's frame: bordered, labelled as third-party content. */
const ProviderFrame = ({ children }: { children: ReactNode }) => (
    <section aria-label="Embedded payments portal (third-party)" className="overflow-hidden rounded-lg border-2 border-dashed border-primary">
        <header className="flex items-center justify-between gap-4 border-b border-secondary bg-secondary px-6 py-3">
            <span className={LABEL}>Embedded payments portal (third-party)</span>
            <span className="text-md text-tertiary">Provider content</span>
        </header>
        <div className="bg-primary p-6">{children}</div>
    </section>
);

/** Placeholder of the provider's payee form: read-only fields in a neutral style. */
const PayeeEmbed = () => (
    <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {PAYEE_FIELDS.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1.5">
                <span className="text-md font-semibold text-secondary">{label}</span>
                <span className="rounded-md border border-primary bg-secondary px-3 py-2.5 text-md text-tertiary">{value}</span>
            </div>
        ))}
    </div>
);

const th = cx(TABLE.list.th, "first:pl-4 last:pr-4");
const td = cx(TABLE.list.td, "first:pl-4 last:pr-4");

const PAYMENT_COLUMNS: [keyof Payment, string, boolean?][] = [
    ["date", "Payment date"],
    ["id", "Payment ID"],
    ["method", "Payment method"],
    ["amount", "Amount", true],
    ["status", "Status"],
];

const PaymentsEmbed = () => {
    const sorted = useTableSort<Payment>(PAYMENTS, (p, id) => p[id as keyof Payment] as SortValue);
    return (
        <div className="overflow-x-auto rounded-md border border-secondary">
            <table className={TABLE.table}>
                <thead>
                    <tr>
                        {PAYMENT_COLUMNS.map(([id, label, right]) => (
                            <SortTh key={id} id={id} sort={sorted.sort} onSort={sorted.onSort} align={right ? "right" : "left"} className={th}>
                                {label}
                            </SortTh>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.rows.map((p, i) => (
                        <tr key={p.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                            <td className={td}>{shortDate(p.date)}</td>
                            <td className={td}>{p.id}</td>
                            <td className={td}>{p.method}</td>
                            <td className={cx(td, "text-right tabular-nums")}>{usd(p.amount)}</td>
                            <td className={td}>{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const INVOICE_COLUMNS: [keyof Invoice, string, boolean?][] = [
    ["id", "Invoice number"],
    ["date", "Invoice date"],
    ["period", "Billing period"],
    ["amount", "Amount", true],
    ["status", "Status"],
];

const InvoicesEmbed = () => {
    // Billing period sorts by its invoice date, not alphabetically.
    const sorted = useTableSort<Invoice>(INVOICES, (v, id) => (id === "period" ? v.date : (v[id as keyof Invoice] as SortValue)));
    return (
        <div className="overflow-x-auto rounded-md border border-secondary">
            <table className={TABLE.table}>
                <thead>
                    <tr>
                        {INVOICE_COLUMNS.map(([id, label, right]) => (
                            <SortTh key={id} id={id} sort={sorted.sort} onSort={sorted.onSort} align={right ? "right" : "left"} className={th}>
                                {label}
                            </SortTh>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.rows.map((v, i) => (
                        <tr key={v.id} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                            <td className={td}>{v.id}</td>
                            <td className={td}>{shortDate(v.date)}</td>
                            <td className={td}>{v.period}</td>
                            <td className={cx(td, "text-right tabular-nums")}>{usd(v.amount)}</td>
                            <td className={td}>{v.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EMBEDS: Record<FinancePage, () => ReactNode> = {
    payee: () => <PayeeEmbed />,
    payments: () => <PaymentsEmbed />,
    invoices: () => <InvoicesEmbed />,
};

export const FinanceScreen = ({ page, permission = true }: { page: FinancePage; permission?: boolean }) => (
    <DasShell navKey={NAV_KEYS[page]} title={FINANCE_TITLES[page]}>
        <div className="px-8 py-8">
            {permission ? <ProviderFrame>{EMBEDS[page]()}</ProviderFrame> : <p className="text-md text-tertiary">{NO_PERMISSION}</p>}
        </div>
    </DasShell>
);
