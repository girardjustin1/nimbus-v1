import { useState } from "react";
import { ChevronLeft, ChevronRight, Link01, Phone01, Tablet01, XClose } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { TEAL } from "../../das-shell";
import type { Creative, FormatId } from "../studio-data";
import { AdPreview, type PreviewDevice, type PreviewMoment } from "./ad-preview";

/**
 * PreviewStage — the full-screen "final render". Steps through every moment of the
 * format (e.g. video playing → end card; banner → medium rectangle), switches device,
 * and shows the render status and a shareable preview link.
 */

/** "Sep 21, 2026 · 6:24 PM UTC" for right now. */
const previewStamp = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
    return `${day} · ${time} UTC`;
};

const momentsFor = (f: FormatId): { id: PreviewMoment; label: string }[] =>
    f === "banner"
        ? [
              { id: "default", label: "Banner · 320×50" },
              { id: "mrec", label: "Medium rectangle · 300×250" },
          ]
        : f === "rewarded"
          ? [
                { id: "default", label: "Video playing" },
                { id: "end-card", label: "End card" },
            ]
          : [{ id: "default", label: f === "native" ? "In the feed" : "Full screen" }];

export const PreviewStage = ({
    format,
    creative,
    title,
    initialDevice = "phone",
    initialMoment = 0,
    status = "ready",
    closeHref,
}: {
    format: FormatId;
    creative: Creative;
    title: string;
    initialDevice?: PreviewDevice;
    initialMoment?: number;
    status?: "processing" | "ready";
    closeHref?: string;
}) => {
    const [device, setDevice] = useState<PreviewDevice>(initialDevice);
    const moments = momentsFor(format);
    const [i, setI] = useState(Math.min(initialMoment, moments.length - 1));
    const m = moments[i];
    return (
        <div className="flex min-h-[760px] flex-col bg-primary">
            <header className="flex items-center justify-between gap-4 border-b border-secondary px-6 py-3">
                <div className="flex items-center gap-1 rounded-lg bg-secondary p-0.5">
                    {(
                        [
                            { id: "phone", icon: Phone01 },
                            { id: "tablet", icon: Tablet01 },
                        ] as const
                    ).map((d) => (
                        <button
                            key={d.id}
                            type="button"
                            aria-label={`Preview on ${d.id}`}
                            aria-pressed={device === d.id}
                            onClick={() => setDevice(d.id)}
                            className={cx("rounded-md p-1.5", device === d.id ? "bg-primary text-fg-primary shadow-xs" : "text-fg-quaternary")}
                        >
                            <d.icon className="size-4" aria-hidden="true" />
                        </button>
                    ))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    <span className="text-xs text-tertiary">Preview as of {previewStamp()}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: status === "ready" ? "#1F7F80" : "#B54708" }}>
                        <span className={cx("size-2 rounded-full", status === "processing" && "animate-pulse")} style={{ backgroundColor: status === "ready" ? TEAL : "#F79009" }} />
                        {status === "ready" ? "Ready" : "Processing"}
                    </span>
                    {closeHref && (
                        <a href={closeHref} aria-label="Close preview" className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                            <XClose className="size-5" aria-hidden="true" />
                        </a>
                    )}
                </div>
            </header>

            <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-secondary/40 px-6 py-10">
                <span className="text-sm font-semibold text-secondary">{m.label}</span>
                <div className="flex items-center gap-8">
                    <button type="button" aria-label="Previous moment" disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-full p-2 text-fg-secondary hover:bg-primary disabled:opacity-25">
                        <ChevronLeft className="size-6" aria-hidden="true" />
                    </button>
                    <AdPreview format={format} creative={creative} device={device} moment={m.id} />
                    <button type="button" aria-label="Next moment" disabled={i === moments.length - 1} onClick={() => setI(i + 1)} className="rounded-full p-2 text-fg-secondary hover:bg-primary disabled:opacity-25">
                        <ChevronRight className="size-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                    {moments.map((x, j) => (
                        <span key={x.id} className={cx("size-1.5 rounded-full", j === i ? "bg-fg-primary" : "bg-quaternary")} />
                    ))}
                </div>
                <p className="flex max-w-md items-center gap-2 text-center text-xs text-tertiary">
                    <Link01 className="size-4 shrink-0" aria-hidden="true" />
                    This preview shows how the ad renders in a Nimbus-served app. Anyone with the preview link can see it.
                </p>
            </div>
        </div>
    );
};
