import type { ReactNode } from "react";
import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { TEAL } from "../../das-shell";

/**
 * StudioShell — a focused, full-screen builder: a slim top bar with the task and a
 * close, a left step rail, the form in the middle, an optional right panel (estimates
 * or the live preview) and a sticky Back / Next footer.
 */
export const StudioShell = ({
    title,
    account = "Pocket Garden Media",
    rail,
    aside,
    children,
    backHref,
    nextHref,
    nextLabel = "Next",
    onNext,
    closeHref,
    footerNote,
    wideAside,
}: {
    title: string;
    account?: string;
    rail?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
    backHref?: string;
    nextHref?: string;
    nextLabel?: string;
    onNext?: () => void;
    closeHref?: string;
    footerNote?: ReactNode;
    /** Give the right panel room for a device preview. */
    wideAside?: boolean;
}) => (
    <div className="flex min-h-screen flex-col bg-primary">
        <header className="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center border-b border-secondary bg-primary px-6 py-3">
            <span className="flex items-center gap-2 text-sm">
                <span className="flex size-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: TEAL }}>
                    N
                </span>
                <span className="flex flex-col leading-tight">
                    <span className="font-semibold text-primary">Deal Activation</span>
                    <span className="text-xs text-tertiary">{account}</span>
                </span>
            </span>
            <span className="text-md font-semibold text-primary">{title}</span>
            <span className="flex justify-end">
                <a href={closeHref} aria-label="Close" className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                    <XClose className="size-5" aria-hidden="true" />
                </a>
            </span>
        </header>

        <div className={cx("mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-8 px-6 py-8", aside ? (wideAside ? "lg:grid-cols-[220px_minmax(0,1fr)_340px]" : "lg:grid-cols-[220px_minmax(0,1fr)_300px]") : "lg:grid-cols-[220px_minmax(0,1fr)]")}>
            <div className="hidden lg:block">
                <div className="sticky top-20">{rail}</div>
            </div>
            <main className="min-w-0">{children}</main>
            {aside && (
                <div>
                    <div className="sticky top-20">{aside}</div>
                </div>
            )}
        </div>

        <footer className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t border-secondary bg-primary px-6 py-3">
            {backHref ? (
                <Button color="secondary" href={backHref}>
                    Back
                </Button>
            ) : (
                <span />
            )}
            <span className="text-sm text-tertiary">{footerNote}</span>
            <Button color="primary-pink" href={onNext ? undefined : nextHref} onClick={onNext}>
                {nextLabel}
            </Button>
        </footer>
    </div>
);
