// Cut a generated icon sheet (SVG) into one SVG per icon.
//   [GAP=0.012] [FIT=icon] node scripts/split-icon-sheet.mjs <sheet.svg> <out-dir> <prefix> [names]
// Paths are grouped by overlapping bounding boxes (with a small margin); white and
// near-background shapes are dropped unless they sit on top of a grey shape (knockouts).
// Each icon gets its own viewBox (one cell size per sheet) and is recoloured to #AAAAAA.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const [sheet, outDir, prefix] = process.argv.slice(2); // optional 4th arg: comma-separated names, row-major
mkdirSync(outDir, { recursive: true });
const src = readFileSync(sheet, "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/, "");
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.setContent(`<body style="margin:0">${src}</body>`);
// How far apart (as a share of the sheet) two shapes can be and still be one icon.
const gap = Number(process.env.GAP ?? 0.012);
const icons = await p.evaluate((gap) => {
    const svg = document.querySelector("svg");
    const vb = svg.viewBox.baseVal;
    const area = vb.width * vb.height;
    const lum = (c) => { const m = /#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c || ""); if (!m) { const r = /rgb\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ""); return r ? (+r[1] + +r[2] + +r[3]) / 3 : 255; } return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3; };
    const els = [...svg.querySelectorAll("path,rect,circle,ellipse,polygon,polyline,line")].map((el) => {
        const cs = getComputedStyle(el);
        const fill = cs.fill === "none" ? null : cs.fill, stroke = cs.stroke === "none" ? null : cs.stroke;
        const bb = el.getBBox(); const m = el.getCTM && svg.getCTM() ? svg.getCTM().inverse().multiply(el.getCTM()) : null;
        const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => (m ? [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f] : [x, y]));
        const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
        const box = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
        const light = lum(fill || stroke) > 235;
        return { el, box, light, m, sw: parseFloat(cs.strokeWidth) || 0, fill, stroke };
    }).filter((e) => (e.box.x1 - e.box.x0) * (e.box.y1 - e.box.y0) < area * 0.5);
    const ink = els.filter((e) => !e.light);
    const pad = Math.max(vb.width, vb.height) * gap;
    const hit = (a, c) => a.x0 - pad < c.x1 && c.x0 - pad < a.x1 && a.y0 - pad < c.y1 && c.y0 - pad < a.y1;
    const parent = ink.map((_, i) => i); const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    for (let i = 0; i < ink.length; i++) for (let j = i + 1; j < ink.length; j++) if (hit(ink[i].box, ink[j].box)) parent[find(i)] = find(j);
    const groups = {}; ink.forEach((e, i) => (groups[find(i)] ??= []).push(e));
    const out = Object.values(groups).map((g) => {
        const box = g.reduce((a, e) => ({ x0: Math.min(a.x0, e.box.x0), y0: Math.min(a.y0, e.box.y0), x1: Math.max(a.x1, e.box.x1), y1: Math.max(a.y1, e.box.y1) }), { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
        // White shapes inside the icon are knockouts (e.g. a check cut from a disc).
        const knock = els.filter((e) => e.light && e.box.x0 >= box.x0 && e.box.x1 <= box.x1 && e.box.y0 >= box.y0 && e.box.y1 <= box.y1);
        const members = els.filter((e) => g.includes(e) || knock.includes(e));
        const body = members.map((e) => {
            const c = e.el.cloneNode(true);
            c.removeAttribute("style"); c.removeAttribute("class"); c.removeAttribute("id");
            if (e.m) c.setAttribute("transform", `matrix(${[e.m.a, e.m.b, e.m.c, e.m.d, e.m.e, e.m.f].map((v) => +v.toFixed(3)).join(" ")})`);
            c.setAttribute("fill", e.fill ? (e.light ? "#FFFFFF" : "#AAAAAA") : "none");
            if (e.stroke) { c.setAttribute("stroke", e.light ? "#FFFFFF" : "#AAAAAA"); c.setAttribute("stroke-width", String(e.sw)); } else c.removeAttribute("stroke");
            return c.outerHTML;
        }).join("");
        return { box, body, n: g.length };
    });
    return out.filter((o) => (o.box.x1 - o.box.x0) * (o.box.y1 - o.box.y0) > area * 0.0003);
}, gap);
// Row-major order: rows by centre y, then x.
const rowH = Math.max(...icons.map((i) => i.box.y1 - i.box.y0)) * 0.6;
icons.sort((a, c) => (Math.abs((a.box.y0 + a.box.y1) / 2 - (c.box.y0 + c.box.y1) / 2) < rowH ? a.box.x0 - c.box.x0 : a.box.y0 - c.box.y0));
// One cell size per sheet, so icons keep their size relative to each other (a dot
// stays a dot beside a check).
// FIT=icon instead fits every icon to its own square, so a set reads at one visual size
// (like an icon library) rather than at the sizes they were drawn on the sheet.
const cell = Math.max(...icons.map((ic) => Math.max(ic.box.x1 - ic.box.x0, ic.box.y1 - ic.box.y0))) * 1.08;
const fitEach = process.env.FIT === "icon";
const names = (process.argv[5] ?? "").split(",").filter(Boolean);
icons.forEach((ic, i) => {
    const w = ic.box.x1 - ic.box.x0, h = ic.box.y1 - ic.box.y0, s = fitEach ? Math.max(w, h) * 1.08 : cell;
    const x = ic.box.x0 - (s - w) / 2, y = ic.box.y0 - (s - h) / 2;
    const file = `${outDir}/${names[i] ?? `${prefix}-${String(i + 1).padStart(2, "0")}`}.svg`;
    writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${[x, y, s, s].map((v) => +v.toFixed(2)).join(" ")}" width="16" height="16">${ic.body}</svg>\n`);
});
console.log(`${prefix}: ${icons.length} icons`);
await b.close();
