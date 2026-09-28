// Generated from infrasensor/source/Main.dc.html by dc2jsx.py. Edit the markup here directly.
import { Fragment } from 'react';
import { css } from './css';

export default function renderTemplate(v) {
  return (<>
<div className={v.themeClass} style={css("width: 390px; height: 844px; position: relative; overflow: hidden; display: flex; background: var(--bg); color: var(--tx); font-family: 'Manrope', system-ui, sans-serif; -webkit-font-smoothing: antialiased")}>
  <nav aria-label="Primary" style={css("width: 72px; flex-shrink: 0; position: relative; box-sizing: border-box; padding: 14px 6px 14px 10px; display: flex; z-index: 3")}>
    <div style={css("position: relative; width: 56px; border-radius: 30px; background: var(--panel); box-shadow: var(--shadow); display: flex; flex-direction: column; align-items: center; padding: 12px 0 16px; gap: 10px")}>
      <div aria-label="Infrasensor" style={css("width: 40px; height: 40px; border-radius: 50%; background: var(--mint); color: var(--tx); display: flex; align-items: center; justify-content: center; margin-bottom: 8px")}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 4.5c3.6 0 6.5 2.9 6.5 6.5 0 1.3-.4 2.5-1 3.5M12 4.5C8.4 4.5 5.5 7.4 5.5 11c0 1.3.4 2.5 1 3.5M9 18.5c.9.6 1.9 1 3 1s2.1-.4 3-1M12 9.5v3.5l2 1.5" style={css("stroke-width: 1.8px")}>
          </path>
        </svg>
      </div>
      <div className="ns-blob" style={css(`position: absolute; left: 6px; top: ${v.railTop}px; width: 44px; height: 52px; border-radius: 22px; background: var(--acc)`)}>
      </div>
      <button className="ns-btn ns-rail" aria-label="Site overview" onClick={v.navOverview} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railOverviewFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M4.5 12.5 12 5l7.5 7.5M7 10.5V19h10v-8.5M10.5 19v-4.5h3V19">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Site
        </span>
      </button>
      <button className="ns-btn ns-rail" aria-label="Upload scan" onClick={v.openScan} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railScanFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 15V4.5M7.5 9 12 4.5 16.5 9M5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Scan
        </span>
      </button>
      <button className="ns-btn ns-rail" aria-label="Site map" onClick={v.navMap} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railMapFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 20.5s6-5.4 6-10.5a6 6 0 0 0-12 0c0 5.1 6 10.5 6 10.5zM12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Map
        </span>
      </button>
      <button className="ns-btn ns-rail" aria-label="Sensors" onClick={v.navSensors} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railSensorsFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 12m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Sensors
        </span>
      </button>
      <button className="ns-btn ns-rail" aria-label="Activity log" onClick={v.navLog} style={css(`width: 44px; height: 52px; border-radius: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ${v.railLogFg}`)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path className="ns-ic" d="M12 7v5l3 2M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3h3">
          </path>
        </svg>
        <span style={css("font-size: 10px; line-height: 11px; font-weight: 700")}>
          Log
        </span>
      </button>
      <div style={css("flex-grow: 1")}>
      </div>
      <div style={css("display: flex; flex-direction: column; align-items: center; gap: 5px")}>
        <span style={css("position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--ok)")}>
        </span>
        <span style={css("font-size: 10px; font-weight: 600; color: var(--tx2)")}>
          Live
        </span>
      </div>
    </div>
  </nav>
  <main style={css("flex-grow: 1; min-width: 0; position: relative; display: flex; flex-direction: column")}>
    {v.isOverview ? (<>
      <div className={`ns-scroll ${v.scrAnim}`} style={css("flex-grow: 1; min-height: 0; padding-bottom: 100px")}>
        <header style={css("padding: 16px 16px 4px 4px; display: flex; align-items: center; gap: 8px")}>
          <div style={css("height: 38px; padding: 0 12px 0 5px; border-radius: 19px; background: var(--panel); display: flex; align-items: center; gap: 8px; min-width: 0")}>
            <span style={css("width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; background: var(--mint); color: var(--tx); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800")}>
              NA
            </span>
            <span style={css("display: flex; flex-direction: column; min-width: 0")}>
              <span style={css("font-size: 13px; line-height: 15px; font-weight: 700; white-space: nowrap")}>
                Northside Annex
              </span>
              <span style={css("display: flex; align-items: center; gap: 5px; font-size: 10px; line-height: 12px; color: var(--tx2); white-space: nowrap")}>
                <span style={css("width: 6px; height: 6px; border-radius: 50%; background: var(--ok)")}>
                </span>
                {v.sensTotal} sensors live
              </span>
            </span>
          </div>
          <span style={css("flex-grow: 1")}>
          </span>
          <button className="ns-btn ns-pri" onClick={v.openBlueprint} aria-label="Add a site from a blueprint" style={css("height: 38px; padding: 0 14px 0 11px; border-radius: 19px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; white-space: nowrap")}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path className="ns-ic" d="M12 5v14M5 12h14" style={css("stroke-width: 2.2px")}>
              </path>
            </svg>
            Add site
          </button>
        </header>
        {v.showKitCard ? (<>
          <div className="ns-rise" style={css("margin: 14px 16px 0 4px; padding: 12px 12px 14px 14px; border-radius: 30px 30px 30px 10px; background: var(--acc); color: var(--accTx)")}>
            <div style={css("display: flex; align-items: center; gap: 10px")}>
              <div style={css("width: 74px; height: 58px; flex-shrink: 0")}>
                <svg viewBox="0 0 300 220" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                  <path d="M40 116C30 60 90 22 158 26s112 44 104 104-62 84-126 80S50 170 40 116Z" style={css("fill: var(--mint); opacity: 0.6")}>
                  </path>
                  <path className="ns-ii" d="M30 58q18-12 38-6M252 60q14 2 22 14">
                  </path>
                  <g className="ns-il-float">
                    <circle className="ns-is" cx="118" cy="70" r="15" style={css("fill: var(--panel)")}>
                    </circle>
                    <circle cx="118" cy="70" r="5" style={css("fill: var(--acc)")}>
                    </circle>
                  </g>
                  <g className="ns-il-float" style={css("animation-delay: 0.5s")}>
                    <path className="ns-is" d="M156 34q12 16 0 26q-12-10 0-26z" style={css("fill: var(--acc)")}>
                    </path>
                  </g>
                  <g className="ns-il-float" style={css("animation-delay: 1s")}>
                    <rect className="ns-is" x="184" y="56" width="26" height="36" rx="7" style={css("fill: var(--slate)")}>
                    </rect>
                    <circle cx="197" cy="68" r="3.5" style={css("fill: var(--mint)")}>
                    </circle>
                  </g>
                  <path className="ns-is" d="M80 122l-22-26h66l22 26z" style={css("fill: var(--mint)")}>
                  </path>
                  <path className="ns-is" d="M224 122l22-26h-66l-22 26z" style={css("fill: var(--mint)")}>
                  </path>
                  <rect className="ns-is" x="80" y="122" width="144" height="80" rx="6" style={css("fill: var(--acc)")}>
                  </rect>
                  <rect className="ns-is" x="130" y="148" width="44" height="22" rx="7" style={css("fill: var(--panel)")}>
                  </rect>
                  <path className="ns-ii" d="M140 159h24" style={css("stroke-width: 2px")}>
                  </path>
                  <path className="ns-il-twinkle" d="M244 34l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={css("fill: var(--acc)")}>
                  </path>
                  <path className="ns-il-twinkle" d="M58 150l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" style={css("fill: var(--acc); animation-delay: 0.8s")}>
                  </path>
                </svg>
              </div>
              <div style={css("flex-grow: 1; min-width: 0")}>
                <div style={css("font-size: 15px; line-height: 19px; font-weight: 800")}>
                  Your starter kit is ready
                </div>
                <div style={css("font-size: 12px; line-height: 16px; margin-top: 2px")}>
                  About {v.kitTotal} sensors, sized for {v.kitShort}
                </div>
              </div>
              <button className="ns-btn" onClick={v.dismissKit} aria-label="Dismiss" style={css("align-self: flex-start; width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accTx)")}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path className="ns-ic" d="M6.5 6.5l11 11M17.5 6.5l-11 11" style={css("stroke-width: 2.2px")}>
                  </path>
                </svg>
              </button>
            </div>
            <div style={css("display: flex; gap: 8px; margin-top: 10px")}>
              <button className="ns-btn ns-tile" onClick={v.viewKit} style={css("flex-grow: 1; height: 38px; border-radius: 19px; background: var(--panel); color: var(--tx); font-size: 13px; font-weight: 800; text-align: center")}>
                View plan
              </button>
              <button className="ns-btn ns-tile" onClick={v.finishToPair} style={css("flex-grow: 1; height: 38px; border-radius: 19px; border: 1.5px solid var(--accTx); color: var(--accTx); font-size: 13px; font-weight: 800; text-align: center")}>
                Pair my sensors
              </button>
            </div>
          </div>
        </>) : null}
        <section aria-label="Decisions" style={css("padding: 18px 16px 0 6px; display: flex; align-items: flex-end; gap: 12px")}>
          <span className="ns-serif ns-pop" style={css("font-size: 92px; line-height: 76px; font-weight: 500; color: var(--tx)")}>
            {v.flaggedN}
          </span>
          <div style={css("padding-bottom: 4px; min-width: 0")}>
            <div className="ns-serif" style={css("font-size: 23px; line-height: 25px; font-style: italic; font-weight: 400")}>
              things need
              <br />
              your call
            </div>
            <div style={css("font-size: 12px; line-height: 16px; color: var(--tx2); margin-top: 6px")}>
              {v.flaggedLine}
            </div>
          </div>
        </section>
        <section aria-label="Building health estimate" className="ns-rise" style={css("margin: 18px 16px 0 4px; padding: 14px 14px 12px 12px; border-radius: 30px 30px 30px 12px; background: var(--panel); box-shadow: var(--shadow); animation-delay: 80ms")}>
          <div style={css("display: flex; align-items: center; gap: 12px")}>
            <svg viewBox="0 0 124 72" width="124" height="72" aria-hidden="true" style={css("flex-shrink: 0; overflow: visible")}>
              <path d="M10 64 A52 52 0 0 1 114 64" style={css("fill: none; stroke: var(--panel2); stroke-width: 12px; stroke-linecap: round")}>
              </path>
              <path d={v.arcTicks} style={css("fill: none; stroke: var(--line2); stroke-width: 1.5px; stroke-linecap: round")}>
              </path>
              <path d={v.arcBand} style={css("fill: none; stroke: var(--acc); stroke-width: 12px; stroke-linecap: round")}>
              </path>
              <text x="10" y="71" textAnchor="middle" style={css("fill: var(--tx2); font-family: Manrope, sans-serif; font-size: 8px")}>
                0
              </text>
              <text x="114" y="71" textAnchor="middle" style={css("fill: var(--tx2); font-family: Manrope, sans-serif; font-size: 8px")}>
                100
              </text>
            </svg>
            <div style={css("min-width: 0")}>
              <div style={css("font-size: 11px; font-weight: 600; color: var(--tx2)")}>
                Building health, estimated
              </div>
              <div style={css("display: flex; align-items: baseline; gap: 5px; margin-top: 2px")}>
                <span className="ns-serif" style={css("font-size: 34px; line-height: 36px; font-weight: 500")}>
                  {v.hLo}
                </span>
                <span className="ns-serif" style={css("font-size: 16px; font-style: italic; color: var(--tx2)")}>
                  to
                </span>
                <span className="ns-serif" style={css("font-size: 34px; line-height: 36px; font-weight: 500")}>
                  {v.hHi}
                </span>
              </div>
              <div style={css("font-size: 12px; line-height: 16px; color: var(--tx2)")}>
                {v.hWord}
              </div>
            </div>
          </div>
          <button className="ns-btn ns-chip" onClick={v.toggleHealthInfo} aria-expanded={v.healthInfoOpen} style={css("margin-top: 10px; height: 30px; padding: 0 10px 0 12px; border-radius: 15px; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600")}>
            <span style={css("width: 6px; height: 6px; border-radius: 50%; background: var(--watch)")}>
            </span>
            <span style={css("white-space: nowrap")}>
              {v.confLabel} confidence · how it works
            </span>
            <svg className="ns-arrow" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" style={css(`transform: rotate(${v.infoRot}deg)`)}>
              <path className="ns-ic" d="M6 9l6 6 6-6">
              </path>
            </svg>
          </button>
          {v.healthInfo ? (<>
            <div className="ns-enter" style={css("margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 13px; line-height: 19px")}>
              <p style={css("margin: 0")}>
                This is a range, not an exact score. It comes only from sensor readings, so use it to decide what to look at first. It is not a certified inspection.
              </p>
              <p style={css("margin: 0; color: var(--tx2)")}>
                Based on {v.reportingN} of {v.sensTotal} sensors reporting. The range widens when sensors are offline or readings disagree.
              </p>
              <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px")}>
                {(v.catRanges || []).map((r, r$i) => (<Fragment key={r$i}>
                  <span style={css("padding: 7px 10px; border-radius: 14px; background: var(--panel2); display: flex; flex-direction: column")}>
                    <span style={css("font-size: 11px; color: var(--tx2)")}>
                      {r.name}
                    </span>
                    <span className="ns-num" style={css("font-size: 14px; font-weight: 700")}>
                      {r.range}
                    </span>
                  </span>
                </Fragment>))}
              </div>
            </div>
          </>) : null}
        </section>
        <div role="tablist" aria-label="Filter by category" className="ns-scroll" style={css("display: flex; gap: 6px; overflow-x: auto; padding: 18px 16px 4px 4px")}>
          {(v.catChips || []).map((c, c$i) => (<Fragment key={c$i}>
            <button className="ns-btn ns-chip" role="tab" aria-selected={c.selected} onClick={c.pick} style={css(`flex-shrink: 0; height: 36px; padding: 0 13px; border-radius: 18px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; white-space: nowrap; border-color: ${c.border}; background: ${c.bg}; color: ${c.fg}`)}>
              {c.hasIcon ? (<>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path className="ns-ic" d={c.icon}>
                  </path>
                </svg>
              </>) : null}
              {c.name}
              <span className="ns-num" style={css(`min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; font-size: 11px; line-height: 18px; text-align: center; background: ${c.countBg}; color: ${c.countFg}`)}>
                {c.count}
              </span>
            </button>
          </Fragment>))}
        </div>
        <section data-tour="attention" style={css("margin-top: 10px")}>
          <div style={css("padding: 6px 16px 2px 6px; display: flex; align-items: center; gap: 10px")}>
            <h2 className="ns-serif" style={css("margin: 0; font-size: 24px; line-height: 28px; font-weight: 500")}>
              Needs attention
            </h2>
            <span className="ns-num" style={css("height: 22px; padding: 0 8px; border-radius: 11px; background: var(--crit); color: var(--tagTx); font-size: 12px; font-weight: 700; line-height: 22px")}>
              {v.attnCount}
            </span>
            <span style={css("flex-grow: 1")}>
            </span>
            <button className="ns-btn ns-gh" onClick={v.toggleAttn} aria-expanded={v.attnOpenStr} aria-label="Show or hide items that need attention" style={css("width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
              <svg className="ns-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={css(`transform: rotate(${v.attnRot}deg)`)}>
                <path className="ns-ic" d="M6 9l6 6 6-6">
                </path>
              </svg>
            </button>
          </div>
          {v.attnOpen ? (<>
            <div className={v.catPanelCls}>
              <div className="ns-snap" onScroll={v.onCarScroll} aria-label="Most urgent, swipe for more">
                {(v.ucards || []).map((u, u$i) => (<Fragment key={u$i}>
                  <article className="ns-ucard" style={css(`width: 256px; box-sizing: border-box; padding: 16px; border-radius: ${u.radius}; background: var(--panel); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 10px`)}>
                    <div style={css("display: flex; align-items: center; gap: 8px")}>
                      <span style={css(`position: relative; width: 38px; height: 38px; flex-shrink: 0; border-radius: 50%; background: ${u.color}; color: var(--tagTx); display: flex; align-items: center; justify-content: center`)}>
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                          <path className="ns-ic" d={u.icon} style={css("stroke-width: 1.9px")}>
                          </path>
                        </svg>
                        <span className={u.flagClass} style={css("position: absolute; inset: 0; border-radius: 50%")}>
                        </span>
                      </span>
                      <span style={css("display: flex; flex-direction: column; min-width: 0")}>
                        <span style={css(`font-size: 12px; font-weight: 700; color: ${u.color}`)}>
                          {u.urgency}
                        </span>
                        <span style={css("font-size: 11px; color: var(--tx2); white-space: nowrap")}>
                          {u.zone} · {u.since}
                        </span>
                      </span>
                      <span style={css("flex-grow: 1")}>
                      </span>
                      <span className="ns-num" style={css("font-size: 11px; font-weight: 700; color: var(--tx2)")}>
                        {u.pos}
                      </span>
                    </div>
                    <span className="ns-serif" style={css("font-size: 20px; line-height: 24px; font-weight: 500; min-height: 48px")}>
                      {u.headline}
                    </span>
                    <span style={css(`align-self: flex-start; height: 24px; padding: 0 10px; border-radius: 12px; display: flex; align-items: center; font-size: 11px; font-weight: 700; background: ${u.tkBg}; color: ${u.tkFg}`)}>
                      {u.tkLabel}
                    </span>
                    <div style={css("display: flex; align-items: center; gap: 8px; margin-top: 2px")}>
                      <button className="ns-btn ns-gh" onClick={u.open} style={css("flex-grow: 1; height: 42px; border-radius: 21px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 700")}>
                        Details
                        <svg className="ns-nudge" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                          <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
                          </path>
                        </svg>
                      </button>
                      <button className="ns-btn ns-loc" onClick={u.locate} aria-label={u.locAria} style={css("width: 42px; height: 42px; flex-shrink: 0; display: flex; align-items: center; justify-content: center")}>
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                          <path className="ns-ic" d="M4 11.5 20 4l-7.5 16-2-6.5z">
                          </path>
                        </svg>
                      </button>
                    </div>
                  </article>
                </Fragment>))}
              </div>
              <div aria-hidden="true" style={css("display: flex; justify-content: center; gap: 5px; padding-bottom: 4px")}>
                {(v.udots || []).map((d, d$i) => (<Fragment key={d$i}>
                  <span className="ns-pdot" style={css(`height: 6px; border-radius: 999px; width: ${d.w}px; background: ${d.bg}`)}>
                  </span>
                </Fragment>))}
              </div>
              {v.attnHasMore ? (<>
                <div style={css("padding: 10px 16px 0 4px")}>
                  <button className="ns-btn ns-chip" onClick={v.toggleAttnAll} style={css("width: 100%; height: 42px; border-radius: 21px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--tx)")}>
                    {v.attnMoreLabel}
                    <svg className="ns-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={css(`transform: rotate(${v.attnAllRot}deg)`)}>
                      <path className="ns-ic" d="M6 9l6 6 6-6">
                      </path>
                    </svg>
                  </button>
                </div>
              </>) : null}
              {v.attnAll ? (<>
                <div style={css("padding: 10px 16px 0 4px; display: flex; flex-direction: column; gap: 8px")}>
                  {(v.attnRest || []).map((p, p$i) => (<Fragment key={p$i}>
                    <div className="ns-row ns-rise" style={css(`display: flex; align-items: center; border-radius: ${p.radius}; overflow: hidden; animation-delay: ${p.delay}ms`)}>
                      <button className="ns-btn" onClick={p.open} aria-label={p.aria} style={css("flex-grow: 1; min-width: 0; display: flex; align-items: center; gap: 11px; padding: 12px 6px 12px 12px")}>
                        <span style={css(`width: 34px; height: 34px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 2px solid ${p.color}; color: ${p.color}; display: flex; align-items: center; justify-content: center`)}>
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <path className="ns-ic" d={p.icon}>
                            </path>
                          </svg>
                        </span>
                        <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                          <span style={css("font-size: 14px; line-height: 18px; font-weight: 700")}>
                            {p.headline}
                          </span>
                          <span style={css("font-size: 11px; color: var(--tx2)")}>
                            <span style={css(`font-weight: 700; color: ${p.color}`)}>
                              {p.urgency}
                            </span>
                            {' '}· {p.tkLabel} · {p.zone}
                          </span>
                        </span>
                      </button>
                      <button className="ns-btn ns-loc" onClick={p.locate} aria-label={p.locAria} style={css("width: 38px; height: 38px; flex-shrink: 0; margin-right: 10px; display: flex; align-items: center; justify-content: center")}>
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                          <path className="ns-ic" d="M4 11.5 20 4l-7.5 16-2-6.5z">
                          </path>
                        </svg>
                      </button>
                    </div>
                  </Fragment>))}
                </div>
              </>) : null}
              {v.attnEmpty ? (<>
                <p className="ns-serif" style={css("margin: 8px 16px 0 6px; font-size: 17px; font-style: italic; color: var(--tx2)")}>
                  Nothing here needs a decision right now.
                </p>
              </>) : null}
            </div>
          </>) : null}
        </section>
        <div style={css("margin: 22px 16px 0 4px; display: flex; flex-direction: column; gap: 8px")}>
          <section style={css("border-radius: 26px; background: var(--panel); overflow: hidden")}>
            <button className="ns-btn ns-sec" onClick={v.toggleHealthy} aria-expanded={v.healthyOpenStr} style={css("width: 100%; box-sizing: border-box; padding: 14px 16px; display: flex; align-items: center; gap: 10px")}>
              <span style={css("width: 30px; height: 30px; border-radius: 50%; background: var(--mint); color: var(--tx); display: flex; align-items: center; justify-content: center")}>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path className="ns-ic" d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z">
                  </path>
                </svg>
              </span>
              <span className="ns-serif" style={css("font-size: 19px; font-weight: 500")}>
                Healthy assets
              </span>
              <span className="ns-num" style={css("font-size: 13px; font-weight: 700; color: var(--tx2)")}>
                {v.healthyCount}
              </span>
              <span style={css("flex-grow: 1")}>
              </span>
              <svg className="ns-arrow" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style={css(`color: var(--tx2); transform: rotate(${v.healthyRot}deg)`)}>
                <path className="ns-ic" d="M6 9l6 6 6-6">
                </path>
              </svg>
            </button>
            {v.healthyOpen ? (<>
              <div style={css("padding: 0 8px 10px")}>
                {(v.healthyRows || []).map((h, h$i) => (<Fragment key={h$i}>
                  <button className="ns-btn ns-row ns-rise" onClick={h.open} style={css(`width: 100%; box-sizing: border-box; padding: 10px 10px; border-radius: 16px; display: flex; align-items: center; gap: 10px; animation-delay: ${h.delay}ms`)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={css("color: var(--tx2); flex-shrink: 0")}>
                      <path className="ns-ic" d={h.icon}>
                      </path>
                    </svg>
                    <span style={css("flex-grow: 1; min-width: 0; font-size: 14px; font-weight: 600")}>
                      {h.zone}{' '}
                      <span style={css("font-size: 12px; color: var(--tx2); font-weight: 500")}>
                        · {h.level}
                      </span>
                    </span>
                    <span className="ns-num" style={css("font-size: 13px; color: var(--tx2)")}>
                      {h.val}
                    </span>
                    <svg className="ns-nudge" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={css("color: var(--tx2)")}>
                      <path className="ns-ic" d="M9 6l6 6-6 6">
                      </path>
                    </svg>
                  </button>
                </Fragment>))}
              </div>
            </>) : null}
          </section>
          <section style={css("border-radius: 26px; background: var(--panel); overflow: hidden")}>
            <button className="ns-btn ns-sec" onClick={v.toggleResolved} aria-expanded={v.resolvedOpenStr} style={css("width: 100%; box-sizing: border-box; padding: 14px 16px; display: flex; align-items: center; gap: 10px")}>
              <span style={css("width: 30px; height: 30px; border-radius: 50%; background: var(--ok); color: var(--tagTx); display: flex; align-items: center; justify-content: center")}>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 2.2px")}>
                  </path>
                </svg>
              </span>
              <span className="ns-serif" style={css("font-size: 19px; font-weight: 500")}>
                Recently resolved
              </span>
              <span className="ns-num" style={css("font-size: 13px; font-weight: 700; color: var(--tx2)")}>
                {v.resolvedCount}
              </span>
              <span style={css("flex-grow: 1")}>
              </span>
              <svg className="ns-arrow" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style={css(`color: var(--tx2); transform: rotate(${v.resolvedRot}deg)`)}>
                <path className="ns-ic" d="M6 9l6 6 6-6">
                </path>
              </svg>
            </button>
            {v.resolvedOpen ? (<>
              <div style={css("padding: 0 16px 14px 20px")}>
                {(v.resolvedRows || []).map((r, r$i) => (<Fragment key={r$i}>
                  <div className="ns-rise" style={css(`position: relative; padding: 8px 0 8px 20px; animation-delay: ${r.delay}ms`)}>
                    <span style={css("position: absolute; left: 3px; top: 13px; width: 9px; height: 9px; border-radius: 50%; background: var(--ok)")}>
                    </span>
                    <span style={css("position: absolute; left: 7px; top: 26px; bottom: -8px; width: 1.5px; background: var(--line)")}>
                    </span>
                    <div style={css("font-size: 14px; line-height: 19px")}>
                      <strong style={css("font-weight: 700")}>
                        {r.zone}
                      </strong>
                      {' '}· {r.text}
                    </div>
                    <div style={css("font-size: 12px; color: var(--tx2)")}>
                      {r.by} · {r.when}
                    </div>
                  </div>
                </Fragment>))}
              </div>
            </>) : null}
          </section>
        </div>
      </div>
    </>) : null}
    {v.isMap ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column; position: relative")}>
        <header style={css("padding: 18px 16px 12px; flex-shrink: 0; position: relative; z-index: 8; background: var(--bg); display: flex; flex-direction: column; gap: 12px")}>
          <div style={css("display: flex; justify-content: space-between; align-items: baseline")}>
            <h1 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 26px; line-height: 28px; font-weight: 500")}>
              Site map
            </h1>
            <span>
            </span>
          </div>
          <div role="group" aria-label="Level" style={css("position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3px; border: 1px solid var(--line); border-radius: 999px")}>
            <div className="ns-thumb" style={css(`position: absolute; left: 3px; top: 3px; bottom: 3px; width: calc((100% - 6px) / 3); border-radius: 999px; background: var(--panel2); border: 1.5px solid var(--line2); box-sizing: border-box; transform: translateX(${v.lvlThumb}%)`)}>
            </div>
            {(v.levelTabs || []).map((t, t$i) => (<Fragment key={t$i}>
              <button className="ns-btn ns-seg" onClick={t.pick} aria-pressed={t.pressed} style={css(`height: 34px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${t.fg}`)}>
                {t.name}
                <span className="ns-num" style={css(`min-width: 17px; height: 17px; box-sizing: border-box; padding: 0 4px; border-radius: 9px; font-size: 12px; line-height: 17px; text-align: center; background: ${t.badgeBg}; color: var(--tagTx)`)}>
                  {t.count}
                </span>
              </button>
            </Fragment>))}
          </div>
        </header>
        <div className="ns-mapview" style={css("flex-grow: 1; min-height: 0; position: relative; overflow: hidden; background: var(--map); border-top: 1px solid var(--line)")}>
          <div className={`ns-maplayer ${v.panClass}`} style={css(`position: absolute; left: 0; top: 0; width: 318px; height: 424px; transform-origin: 0 0; transform: translate(${v.panX}px, ${v.panY}px) scale(${v.panZ})`)}>
            <div style={css("position: absolute; left: 13px; top: 15px; width: 292px; height: 394px; box-sizing: border-box; border: 2px solid var(--wall); border-radius: 18px")}>
            </div>
            {(v.rooms || []).map((r, r$i) => (<Fragment key={r$i}>
              <div style={css(`position: absolute; left: ${r.l}px; top: ${r.t}px; width: ${r.w}px; height: ${r.h}px; box-sizing: border-box; border: 1.5px solid var(--wall); border-radius: 24px; background: var(--room)`)}>
                <span style={css("position: absolute; left: 5px; top: 3px; font-size: 10px; font-weight: 500; color: var(--tx2); white-space: nowrap")}>
                  {r.label}
                </span>
              </div>
            </Fragment>))}
            <svg viewBox="0 0 300 400" width="318" height="424" aria-hidden="true" style={css("position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none")}>
              <path d={v.lanesD} style={css("fill: none; stroke: var(--line); stroke-width: 7px; stroke-linecap: round; opacity: 0.55")}>
              </path>
              <path d={v.walkedD} style={css("fill: none; stroke: var(--tx2); stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; opacity: 0.45")}>
              </path>
              <path className="ns-route" d={v.routeD} style={css("fill: none; stroke: var(--route); stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round")}>
              </path>
            </svg>
            {(v.equip || []).map((e, e$i) => (<Fragment key={e$i}>
              <button className={e.cls} onClick={e.pick} aria-label={e.tip} style={css(`left: ${e.l}px; top: ${e.t}px; width: ${e.w}px; height: ${e.h}px; font: inherit; color: var(--tx); cursor: pointer; padding: 0; margin: 0`)}>
                <span className="ns-num" style={css(`font-size: ${e.fs}px; font-weight: 600; color: var(--tx)`)}>
                  {e.short}
                </span>
                <span className={e.dotCls} style={css(`background: ${e.color}`)}>
                </span>
                <span className="ns-tip">
                  {e.tip}
                </span>
              </button>
            </Fragment>))}
            {v.showYou ? (<>
              <div style={css(`position: absolute; left: ${v.youX}px; top: ${v.youY}px; width: 0; height: 0; z-index: 6; transform: rotate(${v.youRot}deg)`)}>
                <div style={css("position: absolute; left: -10px; top: -30px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 24px solid var(--acc); opacity: 0.3")}>
                </div>
              </div>
              <div className="ns-you" style={css(`left: ${v.youX}px; top: ${v.youY}px`)}>
              </div>
            </>) : null}
          </div>
          <div aria-hidden="true" style={css(`position: absolute; right: 12px; top: ${v.compassTop}px; width: 32px; height: 32px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid var(--line2); background: var(--panel); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: var(--tx2)`)}>
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path d="M12 3l5 14-5-3-5 3z" style={css("fill: var(--acc)")}>
              </path>
            </svg>
            N
          </div>
          {v.walking ? (<>
            <div className="ns-enter" role="status" aria-live="polite" style={css("position: absolute; left: 10px; right: 10px; top: 10px; z-index: 9; background: var(--panel); border: 1.5px solid var(--line2); border-radius: 20px; padding: 10px; display: flex; align-items: center; gap: 12px")}>
              <div style={css("width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: var(--acc); color: var(--accTx); display: flex; align-items: center; justify-content: center")}>
                <div className="ns-arrow" style={css(`width: 30px; height: 30px; transform: rotate(${v.arrowRot}deg)`)}>
                  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                    <path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" style={css("fill: none; stroke: currentColor; stroke-width: 2.6px; stroke-linecap: round; stroke-linejoin: round")}>
                    </path>
                  </svg>
                </div>
              </div>
              <div style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                <span style={css("font-size: 17px; line-height: 21px; font-weight: 600")}>
                  {v.bannerText}
                </span>
                <span style={css("font-size: 12px; color: var(--tx2)")}>
                  {v.bannerSub}
                </span>
              </div>
              <div style={css("display: flex; flex-direction: column; align-items: flex-end")}>
                <span className="ns-num" style={css("font-size: 26px; line-height: 26px; font-weight: 600")}>
                  {v.bannerDist}
                </span>
                <span style={css("font-size: 11px; color: var(--tx2)")}>
                  m
                </span>
              </div>
            </div>
          </>) : null}
          <div className="ns-sheet" style={css(`position: absolute; left: 4px; right: 4px; bottom: 4px; z-index: 9; background: var(--panel); border-radius: 30px; box-shadow: var(--shadow); padding: 0 16px 18px; transform: translateY(${v.sheetY})`)}>
            <button className="ns-btn ns-grab" onPointerDown={v.sheetDown} onPointerUp={v.sheetUp} aria-label={v.sheetLabel} style={css("display: block; width: 100%; height: 26px; margin-bottom: 4px")}>
              <span style={css("display: block; width: 40px; height: 5px; border-radius: 999px; background: var(--line2); margin: 0 auto")}>
              </span>
            </button>
            {v.sheetIdle ? (<>
              <div className="ns-enter">
                <div style={css("display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 6px")}>
                  <span style={css("font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 500")}>
                    {v.idleTitle}
                  </span>
                  <span style={css("font-size: 12px; color: var(--tx2)")}>
                    nearest first
                  </span>
                </div>
                {(v.idleList || []).map((q, q$i) => (<Fragment key={q$i}>
                  <button className="ns-btn ns-row" onClick={q.pick} aria-label={q.aria} style={css("width: calc(100% + 32px); margin: 0 -16px; box-sizing: border-box; padding: 10px 16px; display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--line)")}>
                    <span style={css(`width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; background: ${q.color}`)}>
                    </span>
                    <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                      <span style={css("font-size: 15px; font-weight: 600")}>
                        {q.zone}
                      </span>
                      <span style={css("font-size: 12px; color: var(--tx2)")}>
                        {q.kindName}{' '}
                        <span className="ns-num" style={css("font-size: 13px; color: var(--tx)")}>
                          {q.val}
                        </span>
                      </span>
                    </span>
                    <span className="ns-num" style={css("font-size: 16px; font-weight: 600")}>
                      {q.dist} m
                    </span>
                    <svg className="ns-nudge" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={css("color: var(--tx2)")}>
                      <path className="ns-ic" d="M9 6l6 6-6 6">
                      </path>
                    </svg>
                  </button>
                </Fragment>))}
                {v.idleEmpty ? (<>
                  <p style={css("margin: 4px 0 0; font-size: 13px; line-height: 19px; color: var(--tx2)")}>
                    No open problems on this level. Every sensor here is reporting inside its baseline.
                  </p>
                </>) : null}
              </div>
            </>) : null}
            {v.sheetSelected ? (<>
              <div className="ns-enter" style={css("display: flex; flex-direction: column; gap: 12px")}>
                <div style={css("display: flex; align-items: flex-start; gap: 10px")}>
                  <div style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("display: flex; align-items: center; gap: 8px")}>
                      <span style={css(`padding: 1px 6px; border-radius: 999px; font-size: 11px; font-weight: 600; background: ${v.sel.color}; color: var(--tagTx)`)}>
                        {v.sel.tag}
                      </span>
                      <span style={css("font-size: 12px; color: var(--tx2)")}>
                        {v.sel.sinceLabel}
                      </span>
                    </span>
                    <span style={css("font-family: 'Fraunces', Georgia, serif; font-size: 26px; line-height: 28px; font-weight: 500")}>
                      {v.sel.zone}
                    </span>
                    <span style={css("font-size: 14px; line-height: 18px; font-weight: 600")}>
                      {v.sel.headline}
                    </span>
                    <span style={css("font-size: 12px; color: var(--tx2)")}>
                      {v.sel.dev}{' '}
                      <span className="ns-num" style={css("font-size: 13px")}>
                        {v.sel.id}
                      </span>
                      {' '}· {v.sel.mount}
                    </span>
                  </div>
                  <div style={css("text-align: right; flex-shrink: 0")}>
                    <div className="ns-num" style={css(`font-size: 30px; line-height: 30px; font-weight: 600; color: ${v.sel.color}`)}>
                      {v.sel.valNum}
                    </div>
                    <div style={css("font-size: 11px; color: var(--tx2)")}>
                      {v.sel.unit} · base {v.sel.base}
                    </div>
                  </div>
                  <button className="ns-btn ns-gh" onClick={v.clearSel} aria-label="Close" style={css("width: 34px; height: 34px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center")}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path className="ns-ic" d="M6.5 6.5l11 11M17.5 6.5l-11 11">
                      </path>
                    </svg>
                  </button>
                </div>
                <div style={css("display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 14px")}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={css("color: var(--acc); flex-shrink: 0")}>
                    <path className="ns-ic" d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9.5A2.5 2.5 0 0 1 8.5 7H16M18 9v5.5a2.5 2.5 0 0 1-2.5 2.5H8">
                    </path>
                  </svg>
                  <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                    <span style={css("display: flex; align-items: baseline; gap: 8px")}>
                      <span className="ns-num" style={css("font-size: 22px; line-height: 24px; font-weight: 600; white-space: nowrap")}>
                        {v.routeM} m
                      </span>
                      <span style={css("font-size: 12px; color: var(--tx2); white-space: nowrap")}>
                        {v.routeEta} on foot
                      </span>
                    </span>
                    <span style={css("font-size: 12px; line-height: 16px; color: var(--tx2)")}>
                      {v.routeFirst}
                    </span>
                  </span>
                </div>
                <div style={css("display: flex; gap: 8px")}>
                  <button className="ns-btn ns-pri" onClick={v.startWalk} style={css("flex-grow: 1; height: 50px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600")}>
                    Walk there
                    <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
                      </path>
                    </svg>
                  </button>
                  <button className="ns-btn ns-gh" onClick={v.openSelDetail} style={css("height: 50px; padding: 0 14px; border-radius: 999px; font-size: 14px; font-weight: 500")}>
                    Details
                  </button>
                  <button className="ns-btn ns-gh" onClick={v.blinkSel} aria-label="Blink the sensor LED" style={css(`width: 50px; height: 50px; border-radius: 999px; display: flex; align-items: center; justify-content: center; color: ${v.blinkFg}`)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path className="ns-ic" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
            </>) : null}
            {v.sheetWalking ? (<>
              <div className="ns-enter" style={css("display: flex; flex-direction: column; gap: 10px")}>
                <div style={css("display: flex; justify-content: space-between; align-items: flex-end")}>
                  <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                    <span style={css("font-size: 12px; color: var(--tx2)")}>
                      Walking to
                    </span>
                    <span style={css("font-family: 'Fraunces', Georgia, serif; font-size: 24px; line-height: 26px; font-weight: 500")}>
                      {v.sel.zone}
                    </span>
                  </div>
                  <div style={css("text-align: right")}>
                    <span className="ns-num" style={css("font-size: 36px; line-height: 36px; font-weight: 600")}>
                      {v.walkRemain}
                    </span>
                    <span style={css("font-size: 13px; color: var(--tx2)")}>
                      {' '}m left
                    </span>
                    <div style={css("font-size: 12px; color: var(--tx2)")}>
                      {v.walkEta}
                    </div>
                  </div>
                </div>
                <ol style={css("margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--line)")}>
                  {(v.walkSteps || []).map((w, w$i) => (<Fragment key={w$i}>
                    <li style={css(`position: relative; padding: 8px 0 8px 26px; display: flex; justify-content: space-between; gap: 8px; border-bottom: 1px solid var(--line); font-size: 13px; color: ${w.fg}; font-weight: ${w.weight}`)}>
                      <span style={css(`position: absolute; left: 0; top: 9px; width: 16px; height: 16px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid ${w.dotBorder}; background: ${w.dotBg}`)}>
                      </span>
                      <span>
                        {w.text}
                      </span>
                      <span className="ns-num" style={css("font-size: 13px")}>
                        {w.dist}
                      </span>
                    </li>
                  </Fragment>))}
                </ol>
                <button className="ns-btn ns-gh" onClick={v.endWalk} style={css("height: 44px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500")}>
                  End route
                </button>
              </div>
            </>) : null}
            {v.sheetArrived ? (<>
              <div className="ns-enter" style={css("display: flex; flex-direction: column; gap: 12px")}>
                <div style={css("display: flex; align-items: flex-start; gap: 10px")}>
                  <div style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--ok)")}>
                      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                        <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5">
                        </path>
                      </svg>
                      You're here
                    </span>
                    <span style={css("font-family: 'Fraunces', Georgia, serif; font-size: 26px; line-height: 28px; font-weight: 500")}>
                      {v.sel.zone}
                    </span>
                    <span style={css("font-size: 13px; line-height: 18px; color: var(--tx2)")}>
                      Sensor{' '}
                      <span className="ns-num" style={css("font-size: 14px; color: var(--tx)")}>
                        {v.sel.id}
                      </span>
                      {' '}is {v.sel.mount}.
                    </span>
                  </div>
                  <div style={css("text-align: right; flex-shrink: 0")}>
                    <div className="ns-num" style={css(`font-size: 30px; line-height: 30px; font-weight: 600; color: ${v.sel.color}`)}>
                      {v.sel.valNum}
                    </div>
                    <div style={css("font-size: 11px; color: var(--tx2)")}>
                      {v.sel.unit} · base {v.sel.base}
                    </div>
                  </div>
                </div>
                <p style={css(`margin: 0; padding: 10px 12px; border-left: 3px solid ${v.sel.color}; background: var(--bg); font-size: 13px; line-height: 19px`)}>
                  <strong style={css("font-weight: 600")}>
                    {v.sel.headline}.
                  </strong>
                  {' '}Start here: {v.sel.firstStep}.
                </p>
                <div style={css("display: flex; gap: 8px")}>
                  <button className="ns-btn ns-gh" onClick={v.blinkSel} style={css(`flex-grow: 1; height: 46px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; color: ${v.blinkFg}`)}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path className="ns-ic" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z">
                      </path>
                    </svg>
                    {v.blinkLabel}
                  </button>
                  <button className="ns-btn ns-gh" onClick={v.logSel} style={css(`flex-grow: 1; height: 46px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; color: ${v.logFg}`)}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path className="ns-ic" d={v.logIcon}>
                      </path>
                    </svg>
                    {v.logLabel}
                  </button>
                </div>
                {v.hasNext ? (<>
                  <button className="ns-btn ns-pri" onClick={v.goNext} style={css("height: 50px; border-radius: 999px; padding: 0 16px; display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600")}>
                    <span style={css("flex-grow: 1; text-align: left")}>
                      Next: {v.nextZone}
                    </span>
                    <span className="ns-num" style={css("font-size: 17px")}>
                      {v.nextDist} m
                    </span>
                    <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
                      </path>
                    </svg>
                  </button>
                </>) : null}
                <button className="ns-btn" onClick={v.clearSel} style={css("height: 36px; font-size: 13px; color: var(--tx2); text-align: center; text-decoration: underline; text-underline-offset: 3px")}>
                  Done for now
                </button>
              </div>
            </>) : null}
          </div>
        </div>
      </div>
    </>) : null}
    {v.isSensors ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
        <header style={css("padding: 22px 16px 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px")}>
          <div style={css("display: flex; align-items: flex-start; gap: 10px")}>
            <div style={css("flex-grow: 1; min-width: 0")}>
              <h1 style={css("margin: 0 0 2px; font-family: 'Fraunces', Georgia, serif; font-size: 30px; line-height: 32px; font-weight: 500")}>
                Sensors
              </h1>
              <p style={css("margin: 0; font-size: 13px; color: var(--tx2)")}>
                Tap any sensor to control it
              </p>
            </div>
            <button className="ns-btn ns-pri" onClick={v.openPair} style={css("height: 40px; margin-top: 2px; padding: 0 14px 0 11px; border-radius: 20px 20px 20px 8px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; flex-shrink: 0; white-space: nowrap")}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path className="ns-ic" d="M12 5v14M5 12h14" style={css("stroke-width: 2.4px")}>
                </path>
              </svg>
              Pair
            </button>
          </div>
          <div className="ns-rise" style={css("padding: 14px 16px 12px; border-radius: 28px 28px 28px 10px; background: var(--panel); display: flex; flex-direction: column; gap: 9px")}>
            <div style={css("display: flex; align-items: baseline; gap: 6px; white-space: nowrap")}>
              <span className="ns-serif" style={css("font-size: 30px; line-height: 32px; font-weight: 500")}>
                {v.devOnline}
              </span>
              <span style={css("font-size: 14px; font-weight: 700; color: var(--tx2)")}>
                of {v.devTotal} online
              </span>
            </div>
            <div aria-hidden="true" style={css("height: 6px; border-radius: 3px; background: var(--panel2); overflow: hidden")}>
              <div style={css(`height: 100%; width: ${v.devBarW}%; border-radius: 3px; background: var(--ok); transition: width 500ms cubic-bezier(.3,1.2,.5,1)`)}>
              </div>
            </div>
            <div style={css("display: flex; align-items: center; gap: 8px")}>
              <span style={css("flex-grow: 1; min-width: 0; font-size: 12px; line-height: 16px; color: var(--tx2)")}>
                {v.devSumLine}
              </span>
              <button className="ns-btn ns-codepill" onClick={v.copyCode} aria-label={v.codeAria} style={css("flex-shrink: 0; height: 28px; padding: 0 10px 0 8px; border-radius: 14px; display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--tx2); white-space: nowrap")}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path className="ns-ic" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1">
                  </path>
                </svg>
                <span className="ns-num" style={css("color: var(--tx); letter-spacing: 0.04em")}>
                  {v.siteCode}
                </span>
              </button>
            </div>
          </div>
          <div role="group" aria-label="Filter sensors" style={css("position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3px; border: 1px solid var(--line); border-radius: 999px")}>
            <div className="ns-thumb" style={css(`position: absolute; left: 3px; top: 3px; bottom: 3px; width: calc((100% - 6px) / 3); border-radius: 999px; background: var(--panel2); border: 1.5px solid var(--line2); box-sizing: border-box; transform: translateX(${v.fThumb}%)`)}>
            </div>
            {(v.filterTabs || []).map((t, t$i) => (<Fragment key={t$i}>
              <button className="ns-btn ns-seg" onClick={t.pick} aria-pressed={t.pressed} style={css(`height: 32px; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 13px; font-weight: 600; color: ${t.fg}`)}>
                {t.name}
                <span className="ns-num" style={css("font-size: 13px; font-weight: 500; color: var(--tx2)")}>
                  {t.count}
                </span>
              </button>
            </Fragment>))}
          </div>
        </header>
        <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding-bottom: 90px")}>
          {v.sensEmpty ? (<>
            <div className="ns-pop" style={css("margin: 18px 16px; padding: 18px; border-radius: 24px; border: 1.5px dashed var(--line2); font-size: 13px; line-height: 19px; color: var(--tx2); text-align: center")}>
              {v.sensEmptyText}
            </div>
          </>) : null}
          {(v.sensGroups || []).map((g, g$i) => (<Fragment key={g$i}>
            <div style={css("padding: 14px 16px 8px 8px; display: flex; justify-content: space-between; align-items: baseline")}>
              <span style={css("font-family: 'Fraunces', Georgia, serif; font-size: 16px; font-weight: 500; letter-spacing: 0.02em")}>
                {g.name}
              </span>
              <span className="ns-num" style={css("font-size: 13px; color: var(--tx2)")}>
                {g.count}
              </span>
            </div>
            {(g.rows || []).map((s, s$i) => (<Fragment key={s$i}>
              <div className={`ns-row ${s.newCls}`} style={css("display: flex; align-items: center; margin: 0 16px 8px 4px; border-radius: 22px 22px 22px 8px; overflow: hidden")}>
                <button className="ns-btn" onClick={s.open} aria-label={s.aria} style={css(`flex-grow: 1; min-width: 0; display: flex; align-items: center; gap: 11px; padding: 11px 8px 11px 16px; opacity: ${s.rowOp}; transition: opacity 240ms`)}>
                  <span style={css(`width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; background: ${s.dot}; transition: background-color 240ms`)}>
                  </span>
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style={css("color: var(--tx2); flex-shrink: 0")}>
                    <path className="ns-ic" d={s.icon}>
                    </path>
                  </svg>
                  <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                    <span style={css("font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>
                      {s.zone}
                    </span>
                    <span style={css(`font-size: 12px; color: ${s.subFg}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`)}>
                      {s.sub}
                    </span>
                  </span>
                </button>
                <button className="ns-btn ns-sw" role="switch" onClick={s.toggle} aria-checked={s.on} aria-label={s.swAria} style={css(`position: relative; width: 46px; height: 28px; margin-right: 14px; flex-shrink: 0; border-radius: 14px; background: ${s.swBg}; transition: background-color 220ms`)}>
                  <span style={css(`position: absolute; left: 3px; top: 3px; width: 22px; height: 22px; border-radius: 50%; background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.18); transform: translateX(${s.knobX}px); transition: transform 280ms cubic-bezier(.3,1.4,.5,1)`)}>
                  </span>
                </button>
              </div>
            </Fragment>))}
          </Fragment>))}
        </div>
      </div>
    </>) : null}
    {v.isLog ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
        <header style={css("padding: 20px 16px 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px")}>
          <div>
            <div style={css("display: flex; align-items: center; gap: 10px")}>
              <h1 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 30px; line-height: 32px; font-weight: 500")}>
                Activity log
              </h1>
              <span aria-label="Read-only, tamper-evident" style={css("height: 24px; padding: 0 8px; border-radius: 12px; border: 1.5px solid var(--line2); display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--tx2)")}>
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                  <path className="ns-ic" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2">
                  </path>
                </svg>
                Read-only
              </span>
            </div>
            <p style={css("margin: 3px 0 0; font-size: 13px; line-height: 18px; color: var(--tx2)")}>
              Every alert, ticket, assignment, escalation and fix, in order. Entries can't be edited or removed.
            </p>
          </div>
          <div role="group" aria-label="Date range" style={css("position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3px; border: 1px solid var(--line); border-radius: 999px")}>
            <div className="ns-thumb" style={css(`position: absolute; left: 3px; top: 3px; bottom: 3px; width: calc((100% - 6px) / 3); border-radius: 999px; background: var(--panel2); border: 1.5px solid var(--line2); box-sizing: border-box; transform: translateX(${v.logDateThumb}%)`)}>
            </div>
            {(v.logDates || []).map((t, t$i) => (<Fragment key={t$i}>
              <button className="ns-btn ns-seg" onClick={t.pick} aria-pressed={t.pressed} style={css(`height: 30px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: ${t.fg}`)}>
                {t.name}
              </button>
            </Fragment>))}
          </div>
          <div style={css("display: flex; gap: 8px; align-items: center")}>
            <label htmlFor="ns-log-asset" style={css("font-size: 12px; color: var(--tx2); white-space: nowrap")}>
              Asset
            </label>
            <select id="ns-log-asset" onChange={v.pickLogAsset} value={v.logAsset} style={css("flex-grow: 1; height: 34px; padding: 0 8px; border-radius: 999px; border: 1.5px solid var(--line2); background: var(--panel); color: var(--tx); font: inherit; font-size: 13px")}>
              {(v.logAssetOpts || []).map((o, o$i) => (<Fragment key={o$i}>
                <option value={o.value}>
                  {o.label}
                </option>
              </Fragment>))}
            </select>
          </div>
          <div className="ns-scroll" style={css("display: flex; gap: 6px; overflow-x: auto; margin: 0 -16px; padding: 0 16px")}>
            {(v.logTypes || []).map((c, c$i) => (<Fragment key={c$i}>
              <button className="ns-btn ns-chip" onClick={c.pick} aria-pressed={c.pressed} style={css(`flex-shrink: 0; height: 30px; padding: 0 10px; border-radius: 15px; font-size: 12px; font-weight: 600; white-space: nowrap; border-color: ${c.border}; background: ${c.bg}; color: ${c.fg}`)}>
                {c.name}
              </button>
            </Fragment>))}
          </div>
        </header>
        <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding: 0 16px 92px; border-top: 1px solid var(--line)")}>
          {(v.logGroups || []).map((g, g$i) => (<Fragment key={g$i}>
            <div style={css("padding: 12px 0 4px; font-size: 12px; font-weight: 600; color: var(--tx2)")}>
              {g.day}
            </div>
            <ol style={css("margin: 0; padding: 0; list-style: none")}>
              {(g.rows || []).map((e, e$i) => (<Fragment key={e$i}>
                <li style={css("position: relative; display: flex; gap: 12px; padding: 8px 0 10px")}>
                  <span style={css("position: absolute; left: 13px; top: 36px; bottom: -2px; width: 1.5px; background: var(--line)")}>
                  </span>
                  <span style={css(`width: 28px; height: 28px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1.5px solid ${e.color}; color: ${e.color}; background: var(--bg); display: flex; align-items: center; justify-content: center`)}>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path className="ns-ic" d={e.icon}>
                      </path>
                    </svg>
                  </span>
                  <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px")}>
                    <span style={css("display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--tx2)")}>
                      <span>
                        {e.typeName}
                      </span>
                      <span className="ns-num" style={css("font-size: 13px")}>
                        {e.t}
                      </span>
                    </span>
                    <span style={css("font-size: 14px; line-height: 19px")}>
                      {e.text}
                    </span>
                    <span style={css("font-size: 12px; color: var(--tx2)")}>
                      {e.source}
                    </span>
                    <span className="ns-num" style={css("font-size: 11px; color: var(--tx2); opacity: 0.8")}>
                      #{e.hash} · follows #{e.prev}
                    </span>
                  </span>
                </li>
              </Fragment>))}
            </ol>
          </Fragment>))}
          {v.logEmpty ? (<>
            <p style={css("margin: 0; padding: 16px 0; font-size: 13px; color: var(--tx2)")}>
              No events match these filters.
            </p>
          </>) : null}
          <p style={css("margin: 14px 0 0; padding: 10px 12px; border: 1.5px dashed var(--line2); border-radius: 14px; font-size: 12px; line-height: 17px; color: var(--tx2)")}>
            This log is append-only. Each entry carries a fingerprint of the entry before it, so any change to past entries would break the chain.
          </p>
        </div>
      </div>
    </>) : null}
    {v.isBpCamera ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column; padding-bottom: 18px")}>
        <header style={css("padding: 10px 16px 10px 6px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center")}>
          <button className="ns-btn ns-gh" onClick={v.navOverview} style={css("height: 38px; padding: 0 10px; margin-left: 10px; border-radius: 999px; display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500")}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path className="ns-ic" d="M15 6l-6 6 6 6">
              </path>
            </svg>
            Cancel
          </button>
          <span className="ns-num" style={css("font-size: 13px; color: var(--tx2)")}>
            1 / 3
          </span>
        </header>
        <div style={css("padding: 0 16px 12px; flex-shrink: 0")}>
          <h1 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 28px; line-height: 30px; font-weight: 500")}>
            Scan blueprint
          </h1>
          <p style={css("margin: 3px 0 0; font-size: 13px; line-height: 18px; color: var(--tx2)")}>
            Set up a new building from its floor plan. Lay the sheet flat and fit the whole page in the frame.
          </p>
        </div>
        <div style={css("margin: 0 16px; flex-grow: 1; min-height: 0; position: relative; overflow: hidden; border-radius: 24px; border: 1px solid var(--line); background: #0B0B0A")}>
          <div style={css("position: absolute; left: 50%; top: 50%; width: 214px; height: 290px; margin: -145px 0 0 -107px; transform: rotate(-3deg); background: #1E3A5F; border-radius: 2px")}>
            <svg viewBox="0 0 300 400" width="214" height="290" aria-hidden="true" style={css("display: block")}>
              <path d={v.bpPlanD} style={css("fill: none; stroke: #DCE8F5; stroke-width: 2.4px; opacity: 0.9")}>
              </path>
              <path d="M12 14h276v372H12z" style={css("fill: none; stroke: #DCE8F5; stroke-width: 4px")}>
              </path>
            </svg>
          </div>
          <div style={css(`position: absolute; left: 50%; top: 50%; width: ${v.bpFrameW}px; height: ${v.bpFrameH}px; transform: translate(-50%, -50%) rotate(${v.bpFrameRot}deg); transition: width 520ms cubic-bezier(.3,1.3,.5,1), height 520ms cubic-bezier(.3,1.3,.5,1), transform 520ms cubic-bezier(.3,1.3,.5,1)`)}>
            <div style={css(`position: absolute; left: 0; top: 0; width: 26px; height: 26px; border-top: 3px solid ${v.bpFrameColor}; border-left: 3px solid ${v.bpFrameColor}; border-top-left-radius: 5px; transition: border-color 300ms`)}>
            </div>
            <div style={css(`position: absolute; right: 0; top: 0; width: 26px; height: 26px; border-top: 3px solid ${v.bpFrameColor}; border-right: 3px solid ${v.bpFrameColor}; border-top-right-radius: 5px; transition: border-color 300ms`)}>
            </div>
            <div style={css(`position: absolute; left: 0; bottom: 0; width: 26px; height: 26px; border-bottom: 3px solid ${v.bpFrameColor}; border-left: 3px solid ${v.bpFrameColor}; border-bottom-left-radius: 5px; transition: border-color 300ms`)}>
            </div>
            <div style={css(`position: absolute; right: 0; bottom: 0; width: 26px; height: 26px; border-bottom: 3px solid ${v.bpFrameColor}; border-right: 3px solid ${v.bpFrameColor}; border-bottom-right-radius: 5px; transition: border-color 300ms`)}>
            </div>
          </div>
          <div role="status" style={css("position: absolute; left: 12px; top: 12px; height: 28px; padding: 0 10px; border-radius: 14px; background: var(--panel); border: 1.5px solid var(--line2); display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600")}>
            <span style={css(`width: 7px; height: 7px; border-radius: 50%; background: ${v.bpEdgeDot}`)}>
            </span>
            {v.bpEdgeText}
          </div>
        </div>
        <div style={css("padding: 14px 76px 0 16px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px")}>
          <button className="ns-btn ns-pri" onClick={v.bpCapture} style={css("height: 52px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600")}>
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
              <path className="ns-ic" d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M12 9v6M9 12h6">
              </path>
            </svg>
            Capture blueprint
          </button>
          <button className="ns-btn" onClick={v.bpCapture} style={css("height: 34px; font-size: 13px; color: var(--tx2); text-align: center; text-decoration: underline; text-underline-offset: 3px")}>
            Upload a PDF instead
          </button>
        </div>
      </div>
    </>) : null}
    {v.isBpProcessing ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column; padding-bottom: 18px")}>
        <header style={css("padding: 10px 16px 10px; flex-shrink: 0; display: flex; justify-content: flex-end; align-items: center; height: 38px")}>
          <span className="ns-num" style={css("font-size: 13px; color: var(--tx2)")}>
            2 / 3
          </span>
        </header>
        <div style={css("padding: 0 16px 16px; flex-shrink: 0")}>
          <h1 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 28px; line-height: 30px; font-weight: 500")}>
            Processing blueprint…
          </h1>
          <p style={css("margin: 3px 0 0; font-size: 13px; color: var(--tx2)")}>
            This takes a moment. You can keep the phone down.
          </p>
        </div>
        <div style={css("margin: 0 16px; padding: 16px; border: 1px solid var(--line); border-radius: 20px; background: var(--panel); display: flex; gap: 16px; align-items: center")}>
          <div style={css("width: 96px; height: 128px; flex-shrink: 0; background: var(--bg); border: 1px solid var(--line); border-radius: 10px")}>
            <svg viewBox="0 0 300 400" width="93" height="124" aria-hidden="true" style={css("display: block; margin: 1px")}>
              <path d={v.bpPlanD} style={css("fill: none; stroke: var(--line2); stroke-width: 3px")}>
              </path>
              <path d={v.bpPlanD} style={css(`fill: none; stroke: var(--acc); stroke-width: 5px; stroke-dasharray: ${v.bpPlanLen}; stroke-dashoffset: ${v.bpDashOff}`)}>
              </path>
            </svg>
          </div>
          <div style={css("flex-grow: 1; display: flex; flex-direction: column; gap: 8px")}>
            <span className="ns-num" style={css("font-size: 44px; line-height: 44px; font-weight: 600")}>
              {v.bpPct}
              <span style={css("font-size: 18px; color: var(--tx2)")}>
                %
              </span>
            </span>
            <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={v.bpPct} aria-label="Blueprint processing" style={css("height: 8px; border-radius: 10px; background: var(--line); overflow: hidden")}>
              <div style={css(`height: 8px; width: ${v.bpPct}%; background: var(--acc)`)}>
              </div>
            </div>
            <span style={css("font-size: 12px; color: var(--tx2)")}>
              {v.bpStageText}
            </span>
          </div>
        </div>
        <ol style={css("margin: 14px 16px 0; padding: 0; list-style: none; border-top: 1px solid var(--line)")}>
          {(v.bpSteps || []).map((w, w$i) => (<Fragment key={w$i}>
            <li style={css(`position: relative; padding: 11px 0 11px 28px; border-bottom: 1px solid var(--line); font-size: 14px; color: ${w.fg}; font-weight: ${w.weight}`)}>
              <span style={css(`position: absolute; left: 0; top: 12px; width: 17px; height: 17px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid ${w.dotBorder}; background: ${w.dotBg}`)}>
              </span>
              {w.text}
            </li>
          </Fragment>))}
        </ol>
      </div>
    </>) : null}
    {v.isBpModel ? (<>
      <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column; padding-bottom: 18px")}>
        <header style={css("padding: 10px 16px 10px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center")}>
          <button className="ns-btn ns-gh" onClick={v.bpRescan} style={css("height: 38px; padding: 0 10px; border-radius: 999px; display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500")}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path className="ns-ic" d="M15 6l-6 6 6 6">
              </path>
            </svg>
            Rescan
          </button>
          <span className="ns-num" style={css("font-size: 13px; color: var(--tx2)")}>
            3 / 3
          </span>
        </header>
        <div style={css("padding: 0 16px 10px; flex-shrink: 0")}>
          <h1 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 28px; line-height: 30px; font-weight: 500")}>
            Harbor St. Depot
          </h1>
          <p style={css("margin: 3px 0 0; font-size: 13px; color: var(--tx2)")}>
            2 levels found · {v.bpPinsShown} of {v.bpPinsTotal} sensors placed
          </p>
        </div>
        <div onPointerDown={v.bpDown} onPointerMove={v.bpMove} onPointerUp={v.bpUp} onPointerLeave={v.bpUp} aria-label="3D building model. Drag to rotate." style={css(`margin: 0 16px; flex-grow: 1; min-height: 0; position: relative; overflow: hidden; border-radius: 24px; border: 1px solid var(--line); background: var(--map); touch-action: none; cursor: ${v.bpCursor}; user-select: none`)}>
          <svg viewBox="0 0 294 470" width="294" height="470" aria-hidden="true" style={css("position: absolute; left: 0; top: 0; overflow: visible")}>
            <path d={v.m3Ground} style={css("fill: var(--room); stroke: var(--wall); stroke-width: 1.5px; stroke-linejoin: round")}>
            </path>
            <path d={v.m3Walls} style={css("fill: var(--eq); fill-opacity: 0.55; stroke: var(--wall); stroke-width: 1px; stroke-linejoin: round")}>
            </path>
            <path d={v.m3Slab} style={css("fill: var(--panel2); fill-opacity: 0.6; stroke: var(--tx2); stroke-width: 1.5px; stroke-linejoin: round")}>
            </path>
            <path d={v.m3Roof} style={css("fill: var(--eq); fill-opacity: 0.8; stroke: var(--tx2); stroke-width: 1px; stroke-linejoin: round")}>
            </path>
          </svg>
          {(v.m3Pins || []).map((p, p$i) => (<Fragment key={p$i}>
            <div style={css(`position: absolute; left: ${p.x}px; top: ${p.y}px; width: 2px; height: ${p.len}px; margin-left: -1px; background: ${p.color}; opacity: ${p.op}`)}>
            </div>
            <div style={css(`position: absolute; left: ${p.x}px; top: ${p.hy}px; width: 10px; height: 10px; margin: -5px 0 0 -5px; box-sizing: border-box; border-radius: 50%; border: 2px solid var(--map); background: ${p.color}; opacity: ${p.op}`)}>
            </div>
          </Fragment>))}
          <div style={css("position: absolute; left: 10px; bottom: 10px; height: 26px; padding: 0 9px; border-radius: 13px; background: var(--panel); border: 1.5px solid var(--line2); display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--tx2)")}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path className="ns-ic" d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4">
              </path>
            </svg>
            Drag to rotate
          </div>
          <button className="ns-btn ns-gh" onClick={v.bpResetView} style={css("position: absolute; right: 10px; top: 10px; height: 30px; padding: 0 10px; border-radius: 999px; background: var(--panel); font-size: 12px; font-weight: 600")}>
            Reset view
          </button>
          <div style={css("position: absolute; left: 10px; top: 10px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--tx2)")}>
            <span style={css("display: flex; align-items: center; gap: 6px")}>
              <span style={css("width: 8px; height: 8px; border-radius: 50%; background: var(--acc)")}>
              </span>
              Sensor paired
            </span>
            <span style={css("display: flex; align-items: center; gap: 6px")}>
              <span style={css("width: 8px; height: 8px; border-radius: 50%; background: var(--watch)")}>
              </span>
              Needs a check
            </span>
          </div>
        </div>
        <div style={css("padding: 14px 16px 0; flex-shrink: 0; display: flex; gap: 8px; padding-right: 76px")}>
          <button className="ns-btn ns-pri" onClick={v.bpFinish} style={css("flex-grow: 1; height: 50px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600")}>
            Add to my sites
            <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </>) : null}
  </main>
  <div onClick={v.closeDetail} aria-hidden="true" style={css(`position: absolute; inset: 0; z-index: 20; background: rgba(5, 5, 4, ${v.overlayOp}); pointer-events: ${v.overlayPE}`)}>
  </div>
  <aside role="dialog" aria-label="Sensor detail" style={css(`position: absolute; top: 0; bottom: 0; left: 40px; width: 380px; z-index: 21; box-sizing: border-box; padding: 0 46px 18px 16px; background: var(--panel); border-radius: 32px 0 0 32px; box-shadow: var(--shadow); display: flex; flex-direction: column; transform: translateX(${v.panelPx}px); visibility: ${v.panelVis}`)}>
    <div className="ns-grab" onPointerDown={v.detDown} onPointerMove={v.detMove} onPointerUp={v.detUp} onPointerCancel={v.detUp} style={css("height: 64px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; margin-left: -8px")}>
      <button className="ns-btn ns-gh" onClick={v.closeDetail} aria-label="Close detail" style={css("width: 40px; height: 40px; border-radius: 999px; display: flex; align-items: center; justify-content: center")}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path className="ns-ic" d="M6.5 6.5l11 11M17.5 6.5l-11 11">
          </path>
        </svg>
      </button>
      <span style={css("font-size: 12px; color: var(--tx2)")}>
        {v.d.level} ·{' '}
        <span className="ns-num" style={css("font-size: 13px")}>
          {v.d.id}
        </span>
      </span>
    </div>
    <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0")}>
      <div style={css("display: flex; flex-direction: column; gap: 5px; padding-bottom: 14px")}>
        <span style={css("display: flex; align-items: center; gap: 8px; flex-wrap: wrap")}>
          <span style={css(`padding: 1px 6px; border-radius: 999px; font-size: 11px; font-weight: 600; background: ${v.d.color}; color: var(--tagTx)`)}>
            {v.d.tag}
          </span>
          <span style={css("font-size: 12px; color: var(--tx2)")}>
            {v.d.catName} · {v.d.sinceLabel}
          </span>
        </span>
        <h2 style={css("margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 30px; line-height: 32px; font-weight: 500")}>
          {v.d.zone}
        </h2>
        <span style={css("font-size: 16px; line-height: 21px; font-weight: 600")}>
          {v.d.headline}
        </span>
        <span style={css("font-size: 12px; color: var(--tx2)")}>
          {v.d.dev}, {v.d.mount}
        </span>
      </div>
      {v.tkShow ? (<>
        <div style={css("padding: 12px 0 14px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 10px")}>
          <div style={css("display: flex; justify-content: space-between; align-items: center")}>
            <span style={css("font-size: 14px; font-weight: 600")}>
              Ticket{' '}
              <span className="ns-num" style={css("font-size: 15px")}>
                {v.tk.id}
              </span>
            </span>
            <span style={css(`height: 22px; padding: 0 8px; border-radius: 11px; display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; background: ${v.tk.badgeBg}; color: ${v.tk.badgeFg}; border: 1.5px solid ${v.tk.badgeBorder}`)}>
              {v.tk.statusLabel}
            </span>
          </div>
          {v.tkOpen ? (<>
            <div style={css("border: 1.5px solid var(--line2); border-radius: 20px; padding: 12px; display: flex; flex-direction: column; gap: 10px; background: var(--bg)")}>
              <span style={css("font-size: 12px; color: var(--tx2)")}>
                Recommended technician
              </span>
              <div style={css("display: flex; align-items: center; gap: 10px")}>
                <span style={css("width: 42px; height: 42px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1.5px solid var(--line2); background: var(--panel2); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600")}>
                  {v.rec.initials}
                </span>
                <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                  <span style={css("font-size: 16px; font-weight: 600")}>
                    {v.rec.name}
                  </span>
                  <span style={css("font-size: 12px; color: var(--tx2)")}>
                    {v.rec.trade}
                  </span>
                </span>
              </div>
              <span style={css("display: flex; align-items: center; gap: 7px; font-size: 13px")}>
                <span style={css(`width: 8px; height: 8px; border-radius: 50%; background: ${v.rec.color}`)}>
                </span>
                <span style={css("font-weight: 600")}>
                  {v.rec.avail}
                </span>
                <span style={css("color: var(--tx2)")}>
                  · {v.rec.where}
                </span>
              </span>
              <button className="ns-btn ns-pri" onClick={v.rec.assign} style={css("height: 46px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; font-weight: 600")}>
                Assign {v.rec.first}
                <svg className="ns-nudge" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                  <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
                  </path>
                </svg>
              </button>
              <button className="ns-btn" onClick={v.toggleOthers} aria-expanded={v.othersOpenStr} style={css("display: flex; align-items: center; justify-content: center; gap: 5px; height: 28px; font-size: 12px; color: var(--tx2)")}>
                Choose someone else
                <svg className="ns-arrow" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" style={css(`transform: rotate(${v.othersRot}deg)`)}>
                  <path className="ns-ic" d="M6 9l6 6 6-6">
                  </path>
                </svg>
              </button>
              {v.othersOpen ? (<>
                <div className="ns-enter" style={css("display: flex; flex-direction: column; border-top: 1px solid var(--line)")}>
                  {(v.others || []).map((o, o$i) => (<Fragment key={o$i}>
                    <div style={css("display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--line)")}>
                      <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px")}>
                        <span style={css("font-size: 14px; font-weight: 600")}>
                          {o.name}
                        </span>
                        <span style={css("display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--tx2)")}>
                          <span style={css(`width: 6px; height: 6px; border-radius: 50%; background: ${o.color}`)}>
                          </span>
                          {o.avail} · {o.trade}
                        </span>
                      </span>
                      <button className="ns-btn ns-gh" onClick={o.assign} style={css("height: 32px; padding: 0 10px; border-radius: 14px; font-size: 12px; font-weight: 600")}>
                        Assign
                      </button>
                    </div>
                  </Fragment>))}
                </div>
              </>) : null}
            </div>
          </>) : null}
          {v.tkActive ? (<>
            <div className="ns-enter" style={css("display: flex; flex-direction: column; gap: 10px")}>
              <div style={css("display: flex; align-items: center; gap: 10px")}>
                <span style={css("width: 38px; height: 38px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 2px solid var(--acc); background: var(--panel2); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600")}>
                  {v.tk.initials}
                </span>
                <span style={css("display: flex; flex-direction: column; gap: 1px")}>
                  <span style={css("font-size: 15px; font-weight: 600")}>
                    {v.tk.techName}
                  </span>
                  <span style={css("font-size: 12px; color: var(--tx2)")}>
                    {v.tk.trade} · working on it
                  </span>
                </span>
              </div>
              <ol style={css("margin: 0; padding: 0; list-style: none")}>
                {(v.tkSteps || []).map((w, w$i) => (<Fragment key={w$i}>
                  <li style={css(`position: relative; padding: 0 0 12px 26px; display: flex; justify-content: space-between; gap: 8px; font-size: 13px; line-height: 17px; color: ${w.fg}; font-weight: ${w.weight}`)}>
                    <span style={css(`position: absolute; left: 7px; top: 16px; bottom: 0; width: 1.5px; background: ${w.line}`)}>
                    </span>
                    <span style={css(`position: absolute; left: 0; top: 1px; width: 16px; height: 16px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid ${w.dotBorder}; background: ${w.dotBg}`)}>
                    </span>
                    <span style={css("display: flex; flex-direction: column; gap: 1px")}>
                      <span>
                        {w.text}
                      </span>
                      <span style={css("font-size: 11px; font-weight: 400; color: var(--tx2)")}>
                        {w.channel}
                      </span>
                    </span>
                    <span className="ns-num" style={css(`font-size: 13px; white-space: nowrap; color: ${w.timeFg}`)}>
                      {w.time}
                    </span>
                  </li>
                </Fragment>))}
              </ol>
              <p style={css("margin: 0; padding: 8px 10px; border-radius: 14px; background: var(--bg); font-size: 12px; line-height: 17px; color: var(--tx2)")}>
                {v.tk.rule}
              </p>
              <button className="ns-btn ns-gh" onClick={v.resolveDet} style={css("height: 42px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 14px; font-weight: 600")}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={css("color: var(--ok)")}>
                  <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5">
                  </path>
                </svg>
                Mark resolved
              </button>
            </div>
          </>) : null}
          {v.tkDone ? (<>
            <p className="ns-enter" style={css("margin: 0; padding: 10px 12px; border-left: 3px solid var(--ok); background: var(--bg); font-size: 13px")}>
              Resolved by {v.tk.techName} · {v.tk.resolvedWhen}. The sensor will confirm once readings return to baseline.
            </p>
          </>) : null}
        </div>
      </>) : null}
      <div style={css("padding: 12px 0 14px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px")}>
        <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
          <div style={css(`padding: 9px 10px; border-radius: 14px; border: 1.5px solid ${v.d.color}; display: flex; flex-direction: column; gap: 2px`)}>
            <span style={css("font-size: 11px; color: var(--tx2)")}>
              How urgent
            </span>
            <span style={css("font-size: 15px; font-weight: 600")}>
              {v.d.urgency}
            </span>
          </div>
          <div style={css("padding: 9px 10px; border-radius: 14px; border: 1.5px solid var(--line2); display: flex; flex-direction: column; gap: 2px")}>
            <span style={css("font-size: 11px; color: var(--tx2)")}>
              Who can fix it
            </span>
            <span style={css("font-size: 15px; font-weight: 600")}>
              {v.d.who}
            </span>
          </div>
        </div>
        <div style={css("display: flex; flex-direction: column; gap: 3px")}>
          <span style={css("font-size: 13px; font-weight: 600")}>
            What's happening
          </span>
          <p style={css("margin: 0; font-size: 14px; line-height: 20px")}>
            {v.d.what}
          </p>
        </div>
        <div style={css("display: flex; flex-direction: column; gap: 3px")}>
          <span style={css("font-size: 13px; font-weight: 600")}>
            Why it matters
          </span>
          <p style={css("margin: 0; font-size: 14px; line-height: 20px")}>
            {v.d.why}
          </p>
        </div>
        {v.infoCard}
        <div style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 13px; font-weight: 600")}>
            What to do
          </span>
          <ol style={css("margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px")}>
            {(v.dTodo || []).map((t, t$i) => (<Fragment key={t$i}>
              <li style={css("display: flex; gap: 10px; font-size: 14px; line-height: 20px")}>
                <span className="ns-num" style={css("width: 20px; height: 20px; flex-shrink: 0; border-radius: 50%; background: var(--panel2); border: 1.5px solid var(--line2); box-sizing: border-box; font-size: 12px; line-height: 17px; text-align: center; font-weight: 600")}>
                  {t.n}
                </span>
                <span>
                  {t.text}
                </span>
              </li>
            </Fragment>))}
          </ol>
        </div>
      </div>
      <div style={css("padding: 12px 0 2px; border-top: 1px solid var(--line); font-size: 14px; font-weight: 600")}>
        The numbers behind it
      </div>
      <div style={css("padding: 8px 0 16px; display: flex; flex-direction: column; gap: 12px")}>
        <div style={css("display: flex; align-items: flex-end; justify-content: space-between")}>
          <div>
            <div style={css("font-size: 12px; color: var(--tx2)")}>
              {v.d.kindName} now
            </div>
            <span className="ns-num" style={css(`font-size: 48px; line-height: 48px; font-weight: 600; color: ${v.d.color}`)}>
              {v.dValAnim}
            </span>
            <span style={css("font-size: 15px; color: var(--tx2)")}>
              {' '}{v.d.unit}
            </span>
          </div>
          <div style={css("text-align: right")}>
            <div style={css("font-size: 12px; color: var(--tx2)")}>
              Baseline
            </div>
            <span className="ns-num" style={css("font-size: 22px; font-weight: 600")}>
              {v.d.base}
            </span>
          </div>
        </div>
        <div style={css("position: relative; height: 26px")}>
          <div style={css("position: absolute; left: 0; right: 0; top: 8px; height: 10px; display: flex; gap: 2px")}>
            {(v.gaugeSegs || []).map((z, z$i) => (<Fragment key={z$i}>
              <span style={css(`height: 10px; flex-grow: ${z.grow}; background: ${z.color}; opacity: 0.4; border-radius: 1px`)}>
              </span>
            </Fragment>))}
          </div>
          <div style={css(`position: absolute; top: 4px; width: 2px; height: 18px; margin-left: -1px; left: ${v.gaugeBase}%; background: var(--tx2)`)}>
          </div>
          {v.gaugeShow ? (<>
            <div className="ns-gauge" style={css(`position: absolute; top: 0; width: 14px; height: 26px; margin-left: -7px; left: ${v.gaugeMark}%; display: flex; flex-direction: column; align-items: center`)}>
              <div style={css("width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid var(--tx)")}>
              </div>
              <div style={css("width: 3px; height: 18px; background: var(--tx)")}>
              </div>
            </div>
          </>) : null}
        </div>
        <div style={css("display: flex; justify-content: space-between; font-size: 11px; color: var(--tx2)")}>
          <span className="ns-num" style={css("font-size: 12px")}>
            {v.d.lo}
          </span>
          <span>
            normal · watch · critical
          </span>
          <span className="ns-num" style={css("font-size: 12px")}>
            {v.d.hi}
          </span>
        </div>
      </div>
      <div style={css("padding: 12px 0 14px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px")}>
        <div style={css("display: flex; justify-content: space-between; align-items: baseline")}>
          <span style={css("font-size: 14px; font-weight: 600")}>
            Last 12 hours
          </span>
          <span style={css("font-size: 11px; color: var(--tx2)")}>
            dashed line is baseline
          </span>
        </div>
        <svg viewBox="0 0 318 70" width="318" height="70" aria-hidden="true" style={css("display: block; overflow: visible")}>
          <path d={v.trendBaseD} style={css("fill: none; stroke: var(--tx2); stroke-width: 1px; stroke-dasharray: 3 4")}>
          </path>
          <path className={v.trendCls} d={v.trendD} style={css(`fill: none; stroke: ${v.d.color}; stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round`)}>
          </path>
        </svg>
      </div>
      <div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line)")}>
        <div style={css("padding: 10px 0; display: flex; flex-direction: column; gap: 2px")}>
          <span style={css("font-size: 11px; color: var(--tx2)")}>
            Battery
          </span>
          <span className="ns-num" style={css(`font-size: 18px; font-weight: 600; color: ${v.d.battColor}`)}>
            {v.d.batt}
          </span>
        </div>
        <div style={css("padding: 10px 0 10px 12px; display: flex; flex-direction: column; gap: 2px; border-left: 1px solid var(--line)")}>
          <span style={css("font-size: 11px; color: var(--tx2)")}>
            Signal
          </span>
          <span style={css("font-size: 15px; font-weight: 600")}>
            {v.d.signal}
          </span>
        </div>
        <div style={css("padding: 10px 0 10px 12px; display: flex; flex-direction: column; gap: 2px; border-left: 1px solid var(--line)")}>
          <span style={css("font-size: 11px; color: var(--tx2)")}>
            Last reading
          </span>
          <span style={css("font-size: 15px; font-weight: 600")}>
            {v.d.last}
          </span>
        </div>
      </div>
    </div>
    <div style={css("padding-top: 14px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px")}>
      <button className="ns-btn ns-pri" onClick={v.walkFromDetail} style={css("height: 50px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600")}>
        Walk there
        <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6">
          </path>
        </svg>
      </button>
      <div style={css("display: flex; gap: 8px")}>
        <button className="ns-btn ns-gh" onClick={v.blinkDet} style={css(`flex-grow: 1; height: 44px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; color: ${v.blinkDetFg}`)}>
          {v.blinkDetLabel}
        </button>
        <button className="ns-btn ns-gh" onClick={v.repairDet} style={css(`flex-grow: 1; height: 44px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 500; color: ${v.repairFg}`)}>
          {v.repairLabel}
        </button>
      </div>
    </div>
  </aside>
  <button className="ns-btn ns-launch" onClick={v.openChat} aria-label="Ask Infrasensor" style={css(`position: absolute; right: 16px; top: ${v.launchTop}; bottom: ${v.launchBottom}; z-index: 19; width: 56px; height: 56px; border-radius: 28px 28px 8px 28px; background: var(--acc); color: var(--accTx); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow)`)}>
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path className="ns-ic" d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-7L7.5 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5zM8.5 11h.01M12 11h.01M15.5 11h.01" style={css("stroke-width: 2px")}>
      </path>
    </svg>
    {v.chatHasUnreadHint ? (<>
      <span style={css("position: absolute; top: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--crit); border: 2px solid var(--bg)")}>
      </span>
    </>) : null}
  </button>
  <div onClick={v.closeChat} aria-hidden="true" style={css(`position: absolute; inset: 0; z-index: 40; background: rgba(8, 20, 20, ${v.chatOverlayOp}); pointer-events: ${v.chatOverlayPE}`)}>
  </div>
  <section role="dialog" aria-label="Ask Infrasensor" style={css(`position: absolute; left: 6px; right: 6px; bottom: 6px; height: 660px; z-index: 41; box-sizing: border-box; background: var(--panel); border-radius: 32px; box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; transform: translateY(${v.chatPx}px); visibility: ${v.chatVis}`)}>
    <div className="ns-grab" onPointerDown={v.chatDown} onPointerMove={v.chatMove} onPointerUp={v.chatUp} onPointerCancel={v.chatUp} style={css("padding: 10px 16px 10px; flex-shrink: 0")}>
      <div style={css("width: 40px; height: 5px; border-radius: 999px; background: var(--line2); margin: 0 auto 12px")}>
      </div>
      <div style={css("display: flex; align-items: center; gap: 10px")}>
        <span style={css("width: 40px; height: 40px; flex-shrink: 0; border-radius: 20px 20px 6px 20px; background: var(--mint); color: var(--tx); display: flex; align-items: center; justify-content: center")}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path className="ns-ic" d="M12 4.5c3.6 0 6.5 2.9 6.5 6.5 0 1.3-.4 2.5-1 3.5M12 4.5C8.4 4.5 5.5 7.4 5.5 11c0 1.3.4 2.5 1 3.5M9 18.5c.9.6 1.9 1 3 1s2.1-.4 3-1M12 9.5v3.5l2 1.5" style={css("stroke-width: 1.8px")}>
            </path>
          </svg>
        </span>
        <span style={css("flex-grow: 1; display: flex; flex-direction: column")}>
          <span className="ns-serif" style={css("font-size: 21px; line-height: 23px; font-weight: 500")}>
            Ask Infrasensor
          </span>
          <span style={css("font-size: 12px; color: var(--tx2)")}>
            Knows every sensor, ticket and technician on this site
          </span>
        </span>
        <button className="ns-btn ns-gh" onClick={v.closeChat} aria-label="Close" style={css("width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path className="ns-ic" d="M6 9l6 6 6-6">
            </path>
          </svg>
        </button>
      </div>
      {v.chatCtxOn ? (<>
        <div className="ns-pop" style={css("margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 6px 0 12px; border-radius: 14px; background: var(--panel2); font-size: 12px; font-weight: 600")}>
          <span style={css(`width: 7px; height: 7px; border-radius: 50%; background: ${v.chatCtxColor}`)}>
          </span>
          Talking about {v.chatCtxName}{' '}
          <button className="ns-btn" onClick={v.clearChatCtx} aria-label="Stop focusing on this sensor" style={css("width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--tx2)")}>
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path className="ns-ic" d="M6.5 6.5l11 11M17.5 6.5l-11 11" style={css("stroke-width: 2.2px")}>
              </path>
            </svg>
          </button>
        </div>
      </>) : null}
    </div>
    <div className="ns-scroll" aria-live="polite" style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column-reverse")}>
      <div style={css("padding: 6px 14px 14px; display: flex; flex-direction: column; gap: 12px")}>
        {(v.chatMsgs || []).map((m, m$i) => (<Fragment key={m$i}>
          <div className="ns-rise" style={css(`display: flex; flex-direction: column; align-items: ${m.align}; gap: 7px`)}>
            <div style={css(`max-width: 86%; padding: 10px 14px; border-radius: ${m.radius}; background: ${m.bg}; color: ${m.fg}; font-size: 14px; line-height: 20px; white-space: pre-line`)}>
              {m.text}
            </div>
            {m.hasChips ? (<>
              <div style={css("display: flex; flex-wrap: wrap; gap: 6px; max-width: 92%")}>
                {(m.chips || []).map((c, c$i) => (<Fragment key={c$i}>
                  <button className={`ns-btn ${c.cls}`} onClick={c.act} style={css("height: 34px; padding: 0 13px; border-radius: 17px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700")}>
                    {c.label}
                  </button>
                </Fragment>))}
              </div>
            </>) : null}
          </div>
        </Fragment>))}
        {v.chatTyping ? (<>
          <div role="status" aria-label="Infrasensor is typing" className="ns-pop" style={css("align-self: flex-start; padding: 12px 15px; border-radius: 20px 20px 20px 6px; background: var(--bg); display: flex; gap: 5px")}>
            <span className="ns-dot" style={css("width: 7px; height: 7px; border-radius: 50%; background: var(--tx2)")}>
            </span>
            <span className="ns-dot" style={css("width: 7px; height: 7px; border-radius: 50%; background: var(--tx2); animation-delay: 150ms")}>
            </span>
            <span className="ns-dot" style={css("width: 7px; height: 7px; border-radius: 50%; background: var(--tx2); animation-delay: 300ms")}>
            </span>
          </div>
        </>) : null}
      </div>
    </div>
    <div style={css("flex-shrink: 0; padding: 0 12px")}>
      <div className="ns-scroll" style={css("display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px")}>
        {(v.chatSugg || []).map((q, q$i) => (<Fragment key={q$i}>
          <button className="ns-btn ns-chip" onClick={q.ask} style={css("flex-shrink: 0; height: 32px; padding: 0 12px; border-radius: 16px; font-size: 12px; font-weight: 600; white-space: nowrap")}>
            {q.text}
          </button>
        </Fragment>))}
      </div>
    </div>
    <form onSubmit={v.sendChat} style={css("flex-shrink: 0; padding: 4px 12px 14px; display: flex; gap: 8px; margin: 0")}>
      <label htmlFor="ns-chat-input" style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>
        Ask about a sensor, ticket or technician
      </label>
      <input id="ns-chat-input" type="text" autoComplete="off" placeholder="Ask about any sensor or ticket" value={v.chatDraft} onChange={v.chatInput} style={css("flex-grow: 1; min-width: 0; height: 48px; box-sizing: border-box; padding: 0 18px; border-radius: 24px; border: 1.5px solid var(--line2); background: var(--bg); color: var(--tx); font: inherit; font-size: 14px")} />
      <button type="submit" className="ns-btn ns-pri" aria-label="Send" style={css("width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
          <path className="ns-ic" d="M12 19V5M5.5 11.5 12 5l6.5 6.5" style={css("stroke-width: 2.2px")}>
          </path>
        </svg>
      </button>
    </form>
  </section>
  <div onClick={v.closeDev} aria-hidden="true" style={css(`position: absolute; inset: 0; z-index: 42; background: rgba(8, 20, 20, ${v.devOverlayOp}); pointer-events: ${v.devOverlayPE}`)}>
  </div>
  <section role="dialog" aria-label={v.devDialogAria} style={css(`position: absolute; left: 6px; right: 6px; bottom: 6px; max-height: 720px; z-index: 43; box-sizing: border-box; background: var(--panel); border-radius: 32px 32px 32px 32px; box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; transform: translateY(${v.devPx}px); visibility: ${v.devVis}`)}>
    <div className="ns-grab" onPointerDown={v.devDown} onPointerMove={v.devMove} onPointerUp={v.devUp} onPointerCancel={v.devUp} style={css("padding: 10px 16px 4px; flex-shrink: 0")}>
      <div style={css("width: 40px; height: 5px; border-radius: 999px; background: var(--line2); margin: 0 auto 12px")}>
      </div>
      <div style={css("display: flex; align-items: center; gap: 12px")}>
        <span style={css("width: 46px; height: 46px; flex-shrink: 0; border-radius: 23px 23px 8px 23px; background: var(--panel2); display: flex; align-items: center; justify-content: center")}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path className="ns-ic" d={v.dv.icon} style={css("stroke-width: 1.8px")}>
            </path>
          </svg>
        </span>
        <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column")}>
          <span className="ns-serif" style={css("font-size: 23px; line-height: 26px; font-weight: 500")}>
            {v.dv.zone}
          </span>
          <span style={css("font-size: 12px; color: var(--tx2)")}>
            <span className="ns-num">
              {v.dv.id}
            </span>
            {' '}· {v.dv.kind} · {v.dv.level}
          </span>
        </span>
        <button className="ns-btn ns-gh" onClick={v.closeDev} aria-label="Close" style={css("width: 38px; height: 38px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path className="ns-ic" d="M6 9l6 6 6-6">
            </path>
          </svg>
        </button>
      </div>
    </div>
    <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding: 10px 16px 18px; display: flex; flex-direction: column; gap: 12px")}>
      <div style={css("flex-shrink: 0; padding: 14px 14px 14px 16px; border-radius: 24px 24px 24px 8px; background: var(--bg); display: flex; align-items: center; gap: 12px")}>
        <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
          <span style={css("display: flex; align-items: center; gap: 7px; font-size: 15px; font-weight: 800")}>
            <span className={v.dv.dotCls} style={css(`width: 9px; height: 9px; border-radius: 50%; background: ${v.dv.dot}`)}>
            </span>
            {v.dv.status}
          </span>
          <span style={css("font-size: 12px; color: var(--tx2)")}>
            {v.dv.meta}
          </span>
        </span>
        <button className="ns-btn ns-sw" role="switch" onClick={v.devToggle} aria-checked={v.dv.on} aria-label={v.dv.swAria} style={css(`position: relative; width: 58px; height: 34px; flex-shrink: 0; border-radius: 17px; background: ${v.dv.swBg}; transition: background-color 220ms`)}>
          <span style={css(`position: absolute; left: 3px; top: 3px; width: 28px; height: 28px; border-radius: 50%; background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.2); transform: translateX(${v.dv.knobX}px); transition: transform 300ms cubic-bezier(.3,1.4,.5,1)`)}>
          </span>
        </button>
      </div>
      <div style={css("flex-shrink: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
        {(v.devActs || []).map((a, a$i) => (<Fragment key={a$i}>
          <button className="ns-btn ns-tile" onClick={a.act} aria-pressed={a.pressed} style={css(`min-height: 64px; box-sizing: border-box; padding: 10px 12px; border-radius: ${a.radius}; background: var(--panel2); border: 2px solid ${a.border}; display: flex; align-items: center; gap: 10px; text-align: left; opacity: ${a.op}`)}>
            <span style={css(`width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%; background: var(--panel); color: ${a.fg}; display: flex; align-items: center; justify-content: center`)}>
              <svg className={a.iconCls} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path className="ns-ic" d={a.icon} style={css("stroke-width: 1.9px")}>
                </path>
              </svg>
            </span>
            <span style={css("font-size: 13px; line-height: 16px; font-weight: 800")}>
              {a.label}
            </span>
          </button>
        </Fragment>))}
      </div>
      {v.devCheckOn ? (<>
        <div className="ns-pop" style={css("flex-shrink: 0; padding: 14px 16px; border-radius: 8px 24px 24px 24px; background: var(--bg)")}>
          <div style={css("display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px")}>
            <span style={css("font-size: 13px; font-weight: 800")}>
              Status report
            </span>
            <span role="status" style={css(`font-size: 12px; font-weight: 700; color: ${v.devCheckFg}`)}>
              {v.devCheckHead}
            </span>
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 8px")}>
            {(v.devChecks || []).map((c, c$i) => (<Fragment key={c$i}>
              <div className="ns-pop" style={css("display: flex; align-items: center; gap: 10px; font-size: 13px")}>
                <span style={css(`width: 22px; height: 22px; flex-shrink: 0; border-radius: 50%; background: ${c.bg}; color: var(--tagTx); display: flex; align-items: center; justify-content: center`)}>
                  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                    <path className="ns-ic" d={c.icon} style={css("stroke-width: 3px")}>
                    </path>
                  </svg>
                </span>
                <span style={css("width: 74px; flex-shrink: 0; font-weight: 700")}>
                  {c.name}
                </span>
                <span style={css("flex-grow: 1; min-width: 0; color: var(--tx2)")}>
                  {c.val}
                </span>
              </div>
            </Fragment>))}
            {v.devChecking ? (<>
              <div style={css("display: flex; gap: 5px; padding: 4px 0 2px 32px")}>
                <span className="ns-dot" style={css("width: 6px; height: 6px; border-radius: 50%; background: var(--tx2)")}>
                </span>
                <span className="ns-dot" style={css("width: 6px; height: 6px; border-radius: 50%; background: var(--tx2); animation-delay: 150ms")}>
                </span>
                <span className="ns-dot" style={css("width: 6px; height: 6px; border-radius: 50%; background: var(--tx2); animation-delay: 300ms")}>
                </span>
              </div>
            </>) : null}
          </div>
          {v.devHintOn ? (<>
            <p className="ns-pop" style={css("margin: 10px 0 0; font-size: 12px; line-height: 17px; color: var(--tx2)")}>
              {v.devHint}
            </p>
          </>) : null}
        </div>
      </>) : null}
      <div style={css("flex-shrink: 0")}>
        <div style={css("display: flex; justify-content: space-between; align-items: baseline; margin: 2px 2px 8px")}>
          <span style={css("font-size: 13px; font-weight: 800")}>
            How often it reports
          </span>
          <span style={css("font-size: 11px; color: var(--tx2)")}>
            Faster uses more battery
          </span>
        </div>
        <div role="group" aria-label="Report rate" style={css(`position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 3px; border-radius: 999px; background: var(--bg); opacity: ${v.devRateOp}`)}>
          <div className="ns-thumb" style={css(`position: absolute; left: 3px; top: 3px; bottom: 3px; width: calc((100% - 6px) / 3); border-radius: 999px; background: var(--acc); transform: translateX(${v.devRateThumb}%)`)}>
          </div>
          {(v.devRates || []).map((r, r$i) => (<Fragment key={r$i}>
            <button className="ns-btn ns-seg" onClick={r.pick} aria-pressed={r.pressed} style={css(`height: 36px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: ${r.fg}`)}>
              {r.name}
            </button>
          </Fragment>))}
        </div>
      </div>
    </div>
  </section>
  <div onClick={v.closePair} aria-hidden="true" style={css(`position: absolute; inset: 0; z-index: 44; background: rgba(8, 20, 20, ${v.pairOverlayOp}); pointer-events: ${v.pairOverlayPE}`)}>
  </div>
  <section role="dialog" aria-label="Pair a device" style={css(`position: absolute; left: 6px; right: 6px; bottom: 6px; height: 640px; z-index: 45; box-sizing: border-box; background: var(--panel); border-radius: 32px; box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; transform: translateY(${v.pairPx}px); visibility: ${v.pairVis}`)}>
    <div className="ns-grab" onPointerDown={v.pairDown} onPointerMove={v.pairMove} onPointerUp={v.pairUp} onPointerCancel={v.pairUp} style={css("padding: 10px 16px 4px; flex-shrink: 0")}>
      <div style={css("width: 40px; height: 5px; border-radius: 999px; background: var(--line2); margin: 0 auto 12px")}>
      </div>
      <div style={css("display: flex; align-items: center; gap: 10px")}>
        <span className="ns-serif" style={css("flex-grow: 1; font-size: 23px; line-height: 26px; font-weight: 500")}>
          Pair a device
        </span>
        <button className="ns-btn ns-gh" onClick={v.closePair} aria-label="Close" style={css("width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path className="ns-ic" d="M6 9l6 6 6-6">
            </path>
          </svg>
        </button>
      </div>
    </div>
    {v.pairEnter ? (<>
      <div className="ns-scroll ns-enterA" style={css("flex-grow: 1; min-height: 0; padding: 10px 16px 18px; display: flex; flex-direction: column; gap: 14px")}>
        <div style={css("flex-shrink: 0; padding: 16px; border-radius: 28px 28px 28px 10px; background: var(--mint); color: var(--tx)")}>
          <div style={css("font-size: 12px; font-weight: 800")}>
            Your site code
          </div>
          <div style={css("display: flex; align-items: center; gap: 10px; margin-top: 4px")}>
            <span className="ns-num" style={css("flex-grow: 1; font-size: 32px; line-height: 38px; font-weight: 700; letter-spacing: 0.06em")}>
              {v.siteCode}
            </span>
            <button className="ns-btn ns-gh" onClick={v.copyCode} style={css("height: 36px; padding: 0 14px; border-radius: 18px; font-size: 13px; font-weight: 800; background: var(--panel)")}>
              Copy
            </button>
          </div>
          <div style={css("font-size: 12px; line-height: 17px; margin-top: 6px; opacity: 0.85")}>
            Every device paired with this code shows up on this dashboard and nowhere else.
          </div>
        </div>
        <ol style={css("flex-shrink: 0; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px")}>
          <li style={css("display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 18px")}>
            <span className="ns-num" style={css("width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; background: var(--panel2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800")}>
              1
            </span>
            <span>
              Pull the tab on the sensor. Its light starts blinking.
            </span>
          </li>
          <li style={css("display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 18px")}>
            <span className="ns-num" style={css("width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; background: var(--panel2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800")}>
              2
            </span>
            <span>
              Scan the code on its back, or type it in.
            </span>
          </li>
        </ol>
        <form onSubmit={v.pairGo} style={css("flex-shrink: 0; margin: 0; display: flex; flex-direction: column; gap: 10px")}>
          <label htmlFor="ns-dev-code" style={css("font-size: 13px; font-weight: 800")}>
            Device code
          </label>
          <div style={css("display: flex; gap: 8px")}>
            <input id="ns-dev-code" type="text" autoComplete="off" spellcheck="false" placeholder="e.g. RH-V9-2F41" value={v.pairCode} onChange={v.setPairCode} style={css("flex-grow: 1; min-width: 0; height: 52px; box-sizing: border-box; padding: 0 18px; border-radius: 26px; border: 1.5px solid var(--line2); background: var(--bg); color: var(--tx); font: inherit; font-size: 16px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase")} />
            <button type="button" className="ns-btn ns-gh" onClick={v.pairScan} aria-label="Scan the code with the camera" style={css("width: 52px; height: 52px; flex-shrink: 0; border-radius: 26px 26px 8px 26px; display: flex; align-items: center; justify-content: center")}>
              <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                <path className="ns-ic" d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 9v6M11 9v6M14 9v6M17 9v6" style={css("stroke-width: 1.9px")}>
                </path>
              </svg>
            </button>
          </div>
          <button type="submit" className="ns-btn ns-pri" aria-disabled={v.pairDis} style={css(`height: 54px; border-radius: 27px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 800; opacity: ${v.pairBtnOp}; transition: opacity 200ms`)}>
            Pair to {v.siteCode}
            <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
              </path>
            </svg>
          </button>
        </form>
      </div>
    </>) : null}
    {v.pairWorking ? (<>
      <div className="ns-enterA" style={css("flex-grow: 1; min-height: 0; padding: 10px 24px 24px; display: flex; flex-direction: column; align-items: center")}>
        <div style={css("position: relative; width: 170px; height: 170px; margin: 18px 0 14px; display: flex; align-items: center; justify-content: center")}>
          <span className="ns-ring" style={css("position: absolute; inset: 40px; border-radius: 50%; border: 2px solid var(--acc)")}>
          </span>
          <span className="ns-ring" style={css("position: absolute; inset: 40px; border-radius: 50%; border: 2px solid var(--acc); animation-delay: 0.7s")}>
          </span>
          <span className="ns-il-float" style={css("width: 76px; height: 76px; border-radius: 38px 38px 12px 38px; background: var(--acc); color: var(--accTx); display: flex; align-items: center; justify-content: center")}>
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
              <path className="ns-ic" d="M12 12m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" style={css("stroke-width: 1.8px")}>
              </path>
            </svg>
          </span>
        </div>
        <div className="ns-serif" style={css("font-size: 22px; line-height: 26px; font-weight: 500; text-align: center")}>
          Linking {v.pairDevId}
        </div>
        <div style={css("font-size: 13px; color: var(--tx2); margin-top: 4px")}>
          Keep the phone near the sensor
        </div>
        <div style={css("align-self: stretch; margin-top: 22px; display: flex; flex-direction: column; gap: 10px")}>
          {(v.pairSteps || []).map((p, p$i) => (<Fragment key={p$i}>
            <div style={css(`display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; opacity: ${p.op}; transition: opacity 300ms`)}>
              <span style={css(`width: 26px; height: 26px; flex-shrink: 0; border-radius: 50%; background: ${p.bg}; color: var(--tagTx); display: flex; align-items: center; justify-content: center; transition: background-color 300ms`)}>
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" style={css(`transform: scale(${p.checkS}); transition: transform 300ms cubic-bezier(.3,1.6,.5,1)`)}>
                  <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 3px")}>
                  </path>
                </svg>
              </span>
              {p.text}{' '}
            </div>
          </Fragment>))}
        </div>
      </div>
    </>) : null}
    {v.pairDoneOn ? (<>
      <div className="ns-enterA" style={css("flex-grow: 1; min-height: 0; padding: 10px 20px 22px; display: flex; flex-direction: column")}>
        <div style={css("flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center")}>
          <span className="ns-pop" style={css("width: 84px; height: 84px; border-radius: 42px 42px 14px 42px; background: var(--ok); color: var(--tagTx); display: flex; align-items: center; justify-content: center")}>
            <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 2.6px")}>
              </path>
            </svg>
          </span>
          <div className="ns-serif" style={css("margin-top: 18px; font-size: 26px; line-height: 30px; font-weight: 500")}>
            {v.pairedName} is online
          </div>
          <div style={css("margin-top: 6px; font-size: 13px; line-height: 19px; color: var(--tx2); max-width: 280px")}>
            {v.pairedMeta}
          </div>
        </div>
        <div style={css("display: flex; flex-direction: column; gap: 8px")}>
          <button className="ns-btn ns-pri" onClick={v.pairShowMap} style={css("height: 54px; border-radius: 27px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 800")}>
            Show where it goes
            <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
              </path>
            </svg>
          </button>
          <button className="ns-btn ns-gh" onClick={v.pairAnother} style={css("height: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700")}>
            Pair another
          </button>
        </div>
      </div>
    </>) : null}
  </section>
  {v.isOnb ? (<>
    <div className="ns-onb" style={css("position: absolute; inset: 0; z-index: 60; background: var(--bg); overflow: hidden; display: flex; flex-direction: column")}>
      {v.isIntro ? (<>
        <div className="ns-enter" style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
          <header style={css("padding: 18px 20px 4px; display: flex; align-items: center; gap: 10px; flex-shrink: 0")}>
            <span style={css("width: 36px; height: 36px; border-radius: 18px 18px 6px 18px; background: var(--mint); color: var(--tx); display: flex; align-items: center; justify-content: center")}>
              <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
                <path className="ns-ic" d="M12 4.5c3.6 0 6.5 2.9 6.5 6.5 0 1.3-.4 2.5-1 3.5M12 4.5C8.4 4.5 5.5 7.4 5.5 11c0 1.3.4 2.5 1 3.5M9 18.5c.9.6 1.9 1 3 1s2.1-.4 3-1M12 9.5v3.5l2 1.5" style={css("stroke-width: 1.8px")}>
                </path>
              </svg>
            </span>
            <span className="ns-serif" style={css("font-size: 21px; font-style: italic; font-weight: 500")}>
              Infrasensor
            </span>
            <span style={css("flex-grow: 1")}>
            </span>
            <button className="ns-btn ns-chip" onClick={v.goSignup} style={css("height: 34px; padding: 0 15px; border-radius: 17px; font-size: 13px; font-weight: 700")}>
              Skip
            </button>
          </header>
          <div className="ns-grab" onPointerDown={v.introDown} onPointerUp={v.introUp} onPointerCancel={v.introUp} aria-roledescription="carousel" aria-label="What Infrasensor does" style={css("position: relative; flex-grow: 1; min-height: 0; overflow: hidden")}>
            <section className="ns-slide" aria-hidden={v.hid0} style={css(`position: absolute; inset: 0; padding: 10px 20px 0; transform: translateX(${v.sl0}%)`)}>
              <div className="ns-slideart" style={css(`height: 322px; border-radius: 46px 46px 120px 46px; background: var(--panel); position: relative; overflow: hidden; transform: ${v.art0}`)}>
                <div style={css("position: absolute; inset: 22px 12px 8px")}>
                  <svg viewBox="0 0 300 260" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                    <path d="M34 150C18 92 72 30 146 34c74 4 126 44 122 112-4 68-64 100-128 96C78 238 48 206 34 150Z" style={css("fill: var(--mint); opacity: 0.6")}>
                    </path>
                    <path className="ns-ii" d="M20 66q18-14 42-10M28 80q14-9 30-7M262 186q14 4 22 16">
                    </path>
                    <path className="ns-ii" d="M36 222h232">
                    </path>
                    <path className="ns-is" d="M48 222c-5-20 3-36 14-42 3 15-3 31-14 42z" style={css("fill: var(--acc)")}>
                    </path>
                    <path className="ns-is" d="M58 222c6-15 19-22 30-19-4 13-17 19-30 19z" style={css("fill: var(--mint)")}>
                    </path>
                    <rect className="ns-is" x="66" y="56" width="124" height="12" rx="4" style={css("fill: var(--slate)")}>
                    </rect>
                    <rect className="ns-is" x="72" y="68" width="112" height="154" rx="4" style={css("fill: var(--panel)")}>
                    </rect>
                    <path d="M92 70v152" style={css("stroke: var(--slate); stroke-width: 7px")}>
                    </path>
                    <path className="ns-ii" d="M72 120h112M72 172h112">
                    </path>
                    <rect className="ns-is" x="112" y="84" width="24" height="22" rx="4" style={css("fill: var(--mint)")}>
                    </rect>
                    <rect className="ns-is" x="146" y="84" width="24" height="22" rx="4" style={css("fill: var(--mint)")}>
                    </rect>
                    <rect className="ns-is" x="112" y="136" width="24" height="22" rx="4" style={css("fill: var(--mint)")}>
                    </rect>
                    <rect className="ns-is" x="146" y="136" width="24" height="22" rx="4" style={css("fill: var(--mint)")}>
                    </rect>
                    <rect className="ns-is" x="118" y="188" width="26" height="34" rx="4" style={css("fill: var(--acc)")}>
                    </rect>
                    <rect className="ns-is" x="146" y="36" width="30" height="20" rx="4" style={css("fill: var(--panel2)")}>
                    </rect>
                    <circle className="ns-is" cx="161" cy="46" r="6" style={css("fill: var(--panel)")}>
                    </circle>
                    <circle className="ns-il-pulse" cx="161" cy="30" r="5" style={css("fill: none; stroke: var(--acc); stroke-width: 2.5px")}>
                    </circle>
                    <circle className="ns-is" cx="161" cy="30" r="5" style={css("fill: var(--acc)")}>
                    </circle>
                    <circle className="ns-il-pulse" cx="92" cy="146" r="5" style={css("fill: none; stroke: var(--acc); stroke-width: 2.5px; animation-delay: 0.8s")}>
                    </circle>
                    <circle className="ns-is" cx="92" cy="146" r="5" style={css("fill: var(--acc)")}>
                    </circle>
                    <circle className="ns-il-pulse" cx="176" cy="200" r="5" style={css("fill: none; stroke: var(--crit); stroke-width: 2.5px; animation-delay: 1.6s")}>
                    </circle>
                    <circle className="ns-is" cx="176" cy="200" r="5" style={css("fill: var(--crit)")}>
                    </circle>
                    <path d="M211 222l3-50h28l3 50h-12l-4-36-4 36z" style={css("fill: var(--hair)")}>
                    </path>
                    <path d="M204 223h18M234 223h18" style={css("stroke: var(--hair); stroke-width: 6px; stroke-linecap: round")}>
                    </path>
                    <path className="ns-is" d="M205 178c0-30 10-42 22-42s22 12 22 42z" style={css("fill: var(--acc)")}>
                    </path>
                    <path d="M244 150Q258 142 252 124" style={css("fill: none; stroke: var(--tx); stroke-width: 12px; stroke-linecap: round")}>
                    </path>
                    <path d="M244 150Q258 142 252 124" style={css("fill: none; stroke: var(--acc); stroke-width: 7.5px; stroke-linecap: round")}>
                    </path>
                    <circle className="ns-is" cx="227" cy="118" r="13" style={css("fill: #E7B08A")}>
                    </circle>
                    <path d="M213 117c-1-15 8-23 18-21 10 1 13 10 10 17-5-5-12-6-18-4-5 1-8 4-10 8z" style={css("fill: var(--hair)")}>
                    </path>
                    <circle cx="233" cy="120" r="1.5" style={css("fill: var(--hair)")}>
                    </circle>
                    <path className="ns-ii" d="M229 126q3 2 6 0" style={css("stroke-width: 1.6px")}>
                    </path>
                    <rect x="244" y="100" width="15" height="24" rx="3" style={css("fill: var(--hair)")}>
                    </rect>
                    <rect x="246.5" y="103" width="10" height="17" rx="1.5" style={css("fill: var(--acc)")}>
                    </rect>
                    <circle className="ns-is" cx="251" cy="124" r="5" style={css("fill: #E7B08A")}>
                    </circle>
                    <g className="ns-il-float">
                      <rect className="ns-is" x="232" y="62" width="58" height="28" rx="14" style={css("fill: var(--panel)")}>
                      </rect>
                      <path className="ns-is" d="M246 90l-4 8 10-8" style={css("fill: var(--panel)")}>
                      </path>
                      <circle cx="245" cy="76" r="4.5" style={css("fill: var(--crit)")}>
                      </circle>
                      <path className="ns-ii" d="M255 73h24M255 80h15" style={css("stroke-width: 2px")}>
                      </path>
                    </g>
                  </svg>
                </div>
              </div>
              <div className={v.txt0} style={css("padding: 24px 4px 0")}>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  01 · Always listening
                </div>
                <h2 className="ns-serif" style={css("margin: 8px 0 10px; font-size: 36px; line-height: 38px; font-weight: 500")}>
                  Your building,{' '}
                  <em style={css("font-weight: 400")}>
                    listening.
                  </em>
                </h2>
                <p style={css("margin: 0; font-size: 15px; line-height: 22px; color: var(--tx2)")}>
                  Small sensors inside roofs, pipes, panels and piers report how things are really doing, around the clock.
                </p>
              </div>
            </section>
            <section className="ns-slide" aria-hidden={v.hid1} style={css(`position: absolute; inset: 0; padding: 10px 20px 0; transform: translateX(${v.sl1}%)`)}>
              <div className="ns-slideart" style={css(`height: 322px; border-radius: 120px 46px 46px 46px; background: var(--panel2); position: relative; overflow: hidden; transform: ${v.art1}`)}>
                <div style={css("position: absolute; inset: 22px 12px 8px")}>
                  <svg viewBox="0 0 300 260" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                    <path d="M28 124C28 62 92 26 164 32s116 52 108 122-72 94-142 88S28 186 28 124Z" style={css("fill: var(--mint); opacity: 0.6")}>
                    </path>
                    <path className="ns-ii" d="M238 42q20 2 32 18M246 30q14 2 24 12">
                    </path>
                    <path d="M30 96h128q40 0 40 40v104" style={css("fill: none; stroke: var(--tx); stroke-width: 34px")}>
                    </path>
                    <path d="M30 96h128q40 0 40 40v104" style={css("fill: none; stroke: var(--slate); stroke-width: 29px")}>
                    </path>
                    <path d="M30 88h124" style={css("stroke: var(--panel); stroke-width: 3px; opacity: 0.45; stroke-linecap: round")}>
                    </path>
                    <rect className="ns-is" x="80" y="72" width="13" height="48" rx="3" style={css("fill: var(--panel2)")}>
                    </rect>
                    <rect className="ns-is" x="174" y="184" width="48" height="13" rx="3" style={css("fill: var(--panel2)")}>
                    </rect>
                    <path className="ns-il-wave" d="M126 58q9-9 18 0" style={css("fill: none; stroke: var(--acc); stroke-width: 3px; stroke-linecap: round")}>
                    </path>
                    <path className="ns-il-wave" d="M119 47q16-15 32 0" style={css("fill: none; stroke: var(--acc); stroke-width: 3px; stroke-linecap: round; animation-delay: 0.25s")}>
                    </path>
                    <path className="ns-il-wave" d="M112 36q23-21 46 0" style={css("fill: none; stroke: var(--acc); stroke-width: 3px; stroke-linecap: round; animation-delay: 0.5s")}>
                    </path>
                    <rect className="ns-is" x="119" y="68" width="32" height="56" rx="9" style={css("fill: var(--acc)")}>
                    </rect>
                    <circle className="ns-il-blinkdot" cx="135" cy="83" r="4" style={css("fill: var(--crit)")}>
                    </circle>
                    <path className="ns-ii" d="M127 100h16M127 108h10" style={css("stroke-width: 2px")}>
                    </path>
                    <path className="ns-ii" d="M214 124l10-6M216 132l11 1M213 139l8 7" style={css("stroke: var(--acc); stroke-width: 2.5px")}>
                    </path>
                    <path className="ns-is ns-il-drip" d="M210 136q7 10 0 16q-7-6 0-16z" style={css("fill: var(--acc); stroke-width: 1.8px")}>
                    </path>
                    <path className="ns-is ns-il-drip" d="M220 136q6 9 0 14q-6-5 0-14z" style={css("fill: var(--acc); stroke-width: 1.8px; animation-delay: 0.9s")}>
                    </path>
                    <ellipse className="ns-is" cx="224" cy="236" rx="38" ry="8" style={css("fill: var(--acc); opacity: 0.55")}>
                    </ellipse>
                    <g className="ns-il-float" style={css("animation-delay: 0.6s")}>
                      <rect className="ns-is" x="30" y="148" width="108" height="74" rx="16" style={css("fill: var(--panel)")}>
                      </rect>
                      <circle cx="46" cy="164" r="5" style={css("fill: var(--crit)")}>
                      </circle>
                      <path className="ns-ii" d="M58 164h46" style={css("stroke-width: 2px")}>
                      </path>
                      <rect x="46" y="194" width="10" height="14" rx="2" style={css("fill: var(--mint)")}>
                      </rect>
                      <rect x="62" y="188" width="10" height="20" rx="2" style={css("fill: var(--mint)")}>
                      </rect>
                      <rect x="78" y="182" width="10" height="26" rx="2" style={css("fill: var(--acc)")}>
                      </rect>
                      <rect x="94" y="178" width="10" height="30" rx="2" style={css("fill: var(--acc)")}>
                      </rect>
                      <rect x="110" y="172" width="10" height="36" rx="2" style={css("fill: var(--crit)")}>
                      </rect>
                    </g>
                  </svg>
                </div>
              </div>
              <div className={v.txt1} style={css("padding: 24px 4px 0")}>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  02 · Caught early
                </div>
                <h2 className="ns-serif" style={css("margin: 8px 0 10px; font-size: 36px; line-height: 38px; font-weight: 500")}>
                  Catch the leak,{' '}
                  <em style={css("font-weight: 400")}>
                    not the flood.
                  </em>
                </h2>
                <p style={css("margin: 0; font-size: 15px; line-height: 22px; color: var(--tx2)")}>
                  When a pipe starts to hiss or a roof starts holding water, you hear about it right away, with a plain explanation of what is going on.
                </p>
              </div>
            </section>
            <section className="ns-slide" aria-hidden={v.hid2} style={css(`position: absolute; inset: 0; padding: 10px 20px 0; transform: translateX(${v.sl2}%)`)}>
              <div className="ns-slideart" style={css(`height: 322px; border-radius: 46px 120px 46px 46px; background: var(--panel); position: relative; overflow: hidden; transform: ${v.art2}`)}>
                <div style={css("position: absolute; inset: 22px 12px 8px")}>
                  <svg viewBox="0 0 300 260" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                    <path d="M40 138C26 76 88 28 162 34s118 58 106 126-72 86-140 82S54 200 40 138Z" style={css("fill: var(--mint); opacity: 0.6")}>
                    </path>
                    <g transform="rotate(-7 170 110)">
                      <rect className="ns-is" x="86" y="30" width="182" height="152" rx="20" style={css("fill: var(--panel)")}>
                      </rect>
                      <path d="M86 94h182M156 30v152" style={css("stroke: var(--line2); stroke-width: 6px; opacity: 0.6")}>
                      </path>
                      <rect x="100" y="44" width="46" height="38" rx="8" style={css("fill: var(--mint)")}>
                      </rect>
                      <rect x="166" y="44" width="88" height="38" rx="8" style={css("fill: var(--mint)")}>
                      </rect>
                      <rect x="166" y="106" width="40" height="62" rx="8" style={css("fill: var(--mint)")}>
                      </rect>
                      <rect x="100" y="106" width="46" height="62" rx="8" style={css("fill: var(--panel2)")}>
                      </rect>
                      <path className="ns-il-march" d="M122 170C140 150 152 150 156 128S186 98 224 94" style={css("fill: none; stroke: var(--acc); stroke-width: 4.5px; stroke-linecap: round")}>
                      </path>
                      <circle className="ns-is" cx="122" cy="170" r="7" style={css("fill: var(--acc)")}>
                      </circle>
                      <g className="ns-il-float">
                        <path className="ns-is" d="M224 58a14 14 0 0 1 14 14c0 12-14 26-14 26s-14-14-14-26a14 14 0 0 1 14-14z" style={css("fill: var(--crit)")}>
                        </path>
                        <circle cx="224" cy="72" r="5" style={css("fill: var(--panel)")}>
                        </circle>
                      </g>
                    </g>
                    <path className="ns-ii" d="M24 236h120M160 236h40">
                    </path>
                    <g className="ns-il-bob">
                      <path className="ns-il-legB" d="M66 196l-8 36h-11" style={css("fill: none; stroke: var(--hair); stroke-width: 9px; stroke-linecap: round; stroke-linejoin: round; transform-origin: 66px 196px")}>
                      </path>
                      <path className="ns-il-legA" d="M70 196l8 36h11" style={css("fill: none; stroke: var(--hair); stroke-width: 9px; stroke-linecap: round; stroke-linejoin: round; transform-origin: 70px 196px")}>
                      </path>
                      <path className="ns-is" d="M50 202c-2-32 6-48 19-48s20 14 18 48z" style={css("fill: var(--panel2)")}>
                      </path>
                      <path d="M54 172l-12 22" style={css("fill: none; stroke: var(--tx); stroke-width: 11px; stroke-linecap: round")}>
                      </path>
                      <path d="M54 172l-12 22" style={css("fill: none; stroke: var(--panel2); stroke-width: 6.5px; stroke-linecap: round")}>
                      </path>
                      <path d="M82 172q14-2 16-18" style={css("fill: none; stroke: var(--tx); stroke-width: 11px; stroke-linecap: round")}>
                      </path>
                      <path d="M82 172q14-2 16-18" style={css("fill: none; stroke: var(--panel2); stroke-width: 6.5px; stroke-linecap: round")}>
                      </path>
                      <circle className="ns-is" cx="70" cy="138" r="12.5" style={css("fill: #8D5A3F")}>
                      </circle>
                      <path d="M57 136c-2-13 6-21 15-20 9 0 13 7 11 13-4-4-10-5-15-2-4 2-7 5-11 9z" style={css("fill: var(--hair)")}>
                      </path>
                      <rect x="92" y="130" width="13" height="21" rx="3" style={css("fill: var(--hair)")}>
                      </rect>
                      <rect x="94.5" y="133" width="8" height="14" rx="1.5" style={css("fill: var(--acc)")}>
                      </rect>
                      <circle className="ns-is" cx="98" cy="153" r="4.5" style={css("fill: #8D5A3F")}>
                      </circle>
                    </g>
                  </svg>
                </div>
              </div>
              <div className={v.txt2} style={css("padding: 24px 4px 0")}>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  03 · Straight there
                </div>
                <h2 className="ns-serif" style={css("margin: 8px 0 10px; font-size: 36px; line-height: 38px; font-weight: 500")}>
                  Walk right{' '}
                  <em style={css("font-weight: 400")}>
                    to the problem.
                  </em>
                </h2>
                <p style={css("margin: 0; font-size: 15px; line-height: 22px; color: var(--tx2)")}>
                  Pull out your phone and follow the route to the exact vent, pipe or panel. The sensor can even blink so you spot it.
                </p>
              </div>
            </section>
            <section className="ns-slide" aria-hidden={v.hid3} style={css(`position: absolute; inset: 0; padding: 10px 20px 0; transform: translateX(${v.sl3}%)`)}>
              <div className="ns-slideart" style={css(`height: 322px; border-radius: 46px 46px 46px 120px; background: var(--panel2); position: relative; overflow: hidden; transform: ${v.art3}`)}>
                <div style={css("position: absolute; inset: 22px 12px 8px")}>
                  <svg viewBox="0 0 300 260" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                    <path d="M36 140C24 78 84 30 156 36s124 48 116 116-66 94-136 88S48 204 36 140Z" style={css("fill: var(--mint); opacity: 0.6")}>
                    </path>
                    <path className="ns-ii" d="M258 96q16 6 22 22M266 84q12 4 18 16">
                    </path>
                    <g className="ns-il-pop">
                      <rect className="ns-is" x="22" y="40" width="118" height="42" rx="20" style={css("fill: var(--panel)")}>
                      </rect>
                      <path className="ns-is" d="M44 82l-4 10 14-10" style={css("fill: var(--panel)")}>
                      </path>
                      <path className="ns-ii" d="M40 56h76M40 66h48" style={css("stroke-width: 2px")}>
                      </path>
                    </g>
                    <g className="ns-il-pop" style={css("animation-delay: 0.9s")}>
                      <rect className="ns-is" x="44" y="100" width="126" height="58" rx="22" style={css("fill: var(--acc)")}>
                      </rect>
                      <path d="M62 118h88M62 129h66M62 140h44" style={css("stroke: var(--panel); stroke-width: 3px; stroke-linecap: round")}>
                      </path>
                    </g>
                    <g className="ns-il-pop" style={css("animation-delay: 1.8s")}>
                      <circle className="ns-is" cx="166" cy="98" r="15" style={css("fill: var(--ok)")}>
                      </circle>
                      <path d="M159 98l5 5 9-10" style={css("fill: none; stroke: var(--panel); stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round")}>
                      </path>
                    </g>
                    <path className="ns-is" d="M168 176l14-14h94l-14 14z" style={css("fill: var(--panel2)")}>
                    </path>
                    <path className="ns-is" d="M262 176l14-14v60l-14 14z" style={css("fill: var(--acc)")}>
                    </path>
                    <rect className="ns-is" x="168" y="176" width="94" height="60" rx="4" style={css("fill: var(--mint)")}>
                    </rect>
                    <path d="M208 172v38h-9M226 172v38h9" style={css("fill: none; stroke: var(--hair); stroke-width: 9px; stroke-linecap: round; stroke-linejoin: round")}>
                    </path>
                    <path className="ns-is" d="M196 180c0-32 8-46 21-46s21 14 21 46z" style={css("fill: var(--slate)")}>
                    </path>
                    <circle className="ns-is" cx="217" cy="120" r="13" style={css("fill: #E7B08A")}>
                    </circle>
                    <circle cx="226" cy="104" r="6.5" style={css("fill: var(--hair)")}>
                    </circle>
                    <path d="M203 119c0-13 7-19 15-19s13 6 13 14c-5-4-12-5-18-3-4 1-7 4-10 8z" style={css("fill: var(--hair)")}>
                    </path>
                    <circle cx="222" cy="122" r="1.5" style={css("fill: var(--hair)")}>
                    </circle>
                    <path className="ns-is" d="M186 170l7-24h34l-7 24z" style={css("fill: var(--panel)")}>
                    </path>
                    <path d="M182 171h44" style={css("stroke: var(--hair); stroke-width: 3.5px; stroke-linecap: round")}>
                    </path>
                    <path className="ns-il-twinkle" d="M262 50l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={css("fill: var(--acc)")}>
                    </path>
                    <path className="ns-il-twinkle" d="M40 196l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" style={css("fill: var(--acc); animation-delay: 0.7s")}>
                    </path>
                  </svg>
                </div>
              </div>
              <div className={v.txt3} style={css("padding: 24px 4px 0")}>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  04 · Plain answers
                </div>
                <h2 className="ns-serif" style={css("margin: 8px 0 10px; font-size: 36px; line-height: 38px; font-weight: 500")}>
                  No expert{' '}
                  <em style={css("font-weight: 400")}>
                    required.
                  </em>
                </h2>
                <p style={css("margin: 0; font-size: 15px; line-height: 22px; color: var(--tx2)")}>
                  Ask about any sensor in everyday words. Get the cause, the fix and the right person to send.
                </p>
              </div>
            </section>
          </div>
          <div role="tablist" aria-label="Slides" style={css("display: flex; justify-content: center; gap: 6px; padding: 6px 0 2px; flex-shrink: 0")}>
            {(v.introDots || []).map((d, d$i) => (<Fragment key={d$i}>
              <button className="ns-btn" role="tab" aria-selected={d.sel} aria-label={d.aria} onClick={d.pick} style={css("height: 22px; display: flex; align-items: center")}>
                <span className="ns-pdot" style={css(`display: block; height: 7px; border-radius: 4px; width: ${d.w}px; background: ${d.bg}`)}>
                </span>
              </button>
            </Fragment>))}
          </div>
          <div style={css("padding: 10px 20px 24px; display: flex; flex-direction: column; gap: 6px; flex-shrink: 0")}>
            <button className="ns-btn ns-pri" onClick={v.introPrimary} style={css("height: 58px; border-radius: 29px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 17px; font-weight: 800")}>
              {v.introCta}
              <svg className="ns-nudge" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
                <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
                </path>
              </svg>
            </button>
            <button className="ns-btn" onClick={v.goLogin} style={css("height: 38px; font-size: 14px; font-weight: 600; text-align: center; color: var(--tx2)")}>
              Skip setup ·{' '}
              <span style={css("color: var(--tx); text-decoration: underline; text-underline-offset: 3px")}>
                Go to the dashboard
              </span>
            </button>
          </div>
        </div>
      </>) : null}
      {v.isAuth ? (<>
        <div className={v.scrAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
          <div style={css("position: relative; height: 262px; flex-shrink: 0; background: var(--panel); border-radius: 0 0 60px 60px / 0 0 36px 36px; overflow: hidden")}>
            <button className="ns-btn ns-gh" onClick={v.goIntro} aria-label="Back to the introduction" style={css("position: absolute; left: 16px; top: 16px; z-index: 2; width: 40px; height: 40px; border-radius: 50%; background: var(--panel); display: flex; align-items: center; justify-content: center")}>
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path className="ns-ic" d="M15 6l-6 6 6 6">
                </path>
              </svg>
            </button>
            <div className="ns-pop" style={css("position: absolute; left: 14px; right: 14px; bottom: 10px; height: 196px")}>
              <svg viewBox="0 0 360 190" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                <circle cx="296" cy="50" r="26" style={css("fill: var(--mint)")}>
                </circle>
                <path className="ns-ii" d="M18 60q20-12 40-6M26 72q14-8 28-4">
                </path>
                <path className="ns-ii" d="M20 178h320">
                </path>
                <rect className="ns-is" x="44" y="92" width="64" height="86" rx="6" style={css("fill: var(--panel)")}>
                </rect>
                <path className="ns-ii" d="M58 110h12M82 110h12M58 128h12M82 128h12M58 146h12M82 146h12">
                </path>
                <rect className="ns-is" x="116" y="50" width="80" height="128" rx="6" style={css("fill: var(--mint)")}>
                </rect>
                <rect className="ns-is" x="130" y="66" width="20" height="18" rx="4" style={css("fill: var(--panel)")}>
                </rect>
                <rect className="ns-is" x="162" y="66" width="20" height="18" rx="4" style={css("fill: var(--panel)")}>
                </rect>
                <rect className="ns-is" x="130" y="98" width="20" height="18" rx="4" style={css("fill: var(--panel)")}>
                </rect>
                <rect className="ns-is" x="162" y="98" width="20" height="18" rx="4" style={css("fill: var(--panel)")}>
                </rect>
                <rect className="ns-is" x="144" y="140" width="24" height="38" rx="4" style={css("fill: var(--acc)")}>
                </rect>
                <rect className="ns-is" x="204" y="112" width="56" height="66" rx="6" style={css("fill: var(--panel2)")}>
                </rect>
                <path className="ns-ii" d="M216 128h32M216 144h32M216 160h20">
                </path>
                <circle className="ns-il-pulse" cx="156" cy="50" r="5" style={css("fill: none; stroke: var(--acc); stroke-width: 2.5px")}>
                </circle>
                <circle className="ns-is" cx="156" cy="50" r="5" style={css("fill: var(--acc)")}>
                </circle>
                <circle className="ns-il-pulse" cx="76" cy="92" r="4.5" style={css("fill: none; stroke: var(--acc); stroke-width: 2.5px; animation-delay: 1s")}>
                </circle>
                <circle className="ns-is" cx="76" cy="92" r="4.5" style={css("fill: var(--acc)")}>
                </circle>
                <path d="M280 178l2-38h22l2 38h-10l-3-26-3 26z" style={css("fill: var(--hair)")}>
                </path>
                <path className="ns-is" d="M274 144c0-26 8-36 19-36s19 10 19 36z" style={css("fill: var(--acc)")}>
                </path>
                <g className="ns-il-hand" style={css("transform-origin: 306px 124px")}>
                  <path d="M306 124q12-10 12-28" style={css("fill: none; stroke: var(--tx); stroke-width: 11px; stroke-linecap: round")}>
                  </path>
                  <path d="M306 124q12-10 12-28" style={css("fill: none; stroke: var(--acc); stroke-width: 6.5px; stroke-linecap: round")}>
                  </path>
                  <circle className="ns-is" cx="318" cy="92" r="5.5" style={css("fill: #8D5A3F")}>
                  </circle>
                </g>
                <circle className="ns-is" cx="293" cy="92" r="12" style={css("fill: #8D5A3F")}>
                </circle>
                <path d="M280 90c-1-12 6-19 14-18 9 0 12 7 10 12-4-3-9-4-13-2-4 2-7 4-11 8z" style={css("fill: var(--hair)")}>
                </path>
                <path className="ns-is" d="M326 178c-5-16 2-28 11-33 3 12-2 25-11 33z" style={css("fill: var(--acc)")}>
                </path>
              </svg>
            </div>
          </div>
          <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding: 22px 22px 24px")}>
            <h1 className="ns-serif" style={css("margin: 0; font-size: 32px; line-height: 36px; font-weight: 500")}>
              {v.authTitle}
            </h1>
            <p style={css("margin: 6px 0 16px; font-size: 14px; line-height: 20px; color: var(--tx2)")}>
              {v.authSub}
            </p>
            <div role="group" aria-label="Sign up or log in" style={css("position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 4px; border-radius: 999px; background: var(--panel2)")}>
              <div className="ns-thumb" style={css(`position: absolute; left: 4px; top: 4px; bottom: 4px; width: calc((100% - 8px) / 2); border-radius: 999px; background: var(--panel); box-shadow: var(--shadow); transform: translateX(${v.authThumb}%)`)}>
              </div>
              <button className="ns-btn ns-seg" onClick={v.pickSignup} aria-pressed={v.isSignupStr} style={css(`height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: ${v.signupFg}`)}>
                Sign up
              </button>
              <button className="ns-btn ns-seg" onClick={v.pickLogin} aria-pressed={v.isLoginStr} style={css(`height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: ${v.loginFg}`)}>
                Log in
              </button>
            </div>
            <form onSubmit={v.authSubmit} style={css("margin: 16px 0 0; display: flex; flex-direction: column; gap: 12px")}>
              {v.isSignup ? (<>
                <label className="ns-enter" style={css("display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 700")}>
                  Your name{' '}
                  <input type="text" autoComplete="name" placeholder="Jordan Reyes" value={v.authName} onChange={v.setAuthName} style={css("height: 52px; box-sizing: border-box; padding: 0 18px; border-radius: 26px; border: 1.5px solid var(--line2); background: var(--panel); color: var(--tx); font: inherit; font-size: 15px; font-weight: 500")} />
                </label>
              </>) : null}
              <label style={css("display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 700")}>
                Work email{' '}
                <input type="email" autoComplete="email" placeholder="you@company.com" value={v.authEmail} onChange={v.setAuthEmail} style={css("height: 52px; box-sizing: border-box; padding: 0 18px; border-radius: 26px; border: 1.5px solid var(--line2); background: var(--panel); color: var(--tx); font: inherit; font-size: 15px; font-weight: 500")} />
              </label>
              <label style={css("display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 700")}>
                Password{' '}
                <input type="password" autoComplete={v.passAuto} placeholder="At least 8 characters" value={v.authPass} onChange={v.setAuthPass} style={css("height: 52px; box-sizing: border-box; padding: 0 18px; border-radius: 26px; border: 1.5px solid var(--line2); background: var(--panel); color: var(--tx); font: inherit; font-size: 15px; font-weight: 500")} />
              </label>
              {v.isLogin ? (<>
                <button type="button" className="ns-btn" style={css("align-self: flex-end; font-size: 13px; font-weight: 700; color: var(--tx2); text-decoration: underline; text-underline-offset: 3px")}>
                  Forgot password?
                </button>
              </>) : null}
              <button type="submit" className="ns-btn ns-pri" style={css("margin-top: 4px; height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 800")}>
                {v.authCta}
                <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
                  </path>
                </svg>
              </button>
            </form>
            <div style={css("display: flex; align-items: center; gap: 10px; margin: 16px 0; font-size: 12px; color: var(--tx2)")}>
              <span style={css("flex-grow: 1; height: 1px; background: var(--line)")}>
              </span>
              or
              <span style={css("flex-grow: 1; height: 1px; background: var(--line)")}>
              </span>
            </div>
            <button className="ns-btn ns-gh" onClick={v.authSubmit} style={css("width: 100%; height: 52px; border-radius: 26px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 700")}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path className="ns-ic" d="M14.5 10.5a4.5 4.5 0 1 0-4.2 4.5L8 17.5v3h3v-2h2v-2l1.2-1.2M15.5 7.5h.01">
                </path>
              </svg>
              Continue with a work account
            </button>
            {v.isSignup ? (<>
              <p style={css("margin: 16px 4px 0; font-size: 12px; line-height: 18px; color: var(--tx2); text-align: center")}>
                Next, a few quick questions about your building, so the app only shows what you actually need.
              </p>
            </>) : null}
          </div>
        </div>
      </>) : null}
      {v.isDiag ? (<>
        <div style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
          <header style={css("padding: 16px 20px 6px; display: flex; align-items: center; gap: 12px; flex-shrink: 0")}>
            <button className="ns-btn ns-gh" onClick={v.diagBack} aria-label="Back" style={css("width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path className="ns-ic" d="M15 6l-6 6 6 6">
                </path>
              </svg>
            </button>
            <div aria-hidden="true" style={css("flex-grow: 1; display: flex; gap: 4px")}>
              {(v.diagSegs || []).map((g, g$i) => (<Fragment key={g$i}>
                <span className="ns-pdot" style={css(`flex-grow: 1; height: 6px; border-radius: 3px; background: ${g.bg}`)}>
                </span>
              </Fragment>))}
            </div>
            <span className="ns-num" style={css("font-size: 13px; font-weight: 700; color: var(--tx2); white-space: nowrap")}>
              {v.diagStepLabel}
            </span>
          </header>
          {v.diagQ ? (<>
            <div className={v.diagAnim} style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
              <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding: 12px 20px 16px")}>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  {v.dq.kicker}
                </div>
                <h1 className="ns-serif" style={css("margin: 6px 0 6px; font-size: 30px; line-height: 34px; font-weight: 500")}>
                  {v.dq.q}
                </h1>
                <p style={css("margin: 0 0 16px; font-size: 14px; line-height: 20px; color: var(--tx2)")}>
                  {v.dq.help}
                </p>
                {v.dq.isTiles ? (<>
                  <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
                    {(v.dq.opts || []).map((o, o$i) => (<Fragment key={o$i}>
                      <button className="ns-btn ns-tile ns-rise" onClick={o.pick} aria-pressed={o.pressed} style={css(`position: relative; min-height: 112px; box-sizing: border-box; padding: 14px 12px 12px; border-radius: ${o.radius}; background: ${o.bg}; border: 2px solid ${o.border}; display: flex; flex-direction: column; align-items: flex-start; gap: 7px; animation-delay: ${o.delay}ms`)}>
                        <span style={css(`width: 40px; height: 40px; border-radius: 50%; background: ${o.iconBg}; color: ${o.iconFg}; display: flex; align-items: center; justify-content: center; transition: background-color 200ms`)}>
                          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                            <path className="ns-ic" d={o.icon} style={css("stroke-width: 1.8px")}>
                            </path>
                          </svg>
                        </span>
                        <span style={css("font-size: 14px; line-height: 18px; font-weight: 800")}>
                          {o.label}
                        </span>
                        <span style={css("font-size: 11px; line-height: 15px; color: var(--tx2)")}>
                          {o.sub}
                        </span>
                        <span className="ns-check" style={css(`position: absolute; top: 10px; right: 10px; width: 22px; height: 22px; border-radius: 50%; background: var(--acc); color: var(--accTx); display: flex; align-items: center; justify-content: center; transform: scale(${o.checkScale})`)}>
                          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                            <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 3px")}>
                            </path>
                          </svg>
                        </span>
                      </button>
                    </Fragment>))}
                  </div>
                </>) : null}
                {v.dq.isSize ? (<>
                  <div className="ns-rise" style={css("padding: 16px; border-radius: 28px 28px 28px 10px; background: var(--panel)")}>
                    <div style={css("font-size: 13px; font-weight: 800")}>
                      Floors or levels
                    </div>
                    <div style={css("display: flex; align-items: center; justify-content: center; gap: 22px; margin: 8px 0 4px")}>
                      <button className="ns-btn ns-gh" onClick={v.floorsMinus} aria-label="Fewer floors" style={css("width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                          <path className="ns-ic" d="M6 12h12" style={css("stroke-width: 2.4px")}>
                          </path>
                        </svg>
                      </button>
                      <span className="ns-serif" role="status" aria-label={v.floorsAria} style={css("min-width: 70px; text-align: center; font-size: 60px; line-height: 64px; font-weight: 500")}>
                        {v.dFloors}
                      </span>
                      <button className="ns-btn ns-gh" onClick={v.floorsPlus} aria-label="More floors" style={css("width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                          <path className="ns-ic" d="M6 12h12M12 6v12" style={css("stroke-width: 2.4px")}>
                          </path>
                        </svg>
                      </button>
                    </div>
                    <div style={css("font-size: 12px; color: var(--tx2); text-align: center")}>
                      Count basements and any roof people walk on.
                    </div>
                  </div>
                  <div className="ns-rise" style={css("margin-top: 12px; padding: 16px; border-radius: 10px 28px 28px 28px; background: var(--panel); animation-delay: 80ms")}>
                    <div style={css("font-size: 13px; font-weight: 800; margin-bottom: 10px")}>
                      Total floor area
                    </div>
                    <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
                      {(v.areaOpts || []).map((a, a$i) => (<Fragment key={a$i}>
                        <button className="ns-btn ns-tile" onClick={a.pick} aria-pressed={a.pressed} style={css(`min-height: 52px; padding: 6px 12px; border-radius: 26px; border: 2px solid ${a.border}; background: ${a.bg}; color: ${a.fg}; font-size: 13px; line-height: 16px; font-weight: 800; text-align: center`)}>
                          {a.label}
                        </button>
                      </Fragment>))}
                    </div>
                  </div>
                </>) : null}
                {v.dq.isTeam ? (<>
                  <div style={css("display: flex; flex-direction: column; gap: 10px")}>
                    {(v.dq.opts || []).map((o, o$i) => (<Fragment key={o$i}>
                      <button className="ns-btn ns-tile ns-rise" onClick={o.pick} aria-pressed={o.pressed} style={css(`position: relative; box-sizing: border-box; padding: 14px 44px 14px 14px; border-radius: ${o.radius}; background: ${o.bg}; border: 2px solid ${o.border}; display: flex; align-items: center; gap: 12px; animation-delay: ${o.delay}ms`)}>
                        <span style={css(`width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: ${o.iconBg}; color: ${o.iconFg}; display: flex; align-items: center; justify-content: center`)}>
                          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                            <path className="ns-ic" d={o.icon} style={css("stroke-width: 1.8px")}>
                            </path>
                          </svg>
                        </span>
                        <span style={css("display: flex; flex-direction: column; gap: 2px")}>
                          <span style={css("font-size: 15px; font-weight: 800")}>
                            {o.label}
                          </span>
                          <span style={css("font-size: 12px; color: var(--tx2)")}>
                            {o.sub}
                          </span>
                        </span>
                        <span className="ns-check" style={css(`position: absolute; top: 50%; right: 14px; margin-top: -11px; width: 22px; height: 22px; border-radius: 50%; background: var(--acc); color: var(--accTx); display: flex; align-items: center; justify-content: center; transform: scale(${o.checkScale})`)}>
                          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                            <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 3px")}>
                            </path>
                          </svg>
                        </span>
                      </button>
                    </Fragment>))}
                    {v.teamNeedsSize ? (<>
                      <div className="ns-pop" style={css("padding: 14px 16px; border-radius: 26px; background: var(--panel); display: flex; align-items: center; gap: 12px")}>
                        <span style={css("flex-grow: 1; font-size: 13px; font-weight: 800")}>
                          How many technicians?
                        </span>
                        <button className="ns-btn ns-gh" onClick={v.teamMinus} aria-label="Fewer technicians" style={css("width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
                          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                            <path className="ns-ic" d="M6 12h12" style={css("stroke-width: 2.4px")}>
                            </path>
                          </svg>
                        </button>
                        <span className="ns-serif" role="status" style={css("min-width: 36px; text-align: center; font-size: 30px; font-weight: 500")}>
                          {v.dTeamSize}
                        </span>
                        <button className="ns-btn ns-gh" onClick={v.teamPlus} aria-label="More technicians" style={css("width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center")}>
                          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                            <path className="ns-ic" d="M6 12h12M12 6v12" style={css("stroke-width: 2.4px")}>
                            </path>
                          </svg>
                        </button>
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
              </div>
              <div style={css("padding: 10px 20px 24px; flex-shrink: 0")}>
                <button className="ns-btn ns-pri" onClick={v.diagNext} aria-disabled={v.diagNextDis} style={css(`width: 100%; height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 800; opacity: ${v.diagNextOp}; pointer-events: ${v.diagNextPE}; transition: opacity 200ms`)}>
                  {v.diagNextLabel}
                  <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
                    </path>
                  </svg>
                </button>
              </div>
            </div>
          </>) : null}
          {v.diagResults ? (<>
            <div className="ns-in-r" style={css("flex-grow: 1; min-height: 0; display: flex; flex-direction: column")}>
              <div className="ns-scroll" style={css("flex-grow: 1; min-height: 0; padding: 0 20px 16px")}>
                <div className="ns-pop" style={css("height: 190px; margin: 0 -6px")}>
                  <svg viewBox="0 0 300 220" width="100%" height="100%" aria-hidden="true" style={css("display: block; overflow: visible")}>
                    <path d="M40 116C30 60 90 22 158 26s112 44 104 104-62 84-126 80S50 170 40 116Z" style={css("fill: var(--mint); opacity: 0.6")}>
                    </path>
                    <path className="ns-ii" d="M30 58q18-12 38-6M252 60q14 2 22 14">
                    </path>
                    <g className="ns-il-float">
                      <circle className="ns-is" cx="118" cy="70" r="15" style={css("fill: var(--panel)")}>
                      </circle>
                      <circle cx="118" cy="70" r="5" style={css("fill: var(--acc)")}>
                      </circle>
                    </g>
                    <g className="ns-il-float" style={css("animation-delay: 0.5s")}>
                      <path className="ns-is" d="M156 34q12 16 0 26q-12-10 0-26z" style={css("fill: var(--acc)")}>
                      </path>
                    </g>
                    <g className="ns-il-float" style={css("animation-delay: 1s")}>
                      <rect className="ns-is" x="184" y="56" width="26" height="36" rx="7" style={css("fill: var(--slate)")}>
                      </rect>
                      <circle cx="197" cy="68" r="3.5" style={css("fill: var(--mint)")}>
                      </circle>
                    </g>
                    <path className="ns-is" d="M80 122l-22-26h66l22 26z" style={css("fill: var(--mint)")}>
                    </path>
                    <path className="ns-is" d="M224 122l22-26h-66l-22 26z" style={css("fill: var(--mint)")}>
                    </path>
                    <rect className="ns-is" x="80" y="122" width="144" height="80" rx="6" style={css("fill: var(--acc)")}>
                    </rect>
                    <rect className="ns-is" x="130" y="148" width="44" height="22" rx="7" style={css("fill: var(--panel)")}>
                    </rect>
                    <path className="ns-ii" d="M140 159h24" style={css("stroke-width: 2px")}>
                    </path>
                    <path className="ns-il-twinkle" d="M244 34l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={css("fill: var(--acc)")}>
                    </path>
                    <path className="ns-il-twinkle" d="M58 150l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" style={css("fill: var(--acc); animation-delay: 0.8s")}>
                    </path>
                  </svg>
                </div>
                <div style={css("font-size: 12px; font-weight: 800; letter-spacing: 0.01em; color: var(--tx2)")}>
                  Your starter kit
                </div>
                <h1 className="ns-serif" style={css("margin: 6px 0 8px; font-size: 32px; line-height: 36px; font-weight: 500")}>
                  {v.kitHeadA}
                  <em style={css("font-weight: 400")}>
                    {v.kitHeadB}
                  </em>
                </h1>
                <p style={css("margin: 0; font-size: 14px; line-height: 20px; color: var(--tx2)")}>
                  {v.kitSummary}
                </p>
                <div style={css("display: flex; flex-direction: column; gap: 10px; margin-top: 16px")}>
                  {(v.kitItems || []).map((k, k$i) => (<Fragment key={k$i}>
                    <div className="ns-rise" style={css(`display: flex; gap: 12px; align-items: flex-start; padding: 14px; border-radius: ${k.radius}; background: var(--panel); animation-delay: ${k.delay}ms`)}>
                      <span style={css(`width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: ${k.bg}; color: ${k.fg}; display: flex; align-items: center; justify-content: center`)}>
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                          <path className="ns-ic" d={k.icon} style={css("stroke-width: 1.8px")}>
                          </path>
                        </svg>
                      </span>
                      <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                        <span style={css("font-size: 14px; line-height: 18px; font-weight: 800")}>
                          {k.name}
                        </span>
                        <span style={css("font-size: 12px; line-height: 17px; color: var(--tx2)")}>
                          {k.why}
                        </span>
                      </span>
                      <span style={css("flex-shrink: 0; text-align: right; display: flex; flex-direction: column; align-items: flex-end")}>
                        <span style={css("font-size: 10px; font-weight: 700; color: var(--tx2)")}>
                          about
                        </span>
                        <span className="ns-serif" style={css("font-size: 30px; line-height: 32px; font-weight: 500")}>
                          {k.n}
                        </span>
                        <span className="ns-num" style={css("font-size: 11px; color: var(--tx2); white-space: nowrap")}>
                          {k.range}
                        </span>
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                <div className="ns-rise" style={css("margin-top: 16px; padding: 16px; border-radius: 10px 28px 28px 28px; background: var(--mint); color: var(--tx); animation-delay: 300ms")}>
                  <div style={css("display: flex; align-items: center; gap: 10px")}>
                    <span style={css("flex-grow: 1; display: flex; flex-direction: column")}>
                      <span style={css("font-size: 12px; font-weight: 800")}>
                        Your site code
                      </span>
                      <span className="ns-num" style={css("font-size: 28px; line-height: 34px; font-weight: 700; letter-spacing: 0.06em")}>
                        {v.siteCode}
                      </span>
                    </span>
                    <button className="ns-btn ns-gh" onClick={v.copyCode} style={css("height: 36px; padding: 0 14px; border-radius: 18px; font-size: 13px; font-weight: 800; background: var(--panel)")}>
                      Copy
                    </button>
                  </div>
                  <div style={css("font-size: 12px; line-height: 17px; margin-top: 4px; opacity: 0.85")}>
                    When your sensors arrive, pair each one with this code. They link to this dashboard, and you can turn them on or off, check their status and see where they are.
                  </div>
                </div>
                <h2 className="ns-serif" style={css("margin: 22px 0 8px; font-size: 20px; font-weight: 500")}>
                  Left out on purpose
                </h2>
                <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                  {(v.kitLeft || []).map((l, l$i) => (<Fragment key={l$i}>
                    <div style={css("display: flex; gap: 10px; align-items: baseline; font-size: 13px; line-height: 18px")}>
                      <span style={css("width: 14px; flex-shrink: 0; height: 2px; background: var(--line2); border-radius: 1px; transform: translateY(-3px)")}>
                      </span>
                      <span>
                        <strong style={css("font-weight: 800")}>
                          {l.name}.
                        </strong>
                        <span style={css("color: var(--tx2)")}>
                          {l.why}
                        </span>
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                <h2 className="ns-serif" style={css("margin: 22px 0 10px; font-size: 20px; font-weight: 500")}>
                  Turned on for you
                </h2>
                <div style={css("display: flex; flex-wrap: wrap; gap: 6px")}>
                  {(v.kitFeatures || []).map((f, f$i) => (<Fragment key={f$i}>
                    <span className="ns-pop" style={css(`height: 32px; padding: 0 12px 0 8px; border-radius: 16px; background: var(--panel2); display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; animation-delay: ${f.delay}ms`)}>
                      <span style={css("width: 18px; height: 18px; border-radius: 50%; background: var(--ok); color: var(--tagTx); display: flex; align-items: center; justify-content: center")}>
                        <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
                          <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5" style={css("stroke-width: 3.2px")}>
                          </path>
                        </svg>
                      </span>
                      {f.text}
                    </span>
                  </Fragment>))}
                </div>
                <p style={css("margin: 18px 0 0; padding: 12px 14px; border-radius: 18px; border: 1.5px dashed var(--line2); font-size: 12px; line-height: 18px; color: var(--tx2)")}>
                  These counts are a starting estimate from your answers, not a final order. A blueprint scan or a short walkthrough will confirm exact placement.
                </p>
              </div>
              <div style={css("padding: 10px 20px 22px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px")}>
                <button className="ns-btn ns-pri" onClick={v.finishOnb} style={css("height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 800")}>
                  {v.finishLabel}
                  <svg className="ns-nudge" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path className="ns-ic" d="M5 12h14M13 6l6 6-6 6" style={css("stroke-width: 2.2px")}>
                    </path>
                  </svg>
                </button>
                <button className="ns-btn ns-gh" onClick={v.finishToPair} style={css("height: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700")}>
                  I have sensors, pair them now
                </button>
              </div>
            </div>
          </>) : null}
        </div>
      </>) : null}
    </div>
  </>) : null}
  <div className="ns-toast" role="status" aria-live="polite" style={css(`position: absolute; left: 76px; right: 12px; top: 12px; z-index: 70; padding: 11px 14px; border-radius: 22px; background: var(--tx); color: var(--bg); box-shadow: var(--shadow); font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; transform: translateY(${v.toastY}px); opacity: ${v.toastOp}; pointer-events: none`)}>
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path className="ns-ic" d="M5 12.5l4.5 4.5L19 7.5">
      </path>
    </svg>
    {v.toastText}
  </div>
  {v.scanPanel}
  {v.tour}
</div>
  </>);
}
