import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setDasNavItems } from "../../das/v1/screens/das-nav";
import { type ProtoScreen, PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { meta } from "../versions";
import { conceptOf } from "./concept-of";
import { ConceptPicker } from "./concept-picker";
import { screens } from "./screens";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS } from "./screens/nav";
import { CONCEPT_AREAS } from "./screens/reporting/insights";
import { ScenarioControls } from "./screens/reporting/insights/scenario-ui";

// Screens reused from DAS v1 get the DAS links too.
setDasNavItems(V3_NAV_ITEMS);

// The copy deck covers the campaign setup form: every screen that renders <CampaignSetup>.
const copyDeckCovers = (s: ProtoScreen) => /^(setup|step|rail)-/.test(s.id) && s.id !== "setup-published";
// Round 2: every concept screen (c0-…, c16-…) takes a data scenario from the toolbar.
const isConcept = (s: ProtoScreen) => /^c\d+-/.test(s.id);

// Round 2 holds only Performance Insights (owner, Nov 24): the concepts, and today's PI
// screens filed under C0, the control, as its edge cases. The other app screens are left out.
const C0_ORDER = ["c0-control", "c0-filter-panel", "c0-filter-country", "c0-filter-search", "c0-filter-unticked", "pi-query", "pi-query-line", "pi-query-area", "pi-query-bar", "pi-saved", "pi-saved-empty"];
const piScreens: ProtoScreen[] = screens
    .filter((s) => conceptOf(s.id) !== null)
    .map((s) => (s.id.startsWith("pi-") ? { ...s, area: CONCEPT_AREAS.control, title: `C0 · Today's ${s.title}` } : s))
    .map((s, i) => ({ s, i, c0: C0_ORDER.indexOf(s.id) }))
    .sort((a, b) => (a.c0 >= 0 ? a.c0 : 999) - (b.c0 >= 0 ? b.c0 : 999) || a.i - b.i)
    .map(({ s }) => s);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp
            meta={meta("v2")}
            screens={piScreens}
            picker={ConceptPicker}
            toolbarExtras={(s) => (copyDeckCovers(s) ? <CopyDeckControls /> : isConcept(s) ? <ScenarioControls /> : null)}
        />
    </StrictMode>,
);
