import type { ProtoScreen } from "../../../../shared/prototype-frame";
import { FinanceScreen } from "./finance";
import { SdksPage } from "./sdks";
import { ReportingApiSettings, SignInSettings } from "./settings";

const s =
    (area: string) =>
    (screen: Omit<ProtoScreen, "area">): ProtoScreen => ({ area, ...screen });

const sdks = s("SDK & Docs · SDKs");
const payee = s("Finance · Payee registration");
const payments = s("Finance · Payment history");
const invoices = s("Finance · Invoice history");
const signIn = s("Settings · Sign in");
const api = s("Settings · Reporting API");

/** SDK & Docs, Finance and Settings, in sidebar order. */
export const accountScreens: ProtoScreen[] = [
    sdks({ id: "sdks", title: "Nimbus SDKs", render: () => <SdksPage /> }),

    payee({
        id: "finance-payee",
        title: "Payee registration",
        description: "The payments provider's frame, embedded.",
        render: () => <FinanceScreen page="payee" />,
    }),
    payee({ id: "finance-payee-no-permission", title: "Payee registration · no permission", render: () => <FinanceScreen page="payee" permission={false} /> }),
    payments({
        id: "finance-payments",
        title: "Payment history",
        description: "The payments provider's frame, embedded.",
        render: () => <FinanceScreen page="payments" />,
    }),
    payments({
        id: "finance-payments-no-permission",
        title: "Payment history · no permission",
        render: () => <FinanceScreen page="payments" permission={false} />,
    }),
    invoices({
        id: "finance-invoices",
        title: "Invoice history",
        description: "The payments provider's frame, embedded.",
        render: () => <FinanceScreen page="invoices" />,
    }),
    invoices({
        id: "finance-invoices-no-permission",
        title: "Invoice history · no permission",
        render: () => <FinanceScreen page="invoices" permission={false} />,
    }),

    signIn({ id: "settings", title: "Sign In", render: () => <SignInSettings /> }),
    api({ id: "settings-api", title: "Reporting API", render: () => <ReportingApiSettings /> }),
];
