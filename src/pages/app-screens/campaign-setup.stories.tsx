import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    Step1Targeting,
    Step1TargetingCountries,
    Step2Budget,
    Step2BudgetSchedule,
    Step3Priority,
    Step4Creative,
    Step5Review,
    Step5ReviewErrors,
} from "./campaign-setup";

/**
 * Deal Activation → Campaign Setup wizard.
 *
 * An 8-screen campaign-setup flow rebuilt from the Nimbus reference. Every story
 * shares one <CampaignSetupLayout/> (Global Nav + Create/View tabs + horizontal
 * progress stepper + sticky Back/Continue footer); only the step body changes.
 */
const meta = {
    title: "App Screens/Campaign Setup",
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Step 1 — Targeting: Deal ID, Campaign Name, Geos (All), Platform, Apps. */
export const Step1Objective: Story = { render: () => <Step1Targeting /> };

/** Step 1 — Targeting with the "Specify Countries" geo cascade expanded + targeted apps. */
export const Step1TargetingCountriesGeo: Story = { render: () => <Step1TargetingCountries /> };

/** Step 2 — Budget: spend, bid (eCPM), flight-date summary, daily impression cap. */
export const Step2Budget_: Story = { render: () => <Step2Budget /> };

/** Step 2 — Budget with the flight-date range picker open. */
export const Step2Schedule: Story = { render: () => <Step2BudgetSchedule /> };

/** Step 3 — Priority: auction rules + campaign priority. */
export const Step3Priority_: Story = { render: () => <Step3Priority /> };

/** Step 4 — Creative: add existing assets + creative list. */
export const Step4Creative_: Story = { render: () => <Step4Creative /> };

/** Step 5 — Review: setup / budget / creative summary before publishing. */
export const Step5Review_: Story = { render: () => <Step5Review /> };

/** Step 5 — Review with validation errors surfaced (missing budget + invalid markup). */
export const Step5ReviewErrors_: Story = { render: () => <Step5ReviewErrors /> };
