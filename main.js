/* delpog.xyz — page state.

   Much smaller than the sibling sites' main.js, and deliberately so: there are no
   subscriber, follower or member counts anywhere on this page. She asked for none,
   so none are fetched — not hidden, not fetched. That removes the socialcounts /
   mixerno / Discord-invite chain entirely, along with every problem that came with
   it (sources disagreeing by a notch, string-typed counts, CORS that can only be
   tested from the page).

   What is left is the page's own hit counter, which is a different number about a
   different thing. */
(() => {
  "use strict";

  /* Matches YouTube's own abbreviation: 3 significant figures, TRUNCATED.
     101,635 -> "101K" (not "102K"). 12,345 -> "12.3K". 1,234 -> "1.23K".

     The floor runs in the integer domain (n * f / v) rather than on the scaled
     float (scaled * f). Flooring a binary fraction drops a whole notch whenever
     the scaled value lands just under an exact decimal: 1.13 * 100 is
     112.99999999999999, so the float path prints 1.12K for 1130. Carried over
     verbatim because it is the fixed version and re-deriving it would re-introduce
     that bug. */
  function abbreviate(n) {
    const units = [
      { v: 1e9, s: "B" },
      { v: 1e6, s: "M" },
      { v: 1e3, s: "K" },
    ];
    for (const { v, s } of units) {
      if (n >= v) {
        const scaled = n / v;
        const dp = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
        const f = 10 ** dp;
        const truncated = Math.floor((n * f) / v) / f;
        // parseFloat drops trailing zeros: 1.00K -> 1K
        return String(parseFloat(truncated.toFixed(dp))) + s;
      }
    }
    return String(n);
  }

  /* Anything under 10,000 prints in full with thousands separators. Abbreviating
     small numbers gives "1.29K" for 1,291, which reads worse than the real
     figure — and a new page's view count lives down there for a long time. */
  function formatCount(n) {
    return n < 10_000 ? n.toLocaleString("en-GB") : abbreviate(n);
  }

  /* ---------- page views ----------
     A static page cannot count anything itself, so this leans on a keyless public
     counter. Both services were verified CORS-open from a live origin on the
     sibling site; abacus goes first only because its payload is a bare {value}.

     The hit fires once per browser SESSION, not per load, so hammering F5 does not
     inflate it — every later load just reads. The counter URL is public and anyone
     who finds it could bump it: that is the price of having no backend, and this is
     a vanity number, not analytics.

     If both services die the whole pill hides itself rather than leaving an eye
     staring at an em dash. */
  const VIEW_NS = "delpog-xyz";
  const VIEW_KEY = "views";

  const VIEW_SOURCES = [
    {
      hit: `https://abacus.jasoncameron.dev/hit/${VIEW_NS}/${VIEW_KEY}`,
      get: `https://abacus.jasoncameron.dev/get/${VIEW_NS}/${VIEW_KEY}`,
      read: (d) => d?.value,
    },
    {
      hit: `https://api.counterapi.dev/v1/${VIEW_NS}/${VIEW_KEY}/up`,
      get: `https://api.counterapi.dev/v1/${VIEW_NS}/${VIEW_KEY}/`,
      read: (d) => d?.count,
    },
  ];

  async function showViews() {
    const el = document.getElementById("viewCount");
    const numEl = document.getElementById("viewNum");
    if (!el || !numEl) return;

    let counted = false;
    try {
      counted = sessionStorage.getItem("dp2:counted") === "1";
    } catch {
      /* private mode — it just counts again, which is harmless */
    }

    for (const src of VIEW_SOURCES) {
      try {
        const res = await fetch(counted ? src.get : src.hit, { cache: "no-store" });
        if (!res.ok) continue;
        const n = Number(src.read(await res.json()));
        if (!Number.isFinite(n) || n <= 0) continue;

        numEl.textContent = formatCount(n);
        el.dataset.state = "live";
        el.setAttribute("aria-label", `${formatCount(n)} page ${n === 1 ? "view" : "views"}`);
        try {
          sessionStorage.setItem("dp2:counted", "1");
        } catch {
          /* nothing to remember it with */
        }
        return;
      } catch {
        /* try the next service */
      }
    }
    el.dataset.state = "dead";
  }

  showViews();
})();
