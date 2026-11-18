import { createContext } from "react";

/**
 * The two summary-card looks Product allowed in the 27 Oct review — no third style:
 *
 *   contained  a card with a border: the key metrics dashboard's card, scaled down (bold
 *              black title, black value, a light rule and a soft shadow, square corners).
 *   flat       no border: the realtime dashboard's stat blocks (small uppercase label, teal
 *              value) divided by a vertical rule.
 *
 * "If they are contained, let's do them closer to this. If they are not, then let's do
 * them like this. You can decide what you think looks better." v5 uses `contained`: the
 * Campaigns cards are filters you click, and a card reads as something to press. The
 * Oct 26 stories render both side by side.
 */
export type StatLook = "contained" | "flat";

export const StatLookContext = createContext<StatLook>("contained");
