import type { CSSProperties, ReactNode } from "react";
import { CheckCircle, Home02, Sun, SearchLg, User01, VolumeX, XClose } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { Creative, FormatId } from "../studio-data";

/**
 * AdPreview — renders the creative the way a user will see it, inside a device frame
 * running a sample host app. One component covers every format and the key moments of
 * each (banner vs medium rectangle, video playing vs end card).
 */

export type PreviewDevice = "phone" | "tablet";
export type PreviewMoment = "default" | "mrec" | "end-card";

export interface AdPreviewProps {
    format: FormatId;
    creative: Creative;
    device?: PreviewDevice;
    moment?: PreviewMoment;
    /** Scale the whole device (1 = 280px wide phone). */
    scale?: number;
    className?: string;
}

const hasContent = (c: Creative) => Boolean(c.brand || c.headline || c.image || c.video);

/** Sample artwork drawn from the brand palette (stands in for the uploaded image). */
export const CreativeArt = ({ creative, className, style, children }: { creative: Creative; className?: string; style?: CSSProperties; children?: ReactNode }) => {
    const [a, b] = creative.palette;
    const empty = !creative.image && !creative.video;
    if (empty)
        return (
            <div className={cx("flex items-center justify-center border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] text-[11px] font-medium text-[#98A2B3]", className)} style={style}>
                {children ?? "Your image"}
            </div>
        );
    return (
        <div className={cx("relative overflow-hidden", className)} style={{ background: `linear-gradient(145deg, ${a}, ${b})`, ...style }}>
            <span className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full opacity-40" style={{ background: `radial-gradient(circle, #ffffff66, transparent 70%)` }} />
            <span className="absolute -bottom-1/3 -left-1/5 h-2/3 w-[140%] rotate-[-12deg] opacity-30" style={{ background: b }} />
            <span className="absolute right-[12%] bottom-[14%] h-1/2 w-[34%] rounded-t-[40%] rounded-b-md opacity-90" style={{ background: `linear-gradient(180deg, #ffffffee, #ffffff99)` }} />
            <span className="absolute right-[18%] bottom-[40%] h-[8%] w-[22%] rounded-full opacity-80" style={{ background: a }} />
            {children}
        </div>
    );
};

const Logo = ({ creative, size = 28 }: { creative: Creative; size?: number }) => (
    <span
        className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.38, background: creative.brand ? creative.palette[1] : "#D0D5DD" }}
    >
        {creative.brand
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("") || "?"}
    </span>
);

const Line = ({ w, dark }: { w: string; dark?: boolean }) => <span className={cx("block h-2 rounded-full", dark ? "bg-white/25" : "bg-[#EAECF0]")} style={{ width: w }} />;

const Cta = ({ creative, block }: { creative: Creative; block?: boolean }) => (
    <span className={cx("rounded-full px-3 py-1.5 text-center text-[11px] font-bold text-white", block && "block w-full py-2.5 text-[13px]")} style={{ background: creative.palette[0] }}>
        {creative.cta || "Learn more"}
    </span>
);

/* ---------------------------------------------------------- Host app --- */

const feed = [
    { title: "Fall planting guide", tone: "#E3F5F5" },
    { title: "Tomatoes, week 12", tone: "#FEF6EE" },
    { title: "Your herb garden", tone: "#EEF4FF" },
];

const HostApp = ({ children, bottom }: { children?: ReactNode; bottom?: ReactNode }) => (
    <div className="flex h-full flex-col bg-white text-[#101828]">
        <div className="flex items-center justify-between px-4 pt-7 pb-2">
            <span className="flex items-center gap-1.5 text-[13px] font-bold">
                <Sun className="size-4 text-[#37B6B7]" aria-hidden="true" /> Pocket Garden
            </span>
            <SearchLg className="size-4 text-[#667085]" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-2.5 overflow-hidden px-4 py-2">
            <div className="flex gap-1.5">
                {["For you", "Veg", "Herbs", "Tools"].map((t, i) => (
                    <span key={t} className={cx("rounded-full px-2 py-0.5 text-[10px] font-semibold", i === 0 ? "bg-[#101828] text-white" : "bg-[#F2F4F7] text-[#475467]")}>
                        {t}
                    </span>
                ))}
            </div>
            {children ??
                feed.map((f) => (
                    <div key={f.title} className="flex gap-2.5 rounded-xl p-2" style={{ background: f.tone }}>
                        <span className="size-12 shrink-0 rounded-lg bg-white/70" />
                        <span className="flex flex-1 flex-col justify-center gap-1.5">
                            <span className="text-[11px] font-semibold">{f.title}</span>
                            <Line w="80%" />
                        </span>
                    </div>
                ))}
        </div>
        {bottom}
        <div className="flex justify-around border-t border-[#EAECF0] py-2 text-[#98A2B3]">
            <Home02 className="size-4 text-[#101828]" aria-hidden="true" />
            <SearchLg className="size-4" aria-hidden="true" />
            <Sun className="size-4" aria-hidden="true" />
            <User01 className="size-4" aria-hidden="true" />
        </div>
    </div>
);

