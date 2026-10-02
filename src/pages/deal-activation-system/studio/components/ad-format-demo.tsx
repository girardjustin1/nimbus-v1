import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/base/buttons/button";
import mrec from "../assets/banner-mrec.svg?raw";
import banner from "../assets/banner.svg?raw";
import interstitial from "../assets/interstitial.svg?raw";
import native from "../assets/native.svg?raw";
import endCard from "../assets/rewarded-end-card.svg?raw";
import rewarded from "../assets/rewarded.svg?raw";
import type { FormatId } from "../studio-data";
import "./ad-format-demo.css";
import type { PreviewMoment } from "./ad-preview";
import { DeviceFrame, type PreviewDevice } from "./device-frame";

const assets = { banner, interstitial, rewarded, native };
const descriptions: Record<FormatId, string> = {
    banner: "A slim ad stays anchored while people browse the app.",
    interstitial: "A full-screen ad opens, then closes back to the app.",
    rewarded: "Choose to watch, follow the progress, then earn 100 points in your account.",
    native: "Scroll into view, reveal the artwork, then pause to take it in.",
};
const subscribeToMotion = (notify: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", notify);
    return () => query.removeEventListener("change", notify);
};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Static, trusted SVG assets with isolated IDs, controllable CSS timelines and no timers. */
export const AdFormatDemo = ({
    format,
    device = "phone",
    moment = "default",
    scale = 1,
    fitViewport = false,
    bare = false,
}: {
    format: FormatId;
    device?: PreviewDevice;
    moment?: PreviewMoment;
    scale?: number;
    fitViewport?: boolean;
    /** Artwork only — no caption, no play controls. For grids where the demo is a thumbnail. */
    bare?: boolean;
}) => {
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const [paused, setPaused] = useState(false);
    const [replay, setReplay] = useState(0);
    const reduce = useSyncExternalStore(subscribeToMotion, reducedMotion, () => false);
    const source = format === "banner" && moment === "mrec" ? mrec : format === "rewarded" && moment === "end-card" ? endCard : assets[format];
    const svg = useMemo(() => {
        const isolated = source
            .replaceAll("demo-", `ad-${id}-`)
            .replaceAll(`class="ad-${id}-`, 'class="demo-')
            .replaceAll(` .ad-${id}-`, " .demo-")
            .replace('width="280" height="580" role="img"', 'width="100%" height="100%" aria-hidden="true"');
        return device === "tablet" ? isolated.replace('viewBox="0 0 280 580"', 'viewBox="10 10 260 560" preserveAspectRatio="none"') : isolated;
    }, [source, id, device]);
    const description =
        format === "banner" && moment === "mrec"
            ? "A larger ad sits between the app’s content cards."
            : format === "rewarded" && moment === "end-card"
              ? "A points burst celebrates the reward as the account balance counts up."
              : descriptions[format];
    const artwork = (
        <div
            key={`${source === mrec ? "mrec" : source === endCard ? "end-card" : format}-${replay}`}
            className="ad-format-demo h-full w-full"
            data-device={device}
            data-paused={paused || reduce}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
    const label = `${format} ad format demonstration on ${device}. ${description}`;
    return (
        <figure className="flex flex-col items-center gap-3" data-format-demo={format}>
            {device === "tablet" ? (
                <DeviceFrame device={device} scale={scale} label={label}>
                    {artwork}
                </DeviceFrame>
            ) : (
                <div
                    role="img"
                    aria-label={label}
                    className="aspect-[280/580] max-w-full drop-shadow-[0_18px_24px_rgba(16,24,40,0.18)]"
                    style={{ width: bare ? "100%" : fitViewport ? `min(${280 * scale}px, calc(max(220px, 100dvh - 400px) * 0.48276))` : 280 * scale }}
                >
                    {artwork}
                </div>
            )}
            {!bare && <figcaption className="max-w-[300px] text-center text-xs leading-relaxed text-secondary">{description}</figcaption>}
            {!bare && (
            <div className="flex items-center gap-2">
                {reduce ? (
                    <span className="text-xs text-tertiary">Reduced motion enabled</span>
                ) : (
                    <>
                        <Button
                            size="sm"
                            color="tertiary"
                            aria-label={paused ? "Play format animation" : "Pause format animation"}
                            onClick={() => setPaused(!paused)}
                        >
                            {paused ? "Play" : "Pause"}
                        </Button>
                        <Button
                            size="sm"
                            color="tertiary"
                            aria-label="Replay format animation"
                            onClick={() => {
                                setReplay(replay + 1);
                                setPaused(false);
                            }}
                        >
                            Replay
                        </Button>
                    </>
                )}
            </div>
            )}
        </figure>
    );
};
