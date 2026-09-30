import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Editable vector source for the self-contained SVGs. Run with Node to regenerate.
const destination = fileURLToPath(new URL("../src/pages/deal-activation-system/studio/assets/", import.meta.url));
mkdirSync(destination, { recursive: true });

const ink = "#101828";
const teal = "#37B6B7";
const pink = "#DA6EA3";
const line = (x, y, width, height = 6) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="#D8DCE2"/>`;
const pill = (x, y, width, label, fill = teal, text = "#FFFFFF") =>
    `<rect x="${x}" y="${y}" width="${width}" height="36" rx="18" fill="${fill}"/><text x="${x + width / 2}" y="${y + 22}" text-anchor="middle" font-size="11" font-weight="700" fill="${text}">${label}</text>`;
const disclosure = (x, y) =>
    `<rect x="${x}" y="${y}" width="23" height="15" rx="4" fill="${pink}"/><text x="${x + 11.5}" y="${y + 11}" text-anchor="middle" font-size="8" font-weight="700" fill="white">AD</text>`;
const close = (x = 237, y = 43) =>
    `<circle cx="${x}" cy="${y}" r="12" fill="${ink}" fill-opacity=".5"/><path d="m${x - 3.5} ${y - 3.5} 7 7m-7 0 7-7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`;

