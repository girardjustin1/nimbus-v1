import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type PreviewDevice = "phone" | "tablet";

const devices = {
    phone: { width: 280, height: 580, radius: 40, bezel: 10 },
    tablet: { width: 460, height: 600, radius: 28, bezel: 14 },
};

export const DeviceFrame = ({
    device = "phone",
    scale = 1,
    label,
    className,
    children,
}: {
    device?: PreviewDevice;
    scale?: number;
    label: string;
    className?: string;
    children: ReactNode;
}) => {
    const d = devices[device];
    return (
        <div className={cx("relative shrink-0", className)} style={{ width: d.width * scale, height: d.height * scale }} aria-label={label} role="img">
            <div
                className="absolute top-0 left-0 origin-top-left bg-[#101828] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.35)]"
                style={{ width: d.width, height: d.height, borderRadius: d.radius, padding: d.bezel, transform: `scale(${scale})` }}
            >
                <div className="relative h-full w-full overflow-hidden bg-white" style={{ borderRadius: d.radius - d.bezel }}>
                    {children}
                    {device === "phone" && (
                        <span aria-hidden="true" className="absolute top-1.5 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#101828]" />
                    )}
                </div>
            </div>
        </div>
    );
};
