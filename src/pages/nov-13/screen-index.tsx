import { screens } from "../../../prototypes/app/v1/screens";
import { Pill, protoUrl, td, th } from "./doc-ui";

/**
 * Every screen in the full application, itemised by area in sidebar order — read from the
 * prototype's own registry, so the list can't drift from what's built.
 */
export const ScreenIndex = () => {
    const areas = [...new Set(screens.map((s) => s.area))];
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0" }}>
            <thead>
                <tr>
                    <th style={th}>#</th>
                    <th style={th}>Area</th>
                    <th style={th}>Screen</th>
                    <th style={th}>Open</th>
                </tr>
            </thead>
            <tbody>
                {areas.flatMap((area) =>
                    screens
                        .filter((s) => s.area === area)
                        .map((s, i) => (
                            <tr key={s.id}>
                                <td style={{ ...td, color: "#98A2B3" }}>{screens.indexOf(s) + 1}</td>
                                <td style={{ ...td, fontWeight: 700, color: "#101828" }}>{i === 0 ? area : ""}</td>
                                <td style={td}>
                                    <div style={{ fontWeight: 600, color: "#101828" }}>{s.title}</div>
                                    {s.description && <div style={{ color: "#667085" }}>{s.description}</div>}
                                </td>
                                <td style={td}>
                                    <Pill href={protoUrl(s.id)}>Prototype</Pill>
                                </td>
                            </tr>
                        )),
                )}
            </tbody>
        </table>
    );
};

/** Screens per top-level area (the part of the area label before " · "). */
export const AreaCounts = () => {
    const counts = new Map<string, number>();
    for (const s of screens) {
        const top = s.area.split(" · ")[0];
        counts.set(top, (counts.get(top) ?? 0) + 1);
    }
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "12px 0" }}>
            {[...counts].map(([area, n]) => (
                <span key={area} style={{ background: "#F2F4F7", borderRadius: 10, padding: "8px 14px", fontSize: 15, color: "#344054" }}>
                    <b style={{ color: "#101828" }}>{area}</b> · {n} {n === 1 ? "screen" : "screens"}
                </span>
            ))}
            <span style={{ background: "#FCE7F1", borderRadius: 10, padding: "8px 14px", fontSize: 15, color: "#A94579", fontWeight: 700 }}>
                {screens.length} in all
            </span>
        </div>
    );
};