/* ------------------------------------------------------------ Formats --- */

const Banner = ({ creative }: { creative: Creative }) => (
    <HostApp
        bottom={
            <div className="mx-2 mb-1.5 flex h-[46px] items-center gap-2 overflow-hidden rounded-md bg-white px-1.5 shadow-[0_0_0_1px_#EAECF0]">
                <CreativeArt creative={creative} className="h-9 w-12 shrink-0 rounded" />
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-bold">{creative.headline || "Your headline"}</span>
                    <span className="block truncate text-[9px] text-[#667085]">{creative.brand || "Advertiser"} · Ad</span>
                </span>
                <Cta creative={creative} />
            </div>
        }
    />
);

const Mrec = ({ creative }: { creative: Creative }) => (
    <HostApp>
        <div className="rounded-xl bg-[#E3F5F5] p-2">
            <span className="text-[11px] font-semibold">Fall planting guide</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="self-start text-[9px] font-semibold tracking-wide text-[#98A2B3] uppercase">Advertisement</span>
            <div className="relative flex aspect-[300/250] w-full flex-col overflow-hidden rounded-md shadow-[0_0_0_1px_#EAECF0]">
                <CreativeArt creative={creative} className="flex-1" />
                <div className="flex items-center gap-2 bg-white p-2">
                    <Logo creative={creative} size={22} />
                    <span className="min-w-0 flex-1 truncate text-[10px] font-bold">{creative.headline || "Your headline"}</span>
                    <Cta creative={creative} />
                </div>
            </div>
        </div>
        <div className="rounded-xl bg-[#FEF6EE] p-2">
            <span className="text-[11px] font-semibold">Tomatoes, week 12</span>
        </div>
    </HostApp>
);

const Interstitial = ({ creative }: { creative: Creative }) => (
    <div className="relative flex h-full flex-col bg-[#0C111D] text-white">
        <CreativeArt creative={creative} className="h-[58%]">
            <span className="absolute top-7 left-3 rounded bg-black/40 px-1.5 py-0.5 text-[9px] font-bold tracking-wide">AD</span>
            <span className="absolute top-6 right-3 flex size-7 items-center justify-center rounded-full bg-black/45 text-[10px] font-bold ring-2 ring-white/70">5</span>
        </CreativeArt>
        <div className="flex flex-1 flex-col gap-2.5 p-4">
            <span className="flex items-center gap-2">
                <Logo creative={creative} />
                <span className="text-[12px] font-semibold">{creative.brand || "Advertiser"}</span>
            </span>
            <span className="text-[17px] leading-tight font-bold">{creative.headline || <Line w="85%" dark />}</span>
            <span className="text-[11px] leading-snug text-white/70">
                {creative.body || (
                    <span className="flex flex-col gap-1.5">
                        <Line w="100%" dark />
                        <Line w="70%" dark />
                    </span>
                )}
            </span>
            <span className="mt-auto">
                <Cta creative={creative} block />
            </span>
        </div>
    </div>
);

