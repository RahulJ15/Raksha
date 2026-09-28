"""Re-apply our additions to a freshly generated template.jsx: the Scan rail button, the info card on the
detail sheet, the scan panel slot, and class hooks the desktop CSS uses (map viewport, onboarding)."""

import sys
from pathlib import Path

p = Path(sys.argv[1]) / "template.jsx"
s = p.read_text()


def once(old: str, new: str) -> None:
    global s
    assert s.count(old) == 1, f"anchor not found exactly once: {old[:70]!r}"
    s = s.replace(old, new)


log_btn = """          Log
        </span>
      </button>
"""
once(log_btn, log_btn + """      <button className="ns-btn ns-rail" aria-label="Upload scan" onClick={v.openScan} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railScanFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 15V4.5M7.5 9 12 4.5 16.5 9M5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Scan
        </span>
      </button>
""")

why = """            Why it matters
          </span>
          <p style={css("margin: 0; font-size: 14px; line-height: 20px")}>
            {v.d.why}
          </p>
        </div>
"""
once(why, why + "        {v.infoCard}\n")

end = s.rindex("</div>\n  </>);")
s = s[:end] + "  {v.scanPanel}\n" + s[end:]

# Class hooks for the desktop layout (see src/index.css).
once('''<div style={css("flex-grow: 1; min-height: 0; position: relative; overflow: hidden; background: var(--map); border-top: 1px solid var(--line)")}>''',
     '''<div className="ns-mapview" style={css("flex-grow: 1; min-height: 0; position: relative; overflow: hidden; background: var(--map); border-top: 1px solid var(--line)")}>''')
once('''<div style={css("position: absolute; inset: 0; z-index: 60; background: var(--bg); overflow: hidden; display: flex; flex-direction: column")}>''',
     '''<div className="ns-onb" style={css("position: absolute; inset: 0; z-index: 60; background: var(--bg); overflow: hidden; display: flex; flex-direction: column")}>''')
once('''<div className={v.panClass} style={css(`position: absolute; left: 0; top: 0; width: 318px; height: 424px;''',
     '''<div className={`ns-maplayer ${v.panClass}`} style={css(`position: absolute; left: 0; top: 0; width: 318px; height: 424px;''')

p.write_text(s)
print("template patched")
