# Project Context

## Overview
Static link page for **delpog** — a Twitch/TikTok streamer, a friend of the owner's.
Sixth in the family after `../Jona Website`, `../Blissolic Website`, `../Dewier Website`,
`../MangoPlayz Website` and `../Senkhi Website`. (An earlier draft said the Blissolic folder was not
present on this Mac. It was — a mis-escaped `mv` had renamed it to a literal `\`, which also made
the backup repo see all 28 of its tracked files as deleted. Fixed 2026-08-11.) Ported from
the MangoPlayz build: same architecture (intro gate, hidden YouTube player, cursor trail,
adaptive quality ladder), different palette, and butterflies instead of MangoPlayz's autumn
leaves. No counters of any kind — see below.

Everything on the page came off her Linktree (`linktr.ee/delpog`) on 2026-08-10.
The first four tiles are in **her** order — not re-sorted by size:

1. **Twitch** — `twitch.tv/delpog`
2. **TikTok** — `@delpoglive`
3. **Discord** — `discord.gg/q8EFs6CN2w` ("delpog nation", guild `1424176602920783906`)
4. **Spotify** — `open.spotify.com/user/2txaxzuc4hljq19gimeivexkh`
5. **NameMC** — `namemc.com/profile/delpog`, added 2026-08-11 at the owner's request and not from
   the Linktree. Her Minecraft name is `delpog`, confirmed against the Mojang lookup.

No build step, no deps, no API keys — open `index.html` or serve the folder.

## Current State
Domain **delpog.xyz** bought on Porkbun 2026-08-10 01:15 UTC by the owner. He added the
GitHub Pages records himself and they are correct: four A records
(185.199.108–111.153) on the apex plus `www` CNAME to `blissolicpy.github.io`, TTL 600.

Repo `BlissolicPY/delpog` (public, `main`). See "Deploying" below for the state of the
Pages setup and the DNS delegation.

## No numbers on this page at all
**No follower, subscriber or member counts, and no page-view counter.** None of it is
"fetched and hidden" — nothing is fetched. There is no `.tile__count`, no `.subs` pill, no
`.stats` row, no `.views` styling, and **no `main.js`** (it existed only to drive the view
counter, so it was deleted rather than left as an empty file). That removes the whole
socialcounts / mixerno / Discord-invite chain the sibling sites carry, and with it every
problem that came with it — two sources disagreeing by a notch, mixerno returning counts as
strings, CORS that can only be tested from the page, and a public counter URL anyone could
inflate.

The counts went first, at her request. The **view counter went too**, on the owner's
explicit follow-up — it was initially kept on the reasoning that a page-hit count is a
different number about a different thing, and that reasoning was overruled. Do not
reintroduce either without being asked.

Consequences to keep in mind if anything is added back: the reveal stagger runs `--i:0`
through `--i:8` with no gaps, and the `abacus.jasoncameron.dev` preconnect is gone.

## Palette — derived from two images that have both since been replaced
Sampled the same way as the siblings: 4-bit-per-channel bucket quantisation, over the
inscribed circle for an avatar and the whole frame for a background. **The swatch values
were deliberately not re-derived when the images changed, because they still hold** — the
history below exists only so nobody "corrects" a comment into a lie.

Originally the pair was her old Linktree avatar and a pink-fog skyline photo, and they
worked because they were opposites: the avatar was violet-dominant (37.8% of chromatic
pixels H240–269 indigo, 23.4% H270–299 purple, only 8.0% magenta) and the photo was its
mirror (75.9% H330–359 rose, no indigo at all). They overlapped only in H300–329, which is
exactly where `--orchid #C88AE0` sits — the midpoint of the avatar's `#783898` and the
photo's `#E898B8` — and that is why an indigo accent and a rose accent can share a tile
without arguing. All three accents (`--orchid`, `--rose`, `--violet`) are **derived, not
sampled**: the raw buckets are either too dark to read (`#682868` at L28) or unusable to
look at (`#3808F8` at S94).

What is on the page now:

- `assets/pfp.png` — her real **TikTok** avatar, two pink pixel-art hearts on near-white.
  Samples `#F8B8D8` / `#E888B8`, i.e. H330, within a few degrees of `--rose`. Supplies no
  violet at all.
- `assets/bg.jpg` — the flat-art lakeside sunset, which spans the **entire** palette by
  itself. See the background section below.

So the accents are better grounded than when they were derived, and the one thing the new
avatar no longer supplies — the indigo end that `--violet` and `--electric` trace to — is
why `assets/pfp-hamster-linktree.png` is kept rather than deleted. Re-derive from it if you
ever need to show the working.

`#3808F8` survives in exactly one place: about 50° of the conic avatar ring, 2px wide, on a
curve. At that size it reads as the RGB light strip in her old avatar rather than as a
colour.

## Tile colours are the platforms' own, except NameMC's
Twitch `#9146FF`, TikTok `#25F4EE`, Discord `#5865F2`, Spotify `#1ED760`. The siblings
re-tinted tiles only when two of them would otherwise have shared a colour and the tile
stopped saying which was which (three YouTube channels on the MangoPlayz page); that does
not happen here, because all four links are different platforms.

Worth noting how well three of the four already sit in this palette: Twitch's violet is
inside the avatar's dominant band, Discord's blurple is next to the sampled `#3808F8`, and
TikTok's cyan has the monitor glow behind it (8.5% of the avatar is H180–209).
**Spotify's green is the one genuine outsider and it stays green** — it is the most
recognisable thing about that link, the glyph carries the platform, and one contrasting
accent in four reads as deliberate where a re-tint would read as a mistake.

**NameMC is the exception to the heading, and its gold `#FFAA00` is a real choice (added
2026-08-11).** NameMC has no brand colour anyone would recognise, so the field was open — and the
obvious Minecraft grass green is exactly what not to use here, because Spotify's `#1ED760` is one
row up and two greens in five tiles stop saying which is which, the same trap the MangoPlayz page's
three YouTube channels set. Minecraft's UI gold is unmistakably Minecraft, it has the sunset behind
it, and it was the one warm hue free on all three pages that took this tile, so Blissolic and Senkhi
carry the same value. The glyph does the identifying: a hand-built isometric block, three inset
quads in one 24×24 fill path, in the same fill-not-stroke style as the platform marks. The tile sits
last because the owner's framing was that NameMC is not that important; the page still fits one
screen with it (1061px of content is Senkhi's problem, not this one — measured 900px at 420×900).
**namemc.com cannot be fetched to check the link**: Cloudflare answers curl with a challenge page.
`api.mojang.com/users/profiles/minecraft/<name>` is the cheap check, and it returns the canonical
casing too.

## The background — and why the bake is now trivial
`assets/bg.jpg` is a **flat-art lakeside sunset** (3840x2160 source, her pick, swapped in
2026-08-10 replacing an earlier pink-fog photograph). It is a much better source: 100%
chromatic, mean luma 87.7, already dark in the foreground where the tiles sit and bright
only in the sky — and unlike either original palette source it spans the whole palette on
its own: **H300-329 34%, H330-359 27%, H240-269 26%, H270-299 11%**, dominant `#282868`
(H240 L28) in the trees and `#883878` (H312 L37) in the sky. The accents are better
grounded now than when they were derived.

So the bake is just:

```
scale=1600:900, eq=saturation=0.96, lutrgb=val*0.85, gblur=sigma=0.8   ->  luma 74.5
```

0.8px of blur exists only to stop the gradient banding once JPEG quantises it.

**What the previous background taught, which still applies to any future swap:** it was a
photograph of pink fog whose dominant bucket was `#F8D8D8` — white with a 32-point RGB
spread. **Low chroma survives darkening badly**, so multiplying it down turned the image
grey rather than dark pink (H0 S18 at 0.5 brightness) and it needed saturation 1.85 plus a
channel mix to rescue the colour *before* the light came down. Check a source's chroma
first: that, not its brightness, decides how much work the bake has to do.

**Re-measure legibility on every background swap, against the TOP tile.** The new image is
brighter, and it silently pushed the top tile's handle line to **3.77:1** — under the 4.5:1
AA floor — until the scrim was strengthened. The top tile sits on the brightest part of the
image and is the worst case; the average is misleading.

Measured on the composited page at 390x844 with the gate dismissed and the player visible:

| | value | notes |
|---|---|---|
| page mean luma | 57.8 | family reference 33-40 |
| top tile substrate | `rgb(115, 63, 91)` | worst case |
| handle line, `--text-soft` 0.72 | **4.96:1** | 4.5:1 AA floor |
| tile title, white | 7.83:1 | |
| tile arrow, 0.62 alpha | ~4.3:1 | lifted from 0.54 |

## The phone layout — a bug that is latent in every sibling site
The page once sat off-centre on a phone with the tile arrows clipped off the right edge.
**The centring was never wrong.** The card was wider than the space it was being centred
in. Two causes, both in the player:

- **`.card` needs `min-width: 0`.** It is a grid item, and a grid item defaults to
  `min-width: auto`, meaning "never narrower than your min-content". The player's
  min-content is set by the track title, so on a 390px phone the card ignored its own
  `width: 100%` (350px) and grew to 406px.
- **`.player__title` needs `display: block`.** It is an `<a>`, i.e. `display: inline`, and
  **`overflow: hidden` with `text-overflow: ellipsis` does nothing on an inline box.** So
  the nowrap title never truncated — it just set that min-content width.

With both, measured at 390px: card, tile and player all `left 20 / width 350 / right 370`,
title ellipsising, no horizontal overflow. Also verified symmetric at 320 (20/280/300) and
430 (20/390/410).

**MangoPlayz and Senkhi share this markup** and only escape it because their track titles
are short. A long title there reproduces it.

Beyond that the page is responsive the way the family is — `place-items: center` plus
`max-width: 27.5rem` plus `clamp()`, with one `@media (max-width: 26rem)` block for the
four things that genuinely shrink. There are no `env(safe-area-inset-*)` rules, matching
the siblings; nothing on a phone is edge-pinned, so it holds, but add them if anything ever
is.

**Do not trust a headless `--screenshot` for phone layout.** `--window-size` does not set
the layout viewport, so it renders wide and crops, which looks exactly like an off-centre
page. Use CDP `Emulation.setDeviceMetricsOverride` and read the box model. A screenshot
that disagrees with the owner's phone is the screenshot being wrong — except when it
isn't, which is how the real bug above went unfixed for a round.

## The music
**Lizzy McAlpine — "the light in the painting"**, video `CEyHYCZAtOM`, 3:53. Lowercase
title is the artist's own styling; YouTube's own page capitalises it. Do not "correct" it.

- **This is the artist's official VEVO upload** (`LizzyMcAlpineVEVO`), verified via oembed
  returning 200. That is a materially better position than the MangoPlayz page, whose
  CLAUDE.md flags its re-upload channel as the single most likely way that page breaks.
- The owner had downloaded a 320kbps rip of this track (a lyric-channel upload, ID3 artist
  tag `KHB`) and it was renamed on request to
  `~/Downloads/Lizzy McAlpine - the light in the painting.mp3`. **That file is not used by
  the site and must not be.** `player.js` drives the official YouTube IFrame player parked
  offscreen in `.yt-host`; the card is a skin over its API. Self-hosting the audio would be
  redistributing someone else's master, and a DMCA would take the page's music out with it.
  This way the upload keeps its play count and there is nothing to take down.
- **Test embeddability on the DEPLOYED origin, never on localhost.** From `127.0.0.1` a
  rights holder's policy can return error 150 ("embedding disabled") for a video that plays
  perfectly from a real HTTPS origin. On the Senkhi build this produced a completely wrong
  conclusion after 11 uploads across 4 songs all "failed" locally. **So: the player card
  being absent on `localhost:8777` is expected and is not a bug.** `player.js` sets
  `hidden` on `onError` 100/101/150, which is exactly what a localhost load triggers.
- Volume: the slider is perceptual, `setVolume` is not. `VOLUME_CURVE = 2.2` and
  **`VOLUME_DEFAULT = 28` is a slider position, not an amplitude** — it lands on amplitude
  6, about -24 dB. To make the whole site quieter, change that one constant.
- Storage namespace is `dp2:` (`dp2:vol`, `dp2:muted`, `dp2:auto`), session key
  `dp2:counted`. Events are `dp:enter` and `dp:quality`.

## The intro gate
Same solution and same reasoning as the siblings: audible autoplay is blocked everywhere
until a visitor has history with the origin (Chrome gates it on a per-origin Media
Engagement Index), so rather than fight a policy that cannot be beaten, the required
gesture *is* the page's entrance. After that click no browser can refuse audible playback.

Three things about it are load-bearing:

- **Dismissal is inline in `<head>`, deliberately not in `player.js`.** `gated` must be on
  `<html>` before first paint or the staggered reveal runs behind the overlay and the page
  is already finished when the visitor clicks through. And if `player.js`,
  `butterflies.js` or the YouTube API is blocked by an extension, the intro must still
  clear. **A gate that can trap the page is a broken page.**
- **`.gate.is-leaving` keeps `pointer-events`**, and the handler `preventDefault()`s touch
  input with `passive: false`. Without both, a tap on a phone opens a random link:
  touchstart dismisses the gate, the gate stops hit-testing, and the browser then
  synthesises the click from that same tap onto whichever tile was under the finger.
  **Desktop cannot reproduce this**, which is how it shipped on two sibling sites. Test
  with CDP `Input.dispatchTouchEvent` and assert on the browser's tab count — the tiles are
  `target="_blank"`, so the failure is a new tab rather than a navigation.
- **`html.gated [data-reveal] { animation-play-state: paused }`** holds the entrance.
  Pausing rather than delaying is what makes it work, because a paused animation also stops
  its `animation-delay` clock — so removing the class replays the whole stagger from the top.

**`dp:enter` is dispatched on BOTH `window` and `document`.** An event dispatched on
`window` does not reach a listener bound to `document` — window is not in document's
propagation path — and the ported scripts were written against different targets
(`player.js` and `quality.js` listen on `window`). Dispatching twice is free; an effect
that silently never runs is not. The gate also leaves `document.documentElement.dataset.
entered = "1"` and `window.__dpEntered = true` behind, so anything that parsed after the
click has something to check.

## Performance
The MangoPlayz performance pass is inherited wholesale rather than re-derived. Its ladder
took that page from 14.3 to 41.1 fps under an 8x CPU throttle, and every item below is the
reason:

- the background filter **baked into the JPEG** instead of applied in CSS — a filter on a
  full-screen layer re-rasterises whenever anything above it recomposites, and this stack
  recomposites constantly;
- **`.photo` has `will-change: transform`** — baking the filter out costs it the composited
  layer the filter was forcing for free, and without it the JPEG gets rescaled into the
  `.bg` stack on every grain shift. On the sibling site this single line was the largest
  measured win of the whole pass;
- **auroras translate, never scale** — scaling a 90px blur recomputes it every frame;
- grain at `inset: -4%`, not `-50%` (the shift only moves it 2%, and every pixel goes
  through `mix-blend-mode: overlay`);
- **scanlines and vignette merged into one element** — both static, so the merge is free
  and it removes a full-viewport layer from a stack that recomposites together;
- the cursor glow has **no `mix-blend-mode: screen` and no `filter: blur()`** — the first
  forces everything under it to recomposite on every pointermove and buys nothing over a
  dark backdrop, the second cannot be reused because the glow is scaled per frame. The
  softness lives in the gradient's stops instead.

`quality.js` sets `data-q` on `<html>` to `high` / `mid` / `low` and fires `dp:quality`.
**It measures rather than sniffs**: static hints only choose a starting tier, the decision
comes from the p50 of ~50 real frames sampled after entry. It only ever goes down, and the
probe waits out the entrance burst, which is the heaviest two seconds the page ever has.
`?q=high|mid|low` pins a tier for testing.

**fps on this machine is too noisy to resolve effects this size — renderer CPU time is the
instrument that works.** And headless Chromium throttles rAF, so motion can only be judged
in a real browser.

## Key Files
- `quality.js` — the adaptive quality tier. **Load it FIRST**; everything else reads
  `data-q`.
- `index.html` — the whole page. The intro gate is inline in `<head>` so it can never
  depend on other JS.
- `style.css` — palette custom properties and everything else.
  **Bump `style.css?v=N` in index.html on every change**, or browsers serve the old
  stylesheet and the change silently does not appear.
- `butterflies.css` / `butterflies.js` — the entrance burst and the ambient drift. See
  "The butterflies" below.
- **There is no `main.js`.** It held the page-view counter and nothing else, so it was
  deleted with it rather than left as an empty file. If you add page logic later, add the
  `<script>` tag back too — nothing currently references it.
- `player.js` — the hidden YouTube IFrame player and the "now playing" card.
- `cursor.js` — the speed-stretched cursor glow. It resolves `--rose`, `--orchid` and
  `--violet` from the stylesheet and builds the gradient in JS, because the gradient needs
  the same colours at four different alphas and CSS gives no way to take a custom property
  apart. **Consequence: the stylesheet is no longer where you change the trail's tint.**
- `assets/pfp.png` — her avatar, 300x300, the palette source. Linktree serves nothing
  larger; a bigger copy would have to come from her directly.
- `assets/bg-baked.jpg` — the background with its grade already applied.
  `assets/bg.jpg` is the source; nothing loads it.
- `CNAME` — the custom domain. Must agree with `canonical` and `og:site_name` in
  `index.html`, or link previews point at the wrong place.

## The butterflies
Two separate effects, both hooked to `dp:enter` and **never** to a click handler of their
own — the gate has to stay independent of whether this file loaded at all.

- **The emergence**: 48 butterflies (48 / 28 / 14 by tier) bursting up and outward from
  behind the card. Decomposed across **three nested elements**, as the sibling leaf gust is,
  because one keyframe cannot carry travel, wander and wing-flap at once: the outer element
  travels (`bf-emerge`), the middle wanders and banks (`bf-wander`), the inner SVG flaps
  (`bf-flap`). Sizes come from three depth bands (roughly 14% foreground 90–150px, 41% mid,
  the rest 18–40px) and duration, opacity, blur and sway are all derived from that one size
  draw, so near butterflies travel fast and sharp while distant ones lag and soften.
  Duration is `1.6–2.2s + far*1.3`, i.e. the whole burst is over by ~3.5s.
- **The drift**: a sparse ambient population, **capped at 7 alive**, rising slowly forever.
  Its opening batch starts mid-flight via a **`--y0` starting-offset custom property, not a
  negative `animation-delay`** — a negative delay skips the fade-in and materialises the
  whole batch at once at full opacity, which is a mistake already made once on the Senkhi
  build. `low` tier gets no drift at all, matching how MangoPlayz sheds its leaf fall.
- **Nothing animates inside a filter.** Wings flap by `scaleX` about the body's centre line
  rather than by animating SVG path `d`, and the one depth band that carries a static
  `blur()` holds a **fixed wing pose** so nothing inside the filter ever moves. This is the
  Blissolic bat lesson: those animated wing paths inside a `blur() + drop-shadow()` filter
  re-rasterised every frame and were that page's single biggest cost. Rotating or translating
  an already-rasterised filtered layer is compositor work and is fine.
- **`.flutter` is z-index 1 against the card's 2**, and `.card` carries
  `position: relative` to make that work. Two payoffs: nothing ever crosses the text, and
  because the tiles use `backdrop-filter`, a butterfly passing behind one shows through the
  glass as a soft blurred shape. That only happens because it is underneath.

**Testing gotcha: headless Chrome measures as `low`.** `quality.js` samples real frame
times, and a headless renderer is slow enough that the tier drops to `low` within seconds —
where the drift population is 0 by design. A headless run therefore shows an empty
`.flutter` layer and looks broken when it is working correctly. **Pin the tier with
`?q=high`.** Measured population over time on a real driven page, high tier:

```
0.35s=48   0.75s=48   1.5s=48   2.5s=50   4.0s=7   6.5s=7   9.0s=7
```

i.e. the burst holds 48 through its run, briefly overlaps the first drift spawns, then
settles to the 7-alive ambient cap. Peak visual moment is ~0.35s, and a still taken at
1.2s+ shows them already near the viewport edges — do not judge the effect from a late
frame.

## Decisions & Rationale

- **No bio line on the page.** Her Linktree bio is `@Jacob Tomsky @Cigarettes After Sex 🖤`
  — two @-mentions that resolve to nothing on a static page, so rendering it verbatim reads
  as broken markup rather than as a tagline. `.bio` is styled and waiting: dropping a
  `<p class="bio" data-reveal style="--i:3">` into the hero needs no CSS change. **Ask her
  for a one-liner rather than inventing one.**

- **The description tags describe the page, not her.** `All of delpog's links in one place.`
  **Keep `description`, `og:description` and `twitter:description` identical** — they are one
  string in three places, and letting the Google snippet drift from the Discord embed is how
  they end up contradicting each other. Do not prefix a bio tagline onto them; that was
  explicitly asked for on the MangoPlayz build after the embed read as two sentences with the
  actual purpose buried at the end.

- **`og:image` names the apex, `https://delpog.xyz/assets/pfp.png`.** It has to be absolute —
  crawlers do not resolve relative paths. It pointed at Linktree's CDN copy of her avatar
  while the domain was still propagating, which is what the siblings do; it was switched to
  the apex the moment DNS resolved, because the Linktree URL dies the day she changes her
  avatar and a file in the repo does not. The trade is that this now depends on the domain
  staying registered — auto-renew is on.

- **The Discord invite is permanent.** `discord.gg/q8EFs6CN2w` reports `expires_at: null`.
  **Check `expires_at`, not just whether the invite 200s** — a 30-day link dead-ends a month
  after launch, which nearly shipped on the MangoPlayz page.

- **The hamster avatar is hers and is the right one.** It is the image on both her Linktree
  and her TikTok. Her Twitch avatar is a different picture and was explicitly rejected.

- **`kana` is デルポグ**, a family signature carried from the sibling pages.

## Deploying
Hosted on GitHub Pages out of `BlissolicPY/delpog` (public, `main`, root).

DNS is already correct at Porkbun (see Current State). At the time of writing the domain
was about an hour old and **the .xyz registry had not yet published Porkbun's nameserver
delegation** — `dig delpog.xyz NS` returned nothing while whois already listed
`CURITIBA.NS.PORKBUN.COM` / `FORTALEZA.NS.PORKBUN.COM`. That is normal for a fresh
registration and is not a misconfiguration. Check with:

```
dig +short delpog.xyz A @1.1.1.1        # expect the four 185.199.10x.153
```

Then, in order: Settings → Pages → Custom domain `delpog.xyz` → Save, wait for "DNS check
successful", then tick **Enforce HTTPS** (greyed out until the certificate is issued).

**"Done" means live and verified, not committed** — this owner has ended every request on
these pages with some form of "make sure it's on the live site". After pushing: wait for the
Pages CDN, then verify on the real URL and say which URL and which commit. Pages serves HTML
with `max-age=600`, so an already-open tab needs a hard refresh.

- **Editing a meta tag is not the same as the preview changing, and there are two caches.**
  The Pages CDN took ~45s on the sibling site — poll it as the crawler,
  `curl -A "Discordbot/2.0" "https://delpog.xyz/?cb=$RANDOM"`, because a plain browser fetch
  can be served from a different edge. Then **Discord's own OG cache holds the old embed for
  about a day**, keyed by exact URL, so posting `https://delpog.xyz/?1` scrapes fresh.
  Neither cache is a bug in the page; do not go looking for one in `index.html`.
- **A fix found on one site is usually in the siblings too** — the gate bug was in two of
  them, the handle-line legibility problem in two. After fixing something here, grep
  `../MangoPlayz Website` and `../Senkhi Website` for the same construct.
