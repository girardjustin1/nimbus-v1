import { describe, expect, it } from "vitest";
import { validateMarkup } from "./asset-data";

const GOOD = `<div id="autumn-mrec" style="width:300px;height:250px">
  <a href="https://example.com/click?cid=10482" target="_blank">
    <img src="https://cdn.example.com/300x250-autumn.png" width="300" height="250" alt="Autumn sale" />
  </a>
</div>`;

const BAD = `<div id="autumn-mrec"
  <a href=https://example.com/click?cid=10482>
    <img src="http://cdn.example.com/300x250.png?cb=\${CACHEBUSTER}" alt="" />
  </a>
  <script>document.write('<img src="https://track.example.com/imp" />');</script>
</div>`;

describe("validateMarkup", () => {
    it("passes clean HTML", () => {
        expect(validateMarkup(GOOD, "HTML")).toEqual([]);
    });
    it("locates every problem in bad HTML", () => {
        const r = validateMarkup(BAD, "HTML");
        console.log(r.map((i) => `L${i.line} ${i.severity}: ${i.message}`).join("\n"));
        expect(r.find((i) => i.line === 1 && /never closed/.test(i.message))).toBeTruthy();
        expect(r.find((i) => i.line === 2 && /isn't in quotes/.test(i.message))).toBeTruthy();
        expect(r.find((i) => i.line === 3 && /Macros/.test(i.message))).toBeTruthy();
        expect(r.find((i) => i.line === 3 && i.severity === "warning")).toBeTruthy();
        expect(r.find((i) => i.line === 5 && /document\.write/.test(i.message))).toBeTruthy();
    });
    it("flags unclosed elements", () => {
        const r = validateMarkup(`<div>\n  <span>hi\n</div>`, "HTML");
        console.log("UNCLOSED:", r.map((i) => `L${i.line}: ${i.message}`).join(" | "));
        expect(r.length).toBeGreaterThan(0);
    });
    it("rejects wrapped VAST and reports the line", () => {
        const r = validateMarkup(`<VAST>\n  <Ad id="x">\n    <Wrapper>\n      <VASTAdTagURI>https://a.example/vast?cb=[CACHEBUSTER]</VASTAdTagURI>\n    </Wrapper>\n  </Ad>\n</VAST>`, "VAST (xml)");
        console.log("VAST:", r.map((i) => `L${i.line} ${i.severity}: ${i.message}`).join("\n"));
        expect(r.find((i) => i.line === 3 && /wrapped/.test(i.message))).toBeTruthy();
        expect(r.find((i) => /version attribute/.test(i.message))).toBeTruthy();
    });
    it("passes clean VAST", () => {
        const r = validateMarkup(`<VAST version="4.0">\n  <Ad id="s">\n    <InLine><AdTitle>S</AdTitle></InLine>\n  </Ad>\n</VAST>`, "VAST (xml)");
        console.log("GOOD VAST:", JSON.stringify(r));
        expect(r).toEqual([]);
    });
    it("catches type mismatch", () => {
        expect(validateMarkup(`<VAST version="4.0"><Ad id="a"/></VAST>`, "HTML")[0].message).toMatch(/Ad Type is set to HTML/);
    });
    it("reports empty", () => {
        expect(validateMarkup("   ", "HTML")[0].message).toMatch(/Nothing to check/);
    });
});
