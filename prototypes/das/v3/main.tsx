import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { setDasNavItems } from "../v1/screens/das-nav";
import { meta } from "../versions";
import { V3_NAV_ITEMS } from "./screens/nav";
import { screens } from "./screens";

// Every v3 screen gets a nav that links to v3 screens, including the ones reused from v1.
setDasNavItems(V3_NAV_ITEMS);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp meta={meta("v3")} screens={screens} />
    </StrictMode>,
);
