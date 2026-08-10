/* delpog — the butterfly emergence, and the calm drift that follows it.

   Port of ../MangoPlayz Website/leaves.js. Same architecture, different
   creature: hooked to the `dp:enter` event the inline gate script fires rather
   than to a click handler of its own (the gate has to stay independent of every
   other file, and this is pure decoration — if it never runs, nothing about the
   page breaks), and split across three nested elements because one keyframe
   cannot do it.

     .bf / .bf-drift   the OUTER element — carries the travel path
     .bf__wander       the MIDDLE element — carries the sway, bob and bank
     .bf__art  (svg)   the INNER element — carries the wing flap

   Composing three trivial transform-only animations gives organic motion that
   stays on the compositor. Where the leaf gust crossed the screen LINEARLY on
   purpose (wind does not slow down in the middle of the screen), a butterfly is
   self-propelled: the emergence path arcs sideways first and then climbs, and
   decelerates as it disperses.

   One rule this file will not break, and it is the reason the sibling site's
   bats were expensive: NOTHING ANIMATES INSIDE A FILTER. A `filter: blur()`
   whose subtree changes every frame is re-rasterised every frame. So the depth
   band that gets the blur is the one band whose wings hold a fixed pose, and
   every element that flaps has no filter at all. See ../MangoPlayz
   Website/CLAUDE.md, "Performance (2026-07-29)". */

