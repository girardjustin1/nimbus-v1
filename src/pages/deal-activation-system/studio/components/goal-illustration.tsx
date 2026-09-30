import type { ReactNode } from "react";
import type { GoalId } from "../studio-data";
import "./goal-illustration.css";

const ink = "#101828";
const teal = "#37B6B7";
const pink = "#DA6EA3";
const paper = "#F9F7F3";
const mint = "#E0F2F1";
const blush = "#FCE7EF";

const scenes: Record<GoalId, ReactNode> = {
    guaranteed: (
        <>
            <ellipse cx="132" cy="153" rx="99" ry="7" fill={mint} />
            <circle cx="191" cy="53" r="30" fill={blush} />
            <path className="goal-delivery-route" d="M46 124V100a20 20 0 0 1 20-20h18" fill="none" stroke={ink} strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="3 5" />
            <g className="goal-delivery-stamp">
                <rect x="29" y="109" width="34" height="34" rx="10" fill={teal} />
                <path d="m39 126 5 5 9-11" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <rect x="80" y="40" width="108" height="106" rx="14" fill="white" stroke={ink} strokeWidth="1.5" />
            <path d="M94 40h80a14 14 0 0 1 14 14v17H80V54a14 14 0 0 1 14-14Z" fill={pink} />
            <path d="M107 33v16m54-16v16" stroke={ink} strokeWidth="3" strokeLinecap="round" />
            <path d="M80 71h108" stroke={ink} strokeWidth="1.5" />
            {[97, 125, 153].map((x, index) => (
                <g key={x}>
                    <rect x={x} y="84" width="18" height="18" rx="5" fill={mint} />
                    <rect x={x} y="112" width="18" height="18" rx="5" fill={mint} />
                    <path className={`goal-delivery-check goal-delivery-check-${index}`} pathLength="1" d={`m${x + 4} 92 4 4 7-8`} fill="none" stroke="#297477" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            ))}
            <circle cx="190" cy="120" r="27" fill={ink} />
            <circle cx="190" cy="120" r="21" fill={paper} />
            <path className="goal-delivery-clock" d="M190 107v13l8 5" fill="none" stroke={pink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="190" cy="120" r="2.5" fill={ink} />
            <path d="M190 102v2m18 16h-2m-16 18v-2m-18-16h2" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </>
    ),
    priority: (
        <>
            <ellipse cx="130" cy="153" rx="101" ry="7" fill={mint} />
            <circle cx="181" cy="55" r="30" fill={blush} />
            <rect x="33" y="116" width="53" height="34" rx="5" fill={blush} />
            <rect className="goal-priority-podium" x="104" y="87" width="53" height="63" rx="5" fill={teal} />
            <rect x="175" y="116" width="53" height="34" rx="5" fill={mint} />
            <g className="goal-priority-competitor"><g transform="rotate(-9 59 92)">
                <rect x="33" y="69" width="52" height="48" rx="10" fill="white" stroke="#C8D7D7" strokeWidth="1.5" />
                <text x="59" y="101" textAnchor="middle" fontSize="24" fontWeight="600" fill="#7EACAC">$</text>
            </g></g>
            <g className="goal-priority-competitor"><g transform="rotate(9 202 92)">
                <rect x="176" y="69" width="52" height="48" rx="10" fill="white" stroke="#C8D7D7" strokeWidth="1.5" />
                <text x="202" y="101" textAnchor="middle" fontSize="24" fontWeight="600" fill="#7EACAC">$</text>
            </g></g>
            <g className="goal-priority-winner">
                <rect x="87" y="33" width="87" height="72" rx="13" fill="white" stroke={ink} strokeWidth="1.5" />
                <path d="M99 49h18" stroke={teal} strokeWidth="3" strokeLinecap="round" />
                <text x="130.5" y="85" textAnchor="middle" fontSize="34" fontWeight="700" fill={ink}>$</text>
                <g className="goal-priority-arrow">
                    <circle cx="166" cy="36" r="16" fill={pink} />
                    <path d="M166 43V29m-5 5 5-5 5 5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
            <path d="M24 151h212" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </>
    ),
    "always-on": (
        <>
            <ellipse cx="130" cy="153" rx="99" ry="7" fill={mint} />
            <circle cx="72" cy="59" r="28" fill={blush} />
            <ellipse className="goal-always-route" cx="130" cy="89" rx="99" ry="55" fill="none" stroke={teal} strokeWidth="3" />
            <path d="m223 70 6 16 8-14m-199 34-7-16-8 13" fill="none" stroke={teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="92" y="42" width="76" height="104" rx="15" fill="white" stroke={ink} strokeWidth="1.5" />
            <rect x="101" y="54" width="58" height="72" rx="8" fill={blush} />
            <circle className="goal-always-sun" cx="120" cy="76" r="9" fill={pink} />
            <path d="M101 94c24-4 36 21 58 16v16h-58Z" fill={teal} />
            <path d="M101 113c25-10 39-1 58 8v5h-58Z" fill="#299C9F" />
            <path d="M117 136h26" stroke="#C8D7D7" strokeWidth="3" strokeLinecap="round" />
            <g className="goal-always-card goal-always-card-teal"><g transform="rotate(-9 46 91)">
                <rect x="22" y="72" width="48" height="38" rx="8" fill="white" stroke={ink} strokeWidth="1.5" />
                <rect x="29" y="80" width="15" height="22" rx="4" fill={teal} />
                <path d="M50 85h12m-12 7h9" stroke="#C8D7D7" strokeWidth="2" strokeLinecap="round" />
            </g></g>
            <g className="goal-always-card goal-always-card-pink"><g transform="rotate(9 211 107)">
                <rect x="187" y="88" width="48" height="38" rx="8" fill="white" stroke={ink} strokeWidth="1.5" />
                <rect x="194" y="96" width="15" height="22" rx="4" fill={pink} />
                <path d="M215 101h12m-12 7h9" stroke="#C8D7D7" strokeWidth="2" strokeLinecap="round" />
            </g></g>
            <g className="goal-always-card goal-always-card-message">
                <rect x="158" y="19" width="42" height="29" rx="9" fill={pink} />
                <path d="M168 29h22m-22 8h15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>
        </>
    ),
    fallback: (
        <>
            <ellipse cx="130" cy="153" rx="99" ry="7" fill={mint} />
            <circle cx="83" cy="76" r="35" fill={blush} />
            <rect x="30" y="61" width="201" height="91" rx="14" fill="white" stroke={ink} strokeWidth="1.5" />
            {[42, 105, 168].map((x) => (
                <g key={x}>
                    <rect x={x} y="72" width="51" height="28" rx="6" fill={mint} />
                    <path d={`M${x + 9} 82h26m-26 8h17`} stroke="#93C7C5" strokeWidth="2" strokeLinecap="round" />
                </g>
            ))}
            {[42, 168].map((x) => (
                <g key={x}>
                    <rect x={x} y="112" width="51" height="28" rx="6" fill={teal} />
                    <path d={`M${x + 9} 122h26m-26 8h17`} stroke="white" strokeWidth="2" strokeLinecap="round" />
                </g>
            ))}
            <g className="goal-gap-slot">
                <rect x="105" y="112" width="51" height="28" rx="6" fill={blush} stroke={pink} strokeWidth="1.5" strokeDasharray="3 4" />
                <path d="M130.5 121v10m-5-5h10" stroke={pink} strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <rect className="goal-gap-halo" x="103" y="110" width="55" height="32" rx="8" fill="none" stroke={pink} strokeWidth="1.5" opacity="0" />
            <g className="goal-gap-guide">
                <path d="M180 42c36 9 34 54-21 75" fill="none" stroke={ink} strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
                <path d="m163 108-5 10 11 1" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g className="goal-gap-tile">
                <rect x="115" y="26" width="51" height="28" rx="6" fill={pink} />
                <path d="m131 40 6 6 12-12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </>
    ),
};

/** Decorative visual metaphors; the goal names and explanations remain real text. */
export const GoalIllustration = ({ goal, active = false }: { goal: GoalId; active?: boolean }) => (
    <svg viewBox="0 0 260 168" className="goal-illustration h-full w-full" data-goal={goal} data-active={active} aria-hidden="true" focusable="false" fill="none">
        {scenes[goal]}
    </svg>
);
