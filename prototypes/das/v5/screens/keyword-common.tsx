import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import { TEAL } from "./das-shell";
import { PageTabs } from "./nimbus-ui";

const SOURCE_TONE = "#1F7F80";

/**
 * Chrome shared by every Manage keywords screen.
 *
 * FROM THE CHARTER: the integration guide below is the charter's own content — the
 * RTB fields, the comma-separated format, the collapse into one matching list, the
 * case-insensitive match, remote config as the one supported integration pattern,
 * and the fact that Nimbus will not host a config endpoint (it is listed out of scope as
 * "would effectively be a lightweight ad server").
 *
 * DESIGN DECISIONS: two tabs, like the asset screens. A third, Keyword Health, was killed
 * in the 27 Oct review ("I don't understand what any of this even is"), and with it every
 * traffic readout — real-time traffic per keyword is unrealistic. Sub-pages (detail,
 * bulk add) keep their parent tab lit; since 27 Oct they go back through the campaign
 * overview's breadcrumb strip ("Keywords : sports"), like every detail page.
 *
 * Everything here is our wording. Keywords do not exist in DAS today.
 */

/* ----------------------------------------------------------------- Banner --- */

/** Everything on these pages is our wording — keywords have no presence in DAS today. */

/* ------------------------------------------------------------------- Tabs --- */

export type KeywordTab = "setup" | "view";

const TABS: { id: KeywordTab; label: string; href: string }[] = [
    { id: "setup", label: "Keyword Setup", href: "#/keyword-setup" },
    { id: "view", label: "View All Keywords", href: "#/keyword-view" },
];

/** 26 Oct: rendered by the shared PageTabs, so keyword tabs match assets and staging. */
export const KeywordTabs = ({ active }: { active: KeywordTab }) => <PageTabs tabs={TABS} active={active} />;

/* ------------------------------------------------------------------ Bits --- */

export const Card = ({ title, trailing, children, className }: { title?: ReactNode; trailing?: ReactNode; children: ReactNode; className?: string }) => (
    <section className={cx("flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary", className)}>
        {(title || trailing) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
                {title && <h2 className="text-lg font-extrabold text-primary">{title}</h2>}
                {trailing}
            </div>
        )}
        {children}
    </section>
);

/* ------------------------------------------------------- Integration guide --- */

const SAMPLE_REQUEST = `{
  "user":    { "keywords": "sports,over21,power-user" },
  "app":     { "keywords": "sample-app,sports-vertical" },
  "content": { "keywords": "nfl,week-4" }
}`;

/**
 * Remote config only.
 *
 * We had offered three ways in — remote config, hardcoded, server-side — and presenting
 * them as equals invited a publisher to pick the one that would hurt later. Hardcoded
 * keywords need an app release to change, which makes a targeting mistake a two-week
 * fix. The charter picked remote config; so do we, and we say why rather than listing
 * alternatives we would talk someone out of.
 */
const PATTERNS: { name: string; blurb: string; recommended?: boolean }[] = [
    {
        name: "Remote config",
        blurb: "Fetch the keywords at runtime from Firebase Remote Config, LaunchDarkly or your own endpoint. Values change without shipping an app release, so a targeting change is live the same day.",
        recommended: true,
    },
];

/**
 * The integration guidance the charter implies: what Nimbus reads, how it matches, and
 * how a publisher populates it. Shown on the empty state, where the answer to "why is
 * nothing happening" is usually "the keywords aren't arriving".
 */
export const IntegrationGuide = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
            <h3 className="text-md font-bold text-primary">How keywords reach Nimbus</h3>
            <p className="max-w-3xl text-md text-tertiary">
                Your app sends a comma-separated list on <code className="font-mono text-md">user.keywords</code>,{" "}
                <code className="font-mono text-md">app.keywords</code> or <code className="font-mono text-md">content.keywords</code>. Nimbus collapses all
                three into one list and matches a campaign if any of its keywords is in it. Matching is exact and case-insensitive —{" "}
                <code className="font-mono text-md">Sports</code> and <code className="font-mono text-md">sports</code> are the same keyword. Nimbus never
                derives or infers a keyword; you decide what to send.
            </p>
        </div>

        {!compact && (
            <pre className="overflow-x-auto rounded-xl bg-secondary p-4 font-mono text-md text-secondary">
                <code>{SAMPLE_REQUEST}</code>
            </pre>
        )}

        <div className="flex flex-col gap-2">
            <h3 className="text-md font-bold text-primary">Three ways to populate them</h3>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {PATTERNS.map((p) => (
                    <li key={p.name} className="flex flex-col gap-1.5 rounded-xl border border-secondary p-4">
                        <span className="flex items-center gap-2 text-md font-semibold text-primary">
                            {p.name}
                            {p.recommended && (
                                <span
                                    className="rounded-full px-2 py-0.5 text-md font-bold uppercase"
                                    style={{ color: SOURCE_TONE, backgroundColor: `${TEAL}1f` }}
                                >
                                    Recommended
                                </span>
                            )}
                        </span>
                        <span className="text-md text-tertiary">{p.blurb}</span>
                    </li>
                ))}
            </ul>
        </div>

        <p className="max-w-3xl text-md text-tertiary">
            Nimbus is not an ad server and does not host the config itself — wherever the values live, they stay yours.
        </p>
    </div>
);
