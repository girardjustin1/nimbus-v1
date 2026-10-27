import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    Announcement01,
    ArrowRight,
    ArrowUpRight,
    BarChart01,
    BarChartSquare01,
    Bell01,
    Bookmark,
    BookClosed,
    BookOpen01,
    Calendar,
    Check,
    CheckCircle,
    CheckCircleBroken,
    CheckSquare,
    CheckSquareBroken,
    CheckVerified01,
    ChevronDown,
    ChevronRight,
    Clock,
    CoinsStacked01,
    CoinsStacked03,
    Copy01,
    CurrencyDollar,
    CurrencyDollarCircle,
    Data,
    Download01,
    Edit05,
    Eye,
    Feather,
    File02,
    FilterLines,
    Globe01,
    Grid01,
    Heart,
    Image01,
    LayersThree01,
    Lightning01,
    LineChartUp01,
    LineChartUp03,
    Link01,
    LinkExternal01,
    List,
    Lock01,
    Mail01,
    Menu01,
    MessageChatCircle,
    MessageCircle01,
    Minus,
    Percent02,
    PieChart01,
    PlayCircle,
    Plus,
    Rss01,
    SearchLg,
    Send01,
    Server01,
    Settings01,
    Share07,
    Shield01,
    ShieldTick,
    Speedometer04,
    Star01,
    Tag01,
    Target04,
    Target05,
    ThumbsUp,
    TrendUp01,
    TrendUp02,
    Upload01,
    User01,
    UserPlus01,
    Users01,
    XClose,
    Zap,
} from "@untitledui/icons";
import type { FC } from "react";
import { NimbusBrandIcons as NimbusBrandIconsPage } from "./nimbus-brand-icons/nimbus-brand-icons";

type IconType = FC<{ className?: string }>;

/**
 * Styles → Icons
 * A working set from @untitledui/icons for the Nimbus site — grouped by use.
 * Icons inherit color via currentColor (shown here in the brand teal).
 */
