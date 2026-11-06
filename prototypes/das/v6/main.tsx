import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setNavSectionsOverride } from "../../performance-insights/v1/screens/nav-override";
import { type ProtoScreen, PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { setDasNavItems } from "../v1/screens/das-nav";
import { setTabLinks } from "../v1/screens/tab-links";
import { meta } from "../versions";
import { screens } from "./screens";
import { ChartPicker } from "./screens/chart-picker-ui";
import { CopyDeckControls } from "./screens/copy-deck-ui";
import { V3_NAV_ITEMS, V6_NAV_SECTIONS } from "./screens/nav";

// Every v3 screen gets a nav that links to v3 screens, including the ones reused from v1.
setDasNavItems(V3_NAV_ITEMS);
// The early Performance Insights screens (section 7) bring their own shell; give it v6's
// linked nav so their sidebar leads back to DAS instead of dead-ending.
setNavSectionsOverride(V6_NAV_SECTIONS);
// DAS Round 1's reporting screens (section 7) were reviewed with label-only tabs; in v6
// they lead to the Saved Queries concept and back to the query builder.
setTabLinks({ "Saved Queries": "#/saved", "New Query": "#/reporting-builder" });

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
