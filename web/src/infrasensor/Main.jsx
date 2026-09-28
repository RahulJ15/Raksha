// Ported from infrasensor/source/Main.dc.html. Sensor data arrives as props.site from the API.
import { Component } from 'react';
import renderTemplate from './template';
import ScanPanel from './ScanPanel';
import InfoCard from './InfoCard';
import Tour from './Tour';
import { MEASUREMENTS } from './glossary';

export default class Main extends Component {
  constructor(...args) {
    super(...args);
    this.state = Object.assign({}, this.state || {}, {
      screen: 'overview', level: 'roof', selId: null, sensFilter: 'all',
      walking: false, walkP: 0, arrived: false, walkRoute: null,
      origin: { level: 'l1', x: 150, y: 330, name: 'Lobby' },
      intro: 0, introDone: false, pulseDone: false,
      panelX: 1, detOpen: false, detId: 'RH-V6', detP: 0,
      blinkId: null, logged: {}, repair: {}, visited: {},
      toastText: '', toastOn: false, cat: 'all', catFlip: false, healthInfo: false,
      tickets: { 'VB-R2': { tech: 'marcus', ago: 140, status: 'progress' }, 'PR-B1': { tech: 'priya', ago: 1800, status: 'progress' }, 'MS-DN': { tech: 'dana', ago: 120, status: 'progress' } },
      resolved: [
        { zone: 'Roof vent 3', text: 'humidity back to normal after the curb was resealed', by: 'Dana Ortiz', when: 'Yesterday 16:12' },
        { zone: 'Water pipe B', text: 'leak noise stopped after the joint was replaced', by: 'Priya Nair', when: '24 Sep 10:02' },
        { zone: 'Water pump', text: 'vibration back to baseline after realignment', by: 'Marcus Hill', when: '23 Sep 15:40' }
      ],
      logExtra: [], logDate: 'week', logType: 'all', logAsset: 'all',
      attnOpen: true, attnAll: false, healthyOpen: false, resolvedOpen: false, othersOpen: false,
      chatOpen: false, chatY: 1, chatDraft: '', chatTyping: false,
      chatMsgs: [{ from: 'bot', text: 'Hi. I can see every sensor, ticket and technician at Northside Annex. Ask me something like "What is wrong with Roof vent 6?" or "Who should fix Rooftop AC 2?"' }],
      bpStage: 'camera', bpEdges: false, bpP: 0, pinP: 0, yaw: 28, pitch: 56, ucard: 0, sheetMin: false, navDir: 1, chatCtx: { sensor: null, tech: null },
      introIdx: 0, introTouched: false, authMode: 'signup', authName: '', authEmail: '', authPass: '', diagStep: 0, diagDir: 1, diagFlip: false,
      dg: { watch: ['water', 'pipes', 'equip', 'heat', 'structure', 'air'], where: ['roof', 'mech', 'walls', 'elec', 'floors', 'grounds'], floors: 4, area: null, speed: null, respond: [], teamSize: 3, control: [], trouble: [] }, kit: null,
      siteCode: 'NSA-4827', devOff: {}, devRate: {}, devId: 'RH-V6', devOpen: false, devY: 1, devCheck: 0, devCheckId: null,
      pairOpen: false, pairY: 1, pairStage: 'enter', pairCode: '', pairP: 0, pairDevId: '', justPaired: null, kitDismissed: false, onboarded: false
    });
    this.tweens = {};
    this.timers = [];
    this.sp = null;
    this.raf = null;
    this.last = null;
    this.introRan = false;
  }

  // Sensor list, kinds and map layout come from the API (props.site); icons and categories stay here.
  data() {
    if (this.D && this.dSite === this.props.site) return this.D;
    this.dSite = this.props.site;
    this.CI = null;
    const SI = {
      humidity: 'M12 3.5c3.2 4.2 5.5 7.1 5.5 10a5.5 5.5 0 0 1-11 0c0-2.9 2.3-5.8 5.5-10zM9.6 14.2a2.5 2.5 0 0 0 2.4 2.4',
      moisture: 'M4 17h16M6 20h12M12 3.5c2.4 3.1 4 5.2 4 7.3a4 4 0 0 1-8 0c0-2.1 1.6-4.2 4-7.3z',
      thermal: 'M10 13.6V5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0zM12 10v6',
      vibration: 'M9 4h6v16H9zM5 8v8M19 8v8M2 10v4M22 10v4',
      acoustic: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4',
      pressure: 'M12 13m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 13l3.5-3.5M8 18h8',
      strain: 'M3 12h3l1.5-4 3 8 3-8 3 8 1.5-4h3',
      crack: 'M12 3l-2.5 5 3.5 3-3.5 4 2.5 6M5 4v16M19 4v16'
    };
    SI.sprinkler = SI.pressure;
    const site = this.props.site;
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
    const CAT = {
      water: { name: 'Water', covers: 'Roof vents, drains, pipe pipes, hydrants and valve pits', icon: SI.humidity },
      elec: { name: 'Electrical & fire', covers: 'Electrical panels and the fire sprinkler system', icon: 'M13 3 5 14h6l-1 7 8-11h-6z' },
      mech: { name: 'Mechanical', covers: 'HVAC units, boilers, pumps and elevators', icon: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1' },
      struct: { name: 'Structural', covers: 'Piers, walls, parapets and cracks', icon: 'M3 20h18M5 20V10M19 20V10M3 10l9-6 9 6M9.5 20v-6h5v6' }
    };
    const CATS = ['water', 'elec', 'mech', 'struct'];
    const PL_OK = { urg: 'No action', who: 'Nobody yet',
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

  byId(id) { return this.data().list.find((s) => s.id === id); }
  entryFor(target, from) {
    const LV = this.data().LV;
    if (target === 'l1' && from === 'grounds') return { x: 150, y: 378 };
    return LV[target].entry;
  }
  transitionText(from, to) {
    if (to === 'roof') return 'Take Stair B up to the roof';
    if (to === 'grounds') return 'Leave through the main entrance';
    if (from === 'roof') return 'Take Stair B down to Level 1';
    return 'Come in through the main entrance';
  }
  dirName(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'east' : 'west') : (dy > 0 ? 'south' : 'north'); }
  routeFor(origin, s) {
    const LV = this.data().LV;
    let start, pre = null;
    if (origin.level === s.level) start = { x: origin.x, y: origin.y };
    else { start = this.entryFor(s.level, origin.level); pre = this.transitionText(origin.level, s.level); }
    const lanes = LV[s.level].lanes;
    const lane = lanes.reduce((a, b) => Math.abs(b - s.cy) < Math.abs(a - s.cy) ? b : a, lanes[0]);
    const raw = [start, { x: start.x, y: lane }, { x: s.cx, y: lane }, { x: s.cx, y: s.cy }];
    const pts = [raw[0]];
    raw.slice(1).forEach((p) => { const q = pts[pts.length - 1]; if (Math.abs(p.x - q.x) + Math.abs(p.y - q.y) > 0.5) pts.push(p); });
    const segs = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      segs.push({ a, b, len: Math.hypot(b.x - a.x, b.y - a.y), dx: b.x - a.x, dy: b.y - a.y });
    }
    const units = segs.reduce((t, g) => t + g.len, 0);
    const M = 0.2;
    const steps = [];
    if (pre) steps.push({ text: pre, m: 0 });
    segs.forEach((g, i) => {
      const m = Math.max(1, Math.round(g.len * M));
      let text;
      if (i === 0) text = 'Head ' + this.dirName(g.dx, g.dy);
      else {
        const p = segs[i - 1];
        const cross = p.dx * g.dy - p.dy * g.dx;
        text = 'Turn ' + (cross > 0 ? 'right' : 'left') + ', go ' + this.dirName(g.dx, g.dy);
      }
      steps.push({ text, m, seg: i });
    });
    steps.push({ text: s.zone + ' is right here', m: 0 });
    const meters = Math.round(units * M) + (pre ? 15 : 0);
    return { pts, segs, units, steps, meters, pre };
  }
  pointAt(r, p) {
    let d = r.units * p;
    for (let i = 0; i < r.segs.length; i++) {
      const g = r.segs[i];
      if (d <= g.len || i === r.segs.length - 1) {
        const t = g.len ? Math.min(1, d / g.len) : 1;
        return { x: g.a.x + g.dx * t, y: g.a.y + g.dy * t, seg: i, segLeft: (1 - t) * g.len, ang: Math.atan2(g.dx, -g.dy) * 180 / Math.PI };
      }
      d -= g.len;
    }
    const e = r.pts[r.pts.length - 1];
    return { x: e.x, y: e.y, seg: 0, segLeft: 0, ang: 0 };
  }
  pathD(pts) { return pts.length < 2 ? 'M0 0' : pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(''); }
  eta(m) { const sec = Math.round(m / 1.3); return sec < 60 ? 'about ' + Math.max(5, Math.round(sec / 5) * 5) + ' s' : 'about ' + Math.round(sec / 60) + ' min'; }

  rangeOf(arr) {
    const rep = arr.filter((x) => !x.off);
    if (!rep.length) return null;
    const B = { ok: [85, 97, 1], watch: [55, 72, 2], crit: [22, 45, 3] };
    let wl = 0, wh = 0, w = 0;
    rep.forEach((x) => { const b = B[x.st]; wl += b[0] * b[2]; wh += b[1] * b[2]; w += b[2]; });
    const off = arr.length - rep.length;
    return { lo: wl / w - 2 - off * 3, hi: wh / w + 2 + off * 3 };
  }
  roundR(r) { const lo = Math.max(0, Math.floor(r.lo / 5) * 5), hi = Math.min(100, Math.ceil(r.hi / 5) * 5); return { lo, hi, text: lo + ' to ' + hi }; }
  easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  linear(t) { return t; }
  easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  componentDidMount() {
    this.tick = this.tick.bind(this);
    const st = this.props.start || 'intro';
    const SAMPLE = { watch: ['water', 'pipes', 'equip', 'heat'], where: ['roof', 'mech', 'walls', 'elec', 'floors'], floors: 6, area: 'l', speed: 'now', respond: ['alert', 'tech'], teamSize: 5, control: ['power', 'rate', 'blink', 'report', 'shutoff'], trouble: ['leaks'] };
    if (st === 'intro') { this.go('intro'); this.introTick(); return; }
    if (st === 'auth') { this.go('auth', { authMode: 'signup' }); return; }
    if (st === 'diag') { this.go('diag', { diagStep: 0 }); return; }
    if (st === 'diag3') { this.go('diag', { diagStep: 0, dg: Object.assign({}, SAMPLE, { watch: ['water', 'pipes'] }) }); return; }
    if (st === 'kit') { this.go('diag', { diagStep: this.diagDef().steps.length, dg: SAMPLE, kit: this.computeKit(SAMPLE) }); return; }
    if (st === 'kitdash') { this.setState({ kit: this.computeKit(SAMPLE), onboarded: true }); this.go('overview'); return; }
    if (st === 'map') this.go('map', { level: 'roof' });
    else if (st === 'selected') this.go('map', { level: 'roof', selId: 'RH-V6' });
    else if (st === 'walking') {
      this.go('map', { level: 'roof', selId: 'RH-V6' });
      if (this.props.hold) {
        const r = this.routeFor(this.state.origin, this.byId('RH-V6'));
        this.setState({ walking: true, walkRoute: r, walkP: 0.55 });
      } else this.after(600, () => this.startWalk());
    } else if (st === 'arrived') {
      const s = this.byId('RH-V6');
      this.go('map', { level: 'roof', selId: 'RH-V6', arrived: true, origin: { level: 'roof', x: s.cx, y: s.cy, name: s.zone }, visited: { 'RH-V6': true } });
    } else if (st === 'sensors') this.go('sensors');
    else if (st === 'device') { this.go('sensors'); this.after(500, () => { this.openDev('RH-V6'); this.after(500, () => this.runCheck('RH-V6')); }); }
    else if (st === 'pair') { this.go('sensors', { pairCode: 'RH-V9-2F41' }); this.after(500, () => this.openPair()); }
    else if (st === 'detail') { this.go('overview'); this.after(700, () => this.openDetail('RH-V6')); }
    else if (st === 'ticket') { this.go('overview'); this.after(700, () => this.openDetail('VB-R2')); }
    else if (st === 'log') this.go('log');
    else if (st === 'blueprint') this.openBlueprint();
    else if (st === 'processing') { this.go('bp', { bpStage: 'processing', bpP: this.props.hold ? 0.62 : 0 }); if (!this.props.hold) this.bpCapture(); }
    else if (st === 'bpmodel') { this.go('bp', { bpStage: 'model', pinP: 0, yaw: -40, pitch: 56 }); this.tween('yaw', -40, 28, 1500, 300, this.easeOut); this.tween('pinP', 0, 1, 1800, 900, this.linear); }
    else if (st === 'chat') { this.go('overview'); this.after(500, () => { this.openChat(); this.after(500, () => this.ask('What should I fix first?')); }); }
    else this.go('overview');
  }
  componentWillUnmount() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.timers.forEach((t) => clearTimeout(t));
  }
  after(ms, fn) { const t = setTimeout(fn, ms); this.timers.push(t); return t; }

  loop() { if (!this.raf) { this.last = null; this.raf = requestAnimationFrame(this.tick); } }
  tween(key, from, to, dur, delay, ease, done) { this.tweens[key] = { from, to, dur, delay, ease, done, start: null }; this.loop(); }
  spring(key, target) { if (typeof key === 'number') { target = key; key = 'panelX'; } this.sps = this.sps || {}; const c = this.sps[key]; this.sps[key] = { x: c ? c.x : this.state[key], v: c ? c.v : 0, target }; this.loop(); }
  tick(now) {
    const dt = this.last == null ? 1 / 60 : Math.min(0.034, (now - this.last) / 1000);
    this.last = now;
    const upd = {};
    let active = false;
    const finished = [];
    Object.keys(this.sps || {}).forEach((key) => {
      const sp = this.sps[key];
      const f = -230 * (sp.x - sp.target) - 21 * sp.v;
      sp.v += f * dt;
      sp.x += sp.v * dt;
      if (Math.abs(sp.v) < 0.003 && Math.abs(sp.x - sp.target) < 0.0008) { upd[key] = sp.target; delete this.sps[key]; }
      else { upd[key] = sp.x; active = true; }
    });
    Object.keys(this.tweens).forEach((key) => {
      const tw = this.tweens[key];
      if (tw.start == null) tw.start = now + tw.delay;
      const p = Math.max(0, Math.min(1, (now - tw.start) / tw.dur));
      upd[key] = tw.from + (tw.to - tw.from) * tw.ease.call(this, p);
      if (p >= 1) { finished.push(tw); delete this.tweens[key]; } else active = true;
    });
    this.setState(upd);
    finished.forEach((tw) => tw.done && tw.done());
    if (active || Object.keys(this.tweens).length || Object.keys(this.sps || {}).length) this.raf = requestAnimationFrame(this.tick);
    else { this.raf = null; this.last = null; }
  }

  go(screen, extra) {
    const ord = { intro: -3, auth: -2, diag: -1, overview: 0, bp: 0.5, map: 1, sensors: 2, log: 3 };
    const nd = (ord[screen] || 0) >= (ord[this.state.screen] || 0) ? 1 : -1;
    this.setState(Object.assign({ screen, navDir: nd, sheetMin: false }, extra || {}));
    if (screen === 'overview' && !this.introRan) {
      this.introRan = true;
      this.tween('intro', 0, 1, 1200, 150, this.easeOut, () => {
        this.setState({ introDone: true });
        this.after(1500, () => this.setState({ pulseDone: true }));
      });
    }
  }
  toast(text) {
    this.setState({ toastText: text, toastOn: true });
    if (this.toastT) clearTimeout(this.toastT);
    this.toastT = this.after(2400, () => this.setState({ toastOn: false }));
  }
  locate(id) {
    const s = this.byId(id);
    if (this.state.detOpen) this.closeDetail();
    this.go('map', { level: s.level, selId: id, arrived: false, walking: false, walkP: 0 });
  }
  select(id) {
    if (this.state.walking) return;
    const s = this.byId(id);
    this.setState({ selId: id, level: s.level, arrived: false, walkP: 0, sheetMin: false });
  }
  clearSel() { this.setState({ selId: null, arrived: false, walking: false, walkP: 0 }); }
  startWalk() {
    const s = this.byId(this.state.selId);
    if (!s) return;
    const r = this.routeFor(this.state.origin, s);
    const dur = Math.min(11000, Math.max(5500, r.meters * 110));
    this.setState({ walking: true, walkRoute: r, walkP: 0, arrived: false, level: s.level });
    this.tween('walkP', 0, 1, dur, 700, this.easeInOut, () => {
      this.setState({
        walking: false, arrived: true,
        origin: { level: s.level, x: s.cx, y: s.cy, name: s.zone },
        visited: Object.assign({}, this.state.visited, { [s.id]: true })
      });
      this.toast('Arrived at ' + s.zone);
    });
  }
  endWalk() {
    const r = this.state.walkRoute;
    delete this.tweens.walkP;
    if (r) {
      const p = this.pointAt(r, this.state.walkP);
      this.setState({ origin: { level: this.byId(this.state.selId).level, x: p.x, y: p.y, name: 'your position' } });
    }
    this.setState({ walking: false, walkP: 0 });
  }
  blink(id) {
    this.setState({ blinkId: id });
    this.toast('LED blinking on ' + id);
    this.after(4000, () => { if (this.state.blinkId === id) this.setState({ blinkId: null }); });
  }
  openDetail(id) {
    this.setState({ detId: id, detOpen: true, detP: 0, othersOpen: false });
    this.spring(0);
    this.tween('detP', 0, 1, 1000, 220, this.easeOut);
  }
  closeDetail() { this.setState({ detOpen: false }); this.spring(1); }
  nextFor(fromOrigin) {
    const D = this.data();
    const open = D.list.filter((s) => s.problem && !this.state.visited[s.id] && s.id !== this.state.selId);
    if (!open.length) return null;
    return open.map((s) => ({ s, r: this.routeFor(fromOrigin, s) })).sort((a, b) => a.r.meters - b.r.meters)[0];
  }

  renderVals() { const b = this.baseVals(); Object.assign(b, this.moreVals(b)); Object.assign(b, this.moreVals2(b)); Object.assign(b, this.obVals(b)); return Object.assign(b, this.devVals(b)); }

