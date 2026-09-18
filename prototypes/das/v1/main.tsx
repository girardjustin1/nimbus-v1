import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrototypeApp } from "../../shared/prototype-frame";
import "../../shared/prototype.css";
import { meta } from "../versions";
import { screens } from "./screens";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrototypeApp meta={meta("v1")} screens={screens} />
    </StrictMode>,
);
