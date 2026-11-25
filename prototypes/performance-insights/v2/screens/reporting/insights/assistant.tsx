import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowUp, BarChart10, CheckCircle, ChevronDown, Edit05, Stars02, XClose } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { TEAL_DARK } from "../../nimbus-ui";
import { QUESTIONS, type QuestionId, type ReportChange, matchQuestion } from "./assistant-questions";
import { BUILD_EXAMPLES, type BuildRequest, parseRequest } from "./chart-request";
import { type Dim, type Range, formatMetric } from "./insights-data";
import { changeOf, formatChange, moversBy, periodName, rowsBy } from "./report-facts";

/**
 * Performance Insights · Round 2 · C14: an AI layer beside the report (24 Nov).
 *
 * After the Linktree Insights assistant (Mobbin): a panel docked to the right that opens on
 * suggested questions, a question right under the chart, answers that show their steps and
 * then the figures, a conversation you can rename or start over.
 *
 * The middle step product asked for: the assistant suggests and the report does the work.
 * Every answer quotes only figures worked out from the report's own data (./report-facts),
 * and ends with “Show this in the report”, which sets the metrics, breakdown and chart. In
 * this prototype it answers three questions; anything else gets those three back.
 */

interface Answer {
    steps: string[];
    body: ReactNode;
    apply: { label: string; change: ReportChange };
    next: QuestionId[];
}

type Excluded = Partial<Record<Dim, string[]>>;

const B = ({ children }: { children: ReactNode }) => <b className="font-bold text-primary">{children}</b>;
const Trend = ({ v }: { v: number }) => <span style={{ color: v >= 0 ? TEAL_DARK : "#B42318", fontWeight: 700 }}>{formatChange(v)}</span>;

const answerOf = (q: QuestionId, range: Range, excluded: Excluded): Answer => {
    const period = periodName(range);
    if (q === "revenue") {
        const r = changeOf("Revenue", range, excluded);
        const platforms = rowsBy("Platform", "Revenue", range, excluded);
        const movers = moversBy("Demand Source", "Revenue", range, excluded, 3);
        return {
            steps: ["Reading this report", `Comparing with ${period}`, "Splitting by platform and demand source"],
            body: (
                <>
                    <p>
                        Revenue is <B>{formatMetric("Revenue", r.now)}</B>, <Trend v={r.change} /> against {period} ({formatMetric("Revenue", r.before)}).
                    </p>
                    <p className="font-bold text-primary">By platform</p>
                    <ul className="list-disc pl-5">
                        {platforms.map((p) => (
                            <li key={p.value}>
                                {p.value}: {formatMetric("Revenue", p.now)}, <Trend v={p.change} />
                            </li>
                        ))}
                    </ul>
                    <p className="font-bold text-primary">The demand sources that moved it most</p>
                    <ul className="list-disc pl-5">
                        {movers.map((m) => (
                            <li key={m.value}>
                                {m.value}: {formatMetric("Revenue", m.now)}, <Trend v={m.change} /> ({(m.share * 100).toFixed(1)}% of revenue)
                            </li>
                        ))}
                    </ul>
                </>
            ),
            apply: {
                label: "Chart revenue by demand source",
                change: { metrics: ["Revenue"], breakdown: ["Demand Source"], chart: "line", charted: ["Revenue"] },
            },
            next: ["countries", "fill"],
        };
    }
    if (q === "countries") {
        const rows = rowsBy("Country", "Revenue", range, excluded).slice(0, 5);
        return {
            steps: ["Reading this report", "Splitting revenue by country"],
            body: (
                <>
                    <p>The five countries with the most revenue in this range:</p>
                    <ol className="list-decimal pl-5">
                        {rows.map((c) => (
                            <li key={c.value}>
                                <B>{c.value}</B>: {formatMetric("Revenue", c.now)}, {(c.share * 100).toFixed(1)}% of revenue, <Trend v={c.change} /> vs {period}
                            </li>
                        ))}
                    </ol>
                </>
            ),
            apply: { label: "Show revenue by country", change: { metrics: ["Revenue", "ECPM"], breakdown: ["Country"], chart: "table" } },
            next: ["revenue", "fill"],
        };
    }
    const rows = rowsBy("Ad Type", "Fill Rate", range, excluded).sort((a, b) => a.now - b.now);
    return {
        steps: ["Reading this report", "Working out fill rate by ad type"],
        body: (
            <>
                <p>Fill rate by ad type, lowest first:</p>
                <ul className="list-disc pl-5">
                    {rows.map((r) => (
                        <li key={r.value}>
                            <B>{r.value}</B>: {formatMetric("Fill Rate", r.now)}, <Trend v={r.change} /> vs {period}
                        </li>
                    ))}
                </ul>
            </>
        ),
        apply: { label: "Show fill rate by ad type", change: { metrics: ["Requests", "Impressions", "Fill Rate"], breakdown: ["Ad Type"], chart: "table" } },
        next: ["revenue", "countries"],
    };
};

