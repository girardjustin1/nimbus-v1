import { addons } from "storybook/manager-api";

// The archive is kept, not featured: its folder starts closed in the sidebar.
addons.setConfig({ sidebar: { collapsedRoots: ["archive"] } });