  extras() {
    if (this.X) return this.X;
    const TECH = {
      dana: { name: 'Dana Ortiz', trade: 'Roofing and building envelope', avail: 'On-site now', where: 'on the roof', color: 'var(--ok)' },
      priya: { name: 'Priya Nair', trade: 'Plumbing', avail: 'On-site now', where: 'Level 1 mechanical room', color: 'var(--ok)' },
      marcus: { name: 'Marcus Hill', trade: 'HVAC and mechanical', avail: 'Available in 20 min', where: 'finishing a job off-site', color: 'var(--watch)' },
      sam: { name: 'Sam Okafor', trade: 'Fire safety and structural', avail: 'Available in 45 min', where: 'at the parking deck', color: 'var(--watch)' },
      leo: { name: 'Leo Brandt', trade: 'Electrical, licensed', avail: 'Off shift', where: 'back at 07:00', color: 'var(--line2)' }
    };
    Object.keys(TECH).forEach((k) => {
      const t = TECH[k];
      t.key = k;
      t.first = t.name.split(' ')[0];
      t.short = t.first + ' ' + t.name.split(' ')[1].charAt(0) + '.';
      t.initials = t.name.split(' ').map((w) => w.charAt(0)).join('');
    });
    const TKID = { 'VB-R2': 'T-1037', 'PR-B1': 'T-1029', 'MS-DN': 'T-1039', 'SR-L1': 'T-1040', 'AL-RA': 'T-1041', 'RH-V6': 'T-1042',
      'TH-V5': 'T-1033', 'AL-H3': 'T-1031', 'SG-P2': 'T-1027', 'TH-EL': 'T-1036', 'EV-E1': 'T-1035', 'CR-PS': 'T-1024', 'PR-V7': 'T-1021' };
    const L = (day, t, type, text, source, asset) => ({ day, t, type, text, source, asset });
    const LOG = [
      L('Today', '14:16', 'alert', 'Alert fired: humidity 94 %RH at Roof vent 6', 'Sensor RH-V6', 'Roof vent 6'),
      L('Today', '14:16', 'ticket', 'Ticket T-1042 opened for Roof vent 6', 'System', 'Roof vent 6'),
      L('Today', '14:15', 'escalation', 'Escalation: text sent to Marcus Hill and the facilities lead for T-1037', 'Escalation service', 'Rooftop AC 2'),
      L('Today', '14:11', 'alert', 'Alert fired: leak noise 44 dB at Water pipe A', 'Sensor AL-RA', 'Water pipe A'),
      L('Today', '14:11', 'ticket', 'Ticket T-1041 opened for Water pipe A', 'System', 'Water pipe A'),
      L('Today', '14:00', 'escalation', 'T-1037 passed its 2 h resolution window and is now overdue', 'Escalation service', 'Rooftop AC 2'),
      L('Today', '13:40', 'alert', 'Alert fired: sprinkler pressure 52 psi at Fire sprinkler pipe', 'Sensor SR-L1', 'Fire sprinkler pipe'),
      L('Today', '13:40', 'ticket', 'Ticket T-1040 opened for Fire sprinkler pipe', 'System', 'Fire sprinkler pipe'),
      L('Today', '12:20', 'escalation', 'Escalation: text sent to Priya Nair for T-1029', 'Escalation service', 'Boiler'),
      L('Today', '12:20', 'assign', 'T-1039 assigned to Dana Ortiz', 'J. Reyes, facilities manager', 'Roof drain'),
      L('Today', '12:00', 'assign', 'T-1037 assigned to Marcus Hill', 'J. Reyes, facilities manager', 'Rooftop AC 2'),
      L('Today', '11:20', 'alert', 'Alert fired: vibration 7.9 mm/s at Rooftop AC 2', 'Sensor VB-R2', 'Rooftop AC 2'),
      L('Today', '11:20', 'ticket', 'Ticket T-1037 opened for Rooftop AC 2', 'System', 'Rooftop AC 2'),
      L('Yesterday', '16:12', 'resolved', 'T-1025 resolved: Roof vent 3 humidity back to normal', 'Dana Ortiz', 'Roof vent 3'),
      L('Yesterday', '08:20', 'assign', 'T-1029 assigned to Priya Nair', 'J. Reyes, facilities manager', 'Boiler'),
      L('24 Sep', '10:02', 'resolved', 'T-1019 resolved: Water pipe B leak noise stopped', 'Priya Nair', 'Water pipe B'),
      L('23 Sep', '17:40', 'offline', 'Sensor PR-V7 stopped reporting', 'Sensor PR-V7', 'Water valve pit'),
      L('23 Sep', '15:40', 'resolved', 'T-1016 resolved: Water pump vibration back to baseline', 'Marcus Hill', 'Water pump'),
      L('12 Sep', '09:05', 'ticket', 'Site onboarded from a blueprint scan', 'J. Reyes, facilities manager', 'Site')
    ];
    const TYPES = {
      alert: { name: 'Alert', icon: 'M12 4.5 20.5 19h-17zM12 10v4M12 16.8h.01', color: 'var(--crit)' },
      offline: { name: 'Sensor offline', icon: 'M4 4l16 16M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 1.3 4.5M5.6 5.6a9 9 0 0 0 0 12.8', color: 'var(--tx2)' },
      ticket: { name: 'Ticket', icon: 'M6 3.5h9l3 3V20.5H6zM9 11h6M9 15h4', color: 'var(--tx2)' },
      assign: { name: 'Assigned', icon: 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20a7 7 0 0 1 14 0', color: 'var(--acc)' },
      escalation: { name: 'Escalation', icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z', color: 'var(--watch)' },
      resolved: { name: 'Resolved', icon: 'M5 12.5l4.5 4.5L19 7.5', color: 'var(--ok)' },
      device: { name: 'Device', icon: 'M12 3.5v8M7.2 6.3a7.5 7.5 0 1 0 9.6 0', color: 'var(--slate)' }
    };
    const DAYS = { Today: 0, Yesterday: 1, '24 Sep': 2, '23 Sep': 3, '12 Sep': 14 };
    this.X = { TECH, TKID, LOG, TYPES, DAYS };
    return this.X;
  }
  fmtMin(m) {
    m = Math.round(Math.abs(m));
    if (m < 60) return m + ' min';
    if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + r + ' min' : ''); }
    return Math.round(m / 1440) + ' d';
  }
  tradeFor(x) {
    if (x.cat === 'elec') return x.kind === 'sprinkler' ? 'sam' : 'leo';
    if (x.cat === 'struct') return 'sam';
    if (x.cat === 'mech') return 'marcus';
    return x.level === 'roof' ? 'dana' : 'priya';
  }
  policy(x) {
    return x.st === 'crit'
      ? { win: 120, text: 15, call: 30, rule: 'Critical tickets are due within 2 h. If still open, a text goes out 15 min after the due time, then a phone call 15 min after that.' }
      : { win: 1440, text: 240, call: null, rule: 'Watch-level tickets are due within 24 h. If still open, a text goes out 4 h after the due time. They do not trigger a phone call.' };
  }
  tkInfo(x) {
    const X = this.extras();
    const t = this.state.tickets[x.id];
    const P = this.policy(x);
    const id = X.TKID[x.id] || 'T-10' + (50 + this.data().list.indexOf(x));
    if (!t) return { id, status: 'open', P };
    if (t.status === 'resolved') return { id, status: 'resolved', t, P };
    const due = P.win - t.ago;
    return { id, status: due < 0 ? 'overdue' : 'progress', t, P, due };
  }
  tkSteps(info) {
    const X = this.extras();
    const { t, P, due } = info;
    const tech = X.TECH[t.tech];
    const steps = [];
    const S = (text, channel, time, state) => steps.push({ text, channel, time, state });
    S('Assigned to ' + tech.name, 'In the app', t.ago < 1 ? 'just now' : this.fmtMin(t.ago) + ' ago', 'done');
    if (due >= 0) S('Due', 'Resolution window', 'in ' + this.fmtMin(due), 'current');
    else S('Overdue', 'Resolution window passed', this.fmtMin(-due) + ' ago', 'overdue');
    const textRel = P.win + P.text - t.ago;
    if (textRel <= 0) S('Text sent to ' + tech.first + ' and the facilities lead', 'Text message', this.fmtMin(-textRel) + ' ago', 'done');
    else S('Text if still open', 'Text message', 'in ' + this.fmtMin(textRel), due < 0 ? 'current' : 'pending');
    if (P.call != null) {
      const callRel = P.win + P.call - t.ago;
      if (callRel <= 0) S('Phone call placed to the facilities lead', 'Phone call', this.fmtMin(-callRel) + ' ago', 'done');
      else S(textRel <= 0 ? 'Call escalation pending' : 'Call if still open', 'Phone call', 'in ' + this.fmtMin(callRel), textRel <= 0 ? 'current' : 'pending');
    } else S('No phone call at this urgency', 'Watch-level policy', '', 'muted');
    return steps.map((w, i) => {
      const c = { done: 'var(--ok)', current: 'var(--acc)', overdue: 'var(--crit)', pending: 'var(--line2)', muted: 'var(--line2)' }[w.state];
      return {
        text: w.text, channel: w.channel, time: w.time,
        fg: w.state === 'pending' || w.state === 'muted' ? 'var(--tx2)' : 'var(--tx)',
        weight: w.state === 'current' || w.state === 'overdue' ? '600' : '400',
        dotBorder: c, dotBg: w.state === 'pending' || w.state === 'muted' ? 'transparent' : c,
        timeFg: w.state === 'overdue' ? 'var(--crit)' : 'var(--tx2)',
        line: i === steps.length - 1 ? 'transparent' : 'var(--line)'
      };
    });
  }
  addLog(type, text, source, asset) {
    this.setState({ logExtra: [{ day: 'Today', t: 'now', type, text, source, asset }].concat(this.state.logExtra) });
  }
  assign(x, techKey) {
    const X = this.extras();
    const tech = X.TECH[techKey];
    const id = this.tkInfo(x).id;
    this.setState({ tickets: Object.assign({}, this.state.tickets, { [x.id]: { tech: techKey, ago: 0, status: 'progress' } }), othersOpen: false });
    this.addLog('assign', id + ' assigned to ' + tech.name, 'You', x.zone);
    this.toast(id + ' assigned to ' + tech.first);
  }
  resolve(x) {
    const X = this.extras();
    const info = this.tkInfo(x);
    const tech = info.t ? X.TECH[info.t.tech] : null;
    const by = tech ? tech.name : 'You';
    this.setState({
      tickets: Object.assign({}, this.state.tickets, { [x.id]: Object.assign({}, info.t, { status: 'resolved', when: 'just now' }) }),
      resolved: [{ zone: x.zone, text: x.plain.h.charAt(0).toLowerCase() + x.plain.h.slice(1) + ', fixed', by, when: 'Just now' }].concat(this.state.resolved)
    });
    this.addLog('resolved', info.id + ' resolved: ' + x.plain.h, by, x.zone);
    this.toast(info.id + ' marked resolved');
  }
  hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ('00000000' + (h >>> 0).toString(16)).slice(-8);
  }
  chatAnswer(q) {
    const s = q.toLowerCase();
    const has = (...w) => w.some((x) => s.indexOf(x) >= 0);
    if (has('score', 'health', 'range', 'estimate', 'confidence')) return 'The building health estimate is a range from 0 to 100, built only from sensor readings. A wider range means less certainty, for example when a sensor is offline. Use it to decide where to look first. It is not a certified inspection.';
    if (has('assign', 'technician', 'tech', 'staff')) return 'Open any flagged item and find the Recommended technician card. Tap Assign and the ticket switches to In progress with that person as the owner. Use Choose someone else to pick a different technician.';
    if (has('overdue', 'escalat', 'call', 'text')) return 'Each ticket has a time to resolve based on urgency. Critical tickets that pass it send a text, then a phone call if still open. Watch-level tickets send a text after a longer delay and never call. The ticket timeline shows every step.';
    if (has('map', 'walk', 'find', 'locate', 'where')) return 'Tap Go next to any problem, or pick an area on the Map tab, then tap Walk there. You get turn-by-turn directions to the sensor, and Blink LED makes the sensor flash so you can spot it.';
    if (has('log', 'history', 'audit', 'record')) return 'The Activity log in the left rail lists every alert, ticket, assignment, escalation and fix in order. It is read-only, so nobody can edit or delete entries. You can filter by date, asset or event type.';
    if (has('blueprint', 'scan', 'site', 'building', '3d', 'add')) return 'On the Site screen, tap Add site and photograph the floor plan. The app processes it into a 3D model you can rotate, with the sensors placed on it.';
    if (has('offline', 'battery', 'signal')) return 'An offline sensor has stopped sending readings. Check its battery and antenna first. The Sensors tab has a Hardware filter that lists every sensor needing attention.';
    if (has('water', 'electrical', 'fire', 'mechanical', 'structural', 'category')) return 'Problems are grouped into Water, Electrical and fire, Mechanical, and Structural. Use the chips on the Site screen to see one group at a time.';
    return 'I can explain the health estimate, assigning technicians, escalations, the map, the activity log and adding a site. Try one of the suggestions below.';
  }
  ask(q) {
    const text = (q || '').trim();
    if (!text) return;
    this.setState({ chatMsgs: this.state.chatMsgs.concat([{ from: 'me', text }]), chatDraft: '', chatTyping: true });
    this.after(700, () => this.setState({ chatTyping: false, chatMsgs: this.state.chatMsgs.concat([{ from: 'bot', text: this.chatAnswer(text) }]) }));
  }
  openChat() { this.setState({ chatOpen: true }); this.spring('chatY', 0); }
  closeChat() { this.setState({ chatOpen: false }); this.spring('chatY', 1); }
  openBlueprint() {
    if (this.state.detOpen) this.closeDetail();
    this.go('bp', { bpStage: 'camera', bpEdges: false, bpP: 0, pinP: 0 });
    this.after(1300, () => { if (this.state.screen === 'bp' && this.state.bpStage === 'camera') this.setState({ bpEdges: true }); });
  }
  bpCapture() {
    this.setState({ bpStage: 'processing', bpP: 0 });
    this.tween('bpP', 0, 1, 5200, 300, this.easeInOut, () => this.after(400, () => {
      this.setState({ bpStage: 'model', pinP: 0, yaw: -40, pitch: 56 });
      this.tween('yaw', -40, 28, 1500, 150, this.easeOut);
      this.tween('pinP', 0, 1, 1800, 700, this.linear);
    }));
  }
  proj(x, y, z, yaw, pitch) {
    const a = yaw * Math.PI / 180, t = pitch * Math.PI / 180, sc = 0.66;
    const dx = x - 150, dy = y - 200;
    const rx = dx * Math.cos(a) - dy * Math.sin(a);
    const ry = dx * Math.sin(a) + dy * Math.cos(a);
    return [147 + rx * sc, 290 + ry * sc * Math.cos(t) - z * sc * Math.sin(t)];
  }
  poly(pts) { return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z'; }
  box(x, y, w, h, z0, z1, yaw, pitch) {
    const P = (px, py, pz) => this.proj(px, py, pz, yaw, pitch);
    const c = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    let d = '';
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4];
      d += this.poly([P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)]);
    }
    return d + this.poly(c.map((q) => P(q[0], q[1], z1)));
  }

  lc(h) { return /^[A-Z][a-z]/.test(h) ? h.charAt(0).toLowerCase() + h.slice(1) : h; }
  stWord(x) { return x.st === 'crit' ? 'in critical condition' : x.st === 'watch' ? 'flagged to watch' : x.st === 'off' ? 'offline' : 'normal'; }
  norm(t) { return ' ' + String(t).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
  squash(t) { return String(t).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
  chatIndex() {
    const D = this.data();
    if (this.CI) return this.CI;
    const WORDS = { 'PR-B1': ['boiler'], 'TH-EL': ['panel', 'breaker', 'electrical panel'], 'SR-L1': ['sprinkler', 'sprinklers'], 'EV-E1': ['elevator', 'lift'], 'CR-PS': ['roof edge wall', 'crack'], 'MS-DN': ['drain', 'north drain', 'roof drain'], 'PR-V7': ['valve pit', 'pit'], 'VB-P2': ['pump'] };
    const idx = D.list.map((x) => {
      const subs = [this.squash(x.zone), this.squash(x.id), this.squash(x.zone.replace(/\b([A-Z])-?(\d)/g, '$2'))].filter((q) => q.length >= 4);
      const words = (WORDS[x.id] || []).slice();
      if (/\d/.test(x.short)) { words.push(x.short.toLowerCase().replace(/-/g, '')); words.push(x.short.toLowerCase().replace(/-/g, ' ')); }
      return { x, subs, words };
    });
    const GROUPS = { vent: (x) => /^Roof vent/.test(x.zone), hydrant: (x) => /^Fire hydrant/.test(x.zone), pier: (x) => /^Parking column/.test(x.zone), pipe: (x) => /^Water pipe/.test(x.zone), rtu: (x) => /^Rooftop AC/.test(x.zone) };
    this.CI = { idx, GROUPS };
    return this.CI;
  }
  parse(text) {
    const X = this.extras(), CI = this.chatIndex();
    const n = this.norm(text), sq = this.squash(text);
    let hits = CI.idx.filter((e) => e.subs.some((q) => sq.indexOf(q) >= 0) || e.words.some((w) => n.indexOf(' ' + w + ' ') >= 0));
    hits = hits.filter((e) => !hits.some((o) => o !== e && o.subs.some((q) => e.subs.some((r) => q.length > r.length && q.indexOf(r) === 0))));
    let sensors = hits.map((e) => e.x);
    const tm = n.match(/ t ?(10\d\d) /);
    if (tm) {
      const id = Object.keys(X.TKID).find((k) => X.TKID[k] === 'T-' + tm[1]);
      if (id) sensors = [this.byId(id)].concat(sensors.filter((q) => q.id !== id));
    }
    const techs = Object.keys(X.TECH).filter((k) => n.indexOf(' ' + X.TECH[k].first.toLowerCase() + ' ') >= 0);
    const group = Object.keys(CI.GROUPS).find((g) => new RegExp(' ' + g + 's? ').test(n)) || null;
    let cat = null;
    if (/ (water|leaks?|leaking|moisture|plumbing|wet) /.test(n)) cat = 'water';
    else if (/ (electrical|electric|fire|power) /.test(n)) cat = 'elec';
    else if (/ (mechanical|hvac|heating|cooling|elevators) /.test(n)) cat = 'mech';
    else if (/ (structural|structure|cracks|concrete|foundation) /.test(n)) cat = 'struct';
    let level = null;
    if (/ (roof|rooftop) /.test(n)) level = 'roof';
    else if (/ (level 1|level one|first floor|l1|ground floor|inside|indoors) /.test(n)) level = 'l1';
    else if (/ (grounds|outside|outdoors|parking|deck) /.test(n)) level = 'grounds';
    return { n, sensors, techs, group, cat, level };
  }
  intentOf(n) {
    const t = (re) => re.test(n);
    if (t(/^ (hi|hey|hello|yo|hiya|good morning|good afternoon|good evening)( there)? $/)) return 'greet';
    if (t(/ (thanks|thank you|thx|cheers|perfect|great|awesome|ok thanks) /)) return 'thanks';
    if (t(/ (what can you do|help me|how does this chat|who are you) /)) return 'app_help';
    if (t(/ (pair|pairing|site code|add (a |another )?(sensor|device)|new (sensor|device)|connect (a )?(sensor|device)|link (a )?(sensor|device)) /)) return 'pair';
    if (t(/ (pause|unpause|resume|turn [a-z0-9 ]*(off|on)|switch [a-z0-9 ]*(off|on)|power [a-z0-9 ]*(off|on)) /)) return 'power';
    if (t(/ assign /) || t(/ (give|send|hand) (it|this|that) to /)) return 'assign';
    if (t(/ (resolve|resolved|mark (it|this|that)? ?(as )?(fixed|done|resolved)|close (the |this |that )?ticket|it s fixed|its fixed|fixed it|been fixed) /)) return 'resolve';
    if (t(/ (health|score|estimate|confidence|building doing|how is the building|hows the building) /)) return 'health';
    if (t(/ (where|locate|find|walk|get to|get there|how do i get|take me|directions|navigate|route|how far|go to) /)) return 'walk';
    if (t(/ (who|technician|someone|plumber|electrician|roofer|available|availability|free|on site|on shift) /)) return 'who';
    if (t(/ (what (should|do|can) (i|we) do|how (do|can|should) (i|we) fix|how to fix|fix (it|this|that)|next steps?|steps|repair|what now|what do i need) /)) return 'todo';
    if (t(/ (why|mean|meaning|explain|whats wrong|what is wrong|wrong with|whats happening|what is happening|going on|matter|cause|caused|problem with) /)) return 'why';
    if (t(/ (trend|worse|better|getting|changing|rising|falling|over time|last 12|history of) /)) return 'trend';
    if (t(/ (overdue|late|escalat[a-z]*|behind|missed|called|texted) /)) return 'overdue';
    if (t(/ (unassigned|nobody|no one|not assigned|unowned) /)) return 'unassigned';
    if (t(/ (offline|battery|batteries|signal|dead|not reporting|hardware|disconnected) /)) return 'hardware';
    if (t(/ (health|score|range|estimate|confidence|overall|building doing|how is the building|hows the building) /)) return 'health';
    if (t(/ (log|happened|recent|activity|timeline|today|latest|events) /)) return 'log';
    if (t(/ (urgent|priority|priorities|prioritize|first|most important|worst|critical|needs attention|what needs|focus|problems|issues|flagged|anything wrong) /)) return 'urgent';
    if (t(/ (status|how is|hows|tell me about|what about|reading|readings|info|details|check|doing|look at|update on) /)) return 'status';
    if (t(/ (blueprint|add (a )?site|new building|3d|onboard) /)) return 'app_bp';
    if (t(/ (map|walk there|directions) /)) return 'walk';
    return null;
  }
  tkLine(x) {
    const X = this.extras();
    const info = this.tkInfo(x);
    const tech = info.t ? X.TECH[info.t.tech] : null;
    if (info.status === 'open') return 'Ticket ' + info.id + ' has no one assigned yet.';
    if (info.status === 'resolved') return info.id + ' was marked resolved by ' + tech.name + '.';
    if (info.status === 'progress') return tech.name + ' has ' + info.id + ', due in ' + this.fmtMin(info.due) + '.';
    return tech.name + ' has ' + info.id + ' and it is overdue by ' + this.fmtMin(-info.due) + '. ' + this.escLine(x) + '.';
  }
  escLine(x) {
    const X = this.extras();
    const info = this.tkInfo(x);
    if (!info.t || info.status !== 'overdue') return '';
    const tech = X.TECH[info.t.tech];
    const textRel = info.P.win + info.P.text - info.t.ago;
    const parts = [];
    parts.push(textRel <= 0 ? 'Text sent to ' + tech.first + ' ' + this.fmtMin(-textRel) + ' ago' : 'Text goes out in ' + this.fmtMin(textRel));
    if (info.P.call != null) {
      const callRel = info.P.win + info.P.call - info.t.ago;
      parts.push(callRel <= 0 ? 'call placed ' + this.fmtMin(-callRel) + ' ago' : 'phone call in ' + this.fmtMin(callRel) + ' if still open');
    } else parts.push('no call at this urgency');
    return parts.join(', ');
  }
  bestAlt(exceptKey) {
    const X = this.extras();
    return Object.keys(X.TECH).filter((k) => k !== exceptKey && /On-site/.test(X.TECH[k].avail)).map((k) => X.TECH[k])[0] || null;
  }
  statusText(x) {
    const k = x.k;
    if (x.off) return x.zone + ' (' + x.levelName + ') is offline. Sensor ' + x.id + ' has not reported since ' + x.since + ', so nothing there is being watched right now. ' + this.tkLine(x);
    if (!x.problem) return x.zone + ' on ' + (x.level === 'roof' ? 'the roof' : x.levelName) + ' looks normal. ' + k.name + ' is ' + x.valStr + ', close to its baseline of ' + x.baseStr + '. Nothing to do here.';
    return x.zone + ' on ' + (x.level === 'roof' ? 'the roof' : x.levelName) + ' is ' + this.stWord(x) + ': ' + this.lc(x.plain.h) + '.\n\n' + k.name + ' reads ' + x.valStr + ' against a baseline of ' + x.baseStr + ', flagged ' + x.since + ' ago. ' + this.tkLine(x);
  }
  chipsFor(x) {
    const X = this.extras();
    const chips = [{ label: 'Open details', kind: 'open', id: x.id }, { label: 'Walk there', kind: 'walk', id: x.id }];
    if ((x.problem || x.off) && this.tkInfo(x).status === 'open') {
      const rk = this.tradeFor(x);
      chips.unshift({ label: 'Assign ' + X.TECH[rk].first, kind: 'assign', id: x.id, tech: rk, pri: true });
    }
    return chips;
  }
  listLine(x) {
    const X = this.extras();
    const info = this.tkInfo(x);
    const owner = info.t ? X.TECH[info.t.tech].short : 'unassigned';
    const st = info.status === 'overdue' ? 'overdue, ' + owner : info.status === 'progress' ? owner + ' on it' : 'unassigned';
    return '• ' + x.zone + ': ' + this.lc(x.plain.h) + ' (' + x.plain.urg.toLowerCase() + ', ' + st + ')';
  }
  openItems() {
    const D = this.data();
    const open = D.list.filter((x) => (x.problem || x.off) && this.tkInfo(x).status !== 'resolved');
    const rank = (x) => { const st = this.tkInfo(x).status; return st === 'overdue' ? 0 : x.st === 'crit' ? 1 : x.st === 'watch' ? 2 : 3; };
    return open.sort((a, b) => rank(a) - rank(b) || a.age - b.age);
  }
  reply(text) {
    const D = this.data(), X = this.extras();
    const s = this.state;
    const p = this.parse(text);
    let it = this.intentOf(p.n);
    const ctx = s.chatCtx || {};
    const pron = / (it|that|this|there|this one|that one|the sensor|the ticket|same) /.test(p.n);
    let x = p.sensors[0] || null;
    const needX = ['walk', 'why', 'todo', 'trend', 'resolve', 'assign', 'status', 'power'];
    if (!x && ctx.sensor && !p.cat && !p.level && !p.group && (pron || needX.indexOf(it) >= 0 || (it === 'who' && !p.techs.length && / (fix|handle|take|should|repair) /.test(p.n)) || (it === 'hardware' && pron))) x = this.byId(ctx.sensor);
    let techKey = p.techs[0] || null;
    if (!techKey && / (her|him|them|she|he) /.test(p.n) && ctx.tech) techKey = ctx.tech;
    const out = { text: '', chips: [], ctx: { sensor: x ? x.id : ctx.sensor || null, tech: techKey || ctx.tech || null } };
    const open = this.openItems();
    const say = (t, chips) => { out.text = t; out.chips = chips || []; return out; };

    if (it === 'greet') return say('Hi. I am watching ' + D.list.length + ' sensors at Northside Annex. ' + open.length + ' things need a decision and ' + open.filter((q) => q.st === 'crit').length + ' of them are urgent. Ask me about any sensor, ticket or technician.', [{ label: 'What should I fix first?', kind: 'ask', q: 'What should I fix first?' }]);
    if (it === 'thanks') return say('Anytime. I am here if anything else comes up.');
    if (it === 'app_help') return say('I can see the live state of this site. Try things like:\n• What is wrong with Roof vent 6?\n• Who should fix Rooftop AC 2?\n• Assign it to Dana\n• Which tickets are overdue?\n• How do I get to Water pipe A?\n• What happened today?');
    if (it === 'app_bp') return say('On the Site screen, tap Add site and photograph the floor plan. The app builds a 3D model you can rotate and places the paired sensors on it.', [{ label: 'Start a blueprint scan', kind: 'bp' }]);
    if (it === 'pair') return say('Your site code is ' + s.siteCode + '. On the Sensors screen, tap Pair a device and scan the code on the back of the sensor. It links to this dashboard and shows on the map as soon as it sends a reading.', [{ label: 'Pair a device', kind: 'pair' }]);
    if (it === 'power') {
      if (!x) return say('Which sensor? Try "pause Roof vent 6" or "turn Rooftop AC 2 back on".');
      const wantOff = / (pause|off) /.test(p.n);
      const offNow = !!s.devOff[x.id];
      if (wantOff === offNow) return say(x.zone + ' is already ' + (offNow ? 'paused' : 'on') + '.', [{ label: 'Open controls', kind: 'dev', id: x.id }]);
      this.togglePower(x.id);
      return say(wantOff ? x.zone + ' is paused. It will not send readings or alerts until you turn it back on.' : x.zone + ' is back on and reporting.', [{ label: 'Open controls', kind: 'dev', id: x.id }]);
    }

    if (p.sensors.length > 1 && (it === 'status' || it === null || it === 'urgent')) {
      return say(p.sensors.map((q) => '• ' + q.zone + ': ' + (q.off ? 'offline' : q.tag.toLowerCase() + ', ' + q.valStr + ' (base ' + q.baseStr + ')')).join('\n'), p.sensors.slice(0, 2).map((q) => ({ label: 'Open ' + q.zone, kind: 'open', id: q.id })));
    }

    if (it === 'assign') {
      if (!x) return say('Which one should I assign? Try something like "assign Roof vent 6 to Dana".');
      const info = this.tkInfo(x);
      if (!x.problem && !x.off) return say(x.zone + ' is reading normally, so there is no ticket to assign.');
      if (info.status === 'resolved') return say(info.id + ' is already resolved.');
      const key = techKey || this.tradeFor(x);
      const tech = X.TECH[key];
      if (info.t && info.t.tech === key) return say(tech.name + ' already has ' + info.id + '.', [{ label: 'Open details', kind: 'open', id: x.id }]);
      this.assign(x, key);
      out.ctx.tech = key;
      const pol = this.policy(x);
      return say('Done. ' + info.id + ' for ' + x.zone + ' is now assigned to ' + tech.name + ' and marked In progress. ' + tech.first + ' is ' + tech.avail.toLowerCase() + '. It is due in ' + this.fmtMin(pol.win) + (pol.call ? ', then I escalate by text and a phone call.' : ', then I escalate by text.') + (/Off shift/.test(tech.avail) ? '\n\nHeads up: ' + tech.first + ' is off shift until 07:00.' : ''), [{ label: 'Open details', kind: 'open', id: x.id }]);
    }
    if (it === 'resolve') {
      if (!x) return say('Which ticket should I mark resolved? Name the sensor or ticket number.');
      const info = this.tkInfo(x);
      if (info.status === 'resolved') return say(info.id + ' is already resolved.');
      if (info.status === 'open') { const rk = this.tradeFor(x); return say(info.id + ' has no one assigned yet, so there is nothing to close out. Want me to assign ' + X.TECH[rk].first + ' first?', [{ label: 'Assign ' + X.TECH[rk].first, kind: 'assign', id: x.id, tech: rk, pri: true }]); }
      this.resolve(x);
      return say('Marked ' + info.id + ' resolved. ' + x.zone + ' moves to Recently resolved, and the sensor will confirm once readings settle back near ' + x.baseStr + '.');
    }
    if (it === 'walk') {
      if (!x) return say('Where do you want to go? Name a sensor or area, like Water pipe A or Roof vent 6.');
      const r = this.routeFor(s.origin, x);
      return say(x.zone + ' is on ' + (x.level === 'roof' ? 'the roof' : x.levelName) + ', about ' + r.meters + ' m from ' + s.origin.name + ' (' + this.eta(r.meters) + ' on foot). First step: ' + r.steps[0].text.charAt(0).toLowerCase() + r.steps[0].text.slice(1) + '. The sensor is ' + x.mount + '.', [{ label: 'Walk there', kind: 'walk', id: x.id, pri: true }]);
    }
    if (it === 'who') {
      if (x) {
        const info = this.tkInfo(x);
        if (info.t && info.status !== 'resolved') { const t0 = X.TECH[info.t.tech]; out.ctx.tech = t0.key; return say(t0.name + ' already has ' + info.id + ' (' + this.lc(t0.trade) + '). ' + t0.first + ' is ' + t0.avail.toLowerCase() + '.' + (info.status === 'overdue' ? ' It is overdue. ' + this.escLine(x) + '.' : ''), [{ label: 'Open details', kind: 'open', id: x.id }]); }
        const rk = this.tradeFor(x), rec = X.TECH[rk];
        out.ctx.tech = rk;
        let t = rec.name + ' is the best fit for ' + x.zone + ': ' + this.lc(rec.trade) + ', ' + rec.avail.toLowerCase() + ', ' + rec.where + '. Outside help: ' + x.plain.who.toLowerCase() + '.';
        const chips = [{ label: 'Assign ' + rec.first, kind: 'assign', id: x.id, tech: rk, pri: true }];
        if (/Off shift/.test(rec.avail)) t += '\n\nNobody else in-house has that trade on shift. If it cannot wait until ' + rec.where.replace('back at ', '') + ', call an outside ' + x.plain.who.toLowerCase() + '.';
        return say(t, chips);
      }
      if (techKey) {
        const t0 = X.TECH[techKey];
        const mine = open.filter((q) => { const i = this.tkInfo(q); return i.t && i.t.tech === techKey; });
        return say(t0.name + ', ' + this.lc(t0.trade) + '. ' + t0.avail + ', ' + t0.where + '.' + (mine.length ? '\n\nCurrently holding:\n' + mine.map((q) => this.listLine(q)).join('\n') : '\n\nNo open tickets right now.'), mine.slice(0, 2).map((q) => ({ label: 'Open ' + q.zone, kind: 'open', id: q.id })));
      }
      return say('On shift right now:\n' + Object.keys(X.TECH).map((k) => '• ' + X.TECH[k].name + ', ' + this.lc(X.TECH[k].trade) + ': ' + X.TECH[k].avail.toLowerCase()).join('\n'));
    }
    if (it === 'todo' && x) {
      if (!x.problem && !x.off) return say(x.zone + ' is reading normally. No action needed.');
      return say('At ' + x.zone + ':\n' + x.plain.todo.map((q, i) => (i + 1) + '. ' + q).join('\n') + '\n\nWho can fix it: ' + x.plain.who + '. Urgency: ' + x.plain.urg.toLowerCase() + '.', this.chipsFor(x));
    }
    if (it === 'why' && x) {
      if (!x.problem && !x.off) return say(x.zone + ' is fine. ' + x.k.name + ' is ' + x.valStr + ', close to its baseline of ' + x.baseStr + '.');
      return say(x.plain.what + '\n\n' + x.plain.why, this.chipsFor(x));
    }
    if (it === 'trend' && x) {
      const tr = x.trend, a = tr[0], b = tr[tr.length - 1], span = x.k.hi - x.k.lo;
      const dir = Math.abs(b - a) < span * 0.03 ? 'holding steady' : (b > a ? 'rising' : 'falling') + (Math.abs(b - a) > span * 0.2 ? ' sharply' : ' gradually');
      return say('Over the last 12 hours, ' + x.k.name.toLowerCase() + ' at ' + x.zone + ' went from ' + x.fmt(a) + ' to ' + x.fmt(b) + ' ' + x.k.unit + '. It has been ' + dir + '. Baseline is ' + x.baseStr + '.', [{ label: 'Open details', kind: 'open', id: x.id }]);
    }
    if (it === 'hardware') {
      if (x) return say('Sensor ' + x.id + ' at ' + x.zone + (x.off ? ' is offline and has not reported since ' + x.since + '.' : ' is online. Battery ' + x.batt + '%, signal ' + (x.batt > 70 ? 'strong' : 'good') + '.' + (x.low ? ' The battery needs replacing this week.' : '')));
      const offs = D.list.filter((q) => q.off), lows = D.list.filter((q) => q.low);
      return say((offs.length ? 'Offline:\n' + offs.map((q) => '• ' + q.zone + ' (' + q.id + '), since ' + q.since).join('\n') : 'No sensors are offline.') + (lows.length ? '\n\nLow battery:\n' + lows.map((q) => '• ' + q.zone + ' (' + q.id + '), ' + q.batt + '%').join('\n') : ''), offs.concat(lows).slice(0, 2).map((q) => ({ label: 'Open ' + q.zone, kind: 'open', id: q.id })));
    }
    if (it === 'overdue') {
      const od = open.filter((q) => this.tkInfo(q).status === 'overdue');
      if (!od.length) return say('Nothing is overdue right now.');
      return say(od.length + (od.length > 1 ? ' tickets are' : ' ticket is') + ' overdue:\n' + od.map((q) => { const i = this.tkInfo(q); return '• ' + q.zone + ' (' + i.id + '), ' + X.TECH[i.t.tech].name + ', overdue by ' + this.fmtMin(-i.due) + '. ' + this.escLine(q) + '.'; }).join('\n'), od.slice(0, 2).map((q) => ({ label: 'Open ' + q.zone, kind: 'open', id: q.id })));
    }
    if (it === 'unassigned') {
      const un = open.filter((q) => this.tkInfo(q).status === 'open');
      if (!un.length) return say('Everything open has an owner.');
      out.ctx.sensor = un[0].id;
      return say(un.length + ' open items have no owner. The most urgent:\n' + un.slice(0, 4).map((q) => this.listLine(q)).join('\n'), [{ label: 'Assign ' + X.TECH[this.tradeFor(un[0])].first + ' to ' + un[0].zone, kind: 'assign', id: un[0].id, tech: this.tradeFor(un[0]), pri: true }]);
    }
    if (it === 'health' && !x) {
      const catRaw = {};
      const raws = D.CATS.map((ck) => this.rangeOf(D.list.filter((q) => q.cat === ck)));
      const tot = this.roundR({ lo: raws.reduce((a2, r) => a2 + r.lo, 0) / raws.length, hi: raws.reduce((a2, r) => a2 + r.hi, 0) / raws.length });
      D.CATS.forEach((ck) => { catRaw[ck] = this.roundR(this.rangeOf(D.list.filter((q) => q.cat === ck))); });
      const best = D.CATS.slice().sort((a, b) => (catRaw[b].lo + catRaw[b].hi) - (catRaw[a].lo + catRaw[a].hi));
      return say('The building is estimated at ' + tot.text + ' out of 100. That is a range on purpose: it comes from sensor readings only, and one offline sensor widens it.\n\n' + D.CATS.map((ck) => '• ' + D.CAT[ck].name + ': ' + catRaw[ck].text).join('\n') + '\n\n' + D.CAT[best[0]].name + ' looks strongest. ' + D.CAT[best[best.length - 1]].name + ' needs the most attention.');
    }
    if (it === 'log') {
      const all = s.logExtra.concat(X.LOG);
      const rows = (x ? all.filter((e) => e.asset === x.zone) : all.filter((e) => e.day === 'Today')).slice(0, 5);
      if (!rows.length) return say('Nothing logged for that yet.');
      return say((x ? 'Recent events for ' + x.zone + ':\n' : 'Today so far:\n') + rows.map((e) => '• ' + (e.t === 'now' ? 'Just now' : e.t) + ' ' + e.text).join('\n'), [{ label: 'Open the activity log', kind: 'log' }]);
    }

    if (x && (it === 'status' || it === null || it === 'health' || it === 'todo' || it === 'why' || it === 'trend' || it === 'urgent')) return say(this.statusText(x), this.chipsFor(x));

    if (p.group) {
      const g = D.list.filter(this.chatIndex().GROUPS[p.group]);
      out.ctx.sensor = (g.find((q) => q.problem) || g[0]).id;
      return say(g.map((q) => '• ' + q.zone + ': ' + (q.off ? 'offline' : q.tag.toLowerCase() + ', ' + q.valStr)).join('\n'), g.filter((q) => q.problem).slice(0, 2).map((q) => ({ label: 'Open ' + q.zone, kind: 'open', id: q.id })));
    }
    if (p.cat || p.level) {
      const inSet = open.filter((q) => (!p.cat || q.cat === p.cat) && (!p.level || q.level === p.level));
      const label = (p.cat ? D.CAT[p.cat].name : '') + (p.cat && p.level ? ' on ' : '') + (p.level ? (p.level === 'roof' ? 'the roof' : D.LV[p.level].name) : '');
      if (!inSet.length) return say('Nothing open for ' + label.toLowerCase() + '. Every sensor there is reading normally.');
      out.ctx.sensor = inSet[0].id;
      return say(inSet.length + ' open for ' + label.toLowerCase() + ':\n' + inSet.map((q) => this.listLine(q)).join('\n'), this.chipsFor(inSet[0]).slice(0, 2));
    }
    if (techKey) return this.reply('who is ' + X.TECH[techKey].first);
    if (it === 'urgent' || it === 'todo' || it === 'status') {
      if (!open.length) return say('Nothing needs attention right now. Every sensor is reading inside its baseline.');
      const top = open.slice(0, 3);
      out.ctx.sensor = top[0].id;
      return say('Start with these:\n' + top.map((q) => this.listLine(q)).join('\n') + '\n\n' + top[0].zone + ' comes first: ' + (this.tkInfo(top[0]).status === 'overdue' ? 'it is already overdue.' : 'it is the most urgent.'), this.chipsFor(top[0]));
    }
    if (it === 'why' || it === 'trend' || it === 'walk') return say('Which sensor do you mean? You can name it, like Roof vent 6, Rooftop AC 2 or Water pipe A.');
    return say('I could not match that to a sensor or topic. Try naming a place like Roof vent 6 or Boiler, or ask what needs attention, what is overdue, or who is on site.', [{ label: 'What needs attention?', kind: 'ask', q: 'What needs attention?' }]);
  }
  ask(q) {
    const text = (q || '').trim();
    if (!text) return;
    this.setState({ chatMsgs: this.state.chatMsgs.concat([{ from: 'me', text }]), chatDraft: '', chatTyping: true });
    this.after(Math.min(1300, 450 + text.length * 12), () => {
      const r = this.reply(text);
      this.setState({ chatTyping: false, chatCtx: r.ctx, chatMsgs: this.state.chatMsgs.concat([{ from: 'bot', text: r.text, chips: r.chips }]) });
    });
  }
  chipAct(c) {
    if (c.kind === 'open') { this.closeChat(); this.openDetail(c.id); }
    else if (c.kind === 'walk') { this.closeChat(); this.locate(c.id); this.after(650, () => this.startWalk()); }
    else if (c.kind === 'assign') this.ask('Assign ' + this.byId(c.id).zone + ' to ' + this.extras().TECH[c.tech].first);
    else if (c.kind === 'ask') this.ask(c.q);
    else if (c.kind === 'log') { this.closeChat(); this.go('log'); }
    else if (c.kind === 'bp') { this.closeChat(); this.openBlueprint(); }
    else if (c.kind === 'pair') { this.closeChat(); this.go('sensors'); this.after(420, () => this.openPair()); }
    else if (c.kind === 'dev') { this.closeChat(); this.go('sensors'); this.after(420, () => this.openDev(c.id)); }
  }
  openChat() {
    const s = this.state;
    const upd = { chatOpen: true };
    if (s.detOpen) upd.chatCtx = { sensor: s.detId, tech: s.chatCtx ? s.chatCtx.tech : null };
    this.setState(upd);
    this.spring('chatY', 0);
  }
  arcPt(v) { const a = Math.PI * (1 - v / 100); return [62 + 52 * Math.cos(a), 64 - 52 * Math.sin(a)]; }

  moreVals2(v) {
    const D = this.data();
    const X = this.extras();
    const s = this.state;
    const scr = s.screen;
    const open = this.openItems();
    const inCat = (x) => s.cat === 'all' || x.cat === s.cat;
    const attnList = open.filter(inCat);
    const radii = ['30px 30px 30px 10px', '30px 10px 30px 30px', '10px 30px 30px 30px'];
    const tkOf = (x) => {
      const info = this.tkInfo(x);
      const tech = info.t ? X.TECH[info.t.tech] : null;
      return info.status === 'overdue' ? { tkLabel: 'Overdue · ' + tech.short, tkBg: 'var(--crit)', tkFg: 'var(--tagTx)' }
        : info.status === 'progress' ? { tkLabel: 'In progress · ' + tech.short, tkBg: 'var(--mint)', tkFg: 'var(--tx)' }
          : { tkLabel: 'Unassigned', tkBg: 'var(--panel2)', tkFg: 'var(--tx2)' };
    };
    const top = attnList.slice(0, 3);
    const ucards = top.map((x, i) => Object.assign({
      headline: x.plain.h, urgency: x.plain.urg, zone: x.zone, since: x.since, color: x.color, icon: x.icon, radius: radii[i % 3],
      pos: (i + 1) + '/' + top.length,
      flagClass: x.fresh && s.introDone && !s.pulseDone ? 'ns-flag' : '',
      locAria: 'Walk to ' + x.zone, open: () => this.openDetail(x.id), locate: () => this.locate(x.id)
    }, tkOf(x)));
    const rest = attnList.slice(3).map((x, i) => Object.assign({
      headline: x.plain.h, urgency: x.plain.urg, zone: x.zone, color: x.color, icon: x.icon, delay: i * 45,
      radius: i % 2 ? '22px 22px 22px 8px' : '22px 8px 22px 22px',
      aria: x.plain.h + ', ' + x.plain.urg, locAria: 'Walk to ' + x.zone,
      open: () => this.openDetail(x.id), locate: () => this.locate(x.id)
    }, tkOf(x)));
    const catChips = v.catChips.map((c) => Object.assign({}, c, {
      countBg: c.selected === 'true' ? 'var(--acc)' : 'var(--panel2)', countFg: c.selected === 'true' ? 'var(--accTx)' : 'var(--tx2)',
      bg: c.selected === 'true' ? 'var(--panel)' : '', border: c.selected === 'true' ? 'var(--tx)' : ''
    }));
    const lo = Number(v.hLo) || 0, hi = Number(v.hHi) || 0;
    const a0 = this.arcPt(Math.max(0.5, lo)), a1 = this.arcPt(Math.max(lo + 0.5, hi));
    const arcBand = hi > 0 ? 'M' + a0[0].toFixed(1) + ' ' + a0[1].toFixed(1) + ' A52 52 0 0 1 ' + a1[0].toFixed(1) + ' ' + a1[1].toFixed(1) : 'M0 0';
    const tk = (val, r1, r2) => { const a = Math.PI * (1 - val / 100); return 'M' + (62 + r1 * Math.cos(a)).toFixed(1) + ' ' + (64 - r1 * Math.sin(a)).toFixed(1) + 'L' + (62 + r2 * Math.cos(a)).toFixed(1) + ' ' + (64 - r2 * Math.sin(a)).toFixed(1); };
    const arcTicks = [25, 50, 75].map((q) => tk(q, 40, 45)).join('');

    const idx = { overview: 0, bp: 0, map: 1, sensors: 2, log: 3 }[scr] || 0;
    const on = (i) => (idx === i ? 'var(--accTx)' : '');

    const ctxX = s.chatCtx && s.chatCtx.sensor ? this.byId(s.chatCtx.sensor) : null;
    const msgs = s.chatMsgs.map((m, mi) => {
      const me = m.from === 'me';
      const chips = (m.chips || []).map((c) => ({ label: c.label, cls: c.pri ? 'ns-pri' : 'ns-chip', act: () => this.chipAct(c) }));
      return {
        text: m.text, align: me ? 'flex-end' : 'flex-start',
        bg: me ? 'var(--acc)' : 'var(--bg)', fg: me ? 'var(--accTx)' : 'var(--tx)',
        radius: me ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
        hasChips: !me && chips.length > 0 && mi === s.chatMsgs.length - 1, chips
      };
    });
    const sugg = ctxX
      ? ['What is wrong with ' + ctxX.zone + '?', 'Who should fix it?', 'How do I get there?', 'Is it getting worse?']
      : ['What should I fix first?', 'Which tickets are overdue?', 'Tell me about Rooftop AC 2', 'Any sensors offline?', 'Who is on site?'];

    return {
      scrAnim: s.navDir < 0 ? 'ns-in-l' : 'ns-in-r',
      railTop: 70 + idx * 62,
      railOverviewFg: on(0), railMapFg: on(1), railSensorsFg: on(2), railLogFg: on(3),
      catChips, ucards, attnRest: rest,
      udots: top.map((_, i) => ({ w: i === s.ucard ? 18 : 6, bg: i === s.ucard ? 'var(--acc)' : 'var(--line2)' })),
      onCarScroll: (e) => { const el = e && e.currentTarget; if (!el) return; const i = Math.round(el.scrollLeft / 268); if (i !== s.ucard) this.setState({ ucard: i }); },
      attnHasMore: attnList.length > 3, attnMoreLabel: s.attnAll ? 'Show fewer' : 'Show ' + (attnList.length - 3) + ' more',
      healthyRows: v.healthyRows.map((h, i) => Object.assign({}, h, { delay: i * 35 })),
      resolvedRows: s.resolved.map((r, i) => Object.assign({ delay: i * 60 }, r)),
      arcBand, arcTicks,

      sheetY: s.sheetMin ? 'calc(100% - 46px)' : '0px',
      sheetDown: (e) => { this.sw = { y: e.clientY }; },
      sheetUp: (e) => { if (!this.sw) return; const dy = e.clientY - this.sw.y; this.sw = null; if (Math.abs(dy) < 8) this.setState({ sheetMin: !s.sheetMin }); else this.setState({ sheetMin: dy > 0 }); },
      sheetLabel: s.sheetMin ? 'Expand panel' : 'Collapse panel',

      detDown: (e) => { if (this.sps) delete this.sps.panelX; this.dd = { x: e.clientX }; if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} } },
      detMove: (e) => { if (!this.dd) return; const dx = Math.max(0, e.clientX - this.dd.x); this.setState({ panelX: dx / 390 }); },
      detUp: (e) => { if (!this.dd) return; const dx = Math.max(0, e.clientX - this.dd.x); this.dd = null; if (dx > 90) this.closeDetail(); else this.spring('panelX', 0); },

      chatDown: (e) => { if (this.sps) delete this.sps.chatY; this.cd = { y: e.clientY }; if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} } },
      chatMove: (e) => { if (!this.cd) return; const dy = Math.max(0, e.clientY - this.cd.y); this.setState({ chatY: dy / 680 }); },
      chatUp: (e) => { if (!this.cd) return; const dy = Math.max(0, e.clientY - this.cd.y); this.cd = null; if (dy > 110) this.closeChat(); else this.spring('chatY', 0); },

      chatPx: (s.chatY * 700).toFixed(1),
      chatOverlayOp: (Math.max(0, Math.min(1, 1 - s.chatY)) * 0.35).toFixed(3),
      chatMsgs: msgs, chatSugg: sugg.map((t) => ({ text: t, ask: () => this.ask(t) })),
      chatCtxOn: !!ctxX, chatCtxName: ctxX ? ctxX.zone : '', chatCtxColor: ctxX ? ctxX.color : 'var(--tx2)',
      clearChatCtx: () => this.setState({ chatCtx: { sensor: null, tech: s.chatCtx ? s.chatCtx.tech : null } }),
      chatHasUnreadHint: false,
      launchTop: scr === 'map' ? '14px' : 'auto', launchBottom: scr === 'map' ? 'auto' : '18px',
      openChat: () => this.openChat()
    };
  }

  diagDef() {
    if (this.DG) return this.DG;
    const I = {
      roof: 'M3 10h18M5 10v9h14v-9M3 10l2-3h14l2 3',
      fan: 'M4 4h16v16H4zM12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 7v10M7 12h10',
      boiler: 'M7 4h10v16H7zM10 8h4M12 11v6M10 15h4',
      pipes: 'M8 3v18M16 3v18M8 8h8M8 16h8',
      layers: 'M4 7.5 12 3.5l8 4-8 4zM4 12l8 4 8-4M4 16.5l8 4 8-4',
      parking: 'M6 20V4h7a4.5 4.5 0 0 1 0 9H6',
      clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
      cal: 'M4 6h16v14H4zM4 10h16M8 3.5v4M16 3.5v4',
      drop: 'M12 3.5c3.2 4.2 5.5 7.1 5.5 10a5.5 5.5 0 0 1-11 0c0-2.9 2.3-5.8 5.5-10z',
      pipe: 'M3 9h7a3 3 0 0 1 3 3v9M3 14h4a1 1 0 0 1 1 1v6M17 4v5M15 4h4M13 21h5',
      bolt: 'M13 3 5 14h6l-1 7 8-11h-6z',
      crack: 'M12 3l-2.5 5 3.5 3-3.5 4 2.5 6M5 4v16M19 4v16',
      air: 'M3 9h10a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3M3 19h6',
      check: 'M5 12.5l4.5 4.5L19 7.5',
      bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
      team: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
      truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
      phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
      power: 'M12 3.5v8M7.2 6.3a7.5 7.5 0 1 0 9.6 0',
      rate: 'M3 12h3l2.5-6 4 12 3-8 1.5 2H21',
      bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
      valve: 'M2.5 12h4M17.5 12h4M6.5 8v8l11-8v8zM12 12V5M9 5h6',
      clip: 'M8 4h8v3H8zM6 5.5H5v15h14v-15h-1M9 13l2 2 4-4'
    };
    const O = (v, label, sub, icon) => ({ v, label, sub, icon });
    const steps = [
      { key: 'watch', kind: 'multi', info: true, kicker: 'What it does', q: 'Here is what Raksha watches for', help: 'All of these are covered automatically, across the whole site. Nothing to choose, just continue.', opts: [
        O('water', 'Water getting in', 'Roof, vents, low spots', I.drop), O('pipes', 'Leaks and pressure loss', 'Supply lines and pipes', I.pipe),
        O('equip', 'Equipment wearing out', 'HVAC, pumps, elevators', I.fan), O('heat', 'Heat and fire risk', 'Hot panels, sprinklers', I.bolt),
        O('structure', 'Structure moving', 'Cracks, settling, load', I.crack), O('air', 'Air and comfort', 'Room temperature, damp', I.air)] },
      { key: 'size', kind: 'size', kicker: 'Coverage area', q: 'How much space should they cover?', help: 'Rough numbers are fine. This sets how many sensors each area needs.' },
      { key: 'speed', kind: 'single', kicker: 'Timing', q: 'How fast do you need to know?', help: 'Faster alerts use a little more battery. You can change this for each sensor later.', opts: [
        O('now', 'The moment it happens', 'Live readings, instant alerts', I.bolt), O('hour', 'Within the hour', 'Readings every 15 minutes', I.clock),
        O('daily', 'A daily summary is fine', 'Hourly readings, one digest', I.cal)] },
      { key: 'respond', kind: 'team', kicker: 'When something is found', q: 'What should happen next?', help: 'This decides where each alert goes.', opts: [
        O('alert', 'Just alert me', 'A notification on this phone', I.bell), O('tech', 'Assign my technician', 'Routed to someone on staff', I.team),
        O('contractor', 'Send to a contractor', 'Share a link with the issue', I.truck), O('call', 'Call me if it is urgent', 'A phone call for critical alerts', I.phone)] },
      { key: 'control', kind: 'multi', kicker: 'Control', q: 'What do you want to control from your phone?', help: 'These work from the Sensors screen once your devices are paired.', opts: [
        O('power', 'Turn sensors on or off', 'Pause one during repairs', I.power), O('rate', 'How often they report', 'Live, 15 minutes or hourly', I.rate),
        O('blink', 'Blink to find one', 'Flash the light on a sensor', I.bulb), O('report', 'Status reports', 'Battery, signal and self-test', I.clip),
        O('shutoff', 'Shut off water', 'A valve closes on a big leak', I.valve)] },
      { key: 'trouble', kind: 'multi', kicker: 'History', q: 'Any trouble in the last few years?', help: 'We point extra sensors at anything that has gone wrong before.', opts: [
        O('leaks', 'Leaks or water damage', 'Roof, pipes or basement', I.drop), O('hvac', 'Equipment breakdowns', 'Units failing or struggling', I.fan),
        O('electrical', 'Electrical problems', 'Trips, hot panels, outages', I.bolt), O('cracks', 'Cracks or settling', 'Walls, slabs or supports', I.crack),
        O('none', 'Nothing I know of', 'We start from a clean slate', I.check)] }
    ];
    const AREA = [
      { v: 's', label: 'Under 10,000 sq ft', mid: 6000 }, { v: 'm', label: '10,000 to 50,000 sq ft', mid: 30000 },
      { v: 'l', label: '50,000 to 150,000 sq ft', mid: 100000 }, { v: 'xl', label: 'Over 150,000 sq ft', mid: 220000 }
    ];
    this.DG = { steps, AREA, I };
    return this.DG;
  }
  computeKit(dg) {
    const D = this.data();
    const G = this.diagDef();
    const SI = D.SI;
    const F = Math.max(1, dg.floors || 1);
    const area = (G.AREA.find((a) => a.v === dg.area) || G.AREA[1]);
    const fp = Math.max(2500, area.mid / F);
    const set = (arr) => { const o = {}; (arr || []).forEach((k) => { o[k] = true; }); return o; };
    const W = set(dg.watch), A = set(dg.where), C = set(dg.control), R = set(dg.respond), tr = set(dg.trouble);
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const items = [], left = [];
    const add = (key, name, icon, n, why, cat) => { if (n > 0) items.push({ key, name, icon, n: Math.max(1, Math.round(n)), why, cat }); };
    const rtus = clamp(Math.round(area.mid / 25000), 1, 24);
    const pipes = clamp(Math.round(fp / 8000), 1, 12);
    const elevs = Math.max(1, Math.round(F / 6) + (area.mid >= 100000 ? 1 : 0));
    const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
    const need = (name, places) => left.push({ name, why: 'You picked this job, but it needs ' + places + ' to watch. Add one of those to cover it.' });
    const skip = (name, job, hint) => left.push({ name, why: 'You did not ask to watch ' + job + '.' + (hint ? ' ' + hint : '') });

    if (W.water) {
      if (A.roof) {
        add('roofm', 'Roof moisture sensors', SI.moisture, clamp(Math.round(fp / 6000) + (tr.leaks ? 1 : 0), 2, 40), 'Water under a flat roof membrane stays hidden until it drips inside' + (tr.leaks ? ', and you have had leaks before.' : '.'), 'water');
        add('venth', 'Vent humidity sensors', SI.humidity, rtus * 2, 'About two per rooftop unit. Vents and curbs are a common way for rain to get in.', 'water');
      }
      if (A.floors || A.mech) add('floorw', 'Floor water sensors', SI.moisture, (A.floors ? F * 2 : 0) + (A.mech ? 2 : 0), 'Flat pucks for low spots, under water heaters and near drains' + (A.floors ? ', about two per floor.' : '.'), 'water');
      if (!A.roof && !A.floors && !A.mech) need('Water sensors', 'the roof, mechanical rooms or floors');
    } else skip('Water sensors', 'for water getting in', tr.leaks ? 'You mentioned leaks before, so you may want this.' : '');
    if (W.pipes) {
      if (A.walls || A.floors) add('pipel', 'Pipe leak sensors', SI.acoustic, pipes * Math.ceil(F / 2), 'Spread along about ' + plural(pipes, 'pipe') + ' so a leak is heard inside the wall before it shows.', 'water');
      if (A.mech) add('press', 'Pressure sensors', SI.pressure, 2 + (tr.leaks ? 1 : 0), 'On the main supply and the boiler loop. A slow drop in pressure points to a hidden leak.', 'water');
      if (!A.walls && !A.floors && !A.mech) need('Pipe leak sensors', 'inside walls, floors or mechanical rooms');
    } else skip('Pipe leak and pressure sensors', 'pipes', !W.water && tr.leaks ? 'You mentioned leaks before, so you may want this.' : '');
    if (W.equip) {
      const vib = (A.roof ? rtus : 0) + (A.mech ? 2 : 0) + (A.floors ? elevs : 0);
      const on = [];
      if (A.roof) on.push('each rooftop unit'); if (A.mech) on.push('boiler pumps'); if (A.floors) on.push(plural(elevs, 'elevator'));
      if (vib) add('vib', 'Vibration sensors', SI.vibration, vib, 'On ' + (on.length > 1 ? on.slice(0, -1).join(', ') + ' and ' + on[on.length - 1] : on[0]) + '. Worn bearings and belts show up here before they fail' + (tr.hvac ? ', which matters given your equipment history.' : '.'), 'mech');
      else need('Vibration sensors', 'the roof, mechanical rooms or floors');
    } else skip('Vibration sensors', 'equipment', tr.hvac ? 'You mentioned breakdowns before, so you may want this.' : '');
    if (W.heat) {
      if (A.elec || A.floors) add('therm', 'Panel heat sensors', SI.thermal, (A.floors ? F : 0) + (A.elec ? 2 : 0) + (tr.electrical ? 2 : 0), 'Inside panel doors' + (A.floors ? ', one per floor' : '') + '. Hot connections are an early fire warning' + (tr.electrical ? ', so panels with past problems get an extra.' : '.'), 'elec');
      if (A.walls || A.mech) add('sprp', 'Sprinkler pressure sensors', SI.pressure, pipes, 'One per sprinkler pipe, so a closed valve or leak shows up before a fire test does.', 'elec');
      if (!A.elec && !A.floors && !A.walls && !A.mech) need('Heat and sprinkler sensors', 'electrical rooms, floors, walls or mechanical rooms');
    } else skip('Panel heat and sprinkler sensors', 'heat and fire risk', tr.electrical ? 'You mentioned electrical problems before, so you may want this.' : '');
    if (W.structure) {
      if (A.grounds) add('strain', 'Strain gauges', SI.strain, clamp(Math.round(fp / 2500), 4, 40), 'On the parking piers and supports that carry the most load.', 'struct');
      if (A.walls || A.floors || A.roof) add('crack', 'Crack gauges', SI.crack, 2 + (tr.cracks ? 3 : 0), tr.cracks ? 'On the cracks you already know about, so you can see if they grow.' : 'On parapets and joints, where buildings usually move first.', 'struct');
      if (!A.grounds && !A.walls && !A.floors && !A.roof) need('Crack and strain gauges', 'walls, floors, the roof or the grounds');
    } else skip('Crack and strain gauges', 'for movement', tr.cracks ? 'You mentioned cracks before, so you may want this.' : '');
    if (W.air) {
      const n = (A.floors ? F * 2 : 0) + (A.mech ? 1 : 0);
      if (n) add('air', 'Room air sensors', SI.humidity, n, (A.floors ? 'About two per floor' : 'In the plant room') + ' to spot spaces running too hot, too cold or damp.', 'mech');
      else need('Room air sensors', 'floors or mechanical rooms');
    } else skip('Room air sensors', 'air and comfort');
    if (C.shutoff) {
      if (W.water || W.pipes) add('valve', 'Automatic shut-off valves', G.I.valve, (A.walls ? pipes : 1) + (A.mech ? 1 : 0), 'They close on their own when a big leak is detected. A plumber fits these.', 'water');
      else left.push({ name: 'Automatic shut-off valves', why: 'They only act on leak alerts, so add water or pipe leaks to use them.' });
    } else if (W.water || W.pipes) left.push({ name: 'Automatic shut-off valves', why: 'You did not ask for automatic water shut-off.' });

    const total = items.reduce((t, k) => t + k.n, 0);
    const gw = total ? Math.max(1, Math.ceil(total / 25)) + (A.grounds ? 1 : 0) : 0;
    const radii = ['24px 24px 24px 8px', '24px 8px 24px 24px', '8px 24px 24px 24px', '24px 24px 8px 24px'];
    const catColor = { water: 'var(--acc)', elec: 'var(--watch)', mech: 'var(--slate)', struct: 'var(--mint)' };
    const catFg = { water: 'var(--accTx)', elec: 'var(--tagTx)', mech: 'var(--tagTx)', struct: 'var(--tx)' };
    const kitItems = items.map((k, i) => {
      const lo = Math.max(1, Math.floor(k.n * 0.8)), hi = Math.max(lo + 1, Math.ceil(k.n * 1.25));
      return Object.assign({}, k, { range: lo + ' to ' + hi, radius: radii[i % 4], delay: 60 + i * 70, bg: catColor[k.cat], fg: catFg[k.cat] });
    });
    if (gw) kitItems.push({ name: 'Gateways', icon: 'M12 12m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14', n: gw, range: gw + ' to ' + (gw + 1), why: 'Small hubs that carry sensor data to the app' + (A.grounds ? ', with one extra to reach the grounds.' : '.'), radius: '24px', delay: 60 + items.length * 70, bg: 'var(--panel2)', fg: 'var(--tx)' });

    const feats = [];
    feats.push({ now: 'Instant alerts with live readings', hour: 'Alerts within the hour', daily: 'One daily summary' }[dg.speed] || 'Alerts within the hour');
    if (R.alert) feats.push('Alerts on this phone');
    if (R.tech) feats.push('Technician assignment for your team of ' + dg.teamSize);
    if (R.contractor) feats.push('Contractor hand-off links');
    if (R.call) feats.push('Phone calls for urgent problems');
    if (C.power) feats.push('Turn sensors on or off');
    if (C.rate) feats.push('Choose how often each reports');
    if (C.blink) feats.push('Blink to find');
    if (C.report) feats.push('Status reports on demand');
    if (C.shutoff && (W.water || W.pipes)) feats.push('Automatic water shut-off');
    feats.push('Walk-to-sensor map');
    feats.push('Site code for pairing');

    const jobWord = { water: 'water getting in', pipes: 'leaks', equip: 'equipment wear', heat: 'fire risk', structure: 'movement', air: 'air and comfort' };
    const jobs = (dg.watch || []).map((k) => jobWord[k]).filter(Boolean);
    const jobText = jobs.length > 1 ? jobs.slice(0, -1).join(', ') + ' and ' + jobs[jobs.length - 1] : jobs[0] || 'problems';
    const cats = []; items.forEach((k) => { if (cats.indexOf(k.cat) < 0) cats.push(k.cat); });
    return {
      items: kitItems, left, features: feats.map((t, i) => ({ text: t, delay: 200 + i * 60 })), total, gw, cats,
      rate: { now: 'live', hour: '15', daily: '60' }[dg.speed] || '15',
      summary: 'Watching for ' + jobText + ' across ' + plural(F, 'floor') + ' and ' + area.label.replace('Under', 'under').replace('Over', 'over') + '. Each line says why it is on your list.',
      short: 'your ' + F + '-floor site'
    };
  }
  devRateOf(x) { return this.state.devRate[x.id] || (this.state.kit && this.state.kit.rate) || 'live'; }
  openDev(id) {
    this.setState({ devId: id, devOpen: true, devCheckId: null, devCheck: 0 });
    this.spring('devY', 0);
  }
  closeDev() { this.setState({ devOpen: false }); this.spring('devY', 1); }
  togglePower(id) {
    const x = this.byId(id); if (!x) return;
    const off = Object.assign({}, this.state.devOff);
    const nowOff = !off[id];
    if (nowOff) off[id] = true; else delete off[id];
    this.setState({ devOff: off, devCheckId: this.state.devCheckId === id ? null : this.state.devCheckId });
    this.addLog('device', x.id + (nowOff ? ' paused' : ' turned back on'), 'You', x.zone);
    this.toast(x.zone + (nowOff ? ' paused. It will not send readings.' : ' is back on'));
  }
  setRate(id, r) {
    const x = this.byId(id); if (!x) return;
    if (this.state.devOff[id]) { this.toast('Turn ' + x.zone + ' on first'); return; }
    if (this.devRateOf(x) === r) return;
    this.setState({ devRate: Object.assign({}, this.state.devRate, { [id]: r }) });
    const w = { live: 'live', '15': 'every 15 minutes', '60': 'hourly' }[r];
    this.addLog('device', x.id + ' now reports ' + w, 'You', x.zone);
    this.toast(x.zone + ' now reports ' + w);
  }
  runCheck(id) {
    const x = this.byId(id); if (!x) return;
    if (this.state.devOff[id]) { this.toast('Turn ' + x.zone + ' on to run a status report'); return; }
    this.setState({ devCheckId: id, devCheck: 0 });
    [1, 2, 3, 4].forEach((i) => this.after(380 * i, () => { if (this.state.devCheckId === id) this.setState({ devCheck: i }); }));
  }
  openPair() {
    this.setState({ pairOpen: true, pairStage: 'enter', pairP: 0 });
    this.spring('pairY', 0);
  }
  closePair() { this.setState({ pairOpen: false }); this.spring('pairY', 1); }
  pairGo() {
    const s = this.state;
    const code = (s.pairCode || '').replace(/[^a-z0-9]/gi, '');
    if (code.length < 6) { this.toast('Enter the code on the back of the sensor'); return; }
    const D = this.data();
    const p = (D.pending || [])[0];
    if (!p) { this.toast('No new device answered. Check the code and that its light is blinking.'); return; }
    this.setState({ pairStage: 'pairing', pairP: 0, pairDevId: p.id });
    [1, 2, 3].forEach((i) => this.after(650 * i, () => { if (this.state.pairOpen) this.setState({ pairP: i }); }));
    this.after(2400, () => {
      if (!this.state.pairOpen) return;
      D.pending = D.pending.filter((q) => q !== p);
      D.list.push(p);
      (this.paired = this.paired || new Set()).add(p.id);
      this.CI = null;
      this.addLog('device', p.id + ' paired to site ' + this.state.siteCode, 'You', p.zone);
      this.setState({ pairStage: 'done', justPaired: p.id, pairCode: '' });
    });
  }
  devVals(v) {
    const D = this.data();
    const s = this.state;
    const L = D.list;
    const G = this.diagDef();
    const isOff = (x) => !!s.devOff[x.id];
    const RATE = { live: 'Live', '15': '15 min', '60': 'Hourly' };
    const RATEL = { live: 'Reporting live', '15': 'Reporting every 15 min', '60': 'Reporting hourly' };
    const pausedN = L.filter(isOff).length;
    const offlineN = L.filter((x) => x.off).length;
    const lowN = L.filter((x) => x.low).length;
    const onlineN = L.filter((x) => !x.off && !isOff(x)).length;
    const fKey = ['all', 'care', 'paused'].indexOf(s.sensFilter) >= 0 ? s.sensFilter : 'all';
    const match = (x) => fKey === 'all' || (fKey === 'care' && (x.off || x.low)) || (fKey === 'paused' && isOff(x));
    const stOf = (x) => (isOff(x) ? 'paused' : x.off ? 'offline' : 'online');
    const sensGroups = D.LEVELS.map((lk) => {
      const rows = L.filter((x) => x.level === lk && match(x)).map((x) => {
        const st = stOf(x), on = st !== 'paused';
        return {
          zone: x.zone, id: x.id, icon: x.icon,
          dot: st === 'paused' ? 'var(--line2)' : st === 'offline' ? 'var(--crit)' : x.low ? 'var(--watch)' : 'var(--ok)',
          sub: st === 'paused' ? 'Paused by you' : st === 'offline' ? 'Offline since ' + x.since : x.low ? 'Battery low · ' + x.batt + '%' : RATE[this.devRateOf(x)] + ' · battery ' + x.batt + '%',
          subFg: st === 'offline' ? 'var(--crit)' : 'var(--tx2)',
          rowOp: on ? 1 : 0.6,
          aria: x.zone + ', ' + st + '. Open controls',
          on: String(on), swBg: on ? 'var(--acc)' : 'var(--line2)', knobX: on ? 18 : 0, swAria: x.zone + ' power',
          open: () => this.openDev(x.id), toggle: () => this.togglePower(x.id),
          newCls: x.id === s.justPaired ? 'ns-pop' : 'ns-rise'
        };
      });
      return { name: D.LV[lk].name, count: rows.length, rows };
    }).filter((g) => g.rows.length);
    const fTabs = [['all', 'All', L.length], ['care', 'Issues', offlineN + lowN], ['paused', 'Paused', pausedN]];
    const sumParts = [];
    if (offlineN) sumParts.push(offlineN + ' offline');
    if (lowN) sumParts.push(lowN + ' low battery');
    if (pausedN) sumParts.push(pausedN + ' paused');

    const x = this.byId(s.devId) || L[0];
    const st = stOf(x), on = st !== 'paused';
    const rate = this.devRateOf(x);
    const blinking = s.blinkId === x.id;
    const checkOn = s.devCheckId === x.id;
    const ok = 'M5 12.5l4.5 4.5L19 7.5', bad = 'M7 7l10 10M17 7 7 17', warn = 'M12 6v8M12 18h.01';
    const checks = x.off
      ? [['Power', 'No response', bad, 'var(--crit)'], ['Signal', 'Nothing since ' + x.since, bad, 'var(--crit)'], ['Self-test', 'Could not run', bad, 'var(--crit)'], ['Reading', 'Last one ' + x.since, warn, 'var(--watch)']]
      : [['Power', 'Battery ' + x.batt + '%' + (x.low ? ', replace soon' : ''), x.low ? warn : ok, x.low ? 'var(--watch)' : 'var(--ok)'],
        ['Signal', (x.batt > 70 ? 'Strong' : 'Good') + ', via gateway G-1', ok, 'var(--ok)'],
        ['Self-test', 'Passed', ok, 'var(--ok)'],
        ['Reading', x.valStr + ', just now', ok, 'var(--ok)']];
    const nShown = checkOn ? s.devCheck : 0;
    const done = checkOn && s.devCheck >= 4;
    const bulb = G.I.bulb;
    const acts = [
      { label: 'Status report', icon: G.I.clip, act: () => this.runCheck(x.id), on: checkOn, dis: !on },
      { label: blinking ? 'Blinking now' : 'Blink its light', icon: bulb, act: () => { if (!on || x.off) { this.toast(x.zone + ' cannot blink while ' + (on ? 'offline' : 'paused')); return; } this.blink(x.id); }, on: blinking, dis: !on || x.off, iconCls: blinking ? 'ns-il-blinkdot' : '' },
      { label: 'Show on map', icon: 'M4 11.5 20 4l-7.5 16-2-6.5z', act: () => { const id = x.id; this.closeDev(); this.after(260, () => this.locate(id)); }, on: false, dis: false },
      { label: 'Readings and fixes', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2', act: () => { const id = x.id; this.closeDev(); this.after(260, () => this.openDetail(id)); }, on: false, dis: false }
    ];
    const radii = ['22px 22px 22px 8px', '22px 8px 22px 22px', '8px 22px 22px 22px', '22px 22px 8px 22px'];
    const rateKeys = ['live', '15', '60'];
    const sheet = (key, openKey, closeFn, h) => ({
      down: (e) => { if (this.sps) delete this.sps[key]; this['g_' + key] = { y: e.clientY }; if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} } },
      move: (e) => { const g = this['g_' + key]; if (!g) return; this.setState({ [key]: Math.max(0, e.clientY - g.y) / h }); },
      up: (e) => { const g = this['g_' + key]; if (!g) return; const dy = Math.max(0, e.clientY - g.y); this['g_' + key] = null; if (dy > 100) closeFn(); else this.spring(key, 0); }
    });
    const dS = sheet('devY', 'devOpen', () => this.closeDev(), 620);
    const pS = sheet('pairY', 'pairOpen', () => this.closePair(), 640);
    const pd = this.byId(s.justPaired);
    const pairSteps = ['Found the device', 'Linked to ' + s.siteCode, 'First reading received'].map((t, i) => {
      const dn = s.pairP > i, cur = s.pairP === i;
      return { text: t, op: dn || cur ? 1 : 0.4, bg: dn ? 'var(--ok)' : 'var(--panel2)', checkS: dn ? 1 : 0 };
    });
    const code = (s.pairCode || '').replace(/[^a-z0-9]/gi, '');
    return {
      sensGroups, filterTabs: fTabs.map(([k, name, n]) => ({ name, count: n, pressed: String(fKey === k), fg: fKey === k ? 'var(--tx)' : '', pick: () => this.setState({ sensFilter: k }) })),
      fThumb: fTabs.findIndex((t) => t[0] === fKey) * 100,
      sensEmpty: sensGroups.length === 0,
      sensEmptyText: fKey === 'paused' ? 'Nothing is paused. Pause a sensor while someone works near it so it does not raise false alerts.' : 'Every sensor has signal and battery. Nothing needs care right now.',
      devOnline: onlineN, devTotal: L.length, devBarW: (onlineN / Math.max(1, L.length) * 100).toFixed(1),
      devSumLine: sumParts.length ? sumParts.join(' · ') : 'Everything is reporting',
      siteCode: s.siteCode, codeAria: 'Site code ' + s.siteCode.split('').join(' ') + '. Copy',
      copyCode: () => this.toast('Site code ' + s.siteCode + ' copied'),
      openPair: () => this.openPair(),

      devDialogAria: 'Controls for ' + x.zone,
      dv: {
        icon: x.icon, zone: x.zone, id: x.id, kind: x.k.dev, level: x.levelName,
        status: st === 'paused' ? 'Paused' : st === 'offline' ? 'Offline' : RATEL[rate],
        meta: st === 'paused' ? 'Not sending readings. Turn on to resume.' : st === 'offline' ? 'No signal since ' + x.since : 'Latest ' + x.valStr + ' · battery ' + x.batt + '%',
        dot: st === 'paused' ? 'var(--line2)' : st === 'offline' ? 'var(--crit)' : 'var(--ok)', dotCls: st === 'online' ? 'ns-live' : '',
        on: String(on), swBg: on ? 'var(--acc)' : 'var(--line2)', knobX: on ? 24 : 0, swAria: x.zone + ' power'
      },
      devToggle: () => this.togglePower(x.id),
      devActs: acts.map((a, i) => ({ label: a.label, icon: a.icon, act: a.act, pressed: String(!!a.on), border: a.on ? 'var(--acc)' : 'transparent', fg: a.on ? 'var(--acc)' : 'var(--tx)', op: a.dis ? 0.5 : 1, radius: radii[i], iconCls: a.iconCls || '' })),
      devCheckOn: checkOn, devChecking: checkOn && !done,
      devChecks: checks.slice(0, nShown).map((c) => ({ name: c[0], val: c[1], icon: c[2], bg: c[3] })),
      devCheckHead: !done ? 'Checking' : x.off ? 'Not responding' : x.low ? '1 thing to look at' : 'All good',
      devCheckFg: !done ? 'var(--tx2)' : x.off ? 'var(--crit)' : x.low ? 'var(--tx)' : 'var(--ok)',
      devHintOn: done && (x.off || x.low), devHint: x.off ? 'Try this: check the battery and antenna ' + x.mount + '.' : 'Swap the battery on your next visit. The sensor keeps reporting until then.',
      devRates: rateKeys.map((r) => ({ name: RATE[r], pressed: String(rate === r), fg: rate === r ? 'var(--accTx)' : '', pick: () => this.setRate(x.id, r) })),
      devRateThumb: rateKeys.indexOf(rate) * 100, devRateOp: on ? 1 : 0.5,
      devPx: (s.devY * 740).toFixed(1), devVis: (s.devOpen || s.devY < 0.999) ? 'visible' : 'hidden',
      devOverlayOp: (Math.max(0, Math.min(1, 1 - s.devY)) * 0.35).toFixed(3), devOverlayPE: s.devOpen ? 'auto' : 'none',
      closeDev: () => this.closeDev(), devDown: dS.down, devMove: dS.move, devUp: dS.up,

      pairPx: (s.pairY * 680).toFixed(1), pairVis: (s.pairOpen || s.pairY < 0.999) ? 'visible' : 'hidden',
      pairOverlayOp: (Math.max(0, Math.min(1, 1 - s.pairY)) * 0.35).toFixed(3), pairOverlayPE: s.pairOpen ? 'auto' : 'none',
      closePair: () => this.closePair(), pairDown: pS.down, pairMove: pS.move, pairUp: pS.up,
      pairEnter: s.pairStage === 'enter', pairWorking: s.pairStage === 'pairing', pairDoneOn: s.pairStage === 'done',
      pairCode: s.pairCode, setPairCode: (e) => this.setState({ pairCode: e && e.target ? e.target.value.toUpperCase() : '' }),
      pairScan: () => { this.setState({ pairCode: 'RH-V9-2F41' }); this.toast('Code scanned'); },
      pairGo: (e) => { if (e && e.preventDefault) e.preventDefault(); this.pairGo(); },
      pairDis: String(code.length < 6), pairBtnOp: code.length < 6 ? 0.45 : 1,
      pairDevId: s.pairDevId || '', pairSteps,
      pairedName: pd ? pd.zone : '', pairedMeta: pd ? pd.levelName + ' · ' + pd.k.dev.toLowerCase() + ' · first reading ' + pd.valStr + '. It now shows on your map and in this list.' : '',
      pairShowMap: () => { const id = s.justPaired; this.closePair(); this.after(280, () => this.locate(id)); },
      pairAnother: () => this.setState({ pairStage: 'enter', pairP: 0 })
    };
  }
  introGo(i) { this.setState({ introIdx: Math.max(0, Math.min(3, i)), introTouched: true }); }
  introTick() {
    this.after(5200, () => {
      const s = this.state;
      if (s.screen === 'intro' && !s.introTouched && s.introIdx < 3) { this.setState({ introIdx: s.introIdx + 1 }); this.introTick(); }
    });
  }
  diagPick(step, v) {
    if (step.info) return;  // information page: everything is always on
    const s = this.state;
    const dg = Object.assign({}, s.dg);
    if (step.kind === 'single') {
      dg[step.key] = v;
      const at = this.state.diagStep;
      this.setState({ dg });
      if (step.kind === 'single') this.after(420, () => { if (this.state.screen === 'diag' && this.state.diagStep === at && this.state.dg[step.key] === v) this.diagNext(); });
      return;
    }
    let arr = (dg[step.key] || []).slice();
    if (arr.indexOf(v) >= 0) arr = arr.filter((q) => q !== v);
    else {
      if (v === 'none') arr = ['none'];
      else { arr = arr.filter((q) => q !== 'none'); arr.push(v); }
      if (step.max && arr.length > step.max) arr = arr.slice(arr.length - step.max);
    }
    dg[step.key] = arr;
    this.setState({ dg });
  }
  diagAnswered(step) {
    const dg = this.state.dg;
    if (step.kind === 'size') return !!dg.area;
    if (step.kind === 'multi' || step.kind === 'team') return (dg[step.key] || []).length > 0;
    return !!dg[step.key];
  }
  diagNext() {
    const s = this.state;
    const steps = this.diagDef().steps;
    if (s.diagStep < steps.length - 1) { if (!this.diagAnswered(steps[s.diagStep])) return; this.setState({ diagStep: s.diagStep + 1, diagDir: 1, diagFlip: !s.diagFlip }); }
    else if (s.diagStep === steps.length - 1) { if (!this.diagAnswered(steps[s.diagStep])) return; this.setState({ diagStep: steps.length, diagDir: 1, kit: this.computeKit(s.dg) }); }
  }
  finishOnboarding(toBp) {
    const k = this.state.kit;
    this.setState({ onboarded: true, kitDismissed: false });
    if (toBp) { this.openBlueprint(); return; }
    this.go('overview');
    if (k) this.toast('Your plan is saved. About ' + k.total + ' sensors.');
  }

  obVals(v) {
    const s = this.state;
    const G = this.diagDef();
    const scr = s.screen;
    const isOnb = scr === 'intro' || scr === 'auth' || scr === 'diag';
    const idx = s.introIdx;
    const sl = (i) => ((i - idx) * 100).toFixed(0);
    const art = (i) => (i === idx ? 'rotate(0deg) scale(1)' : 'rotate(' + (i < idx ? -4 : 4) + 'deg) scale(0.88)');
    const out = {
      isOnb, isIntro: scr === 'intro', isAuth: scr === 'auth', isDiag: scr === 'diag',
      goSignup: () => this.skipToDashboard(), goLogin: () => this.skipToDashboard(),
      goIntro: () => { this.go('intro', { introTouched: true }); },
      introDown: (e) => { this.ix = e.clientX; },
      introUp: (e) => { if (this.ix == null) return; const dx = e.clientX - this.ix; this.ix = null; if (dx < -40) this.introGo(idx + 1); else if (dx > 40) this.introGo(idx - 1); },
      introDots: [0, 1, 2, 3].map((i) => ({ sel: String(i === idx), aria: 'Slide ' + (i + 1) + ' of 4', w: i === idx ? 26 : 7, bg: i === idx ? 'var(--acc)' : 'var(--line2)', pick: () => this.introGo(i) })),
      introCta: idx < 3 ? 'Next' : 'Get started',
      introPrimary: () => { if (idx < 3) this.introGo(idx + 1); else this.go('diag', { diagStep: 0, diagDir: 1 }); },
      authTitle: s.authMode === 'signup' ? 'Create your account' : 'Welcome back',
      authSub: s.authMode === 'signup' ? 'Set up takes about two minutes, including a short checkup of your building.' : 'Log in to see what your sensors are saying.',
      authThumb: s.authMode === 'signup' ? 0 : 100,
      isSignup: s.authMode === 'signup', isLogin: s.authMode === 'login', isSignupStr: String(s.authMode === 'signup'), isLoginStr: String(s.authMode === 'login'),
      signupFg: s.authMode === 'signup' ? 'var(--tx)' : '', loginFg: s.authMode === 'login' ? 'var(--tx)' : '',
      pickSignup: () => this.setState({ authMode: 'signup' }), pickLogin: () => this.setState({ authMode: 'login' }),
      authName: s.authName, authEmail: s.authEmail, authPass: s.authPass, passAuto: s.authMode === 'signup' ? 'new-password' : 'current-password',
      setAuthName: (e) => this.setState({ authName: e && e.target ? e.target.value : '' }),
      setAuthEmail: (e) => this.setState({ authEmail: e && e.target ? e.target.value : '' }),
      setAuthPass: (e) => this.setState({ authPass: e && e.target ? e.target.value : '' }),
      authCta: s.authMode === 'signup' ? 'Create account' : 'Log in',
      authSubmit: (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (this.state.authMode === 'signup') this.go('diag', { diagStep: 0, diagDir: 1 });
        else { this.setState({ onboarded: true }); this.go('overview'); this.toast('Welcome back' + (this.state.authName ? ', ' + this.state.authName.split(' ')[0] : '')); }
      }
    };
    for (let i = 0; i < 4; i++) { out['sl' + i] = sl(i); out['art' + i] = art(i); out['txt' + i] = i === idx ? 'ns-slidetxt' : ''; out['hid' + i] = String(i !== idx); }

    const steps = G.steps;
    const st = Math.min(s.diagStep, steps.length);
    const isRes = st >= steps.length;
    out.diagQ = scr === 'diag' && !isRes;
    out.diagResults = scr === 'diag' && isRes;
    out.diagSegs = steps.map((_, i) => ({ bg: i < st ? 'var(--acc)' : i === st ? 'var(--tx)' : 'var(--line2)' }));
    out.diagStepLabel = isRes ? 'Done' : (st + 1) + ' of ' + steps.length;
    out.diagAnim = (s.diagDir < 0 ? 'ns-in-l' : 'ns-in-r') + (s.diagFlip ? '2' : '');
    out.diagBack = () => {
      const c = this.state.diagStep;
      if (c === 0) this.go('intro');
      else this.setState({ diagStep: c - 1, diagDir: -1, diagFlip: !this.state.diagFlip });
    };
    const radii = ['26px 26px 26px 8px', '26px 8px 26px 26px', '8px 26px 26px 26px', '26px 26px 8px 26px'];
    if (!isRes) {
      const step = steps[st];
      const val = s.dg[step.key];
      const selected = (o) => (Array.isArray(val) ? val.indexOf(o.v) >= 0 : val === o.v);
      const opts = (step.opts || []).map((o, i) => {
        const on = selected(o);
        return {
          label: o.label, sub: o.sub, icon: o.icon, pressed: String(on), radius: radii[i % 4], delay: i * 45,
          bg: on ? 'var(--panel)' : 'var(--panel)', border: on ? 'var(--acc)' : 'transparent',
          iconBg: on ? 'var(--acc)' : 'var(--panel2)', iconFg: on ? 'var(--accTx)' : 'var(--tx)', checkScale: on ? 1 : 0,
          pick: () => this.diagPick(step, o.v)
        };
      });
      out.dq = { kicker: step.kicker + (!step.info && (step.kind === 'multi' || step.kind === 'team') ? ' · pick ' + (step.max ? 'up to ' + step.max : 'any') : ''), q: step.q, help: step.help, opts, isTiles: step.kind === 'single' || step.kind === 'multi', isSize: step.kind === 'size', isTeam: step.kind === 'team' };
      const ok = this.diagAnswered(step);
      out.diagNextOp = ok ? 1 : 0.4; out.diagNextPE = ok ? 'auto' : 'none'; out.diagNextDis = String(!ok);
      out.diagNextLabel = st === steps.length - 1 ? 'See my plan' : 'Continue';
    } else {
      out.dq = { kicker: '', q: '', help: '', opts: [], isTiles: false, isSize: false, isTeam: false };
      out.diagNextOp = 1; out.diagNextPE = 'auto'; out.diagNextDis = 'false'; out.diagNextLabel = '';
    }
    out.diagNext = () => this.diagNext();
    out.dFloors = s.dg.floors; out.floorsAria = s.dg.floors + ' floors';
    out.floorsMinus = () => this.setState({ dg: Object.assign({}, s.dg, { floors: Math.max(1, s.dg.floors - 1) }) });
    out.floorsPlus = () => this.setState({ dg: Object.assign({}, s.dg, { floors: Math.min(80, s.dg.floors + 1) }) });
    out.areaOpts = G.AREA.map((a) => { const on = s.dg.area === a.v; return { label: a.label, pressed: String(on), border: on ? 'var(--acc)' : 'var(--line2)', bg: on ? 'var(--acc)' : 'transparent', fg: on ? 'var(--accTx)' : 'var(--tx)', pick: () => this.setState({ dg: Object.assign({}, s.dg, { area: a.v }) }) }; });
    out.teamNeedsSize = (s.dg.respond || []).indexOf('tech') >= 0;
    out.dTeamSize = s.dg.teamSize;
    out.teamMinus = () => this.setState({ dg: Object.assign({}, s.dg, { teamSize: Math.max(1, s.dg.teamSize - 1) }) });
    out.teamPlus = () => this.setState({ dg: Object.assign({}, s.dg, { teamSize: Math.min(60, s.dg.teamSize + 1) }) });

    const k = s.kit;
    out.kitTotal = k ? k.total : 0; out.kitSummary = k ? k.summary : '';
    out.kitItems = k ? k.items : []; out.kitLeft = k ? k.left : []; out.kitFeatures = k ? k.features : [];
    out.finishLabel = s.onboarded ? 'Back to my dashboard' : 'Go to my dashboard';
    out.finishOnb = () => this.finishOnboarding(false);
    out.finishToBlueprint = () => this.finishOnboarding(true);
    out.finishToPair = () => { this.setState({ onboarded: true, kitDismissed: false }); this.go('sensors'); this.after(420, () => this.openPair()); };
    out.kitHeadA = k && k.total ? 'About ' + k.total + ' sensors, ' : 'Nothing to install yet, ';
    out.kitHeadB = k && k.total ? 'nothing extra.' : 'see the notes below.';

    out.showKitCard = !!k && s.onboarded && !s.kitDismissed && scr === 'overview';
    out.kitShort = k ? k.short : '';
    out.viewKit = () => this.go('diag', { diagStep: G.steps.length });
    out.dismissKit = () => this.setState({ kitDismissed: true });
    if (k && k.cats && v.catChips) out.catChips = v.catChips.filter((c) => c.name === 'All' || k.cats.some((ck) => this.data().CAT[ck].name === c.name));
    return out;
  }

  moreVals(base) {
    const D = this.data();
    const X = this.extras();
    const s = this.state;
    const scr = s.screen;

    const open = D.list.filter((x) => (x.problem || x.off) && this.tkInfo(x).status !== 'resolved');
    const rank = (x) => { const st = this.tkInfo(x).status; return st === 'overdue' ? 0 : x.st === 'crit' ? 1 : x.st === 'watch' ? 2 : 3; };
    open.sort((a, b) => rank(a) - rank(b) || a.age - b.age);
    const urgentN = open.filter((x) => x.st === 'crit').length;
    const overdueN = open.filter((x) => this.tkInfo(x).status === 'overdue').length;
    const progN = open.filter((x) => this.tkInfo(x).status === 'progress').length;
    const unN = open.filter((x) => this.tkInfo(x).status === 'open').length;
    const flaggedLine = [urgentN + ' urgent', overdueN + ' overdue', unN + ' unassigned'].join(' · ');

    const catKeys = ['all'].concat(D.CATS);
    const catChips = catKeys.map((ck) => {
      const on = s.cat === ck;
      const n = ck === 'all' ? open.length : open.filter((x) => x.cat === ck).length;
      return {
        name: ck === 'all' ? 'All' : D.CAT[ck].name, icon: ck === 'all' ? '' : D.CAT[ck].icon, hasIcon: ck !== 'all', count: n, selected: String(on),
        border: on ? 'var(--acc)' : '', bg: on ? 'var(--panel2)' : '', fg: on ? 'var(--tx)' : '',
        pick: () => this.setState({ cat: ck, attnAll: false })
      };
    });
    const inCat = (x) => s.cat === 'all' || x.cat === s.cat;
    const attnList = open.filter(inCat);
    const shown = s.attnAll ? attnList : attnList.slice(0, 3);
    const attnRows = shown.map((x) => {
      const info = this.tkInfo(x);
      const tech = info.t ? X.TECH[info.t.tech] : null;
      const tk = info.status === 'overdue'
        ? { tkLabel: 'Overdue · ' + tech.short, tkBorder: 'var(--crit)', tkFg: 'var(--crit)' }
        : info.status === 'progress'
          ? { tkLabel: 'In progress · ' + tech.short, tkBorder: 'var(--acc)', tkFg: 'var(--tx)' }
          : { tkLabel: 'Unassigned', tkBorder: 'var(--line2)', tkFg: 'var(--tx2)' };
      return Object.assign({
        headline: x.plain.h, urgency: x.plain.urg, zone: x.zone, since: x.since, color: x.color, icon: x.icon,
        flagClass: x.fresh && s.introDone && !s.pulseDone ? 'ns-flag' : '',
        aria: x.plain.h + ', ' + x.plain.urg + ', ' + tk.tkLabel, locAria: 'Walk to ' + x.zone,
        open: () => this.openDetail(x.id), locate: () => this.locate(x.id)
      }, tk);
    });
    const healthy = D.list.filter((x) => x.st === 'ok' && inCat(x));

    const tkX = this.byId(s.detId) || D.list[0];
    const info = this.tkInfo(tkX);
    const recKey = this.tradeFor(tkX);
    const recT = X.TECH[recKey];
    const tkTech = info.t ? X.TECH[info.t.tech] : null;
    const badge = {
      open: ['Unassigned', 'transparent', 'var(--tx2)', 'var(--line2)'],
      progress: ['In progress', 'transparent', 'var(--tx)', 'var(--acc)'],
      overdue: ['Overdue', 'var(--crit)', 'var(--tagTx)', 'var(--crit)'],
      resolved: ['Resolved', 'var(--ok)', 'var(--tagTx)', 'var(--ok)']
    }[info.status];

    const allLog = s.logExtra.concat(X.LOG);
    const hashes = [];
    for (let i = allLog.length - 1; i >= 0; i--) {
      const e = allLog[i];
      const prev = i === allLog.length - 1 ? '00000000' : hashes[i + 1];
      hashes[i] = this.hash(prev + e.day + e.t + e.type + e.text + e.source);
    }
    const maxDay = { today: 0, week: 7, all: 999 }[s.logDate];
    const filtered = allLog.map((e, i) => Object.assign({ i }, e)).filter((e) =>
      (X.DAYS[e.day] || 0) <= maxDay &&
      (s.logAsset === 'all' || e.asset === s.logAsset) &&
      (s.logType === 'all' || e.type === s.logType || (s.logType === 'alert' && e.type === 'offline')));
    const groups = [];
    filtered.forEach((e) => {
      let g = groups[groups.length - 1];
      if (!g || g.day !== e.day) { g = { day: e.day, rows: [] }; groups.push(g); }
      const T = X.TYPES[e.type];
      g.rows.push({ t: e.t, text: e.text, source: e.source, typeName: T.name, icon: T.icon, color: T.color, hash: hashes[e.i], prev: hashes[e.i + 1] || '00000000' });
    });
    const assetsInLog = [];
    allLog.forEach((e) => { if (assetsInLog.indexOf(e.asset) < 0) assetsInLog.push(e.asset); });
    const dateOpts = [['today', 'Today'], ['week', '7 days'], ['all', 'All']];
    const typeOpts = [['all', 'All events'], ['alert', 'Alerts'], ['ticket', 'Tickets'], ['assign', 'Assigned'], ['escalation', 'Escalations'], ['resolved', 'Resolved']];

    const planL = D.LV.l1.rooms.concat([{ x: 12, y: 14, w: 276, h: 372 }]);
    const bpPlanD = D.LV.l1.rooms.map((r) => 'M' + r.x + ' ' + r.y + 'h' + r.w + 'v' + r.h + 'h-' + r.w + 'Z').join('') + 'M12 180H288';
    const bpPlanLen = planL.reduce((t, r) => t + 2 * (r.w + r.h), 0);
    const stages = ['Finding walls and rooms', 'Reading room labels', 'Building the 3D model', 'Placing paired sensors'];
    const bi = Math.min(3, Math.floor(s.bpP * 4));
    const bpSteps = stages.map((text, i) => {
      const done = s.bpP >= 1 || i < bi, on = !done && i === bi;
      return { text, fg: on ? 'var(--tx)' : 'var(--tx2)', weight: on ? '600' : '400', dotBorder: done ? 'var(--ok)' : on ? 'var(--acc)' : 'var(--line2)', dotBg: done ? 'var(--ok)' : on ? 'var(--acc)' : 'transparent' };
    });

    const yaw = s.yaw, pitch = s.pitch;
    const B = (x, y, w, h, z0, z1) => this.box(x, y, w, h, z0, z1, yaw, pitch);
    const P = (x, y, z) => this.proj(x, y, z, yaw, pitch);
    const m3Ground = this.poly([P(12, 14, 0), P(288, 14, 0), P(288, 386, 0), P(12, 386, 0)]);
    let m3Walls = '';
    D.LV.l1.rooms.forEach((r) => { m3Walls += B(r.x, r.y, r.w, r.h, 0, 26); });
    D.list.filter((x) => x.level === 'l1').forEach((x) => { m3Walls += B(x.box[0], x.box[1], x.box[2], x.box[3], 0, 12); });
    const RZ = 78;
    const m3Slab = B(12, 14, 276, 372, RZ - 4, RZ);
    let m3Roof = '';
    D.list.filter((x) => x.level === 'roof').forEach((x) => { m3Roof += B(x.box[0], x.box[1], x.box[2], x.box[3], RZ, RZ + (x.box[2] > 40 ? 16 : 9)); });
    const pinList = D.list.filter((x) => x.level === 'l1' || x.level === 'roof');
    const m3Pins = pinList.map((x, i) => {
      const p = Math.max(0, Math.min(1, s.pinP * 1.8 - i * 0.04));
      const z0 = x.level === 'roof' ? RZ + 9 : 12;
      const b = P(x.cx, x.cy, z0), h = P(x.cx, x.cy, z0 + 34 * p);
      return { x: b[0].toFixed(1), y: h[1].toFixed(1), hy: h[1].toFixed(1), len: Math.max(0, b[1] - h[1]).toFixed(1), op: p > 0 ? 1 : 0, color: x.problem ? 'var(--watch)' : 'var(--acc)' };
    });
    const pinsShown = m3Pins.filter((p) => p.op > 0).length;

    const onMap = scr === 'map';
    const launchTop = onMap ? (s.walking ? '210px' : '176px') : 'auto';
    const launchBottom = onMap ? 'auto' : '18px';
    const cy = s.chatY;
    const msgs = s.chatMsgs.map((m) => m.from === 'me'
      ? { text: m.text, justify: 'flex-end', bg: 'var(--acc)', fg: 'var(--accTx)', border: 'var(--acc)', radius: '12px 12px 3px 12px' }
      : { text: m.text, justify: 'flex-start', bg: 'var(--bg)', fg: 'var(--tx)', border: 'var(--line)', radius: '12px 12px 12px 3px' });
    const sugg = ['What does the health range mean?', 'How do I assign a technician?', 'Why is a ticket overdue?', 'How do I add a new building?'];

    return {
      railTop: 72 + ({ overview: 0, bp: 0, map: 1, sensors: 2, log: 3 }[scr] || 0) * 62,
      railOverviewFg: scr === 'overview' || scr === 'bp' ? 'var(--tx)' : '', railLogFg: scr === 'log' ? 'var(--tx)' : '',
      navLog: () => { if (s.detOpen) this.closeDetail(); this.go('log'); },
      isLog: scr === 'log', isBpCamera: scr === 'bp' && s.bpStage === 'camera', isBpProcessing: scr === 'bp' && s.bpStage === 'processing', isBpModel: scr === 'bp' && s.bpStage === 'model',

      openBlueprint: () => this.openBlueprint(),
      flaggedN: Math.round(open.length * s.intro), flaggedLine,
      catChips, attnRows, attnCount: attnList.length,
      attnOpen: s.attnOpen, attnOpenStr: String(s.attnOpen), attnRot: s.attnOpen ? 180 : 0, toggleAttn: () => this.setState({ attnOpen: !s.attnOpen }),
      attnHasMore: attnList.length > 3, attnMoreLabel: s.attnAll ? 'Show fewer' : 'Show ' + (attnList.length - 3) + ' more', attnAllRot: s.attnAll ? 180 : 0,
      toggleAttnAll: () => this.setState({ attnAll: !s.attnAll }), attnEmpty: attnList.length === 0,
      healthyOpen: s.healthyOpen, healthyOpenStr: String(s.healthyOpen), healthyRot: s.healthyOpen ? 180 : 0, toggleHealthy: () => this.setState({ healthyOpen: !s.healthyOpen }),
      healthyCount: healthy.length,
      healthyRows: healthy.map((x) => ({ zone: x.zone, level: x.levelName, val: x.valStr, icon: x.icon, open: () => this.openDetail(x.id) })),
      resolvedOpen: s.resolvedOpen, resolvedOpenStr: String(s.resolvedOpen), resolvedRot: s.resolvedOpen ? 180 : 0, toggleResolved: () => this.setState({ resolvedOpen: !s.resolvedOpen }),
      resolvedCount: s.resolved.length, resolvedRows: s.resolved,

      tkShow: tkX.problem || tkX.off || !!s.tickets[tkX.id],
      tk: {
        id: info.id, statusLabel: badge[0], badgeBg: badge[1], badgeFg: badge[2], badgeBorder: badge[3],
        techName: tkTech ? tkTech.name : '', initials: tkTech ? tkTech.initials : '', trade: tkTech ? tkTech.trade : '',
        rule: info.P.rule, resolvedWhen: info.t && info.t.when ? info.t.when : ''
      },
      tkOpen: info.status === 'open', tkActive: info.status === 'progress' || info.status === 'overdue', tkDone: info.status === 'resolved',
      tkSteps: info.status === 'progress' || info.status === 'overdue' ? this.tkSteps(info) : [],
      rec: Object.assign({}, recT, { assign: () => this.assign(tkX, recKey) }),
      others: Object.keys(X.TECH).filter((k) => k !== recKey).map((k) => Object.assign({}, X.TECH[k], { assign: () => this.assign(tkX, k) })),
      othersOpen: s.othersOpen, othersOpenStr: String(s.othersOpen), othersRot: s.othersOpen ? 180 : 0, toggleOthers: () => this.setState({ othersOpen: !s.othersOpen }),
      resolveDet: () => this.resolve(tkX),

      logDates: dateOpts.map(([k, name]) => ({ name, pressed: String(s.logDate === k), fg: s.logDate === k ? 'var(--tx)' : '', pick: () => this.setState({ logDate: k }) })),
      logDateThumb: dateOpts.findIndex((o) => o[0] === s.logDate) * 100,
      logTypes: typeOpts.map(([k, name]) => ({ name, pressed: String(s.logType === k), border: s.logType === k ? 'var(--acc)' : '', bg: s.logType === k ? 'var(--panel2)' : '', fg: s.logType === k ? 'var(--tx)' : '', pick: () => this.setState({ logType: k }) })),
      logAsset: s.logAsset, logAssetOpts: [{ value: 'all', label: 'All assets' }].concat(assetsInLog.map((a) => ({ value: a, label: a }))),
      pickLogAsset: (e) => this.setState({ logAsset: e && e.target ? e.target.value : 'all' }),
      logGroups: groups, logEmpty: groups.length === 0,

      bpPlanD, bpPlanLen: bpPlanLen.toFixed(0), bpDashOff: (bpPlanLen * (1 - s.bpP)).toFixed(0),
      bpFrameW: s.bpEdges ? 218 : 262, bpFrameH: s.bpEdges ? 294 : 360, bpFrameRot: s.bpEdges ? -3 : 0,
      bpFrameColor: s.bpEdges ? 'var(--ok)' : 'var(--tx2)', bpEdgeDot: s.bpEdges ? 'var(--ok)' : 'var(--watch)',
      bpEdgeText: s.bpEdges ? 'Edges found, ready to capture' : 'Looking for page edges',
      bpCapture: () => this.bpCapture(),
      bpPct: Math.round(s.bpP * 100), bpStageText: s.bpP >= 1 ? 'Done' : stages[bi], bpSteps,
      m3Ground, m3Walls, m3Slab, m3Roof, m3Pins, bpPinsShown: pinsShown, bpPinsTotal: pinList.length,
      bpCursor: this.drag ? 'grabbing' : 'grab',
      bpDown: (e) => { delete this.tweens.yaw; this.drag = { x: e.clientX, y: e.clientY, yaw: s.yaw, pitch: s.pitch }; if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} } this.forceUpdate(); },
      bpMove: (e) => { if (!this.drag) return; this.setState({ yaw: this.drag.yaw + (e.clientX - this.drag.x) * 0.5, pitch: Math.max(30, Math.min(74, this.drag.pitch - (e.clientY - this.drag.y) * 0.3)) }); },
      bpUp: () => { if (this.drag) { this.drag = null; this.forceUpdate(); } },
      bpResetView: () => { this.tween('yaw', s.yaw, 28, 700, 0, this.easeOut); this.tween('pitch', s.pitch, 56, 700, 0, this.easeOut); },
      bpRescan: () => this.openBlueprint(),
      bpFinish: () => { this.addLog('ticket', 'Site added from a blueprint scan: Harbor St. Depot', 'You', 'Site'); this.go('overview'); this.toast('Harbor St. Depot added to your sites'); },

      launchTop, launchBottom, openChat: () => this.openChat(), closeChat: () => this.closeChat(),
      chatOverlayOp: (Math.max(0, Math.min(1, 1 - cy)) * 0.5).toFixed(3), chatOverlayPE: s.chatOpen ? 'auto' : 'none',
      chatPx: (cy * 640).toFixed(1), chatVis: s.chatOpen || cy < 0.999 ? 'visible' : 'hidden',
      chatMsgs: msgs, chatTyping: s.chatTyping, chatShowSugg: s.chatMsgs.length < 3 && !s.chatTyping,
      chatSugg: sugg.map((t) => ({ text: t, ask: () => this.ask(t) })),
      chatDraft: s.chatDraft, chatInput: (e) => this.setState({ chatDraft: e && e.target ? e.target.value : '' }),
      sendChat: (e) => { if (e && e.preventDefault) e.preventDefault(); this.ask(s.chatDraft); }
    };
  }

  baseVals() {
    const D = this.data();
    const s = this.state;
    const K = 318 / 300;
    const scr = s.screen;
    const themeClass = { 'Turtle': 'ns-th-turtle', 'Harbor': 'ns-th-harbor', 'Dusk': 'ns-th-dusk' }[this.props.theme] || 'ns-th-turtle';
    const idx = { overview: 0, map: 1, sensors: 2 }[scr] || 0;
    const problems = D.list.filter((x) => x.problem).sort((a, b) => (a.st === b.st ? a.age - b.age : a.st === 'crit' ? -1 : 1));
    const crit = problems.filter((x) => x.st === 'crit').length;
    const offN = D.list.filter((x) => x.off).length;
    const lowN = D.list.filter((x) => x.low).length;
    const hwSummary = offN + ' offline · ' + lowN + ' low battery';

    const levelCards = D.LEVELS.map((lk) => {
      const ps = problems.filter((x) => x.level === lk);
      return {
        name: D.LV[lk].name, count: ps.length, aria: D.LV[lk].name + ', ' + ps.length + ' open problems',
        pips: ps.map((x) => ({ color: x.color })),
        open: () => this.go('map', { level: lk, selId: null, arrived: false })
      };
    });
    const catRaw = {};
    D.CATS.forEach((ck) => { catRaw[ck] = this.rangeOf(D.list.filter((x) => x.cat === ck)); });
    const totRaw = { lo: 0, hi: 0 };
    D.CATS.forEach((ck) => { totRaw.lo += catRaw[ck].lo / D.CATS.length; totRaw.hi += catRaw[ck].hi / D.CATS.length; });
    const tot = this.roundR(totRaw);
    const width = tot.hi - tot.lo;
    const confLabel = width <= 15 ? 'High' : width <= 30 ? 'Medium' : 'Low';
    const mid = (tot.lo + tot.hi) / 2;
    const hWord = mid >= 80 ? 'Good overall' : mid >= 60 ? (crit ? 'Fair, with a few urgent spots' : 'Fair') : 'Needs work soon';
    const ip = s.intro;
    const bandW = width * ip, bandL = mid - bandW / 2;
    const catTabs = D.CATS.map((ck) => {
      const on = s.cat === ck;
      const ps = problems.filter((x) => x.cat === ck);
      return {
        name: D.CAT[ck].name, icon: D.CAT[ck].icon, count: ps.length, range: this.roundR(catRaw[ck]).text, selected: String(on),
        border: on ? 'var(--acc)' : '', bg: on ? 'var(--panel2)' : '', fg: on ? 'var(--tx)' : 'var(--tx2)', iconColor: on ? 'var(--acc)' : 'var(--tx2)',
        badgeBg: ps.some((x) => x.st === 'crit') ? 'var(--crit)' : ps.length ? 'var(--watch)' : 'var(--line2)',
        pick: () => { if (s.cat !== ck) this.setState({ cat: ck, catFlip: !s.catFlip }); }
      };
    });
    const catAll = D.list.filter((x) => x.cat === s.cat);
    const catProblems = catAll.filter((x) => x.problem || x.off).sort((a, b) => {
      const r = { crit: 0, watch: 1, off: 2 };
      return r[a.st] === r[b.st] ? a.age - b.age : r[a.st] - r[b.st];
    });
    const cCrit = catProblems.filter((x) => x.st === 'crit').length, cWatch = catProblems.filter((x) => x.st === 'watch').length, cOff = catProblems.filter((x) => x.st === 'off').length;
    let catSummary;
    if (cCrit) catSummary = cCrit + (cCrit > 1 ? ' problems need' : ' problem needs') + ' attention now' + (cWatch ? ' and ' + cWatch + ' should be checked soon' : '') + '. Start with ' + catProblems[0].zone + '.';
    else if (cWatch) catSummary = 'Nothing urgent. ' + cWatch + (cWatch > 1 ? ' items' : ' item') + ' should be checked soon, starting with ' + catProblems[0].zone + '.';
    else catSummary = 'Everything in this category is reading normally.';
    if (cOff) catSummary += ' ' + cOff + (cOff > 1 ? ' sensors are' : ' sensor is') + " offline, so part of this area isn't being watched.";
    const probRows = catProblems.map((x) => ({
      headline: x.plain.h, urgency: x.plain.urg,
      zone: x.zone, tag: x.tag, color: x.color, icon: x.icon, level: x.levelName, kindName: x.k.name, val: x.valStr, since: x.since,
      flagClass: x.fresh && s.introDone && !s.pulseDone ? 'ns-flag' : '',
      aria: x.zone + ', ' + x.tag + ', ' + x.k.name + ' ' + x.valStr,
      locAria: 'Walk to ' + x.zone,
      open: () => this.openDetail(x.id),
      locate: () => this.locate(x.id)
    }));

    const sel = s.selId ? this.byId(s.selId) : null;
    const lv = D.LV[s.level];
    const route = s.walking && s.walkRoute ? s.walkRoute : (sel && !s.arrived ? this.routeFor(s.origin, sel) : null);
    let walkedD = 'M0 0', routeD = 'M0 0', you = null, youRot = 0, cur = null;
    if (route && sel && sel.level === s.level) {
      if (s.walking) {
        cur = this.pointAt(route, s.walkP);
        const done = route.pts.slice(0, cur.seg + 1).concat([{ x: cur.x, y: cur.y }]);
        const rest = [{ x: cur.x, y: cur.y }].concat(route.pts.slice(cur.seg + 1));
        walkedD = this.pathD(done); routeD = this.pathD(rest);
        you = cur; youRot = cur.ang;
      } else {
        routeD = this.pathD(route.pts);
      }
    }
    if (!you && s.origin.level === s.level) {
      you = { x: s.origin.x, y: s.origin.y };
      youRot = route && route.segs.length && !route.pre ? Math.atan2(route.segs[0].dx, -route.segs[0].dy) * 180 / Math.PI : 0;
    }
    if (!you && route && route.pre && sel && sel.level === s.level) { you = route.pts[0]; youRot = Math.atan2(route.segs[0].dx, -route.segs[0].dy) * 180 / Math.PI; }

    let z = 1, fx = 150, fy = 200, cx = 159, cy = 228, animated = true;
    if (s.walking && cur) { z = 2.1; fx = cur.x; fy = cur.y; cx = 159; cy = 300; animated = s.walkP < 0.002; }
    else if (sel && sel.level === s.level && s.arrived) { z = 2.1; fx = sel.cx; fy = sel.cy; cx = 159; cy = 250; }
    else if (sel && sel.level === s.level) { z = 1.6; fx = sel.cx; fy = sel.cy; cx = 159; cy = 190; }
    let panX = 0, panY = 6;
    if (z !== 1) { panX = cx - fx * K * z; panY = cy - fy * K * z; }

    const lanesD = lv.lanes.map((y) => 'M20 ' + y + 'H280').join('') + (you && !s.walking ? '' : '');
    const rooms = lv.rooms.map((r) => ({ l: (r.x * K).toFixed(1), t: (r.y * K).toFixed(1), w: (r.w * K).toFixed(1), h: (r.h * K).toFixed(1), label: r.label }));
    const equip = D.list.filter((x) => x.level === s.level).map((x) => ({
      l: (x.box[0] * K).toFixed(1), t: (x.box[1] * K).toFixed(1), w: (x.box[2] * K).toFixed(1), h: (x.box[3] * K).toFixed(1),
      short: x.short, fs: x.box[2] < 22 ? 9 : 11, color: x.color,
      tip: x.zone + ' · ' + x.valStr,
      cls: 'ns-btn ns-eq' + (s.selId === x.id ? ' ns-eq-sel' : ''),
      dotCls: 'ns-sdot' + (x.st === 'crit' ? ' ns-ping' : '') + (s.blinkId === x.id ? ' ns-blink' : ''),
      pick: () => this.select(x.id)
    }));

    const levelTabs = D.LEVELS.map((lk, i) => {
      const n = problems.filter((x) => x.level === lk).length;
      return {
        name: D.LV[lk].name, count: n, pressed: String(s.level === lk),
        fg: s.level === lk ? 'var(--tx)' : '', badgeBg: n ? (problems.some((x) => x.level === lk && x.st === 'crit') ? 'var(--crit)' : 'var(--watch)') : 'var(--line2)',
        pick: () => { if (!s.walking) this.setState({ level: lk, selId: null, arrived: false }); }
      };
    });
    const lvlIdx = D.LEVELS.indexOf(s.level);

    const idleList = problems.filter((x) => x.level === s.level).map((x) => ({ x, r: this.routeFor(s.origin, x) }))
      .sort((a, b) => a.r.meters - b.r.meters).slice(0, 3)
      .map(({ x, r }) => ({ zone: x.zone, kindName: x.k.name, val: x.valStr, color: x.color, dist: r.meters, aria: x.zone + ', ' + r.meters + ' meters', pick: () => this.select(x.id) }));

    const selV = sel ? {
      zone: sel.zone, tag: sel.tag, color: sel.color, id: sel.id, dev: sel.k.dev, mount: sel.mount, note: sel.note,
      valNum: sel.valNum, unit: sel.k.unit, base: sel.fmt(sel.base), headline: sel.plain.h, firstStep: sel.plain.todo[0].charAt(0).toLowerCase() + sel.plain.todo[0].slice(1),
      sinceLabel: sel.since ? (sel.off ? 'since ' + sel.since : 'flagged ' + sel.since + ' ago') : 'reporting normally'
    } : { zone: '', tag: '', color: '', id: '', dev: '', mount: '', note: '', valNum: '', unit: '', base: '', sinceLabel: '', headline: '', firstStep: '' };
    const selRoute = sel && !s.arrived ? this.routeFor(s.origin, sel) : null;

    let walkSteps = [], walkRemain = 0, bannerText = '', bannerSub = '', bannerDist = 0, arrowRot = 0;
    if (s.walking && s.walkRoute && cur) {
      const r = s.walkRoute;
      walkRemain = Math.max(0, Math.round(r.units * (1 - s.walkP) * 0.2));
      const curStepIdx = r.steps.findIndex((st) => st.seg === cur.seg);
      walkSteps = r.steps.map((st, i) => {
        const done = i < curStepIdx || (st.seg == null && i < curStepIdx);
        const on = i === curStepIdx;
        return { text: st.text, dist: st.m ? st.m + ' m' : '', fg: on ? 'var(--tx)' : 'var(--tx2)', weight: on ? '600' : '400', dotBorder: on ? 'var(--acc)' : done ? 'var(--ok)' : 'var(--line2)', dotBg: on ? 'var(--acc)' : done ? 'var(--ok)' : 'transparent' };
      });
      const g = r.segs[cur.seg];
      bannerDist = Math.max(0, Math.round(cur.segLeft * 0.2));
      const nx = r.segs[cur.seg + 1];
      if (nx) {
        const cross = g.dx * nx.dy - g.dy * nx.dx;
        bannerText = 'Then turn ' + (cross > 0 ? 'right' : 'left');
      } else bannerText = sel.zone + ' ahead';
      bannerText = 'Head ' + this.dirName(g.dx, g.dy) + (nx ? ', then ' + (((g.dx * nx.dy - g.dy * nx.dx) > 0) ? 'right' : 'left') : '');
      bannerSub = nx ? 'Next turn in ' + bannerDist + ' m' : sel.zone + ' in ' + bannerDist + ' m';
      arrowRot = cur.ang;
    }

    const nx = s.arrived && sel ? this.nextFor(s.origin) : null;

    const FS = D.list;
    const fKey = s.sensFilter;
    const fl = FS.filter((x) => fKey === 'all' || (fKey === 'problems' && x.problem) || (fKey === 'hardware' && (x.off || x.low)));
    const sensGroups = D.LEVELS.map((lk) => {
      const rows = fl.filter((x) => x.level === lk).map((x) => ({
        zone: x.zone, id: x.id, icon: x.icon, color: x.color, val: x.off ? 'offline' : x.valStr,
        valColor: x.st === 'ok' ? 'var(--tx)' : x.st === 'off' ? 'var(--tx2)' : x.color,
        hw: x.off ? 'no signal' : x.low ? 'battery ' + x.batt + '% · replace' : 'battery ' + x.batt + '%',
        aria: x.zone + ' ' + x.id + ', ' + (x.off ? 'offline' : x.valStr),
        locAria: 'Show ' + x.zone + ' on the map',
        open: () => this.openDetail(x.id), locate: () => this.locate(x.id)
      }));
      return { name: D.LV[lk].name, count: rows.length, rows };
    }).filter((g) => g.rows.length);
    const fTabs = [['all', 'All', FS.length], ['problems', 'Problems', problems.length], ['hardware', 'Hardware', offN + lowN]];
    const filterTabs = fTabs.map(([k, name, n]) => ({ name, count: n, pressed: String(fKey === k), fg: fKey === k ? 'var(--tx)' : '', pick: () => this.setState({ sensFilter: k }) }));
    const fIdx = fTabs.findIndex((t) => t[0] === fKey);

    const d = this.byId(s.detId) || D.list[0];
    const k = d.k;
    const span = k.hi - k.lo;
    const pct = (v) => Math.max(0, Math.min(100, ((v - k.lo) / span) * 100));
    const gaugeSegs = k.up
      ? [{ grow: k.w - k.lo, color: 'var(--ok)' }, { grow: k.c - k.w, color: 'var(--watch)' }, { grow: k.hi - k.c, color: 'var(--crit)' }]
      : [{ grow: k.c - k.lo, color: 'var(--crit)' }, { grow: k.w - k.c, color: 'var(--watch)' }, { grow: k.hi - k.w, color: 'var(--ok)' }];
    const tmn = Math.min(...d.trend, d.base), tmx = Math.max(...d.trend, d.base);
    const tr = Math.max((tmx - tmn) * 1.15, span * 0.08), tmid = (tmx + tmn) / 2;
    const ty = (v) => 35 - ((v - tmid) / tr) * 60;
    const trendD = d.trend.map((v, i) => (i ? 'L' : 'M') + ((i / 11) * 318).toFixed(1) + ' ' + ty(v).toFixed(1)).join('');
    const curV = d.base + (d.v - d.base) * s.detP;
    const dV = {
      zone: d.zone, level: d.levelName, id: d.id, tag: d.tag, color: d.color, dev: d.k.dev, mount: d.mount, kindName: k.name, unit: k.unit,
      base: d.fmt(d.base), lo: d.fmt(k.lo), hi: d.fmt(k.hi), note: d.note,
      catName: D.CAT[d.cat].name, headline: d.plain.h, urgency: d.plain.urg, who: d.plain.who, what: d.plain.what, why: d.plain.why,
      sinceLabel: d.since ? (d.off ? 'since ' + d.since : 'flagged ' + d.since + ' ago') : 'reporting normally',
      batt: d.off ? '--' : d.batt + '%', battColor: d.low ? 'var(--watch)' : 'var(--tx)',
      signal: d.off ? 'None' : d.batt > 70 ? 'Strong' : 'Good', last: d.off ? d.since : (d.age && d.age < 10 ? 'just now' : '1 min ago')
    };

    const px = s.panelX;
    const blinkingSel = sel && s.blinkId === sel.id;
    const logged = sel && s.logged[sel.id];

    return {
      themeClass,
      railTop: 72 + idx * 62,
      railOverviewFg: idx === 0 ? 'var(--tx)' : '', railMapFg: idx === 1 ? 'var(--tx)' : '', railSensorsFg: idx === 2 ? 'var(--tx)' : '',
      navOverview: () => { if (s.detOpen) this.closeDetail(); this.go('overview'); },
      navMap: () => { if (s.detOpen) this.closeDetail(); this.go('map'); },
      navSensors: () => { if (s.detOpen) this.closeDetail(); this.go('sensors'); },
      isOverview: scr === 'overview', isMap: scr === 'map', isSensors: scr === 'sensors',

      sensTotal: D.list.length, hwSummary,
      statLive: Math.round((D.list.length - offN) * s.intro), statProblems: Math.round(problems.length * s.intro), statCrit: Math.round(crit * s.intro),
      levelCards, problems: probRows,
      hLo: Math.round(tot.lo * ip), hHi: Math.round(tot.hi * ip), hWord, confLabel, bandL: bandL.toFixed(1), bandW: bandW.toFixed(1),
      healthInfo: s.healthInfo, healthInfoOpen: String(s.healthInfo), infoRot: s.healthInfo ? 180 : 0,
      toggleHealthInfo: () => this.setState({ healthInfo: !s.healthInfo }),
      reportingN: D.list.filter((x) => !x.off).length,
      catRanges: D.CATS.map((ck) => ({ name: D.CAT[ck].name, range: this.roundR(catRaw[ck]).text })),
      catTabs, catName: (D.CAT[s.cat] || D.CAT.water).name, catCovers: (D.CAT[s.cat] || D.CAT.water).covers, catRange: this.roundR(catRaw[s.cat] || catRaw.water).text, catSummary,
      catEmpty: catProblems.length === 0, catPanelCls: s.catFlip ? 'ns-enterB' : 'ns-enterA',

      levelTabs, lvlThumb: lvlIdx * 100,
      panClass: animated ? 'ns-pan' : '', panX: panX.toFixed(1), panY: panY.toFixed(1), panZ: z,
      rooms, equip, lanesD, walkedD, routeD,
      showYou: !!you, youX: you ? (you.x * K).toFixed(1) : 0, youY: you ? (you.y * K).toFixed(1) : 0, youRot: youRot.toFixed(0),
      compassTop: s.walking ? 96 : 12,
      walking: s.walking, bannerText, bannerSub, bannerDist, arrowRot: arrowRot.toFixed(0),

      sheetIdle: !sel, sheetSelected: !!sel && !s.walking && !s.arrived, sheetWalking: !!sel && s.walking, sheetArrived: !!sel && s.arrived && !s.walking,
      idleTitle: 'Open on ' + (s.level === 'roof' ? 'the roof' : lv.name) + ' · ' + problems.filter((x) => x.level === s.level).length,
      idleList, idleEmpty: idleList.length === 0,
      sel: selV,
      routeFirst: selRoute ? (selRoute.pre ? selRoute.pre + ', then ' + selRoute.steps[1].text.toLowerCase() : selRoute.steps[0].text + ' from ' + s.origin.name) : '',
      routeM: selRoute ? selRoute.meters : 0, routeEta: selRoute ? this.eta(selRoute.meters) : '',
      startWalk: () => this.startWalk(),
      openSelDetail: () => sel && this.openDetail(sel.id),
      blinkSel: () => sel && this.blink(sel.id),
      blinkFg: blinkingSel ? 'var(--acc)' : '', blinkLabel: blinkingSel ? 'Blinking' : 'Blink LED',
      clearSel: () => this.clearSel(),
      walkSteps, walkRemain, walkEta: this.eta(walkRemain),
      endWalk: () => this.endWalk(),
      logSel: () => { if (sel && !logged) { this.setState({ logged: Object.assign({}, s.logged, { [sel.id]: true }) }); this.toast('Finding logged for ' + sel.zone); } },
      logLabel: logged ? 'Logged' : 'Log finding', logFg: logged ? 'var(--ok)' : '',
      logIcon: logged ? 'M5 12.5l4.5 4.5L19 7.5' : 'M5 4h10l4 4v12H5zM9 12h6M9 16h4',
      hasNext: !!nx, nextZone: nx ? nx.s.zone : '', nextDist: nx ? nx.r.meters : 0,
      goNext: () => { if (nx) { this.setState({ selId: nx.s.id, arrived: false, level: nx.s.level }); this.after(60, () => this.startWalk()); } },

      filterTabs, fThumb: fIdx * 100, sensGroups,

      overlayOp: (Math.max(0, Math.min(1, 1 - px)) * 0.55).toFixed(3), overlayPE: s.detOpen ? 'auto' : 'none',
      panelPx: (px * 390).toFixed(1), panelVis: (s.detOpen || px < 0.999) ? 'visible' : 'hidden',
      closeDetail: () => this.closeDetail(),
      dTodo: d.plain.todo.map((t, i) => ({ n: i + 1, text: t })),
      d: dV, dValAnim: d.off ? '--' : d.fmt(curV),
      gaugeSegs, gaugeBase: pct(d.base).toFixed(1), gaugeMark: pct(curV).toFixed(1), gaugeShow: !d.off,
      trendD, trendBaseD: 'M0 ' + ty(d.base).toFixed(1) + 'H318', trendCls: s.detP < 1 ? 'ns-draw' : '',
      walkFromDetail: () => { const id = d.id; this.closeDetail(); this.locate(id); this.after(500, () => this.startWalk()); },
      blinkDet: () => this.blink(d.id), blinkDetLabel: s.blinkId === d.id ? 'Blinking' : 'Blink LED', blinkDetFg: s.blinkId === d.id ? 'var(--acc)' : '',
      repairDet: () => { if (!s.repair[d.id]) { this.setState({ repair: Object.assign({}, s.repair, { [d.id]: true }) }); this.toast('Repair requested for ' + d.zone); } },
      repairLabel: s.repair[d.id] ? 'Repair requested' : 'Schedule repair', repairFg: s.repair[d.id] ? 'var(--ok)' : '',

      toastText: s.toastText, toastY: s.toastOn ? 0 : -80, toastOp: s.toastOn ? 1 : 0
    };
  }

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

  skipToDashboard() { this.setState({ onboarded: true }); this.go('overview'); }

  render() {
    const v = this.renderVals();
    // Scan sits second in the rail, so the highlight for Map/Sensors/Log moves down one slot.
    const slot = { overview: 0, bp: 0, map: 1, sensors: 2, log: 3 }[this.state.screen] || 0;
    if (slot >= 1) v.railTop = Number(v.railTop) + 62;
    const onDashboard = !['intro', 'auth', 'diag'].includes(this.state.screen);
    v.tour = onDashboard ? (
      <Tour screen={this.state.screen} scanOpen={!!this.state.scanOpen}
        busy={this.state.detOpen || this.state.chatOpen || this.state.devOpen || this.state.pairOpen}
        onOpenScan={() => this.setState({ scanOpen: true })} />
    ) : null;
    v.openScan = () => this.setState({ scanOpen: true });
    v.railScanFg = this.state.scanOpen ? 'var(--tx)' : '';
    const det = this.byId(this.state.detId);
    v.infoCard = det ? <InfoCard key={det.id} entry={MEASUREMENTS[det.kind]} /> : null;
    v.scanPanel = this.state.scanOpen ? <ScanPanel onClose={() => this.setState({ scanOpen: false })} /> : null;
    return renderTemplate(v);
  }
}