const Rewarded = ({ creative, endCard }: { creative: Creative; endCard?: boolean }) =>
    endCard ? (
        <div className="relative flex h-full flex-col items-center justify-center gap-3 bg-[#0C111D] p-5 text-center text-white">
            <span className="absolute top-6 right-3 flex size-7 items-center justify-center rounded-full bg-white/15">
                <XClose className="size-4" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#37B6B7]/25 px-3 py-1 text-[10px] font-bold text-[#7FDADB]">
                <CheckCircle className="size-3.5" aria-hidden="true" /> Reward earned · 50 seeds
            </span>
            <CreativeArt creative={creative} className="aspect-square w-3/4 rounded-2xl" />
            <span className="flex items-center gap-2">
                <Logo creative={creative} />
                <span className="text-[12px] font-semibold">{creative.brand || "Advertiser"}</span>
            </span>
            <span className="text-[15px] leading-tight font-bold">{creative.headline || "Your headline"}</span>
            <span className="w-full">
                <Cta creative={creative} block />
            </span>
        </div>
    ) : (
        <div className="relative flex h-full flex-col bg-black text-white">
            <CreativeArt creative={{ ...creative, image: creative.video ?? creative.image }} className="flex-1">
                <span className="absolute top-7 left-3 rounded bg-black/40 px-1.5 py-0.5 text-[9px] font-bold tracking-wide">AD</span>
                <span className="absolute top-6 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold">Reward in 12s</span>
                <span className="absolute bottom-16 left-3 flex size-7 items-center justify-center rounded-full bg-black/40">
                    <VolumeX className="size-3.5" aria-hidden="true" />
                </span>
                {!creative.video && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white/80">Your 15–30s video</span>}
            </CreativeArt>
            <div className="h-1 bg-white/20">
                <div className="h-full w-[40%]" style={{ background: creative.palette[0] }} />
            </div>
            <div className="flex items-center gap-2 p-3">
                <Logo creative={creative} size={24} />
                <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{creative.brand || "Advertiser"}</span>
                <Cta creative={creative} />
            </div>
        </div>
    );

const Native = ({ creative }: { creative: Creative }) => (
    <HostApp>
        <div className="rounded-xl bg-[#E3F5F5] p-2">
            <span className="text-[11px] font-semibold">Fall planting guide</span>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-2 shadow-[0_0_0_1px_#EAECF0]">
            <span className="flex items-center gap-1.5">
                <Logo creative={creative} size={20} />
                <span className="text-[10px] font-semibold">{creative.brand || "Advertiser"}</span>
                <span className="text-[9px] text-[#98A2B3]">· Sponsored</span>
            </span>
            <CreativeArt creative={creative} className="aspect-[16/9] w-full rounded-lg" />
            <span className="text-[12px] leading-tight font-bold">{creative.headline || "Your headline"}</span>
            <span className="line-clamp-2 text-[10px] text-[#667085]">{creative.body || "Your description appears here, in the same style as the app's own posts."}</span>
            <span className="self-start">
                <Cta creative={creative} />
            </span>
        </div>
        <div className="rounded-xl bg-[#FEF6EE] p-2">
            <span className="text-[11px] font-semibold">Tomatoes, week 12</span>
        </div>
    </HostApp>
);

/* ------------------------------------------------------------- Device --- */

const DEVICE = {
    phone: { w: 280, h: 580, radius: 40, bezel: 10 },
    tablet: { w: 460, h: 600, radius: 28, bezel: 14 },
};

export const AdPreview = ({ format, creative, device = "phone", moment = "default", scale = 1, className }: AdPreviewProps) => {
    const d = DEVICE[device];
    const screen =
        format === "banner" ? (
            moment === "mrec" ? (
                <Mrec creative={creative} />
            ) : (
                <Banner creative={creative} />
            )
        ) : format === "interstitial" ? (
            <Interstitial creative={creative} />
        ) : format === "rewarded" ? (
            <Rewarded creative={creative} endCard={moment === "end-card"} />
        ) : (
            <Native creative={creative} />
        );
    return (
        <div className={cx("relative shrink-0", className)} style={{ width: d.w * scale, height: d.h * scale }} aria-label={`${format} ad preview on ${device}`} role="img">
            <div
                className="absolute top-0 left-0 origin-top-left bg-[#101828] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.35)]"
                style={{ width: d.w, height: d.h, borderRadius: d.radius, padding: d.bezel, transform: `scale(${scale})` }}
            >
                <div className="relative h-full w-full overflow-hidden bg-white" style={{ borderRadius: d.radius - d.bezel }}>
                    {screen}
                    {device === "phone" && <span className="absolute top-1.5 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#101828]" />}
                    {!hasContent(creative) && (
                        <span className="absolute inset-x-3 bottom-14 rounded-lg bg-[#101828]/85 px-3 py-2 text-center text-[10px] font-medium text-white">
                            Add your creative to see the real thing
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
