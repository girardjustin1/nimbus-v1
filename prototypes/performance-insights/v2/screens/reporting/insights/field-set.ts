import { type ReactNode, createContext, createElement, useContext } from "react";
import { AUCTION_DIMS, AUCTION_METRICS, type Dim, type Metric, STAGING_DIMS, STAGING_METRICS } from "./insights-data";

/**
 * v2 · Round 2 (25 Nov): which metrics and breakdowns a screen offers. C0 is staging's
 * control and keeps staging's 13 metrics and 28 breakdowns; every concept offers the
 * auction traffic spec's fuller set (reference/112626). Screens read it with useFields().
 */
export interface FieldSet {
    metrics: readonly Metric[];
    dims: readonly Dim[];
}

export const STAGING_FIELDS: FieldSet = { metrics: STAGING_METRICS, dims: STAGING_DIMS };
export const AUCTION_FIELDS: FieldSet = { metrics: AUCTION_METRICS, dims: AUCTION_DIMS };

const FieldsContext = createContext<FieldSet>(STAGING_FIELDS);

export const FieldsProvider = ({ fields, children }: { fields: FieldSet; children: ReactNode }) =>
    createElement(FieldsContext.Provider, { value: fields }, children);

export const useFields = () => useContext(FieldsContext);
