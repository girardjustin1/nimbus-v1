import type { ReactNode } from "react";
import { charcoalStories, prototypeHref, storyHref, tableCatalog } from "./catalog";

export const PrototypeTableContext = ({ id, children }: { id: (typeof tableCatalog)[number]["id"]; children: ReactNode }) => {
    const item = tableCatalog.find((entry) => entry.id === id)!;
    return (
        <div className="bg-primary">
            <aside className="flex flex-col gap-2 border-b border-secondary bg-secondary p-5 text-sm text-secondary">
                <h1 className="text-xl font-semibold text-primary">{item.title} · current v4</h1>
                <p>
                    <strong>Where it is used:</strong> {item.section}
                </p>
                <p>
                    <strong>Current header:</strong> {item.header}
                </p>
                <p>
                    <strong>Closest design-system component:</strong> {item.reason}
                </p>
                <nav aria-label="Table references" className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-brand-secondary">
                    <a href={prototypeHref(item.route)} target="_blank" rel="noreferrer">
                        Open in local prototype v4 ↗
                    </a>
                    <a href={storyHref(item.matchId)} target="_top">
                        Design-system match: {item.match}
                    </a>
                    <a href={storyHref(charcoalStories[item.charcoal])} target="_top">
                        Closest charcoal header reference
                    </a>
                </nav>
            </aside>
            {children}
        </div>
    );
};

export const PrototypeTableMap = () => (
    <div className="overflow-x-auto rounded-xl border border-secondary">
        <table data-v4-table-map="true" className="w-full border-collapse text-left text-sm">
            <thead className="bg-secondary">
                <tr>
                    {["Table / current use", "Current v4 header", "Closest DS example", "Links"].map((label) => (
                        <th key={label} scope="col" className="border-b border-secondary p-3 font-semibold text-primary">
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tableCatalog.map((item) => (
                    <tr key={item.id}>
                        <th scope="row" className="border-b border-secondary p-3 align-top font-medium text-primary">
                            <p>{item.title}</p>
                            <p className="mt-2 font-normal text-secondary">{item.section}</p>
                            <code className="mt-2 block text-xs font-normal text-tertiary">{item.source}</code>
                        </th>
                        <td className="border-b border-secondary p-3 align-top text-secondary">{item.header}</td>
                        <td className="border-b border-secondary p-3 align-top text-secondary">
                            <a className="font-semibold text-brand-secondary" href={storyHref(item.matchId)} target="_top">
                                {item.match}
                            </a>
                            <p className="mt-2">{item.reason}</p>
                        </td>
                        <td className="border-b border-secondary p-3 align-top">
                            <div className="flex min-w-36 flex-col gap-3 font-semibold text-brand-secondary">
                                <a href={storyHref(item.ownId)} target="_top">
                                    V4 example
                                </a>
                                <a href={prototypeHref(item.route)} target="_blank" rel="noreferrer">
                                    V4 location ↗
                                </a>
                                <a href={storyHref(charcoalStories[item.charcoal])} target="_top">
                                    Charcoal reference
                                </a>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
