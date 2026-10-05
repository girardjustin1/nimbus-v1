import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrototypeApp, type ProtoScreen } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { setDasNavItems } from "../v1/screens/das-nav";
import { meta } from "../versions";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS } from "./screens/nav";
import { screens } from "./screens";

// Every v3 screen gets a nav that links to v3 screens, including the ones reused from v1.
setDasNavItems(V3_NAV_ITEMS);

// The copy deck covers the campaign setup form: every screen that renders <CampaignSetup>.
const copyDeckCovers = (s: ProtoScreen) => /^(setup|step|rail)-/.test(s.id) && s.id !== "setup-published";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp meta={meta("v3")} screens={screens} toolbarExtras={(s) => (copyDeckCovers(s) ? <CopyDeckControls /> : null)} />
    </StrictMode>,
);
