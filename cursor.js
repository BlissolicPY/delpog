/* Delpog — motion-blurred cursor trail.

   The native cursor is deliberately LEFT VISIBLE. Hiding it and drawing a dot
   instead is the fashionable version and it is worse: people lose track of the
   pointer, text-selection and link affordances disappear, and any frame drop
   makes the whole page feel broken. This draws a soft glow that lags behind the
   real pointer instead, so the cursor keeps all its normal behaviour and just
   gains a tail.

   The "motion blur" is squash-and-stretch, not a filter: the glow is rotated to
   face the direction of travel and stretched along it in proportion to speed,
   which is what a real smeared highlight does. A blur filter alone just looks
   out of focus. */

(() => {
  "use strict";

  // no trail on touch — there is no cursor to blur, and it would just be a
  // stray glow that teleports on every tap
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const EASE = 0.16;        // how fast the glow chases the pointer, 0-1
  const STRETCH = 0.055;    // px of speed -> extra length
  const MAX_STRETCH = 2.6;  // ceiling, or fast flicks turn it into a streak
  const IDLE_FADE = 0.12;   // opacity easing when the pointer stops

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");

  /* The tint is the one thing here that is not the MangoPlayz file verbatim. That
     glow was gold and its colour lived entirely in CSS; this one takes its hue
     from the page's own --orchid so the trail can never drift from the palette,
     falling back to the literal if the property isn't there yet. It is set from
     JS rather than CSS because the gradient needs the same colour at four
     different alphas, and CSS gives no way to take a custom property apart.

     Still deliberately absent, and must stay absent: `mix-blend-mode: screen`
     and any `filter: blur()`. Both were removed in MangoPlayz's performance pass
     and both cost frames — the softness is the gradient's job, and the smear is
     squash-and-stretch below.

     The gold original moved hue across its stops (#FED639 -> #FDA626 -> #FC7614),
     and a single colour at four alphas loses that. So this reads all three of the
     page's accents and runs the same span the avatar ring does: rose in the core,
     orchid through the middle, violet fading out. */
  const css = getComputedStyle(document.documentElement);
  const hue = (name, fallback) =>
    css.getPropertyValue(name).trim() || fallback;

  const ROSE = hue("--rose", "#F5A8C4");
  const ORCHID = hue("--orchid", "#C88AE0");
  const VIOLET = hue("--violet", "#8A5CF0");

  // anything that isn't a 3- or 6-digit hex falls back, rather than emitting a
  // malformed gradient and therefore no glow at all
  function tint(hex, alpha) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) h = "C88AE0";
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  // the gold original's four stop positions and four alphas, unchanged — only
  // the hues move, so the falloff reads identically
  glow.style.background =
    "radial-gradient(circle, " +
    tint(ROSE, 0.44) + " 0%, " +
    tint(ORCHID, 0.28) + " 26%, " +
    tint(VIOLET, 0.12) + " 48%, " +
    tint(VIOLET, 0) + " 72%)";

  document.body.appendChild(glow);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let x = pointerX;
  let y = pointerY;
  let opacity = 0;
  let target = 0;
  let running = false;

  function onMove(e) {
    // quality.js hides the glow on a struggling machine; without this the rAF
    // loop would keep running for an element nobody can see
    if (document.documentElement.dataset.q === "low") return;
    pointerX = e.clientX;
    pointerY = e.clientY;
    target = 1;
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  function frame() {
    const dx = pointerX - x;
    const dy = pointerY - y;

    x += dx * EASE;
    y += dy * EASE;

    // velocity of the GLOW, not the pointer: it's what's actually being drawn,
    // so the stretch stays in sync with the thing smearing
    const vx = dx * EASE;
    const vy = dy * EASE;
    const speed = Math.hypot(vx, vy);

    const scaleX = Math.min(1 + speed * STRETCH, MAX_STRETCH);
    const scaleY = 1 / Math.sqrt(scaleX); // keep the area roughly constant
    const angle = speed > 0.1 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0;

    opacity += (target - opacity) * IDLE_FADE;

    glow.style.opacity = String(opacity);
    glow.style.transform =
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) ` +
      `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

    // park the loop once it has settled and faded, so an idle tab costs nothing
    const settled = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1;
    if (settled && Math.abs(target - opacity) < 0.01) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  }

  function fadeOut() {
    target = 0;
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  document.addEventListener("mouseleave", fadeOut);
  window.addEventListener("blur", fadeOut);
})();
