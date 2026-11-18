import { ArrowLeft } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { TEAL } from "../das-shell";
import { ROUTES } from "../nav";
import { TEAL_DARK } from "../nimbus-ui";
import { HEADLINE } from "../type-rules";

/** Status dot colours used across Demand (Running teal, as everywhere in the app). */
const DOT: Record<string, string> = {
    Running: TEAL,
    Paused: "#98A2B3",
    Unsubmitted: "#F38744",
    Submitted: "#F79009",
    Paid: TEAL,
};

export const DemandStatus = ({ status }: { status: string }) => (
    <span className="inline-flex items-center gap-2 text-md whitespace-nowrap text-primary">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: DOT[status] ?? "#98A2B3" }} aria-hidden="true" />
        {status}
    </span>
);

/** Staging's breadcrumb on a partner's configuration: "← Configure Demand : <partner> Configuring For Nimbus Core". */
export const ConfigureCrumb = ({ partner }: { partner: string }) => (
    <div className="flex flex-wrap items-center gap-x-2 border-b border-secondary px-8 py-5 text-lg">
        <a href={ROUTES.configureDemand} className={cx("inline-flex items-center gap-1.5 font-bold hover:underline")} style={{ color: TEAL_DARK }}>
            <ArrowLeft className="size-5" aria-hidden="true" />
            Configure Demand
        </a>
        <span className={cx("text-primary", HEADLINE)}>: {partner} Configuring For Nimbus Core</span>
    </div>
);
