/**
 * Writes the monday.com import file for the transition list.
 *
 *   npm run monday:export
 *
 * Reads src/pages/transition/data.ts (the same list Storybook › Transition shows) and
 * writes monday/out/board-import.csv: the subitems of a round's item on the board. One
 * row per area of the round, named with the IDs of its changes, plus the steps other
 * teams owe. Product keeps the board to a few epics; the change-by-change list is Storybook's.
 *
 * monday.com cannot import subitems directly, so it takes two moves:
 *   1. New item ▾ → Import items, into the round's group. Every row becomes an item.
 *   2. Tick the new items → Convert → to subitem → choose the round's item
 *      (e.g. "Style updates - Round 1") → match Owner to Owner.
 * Converting drops any column the subitems don't have, so the file carries only Name and Owner.
 *
 * The repo is public, so the list names roles, not people. To fill the Owner column, put
 * the names as monday.com shows them in monday/people.json (not committed):
 *
 *   { "Product": "…", "Engineering": "…", "Design": "…" }
 *
 * Needs Node 23.6 or later (it reads the .ts file directly).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ITEMS, ROUNDS, STEPS, areasOf } from "../src/pages/transition/data.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const peopleFile = join(root, "monday", "people.json");
const people = existsSync(peopleFile) ? JSON.parse(readFileSync(peopleFile, "utf8")) : {};
const owner = (role) => people[role] ?? role;

const COLUMNS = ["Name", "Owner"];

const rows = ROUNDS.flatMap((round) => {
    const steps = STEPS.filter((s) => s.round === round.name && s.board).map((s) => [s.board, owner(s.owner)]);
    const areas = areasOf(round.name).map((area) => {
        const ids = ITEMS.filter((i) => i.round === round.name && i.area === area).map((i) => i.id);
        return [`${area} (${ids.join(", ")})`, owner("Design")];
    });
    return [...steps.slice(0, 1), ...areas, ...steps.slice(1)];
});

const cell = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const out = join(root, "monday", "out");
mkdirSync(out, { recursive: true });
const file = join(out, "board-import.csv");
writeFileSync(file, [COLUMNS, ...rows].map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n", "utf8");
console.log(`${file}  (${rows.length} rows)`);
if (!existsSync(peopleFile)) console.log("No monday/people.json: the Owner column holds roles, not names.");
