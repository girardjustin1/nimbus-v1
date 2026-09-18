import type { DetailedReactHTMLElement, HTMLAttributes, ReactNode } from "react";
import React, { cloneElement, useId } from "react";
import { filterDOMProps } from "@react-aria/utils";

interface FileTriggerProps {
    /**
     * Specifies what mime type of files are allowed.
     */
    acceptedFileTypes?: Array<string>;
    /**
     * Whether multiple files can be selected.
     */
    allowsMultiple?: boolean;
    /**
     * Specifies the use of a media capture mechanism to capture the media on the spot.
     */
    defaultCamera?: "user" | "environment";
    /**
     * Handler when a user selects a file.
     */
    onSelect?: (files: FileList | null) => void;
    /**
     * The children of the component.
     */
    children: ReactNode;
    /**
     * Enables the selection of directories instead of individual files.
     */
    acceptDirectory?: boolean;
}

/**
 * A FileTrigger allows a user to access the file system with any pressable React Aria or React Spectrum component, or custom components built with usePress.
 */
export const FileTrigger = (props: FileTriggerProps) => {
    const { children, onSelect, acceptedFileTypes, allowsMultiple, defaultCamera, acceptDirectory, ...rest } = props;

    const domProps = filterDOMProps(rest);
    // Look the hidden input up by id at click time — no ref is read during render.
    const generatedId = useId();
    const inputId = domProps.id ?? generatedId;

    // Make sure that only one child is passed to the component.
    const clonableElement = React.Children.only(children);

    // Opens the file dialog.
    const openFileDialog = () => {
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        if (!input) return;
        // Reset so choosing the same file again still fires onChange.
        if (input.value) input.value = "";
        input.click();
    };

    // Clone the child element and add an `onClick` handler to open the file dialog.
    const mainElement = cloneElement(clonableElement as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>, {
        onClick: openFileDialog,
    });

    return (
        <>
            {mainElement}
            <input
                {...domProps}
                type="file"
                id={inputId}
                style={{ display: "none" }}
                accept={acceptedFileTypes?.toString()}
                onChange={(e) => onSelect?.(e.target.files)}
                capture={defaultCamera}
                multiple={allowsMultiple}
                // @ts-expect-error -- `webkitdirectory` is a non-standard attribute missing from React's input typings.
                webkitdirectory={acceptDirectory ? "" : undefined}
            />
        </>
    );
};
