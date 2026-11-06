import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { type ProtoScreen, PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { setDasNavItems } from "../v1/screens/das-nav";
import { meta } from "../versions";
import { screens } from "./screens";
import { ChartPicker } from "./screens/chart-picker-ui";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS } from "./screens/nav";

// Every v3 screen gets a nav that links to v3 screens, including the ones reused from v1.
setDasNavItems(V3_NAV_ITEMS);

// The copy deck covers the campaign setup form: every screen that renders <CampaignSetup>.
const copyDeckCovers = (s: ProtoScreen) => /^(setup|step|rail)-/.test(s.id) && s.id !== "setup-published";
// 6 Nov: the Chart menu sits on every campaign overview, to compare the Delivery chart concepts in the page.
const showsDeliveryChart = (s: ProtoScreen) => /^view-a(-|$)/.test(s.id);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp
            meta={meta("v6")}
            screens={screens}
            toolbarExtras={(s) => (copyDeckCovers(s) ? <CopyDeckControls /> : showsDeliveryChart(s) ? <ChartPicker /> : null)}
        />
    </StrictMode>,
);
