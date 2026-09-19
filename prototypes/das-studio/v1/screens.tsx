import { studioPresets as p } from "@/pages/deal-activation-system/studio/studio-data";
import {
    AudienceScreen,
    BudgetScreen,
    CreativeScreen,
    DealScreen,
    GoalScreen,
    PreviewScreen,
    PublishedScreen,
    ReviewScreen,
} from "@/pages/deal-activation-system/studio/studio-screens";
import type { ProtoScreen } from "../../shared/prototype-frame";

/**
 * DAS Studio prototype v1 — screen registry.
 * Screens come from src/pages/deal-activation-system/studio (also in Storybook under
 * Deal Activation System › Studio Concept). Back / Next keep your choices between steps;
 * opening a link directly starts from that screen's sample state.
 */
export const screens: ProtoScreen[] = [
    { id: "start", area: "1 · Goal", title: "Start from scratch", description: "Empty draft: pick a goal (Next without one shows the error).", render: () => <GoalScreen preset={p.empty} /> },
    { id: "goal", area: "1 · Goal", title: "Goal chosen", description: "Four visual goal tiles; Price priority selected.", render: () => <GoalScreen /> },
    { id: "goal-error", area: "1 · Goal", title: "Next without a goal", description: "Tiles outlined, message under them.", render: () => <GoalScreen preset={p.empty} attempted /> },

    { id: "deal", area: "2 · Deal & campaign", title: "Deal & campaign", description: "Existing deal, campaign name, live estimate panel.", render: () => <DealScreen /> },

    { id: "audience", area: "3 · Audience", title: "Audience", description: "Geos, apps, platforms, keywords; estimates update as you click.", render: () => <AudienceScreen /> },
    { id: "audience-narrow", area: "3 · Audience", title: "Too narrow", description: "ALL of 3 keywords on one app: delivery likelihood drops.", render: () => <AudienceScreen preset={p.narrow} /> },

    { id: "budget", area: "4 · Budget & schedule", title: "Budget, bid & schedule", description: "Format, bid on its recommended range, calendar pickers.", render: () => <BudgetScreen /> },
    { id: "budget-low-bid", area: "4 · Budget & schedule", title: "Bid below range", description: "Marker turns pink; estimate advises raising it.", render: () => <BudgetScreen preset={p.lowBid} /> },
    { id: "budget-calendar", area: "4 · Budget & schedule", title: "Start-date calendar open", description: "Past dates can't be picked.", render: () => <BudgetScreen openCalendar="start" /> },
    { id: "budget-fallback", area: "4 · Budget & schedule", title: "Fallback goal", description: "No budget or bid, dates only.", render: () => <BudgetScreen preset={p.fallback} /> },

    { id: "creative-empty", area: "5 · Creative & preview", title: "Nothing added yet", description: "Preview shows where each piece will go.", render: () => <CreativeScreen preset={p.noCreative} /> },
    { id: "creative", area: "5 · Creative & preview", title: "Interstitial", description: "Full-screen render updates as you type.", render: () => <CreativeScreen /> },
    { id: "creative-banner", area: "5 · Creative & preview", title: "Banner", description: "320×50 in the app, switch to 300×250.", render: () => <CreativeScreen preset={p.banner} /> },
    { id: "creative-rewarded", area: "5 · Creative & preview", title: "Rewarded video", description: "Video playing, with the end card one tap away.", render: () => <CreativeScreen preset={p.rewarded} /> },
    { id: "creative-rewarded-end", area: "5 · Creative & preview", title: "Rewarded video · end card", description: "Reward earned, call to action.", render: () => <CreativeScreen preset={p.rewarded} moment="end-card" /> },
    { id: "creative-native", area: "5 · Creative & preview", title: "Native", description: "In-feed card matching the app's own posts.", render: () => <CreativeScreen preset={p.native} /> },

    { id: "review", area: "6 · Review & publish", title: "Ready to publish", description: "Hero summary with a small render; one section per step.", render: () => <ReviewScreen /> },
    { id: "review-errors", area: "6 · Review & publish", title: "Publish pressed with problems", description: "Missing end date and artwork flagged in rail, banner and sections.", render: () => <ReviewScreen preset={p.incomplete} attempted /> },
    { id: "published", area: "6 · Review & publish", title: "Published", description: "Scheduled, with the final render.", render: () => <PublishedScreen /> },

    { id: "preview", area: "Full-screen preview", title: "Interstitial on phone", description: "Final render with status and share note.", render: () => <PreviewScreen /> },
    { id: "preview-tablet", area: "Full-screen preview", title: "Interstitial on tablet", description: "Same creative, larger screen.", render: () => <PreviewScreen device="tablet" /> },
    { id: "preview-banner", area: "Full-screen preview", title: "Banner moments", description: "Step from 320×50 to 300×250.", render: () => <PreviewScreen preset={p.banner} /> },
    { id: "preview-rewarded", area: "Full-screen preview", title: "Rewarded · end card", description: "Second moment of the video.", render: () => <PreviewScreen preset={p.rewarded} moment={1} /> },
    { id: "preview-processing", area: "Full-screen preview", title: "Still processing", description: "Status while the video transcodes.", render: () => <PreviewScreen preset={p.native} status="processing" /> },
];
