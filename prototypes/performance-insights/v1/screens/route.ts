/**
 * Hash query params for deep-linkable screen state: `#/explorer?rows=App&vals=Revenue`.
 * The prototype router matches only the part before "?", so params never change the screen.
 */

export const readHashParams = () => new URLSearchParams(window.location.hash.split("?")[1] ?? "");

/** Rewrite the params in place (no navigation, no scroll), keeping the screen id. */
export const writeHashParams = (params: Record<string, string | undefined>) => {
    const [path] = window.location.hash.split("?");
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) next.set(key, value);
    const query = next.toString().replace(/%2C/g, ",").replace(/\+/g, "%20");
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${path}${query ? `?${query}` : ""}`);
};
