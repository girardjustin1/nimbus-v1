import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Plugin, defineConfig } from "vite";

/**
 * Standalone prototypes — one multi-page Vite build, separate from Storybook.
 *
 * Every `prototypes/<name>/index.html` (redirect to latest) and
 * `prototypes/<name>/<version>/index.html` (a frozen version) is discovered
 * automatically, so cutting a new version never needs a config change.
 * Output mirrors the folder layout: <outDir>/das/v1/index.html, …
 */

const root = path.dirname(fileURLToPath(import.meta.url));

const isDir = (p: string) => statSync(p).isDirectory();

const pages: Record<string, string> = {};
for (const proto of readdirSync(root)) {
    const protoDir = path.join(root, proto);
    if (proto === "shared" || proto === "node_modules" || !isDir(protoDir)) continue;
    pages[proto] = path.join(protoDir, "index.html");
    for (const version of readdirSync(protoDir)) {
        const versionDir = path.join(protoDir, version);
        if (/^v\d+$/.test(version) && isDir(versionDir)) pages[`${proto}-${version}`] = path.join(versionDir, "index.html");
    }
}


/**
 * Dev server only: Performance Insights' real filter lists, read from staging into
 * reference/112526/raw (gitignored: real publisher names). Served at
 * /__local/pi-filter-values.json so C0's filter panel can show them on this machine.
 * Never part of a build (apply: "serve"), never committed; without the folder the
 * endpoint answers 404 and the prototype keeps its sample data.
 */
const localStagingLists = (): Plugin => {
    const dir = path.resolve(root, "../reference/112526/raw");
    let cache: string | null = null;
    const build = () => {
        type Asset = { label: string; values: Record<string, Record<string, string>>; hierarchy?: { label: string; value_key: string; label_key?: string; is_root?: boolean }[] };
        const index: { name: string }[] = JSON.parse(readFileSync(path.join(dir, "index.json"), "utf8"));
        const out: Record<string, { values: string[]; group?: { label: string; of: Record<string, string> } }> = {};
        for (const { name } of index.slice(1)) {
            const d = JSON.parse(readFileSync(path.join(dir, name), "utf8"));
            const a: Asset = d.assets[d.display[0]];
            const parent = a.hierarchy?.find((h) => !h.is_root);
            const values = [...new Set(Object.entries(a.values).map(([k, v]) => v.label ?? k))].sort((x, y) => x.localeCompare(y));
            const of: Record<string, string> = {};
            if (parent) for (const [k, v] of Object.entries(a.values)) of[v.label ?? k] = v[parent.label_key ?? parent.value_key] ?? "Other";
            out[a.label] = parent ? { values, group: { label: parent.label, of } } : { values };
        }
        return JSON.stringify(out);
    };
    return {
        name: "local-staging-lists",
        apply: "serve",
        configureServer(server) {
            server.middlewares.use("/__local/pi-filter-values.json", (_req, res) => {
                if (!existsSync(path.join(dir, "index.json"))) {
                    res.statusCode = 404;
                    return res.end();
                }
                cache ??= build();
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Cache-Control", "no-store");
                res.end(cache);
            });
        },
    };
};

export default defineConfig({
    root,
    // Relative asset URLs: the same build works under /nimbus-v1/ on GitHub Pages and locally.
    base: "./",
    plugins: [react(), tailwindcss(), localStagingLists()],
    resolve: {
        alias: { "@": path.resolve(root, "../src") },
    },
    server: { port: 5195, strictPort: true },
    build: {
        outDir: path.resolve(root, "../dist-prototypes"),
        emptyOutDir: true,
        // Storybook already owns /assets in the Pages artifact; keep prototype bundles separate.
        assetsDir: "prototype-assets",
        rollupOptions: { input: pages },
    },
});
