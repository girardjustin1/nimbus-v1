import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setDasNavItems } from "../../das/v1/screens/das-nav";
import { type ProtoScreen, PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { meta } from "../versions";
import { screens } from "./screens";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS } from "./screens/nav";
import { ScenarioControls } from "./screens/reporting/insights/scenario-ui";

// Screens reused from DAS v1 get the DAS links too.
setDasNavItems(V3_NAV_ITEMS);

// The copy deck covers the campaign setup form: every screen that renders <CampaignSetup>.
const copyDeckCovers = (s: ProtoScreen) => /^(setup|step|rail)-/.test(s.id) && s.id !== "setup-published";
// Round 2: every concept screen (c0-…, c16-…) takes a data scenario from the toolbar.
const isConcept = (s: ProtoScreen) => /^c\d+-/.test(s.id);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp
            meta={meta("v2")}
            screens={screens}
            toolbarExtras={(s) => (copyDeckCovers(s) ? <CopyDeckControls /> : isConcept(s) ? <ScenarioControls /> : null)}
        />
    </StrictMode>,
);
