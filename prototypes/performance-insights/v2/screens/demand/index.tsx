import type { ProtoScreen } from "../../../../shared/prototype-frame";
import { ManageActiveDemand } from "./active-demand";
import { ConfigureDemand, ConfigurePartner } from "./configure-demand";
import { ERROR_PARTNER } from "./demand-data";
import { NplusPayments } from "./nplus-payments";

/** Demand — configure demand, manage active demand, manage active n+ demand, n+ payments (reference/111326). */
const s =
    (area: string) =>
    (screen: Omit<ProtoScreen, "area">): ProtoScreen => ({ area, ...screen });

const configure = s("Demand · Configure demand");
const active = s("Demand · Manage active demand");
const nplus = s("Demand · Manage active n+ demand");
const payments = s("Demand · n+ payments");

export const demandScreens: ProtoScreen[] = [
    configure({
        id: "demand-configure",
        title: "Partners",
        description: "Every demand partner, with its draft and publish state. A name opens its configuration.",
        render: () => <ConfigureDemand />,
    }),
    configure({
        id: "demand-configure-partner",
        title: "Partner configuration",
        description: "Nimbus+, endpoints by geo, additional configuration data and whitelisted geos.",
        render: () => <ConfigurePartner />,
    }),
    configure({
        id: "demand-configure-error",
        title: "Configuration error",
        description: "A partner with no demand template: the configuration can't load.",
        render: () => <ConfigurePartner partner={ERROR_PARTNER} />,
    }),
    active({
        id: "demand-active",
        title: "Integrated demand partners",
        description: "Enabled toggles, impression caps and third-party viewability.",
        render: () => <ManageActiveDemand />,
    }),
    nplus({
        id: "demand-nplus",
        title: "Integrated Nimbus+ demand partners",
        description: "Nimbus+ partners: enabled, impression cap, placements.",
        render: () => <ManageActiveDemand nplus />,
    }),
    payments({
        id: "nplus-payments",
        title: "Overview",
        description: "Payments not yet made, by month, with expected payment dates.",
        render: () => <NplusPayments />,
    }),
    payments({
        id: "nplus-payments-completed",
        title: "Completed Payments",
        description: "Payments made, by month.",
        render: () => <NplusPayments tab="completed" />,
    }),
    payments({
        id: "nplus-payments-completed-empty",
        title: "Completed Payments · empty",
        description: "No completed payments yet.",
        render: () => <NplusPayments tab="completed" months={[]} />,
    }),
];
