import type { ReactNode } from "react";
import { ArrowLeft, Download01 } from "@untitledui/icons";
import { Button } from "./type-rules";
import { cx } from "@/utils/cx";
import { TEAL } from "./das-shell";
import type { IntegrationPattern, KeywordSource } from "./keyword-data";

/**
 * Chrome shared by every Manage keywords screen.
 *
 * FROM THE CHARTER: the integration guide below is the charter's own content — the
 * RTB fields, the comma-separated format, the collapse into one matching list, the
 * case-insensitive match, remote config as the one supported integration pattern,
 * and the fact that Nimbus will not host a config endpoint (it is listed out of scope as
 * "would effectively be a lightweight ad server"). The reporting note restates the
 * charter's guardrail verbatim in intent: aggregate on screen, per-keyword via CSV/API,
 * no per-keyword charting.
 *
 * DESIGN DECISIONS: the third tab ("Keyword Health") has no counterpart on the asset
 * screens — it exists because a keyword, unlike a creative, can be perfectly valid and
 * still never match anything, and nothing else in DAS would tell you. Sub-pages (detail,
 * bulk add) keep their parent tab lit and add a back link rather than a breadcrumb, so
 * the two-level structure stays as shallow as Manage assets.
 *
 * Everything here is our wording. Keywords do not exist in DAS today.
 */

/* ----------------------------------------------------------------- Banner --- */

/** Everything on these pages is our wording — keywords have no presence in DAS today. */

/* ------------------------------------------------------------------- Tabs --- */

export type KeywordTab = "setup" | "view" | "health";

const TABS: { id: KeywordTab; label: string; href: string }[] = [
    { id: "setup", label: "Keyword Setup", href: "#/keyword-setup" },
    { id: "view", label: "View All Keywords", href: "#/keyword-view" },
    { id: "health", label: "Keyword Health", href: "#/keyword-health" },
];

export const KeywordTabs = ({ active }: { active: KeywordTab }) => (
    <div className="flex border-b border-secondary px-8">
        {TABS.map((t) => (
            <a
                key={t.id}
                href={t.href}
                aria-current={active === t.id ? "page" : undefined}
                className={cx("-mb-px border-b-2 px-6 py-4 text-md font-semibold transition-colors", active === t.id ? "border-current" : "border-transparent hover:opacity-80")}
                style={{ color: TEAL, backgroundColor: active === t.id ? `${TEAL}14` : undefined }}
            >
                {t.label}
            </a>
        ))}
    </div>
);

/** Back link for a sub-page of a tab (keyword detail, bulk add). */
export const BackLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href} className="inline-flex w-fit items-center gap-1.5 text-md font-semibold transition-opacity hover:opacity-80" style={{ color: TEAL }}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        {children}
    </a>
);

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

/** One aggregate number. Aggregates are the only thing the charter lets us put on screen. */
export const Metric = ({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "warning" | "good" }) => (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl bg-primary p-4 ring-1 ring-secondary">
        <span className="text-md font-semibold tracking-wide text-tertiary uppercase">{label}</span>
        <span className={cx("text-display-xs font-semibold", tone === "warning" ? "text-warning-primary" : "text-primary")} style={tone === "good" ? { color: "#1F7F80" } : undefined}>
            {value}
        </span>
        {hint && <span className="text-md text-tertiary">{hint}</span>}
    </div>
);

const SOURCE_TONE = "#1F7F80";

/** Which RTB field a keyword arrived on. Diagnostic only — matching ignores the source. */
export const SourceChips = ({ sources }: { sources: KeywordSource[] }) =>
    sources.length === 0 ? (
        <span className="text-md text-warning-primary">None arriving</span>
    ) : (
        <span className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
                <code key={s} className="rounded-md px-1.5 py-0.5 font-mono text-md" style={{ color: SOURCE_TONE, backgroundColor: `${TEAL}1f` }}>
                    {s}
                </code>
            ))}
        </span>
    );

/**
 * What Keyword Health infers from traffic, which is a different question from what we
 * recommend. An app that hardcoded its keywords before we said not to still shows up
 * that way, and the publisher needs to see it.
 */
const PATTERN_NOTE: Record<IntegrationPattern, string> = {
    "Remote config": "Values update without an app release. The supported pattern.",
    Hardcoded: "Values look fixed per app version — changing them needs a release. Move this app to remote config.",
    "Server-side": "Your server sets the keywords before the request leaves.",
    "Not detected": "No keywords have arrived from this app.",
};

export const PatternBadge = ({ pattern }: { pattern: IntegrationPattern }) => (
    <span
        title={PATTERN_NOTE[pattern]}
        className="inline-flex w-fit items-center rounded-md px-2 py-0.5 text-md font-semibold whitespace-nowrap"
        style={
            pattern === "Not detected"
                ? { color: "#B54708", backgroundColor: "#FEF0C7" }
                : pattern === "Remote config"
                  ? { color: SOURCE_TONE, backgroundColor: `${TEAL}1f` }
                  : { color: "#475467", backgroundColor: "#F2F4F7" }
        }
    >
        {pattern}
    </span>
);

/** The charter's reporting guardrail, said out loud wherever we show a number. */
export const ReportingGuardrail = ({ className }: { className?: string }) => (
    <p className={cx("text-md text-tertiary", className)}>
        Counts here are request volume — how often a keyword reaches Nimbus. Impressions, revenue and fill rate are reported per campaign, and per keyword only in the CSV export
        or the API. Keywords are never charted.
    </p>
);

export const ExportCsv = ({ label = "Export CSV" }: { label?: string }) => (
    <Button color="secondary" size="sm" iconLeading={Download01} className="uppercase">
        {label}
    </Button>
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
 * how a publisher populates it. Shown on the empty state and on Keyword
 * Health, because both are places where the answer to "why is nothing happening" is
 * usually "the keywords aren't arriving".
 */
export const IntegrationGuide = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
            <h3 className="text-md font-bold text-primary">How keywords reach Nimbus</h3>
            <p className="max-w-3xl text-md text-tertiary">
                Your app sends a comma-separated list on <code className="font-mono text-md">user.keywords</code>, <code className="font-mono text-md">app.keywords</code> or{" "}
                <code className="font-mono text-md">content.keywords</code>. Nimbus collapses all three into one list and matches a campaign if any of its keywords is in it.
                Matching is exact and case-insensitive — <code className="font-mono text-md">Sports</code> and <code className="font-mono text-md">sports</code> are the same
                keyword. Nimbus never derives or infers a keyword; you decide what to send.
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
                                <span className="rounded-full px-2 py-0.5 text-md font-bold uppercase" style={{ color: SOURCE_TONE, backgroundColor: `${TEAL}1f` }}>
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
            Nimbus is not an ad server and does not host the config itself — wherever the values live, they stay yours. Keyword Health shows which pattern each of your apps looks
            like it is on, and whether anything is actually arriving.
        </p>
    </div>
);