const meta = {
    title: "Styles/Icons",
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const CHECKS: [IconType, string][] = [
    [CheckCircle, "CheckCircle"],
    [CheckCircleBroken, "CheckCircleBroken"],
    [Check, "Check"],
    [CheckVerified01, "CheckVerified01"],
    [CheckSquare, "CheckSquare"],
    [CheckSquareBroken, "CheckSquareBroken"],
    [Plus, "Plus"],
    [Minus, "Minus"],
];

const CONTENT: [IconType, string][] = [
    [BookOpen01, "BookOpen01"],
    [BookClosed, "BookClosed"],
    [Feather, "Feather"],
    [Edit05, "Edit05"],
    [File02, "File02"],
    [Calendar, "Calendar"],
    [Clock, "Clock"],
    [Tag01, "Tag01"],
    [SearchLg, "SearchLg"],
    [Bookmark, "Bookmark"],
    [Eye, "Eye"],
    [Announcement01, "Announcement01"],
    [Rss01, "Rss01"],
    [Image01, "Image01"],
    [PlayCircle, "PlayCircle"],
];

const PEOPLE: [IconType, string][] = [
    [User01, "User01"],
    [Users01, "Users01"],
    [UserPlus01, "UserPlus01"],
    [MessageCircle01, "MessageCircle01"],
    [MessageChatCircle, "MessageChatCircle"],
    [Mail01, "Mail01"],
    [Send01, "Send01"],
    [Bell01, "Bell01"],
];

const ENGAGEMENT: [IconType, string][] = [
    [Heart, "Heart"],
    [ThumbsUp, "ThumbsUp"],
    [Star01, "Star01"],
    [Share07, "Share07"],
    [Link01, "Link01"],
    [LinkExternal01, "LinkExternal01"],
    [Copy01, "Copy01"],
];

const NAV: [IconType, string][] = [
    [ArrowRight, "ArrowRight"],
    [ArrowUpRight, "ArrowUpRight"],
    [ChevronRight, "ChevronRight"],
    [ChevronDown, "ChevronDown"],
    [Menu01, "Menu01"],
    [XClose, "XClose"],
    [FilterLines, "FilterLines"],
    [Settings01, "Settings01"],
    [Download01, "Download01"],
    [Upload01, "Upload01"],
    [Grid01, "Grid01"],
    [List, "List"],
];

const ANALYTICS: [IconType, string][] = [
    [BarChart01, "BarChart01"],
    [BarChartSquare01, "BarChartSquare01"],
    [TrendUp01, "TrendUp01"],
    [TrendUp02, "TrendUp02"],
    [LineChartUp01, "LineChartUp01"],
    [LineChartUp03, "LineChartUp03"],
    [PieChart01, "PieChart01"],
    [Percent02, "Percent02"],
    [CurrencyDollar, "CurrencyDollar"],
    [CurrencyDollarCircle, "CurrencyDollarCircle"],
    [CoinsStacked01, "CoinsStacked01"],
    [CoinsStacked03, "CoinsStacked03"],
    [Target04, "Target04"],
    [Target05, "Target05"],
    [Zap, "Zap"],
    [Lightning01, "Lightning01"],
    [Speedometer04, "Speedometer04"],
    [ShieldTick, "ShieldTick"],
    [Shield01, "Shield01"],
    [Lock01, "Lock01"],
    [Globe01, "Globe01"],
    [Server01, "Server01"],
    [Data, "Data"],
    [LayersThree01, "LayersThree01"],
];

const Grid = ({ title, icons }: { title: string; icons: [IconType, string][] }) => (
    <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[#181d27]">{title}</h3>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {icons.map(([Icon, name]) => (
                <div key={name} className="flex flex-col items-center gap-2 rounded-lg border border-secondary bg-white p-4 text-center">
                    <Icon className="size-6 text-brand-600" />
                    <span className="truncate text-xs text-tertiary" title={name}>
                        {name}
                    </span>
                </div>
            ))}
        </div>
    </section>
);

/** The full working set, grouped by use. */
export const Library: Story = {
    render: () => (
        <div className="flex flex-col gap-10 bg-[#f9f7f3] p-8 text-[#181d27]">
            <div className="flex flex-col gap-2">
                <h2 className="text-[33px] font-extrabold">Icons</h2>
                <p className="text-[18px] text-[#535862]">From @untitledui/icons. Shown in the brand teal via currentColor.</p>
            </div>
            <Grid title="Bullets & checks" icons={CHECKS} />
            <Grid title="Content & blog" icons={CONTENT} />
            <Grid title="People & comms" icons={PEOPLE} />
            <Grid title="Engagement" icons={ENGAGEMENT} />
            <Grid title="Navigation & UI" icons={NAV} />
            <Grid title="Analytics & ad tech" icons={ANALYTICS} />
        </div>
    ),
};

/** Check-style bullets — the pattern from the case-study "challenge" list. */
export const CheckList: Story = {
    render: () => (
        <div className="flex flex-col gap-6 bg-[#f9f7f3] p-8">
            <h2 className="text-[33px] font-extrabold text-[#181d27]">Bullet / check list</h2>
            <ul className="flex max-w-md flex-col gap-4">
                {[
                    "Auction transparency and control",
                    "Holistic demand competition",
                    "Operational efficiency across partners",
                    "Full access to the Nimbus demand ecosystem",
                ].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                        <CheckCircle className="size-5 shrink-0 text-[#23a6a9]" />
                        <span className="text-[18px] leading-[24px] text-[#181d27]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    ),
};

/** The Library redrawn in Nimbus' own icon style, plus DAS and Performance Insights icons (27 Oct). */
export const NimbusBrandIcons: Story = { name: "Nimbus Brand Icons", render: () => <NimbusBrandIconsPage /> };
