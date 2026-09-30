# Animated format demos

Self-contained SVGs based on the approved Nimbus flat geometry concept. Open an SVG directly or use it as an image; its CSS timeline loops without JavaScript or external media.

Each creative travels over layered teal hills as the pink sun and arch move into place. Foreground layers move faster than the background, then all layers hold the final composition. A short teal transition conceals the loop reset. The journey resolves before the rewarded-video end card and uses a wider composition for the slim banner so the sun stays visible.

- `banner.svg`: anchored 320×50 banner while app content scrolls.
- `interstitial.svg`: full-screen ad opens and closes back to the app.
- `rewarded.svg`: watch-to-earn invitation, a quick video progress bar, a celebratory +100 points award, account balance count-up from 250 to 350, then return to the app with the updated balance.
- `native.svg`: sponsored card begins below the screen, scrolls into the center with the surrounding feed, reveals its imagery with a sun pop and layered hill motion, then holds the final artwork for over three seconds before browsing continues. Reduced motion shows the card already in view.
- `banner-mrec.svg`: alternate 300×250 placement.
- `rewarded-end-card.svg`: standalone points celebration and account balance count-up.

The generator is `scripts/generate-ad-format-demos.mjs`. Regenerate with `node scripts/generate-ad-format-demos.mjs` from the repository root. Edit the generator rather than the generated SVGs.

The React `AdFormatDemo` component isolates SVG IDs per instance, adds pause/replay controls, and places the artwork inside the shared phone/tablet frame. Motion is disabled when the viewer requests reduced motion. All text, rewards, timing and app content are illustrative. The format demo is separate from the campaign creative fields.

Storybook groups these previews under **Imagery / Assets / Ad Formats**, with individual stories, an all-formats gallery, device controls, and alternate moments. **Imagery / Assets / Goal Illustrations** contains the four goal illustrations and a gallery. The goal component's `active` prop starts its looping animation; inactive scenes remain still. Both groups respect reduced motion.
