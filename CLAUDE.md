# Project Context

## Overview
Static link page for **delpog** — a Twitch/TikTok streamer, a friend of the owner's.
Sixth in the family after `../Jona Website`, `../Blissolic Website` (not present on this
Mac), `../Dewier Website`, `../MangoPlayz Website` and `../Senkhi Website`. Ported from
the MangoPlayz build: same architecture (intro gate, hidden YouTube player, page-view
counter, cursor trail, adaptive quality ladder, one-screen layout), different palette,
and butterflies instead of MangoPlayz's autumn leaves.

Everything on the page came off her Linktree (`linktr.ee/delpog`) on 2026-08-10.
Four tiles, in **her** order — not re-sorted by size:

1. **Twitch** — `twitch.tv/delpog`
2. **TikTok** — `@delpoglive`
3. **Discord** — `discord.gg/q8EFs6CN2w` ("delpog nation", guild `1424176602920783906`)
4. **Spotify** — `open.spotify.com/user/2txaxzuc4hljq19gimeivexkh`

No build step, no deps, no API keys — open `index.html` or serve the folder.

## Current State
Domain **delpog.xyz** bought on Porkbun 2026-08-10 01:15 UTC by the owner. He added the
GitHub Pages records himself and they are correct: four A records
(185.199.108–111.153) on the apex plus `www` CNAME to `blissolicpy.github.io`, TTL 600.

Repo `BlissolicPY/delpog` (public, `main`). See "Deploying" below for the state of the
Pages setup and the DNS delegation.

## The one thing she asked for that changes the code
**No follower, subscriber or member counts anywhere.** This is not "fetched and hidden" —
`main.js` does not fetch them at all, and there is no `.tile__count`, no `.subs` pill and
no `--brand`-tinted count styling. That deletes the whole socialcounts / mixerno /
Discord-invite chain the sibling sites carry, and with it every problem that came with it
(two sources disagreeing by a notch, mixerno returning counts as strings, CORS that can
only be tested from the page).

The **page-view counter stays**, because it is a different number about a different
thing — it counts hits on the page, not people following her. If she ever objects, delete
the `.stats` block from `index.html` and `showViews()` from `main.js`; nothing else
depends on either.

## Palette — why this pair of sources works
Sampled the same way as the siblings: 4-bit-per-channel bucket quantisation, over the
inscribed circle for the avatar and the whole frame for the photograph.

The two sources **look like the same colour and are not**, and the whole page is built on
that gap:

- `assets/pfp.png` (her Linktree/TikTok avatar — a hamster in headphones in front of a
  pink-and-purple RGB battlestation) is **violet-dominant**: 37.8% of its chromatic pixels
  are H240–269 indigo, 23.4% H270–299 purple, only 8.0% in the magenta band. It also has
  a genuine near-black — `#080808` is its single most common bucket at 2.33% — so unlike
  the MangoPlayz build the page floor did not have to be invented, only hue-shifted.
- `assets/bg.jpg` (the pink hazy skyline she chose) is the mirror image: **75.9% H330–359
  rose**, 21.5% H300–329 magenta, and **no indigo at all**.

They overlap only in H300–329. `--orchid #C88AE0` is the midpoint of the avatar's
`#783898` and the photo's `#E898B8`, i.e. it sits exactly in that overlap, and it is why
an indigo accent and a rose accent can share a tile without arguing. All three accents
(`--orchid`, `--rose`, `--violet`) are **derived, not sampled**, because the raw buckets
are either too dark to read (`#682868` at L28) or unusable to look at (`#3808F8` at S94).

`#3808F8` — the RGB light strip — survives in exactly one place: about 50° of the conic
avatar ring, 2px wide, on a curve. At that size it reads as the light strip in her avatar
rather than as a colour.

## Tile colours are all the platforms' own
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

## The background photograph — do not "fix" its brightness in isolation
Her source is **pale**: mean luma 177.9, dominant bucket `#F8D8D8`, which is white with a
32-point RGB spread. That matters because **low chroma survives darkening badly**.
Multiplying it down the way MangoPlayz darkened its sunset turned the whole image grey —
at 0.5 brightness it measured H0 S18 and the dawn she picked it for was gone.

So the bake raises chroma before lowering light, in this order:

```
saturation=1.85, contrast=1.12
colorchannelmixer=rr=1.06:gg=0.86:bb=1.00
lutrgb=val*0.60
gblur=sigma=1.6
```

- **contrast** is what keeps the skyline reading as a silhouette instead of dissolving
  into the fog once it is dark.
- **the channel mix** pushes the greys off neutral. An earlier pass used `bb=1.14` and
  landed on H320 magenta — technically inside the palette, but it threw away the pink the
  picture was chosen for. `bb=1.00` holds H330–340.
- baked result: dominant `#987888` at H330, **mean luma 105.0**.

**105 is deliberately brighter than the MangoPlayz photo's 73.8, and the file looks pale
on its own.** The reason is that this page's `.scrim` is much weaker than that one's.
Judged as a composited page the two land in the same place; judged as a file this one
looks washed out. Do not darken the bake toward 73 without also strengthening `.scrim`,
or the dawn goes flat grey again — that is the exact loop that produced three rejected
bakes.

Measured on the composited page at 1440x900, gate dismissed:

| | value | family reference |
|---|---|---|
| page mean luma | 52.1 | 33–40 |
| tile substrate | `rgb(59, 44, 58)` | 35.3 (MangoPlayz) |
| `--text-soft` on the handle line | **7.34:1** | 4.5:1 AA floor |
| `--text-dim` | 5.34:1 | — |
| tile arrow (0.54 alpha) | 4.85:1 | 4.3:1 (MangoPlayz) |

52.1 is above the family's 33–40 and that is accepted, not overlooked. The siblings'
brightness problem was a *floor* that was too light; this floor is `#0A0610` at L4 and the
lift comes from a photograph that occupies the top of the frame. Different cause, and
darkening past this point costs the picture.

`assets/bg.jpg` is the untouched 1400x788 crop, kept to re-derive from. Nothing loads it.
`meiying-ng-OrwkD-iWgqg-unsplash.jpg` in the owner's Downloads is the original 4697x3135.

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
- `main.js` — the page-view counter, and nothing else.
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
