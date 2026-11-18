import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setDasNavItems } from "../../das/v1/screens/das-nav";
import { type ProtoScreen, PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { meta } from "../versions";
import { screens } from "./screens";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS } from "./screens/nav";

// Screens reused from DAS v1 get the DAS links too.
setDasNavItems(V3_NAV_ITEMS);

// The copy deck covers the campaign setup form: every screen that renders <CampaignSetup>.
const copyDeckCovers = (s: ProtoScreen) => /^(setup|step|rail)-/.test(s.id) && s.id !== "setup-published";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp meta={meta("v2")} screens={screens} toolbarExtras={(s) => (copyDeckCovers(s) ? <CopyDeckControls /> : null)} />
    </StrictMode>,
);