interface Turn {
    id: number;
    text: string;
    q: QuestionId | null;
    /** C16: a chart request read from the text, built on “Build this chart”. */
    build?: BuildRequest | null;
}

/** C16: what the chat read from a chart request, listed back before it is built. */
const buildAnswer = (b: BuildRequest): Answer => ({
    steps: ["Reading your request", "Matching metrics and fields", "Setting up the chart"],
    body: (
        <>
            <p>Here is what I read. Build it, then change anything in the Query tab.</p>
            <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-1.5 rounded-lg bg-secondary px-3 py-2.5">
                {b.read.map(([k, v]) => (
                    <div key={k} className="contents">
                        <dt className="font-semibold text-tertiary">{k}</dt>
                        <dd className="font-semibold text-primary">{v}</dd>
                    </div>
                ))}
            </dl>
        </>
    ),
    apply: { label: "Build this chart", change: b.change },
    next: [],
});

/** The prompts that sit right under the chart (the light version of the layer). */
export const AskRow = ({ onAsk }: { onAsk: (q: QuestionId) => void }) => (
    <div className="flex flex-wrap items-center gap-2" aria-label="Ask about this report">
        {(Object.keys(QUESTIONS) as QuestionId[]).map((q) => (
            <button
                key={q}
                type="button"
                onClick={() => onAsk(q)}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-3.5 text-md font-semibold text-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary"
            >
                <Stars02 className="size-4" style={{ color: PINK }} aria-hidden="true" />
                {QUESTIONS[q]}
            </button>
        ))}
    </div>
);

