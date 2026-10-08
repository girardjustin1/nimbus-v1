/**
 * The named text styles in Prototype 3 (prototypes/das/v3), as measured on 8 Oct 2026
 * across all 43 screens. `className` is what the code uses; the specimen on the docs page
 * renders it and reads the computed size, line height, weight and colour back, so the
 * numbers shown are the browser's, not ours.
 */
export interface TextStyle {
    name: string;
    use: string;
    className: string;
    sample: string;
    /** Inline colour where the code sets one (pink actions, teal states), otherwise a token class does it. */
    color?: string;
    /** Rendered on the dark nav background. */
    dark?: boolean;
    /** Where it comes from in the v3 code. */
    source: string;
}

export const TEXT_STYLES: TextStyle[] = [
    { name: "Page title", use: "Account header, library page titles", className: "text-display-xs font-extrabold text-primary", sample: "Test Publisher", source: "das-shell · HEADLINE" },
    { name: "Section headline", use: "Every setup section: Deal, Auction Rules, Budget…", className: "text-xl font-extrabold text-primary", sample: "Auction Rules", source: "Section · HEADLINE" },
    { name: "Panel title", use: "Summary rail, modals, preview panes", className: "text-lg font-extrabold text-primary", sample: "Campaign summary", source: "h2 in rail / modal" },
    { name: "Card title", use: "Targeting cards: Geos, Platform, Apps, Ad Unit, Keywords", className: "text-lg font-bold text-primary", sample: "Geos", source: "TargetBlock / TargetCard h3" },
    { name: "Label", use: "Field labels, Start / End, radio and checkbox options", className: "text-md font-bold text-primary", sample: "Deal Name", source: "LABEL · FIELD_TYPE" },
    { name: "Body", use: "Section descriptions, instructions, hints, empty states", className: "text-md text-tertiary", sample: "How this campaign competes with open-marketplace auctions.", source: "text-md text-tertiary" },
    { name: "Body, secondary", use: "Table cells, list rows", className: "text-md text-secondary", sample: "Aurora Alarm · iOS", source: "text-md text-secondary" },
    { name: "Value", use: "Summary values, settled data", className: "text-md font-medium text-primary", sample: "Assigned by Nimbus", source: "Rail Row value" },
    { name: "Column header", use: "Table and panel headers", className: "text-md font-semibold text-tertiary", sample: "Bundle ID", source: "ChosenTable th" },
    { name: "Eyebrow", use: "Group labels in the rail and modals", className: "text-md font-semibold uppercase text-tertiary", sample: "Worth knowing", source: "uppercase span" },
    { name: "Text action", use: "Browse, Clear all, Add keyword, Edit", className: "text-md font-semibold uppercase", color: "#DA6EA3", sample: "Clear all", source: "PinkAction" },
    { name: "Error", use: "Field errors, section errors, the review banner", className: "text-md font-medium text-error-primary", sample: "Budget is required", source: "hint / FieldMessage" },
    { name: "Status", use: "Pace and traffic states", className: "text-md font-semibold uppercase", color: "#37B6B7", sample: "On track", source: "PaceLabel / TrafficBadge" },
    { name: "Data, mono", use: "Keywords, bundle IDs, deal IDs in chips, markup", className: "font-mono text-md text-secondary", sample: "com.testpublisher.auroraalarm", source: "font-mono text-md" },
    { name: "Stat value", use: "KPI numbers (campaigns, keyword health)", className: "text-display-xs font-semibold text-primary", sample: "1,284,902", source: "StatCard value" },
    { name: "Required mark", use: "After a required label", className: "text-md font-bold text-brand-tertiary", sample: "*", source: "Field required" },
    { name: "Nav item", use: "Global nav (shared component)", className: "text-md font-semibold", color: "#FFFFFF", dark: true, sample: "manage campaigns", source: "GlobalNav" },
];

export interface EdgeCase {
    case: string;
    rule: string;
    how: string;
}

export const EDGE_CASES: EdgeCase[] = [
    { case: "Design-system Button", rule: "15px, even at size sm / md / lg (the design system draws them at 13px).", how: "Import Button from ./type-rules, which adds text-md." },
    { case: "Design-system Input / Select label and hint", rule: "Label 15px bold black; hint and error 15px.", how: "FIELD_TYPE on the shell restyles [data-label] and [slot=description|errorMessage]." },
    { case: "Input size", rule: "Always md. sm renders 13px text and placeholder.", how: 'size="md" on Input; the type-rules test fails on size="sm".' },
    { case: "Radio and checkbox options", rule: "md size; the option text is a Label (bold black).", how: 'RadioGroup size="md"; label={<span className={LABEL}>…</span>}.' },
    { case: "Toggle (size sm)", rule: "Its label is 13px by default; bring it to 15px.", how: "className=\"[&_p]:text-md\" on the Toggle." },
    { case: "Popovers outside the page shell", rule: "Calendars and panels portalled to <body> miss FIELD_TYPE, so set the minimum on the panel itself.", how: "DatePicker dialog: **:text-md." },
    { case: "Shared Global Nav footer", rule: "15px (the shared component sets 13px).", how: "[&_footer]:text-md on the v3 shell — the shared component is not edited." },
    { case: "Badges and pills (NEW, ADDED, chips)", rule: "15px like everything else; uppercase is fine.", how: "text-md font-bold uppercase." },
    { case: "Uppercase text", rule: "Still 15px minimum. Uppercase never justifies a smaller size.", how: "uppercase + text-md." },
    { case: "Numbers in step circles", rule: "15px numeral in a 20px circle, line height 1.", how: "size-5 text-md leading-none." },
    { case: "Monospace data", rule: "15px in the system mono stack.", how: "font-mono text-md." },
    { case: "KPI numbers", rule: "Data, not headlines: 24px at 600, not 800.", how: "text-display-xs font-semibold." },
    { case: "Long values in the 300px rail", rule: "Wrap onto two lines rather than shrink or truncate.", how: "Default wrapping; no text-sm fallback." },
    { case: "Disabled fields", rule: "Same size; disabled is shown by colour and opacity, never by shrinking.", how: "Design-system disabled states." },
    { case: "Chart axis labels", rule: "15px.", how: "Recharts tick fontSize: 15." },
    { case: "Exception · mock ads", rule: "Text inside the ad-format illustrations (AD, Learn more →) stays at the scale of the ad it depicts.", how: "AdFormatDemo artwork; its caption and controls are 15px." },
    { case: "Exception · prototype chrome", rule: "The dark toolbar and the Click to fill hints are prototype tools, not product UI.", how: "Not covered by the rules." },
];
