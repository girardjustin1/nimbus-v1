/**
 * Colours and link helpers for Storybook's introduction pages (see ./ui.tsx).
 */

export const INK = "#101828";
export const BODY = "#475467";
export const MUTED = "#667085";
export const LINE = "#EAECF0";
export const PINK = "#DA6EA3";
export const PINK_DARK = "#A94579";
export const PINK_SOFT = "#FCE7F1";
export const TEAL = "#37B6B7";
export const TEAL_DARK = "#1F7F80";
export const TEAL_SOFT = "#E6F6F6";
export const WARM = "#FCFAF9";

const isLocal = () => typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

/** A prototype URL: `proto("app/v1", "pi-query")`. Local dev server when Storybook runs locally. */
export const proto = (path: string, screen = "") => `${isLocal() ? "http://localhost:5190/" : "./"}${path}/${screen ? `#/${screen}` : ""}`;
/** A Storybook page or story by id. */
export const story = (id: string) => `./?path=/${id.endsWith("--docs") ? "docs" : "story"}/${id}`;
