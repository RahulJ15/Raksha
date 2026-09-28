// Scroll helpers that only move the app's own scroll areas. element.scrollIntoView() would also scroll
// the fixed app frame (overflow: hidden is still scrollable by script) and the page, shifting the layout.

export function scrollParent(el) {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

// Make `el` visible inside its scroll area. Tall elements are aligned to the top; others are only moved
// if they are (partly) out of view. `room` keeps extra space below it visible (e.g. for a tooltip).
// alignTop: bring the element to the top of the scroll area if it sits in the lower part (used when a
// section is expanded, so the content that opened below it becomes visible).
export function revealInScroller(el, { pad = 16, room = 0, smooth = false, alignTop = false } = {}) {
  const sc = scrollParent(el);
  if (!sc) return;
  const s = sc.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const top = r.top - s.top;
  const bottom = r.bottom - s.top + room;
  let delta = 0;
  if (alignTop) { if (top > sc.clientHeight * 0.35) delta = top - pad; }
  else if (top < pad || r.height + room > sc.clientHeight - pad * 2) delta = top - pad;
  else if (bottom > sc.clientHeight - pad) delta = bottom - (sc.clientHeight - pad);
  if (Math.abs(delta) > 1) sc.scrollTo({ top: sc.scrollTop + delta, behavior: smooth ? 'smooth' : 'auto' });
}
