import type { ProtoScreen } from "../../../../shared/prototype-frame";
import { buyersScreens } from "./buyers";
import { dashboardScreens } from "./dashboard";
import { insightsScreens } from "./insights";

/** Reporting, in sidebar order: key metrics and realtime, Performance Insights, buyer breakdown and benchmarks. */
export const reportingScreens: ProtoScreen[] = [...dashboardScreens, ...insightsScreens, ...buyersScreens];
