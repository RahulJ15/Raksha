import re
import sys
from pathlib import Path

d = Path(sys.argv[1])
raw = (d / "logic.raw.js").read_text()

si = re.search(r"    const SI = \{.*?SI\.sprinkler = SI\.pressure;\n", raw, re.S).group(0)
cat = re.search(r"    const CAT = \{.*?const CATS = \[[^\]]*\];\n", raw, re.S).group(0)

new_data = """  // Sensor list, kinds and map layout come from the API (props.site); icons and categories stay here.
  data() {
    if (this.D) return this.D;
""" + si + """    const site = this.props.site;
    const KD = site.kinds;
    const LV = site.levels;
    const list = site.sensors.map((x) => Object.assign({}, x));
    const LEVELS = ['roof', 'l1', 'grounds'];
    list.forEach((s) => {
      const k = KD[s.kind];
      s.cx = s.box[0] + s.box[2] / 2; s.cy = s.box[1] + s.box[3] / 2;
      s.k = k; s.icon = SI[s.kind];
      s.off = s.st === 'off';
      s.low = s.batt < 15 && !s.off;
      s.color = { crit: 'var(--crit)', watch: 'var(--watch)', ok: 'var(--ok)', off: 'var(--line2)' }[s.st];
      s.tag = { crit: 'Critical', watch: 'Watch', ok: 'Normal', off: 'Offline' }[s.st];
      const fmt = (x) => (k.plus && x > 0 ? '+' : '') + x.toFixed(k.dp);
      s.fmt = fmt;
      s.valNum = s.off ? '--' : fmt(s.v);
      s.valStr = s.off ? 'offline' : fmt(s.v) + ' ' + k.unit;
      s.baseStr = fmt(s.base) + ' ' + k.unit;
      s.problem = s.st === 'crit' || s.st === 'watch';
      s.levelName = LV[s.level].name;
    });
""" + cat + """    const PL_OK = { urg: 'No action', who: 'Nobody yet',
      what: 'Readings are inside the normal range for this sensor.',
      why: 'Nothing needs fixing here right now.',
      todo: ['No action needed. The app will alert you if this changes.'] };
    list.forEach((s) => {
      if (!s.plain && s.low) s.plain = { h: 'Sensor battery is low', urg: 'This week', who: 'Your site team', what: 'The sensor is still reporting, but its battery is almost empty.', why: 'When the battery dies, this spot stops being watched.', todo: ['Replace the sensor battery', 'Check the next reading comes through'] };
      if (!s.plain) s.plain = Object.assign({ h: s.zone + ' is reading normally' }, PL_OK);
    });
    // Sensors flagged pending (installed but not yet paired) are held back until the pair flow adds them.
    // this.paired survives data refreshes, so a sensor paired in the app stays paired.
    const isPending = (s) => s.pending && !(this.paired && this.paired.has(s.id));
    const pending = list.filter(isPending);
    this.D = { SI, KD, LV, list: list.filter((s) => !isPending(s)), pending, LEVELS, CAT, CATS };
    return this.D;
  }
"""

start = raw.index("  data() {")
end = raw.index("    return this.D;\n  }\n", start) + len("    return this.D;\n  }\n")
body = raw[:start] + new_data + raw[end:]

body = body.replace(
    "class Component extends DCLogic {",
    "// Ported from infrasensor/source/Main.dc.html. Sensor data arrives as props.site from the API.\n"
    "import { Component } from 'react';\nimport renderTemplate from './template';\nimport ScanPanel from './ScanPanel';\n"
    "import InfoCard from './InfoCard';\nimport { MEASUREMENTS } from './glossary';\n\n"
    "export default class Main extends Component {",
    1,
)
last = body.rstrip().rindex("}")
body = body[:last] + """
  componentDidUpdate(prev) {
    if (prev.site !== this.props.site) {
      this.D = null;
      this.CI = null;
      this.forceUpdate();
    }
  }

  componentDidUpdate(_, prev) {
    if (this.state.onboarded && !prev.onboarded) {
      try { localStorage.setItem('infrasensor:onboarded', '1'); } catch (e) { /* storage unavailable */ }
    }
  }

  render() {
    const v = this.renderVals();
    v.openScan = () => this.setState({ scanOpen: true });
    v.railScanFg = this.state.scanOpen ? 'var(--tx)' : '';
    const det = this.byId(this.state.detId);
    v.infoCard = det ? <InfoCard key={det.id} entry={MEASUREMENTS[det.kind]} /> : null;
    v.scanPanel = this.state.scanOpen ? <ScanPanel onClose={() => this.setState({ scanOpen: false })} /> : null;
    return renderTemplate(v);
  }
}
"""
body = body.replace("""    if (this.CI) return this.CI;
    const D = this.data();
""", """    const D = this.data();
    if (this.CI) return this.CI;
""", 1)
body = body.replace("""  data() {
    if (this.D) return this.D;
""", """  data() {
    if (this.D && this.dSite === this.props.site) return this.D;
    this.dSite = this.props.site;
    this.CI = null;
""", 1)
assert "      D.list.push(p);\n" in body
body = body.replace("      D.list.push(p);\n", "      D.list.push(p);\n      (this.paired = this.paired || new Set()).add(p.id);\n", 1)
(d / "Main.jsx").write_text(body.lstrip())
(d / "logic.raw.js").unlink()
print("ok")
