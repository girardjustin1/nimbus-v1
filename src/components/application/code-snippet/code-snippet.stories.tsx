import type { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeSnippet } from "@/components/application/code-snippet/code-snippet";

/**
 * Application UI → Code Snippet
 *
 * Nimbus-themed code snippet. Syntax highlighting is produced client-side by
 * shiki: pass the raw source via the `code` prop and the language via
 * `language`, and the component highlights it asynchronously (a "Loading..."
 * placeholder shows until the highlighter resolves). The copy control appears
 * on hover in the top-right corner. The theme's brand palette is picked up
 * automatically through CSS variables, so the highlighted tokens follow the
 * Nimbus teal accents.
 */

const installCode = `npm install @nimbus/design-system
# or with pnpm
pnpm add @nimbus/design-system`;

const tsxCode = `import { Button } from "@/components/base/buttons/button";
import { Check } from "@untitledui/icons";

export const SaveButton = () => (
    <Button size="md" color="primary" iconLeading={Check}>
        Save changes
    </Button>
);`;

const jsonCode = `{
    "name": "nimbus-design-system",
    "version": "1.0.0",
    "private": true,
    "type": "module"
}`;

const meta = {
    title: "Application UI/Code Snippet",
    component: CodeSnippet,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof CodeSnippet>;

export default meta;

// CodeSnippet requires `language`, so type render-only stories as a no-prop
// component to avoid the "required args" error on `StoryObj<typeof meta>`.
type Story = StoryObj<FC>;

/** A bash install command with the hover copy control. */
export const Default: Story = {
    render: () => (
        <div className="max-w-2xl">
            <CodeSnippet code={installCode} language="bash" showLineNumbers={false} />
        </div>
    ),
};

/** A small TSX example rendered with line numbers. */
export const TypeScript: Story = {
    render: () => (
        <div className="max-w-2xl">
            <CodeSnippet code={tsxCode} language="tsx" showLineNumbers />
        </div>
    ),
};

/** Multiple snippets, showing the bash, tsx, and json variants together. */
export const Variants: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">bash</p>
                <CodeSnippet code={installCode} language="bash" showLineNumbers={false} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">tsx</p>
                <CodeSnippet code={tsxCode} language="tsx" showLineNumbers />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">json</p>
                <CodeSnippet code={jsonCode} language="json" showLineNumbers={false} />
            </div>
        </div>
    ),
};