export const AskButton = ({ onPress, open }: { onPress: () => void; open: boolean }) => (
    <button
        type="button"
        onClick={onPress}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full px-4 whitespace-nowrap text-white transition duration-100 ease-linear hover:opacity-90"
        style={{ height: 33, backgroundColor: TEAL_DARK, fontSize: 15, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}
    >
        <Stars02 className="size-4" aria-hidden="true" /> Ask
    </button>
);

const AnswerView = ({
    turn,
    range,
    excluded,
    onApply,
    onAsk,
    onAskText,
    builder,
    latest,
}: {
    turn: Turn;
    range: Range;
    excluded: Excluded;
    onApply: (c: ReportChange) => void;
    onAsk: (q: QuestionId) => void;
    onAskText: (text: string) => void;
    builder?: boolean;
    latest: boolean;
}) => {
    const answer = turn.build ? buildAnswer(turn.build) : turn.q ? answerOf(turn.q, range, excluded) : null;
    const steps = answer?.steps.length ?? 0;
    // The steps tick through once, then the answer appears; earlier answers show at once.
    const [done, setDone] = useState(latest ? 0 : steps);
    const [stepsOpen, setStepsOpen] = useState(true);
    const [applied, setApplied] = useState(false);
    useEffect(() => {
        if (done >= steps) return;
        const t = window.setTimeout(() => setDone((d) => d + 1), 450);
        return () => window.clearTimeout(t);
    }, [done, steps]);

    if (!answer)
        return (
            <div className="flex flex-col gap-3 text-md text-secondary">
                {builder ? (
                    <>
                        <p>I could not find a metric or a breakdown in that. Name one, like “revenue by country”, or try one of these:</p>
                        <div className="flex flex-col items-start gap-2">
                            {BUILD_EXAMPLES.map((x) => (
                                <TextSuggest key={x} text={x} onAsk={onAskText} />
                            ))}
                        </div>
                        <p>Or ask about the report:</p>
                    </>
                ) : (
                    <p>In this prototype I can answer three questions about the report:</p>
                )}
                <div className="flex flex-col items-start gap-2">
                    {(Object.keys(QUESTIONS) as QuestionId[]).map((q) => (
                        <SuggestButton key={q} q={q} onAsk={onAsk} />
                    ))}
                </div>
            </div>
        );

    return (
        <div className="flex flex-col gap-3 text-md leading-relaxed text-secondary">
            <div>
                <button
                    type="button"
                    onClick={() => setStepsOpen((v) => !v)}
                    className="inline-flex items-center gap-1 font-semibold text-tertiary"
                    aria-expanded={stepsOpen}
                >
                    Analysis <ChevronDown className={cx("size-4 transition", !stepsOpen && "-rotate-90")} aria-hidden="true" />
                </button>
                {stepsOpen && (
                    <ul className="mt-1 flex flex-col gap-1">
                        {answer.steps.slice(0, Math.max(1, done)).map((s, i) => (
                            <li key={s} className="inline-flex items-center gap-2 text-tertiary">
                                <CheckCircle className="size-4" style={{ color: i < done ? TEAL : "#D0D5DD" }} aria-hidden="true" />
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {done >= steps && (
                <>
                    <div className="flex flex-col gap-2">{answer.body}</div>
                    <button
                        type="button"
                        onClick={() => {
                            onApply(answer.apply.change);
                            setApplied(true);
                        }}
                        className="inline-flex h-10 items-center gap-2 self-start rounded-full px-4 font-bold transition duration-100 ease-linear"
                        style={applied ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : { color: "#FFFFFF", backgroundColor: TEAL_DARK }}
                    >
                        {applied ? <CheckCircle className="size-4" aria-hidden="true" /> : <BarChart10 className="size-4" aria-hidden="true" />}
                        {applied ? (turn.build ? "Built in the report" : "Showing in the report") : answer.apply.label}
                    </button>
                    {latest && (
                        <div className="flex flex-col items-start gap-2 pt-1">
                            {answer.next.map((q) => (
                                <SuggestButton key={q} q={q} onAsk={onAsk} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

/** A chart request offered as a button (C16). */
const TextSuggest = ({ text, onAsk }: { text: string; onAsk: (text: string) => void }) => (
    <button
        type="button"
        onClick={() => onAsk(text)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-md font-semibold text-secondary ring-1 ring-secondary hover:bg-secondary"
    >
        <BarChart10 className="size-4 shrink-0" style={{ color: TEAL_DARK }} aria-hidden="true" />
        {text}
    </button>
);

const SuggestButton = ({ q, onAsk }: { q: QuestionId; onAsk: (q: QuestionId) => void }) => (
    <button
        type="button"
        onClick={() => onAsk(q)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-md font-semibold text-secondary ring-1 ring-secondary hover:bg-secondary"
    >
        <Stars02 className="size-4 shrink-0" style={{ color: PINK }} aria-hidden="true" />
        {QUESTIONS[q]}
    </button>
);

export const AssistantPanel = ({
    range,
    excluded,
    onApply,
    onClose,
    pending,
    onPendingTaken,
    builder,
    embedded,
    firstAsk,
}: {
    range: Range;
    excluded: Excluded;
    onApply: (c: ReportChange) => void;
    onClose?: () => void;
    /** C16: the chat also builds charts from what is typed. */
    builder?: boolean;
    /** C16: drawn inside another panel (no frame of its own, no close button). */
    embedded?: boolean;
    /** A request already typed when the panel opens (for the prototype's states). */
    firstAsk?: string;
    /** A question asked from outside the panel (the row under the chart). */
    pending?: QuestionId | null;
    onPendingTaken?: () => void;
}) => {
    const [turns, setTurns] = useState<Turn[]>([]);
    const [title, setTitle] = useState("New conversation");
    const [renaming, setRenaming] = useState(false);
    const [text, setText] = useState("");
    const nextId = useRef(1);
    const end = useRef<HTMLDivElement>(null);

    const ask = (q: QuestionId | null, asked: string) => {
        setTurns((cur) => [...cur, { id: nextId.current++, text: asked, q }]);
        if (title === "New conversation") setTitle(q ? QUESTIONS[q].replace(/\?$/, "") : asked.slice(0, 40));
    };
    // A question from the row under the chart is asked once, even when an effect runs twice (React's strict mode).
    const taken = useRef<QuestionId | null>(null);
    useEffect(() => {
        if (!pending || taken.current === pending) return;
        taken.current = pending;
        ask(pending, QUESTIONS[pending]);
        onPendingTaken?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pending]);
    // Scroll the conversation, never the page, to the newest answer.
    useEffect(() => {
        const box = end.current?.parentElement;
        if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    }, [turns.length]);

    /** A typed line: a question (why, which, where…), or in builder mode a chart to build. */
    const askText = (raw: string) => {
        const t = raw.trim();
        if (!t) return;
        const question = /^(why|which|where|what|how|who|when|is|are|did|does)\b/i.test(t) ? matchQuestion(t) : null;
        const build = !question && builder ? parseRequest(t) : null;
        setTurns((cur) => [...cur, { id: nextId.current++, text: t, q: question ?? (build ? null : matchQuestion(t)), build }]);
        if (title === "New conversation") setTitle(t.replace(/\?$/, "").slice(0, 42));
    };
    const firstTaken = useRef(false);
    useEffect(() => {
        if (!firstAsk || firstTaken.current) return;
        firstTaken.current = true;
        askText(firstAsk);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstAsk]);
    const send = () => {
        askText(text);
        setText("");
    };

    return (
        <aside
            aria-label="Ask about this report"
            className={cx(
                "flex flex-col bg-primary",
                embedded ? "min-h-0 flex-1" : "relative sticky top-0 z-10 h-[calc(100vh-1rem)] max-h-[56rem] border-l border-secondary",
            )}
        >
            <div className="flex items-center gap-2 border-b border-secondary px-5 py-3">
                {renaming ? (
                    <input
                        autoFocus
                        aria-label="Conversation name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setRenaming(false)}
                        onKeyDown={(e) => e.key === "Enter" && setRenaming(false)}
                        className="min-w-0 flex-1 rounded-md px-2 py-1 text-md font-bold text-primary ring-2"
                        style={{ ["--tw-ring-color" as string]: TEAL }}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setRenaming(true)}
                        title="Rename"
                        className="min-w-0 flex-1 truncate text-left text-md font-bold text-primary"
                    >
                        {title}
                    </button>
                )}
                <button
                    type="button"
                    aria-label="New conversation"
                    title="New conversation"
                    onClick={() => {
                        setTurns([]);
                        setTitle("New conversation");
                    }}
                    className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary hover:text-fg-secondary"
                >
                    <Edit05 className="size-5" aria-hidden="true" />
                </button>
                {onClose && (
                    <button
                        type="button"
                        aria-label="Close assistant"
                        title="Close"
                        onClick={onClose}
                        className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary hover:text-fg-secondary"
                    >
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
                {turns.length === 0 ? (
                    <div className="mt-auto flex flex-col gap-4">
                        <Stars02 className="size-7" style={{ color: PINK }} aria-hidden="true" />
                        <div>
                            <div className="text-display-xs font-extrabold text-primary">{builder ? "Describe a chart, or ask" : "Ask about this report"}</div>
                            <div className="text-md text-tertiary">
                                {builder
                                    ? "Say what you want to see and I'll set up the metrics, breakdown, filters, dates and chart. Questions use the report's own figures."
                                    : "Answers use the report's own figures, for the dates and filters you have set."}
                            </div>
                        </div>
                        {builder && (
                            <div className="flex flex-col items-start gap-2">
                                {BUILD_EXAMPLES.map((x) => (
                                    <TextSuggest key={x} text={x} onAsk={askText} />
                                ))}
                            </div>
                        )}
                        <div className="flex flex-col items-start gap-2">
                            {(Object.keys(QUESTIONS) as QuestionId[]).map((q) => (
                                <SuggestButton key={q} q={q} onAsk={(x) => ask(x, QUESTIONS[x])} />
                            ))}
                        </div>
                    </div>
                ) : (
                    turns.map((t, i) => (
                        <div key={t.id} className="flex flex-col gap-3">
                            <div className="self-end rounded-2xl rounded-br-sm bg-secondary px-4 py-2.5 text-md text-primary">{t.text}</div>
                            <AnswerView
                                turn={t}
                                range={range}
                                excluded={excluded}
                                onApply={onApply}
                                onAsk={(q) => ask(q, QUESTIONS[q])}
                                onAskText={askText}
                                builder={builder}
                                latest={i === turns.length - 1}
                            />
                        </div>
                    ))
                )}
                <div ref={end} />
            </div>

            <div className="border-t border-secondary p-4">
                <div
                    className="flex items-end gap-2 rounded-xl bg-secondary px-3 py-2 ring-1 ring-secondary focus-within:ring-2"
                    style={{ ["--tw-ring-color" as string]: TEAL }}
                >
                    <textarea
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send();
                            }
                        }}
                        placeholder={builder ? "Describe a chart, or ask a question" : "Ask about this report"}
                        aria-label="Ask about this report"
                        className="max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 text-md text-primary outline-none placeholder:text-placeholder"
                    />
                    <button
                        type="button"
                        aria-label="Send"
                        onClick={send}
                        disabled={!text.trim()}
                        className="rounded-full p-1.5 text-white disabled:opacity-35"
                        style={{ backgroundColor: TEAL_DARK }}
                    >
                        <ArrowUp className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
