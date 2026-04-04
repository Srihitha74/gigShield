import React, { useState, useEffect } from 'react'
import { ZONES, ML_WEIGHTS, TRIGGERS } from '../data/constants.js'

export default function PolicyManagement({ worker, policy, onSavePolicy, updateWorker }) {
  const [zone, setZone] = useState(worker.zone)
  const [window_, setWindow] = useState(worker.workWindow)
  const [experience, setExperience] = useState(worker.experience)
  const [forecastRisk, setForecastRisk] = useState(0.55)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)

  const premium = ML_WEIGHTS.compute({ zone, experience, trustScore: worker.trustScore || 72, forecastRisk, workWindow: window_ })
  const z = ZONES[zone]
  const maxPayout = z.tier === 'red' ? 1100 : z.tier === 'amber' ? 1200 : 1350

  const features = [
    { name: 'Zone risk score', raw: z.risk / 100, contribution: +(z.risk * 0.42).toFixed(1), color: z.color, desc: `${z.name} — ${z.tier} risk` },
    { name: 'Flood history', raw: z.floodRisk, contribution: +(z.floodRisk * 18).toFixed(1), color: '#3b82f6', desc: `${Math.round(z.floodRisk * 100)}% waterlog probability` },
    { name: 'Heat exposure', raw: z.heatRisk, contribution: +(z.heatRisk * 10).toFixed(1), color: '#f97316', desc: `Avg ${Math.round(z.heatRisk * 8)} days >44°C/month` },
    { name: 'Experience discount', raw: Math.min(experience / 36, 1), contribution: -(Math.min(experience / 36, 1) * 14).toFixed(1), color: '#22c55e', desc: `${experience} months on platform` },
    { name: 'Forecast risk index', raw: forecastRisk, contribution: +(forecastRisk * 16).toFixed(1), color: '#f59e0b', desc: `${Math.round(forecastRisk * 100)}% disruption probability next 7 days` },
    { name: 'Peak window', raw: window_ === 'both' ? 1 : window_ === 'dinner' ? 0.9 : 0.7, contribution: +(({ both: 1, dinner: 0.9, lunch: 0.7, allday: 0.7 }[window_]) * 6).toFixed(1), color: '#8b5cf6', desc: window_ },
  ]

  const activateCoverage = () => {
    setPurchasing(true)
    setTimeout(() => {
      const p = {
        premium,
        maxPayout,
        zone,
        workWindow: window_,
        experience,
        weekNumber: (policy?.weekNumber || 0) + 1,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        triggersCovered: Object.keys(TRIGGERS),
        mutualPoolContrib: Math.round(premium * 0.08),
      }
      onSavePolicy(p)
      updateWorker({ zone, workWindow: window_, experience })
      setPurchasing(false)
      setPurchased(true)
    }, 1800)
  }

  if (purchased) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>✓</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Coverage Active!</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '0.9rem' }}>₹{premium} deducted via UPI · Policy valid for 7 days</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              ['Weekly Premium', `₹${premium}`],
              ['Max Payout', `₹${maxPayout.toLocaleString('en-IN')}`],
              ['Zone', z.name],
              ['Mutual Aid Pool', `₹${Math.round(premium * 0.08)} added`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Insurance Policy Management</div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>AI-powered weekly premium · Updates in real time as you adjust inputs</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: inputs */}
        <div style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, color: '#fff', marginBottom: '20px', fontSize: '0.95rem' }}>Adjust Coverage Parameters</div>

          {[
            { label: 'Delivery zone', el: (
              <select style={sel} value={zone} onChange={e => setZone(e.target.value)}>
                {Object.entries(ZONES).map(([k, z]) => <option key={k} value={k}>{z.name}</option>)}
              </select>
            )},
            { label: 'Primary working window', el: (
              <select style={sel} value={window_} onChange={e => setWindow(e.target.value)}>
                <option value="dinner">Dinner rush (6–10 PM)</option>
                <option value="lunch">Lunch rush (12–3 PM)</option>
                <option value="both">Both lunch + dinner</option>
                <option value="allday">All day</option>
              </select>
            )},
            { label: `Platform experience — ${experience} months`, el: (
              <div>
                <input type="range" style={{ width:'100%', accentColor:'#ff5722' }} min={1} max={36} value={experience} onChange={e => setExperience(+e.target.value)} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', marginTop:'4px' }}><span>New</span><span>3 years</span></div>
              </div>
            )},
            { label: `7-day forecast risk — ${Math.round(forecastRisk * 100)}%`, el: (
              <div>
                <input type="range" style={{ width:'100%', accentColor:'#f59e0b' }} min={0} max={100} value={Math.round(forecastRisk * 100)} onChange={e => setForecastRisk(e.target.value / 100)} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', marginTop:'4px' }}><span>Calm</span><span>Severe</span></div>
              </div>
            )},
          ].map(({ label, el }) => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
              {el}
            </div>
          ))}

          {/* Triggers covered */}
          <div style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Triggers covered by this policy</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.values(TRIGGERS).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', border: `1px solid ${t.color}30` }}>
                  <span>{t.icon}</span>{t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: premium card */}
        <div>
          <div style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>XGBoost Model Output</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '3rem', fontWeight: 800, color: '#ff5722' }}>₹{premium}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>/week</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '20px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Max payout</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>₹{maxPayout.toLocaleString('en-IN')}</span>
            </div>

            {/* Zone risk badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: z.color }}/>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{z.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Risk score: {z.risk}/100 · {z.tier === 'red' ? 'High' : z.tier === 'amber' ? 'Medium' : 'Low'} risk zone</div>
              </div>
            </div>

            {/* ML Breakdown toggle */}
            <button onClick={() => setShowBreakdown(!showBreakdown)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', cursor: 'pointer', fontSize: '0.78rem', width: '100%', marginBottom: '12px' }}>
              {showBreakdown ? '▲' : '▼'} {showBreakdown ? 'Hide' : 'Show'} AI feature breakdown
            </button>

            {showBreakdown && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>Base rate: ₹35 &nbsp;+&nbsp; feature contributions</div>
                {features.map(f => (
                  <div key={f.name} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{f.name}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: +f.contribution < 0 ? '#22c55e' : f.color }}>
                        {+f.contribution > 0 ? '+' : ''}{f.contribution}
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.abs(f.raw) * 100}%`, background: f.color, borderRadius: '2px', transition: 'width .5s' }}/>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={activateCoverage}
              disabled={purchasing}
              style={{ width: '100%', padding: '14px', background: purchasing ? 'rgba(255,87,34,0.5)' : '#ff5722', color: '#fff', border: 'none', borderRadius: '30px', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: purchasing ? 'wait' : 'pointer' }}
            >
              {purchasing ? 'Processing UPI payment...' : `Activate — Pay ₹${premium} →`}
            </button>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '8px' }}>
              Mutual Aid Pool contribution: ₹{Math.round(premium * 0.08)} &nbsp;·&nbsp; No lock-in
            </div>
          </div>

          {/* Current policy status */}
          {policy && (
            <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Current Active Policy</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                Week {policy.weekNumber} &nbsp;·&nbsp; ₹{policy.premium}/week<br/>
                Activated: {new Date(policy.activatedAt).toLocaleDateString('en-IN')}<br/>
                Expires: {new Date(policy.expiresAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const sel = { width: '100%', padding: '11px 14px', background: '#1a1f35', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f0ede6', fontSize: '0.88rem', outline: 'none' }