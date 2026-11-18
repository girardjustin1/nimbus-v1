import type { ComponentProps } from "react";
import { Button as BaseButton, type Props as ButtonProps } from "@/components/base/buttons/button";
import { AdFormatDemo as BaseAdFormatDemo } from "@/pages/deal-activation-system/studio/components/ad-format-demo";
import { cx } from "@/utils/cx";

/**
 * Prototype 3 type rules, from Product's 5 Oct review.
 *
 *   1. Headlines are extra bold (800).
 *   2. Labels are bold (700) and black: field labels, radio and checkbox options, and
 *      target-block titles (Geos, Apps, Ad Unit…).
 *   3. Nothing is smaller than 15px (`text-md`).
 *
 * src/components/base is the shared design system and is not edited for a prototype.
 * Where it renders smaller or lighter text, v3 overrides it from here.
 */
export const HEADLINE = "font-extrabold";
export const LABEL = "text-md font-bold text-primary";

/**
 * Applied once on the shell. Restyles every design-system <Label> (it carries
 * `data-label`) and hint/error text (react-aria `slot`) rendered inside it.
 */
export const FIELD_TYPE =
    "**:data-label:text-md **:data-label:font-bold **:data-label:text-primary **:[[slot=description]]:text-md **:[[slot=errorMessage]]:text-md";

/**
 * v2 · Round 1 (R1-04): every design-system <Label> takes the one small upper case style
 * (12px, weight 800, 0.75px, upper case), as staging's form labels do. The values come
 * from ./round-1 through CSS variables set on the shell, so they are written once.
 */
export const FIELD_TYPE_R1 =
    "**:data-label:text-(length:--r1-label-size) **:data-label:font-(--r1-label-weight) **:data-label:tracking-(--r1-label-spacing) **:data-label:uppercase **:data-label:text-black **:[[slot=description]]:text-md **:[[slot=errorMessage]]:text-md";

/**
 * v2 · Round 1 (R1-09, R1-10): buttons go back to staging's: 13px, weight 800, 0.75px,
 * upper case, 33px tall, the label centred in the box. Values from ./round-1 via the
 * shell's CSS variables. (v1 held the design-system Button to 15px.)
 */
export const Button = ({ className, ...props }: ButtonProps) => (
    <BaseButton
        {...(props as ButtonProps)}
        className={cx(
            "h-(--r1-button-height) items-center justify-center py-0 text-(length:--r1-button-size) leading-none font-(--r1-button-weight) tracking-(--r1-button-spacing) uppercase",
            className,
        )}
    />
);

/**
 * The Studio ad-format preview is shared with production pages; its caption is 12px and
 * its Pause/Replay buttons 13px. `contents` keeps the wrapper out of the layout.
 */
export const AdFormatDemo = (props: ComponentProps<typeof BaseAdFormatDemo>) => (
    <div className="contents [&_button]:text-md [&_figcaption]:text-md">
        <BaseAdFormatDemo {...props} />
    </div>
);