(() => {
  "use strict";

  /* NOT gated on prefers-reduced-motion here, unlike the ancestor. The calm
     variant is a CSS concern — see the media query at the foot of
     butterflies.css — because the drift should degrade to a near-static handful
     rather than vanish, and a JS early-return cannot express that. */

  /* quality.js sets data-q on <html> from measured frame times, and owns that
     measurement entirely. Read at spawn time rather than cached, so a downgrade
     partway through takes effect. */
  const tier = () => document.documentElement.dataset.q || "high";
  // Buffed from 48/28/14 on request. The burst is transient — it is gone inside
  // ~4s and it is the one moment the page is allowed to be expensive — and the
  // quality probe now waits until 4500ms so it no longer judges the machine on it.
  const BURST = () => (tier() === "low" ? 22 : tier() === "mid" ? 48 : 84);

  /* Raised from 7/3/0 to match the Blissolic page's ambient bat population, which
     the owner asked for by name. Those numbers, read off the deployed bats.js:
     `fallMax()` caps at 20 / 9 / 0 and `FALL_EVERY` is 700ms.

     The cap alone does not get you there — steady-state population is
     min(cap, lifetime / interval). At the old 2100ms interval and a 12-20s
     lifetime that is 16/2.1 = 7.6, so the interval was the real ceiling and
     raising the cap by itself would have changed nothing. Hence DRIFT_EVERY
     below.

     Note phones land on `mid` before a single frame is measured, because
     quality.js treats `(pointer: coarse)` as a starting hint — so a phone gets 9,
     exactly like the Blissolic page does. */
  const DRIFT_ALIVE = { high: 20, mid: 9, low: 0 };
  const driftMax = () => DRIFT_ALIVE[tier()] ?? 7;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- palette ----------
     The three accent tints live on :root; these hexes are only the fallback for
     a page whose stylesheet failed. Nothing here invents a colour: a wing is a
     ramp between two of the three, the body takes the deeper of the pair, and
     the distant band is darkened with a static brightness() rather than with a
     fourth swatch. Read once, on first spawn, so the stylesheet has certainly
     parsed. */
  let PAIRS = null;
  function pairs() {
    if (PAIRS) return PAIRS;
    const cs = getComputedStyle(document.documentElement);
    const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
    const rose = v("--rose", "#F5A8C4");
    const orchid = v("--orchid", "#C88AE0");
    const violet = v("--violet", "#8A5CF0");
    // [lighter, deeper] — the gradient runs from the leading edge inwards
    PAIRS = [
      [rose, orchid],   // the pink one
      [orchid, violet], // the orchid one
      [rose, violet],   // the high-contrast one
    ];
    return PAIRS;
  }

  /* ---------- the butterfly ----------
     Drawn in a 0 0 100 100 viewBox with the body on x = 50, so the wing groups
     can be flapped about the body's centre line by transform-origin alone.

     One wing pair is described once and used twice: the left group is the same
     paths under scaleX(-1) about that centre line, which is also what makes the
     flap intrinsically symmetric. See .bf__wing in butterflies.css.

     The forewing is what stops this being a bowtie. Its leading edge (COSTA) is
     a shallow convex sweep out to a swept apex near (95, 9); the outer margin
     back down to the rear corner is deliberately CONCAVE — control points
     pulled inside the chord — which is the single line that reads as "wing"
     rather than "petal". The hindwing tucks under it at y = 42 and finishes in
     a small tail lobe, so the two are separately legible and the pair is not
     symmetrical top-to-bottom. The overlap of the two at <1 alpha darkens into
     a seam, which is the wing division, free.

     Node count is size-dependent: the discal wash reads from about 40px and the
     apex spots from about 90px, so a 20px butterfly does not pay for either. */
  const FORE =
    "M50 33C57 25 68 16 82 9.6c6-3 11.4-3.2 13 .2c1.4 3 .4 6.6-2.4 11.2" +
    "C86.6 31 77.4 40 66.6 46.4c-4.2 2.2-8 2-10.6-.4C52.6 43 50.6 38 50 33Z";
  const HIND =
    "M50 42c11-2 21.6 1 29.4 7.4C88 56.4 87.6 65.6 81.4 72.4" +
    "c-2.4 2.6-5 4.2-7.4 5.2c1 4-1 7.6-4.6 9.4c-4 2-8 .4-10.4-3.4" +
    "C56 78 51.4 58 50 42Z";
  const COSTA = "M50 33C57 25 68 16 82 9.6";
  const DISC =
    "M53 36.5C58.6 32.6 66 29.6 73.6 27.6c-3.6 6-10 11.6-16.8 14.6" +
    "c-3 1.4-4.8.4-3.8-5.7Z";
  const SPOT = "M78.6 17.2a3 3 0 1 0 .1 0ZM87.4 13.4a2.1 2.1 0 1 0 .1 0Z";
  const BODY =
    "M50 24c2.4.6 3.7 2.7 3.4 5.7C53.1 33 52.8 37 52.7 41" +
    "C52.5 51 52 60 50 68C48 60 47.5 51 47.3 41" +
    "C47.2 37 46.9 33 46.6 29.7C46.3 26.7 47.6 24.6 50 24Z";
  const ANT =
    "M48.6 24.6C45 19 41.2 15.6 36.4 13.6M51.4 24.6C55 19 58.8 15.6 63.6 13.6";

  /* Gradient ids have to be unique per butterfly. url(#id) resolves to the
     FIRST match in the document, so a shared id would paint all 48 of them in
     the first one's colours — and stop-color: currentColor does not help,
     because a stop resolves its own inherited colour, not the referrer's. */
  let uid = 0;

  function art(light, deep, lod) {
    const id = `dpbf${++uid}`;
    let wing =
      `<path d="${HIND}" fill="url(#${id})" fill-opacity=".9"/>` +
      `<path d="${FORE}" fill="url(#${id})"/>`;
    if (lod >= 1) wing += `<path d="${DISC}" fill="${light}" fill-opacity=".3"/>`;
    wing +=
      `<path d="${COSTA}" fill="none" stroke="${light}" stroke-opacity=".85"` +
      ` stroke-width="2" stroke-linecap="round"/>`;
    if (lod >= 2) wing += `<path d="${SPOT}" fill="${light}" fill-opacity=".55"/>`;

    return (
      `<svg class="bf__art" viewBox="0 0 100 100">` +
      // a paint server renders nothing, so it needs no <defs> wrapper
      `<linearGradient id="${id}" gradientUnits="userSpaceOnUse"` +
      ` x1="56" y1="10" x2="70" y2="92">` +
      `<stop offset="0" stop-color="${light}" stop-opacity="1"/>` +
      `<stop offset=".38" stop-color="${light}" stop-opacity=".8"/>` +
      `<stop offset=".78" stop-color="${deep}" stop-opacity=".8"/>` +
      `<stop offset="1" stop-color="${deep}" stop-opacity=".6"/>` +
      `</linearGradient>` +
      `<g class="bf__wing" style="--sx:1">${wing}</g>` +
      `<g class="bf__wing" style="--sx:-1">${wing}</g>` +
      `<path d="${BODY}" fill="${deep}" fill-opacity=".92"/>` +
      `<path d="${ANT}" fill="none" stroke="${light}" stroke-opacity=".6"` +
      ` stroke-width="1.8" stroke-linecap="round"/>` +
      `</svg>`
    );
  }

  /* ---------- the layer ----------
     z-index 1 against the card's 2, so nothing ever crosses the text and, since
     the tiles use backdrop-filter, a butterfly passing behind one shows through
     the glass as a soft blurred shape. That is the nicest part of the effect and
     it is free — it only works because they are underneath. */
  const layer = document.createElement("div");
  layer.className = "flutter";
  layer.setAttribute("aria-hidden", "true");

  /* ---------- effect 1: the emergence ---------- */

  // Where the burst comes from: behind the card, across its WHOLE height.
  //
  // This used to spawn only in the top 4-62% of the card and send every butterfly
  // upward, which put the entire swarm in a band around the hero and left the tile
  // stack bare — it read as "they all appear in the centre". Now the spawn spans
  // the full card and the travel direction is derived from where each one started,
  // so the ones down by the tiles fan sideways and downward instead of all rising.
  function source() {
    const card = document.querySelector(".card");
    if (card) {
      const r = card.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return r;
    }
    // no card on the page (or none laid out yet): roughly where one would be
    const w = innerWidth || 1280;
    const h = innerHeight || 800;
    return { left: w * 0.5 - 160, top: h * 0.28, width: 320, height: h * 0.44 };
  }

  function emerge() {
    const frag = document.createDocumentFragment();
    const tints = pairs();
    const box = source();
    const n = BURST();
    // Widened from 92. At 92 the fan was a cone and the extremes still left
    // upward; 124 puts the outermost bearings past horizontal, which combined with
    // the fy-scaled rise below gives genuine downward dispersal at the bottom.
    const SPREAD = 124; // degrees either side of straight up

    for (let i = 0; i < n; i++) {
      const bf = document.createElement("span");
      bf.className = "bf";

      /* Three depth bands rather than one flat random size, as in the ancestor.
         The foreground ones are the whole effect: big, fast, sharp and beating
         their wings, they are what makes this read as an emergence rather than
         as confetti. */
      const roll = Math.random();
      const size =
        roll < 0.14 ? rand(90, 150) : // foreground
        roll < 0.55 ? rand(40, 90)  : // midground, the bulk of it
                      rand(18, 40);   // background
      // 0 = right in front of the lens, 1 = far away
      const far = 1 - Math.min((size - 18) / 132, 1);
      const soft = size < 40; // the only band that carries a filter

      /* A stratified bearing rather than a uniform random one: pure random
         clumps, and a burst with gaps in the fan looks like it misfired. Every
         butterfly also gets a guaranteed sideways component and a guaranteed
         upward one, so even the ones leaving straight up still arc, and the
         near-horizontal ones at the edges of the fan still rise. */
      /* Horizontal travel is measured in vw and vertical in vh, deliberately
         NOT vmax for both. vmax sizes the lateral sweep against the LONGER edge,
         so on a portrait phone every butterfly crossed about 2.4 viewport widths
         and the entire burst had left the screen inside half a second. Splitting
         the units costs a little angular fidelity on extreme aspect ratios and
         buys identical framing on all of them. */
      const deg = (((i + Math.random()) / n) * 2 - 1) * SPREAD;
      const rad = (deg * Math.PI) / 180;
      const side = deg === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(deg);

      /* fy is where this one starts down the card: 0 at the top, 1 at the bottom.
         The vertical travel is scaled by it, and the scale crosses zero at about
         70% down, so butterflies from the hero rise, ones level with the middle
         tiles leave sideways, and ones from the bottom edge drop away below the
         card. That is what stops the burst reading as a single clump: the swarm
         now leaves in every direction because it did not all start in one place. */
      const fy = rand(0.02, 0.98);
      const rise = rand(58, 96) * (1.05 - fy * 1.5);
      const dx = Math.sin(rad) * rand(62, 95) + side * rand(5, 14);
      let dy = -Math.cos(rad) * rise;
      // nothing should hover: give the near-horizontal ones a real vertical push
      if (Math.abs(dy) < 16) dy = (dy < 0 ? -1 : 1) * rand(16, 26);

      const s = bf.style;
      s.setProperty("--x", `${(box.left + rand(0.06, 0.94) * box.width).toFixed(0)}px`);
      s.setProperty("--y", `${(box.top + fy * box.height).toFixed(0)}px`);
      s.setProperty("--size", `${size.toFixed(0)}px`);
      s.setProperty("--dx", `${dx.toFixed(1)}vw`);
      s.setProperty("--dy", `${dy.toFixed(1)}vh`);
      // near butterflies cover ground fast, distant ones lag — parallax, so the
      // depth reads without any perspective
      s.setProperty("--dur", `${(rand(1.6, 2.2) + far * 1.3).toFixed(2)}s`);
      // the big near ones start last, so the swarm resolves from back to front
      s.setProperty("--delay", `${(rand(0, 0.42) + (1 - far) * 0.1).toFixed(2)}s`);
      s.setProperty("--op", (0.95 - far * 0.45).toFixed(2));

      /* The resting pose, set on every butterfly even though the flap overrides
         it: it is what the distant band keeps permanently, and what the whole
         burst falls back to at the low tier and under reduced motion. Without it
         a frozen batch is 14 identical rubber stamps. */
      s.setProperty("--pose", rand(0.52, 1).toFixed(2));

      if (soft) {
        /* Distance: a small static blur, a little darker, and that fixed pose.
           The pose is what buys the blur — a flap inside a filter is the bat
           mistake, and at 18–40px behind 1px of blur at half opacity a still
           wing is not something anyone can see. */
        bf.classList.add("bf--soft");
        s.setProperty("--blur", `${rand(0.6, 1.5).toFixed(2)}px`);
        s.setProperty("--dim", rand(0.72, 0.9).toFixed(2));
      } else {
        s.setProperty("--flap", `${rand(110, 190).toFixed(0)}ms`);
        // a NEGATIVE delay is the right tool here and only here: it desynchronises
        // an infinite loop that has no fade-in to skip. See dropButterfly() for
        // the case where it is the wrong tool.
        s.setProperty("--flapPhase", `${-rand(0, 190).toFixed(0)}ms`);
        s.setProperty("--flapMin", rand(0.26, 0.5).toFixed(2));
      }

      const wander = document.createElement("i");
      wander.className = "bf__wander";
      const w = wander.style;
      // the weave has to scale with the butterfly or the big ones look railed
      w.setProperty("--sway", `${(rand(8, 22) + size * 0.16).toFixed(0)}px`);
      w.setProperty("--bob", `${rand(4, 12).toFixed(0)}px`);
      w.setProperty("--bank", `${rand(3, 11).toFixed(0)}deg`);
      w.setProperty("--wanderDur", `${rand(0.7, 1.4).toFixed(2)}s`);
      wander.innerHTML = art(...pick(tints), size >= 90 ? 2 : size >= 40 ? 1 : 0);

      bf.appendChild(wander);
      // each butterfly clears itself up the moment it has dispersed
      bf.addEventListener("animationend", () => bf.remove(), { once: true });
      frag.appendChild(bf);
    }

    layer.appendChild(frag);

    /* One sweeper instead of 48 timers. animationend does the work normally,
       but it never fires for a display:none butterfly (reduced motion) and can
       be missed if the tab is backgrounded mid-burst, and orphaned nodes in the
       layer would then sit under the card forever. */
    setTimeout(() => {
      layer.querySelectorAll(".bf").forEach((el) => el.remove());
    }, 6000);
  }

  /* ---------- effect 2: the ambient drift ----------
     Sparse, calm and continuous: butterflies rising and crossing, forever. */

  /* 800ms, not the old 2100ms. With a 12-20s crossing (mean 16s) this fills to
     16 / 0.8 = 20, so the DRIFT_ALIVE cap is now the thing that binds rather than
     the drip rate. Blissolic uses 700ms against a shorter 9-16s fall and settles
     around 18 of its 20. */
  const DRIFT_EVERY = 800; // ms between spawns
  let drifting = 0;
  let timer = null;
  let driftOn = false;

  function dropButterfly(initial) {
    if (drifting >= driftMax()) return;
    drifting++;

    const bf = document.createElement("span");
    bf.className = "bf-drift";

    /* 16-38px, up from 12-28. Blissolic's ambient bats are 28-70px; matching that
       outright would fight the tiles, but 12-28 was small enough that 20 of them
       still read as "barely any". This is the midpoint that reads as a population
       without competing with the text. */
    const size = rand(16, 38);

    /* The first batch has to start part-way up the screen, or the page sits
       bare for twenty seconds waiting for one to arrive. The obvious way to do
       that is a NEGATIVE animation delay, and it is wrong — already made wrong
       once on the sibling site: a negative delay drops each butterfly into the
       middle of its timeline, past the fade-in, so the whole opening batch
       materialises at once at full opacity.

       So each one gets a real starting offset in --y0 and plays its animation
       from 0%, fading in properly wherever it begins. Duration AND lateral
       travel are both scaled by the distance still to go, or a butterfly
       starting near the top would crawl upwards while sliding sideways at
       everybody else's speed. A small positive delay staggers the batch so the
       fade-ins don't stack. */
    const y0 = initial ? rand(4, 100) : 0;
    const togo = (128 - y0) / 128;

    const s = bf.style;
    s.setProperty("--x", `${rand(-4, 100).toFixed(1)}vw`);
    s.setProperty("--size", `${size.toFixed(1)}px`);
    s.setProperty("--y0", `${y0.toFixed(1)}vh`);
    s.setProperty("--dur", `${(rand(12, 20) * togo).toFixed(1)}s`);
    s.setProperty("--delay", initial ? `${rand(0, 2.2).toFixed(2)}s` : "0s");
    s.setProperty(
      "--drift",
      `${((Math.random() < 0.5 ? -1 : 1) * rand(8, 34) * togo).toFixed(1)}vw`
    );
    /* 0.30-0.58, up from 0.18-0.42. Count alone did not fix "barely any": at 0.18
       these were genuinely invisible against a mid-luma photograph. Blissolic runs
       its bats at 0.62-0.95, but it does so over a night sky - over this pink dawn
       anything that opaque stops being ambient and starts being foreground. */
    s.setProperty("--op", rand(0.3, 0.58).toFixed(2));
    s.setProperty("--pose", rand(0.55, 1).toFixed(2));
    // no filter anywhere in the drift, so all seven of them can flap freely
    s.setProperty("--flap", `${rand(120, 190).toFixed(0)}ms`);
    s.setProperty("--flapPhase", `${-rand(0, 190).toFixed(0)}ms`);
    s.setProperty("--flapMin", rand(0.3, 0.54).toFixed(2));

    const wander = document.createElement("i");
    wander.className = "bf__wander";
    const w = wander.style;
    w.setProperty("--sway", `${rand(10, 26).toFixed(0)}px`);
    w.setProperty("--bob", `${rand(3, 9).toFixed(0)}px`);
    w.setProperty("--bank", `${rand(2, 7).toFixed(0)}deg`);
    w.setProperty("--wanderDur", `${rand(2.6, 5).toFixed(1)}s`);
    /* Both drift pairs end on --violet, so the body and the trailing margin
       always carry the darkest tint available. That is not decoration: the top
       of this page is a pale rose dawn, and at 12–28px and 0.2 opacity a
       rose-into-orchid butterfly crossing it converges with the photograph and
       stops reading at all. It is the ancestor's own complaint — its drift
       painted in the background's own mid-tones "didn't look like it was even
       there" — arriving from the opposite direction, a floor too light rather
       than tints too dark. The burst is unaffected: it is over before anyone
       looks that closely, and it uses all three pairs. */
    wander.innerHTML = art(...pairs()[Math.random() < 0.3 ? 2 : 1], 0);

    bf.appendChild(wander);
    bf.addEventListener(
      "animationend",
      () => {
        bf.remove();
        drifting--;
      },
      { once: true }
    );
    layer.appendChild(bf);
  }

  function tick() {
    if (!timer) timer = setInterval(() => dropButterfly(false), DRIFT_EVERY);
  }

  function startDrift() {
    driftOn = true;
    for (let i = 0, n = driftMax(); i < n; i++) dropButterfly(true);
    tick();
  }

  // a backgrounded tab has nobody looking at it
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (driftOn) {
      tick();
    }
  });

  /* A downgrade mid-session culls the surplus rather than waiting for each
     butterfly to finish its crossing. quality.js fires this; it may arrive on
     either target, and running twice is harmless. */
  const onQuality = () => {
    const max = driftMax();
    const alive = layer.querySelectorAll(".bf-drift");
    for (let i = max; i < alive.length; i++) {
      alive[i].remove();
      drifting--;
    }
  };
  document.addEventListener("dp:quality", onQuality);
  window.addEventListener("dp:quality", onQuality);

  /* ---------- entry ---------- */

  let started = false;
  function start() {
    if (started) return;
    started = true;
    document.body.appendChild(layer);
    emerge();
    // let the emergence be the whole picture first, then settle into the drift
    setTimeout(startDrift, 1800);
  }

  /* Never a click handler of our own: the gate is dismissed by an inline script
     in <head> and fires `dp:enter`, and it has to keep working whether or not
     this file ever loaded. Both targets are bound because whose object the gate
     dispatches on is the gate's business, not ours — an event dispatched on
     window does not reach document, and start() is idempotent. */
  document.addEventListener("dp:enter", start, { once: true });
  window.addEventListener("dp:enter", start, { once: true });

  /* And the late case: if the gate already cleared before this file parsed,
     `dp:enter` is gone and the listeners above would wait forever.

     The gate leaves two flags behind for exactly this — `html[data-entered="1"]`
     and `window.__dpEntered` — and either of them is proof on its own. The rest
     is the fallback for a page whose gate has been rewritten without them: the
     gate marks <html class="gated"> before first paint and removes it on
     dismissal, so no `gated` and no gate element still standing means we missed
     it, which is also true of a page carrying no gate at all, where the entrance
     should simply play on load. Checking for a standing gate element is what
     stops a renamed marker class from firing the burst behind the overlay. */
  function alreadyIn() {
    const root = document.documentElement;
    if (root.dataset.entered === "1" || window.__dpEntered) return true;
    if (root.classList.contains("gated")) return false;
    const gate = document.getElementById("gate") || document.querySelector(".gate");
    return !gate || gate.hidden || gate.classList.contains("is-leaving");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        if (alreadyIn()) start();
      },
      { once: true }
    );
  } else if (alreadyIn()) {
    start();
  }
})();
