import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressIconType } from "@/components/application/progress-steps/progress-types";
import { cx } from "@/utils/cx";

/**
 * Campaign Setup wizard — shared shell.
 *
 * Rebuilds the "Deal Activation Setup" campaign wizard from the reference
 * (reference/screens/Campaign Setup V2). Every step reuses this one layout so
 * the Global Nav, "Your Account" header, Create/View Campaigns tab strip, the
 * horizontal progress stepper and the sticky Back/Continue footer stay
 * identical across all eight screens — only the step body changes.
 *
 * Nimbus teal chrome accent (tabs) uses the same fixed teal as the Global Nav.
 */

const TEAL = "#37b6b7";

/** Ordered wizard steps + the short descriptions shown under each stepper node. */
const WIZARD_STEPS = [
    { title: "Targeting", description: "Deal, geos & apps" },
    { title: "Budget", description: "Spend & schedule" },
    { title: "Priority", description: "Auction rules" },
    { title: "Creative", description: "Ad assets" },
    { title: "Review", description: "Publish" },
] as const;

/** Build the progress-steps items for a given active step index (0-based). */
const buildStepItems = (currentStep: number): ProgressIconType[] =>
    WIZARD_STEPS.map((step, index) => ({
        title: step.title,
        description: step.description,
        status: index < currentStep ? "complete" : index === currentStep ? "current" : "incomplete",
    }));

/* ------------------------------------------------------------------ Tabs --- */

const Tab = ({ label, isActive }: { label: string; isActive?: boolean }) => (
    <button
        type="button"
        className={cx(
            "-mb-px border-b-2 px-6 py-4 text-md font-semibold transition-colors duration-100 ease-linear",
            isActive ? "border-current" : "border-transparent hover:opacity-80",
        )}
        style={{ color: TEAL, backgroundColor: isActive ? `${TEAL}14` : undefined }}
        aria-current={isActive ? "page" : undefined}
    >
        {label}
    </button>
);

/* ---------------------------------------------------------------- Footer --- */

export interface WizardFooterProps {
    /** Previous-step label; omit to hide the back button (first step). */
    backLabel?: string;
    /** Next-step label; omit to hide the continue button (last step). */
    nextLabel?: string;
    /** Extra actions rendered before the continue button (e.g. Publish variants). */
    extra?: ReactNode;
}

export const WizardFooter = ({ backLabel, nextLabel, extra }: WizardFooterProps) => (
    <footer className="sticky bottom-0 z-10 flex items-center justify-between border-t border-secondary bg-primary px-8 py-4">
        <div>
            {backLabel && (
                <Button color="primary-pink" iconLeading={ArrowLeft} className="uppercase">
                    {backLabel}
                </Button>
            )}
        </div>
        <div className="flex items-center gap-3">
            {extra}
            {nextLabel && (
                <Button color="primary-pink" iconTrailing={ArrowRight} className="uppercase">
                    {nextLabel}
                </Button>
            )}
        </div>
    </footer>
);

/* ---------------------------------------------------------------- Layout --- */

export interface CampaignSetupLayoutProps {
    /** Active step index into WIZARD_STEPS (0-based). */
    currentStep: number;
    /** Step body content. */
    children: ReactNode;
    /** Back/Continue footer (usually a <WizardFooter/>). */
    footer: ReactNode;
}

export const CampaignSetupLayout = ({ currentStep, children, footer }: CampaignSetupLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="deal activation setup" />

            <main className="flex flex-1 flex-col overflow-x-hidden">
                {/* App header */}
                <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-5">
                    <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                    <ChevronDown className="size-6 text-[#DA6EA3]" aria-hidden="true" />
                </header>

                {/* Create / View tabs */}
                <div className="flex items-stretch border-b border-secondary bg-primary px-8">
                    <Tab label="Create Campaigns" isActive />
                    <Tab label="View Campaigns" />
                </div>

                {/* Progress stepper */}
                <div className="border-b border-secondary bg-primary px-8 py-5">
                    <div className="mx-auto max-w-4xl">
                        <Progress.IconsWithText type="number" orientation="horizontal" size="sm" items={buildStepItems(currentStep)} />
                    </div>
                </div>

                {/* Step body */}
                <div className="flex-1">
                    <div className="mx-auto w-full max-w-5xl px-8 py-8">{children}</div>
                </div>

                {footer}
            </main>
        </div>
    );
};

export default CampaignSetupLayout;
