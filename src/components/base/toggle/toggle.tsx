import type { ReactNode } from "react";
import type { SwitchProps as AriaSwitchProps } from "react-aria-components";
import { Switch as AriaSwitch } from "react-aria-components";
import { cx } from "@/utils/cx";

interface ToggleBaseProps {
    size?: "sm" | "md";
    slim?: boolean;
    className?: string;
    isHovered?: boolean;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
}

/**
 * Nimbus toggle, as on staging (27 Oct): a pill whose white knob fills its height.
 *
 *   on   pink track, the knob ringed in the same pink on the right, a white check on the left
 *   off  light grey track, the knob ringed in grey on the left, a white ✕ on the right
 *
 * `slim` is kept for existing callers and draws the same toggle.
 */
const PINK = "#D076A6";
const PINK_HOVER = "#C2669A";
const GREY = "#DCDCDC";
const GREY_RING = "#CFCFCF";

export const ToggleBase = ({ className, isHovered, isDisabled, isFocusVisible, isSelected, size = "sm" }: ToggleBaseProps) => {
    const sizes = {
        sm: { root: "h-5 w-10", knob: cx("size-5", isSelected && "translate-x-5"), half: "w-5", icon: "size-3" },
        md: { root: "h-6 w-12", knob: cx("size-6", isSelected && "translate-x-6"), half: "w-6", icon: "size-3.5" },
    }[size];
    const track = isSelected ? (isHovered ? PINK_HOVER : PINK) : GREY;

    return (
        <div
            className={cx(
                "relative shrink-0 cursor-pointer rounded-full outline-focus-ring transition-colors duration-150 ease-linear",
                isDisabled && "cursor-not-allowed opacity-50",
                isFocusVisible && "outline-2 outline-offset-2",
                sizes.root,
                className,
            )}
            style={{ backgroundColor: track }}
        >
            {/* The mark sits in the half the knob has left. */}
            <span aria-hidden="true" className={cx("absolute inset-y-0 flex items-center justify-center text-white", sizes.half, isSelected ? "left-0" : "right-0")}>
                <svg viewBox="0 0 12 12" fill="none" className={sizes.icon}>
                    {isSelected ? (
                        <path d="M1.75 6.25 4.5 9l5.75-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                        <path d="m2.5 2.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    )}
                </svg>
            </span>
            <div
                style={{
                    transition: "transform 0.15s ease-in-out, translate 0.15s ease-in-out, border-color 0.1s linear",
                    borderColor: isSelected ? track : GREY_RING,
                }}
                className={cx("relative rounded-full border-[1.5px] bg-white", sizes.knob)}
            />
        </div>
    );
};

const styles = {
    sm: {
        root: "gap-2",
        textWrapper: "",
        label: "text-sm font-medium",
        hint: "text-sm",
    },
    md: {
        root: "gap-3",
        textWrapper: "gap-0.5",
        label: "text-md font-medium",
        hint: "text-md",
    },
};

interface ToggleProps extends AriaSwitchProps {
    size?: "sm" | "md";
    label?: string;
    hint?: ReactNode;
    slim?: boolean;
}

export const Toggle = ({ label, hint, className, size = "sm", slim, ...ariaSwitchProps }: ToggleProps) => {
    return (
        <AriaSwitch
            {...ariaSwitchProps}
            className={(state) =>
                cx(
                    "relative flex w-max items-start",
                    state.isDisabled && "cursor-not-allowed",
                    styles[size].root,
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {({ isSelected, isDisabled, isFocusVisible, isHovered }) => (
                <>
                    <ToggleBase
                        slim={slim}
                        size={size}
                        isHovered={isHovered}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                        isSelected={isSelected}
                        className={slim ? "mt-0.5" : ""}
                    />

                    {(label || hint) && (
                        <div className={cx("flex flex-col", styles[size].textWrapper)}>
                            {label && <p className={cx("text-secondary select-none", styles[size].label)}>{label}</p>}
                            {hint && (
                                <span className={cx("text-tertiary", styles[size].hint)} onClick={(event) => event.stopPropagation()}>
                                    {hint}
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </AriaSwitch>
    );
};
