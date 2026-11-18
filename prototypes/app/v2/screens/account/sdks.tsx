import { cx } from "@/utils/cx";
import androidIcon from "../../assets/android-icon.svg";
import iosIcon from "../../assets/ios-icon.svg";
import { DasShell, PINK, TEAL } from "../das-shell";
import { Button, HEADLINE } from "../type-rules";
import { SDKS, type Sdk } from "./account-data";

/**
 * SDK & Docs · SDKs — "Nimbus SDKs" (staging, 13 Nov 9.14.56 PM).
 *
 * Two cards, one per platform: the icon, the SDK's name and how it integrates, the latest
 * version, then View Documentation » and INSTALL. Same wording as staging.
 */

const ICONS: Record<Sdk["id"], string> = { ios: iosIcon, android: androidIcon };

const SdkCard = ({ sdk }: { sdk: Sdk }) => (
    <article className="flex flex-col overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
        <div className="flex flex-col gap-3 px-6 pt-8 pb-8">
            <img src={ICONS[sdk.id]} alt="" aria-hidden="true" className="mx-auto mb-4 h-24 w-auto" />
            <h2 className={cx("text-display-xs text-primary", HEADLINE)}>{sdk.name}</h2>
            <p className="text-md text-tertiary">{sdk.description}</p>
        </div>
        <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] border-y border-secondary">
            <dt className="border-r border-secondary px-6 py-5 text-md text-tertiary">Latest SDK version</dt>
            <dd className="px-6 py-5 text-right text-xl font-extrabold" style={{ color: TEAL }}>
                {sdk.version}
            </dd>
        </dl>
        <div className="flex items-center justify-end gap-6 px-6 py-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-md font-bold hover:opacity-80" style={{ color: PINK }}>
                View Documentation »
            </a>
            <Button size="lg" color="primary-pink" className="min-w-40 font-bold tracking-wide uppercase">
                Install
            </Button>
        </div>
    </article>
);

export const SdksPage = () => (
    <DasShell navKey="SDKs" title="Nimbus SDKs">
        <div className="grid grid-cols-1 gap-8 px-8 py-8 lg:grid-cols-2">
            {SDKS.map((sdk) => (
                <SdkCard key={sdk.id} sdk={sdk} />
            ))}
        </div>
    </DasShell>
);
