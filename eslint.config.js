import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// Flat config: TypeScript + React Hooks rules for the design system (src/)
// and the standalone prototypes (prototypes/).
export default tseslint.config(
    { ignores: ["dist", "dist-prototypes", "storybook-static", "reference", "node_modules", "**/*.mdx"] },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            // A leading underscore marks a deliberately unused name (e.g. a prop pulled out of ...rest).
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
        },
    },
    {
        // Storybook `render` functions use hooks by design (Storybook's documented pattern).
        files: ["**/*.stories.tsx"],
        rules: { "react-hooks/rules-of-hooks": "off" },
    },
    {
        // Vendored from the Untitled UI React kit. Findings are reported as warnings
        // rather than errors so the files stay close to their originals and remain
        // recognisable against upstream; prefer wrapping or composing over editing
        // them in place.
        files: ["src/components/**", "src/hooks/**", "src/utils/**", "src/providers/**"],
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
            "@typescript-eslint/no-unused-expressions": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "no-useless-assignment": "warn",
            "prefer-const": "warn",
            "react-hooks/refs": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/set-state-in-effect": "warn",
            "react-refresh/only-export-components": "off",
        },
    },
);
