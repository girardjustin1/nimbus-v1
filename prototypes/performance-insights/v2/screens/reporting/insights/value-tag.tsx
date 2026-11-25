import { VALUE_TAGS } from "./insights-data";

/**
 * A breakdown value, or one of the auction traffic spec's value tags (Unknown, Unavailable,
 * Other) drawn as a muted chip with the spec's tooltip (25 Nov). Plain text otherwise.
 */
export const ValueText = ({ value }: { value: string }) => {
    const tip = VALUE_TAGS[value];
    if (!tip) return <>{value}</>;
    return (
        <span title={tip} className="inline-flex cursor-help items-center rounded-sm bg-secondary px-1.5 text-tertiary italic ring-1 ring-secondary ring-inset">
            {value}
        </span>
    );
};
