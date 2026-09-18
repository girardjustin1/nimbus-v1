import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

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

export default defineConfig({
    root,
    // Relative asset URLs: the same build works under /nimbus-v1/ on GitHub Pages and locally.
    base: "./",
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { "@": path.resolve(root, "../src") },
    },
    server: { port: 5190, strictPort: true },
    build: {
        outDir: path.resolve(root, "../dist-prototypes"),
        emptyOutDir: true,
        // Storybook already owns /assets in the Pages artifact; keep prototype bundles separate.
        assetsDir: "prototype-assets",
        rollupOptions: { input: pages },
    },
});
