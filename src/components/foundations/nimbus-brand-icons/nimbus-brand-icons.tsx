/**
 * Styles › Icons › Nimbus Brand Icons — the Library redrawn in Nimbus' own icon style
 * (the sidebar's Sketch icons: chunky, softly rounded, solid shapes with even outlines),
 * plus icons for DAS and Performance Insights that the Library didn't have.
 *
 * Generated with Higgsfield (Ideogram Vector, the sidebar icons as the style reference),
 * cut into one SVG per icon by scripts/split-icon-sheet.mjs. The SVGs are drawn in
 * #AAAAAA; here that becomes currentColor, so they take the text colour like the Library's.
 * White shapes inside an icon are knockouts (e.g. the check cut from a solid shield).
 */

const files = import.meta.glob<string>("./**/*.svg", { eager: true, query: "?raw", import: "default" });

const svgFor = (dir: string, name: string) => {
    const svg = files[`./${dir}/${name}.svg`];
    if (!svg) throw new Error(`Missing icon ${dir}/${name}.svg`);
    return svg.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, "")).replace(/#AAAAAA/gi, "currentColor");
};

/** One brand icon, sized and coloured by its className (like an @untitledui/icons icon). */
export const BrandIcon = ({ dir, name, className }: { dir: string; name: string; className?: string }) => (
    <span aria-hidden="true" className={`inline-flex shrink-0 [&>svg]:size-full ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: svgFor(dir, name) }} />
);

/** [file, label]: Library icons keep their @untitledui/icons name; new ones say what they're for. */
type Group = { title: string; dir: string; icons: [string, string][]; note?: string };

const GROUPS: Group[] = [
    {
        title: "Bullets & checks",
        dir: "bullets-checks",
        icons: [
            ["check-circle", "CheckCircle"],
            ["check-circle-broken", "CheckCircleBroken"],
            ["check", "Check"],
            ["check-verified", "CheckVerified01"],
            ["check-square", "CheckSquare"],
            ["check-square-broken", "CheckSquareBroken"],
            ["plus", "Plus"],
            ["minus", "Minus"],
        ],
    },
    {
        title: "Content & blog",
        dir: "content-blog",
        icons: [
            ["book-open", "BookOpen01"],
            ["book-closed", "BookClosed"],
            ["feather", "Feather"],
            ["edit", "Edit05"],
            ["file", "File02"],
            ["calendar", "Calendar"],
            ["clock", "Clock"],
            ["tag", "Tag01"],
            ["search", "SearchLg"],
            ["bookmark", "Bookmark"],
            ["eye", "Eye"],
            ["announcement", "Announcement01"],
            ["rss", "Rss01"],
            ["image", "Image01"],
            ["play-circle", "PlayCircle"],
        ],
    },
    {
        title: "People & comms",
        dir: "people-comms",
        icons: [
            ["user", "User01"],
            ["users", "Users01"],
            ["user-plus", "UserPlus01"],
            ["message-circle", "MessageCircle01"],
            ["message-chat", "MessageChatCircle"],
            ["mail", "Mail01"],
            ["send", "Send01"],
            ["bell", "Bell01"],
        ],
    },
    {
        title: "Engagement",
        dir: "engagement",
        icons: [
            ["heart", "Heart"],
            ["thumbs-up", "ThumbsUp"],
            ["star", "Star01"],
            ["share", "Share07"],
            ["link", "Link01"],
            ["link-external", "LinkExternal01"],
            ["copy", "Copy01"],
        ],
    },
    {
        title: "Navigation & UI",
        dir: "navigation",
        icons: [
            ["arrow-right", "ArrowRight"],
            ["arrow-up-right", "ArrowUpRight"],
            ["chevron-right", "ChevronRight"],
            ["chevron-down", "ChevronDown"],
            ["menu", "Menu01"],
            ["x-close", "XClose"],
            ["filter-lines", "FilterLines"],
            ["settings", "Settings01"],
            ["download", "Download01"],
            ["upload", "Upload01"],
            ["grid", "Grid01"],
            ["list", "List"],
        ],
    },
    {
        title: "Analytics & ad tech",
        dir: "analytics",
        icons: [
            ["bar-chart", "BarChart01"],
            ["bar-chart-square", "BarChartSquare01"],
            ["trend-up", "TrendUp01"],
            ["trend-up-2", "TrendUp02"],
            ["line-chart-up", "LineChartUp01"],
            ["line-chart-up-dots", "LineChartUp03"],
            ["pie-chart", "PieChart01"],
            ["percent", "Percent02"],
            ["currency-dollar", "CurrencyDollar"],
            ["currency-dollar-circle", "CurrencyDollarCircle"],
            ["coins-stacked", "CoinsStacked01"],
            ["coins-stacked-2", "CoinsStacked03"],
            ["target", "Target04"],
            ["target-arrow", "Target05"],
            ["zap", "Zap"],
            ["lightning-circle", "Lightning01"],
            ["speedometer", "Speedometer04"],
            ["shield-tick", "ShieldTick"],
            ["shield", "Shield01"],
            ["lock", "Lock01"],
            ["globe", "Globe01"],
            ["server", "Server01"],
            ["data", "Data"],
            ["layers", "LayersThree01"],
        ],
    },
    {
        title: "Deal Activation System",
        dir: "das",
        note: "New: not in the Library. For DAS setup, campaigns and the libraries.",
        icons: [
            ["deal", "Deal"],
            ["campaign", "Campaign"],
            ["creatives", "Creatives"],
            ["keyword", "Keyword"],
            ["ad-unit", "Ad unit"],
            ["auction", "Auction rule"],
            ["budget", "Budget"],
            ["pacing", "Pacing"],
            ["flight-dates", "Flight dates"],
            ["targeting", "Targeting"],
            ["geo", "Geo"],
            ["platform", "Platform"],
        ],
    },
    {
        title: "Performance Insights",
        dir: "performance-insights",
        note: "New: not in the Library. For breakdowns, metrics and the query tools.",
        icons: [
            ["app", "App"],
            ["device-language", "Device language"],
            ["frequency-cap", "Frequency cap"],
            ["priority", "Priority"],
            ["filter-funnel", "Filter / fill rate"],
            ["win-rate", "Win rate"],
            ["demand-source", "Demand source"],
            ["sdk", "SDK"],
            ["csv-export", "CSV export"],
            ["saved-query", "Saved query"],
            ["pivot", "Pivot"],
            ["realtime", "Realtime"],
        ],
    },
];

/** Same tiles as Styles › Icons › Library. */
const Grid = ({ group }: { group: Group }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-[#181d27]">{group.title}</h3>
            {group.note && <p className="text-md text-[#535862]">{group.note}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {group.icons.map(([file, label]) => (
                <div key={file} className="flex flex-col items-center gap-2 rounded-lg border border-secondary bg-white p-4 text-center">
                    <BrandIcon dir={group.dir} name={file} className="size-6 text-brand-600" />
                    <span className="truncate text-xs text-tertiary" title={label}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    </section>
);

export const NimbusBrandIcons = () => (
    <div className="flex flex-col gap-10 bg-[#f9f7f3] p-8 text-[#181d27]">
        <div className="flex flex-col gap-2">
            <h2 className="text-[33px] font-extrabold">Nimbus Brand Icons</h2>
            <p className="text-[18px] text-[#535862]">The Library in Nimbus' own icon style, plus DAS and Performance Insights. Shown in the brand colour via currentColor, like the Library.</p>
        </div>
        {GROUPS.map((group) => (
            <Grid key={group.dir} group={group} />
        ))}
    </div>
);