const scenery = (x, y, width, height, compact = false) => {
    // A dedicated wide composition keeps the pink sun visible in a 320×50 banner.
    const h = compact ? (width / height >= 4 ? 50 : 140) : 560;
    const archRadius = Math.min(49, h * 0.35);
    const innerRadius = archRadius * 0.45;
    const archTop = compact ? h * 0.56 : 290;
    // Overscan below the viewport keeps the landscape continuous during travel.
    const hillBottom = h * 3;
    return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 320 ${h}" preserveAspectRatio="xMidYMid slice" overflow="hidden">
      <rect width="320" height="${h}" fill="#FCE7EF"/>
      <g class="demo-sun"><circle cx="${compact ? 132 : 110}" cy="${compact ? h * 0.24 : 154}" r="${compact ? h * 0.15 : 40}" fill="${pink}"/></g>
      <g class="demo-arch"><path d="M216 ${h}V${archTop}a${archRadius} ${archRadius} 0 0 1 ${archRadius * 2} 0V${h}h-${archRadius - innerRadius}V${archTop}a${innerRadius} ${innerRadius} 0 0 0-${innerRadius * 2} 0V${h}Z" fill="#E587B7"/></g>
      <g class="demo-hill-far"><path d="M-12 ${h * 0.44}C94 ${h * 0.4} 158 ${h * 0.77} 340 ${h * 0.63}V${hillBottom}H-12Z" fill="${teal}"/></g>
      <g class="demo-hill-middle"><path d="M-12 ${h * 0.72}C106 ${h * 0.45} 232 ${h * 0.73} 340 ${h * 0.8}V${hillBottom}H-12Z" fill="#299C9F"/></g>
      <g class="demo-hill-near"><path d="M-12 ${h * 0.85}C110 ${h * 0.72} 185 ${h * 0.79} 340 ${h * 0.98}V${hillBottom}H-12Z" fill="#32AEB0"/></g>
      <rect class="demo-scene-reset" width="320" height="${h}" fill="#32AEB0"/>
    </svg>`;
};

const feedCard = (y, height = 104) =>
    `<g transform="translate(18 ${y})"><rect width="224" height="${height}" rx="12" fill="#EAECF0"/><rect x="12" y="12" width="58" height="${height - 24}" rx="8" fill="#D8DCE2"/>${line(82, 24, 114)}${line(82, 39, 88)}${line(82, 54, 100)}</g>`;
const header = `<g><circle cx="29" cy="64" r="11" fill="#D8DCE2"/>${line(50, 57, 110)}${line(50, 71, 77, 5)}<circle cx="229" cy="64" r="7" fill="#EAECF0"/></g>`;
const navigation = `<g><path d="M0 517h260" stroke="#EAECF0"/><path d="m23 533 7-6 7 6v8h-5v-5h-4v5h-5Z" fill="${ink}"/><g stroke="#B2B9C3" stroke-width="1.8" fill="none" stroke-linecap="round"><circle cx="81" cy="533" r="4.5"/><path d="m84.5 536.5 3 3"/><rect x="124" y="528" width="11" height="11" rx="3"/><path d="M129.5 531v5m-2.5-2.5h5"/><path d="M175 537h10l-1.5-7h-7Zm4 3h2"/><circle cx="227" cy="531" r="3"/><path d="M221 541v-2a6 6 0 0 1 12 0v2"/></g></g>`;
const host = (content = `${feedCard(0)}${feedCard(118)}${feedCard(236)}${feedCard(354)}`, scroll = true) =>
    `<rect width="260" height="560" fill="#F9F7F3"/>${header}<g clip-path="url(#demo-feed-clip)"><g transform="translate(0 103)"><g ${scroll ? 'class="demo-feed-scroll"' : ""}>${content}</g></g></g>${navigation}`;

const banner = () =>
    `${host()}<g class="demo-banner-arrive"><rect x="10" y="459" width="240" height="37.5" rx="5" fill="#FCE7EF"/>${scenery(10, 459, 240, 37.5, true)}${disclosure(15, 463)}<rect x="216" y="470" width="24" height="17" rx="5" fill="${teal}"/><path d="M222 478.5h11m-4-4 4 4-4 4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect class="demo-placement-outline" x="8" y="457" width="244" height="41.5" rx="6" fill="none" stroke="${pink}" stroke-dasharray="3 3"/></g>`;
const interstitial = () =>
    `${host(undefined, false)}<g class="demo-interstitial-overlay">${scenery(0, 0, 260, 560)}${disclosure(15, 34)}${close()}${pill(24, 474, 212, "Learn more →", ink)}<circle class="demo-close-tap" cx="237" cy="43" r="18" fill="none" stroke="${pink}" stroke-width="2"/></g>`;
const pointCoin = (x, y, r = 26) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${pink}"/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="none" stroke="#FCE7EF" stroke-width="1.5"/><path d="m${x} ${y - r * 0.44} ${r * 0.13} ${r * 0.31} ${r * 0.31} ${r * 0.13}-${r * 0.31} ${r * 0.13}-${r * 0.13} ${r * 0.31}-${r * 0.13}-${r * 0.31}-${r * 0.31}-${r * 0.13} ${r * 0.31}-${r * 0.13}Z" fill="white"/>`;
const accountBadge = (points) =>
    `<rect x="153" y="51" width="90" height="27" rx="13.5" fill="${ink}"/><text x="198" y="68" text-anchor="middle" font-size="10" font-weight="700" fill="white">${points} points</text>`;
const rewardHost = () =>
    `${host(undefined, false)}<rect x="45" y="47" width="118" height="35" fill="#F9F7F3"/><text x="50" y="66" font-size="11" font-weight="700" fill="${ink}">Your app</text><g class="demo-account-before">${accountBadge(250)}</g><g class="demo-account-after">${accountBadge(350)}<rect class="demo-account-pulse" x="151" y="49" width="94" height="31" rx="15.5" fill="none" stroke="${pink}" stroke-width="2"/></g>`;
const rewardPrompt = () =>
    `<g class="demo-reward-prompt">
      <rect width="260" height="560" fill="${ink}" fill-opacity=".3"/>
      <rect x="20" y="160" width="220" height="252" rx="24" fill="#F9F7F3"/>
      <text x="130" y="188" text-anchor="middle" font-size="8" font-weight="700" letter-spacing="1.5" fill="#667085">A LITTLE WATCH. A BIG REWARD.</text>
      ${pointCoin(130, 225, 26)}
      <text x="130" y="273" text-anchor="middle" font-size="16" font-weight="700" fill="${ink}">Watch a short video</text>
      <text x="130" y="296" text-anchor="middle" font-size="10" fill="#667085">Earn 100 points for your account</text>
      <g class="demo-watch-cta">${pill(40, 319, 180, "Watch video · +100 pts", ink)}</g>
      <circle class="demo-watch-tap" cx="130" cy="337" r="23" fill="none" stroke="${pink}" stroke-width="2"/>
      <text x="130" y="385" text-anchor="middle" font-size="10" fill="#667085">No thanks</text>
    </g>`;
const rewardCard = () =>
    `<g class="demo-reward-card">
      <rect x="20" y="150" width="220" height="306" rx="24" fill="#F9F7F3"/>
      <text x="130" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${ink}">Reward unlocked!</text>
      <circle class="demo-reward-halo" cx="130" cy="228" r="39" fill="none" stroke="${pink}" stroke-width="2"/>
      <g class="demo-reward-medal">${pointCoin(130, 228, 32)}</g>
      <g class="demo-confetti-1"><rect x="103" y="208" width="5" height="12" rx="2" fill="${pink}"/></g>
      <g class="demo-confetti-2"><circle cx="112" cy="231" r="3" fill="${teal}"/></g>
      <g class="demo-confetti-3"><rect x="125" y="199" width="4" height="9" rx="2" fill="${teal}"/></g>
      <g class="demo-confetti-4"><rect x="151" y="210" width="5" height="12" rx="2" fill="${teal}"/></g>
      <g class="demo-confetti-5"><circle cx="149" cy="234" r="3" fill="${pink}"/></g>
      <g class="demo-confetti-6"><rect x="138" y="198" width="4" height="9" rx="2" fill="${pink}"/></g>
      <text x="130" y="298" text-anchor="middle" font-size="36" font-weight="700" fill="${ink}">+100</text>
      <text x="130" y="320" text-anchor="middle" font-size="11" fill="#667085">Points added to your account</text>
      <rect x="40" y="339" width="180" height="55" rx="12" fill="#E0F2F1"/>
      <text x="130" y="356" text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing="1.2" fill="#297477">ACCOUNT BALANCE</text>
      ${[250, 275, 300, 325, 350].map((points) => `<text class="demo-balance-${points}" x="130" y="380" text-anchor="middle" font-size="18" font-weight="700" fill="${ink}">${points} points</text>`).join("")}
      <g class="demo-point-deposit">${pointCoin(130, 228, 14)}</g>
      ${pill(40, 408, 180, "Continue to app →", ink)}
    </g>`;
const rewardCompletion = () =>
    `<rect width="260" height="560" fill="${ink}" fill-opacity=".12"/>${rewardCard()}`;
const rewarded = (endCard = false) =>
    endCard
        ? `${scenery(0, 0, 260, 560)}${disclosure(15, 34)}${close()}<g class="demo-reward-end-card">${rewardCompletion()}</g>`
        : `${rewardHost()}${rewardPrompt()}
          <g class="demo-rewarded-video">
            ${scenery(0, 0, 260, 560)}${disclosure(15, 34)}
            <rect x="16" y="65" width="228" height="70" rx="15" fill="${ink}"/>
            <text x="28" y="88" font-size="12" font-weight="700" fill="white">Watch &amp; earn 100 points</text>
            <text x="28" y="107" font-size="9" fill="#D8DCE2">Your reward is on its way</text>
            ${[["3", "3s left"], ["2", "2s left"], ["1", "1s left"], ["done", "Complete"]].map(([id, label]) => `<text class="demo-countdown-${id}" x="232" y="107" text-anchor="end" font-size="9" font-weight="700" fill="white">${label}</text>`).join("")}
            <rect x="28" y="117" width="204" height="5" rx="2.5" fill="white" fill-opacity=".2"/>
            <rect class="demo-video-progress" x="28" y="117" width="204" height="5" rx="2.5" fill="${teal}"/>
            <rect class="demo-watch-status-pill" x="38" y="462" width="184" height="36" rx="18" fill="${ink}"/>
            <text class="demo-watch-status-label" x="130" y="480" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white"><tspan font-size="10">▶</tspan><tspan dx="8">A quick watch. +100 pts.</tspan></text>
          </g>
          <g class="demo-reward-complete">${rewardCompletion()}</g>`;
const nativeCard = (y = 434) =>
    `<g transform="translate(18 ${y})"><g class="demo-native-card">
      <rect width="224" height="246" rx="12" fill="#F9F7F3" stroke="#D8DCE2"/>
      ${disclosure(10, 10)}<text x="40" y="21" font-size="8" fill="#667085">Sponsored</text>
      <svg x="10" y="32" width="204" height="128" viewBox="0 0 204 128" overflow="hidden">
        <defs><clipPath id="demo-native-art-clip"><rect width="204" height="128" rx="8"/></clipPath></defs>
        <g clip-path="url(#demo-native-art-clip)"><g class="demo-native-visual">${scenery(0, 0, 204, 128, true)}</g></g>
      </svg>
      <text x="10" y="181" font-size="12" font-weight="700" fill="${ink}">Find your next horizon</text>
      <text x="10" y="197" font-size="9" fill="#667085">A little inspiration for every day.</text>
      <rect x="125" y="208" width="89" height="27" rx="13.5" fill="${ink}"/>
      <text x="169.5" y="225" text-anchor="middle" font-size="9" font-weight="700" fill="white">Learn more →</text>
      <rect class="demo-native-focus-ring" x="-2" y="-2" width="228" height="250" rx="14" fill="none" stroke="${pink}" stroke-width="1.5"/>
    </g></g>`;
const native = () => {
    const firstCards = `${feedCard(0)}${feedCard(118)}${feedCard(236)}${feedCard(354, 66)}`;
    return host(
        `<g class="demo-native-reset-feed">${firstCards}</g><g class="demo-native-feed">${firstCards}${nativeCard()}${feedCard(694)}${feedCard(812)}${feedCard(930)}</g>`,
        false,
    );
};
const mrec = () =>
    host(
        `${feedCard(0, 55)}<g class="demo-banner-arrive"><text x="20" y="91" font-size="8" fill="#667085">ADVERTISEMENT</text><svg x="20" y="101" width="220" height="183.3" viewBox="0 0 300 250" overflow="hidden">${scenery(0, 0, 300, 250, true)}${disclosure(10, 10)}${pill(66, 202, 168, "Learn more →", "#229B9E")}</svg><rect class="demo-placement-outline" x="18" y="99" width="224" height="187.3" rx="4" fill="none" stroke="${pink}" stroke-dasharray="3 3"/></g>${feedCard(310)}`,
        false,
    );

const rewardCss = (endCard) => {
    const burst = endCard ? 4 : 54;
    const count = endCard ? 12 : 62;
    const confetti = [[-64, -35, -25], [-69, 21, 0], [-24, -56, -15], [60, -31, 28], [65, 22, 0], [31, -53, 18]];
    return `
  #demo-root .demo-reward-prompt { opacity: 0; animation: demo-offer 12s ease-in-out infinite; }
  #demo-root .demo-watch-cta { transform-box: fill-box; transform-origin: center; animation: demo-cta-press 12s ease-in-out infinite; }
  #demo-root .demo-watch-tap { opacity: 0; transform-box: fill-box; transform-origin: center; animation: demo-watch-tap 12s ease-out infinite; }
  #demo-root .demo-rewarded-video { opacity: 0; animation: demo-video 12s ease-in-out infinite; }
  #demo-root .demo-video-progress { transform-origin: 28px 119.5px; animation: demo-progress 12s linear infinite; }
  #demo-root .demo-reward-complete { opacity: 1; animation: demo-complete 12s ease-in-out infinite; }
  #demo-root .demo-reward-end-card { animation: demo-end-card 12s ease-in-out infinite; }
  #demo-root .demo-reward-card { transform-box: fill-box; transform-origin: center; animation: demo-award-pop 12s ease-out infinite; }
  #demo-root .demo-reward-medal { transform-box: fill-box; transform-origin: center; animation: demo-medal-pop 12s ease-out infinite; }
  #demo-root .demo-reward-halo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: demo-award-halo 12s ease-out infinite; }
  #demo-root .demo-point-deposit { opacity: 0; transform-box: fill-box; transform-origin: center; animation: demo-deposit 12s ease-in-out infinite; }
  #demo-root .demo-account-before { opacity: 0; animation: demo-account-before 12s step-end infinite; }
  #demo-root .demo-account-after { opacity: 1; animation: demo-account-after 12s step-end infinite; }
  #demo-root .demo-account-pulse { opacity: 0; animation: demo-account-pulse 12s ease-out infinite; }
  @keyframes demo-offer { 0%,15%,100% { opacity: 1; } 20%,97% { opacity: 0; } }
  @keyframes demo-cta-press { 0%,14%,21%,100% { transform: scale(1); } 17% { transform: scale(.95); } }
  @keyframes demo-watch-tap { 0%,11%,22%,100% { opacity: 0; transform: scale(.65); } 16% { opacity: 1; transform: scale(1); } 21% { opacity: 0; transform: scale(1.55); } }
  @keyframes demo-video { 0%,18%,56%,100% { opacity: 0; } 21%,51% { opacity: 1; } }
  @keyframes demo-progress { 0%,21% { transform: scaleX(0); } 50%,100% { transform: scaleX(1); } }
  @keyframes demo-complete { 0%,50%,91%,100% { opacity: 0; } 57%,84% { opacity: 1; } }
  @keyframes demo-end-card { 0%,100% { opacity: 0; } 7%,94% { opacity: 1; } }
  @keyframes demo-award-pop { 0%,${burst}% { transform: translateY(14px) scale(.9); } ${burst + 4}% { transform: translateY(-2px) scale(1.025); } ${burst + 7}%,100% { transform: translateY(0) scale(1); } }
  @keyframes demo-medal-pop { 0%,${burst}% { transform: scale(.6) rotate(-14deg); } ${burst + 4}% { transform: scale(1.15) rotate(7deg); } ${burst + 8}%,100% { transform: scale(1) rotate(0); } }
  @keyframes demo-award-halo { 0%,${burst}%,${burst + 17}%,100% { opacity: 0; transform: scale(.65); } ${burst + 4}% { opacity: .65; transform: scale(1); } ${burst + 16}% { opacity: 0; transform: scale(1.75); } }
  @keyframes demo-deposit { 0%,${count}%,${count + 12}%,100% { opacity: 0; transform: translateY(0) scale(1); } ${count + 1}% { opacity: 1; transform: translateY(0) scale(1); } ${count + 9}% { opacity: 1; transform: translateY(140px) scale(.55); } ${count + 11}% { opacity: 0; transform: translateY(150px) scale(.35); } }
  @keyframes demo-account-before { 0%,74% { opacity: 1; } 75%,100% { opacity: 0; } }
  @keyframes demo-account-after { 0%,74% { opacity: 0; } 75%,100% { opacity: 1; } }
  @keyframes demo-account-pulse { 0%,89%,99%,100% { opacity: 0; } 93% { opacity: 1; } 98% { opacity: 0; } }
  ${confetti.map(([x, y, rotation], index) => `
  #demo-root .demo-confetti-${index + 1} { opacity: 0; transform-box: fill-box; transform-origin: center; animation: demo-confetti-${index + 1} 12s ease-out infinite; }
  @keyframes demo-confetti-${index + 1} { 0%,${burst}%,${burst + 19}%,100% { opacity: 0; transform: translate(0,0) rotate(0); } ${burst + 3}% { opacity: 1; transform: translate(${x * 0.65}px,${y}px) rotate(${rotation}deg); } ${burst + 17}% { opacity: 0; transform: translate(${x}px,${y + 38}px) rotate(${rotation * 3}deg); } }`).join("")}
  ${[250, 275, 300, 325, 350].map((points, index) => {
      const first = count + index * 3;
      const last = first + 2;
      const frames = index === 0
          ? `0%,${last}% { opacity: 1; } ${last + 1}%,100% { opacity: 0; }`
          : index === 4
            ? `0%,${first - 1}% { opacity: 0; } ${first}%,100% { opacity: 1; }`
            : `0%,${first - 1}% { opacity: 0; } ${first}%,${last}% { opacity: 1; } ${last + 1}%,100% { opacity: 0; }`;
      return `#demo-root .demo-balance-${points} { opacity: ${index === 4 ? 1 : 0}; animation: demo-balance-${points} 12s step-end infinite; } @keyframes demo-balance-${points} { ${frames} }`;
  }).join("\n  ")}
  #demo-root .demo-countdown-3 { animation: demo-countdown-3 12s step-end infinite; }
  #demo-root .demo-countdown-2 { animation: demo-countdown-2 12s step-end infinite; }
  #demo-root .demo-countdown-1 { animation: demo-countdown-1 12s step-end infinite; }
  #demo-root .demo-countdown-done { animation: demo-countdown-done 12s step-end infinite; }
  @keyframes demo-countdown-3 { 0%,30% { opacity: 1; } 31%,100% { opacity: 0; } }
  @keyframes demo-countdown-2 { 0%,30% { opacity: 0; } 31%,40% { opacity: 1; } 41%,100% { opacity: 0; } }
  @keyframes demo-countdown-1 { 0%,40% { opacity: 0; } 41%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
  @keyframes demo-countdown-done { 0%,49% { opacity: 0; } 50%,100% { opacity: 1; } }
`;
};

const nativeCss = () => `
  /* The whole feed moves, so the native card stays part of the app's content. */
  #demo-root .demo-native-feed { transform: translateY(-352px); animation: demo-native-scroll 12s cubic-bezier(.22,.61,.36,1) infinite, demo-native-feed-fade 12s ease-in-out infinite; }
  #demo-root .demo-native-reset-feed { opacity: 0; animation: demo-native-reset-feed 12s ease-in-out infinite; }
  #demo-root .demo-native-card { transform-box: fill-box; transform-origin: center; animation: demo-native-card-settle 12s ease-out infinite; }
  #demo-root .demo-native-visual { transform-box: view-box; transform-origin: 102px 64px; animation: demo-native-art-reveal 12s ease-out infinite; }
  #demo-root .demo-native-focus-ring { opacity: .25; animation: demo-native-focus 12s ease-out infinite; }
  #demo-root .demo-sun { animation-name: demo-native-sun; }
  #demo-root .demo-arch { animation-name: demo-native-arch; }
  #demo-root .demo-hill-far { animation-name: demo-native-far; }
  #demo-root .demo-hill-middle { animation-name: demo-native-middle; }
  #demo-root .demo-hill-near { animation-name: demo-native-near; }
  #demo-root .demo-scene-reset { animation-name: demo-native-scene-reset; }
  @keyframes demo-native-scroll { 0%,10%,100% { transform: translateY(0); } 29% { transform: translateY(-358px); } 32%,82% { transform: translateY(-352px); } 94%,99.99% { transform: translateY(-740px); } }
  @keyframes demo-native-feed-fade { 0%,100% { opacity: 0; } 5%,93% { opacity: 1; } 99% { opacity: 0; } }
  @keyframes demo-native-reset-feed { 0%,100% { opacity: 1; } 5%,93% { opacity: 0; } 99% { opacity: 1; } }
  @keyframes demo-native-card-settle { 0%,27%,100% { transform: scale(.985); } 33% { transform: scale(1.012); } 39%,95% { transform: scale(1); } }
  @keyframes demo-native-art-reveal { 0%,30%,100% { transform: rotate(-2deg) scale(1.12); } 40% { transform: rotate(.5deg) scale(1.035); } 50%,95% { transform: rotate(0) scale(1); } }
  @keyframes demo-native-focus { 0%,26%,95%,100% { opacity: 0; } 34% { opacity: .9; } 49%,83% { opacity: .25; } }
  @keyframes demo-native-sun { 0%,30% { transform: translate(-26px,38%) scale(.55); } 43% { transform: translate(4px,-3%) scale(1.08); } 51%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-native-arch { 0%,30% { transform: translate(32px,20%) scale(.85); } 52%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-native-far { 0%,30% { transform: translate(-14px,-10%) scale(1.16); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-native-middle { 0%,30% { transform: translate(20px,-24%) scale(1.4); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-native-near { 0%,30% { transform: translate(42px,-56%) scale(1.8); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-native-scene-reset { 0%,29%,100% { opacity: 1; } 34%,95% { opacity: 0; } }
`;

const css = (duration, reward = false, endCard = false, nativeDemo = false) => `
  #demo-root { font-family: 'Proxima Nova', Arial, sans-serif; }
  #demo-root .demo-feed-scroll { animation: demo-scroll 10s ease-in-out infinite; }
  #demo-root .demo-banner-arrive { animation: demo-arrive 10s ease-in-out infinite; }
  #demo-root .demo-placement-outline { animation: demo-outline 10s ease-in-out infinite; }
  #demo-root .demo-interstitial-overlay { animation: demo-takeover 12s ease-in-out infinite; }
  #demo-root .demo-close-tap { opacity: 0; transform-origin: 237px 43px; animation: demo-tap 12s ease-out infinite; }
  #demo-root .demo-sun,
  #demo-root .demo-arch,
  #demo-root .demo-hill-far,
  #demo-root .demo-hill-middle,
  #demo-root .demo-hill-near {
    transform-box: view-box;
    transform-origin: 50% 100%;
    animation-duration: ${duration}s;
    animation-timing-function: cubic-bezier(.22,.61,.36,1);
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  #demo-root .demo-sun { transform-origin: 50% 50%; animation-name: demo-journey-sun; }
  #demo-root .demo-arch { animation-name: demo-journey-arch; }
  #demo-root .demo-hill-far { animation-name: demo-journey-far; }
  #demo-root .demo-hill-middle { animation-name: demo-journey-middle; }
  #demo-root .demo-hill-near { animation-name: demo-journey-near; }
  #demo-root .demo-scene-reset { opacity: 0; animation: demo-journey-reset ${duration}s ease-in-out infinite; }
  @keyframes demo-scroll { 0%,20%,100% { transform: translateY(0); } 65%,82% { transform: translateY(-72px); } }
  @keyframes demo-arrive { 0%,100% { opacity: 0; transform: translateY(10px); } 8%,94% { opacity: 1; transform: translateY(0); } }
  @keyframes demo-outline { 0%,15%,90%,100% { opacity: .8; } 35%,75% { opacity: .25; } }
  @keyframes demo-takeover { 0%,3%,88%,100% { opacity: 0; transform: translateY(8px); } 10%,73% { opacity: 1; transform: translateY(0); } }
  @keyframes demo-tap { 0%,64%,79%,100% { opacity: 0; transform: scale(.75); } 69% { opacity: 1; transform: scale(1); } 76% { opacity: 0; transform: scale(1.35); } }
  @keyframes demo-journey-sun { 0%,8% { transform: translate(-20px,-12%) scale(.88); } 52%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-journey-arch { 0%,8% { transform: translate(28px,6%) scale(.9); } 52%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-journey-far { 0%,8% { transform: translate(-14px,-10%) scale(1.16); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-journey-middle { 0%,8% { transform: translate(20px,-24%) scale(1.4); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-journey-near { 0%,8% { transform: translate(42px,-56%) scale(1.8); } 54%,100% { transform: translate(0,0) scale(1); } }
  @keyframes demo-journey-reset { 0%,4%,100% { opacity: 1; } 10%,92% { opacity: 0; } }
  ${reward ? rewardCss(endCard) : ""}
  ${nativeDemo ? nativeCss() : ""}
  @media (prefers-reduced-motion: reduce) { #demo-root * { animation: none !important; } }
`;

const assets = [
    ["banner", "Banner", "A slim banner enters above the bottom navigation and stays anchored while app content scrolls.", banner()],
    ["interstitial", "Interstitial", "A full-screen ad opens over the app, displays a close control, then returns to the app.", interstitial()],
    [
        "rewarded",
        "Rewarded video",
        "An invitation offers 100 points, a short illustrated video plays with progress, then points count into the account balance. Timing and rewards are illustrative.",
        rewarded(),
    ],
    ["native", "Native", "A sponsored card starts below the screen, scrolls into view with the feed, reveals layered artwork, and holds before browsing continues.", native()],
    ["banner-mrec", "Medium rectangle", "An illustrated 300 by 250 ad is placed between app content cards.", mrec()],
    [
        "rewarded-end-card",
        "Rewarded end card",
        "A celebratory 100-point reward counts into the sample account balance, and the viewer can continue to the app.",
        rewarded(true),
    ],
];

for (const [name, label, description, screen] of assets) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" id="demo-root" viewBox="0 0 280 580" width="280" height="580" role="img" aria-labelledby="demo-title demo-description">
  <title id="demo-title">${label} ad format demo</title>
  <desc id="demo-description">${description}</desc>
  <defs><clipPath id="demo-screen-clip"><rect x="10" y="10" width="260" height="560" rx="30"/></clipPath><clipPath id="demo-feed-clip"><rect x="0" y="97" width="260" height="416"/></clipPath></defs>
  <style>${css(name === "interstitial" || name === "native" || name.startsWith("rewarded") ? 12 : 10, name.startsWith("rewarded"), name === "rewarded-end-card", name === "native")}</style>
  <rect class="demo-hardware" width="280" height="580" rx="40" fill="${ink}"/>
  <g clip-path="url(#demo-screen-clip)"><g transform="translate(10 10)">${screen}</g></g>
  <g class="demo-hardware"><rect x="100" y="16" width="80" height="16" rx="8" fill="${ink}"/></g>
</svg>
`;
    writeFileSync(`${destination}${name}.svg`, svg.replace(/[ \t]+$/gm, ""));
}
