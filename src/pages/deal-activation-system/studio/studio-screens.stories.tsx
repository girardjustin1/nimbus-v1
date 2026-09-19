import type { Meta, StoryObj } from "@storybook/react-vite";
import { studioPresets as p } from "./studio-data";
import { AudienceScreen, BudgetScreen, CreativeScreen, DealScreen, GoalScreen, PreviewScreen, PublishedScreen, ReviewScreen } from "./studio-screens";

/**
 * DAS Studio · Screens — the guided builder, step by step. The same screens run as a
 * clickable prototype at /das-studio/, where Back / Next carry your choices through.
 */
const meta = {
    title: "Deal Activation System/Studio Concept/Screens",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1GoalEmpty: Story = { name: "1 · Goal (empty)", render: () => <GoalScreen preset={p.empty} /> };
export const Step1Goal: Story = { name: "1 · Goal chosen", render: () => <GoalScreen /> };
export const Step1GoalError: Story = { name: "1 · Next without a goal", render: () => <GoalScreen preset={p.empty} attempted /> };
export const Step2Deal: Story = { name: "2 · Deal & campaign", render: () => <DealScreen /> };
export const Step3Audience: Story = { name: "3 · Audience", render: () => <AudienceScreen /> };
export const Step3AudienceNarrow: Story = { name: "3 · Audience too narrow", render: () => <AudienceScreen preset={p.narrow} /> };
export const Step4Budget: Story = { name: "4 · Budget, bid & schedule", render: () => <BudgetScreen /> };
export const Step4LowBid: Story = { name: "4 · Bid below range", render: () => <BudgetScreen preset={p.lowBid} /> };
export const Step4Fallback: Story = { name: "4 · Fallback goal", render: () => <BudgetScreen preset={p.fallback} /> };
export const Step5CreativeEmpty: Story = { name: "5 · Creative (nothing added)", render: () => <CreativeScreen preset={p.noCreative} /> };
export const Step5Interstitial: Story = { name: "5 · Creative · Interstitial", render: () => <CreativeScreen /> };
export const Step5Banner: Story = { name: "5 · Creative · Banner", render: () => <CreativeScreen preset={p.banner} /> };
export const Step5Rewarded: Story = { name: "5 · Creative · Rewarded video", render: () => <CreativeScreen preset={p.rewarded} /> };
export const Step5Native: Story = { name: "5 · Creative · Native", render: () => <CreativeScreen preset={p.native} /> };
export const Step6Review: Story = { name: "6 · Review", render: () => <ReviewScreen /> };
export const Step6ReviewErrors: Story = { name: "6 · Review with problems", render: () => <ReviewScreen preset={p.incomplete} attempted /> };
export const Published: Story = { name: "Published", render: () => <PublishedScreen /> };
export const FullPreview: Story = { name: "Full-screen preview", render: () => <PreviewScreen /> };
export const FullPreviewRewardedEnd: Story = { name: "Full-screen preview · rewarded end card", render: () => <PreviewScreen preset={p.rewarded} moment={1} /> };
