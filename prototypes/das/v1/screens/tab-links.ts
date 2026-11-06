/**
 * Links for page tabs that v1 shows as labels.
 *
 * v1 was reviewed with its reporting tabs ("Saved Queries", "New Query") as labels only,
 * and stays that way. A later version that reuses those screens sets links for them once,
 * from its entry point — v6 points them at its own Saved Queries and query builder — the
 * same way das-nav.ts lets a version link the sidebar. Each prototype is its own page and
 * module instance, so one version's links never reach another.
 */
let links: Record<string, string> = {};

export const setTabLinks = (next: Record<string, string>) => {
    links = next;
};

export const tabLink = (label: string): string | undefined => links[label];
