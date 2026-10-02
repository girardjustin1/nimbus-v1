import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { setDasNavItems } from "../v1/screens/das-nav";
import { meta } from "../versions";
import { V2_NAV_ITEMS } from "./screens/nav";
import { screens } from "./screens";

// Every v2 screen gets a nav that links to v2 screens, including the ones reused from v1.
setDasNavItems(V2_NAV_ITEMS);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp meta={meta("v2")} screens={screens} />
    </StrictMode>,
);
