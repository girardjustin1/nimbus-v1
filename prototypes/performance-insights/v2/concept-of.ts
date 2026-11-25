/** The concept a screen belongs to: c16-… is C16; today's Performance Insights screens (pi-…) are C0's. */
export const conceptOf = (id: string): number | null => {
    const m = id.match(/^c(\d+)-/);
    if (m) return Number(m[1]);
    return id.startsWith("pi-") ? 0 : null;
};
