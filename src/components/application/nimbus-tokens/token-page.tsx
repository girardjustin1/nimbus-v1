import type { ReactNode } from "react";

/**
 * Nimbus Tokens — chrome for the token stories.
 *
 * The tokens live in prototypes/das/v5/screens/nimbus-ui.tsx (Round 5, 26 Oct review);
 * these stories only show them. Bands and tables cancel the page's px-8 to run full
 * bleed, so every story renders inside the same 32px page gutter the DAS screens use.
 */

export const protoHref = (route: string) => {
    const local = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    return `${local ? "http://localhost:5190/" : "./"}das/v5/#/${route}`;
};

/** The DAS content area: white, with the 32px gutter bands and tables bleed out of. */
export const TokenPage = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-6 bg-primary px-8 py-8">{children}</div>;

/** A one-line rule above an example: what it is and where v5 uses it. */
export const Rule = ({ title, children, route }: { title: string; children: ReactNode; route?: string }) => (
    <div className="flex flex-col gap-1">
        <p className="text-md font-bold text-primary">{title}</p>
        <p className="text-md text-tertiary">
            {children}
            {route && (
                <>
                    {" "}
                    <a href={protoHref(route)} target="_blank" rel="noreferrer" className="font-semibold" style={{ color: "#A94579" }}>
                        See it in v5 ↗
                    </a>
                </>
            )}
        </p>
    </div>
);
