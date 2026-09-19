import type { ReactNode } from "react";
import { Film02, Image01, Trash01, UploadCloud02 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { PINK } from "../../das-shell";
import type { Creative, FormatId } from "../studio-data";

/**
 * CreativeFields — everything that shows up in the ad: advertiser, logo, artwork or
 * video, headline, body, call to action and click-through. Each field names where it
 * appears, and the preview beside it updates as you type.
 */

const UploadTile = ({ label, hint, file, icon, onUpload, onRemove, error }: { label: string; hint: string; file?: string; icon: ReactNode; onUpload?: () => void; onRemove?: () => void; error?: string }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        {file ? (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-secondary">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-fg-quaternary">{icon}</span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-primary">{file}</span>
                    <span className="text-xs text-tertiary">Uploaded · checked</span>
                </span>
                <button type="button" aria-label={`Remove ${file}`} onClick={onRemove} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                    <Trash01 className="size-4" aria-hidden="true" />
                </button>
            </div>
        ) : (
            <button
                type="button"
                onClick={onUpload}
                className={cx("flex flex-col items-center gap-1 rounded-xl border border-dashed px-4 py-5 text-center transition-colors hover:bg-primary_hover", error ? "border-error_subtle" : "border-secondary")}
                style={error ? { backgroundColor: `${PINK}0a` } : undefined}
            >
                <UploadCloud02 className="size-5 text-fg-quaternary" aria-hidden="true" />
                <span className="text-sm">
                    <span className="font-semibold" style={{ color: PINK }}>
                        Click to upload
                    </span>{" "}
                    <span className="text-tertiary">or drag and drop</span>
                </span>
                <span className="text-xs text-tertiary">{hint}</span>
            </button>
        )}
        {error && <span className="text-sm text-error-primary">{error}</span>}
    </div>
);

const ctas = ["Learn more", "Shop now", "Install", "Sign up", "Watch more"];

export const CreativeFields = ({ format, value, onChange, errors = {} }: { format: FormatId; value: Creative; onChange?: (p: Partial<Creative>) => void; errors?: Partial<Record<"brand" | "media", string>> }) => {
    const set = (p: Partial<Creative>) => onChange?.(p);
    const video = format === "rewarded";
    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-4">
                <h3 className="text-md font-semibold text-primary">Advertiser</h3>
                <Input label="Advertiser name" size="md" placeholder="Shown on the ad" value={value.brand} onChange={(brand) => set({ brand })} isInvalid={Boolean(errors.brand)} hint={errors.brand} />
                <UploadTile label="Logo" hint="Square PNG or JPG, at least 200×200" file={value.logo} icon={<Image01 className="size-4" />} onUpload={() => set({ logo: "logo.png" })} onRemove={() => set({ logo: undefined })} />
            </section>

            <section className="flex flex-col gap-4">
                <h3 className="text-md font-semibold text-primary">{video ? "Video" : "Artwork"}</h3>
                {video ? (
                    <UploadTile
                        label="Video"
                        hint="MP4 or MOV · 15–30s · 9:16 or 16:9 · under 30 MB"
                        file={value.video}
                        icon={<Film02 className="size-4" />}
                        onUpload={() => set({ video: "promo-15s.mp4" })}
                        onRemove={() => set({ video: undefined })}
                        error={errors.media}
                    />
                ) : (
                    <UploadTile
                        label="Image"
                        hint={format === "banner" ? "320×50 and 300×250 PNG/JPG" : format === "native" ? "1200×628 JPG, no text on the image" : "1080×1920 PNG/JPG or HTML5"}
                        file={value.image}
                        icon={<Image01 className="size-4" />}
                        onUpload={() => set({ image: "hero.jpg" })}
                        onRemove={() => set({ image: undefined })}
                        error={errors.media}
                    />
                )}
                {video && (
                    <UploadTile label="End card image (optional)" hint="Shown after the video, with your call to action" file={value.image} icon={<Image01 className="size-4" />} onUpload={() => set({ image: "end-card.jpg" })} onRemove={() => set({ image: undefined })} />
                )}
            </section>

            <section className="flex flex-col gap-4">
                <h3 className="text-md font-semibold text-primary">Message</h3>
                <Input label="Headline" size="md" placeholder="Up to 40 characters" value={value.headline} onChange={(headline) => set({ headline: headline.slice(0, 40) })} hint={`${value.headline.length}/40`} />
                {format !== "banner" && <Input label="Description" size="md" placeholder="One or two short sentences" value={value.body} onChange={(body) => set({ body: body.slice(0, 90) })} hint={`${value.body.length}/90`} />}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-secondary">Call to action</span>
                    <div className="flex flex-wrap gap-2">
                        {ctas.map((c) => (
                            <button
                                key={c}
                                type="button"
                                aria-pressed={value.cta === c}
                                onClick={() => set({ cta: c })}
                                className={cx("rounded-full px-3 py-1.5 text-sm font-semibold", value.cta === c ? "bg-[#101828] text-white" : "bg-secondary text-secondary hover:bg-tertiary")}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                <Input label="Click-through URL" size="md" placeholder="https://" value={value.url} onChange={(url) => set({ url })} />
            </section>
        </div>
    );
};
