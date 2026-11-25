import { type ReactNode, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen01, ChevronDown, Grid01 } from "@untitledui/icons";
import { runPageFill } from "./demo-fill";
import { DemoFillControls } from "./demo-fill-ui";
import { ScreenInfoButton } from "./screen-notes-ui";

/**
 * Prototype frame — shared chrome for every standalone prototype version.
 *
 * Hash routing (`#/<screen-id>`) keeps each version a single static page, so it works
 * on GitHub Pages with no server rewrites. The dark toolbar is prototype chrome, not
 * product UI: prototype name, version switcher, screen switcher, index link.
 */

export interface ProtoScreen {
    id: string;
    /** Group heading on the index page, e.g. "Campaign Setup". */
    area: string;
    title: string;
    description?: string;
    render: () => ReactNode;
}

export interface ProtoVersion {
    /** Folder name, e.g. "v1". */
    id: string;
    label: string;
    date: string;
    summary: string;
}

export interface ProtoMeta {
    name: string;
    tagline: string;
    /** Accent for the index page (deep brand tone). */
    accent: string;
    soft: string;
    versions: ProtoVersion[];
    /** The version this build is. */
    current: string;
}

const useHashRoute = () => {
    // "#/screen?param=…" → "screen"; params carry in-screen state (see a prototype's route.ts).
    const read = () => window.location.hash.replace(/^#\/?/, "").split("?")[0];
    const [route, setRoute] = useState(read);
    useEffect(() => {
        const onChange = () => {
            setRoute(read());
            window.scrollTo(0, 0);
        };
        window.addEventListener("hashchange", onChange);
        return () => window.removeEventListener("hashchange", onChange);
    }, []);
    return route;
};

/** Storybook (design system) lives at the Pages root; locally it runs on its own port. */
const storybookUrl = () => (window.location.hostname === "localhost" ? "http://localhost:6006/" : "../../");

/** Versions that show the Fill / Type switch. Round 3 introduced it; earlier rounds keep the toolbar they were reviewed with. */
const CLICK_TO_FILL = new Set(["v3", "v4"]);

/** “v2 · Round 2 · Concepts · November 24, 2026” → “v2 · Round 2 · Nov 24”. */
const shortVersion = (v?: ProtoMeta["versions"][number]) => {
    if (!v) return "";
    const date = v.date.replace(/^(\w{3})\w*\s+(\d+).*$/, "$1 $2");
    return [v.id, v.label.split(" · ")[0], date].filter(Boolean).join(" · ");
};

const selectClass = "rounded-md border border-white/15 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-white/40";

const Toolbar = ({
    meta,
    screens,
    activeId,
    extras,
    picker,
}: {
    meta: ProtoMeta;
    screens: ProtoScreen[];
    activeId?: string;
    extras?: ReactNode;
    picker?: ScreenPicker;
}) => {
    const index = screens.findIndex((s) => s.id === activeId);
    const prev = index > 0 ? screens[index - 1] : undefined;
    const next = index >= 0 && index < screens.length - 1 ? screens[index + 1] : undefined;
    const areas = [...new Set(screens.map((s) => s.area))];

    return (
        <div className="sticky top-0 z-50 flex flex-wrap items-center gap-x-4 gap-y-2 bg-[#101828] px-4 py-2 text-sm text-white">
            <a href="#/" className="font-semibold whitespace-nowrap hover:opacity-80">
                {!picker && <span className="opacity-60">Nimbus prototype ·</span>} {meta.name}
            </a>

            {/* With a screen picker (PI v2) the closed menu shows a short label; the list keeps the full one. */}
            <span className={picker ? "relative inline-flex" : "contents"}>
                {picker && (
                    <span aria-hidden="true" className={`${selectClass} pointer-events-none flex items-center gap-1.5 pr-7 whitespace-nowrap`}>
                        {shortVersion(meta.versions.find((v) => v.id === meta.current))}
                        <ChevronDown className="absolute right-2 size-3.5 text-white/70" />
                    </span>
                )}
                <select
                    aria-label="Version"
                    className={picker ? "absolute inset-0 cursor-pointer opacity-0" : selectClass}
                    value={meta.current}
                    onChange={(e) => window.location.assign(`../${e.target.value}/${window.location.hash}`)}
                >
                    {meta.versions.map((v) => (
                        <option key={v.id} value={v.id} className="text-black">
                            {v.id} · {v.label} · {v.date}
                        </option>
                    ))}
                </select>
            </span>

            {activeId && picker && picker({ screens, activeId })}

            {activeId && !picker && (
                <div className="flex min-w-0 items-center gap-1.5">
                    <a
                        href={prev ? `#/${prev.id}` : undefined}
                        aria-label="Previous screen"
                        className={`rounded-md p-1 ${prev ? "hover:bg-white/10" : "pointer-events-none opacity-30"}`}
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                    </a>
                    <select
                        aria-label="Screen"
                        className={`${selectClass} max-w-[60vw]`}
                        value={activeId}
                        onChange={(e) => (window.location.hash = `#/${e.target.value}`)}
                    >
                        {areas.map((area) => (
                            <optgroup key={area} label={area} className="text-black">
                                {screens
                                    .filter((s) => s.area === area)
                                    .map((s) => (
                                        <option key={s.id} value={s.id} className="text-black">
                                            {s.title}
                                        </option>
                                    ))}
                            </optgroup>
                        ))}
                    </select>
                    <a
                        href={next ? `#/${next.id}` : undefined}
                        aria-label="Next screen"
                        className={`rounded-md p-1 ${next ? "hover:bg-white/10" : "pointer-events-none opacity-30"}`}
                    >
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                    <span className="hidden text-xs opacity-60 sm:inline">
                        {index + 1}/{screens.length}
                    </span>
                </div>
            )}

            <div className="ml-auto flex items-center gap-3">
                {activeId && <ScreenInfoButton />}
                {activeId && <DemoFillControls onFillPage={runPageFill} clickToFill={CLICK_TO_FILL.has(meta.current)} />}
                {extras}
                <a href="#/" className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100">
                    <Grid01 className="size-4" aria-hidden="true" /> All screens
                </a>
                <a href={storybookUrl()} className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100">
                    <BookOpen01 className="size-4" aria-hidden="true" /> Design system
                </a>
            </div>
        </div>
    );
};

const IndexPage = ({ meta, screens }: { meta: ProtoMeta; screens: ProtoScreen[] }) => {
    const version = meta.versions.find((v) => v.id === meta.current)!;
    const areas = [...new Set(screens.map((s) => s.area))];
    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
                <header className="flex flex-col gap-3">
                    <span className="text-xs font-bold tracking-wide uppercase" style={{ color: meta.accent }}>
                        {version.date} · {version.label} · {version.id}
                    </span>
                    <h1 className="text-display-sm font-semibold text-primary">{meta.name}</h1>
                    <p className="text-lg text-tertiary">{meta.tagline}</p>
                    <div className="rounded-2xl border border-secondary bg-primary p-5 text-md leading-relaxed text-secondary">
                        <strong className="text-primary">The experience.</strong> {version.summary}
                    </div>
                </header>

                {areas.map((area) => (
                    <section key={area} className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-primary">{area}</h2>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {screens
                                .filter((s) => s.area === area)
                                .map((s) => (
                                    <a
                                        key={s.id}
                                        href={`#/${s.id}`}
                                        className="group flex flex-col gap-1 rounded-xl border border-secondary bg-primary p-4 transition-shadow hover:shadow-md"
                                        style={{ borderTop: `3px solid ${meta.accent}` }}
                                    >
                                        <span className="flex items-center justify-between gap-2 text-md font-semibold text-primary">
                                            {s.title}
                                            <ArrowRight
                                                className="size-4 text-fg-quaternary transition-transform group-hover:translate-x-0.5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        {s.description && <span className="text-sm text-tertiary">{s.description}</span>}
                                    </a>
                                ))}
                        </div>
                    </section>
                ))}

                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold text-primary">Versions</h2>
                    <ul className="divide-y divide-secondary overflow-hidden rounded-xl border border-secondary bg-primary">
                        {[...meta.versions].reverse().map((v) => (
                            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                <span className="text-sm text-secondary">
                                    <span className="font-semibold text-primary">
                                        {v.id} · {v.label}
                                    </span>{" "}
                                    · {v.date}
                                </span>
                                {v.id === meta.current ? (
                                    <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ color: meta.accent, backgroundColor: meta.soft }}>
                                        Viewing
                                    </span>
                                ) : (
                                    <a href={`../${v.id}/`} className="text-sm font-semibold" style={{ color: meta.accent }}>
                                        Open →
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

/** A version's own screen picker, in place of the toolbar's arrows and screen menu. */
export type ScreenPicker = (props: { screens: ProtoScreen[]; activeId: string }) => ReactNode;

/**
 * `picker` replaces the toolbar's screen menu with a version's own (PI Round 2: Concept,
 * then its edge cases). Versions that don't pass it are unchanged.
 *
 * `toolbarExtras` lets a version add its own controls to the toolbar for the screens
 * they apply to (Round 3's copy deck). Versions that don't pass it are unchanged.
 */
export const PrototypeApp = ({
    meta,
    screens,
    toolbarExtras,
    picker,
}: {
    meta: ProtoMeta;
    screens: ProtoScreen[];
    toolbarExtras?: (screen: ProtoScreen) => ReactNode;
    picker?: ScreenPicker;
}) => {
    const route = useHashRoute();
    const screen = screens.find((s) => s.id === route);

    useEffect(() => {
        document.title = `${screen ? `${screen.title} · ` : ""}${meta.name} ${meta.current} · Nimbus prototype`;
    }, [screen, meta]);

    return (
        <>
            <Toolbar meta={meta} screens={screens} activeId={screen?.id} extras={screen && toolbarExtras?.(screen)} picker={picker} />
            {screen ? <div key={screen.id}>{screen.render()}</div> : <IndexPage meta={meta} screens={screens} />}
        </>
    );
};
