import React, { useState, useEffect, useRef } from 'react'
import { ZONES, TRIGGERS } from '../data/constants.js'

// ── Real OpenWeatherMap API key (free tier) ──
// Workers: replace with your own key from openweathermap.org
const OWM_KEY = '13f64143ba0a2ae83378a6fa189ac8e5' // set to your key to get live data

const HYDERABAD_LAT = 17.385
const HYDERABAD_LON = 78.4867

// Mock data for demo (used when OWM_KEY is DEMO_MODE)
const MOCK_WEATHER = { rain: 8, temp: 36, condition: 'Partly cloudy', humidity: 72 }
const MOCK_AQI = 145
const MOCK_VELOCITY = 88 // orders/hr — normal

export default function TriggerMonitor({ worker, policy, addClaim, setTriggerAlert }) {
  const [weather, setWeather] = useState(null)
  const [aqi, setAqi] = useState(null)
  const [velocity, setVelocity] = useState(MOCK_VELOCITY)
  const [curfew, setCurfew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [simulating, setSimulating] = useState(null)
  const [claimFiring, setClaimFiring] = useState(null)
  const [firingLog, setFiringLog] = useState([])
  const [activeAlerts, setActiveAlerts] = useState([])
  const logRef = useRef(null)

  const zone = ZONES[worker.zone]

  const fetchWeather = async () => {
    if (OWM_KEY === 'DEMO_MODE') {
      setWeather(MOCK_WEATHER)
      setAqi(MOCK_AQI)
      setLastRefresh(new Date())
      setLoading(false)
      return
    }
    try {
      const [wRes, aqiRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&appid=${OWM_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&appid=${OWM_KEY}`)
      ])
      const w = await wRes.json()
      const a = await aqiRes.json()
      setWeather({ rain: w.rain?.['1h'] || 0, temp: Math.round(w.main?.temp || 30), condition: w.weather?.[0]?.description || 'Clear', humidity: w.main?.humidity || 60 })
      const aqiIndex = a.list?.[0]?.main?.aqi
      setAqi(aqiIndex ? [0,50,100,150,200,300][aqiIndex] : 80)
    } catch {
      setWeather(MOCK_WEATHER)
      setAqi(MOCK_AQI)
    }
    setLastRefresh(new Date())
    setLoading(false)
  }

  useEffect(() => { fetchWeather(); const t = setInterval(fetchWeather, 600000); return () => clearInterval(t) }, [])

  // Check all thresholds
  const checks = {
    rain:     weather ? weather.rain >= TRIGGERS.RAIN.threshold : false,
    heat:     weather ? weather.temp >= TRIGGERS.HEAT.threshold : false,
    aqi:      aqi !== null ? aqi >= TRIGGERS.AQI.threshold : false,
    curfew:   curfew,
    platform: velocity < (MOCK_VELOCITY * (1 - TRIGGERS.PLATFORM.threshold / 100)),
  }

  const currentValues = {
    rain:     weather ? `${weather.rain} mm/hr` : '—',
    heat:     weather ? `${weather.temp}°C` : '—',
    aqi:      aqi !== null ? `${aqi} AQI` : '—',
    curfew:   curfew ? 'ACTIVE' : 'Clear',
    platform: `${velocity} orders/hr`,
  }

  const addLog = (msg, type = 'info') => {
    const entry = { msg, type, time: new Date().toLocaleTimeString('en-IN'), id: Date.now() }
    setFiringLog(prev => [entry, ...prev.slice(0, 19)])
  }

  // Simulate a disruption for demo
  const simulate = async (triggerId) => {
    if (!policy) { alert('Activate a policy first from the Policy tab!'); return }
    setSimulating(triggerId)
    addLog(`⚡ Trigger detected: ${TRIGGERS[triggerId.toUpperCase()].label}`, 'trigger')
    await delay(800)
    addLog('📡 Parametric threshold confirmed — disruption verified', 'info')
    await delay(600)
    addLog('👥 Income Mirror: querying 23 peer workers in adjacent zones...', 'info')
    await delay(900)
    const peerEarning = 285 + Math.round(Math.random() * 30)
    const hours = 2 + Math.round(Math.random() * 10) / 10
    const ghost = Math.round(peerEarning * hours)
    const payout = Math.round(ghost * 0.8)
    addLog(`💡 Ghost earnings calculated: ₹${peerEarning}/hr × ${hours}h = ₹${ghost}`, 'calc')
    await delay(600)
    addLog('🔍 Running fraud check — GNN scoring claim...', 'info')
    await delay(700)
    const fraudScore = 0.05 + Math.random() * 0.15
    addLog(`✓ Fraud score: ${(fraudScore * 100).toFixed(0)}% — Auto-approved (threshold: 55%)`, 'success')
    await delay(500)
    addLog('💸 Razorpay: UPI transfer initiated...', 'info')
    setClaimFiring({ trigger: TRIGGERS[triggerId.toUpperCase()], payout, ghost, peerEarning, hours, fraudScore })
    await delay(1200)
    addLog(`✅ PAYOUT COMPLETE — ₹${payout} sent to UPI in ${Math.round(Math.random() * 15 + 75)}s`, 'success')

    const newClaim = {
      id: 'CLM' + Date.now().toString().slice(-4),
      trigger: TRIGGERS[triggerId.toUpperCase()].label,
      icon: TRIGGERS[triggerId.toUpperCase()].icon,
      amount: payout, status: 'paid',
      date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      zone: zone.name, duration: hours, peerEarnings: peerEarning,
      fraudScore, method: 'Income Mirror',
    }
    addClaim(newClaim)

    const alert = { id: triggerId, label: TRIGGERS[triggerId.toUpperCase()].label, payout }
    setActiveAlerts(prev => [...prev, alert])
    setTriggerAlert(alert)
    setSimulating(null)
    setTimeout(() => setClaimFiring(null), 4000)
  }

  const delay = ms => new Promise(r => setTimeout(r, ms))

  const triggerList = [
    { key: 'rain', t: TRIGGERS.RAIN, val: weather?.rain || 0, threshold: 35, current: currentValues.rain, live: true },
    { key: 'heat', t: TRIGGERS.HEAT, val: weather?.temp || 0, threshold: 44, current: currentValues.heat, live: true },
    { key: 'aqi', t: TRIGGERS.AQI, val: aqi || 0, threshold: 300, current: currentValues.aqi, live: false },
    { key: 'curfew', t: TRIGGERS.CURFEW, val: curfew ? 1 : 0, threshold: 1, current: currentValues.curfew, live: false },
    { key: 'platform', t: TRIGGERS.PLATFORM, val: 100 - (velocity / MOCK_VELOCITY * 100), threshold: 80, current: currentValues.platform, live: false },
  ]

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Live Trigger Monitor</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            {loading ? 'Loading weather data...' : `Last refresh: ${lastRefresh?.toLocaleTimeString('en-IN')} · Polling every 10 min · ${zone.name}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchWeather} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.82rem' }}>
            ↻ Refresh
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#22c55e' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
            Monitoring live
          </div>
        </div>
      </div>

      {/* Active alert banner */}
      {claimFiring && (
        <div style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.2),rgba(22,163,74,0.05))', border: '1px solid rgba(22,163,74,0.4)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              {claimFiring.trigger.icon} Payout Fired — {claimFiring.trigger.label}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
              Peer earnings: ₹{claimFiring.peerEarning}/hr × {claimFiring.hours}h = ₹{claimFiring.ghost} ghost earnings × 80% coverage
            </div>
          </div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>₹{claimFiring.payout}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        {/* Trigger cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {triggerList.map(({ key, t, val, threshold, current, live }) => {
            const triggered = checks[key]
            const pct = Math.min(100, (val / threshold) * 100)
            return (
              <div key={key} style={{ background: '#13172b', border: `1px solid ${triggered ? t.color + '60' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '20px', transition: 'all .3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.6rem' }}>{t.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{t.label}</div>
                      <div style={{ fontSize: '0.72rem', color: live ? '#22c55e' : 'rgba(255,158,11,0.8)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: live ? '#22c55e' : '#f59e0b', display: 'inline-block' }}/>
                        {live ? 'Live API' : 'Simulated'} · {t.api}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.2rem', fontWeight: 700, color: triggered ? t.color : '#fff' }}>{current}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>threshold: {threshold} {t.unit}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: triggered ? t.color : `${t.color}80`, borderRadius: '3px', transition: 'width .5s' }}/>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: triggered ? t.color : 'rgba(255,255,255,0.2)', animation: triggered ? 'pulse 1.5s infinite' : 'none' }}/>
                    <span style={{ fontSize: '0.78rem', color: triggered ? t.color : 'rgba(255,255,255,0.4)', fontWeight: triggered ? 700 : 400 }}>
                      {triggered ? '⚡ THRESHOLD EXCEEDED — trigger active' : `${Math.round(pct)}% of threshold`}
                    </span>
                  </div>
                  <button onClick={() => simulate(key)} disabled={!!simulating} style={{ background: simulating === key ? 'rgba(255,87,34,0.3)' : 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.3)', borderRadius: '8px', color: '#ff5722', padding: '6px 14px', cursor: simulating ? 'wait' : 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                    {simulating === key ? 'Firing...' : '▶ Simulate'}
                  </button>
                </div>

                {/* Mock controls */}
                {key === 'curfew' && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={curfew} onChange={e => setCurfew(e.target.checked)} style={{ accentColor: '#ef4444', width: '14px', height: '14px' }}/>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Toggle zone curfew (mock)</span>
                  </div>
                )}
                {key === 'platform' && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Order velocity: {velocity}/hr — drag to simulate outage</span>
                    <input type="range" min={0} max={MOCK_VELOCITY} value={velocity} onChange={e => setVelocity(+e.target.value)} style={{ width: '100%', accentColor: '#10b981', marginTop: '6px' }}/>
                  </div>
                )}
                {key === 'aqi' && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>AQI mock value: {aqi}</span>
                    <input type="range" min={0} max={500} value={aqi || 145} onChange={e => setAqi(+e.target.value)} style={{ width: '100%', accentColor: '#8b5cf6', marginTop: '6px' }}/>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Live log */}
        <div style={{ background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'sticky', top: '80px' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>Live Claim Log</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.72rem', color: '#22c55e' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
              Active
            </div>
          </div>
          <div style={{ height: '480px', overflowY: 'auto', padding: '12px' }} ref={logRef}>
            {firingLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.2)', fontSize: '0.82rem', lineHeight: '1.7' }}>
                Hit ▶ Simulate on any trigger<br/>to see the full zero-touch<br/>claim flow in real time.
              </div>
            ) : firingLog.map(l => (
              <div key={l.id} style={{ padding: '8px 10px', borderRadius: '8px', marginBottom: '6px', background: l.type === 'success' ? 'rgba(22,163,74,0.08)' : l.type === 'trigger' ? 'rgba(255,87,34,0.08)' : l.type === 'calc' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${l.type === 'success' ? '#22c55e' : l.type === 'trigger' ? '#ff5722' : l.type === 'calc' ? '#f59e0b' : 'rgba(255,255,255,0.1)'}` }}>
                <div style={{ fontSize: '0.78rem', color: l.type === 'success' ? '#4ade80' : l.type === 'trigger' ? '#ff7043' : l.type === 'calc' ? '#fbbf24' : 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{l.msg}</div>
                <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>{l.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}