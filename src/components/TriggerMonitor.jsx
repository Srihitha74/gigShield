import React, { useState, useEffect, useRef } from 'react';
import { ZONES, TRIGGERS } from '../data/constants.js';

// ── Real OpenWeatherMap API key (free tier) ──
const OWM_KEY = '13f64143ba0a2ae83378a6fa189ac8e5'; // replace with your own key for live data

const HYDERABAD_LAT = 17.385;
const HYDERABAD_LON = 78.4867;

// Mock data for demo (used when OWM_KEY is 'DEMO_MODE')
const MOCK_WEATHER = { rain: 8, temp: 36, condition: 'Partly cloudy', humidity: 72 };
const MOCK_AQI = 145;
const MOCK_VELOCITY = 88; // orders/hr — normal

export default function TriggerMonitor({ worker, policy, addClaim, setTriggerAlert }) {
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [velocity, setVelocity] = useState(MOCK_VELOCITY);
  const [curfew, setCurfew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [simulating, setSimulating] = useState(null);
  const [claimFiring, setClaimFiring] = useState(null);
  const [firingLog, setFiringLog] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const logRef = useRef(null);

  const zone = ZONES[worker.zone];

  const fetchWeather = async () => {
    if (OWM_KEY === 'DEMO_MODE') {
      setWeather(MOCK_WEATHER);
      setAqi(MOCK_AQI);
      setLastRefresh(new Date());
      setLoading(false);
      return;
    }
    try {
      const [wRes, aqiRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&appid=${OWM_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&appid=${OWM_KEY}`)
      ]);
      const w = await wRes.json();
      const a = await aqiRes.json();
      setWeather({ rain: w.rain?.['1h'] || 0, temp: Math.round(w.main?.temp || 30), condition: w.weather?.[0]?.description || 'Clear', humidity: w.main?.humidity || 60 });
      const aqiIndex = a.list?.[0]?.main?.aqi;
      setAqi(aqiIndex ? [0, 50, 100, 150, 200, 300][aqiIndex] : 80);
    } catch {
      setWeather(MOCK_WEATHER);
      setAqi(MOCK_AQI);
    }
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchWeather(); const t = setInterval(fetchWeather, 600000); return () => clearInterval(t); }, []);

  // Check all thresholds
  const checks = {
    rain: weather ? weather.rain >= TRIGGERS.RAIN.threshold : false,
    heat: weather ? weather.temp >= TRIGGERS.HEAT.threshold : false,
    aqi: aqi !== null ? aqi >= TRIGGERS.AQI.threshold : false,
    curfew: curfew,
    platform: velocity < (MOCK_VELOCITY * (1 - TRIGGERS.PLATFORM.threshold / 100)),
  };

  const currentValues = {
    rain: weather ? `${weather.rain} mm/hr` : '—',
    heat: weather ? `${weather.temp}°C` : '—',
    aqi: aqi !== null ? `${aqi} AQI` : '—',
    curfew: curfew ? 'ACTIVE' : 'Clear',
    platform: `${velocity} orders/hr`,
  };

  const addLog = (msg, type = 'info') => {
    const entry = { msg, type, time: new Date().toLocaleTimeString('en-IN'), id: Date.now() };
    setFiringLog(prev => [entry, ...prev.slice(0, 19)]);
  };

  // Simulate a disruption for demo
  const simulate = async (triggerId) => {
    if (!policy) { alert('Activate a policy first from the Policy tab!'); return; }
    setSimulating(triggerId);
    addLog(`⚡ Trigger detected: ${TRIGGERS[triggerId.toUpperCase()].label}`, 'trigger');
    await delay(800);
    addLog('📡 Parametric threshold confirmed — disruption verified', 'info');
    await delay(600);
    addLog('👥 Income Mirror: querying 23 peer workers in adjacent zones...', 'info');
    await delay(900);
    const peerEarning = 285 + Math.round(Math.random() * 30);
    const hours = 2 + Math.round(Math.random() * 10) / 10;
    const ghost = Math.round(peerEarning * hours);
    const payout = Math.round(ghost * 0.8);
    addLog(`💡 Ghost earnings calculated: ₹${peerEarning}/hr × ${hours}h = ₹${ghost}`, 'calc');
    await delay(600);
    addLog('🔍 Running fraud check — GNN scoring claim...', 'info');
    await delay(700);
    const fraudScore = 0.05 + Math.random() * 0.15;
    addLog(`✓ Fraud score: ${(fraudScore * 100).toFixed(0)}% — Auto-approved (threshold: 55%)`, 'success');
    await delay(500);
    addLog('💸 Razorpay: UPI transfer initiated...', 'info');
    setClaimFiring({ trigger: TRIGGERS[triggerId.toUpperCase()], payout, ghost, peerEarning, hours, fraudScore });
    await delay(1200);
    addLog(`✅ PAYOUT COMPLETE — ₹${payout} sent to UPI in ${Math.round(Math.random() * 15 + 75)}s`, 'success');

    const newClaim = {
      id: 'CLM' + Date.now().toString().slice(-4),
      trigger: TRIGGERS[triggerId.toUpperCase()].label,
      icon: TRIGGERS[triggerId.toUpperCase()].icon,
      amount: payout, status: 'paid',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      zone: zone.name, duration: hours, peerEarnings: peerEarning,
      fraudScore, method: 'Income Mirror',
    };
    addClaim(newClaim);

    const alert = { id: triggerId, label: TRIGGERS[triggerId.toUpperCase()].label, payout };
    setActiveAlerts(prev => [...prev, alert]);
    setTriggerAlert(alert);
    setSimulating(null);
    setTimeout(() => setClaimFiring(null), 4000);
  };

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const triggerList = [
    { key: 'rain', t: TRIGGERS.RAIN, val: weather?.rain || 0, threshold: 35, current: currentValues.rain, live: true },
    { key: 'heat', t: TRIGGERS.HEAT, val: weather?.temp || 0, threshold: 44, current: currentValues.heat, live: true },
    { key: 'aqi', t: TRIGGERS.AQI, val: aqi || 0, threshold: 300, current: currentValues.aqi, live: false },
    { key: 'curfew', t: TRIGGERS.CURFEW, val: curfew ? 1 : 0, threshold: 1, current: currentValues.curfew, live: false },
    { key: 'platform', t: TRIGGERS.PLATFORM, val: 100 - (velocity / MOCK_VELOCITY * 100), threshold: 80, current: currentValues.platform, live: false },
  ];

  return (
    <>
      <style>{`
        /* ----- Trigger Monitor (unique glass system) ----- */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .monitor-root {
          --bg-radial: radial-gradient(circle at 10% 20%, rgba(12, 12, 24, 1) 0%, rgba(8, 8, 18, 1) 100%);
          --card-bg: rgba(20, 20, 35, 0.8);
          --card-border: rgba(184, 134, 11, 0.1);
          --accent-primary: #b8860b;
          --accent-success: #3cb371;
          --text-main: #e8d5b7;
          --text-muted: rgba(232, 213, 183, 0.5);
          --text-dim: rgba(232, 213, 183, 0.3);
          --transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .monitor-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-radial);
          border-radius: 2rem;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }
        .monitor-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjYiIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=');
          background-repeat: repeat;
          opacity: 0.2;
          pointer-events: none;
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.8rem;
        }
        .monitor-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff, #b0b8d0);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.25rem;
        }
        .monitor-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .refresh-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.6rem;
          color: var(--text-muted);
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.8rem;
          transition: var(--transition);
        }
        .refresh-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #3cb371;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3cb371;
          animation: pulse 2s infinite;
        }

        /* Claim firing banner */
        .claim-banner {
          background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05));
          border: 1px solid rgba(34,197,94,0.4);
          border-radius: 1.2rem;
          padding: 1.2rem 1.5rem;
          margin-bottom: 1.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Two column layout */
        .monitor-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 860px) {
          .monitor-grid { grid-template-columns: 1fr; }
          .monitor-container { padding: 1rem; }
        }

        /* Trigger cards */
        .trigger-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.2rem;
          margin-bottom: 1rem;
          transition: var(--transition);
        }
        .trigger-card.triggered {
          border-color: rgba(255,87,34,0.5);
          box-shadow: 0 0 0 1px rgba(255,87,34,0.2);
        }
        .trigger-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .trigger-icon {
          font-size: 1.6rem;
        }
        .trigger-title {
          font-weight: 600;
          color: white;
          margin-bottom: 0.2rem;
        }
        .trigger-source {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .source-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          display: inline-block;
        }
        .trigger-value {
          text-align: right;
        }
        .value-main {
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          font-weight: 700;
        }
        .value-threshold {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 3px;
          overflow: hidden;
          margin: 0.8rem 0;
        }
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }
        .trigger-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }
        .simulate-btn {
          background: rgba(255,87,34,0.1);
          border: 1px solid rgba(255,87,34,0.3);
          border-radius: 0.6rem;
          color: #b8860b;
          padding: 0.3rem 0.9rem;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .simulate-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        .simulate-btn:not(:disabled):hover {
          background: rgba(255,87,34,0.2);
        }
        .mock-control {
          margin-top: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Log panel */
        .log-panel {
          background: rgba(8, 10, 25, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          overflow: hidden;
          position: sticky;
          top: 80px;
        }
        .log-header {
          padding: 0.8rem 1.2rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .log-title {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .log-list {
          height: 480px;
          overflow-y: auto;
          padding: 0.8rem;
        }
        .log-entry {
          padding: 0.6rem 0.8rem;
          border-radius: 0.7rem;
          margin-bottom: 0.5rem;
          border-left: 2px solid;
          font-size: 0.75rem;
          line-height: 1.4;
        }
        .log-time {
          font-size: 0.6rem;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }
        .empty-log {
          text-align: center;
          padding: 2rem;
          color: var(--text-dim);
          font-size: 0.8rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>

      <div className="monitor-container">
        <div className="monitor-header">
          <div>
            <div className="monitor-title">Live Trigger Monitor</div>
            <div className="monitor-sub">
              {loading ? 'Loading weather data...' : `Last refresh: ${lastRefresh?.toLocaleTimeString('en-IN')} · Polling every 10 min · ${zone.name}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <button className="refresh-btn" onClick={fetchWeather}>↻ Refresh</button>
            <div className="live-badge">
              <span className="pulse-dot" />
              Monitoring live
            </div>
          </div>
        </div>

        {/* Active claim banner */}
        {claimFiring && (
          <div className="claim-banner">
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>
                {claimFiring.trigger.icon} Payout Fired — {claimFiring.trigger.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                Peer earnings: ₹{claimFiring.peerEarning}/hr × {claimFiring.hours}h = ₹{claimFiring.ghost} ghost earnings × 80% coverage
              </div>
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 800, color: '#3cb371' }}>₹{claimFiring.payout}</div>
          </div>
        )}

        <div className="monitor-grid">
          {/* Left: Trigger cards */}
          <div>
            {triggerList.map(({ key, t, val, threshold, current, live }) => {
              const triggered = checks[key];
              const pct = Math.min(100, (val / threshold) * 100);
              return (
                <div key={key} className={`trigger-card ${triggered ? 'triggered' : ''}`}>
                  <div className="trigger-header">
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <span className="trigger-icon">{t.icon}</span>
                      <div>
                        <div className="trigger-title">{t.label}</div>
                        <div className="trigger-source">
                          <span className="source-dot" style={{ background: live ? '#3cb371' : '#daa520' }} />
                          {live ? 'Live API' : 'Simulated'} · {t.api}
                        </div>
                      </div>
                    </div>
                    <div className="trigger-value">
                      <div className="value-main" style={{ color: triggered ? t.color : 'white' }}>{current}</div>
                      <div className="value-threshold">threshold: {threshold} {t.unit}</div>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: triggered ? t.color : `${t.color}80` }} />
                  </div>

                  <div className="trigger-footer">
                    <div className="status-indicator">
                      <span className="pulse-dot" style={{ background: triggered ? t.color : 'rgba(255,255,255,0.2)', animation: triggered ? 'pulse 1.5s infinite' : 'none' }} />
                      <span style={{ color: triggered ? t.color : 'rgba(255,255,255,0.5)', fontWeight: triggered ? 700 : 400 }}>
                        {triggered ? '⚡ THRESHOLD EXCEEDED — trigger active' : `${Math.round(pct)}% of threshold`}
                      </span>
                    </div>
                    <button className="simulate-btn" onClick={() => simulate(key)} disabled={!!simulating}>
                      {simulating === key ? 'Firing...' : '▶ Simulate'}
                    </button>
                  </div>

                  {/* Mock controls for specific triggers */}
                  {key === 'curfew' && (
                    <div className="mock-control">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <input type="checkbox" checked={curfew} onChange={e => setCurfew(e.target.checked)} style={{ accentColor: '#ef4444' }} />
                        Toggle zone curfew (mock)
                      </label>
                    </div>
                  )}
                  {key === 'platform' && (
                    <div className="mock-control">
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Order velocity: {velocity}/hr — drag to simulate outage</div>
                      <input type="range" min={0} max={MOCK_VELOCITY} value={velocity} onChange={e => setVelocity(+e.target.value)} style={{ width: '100%', accentColor: '#10b981' }} />
                    </div>
                  )}
                  {key === 'aqi' && (
                    <div className="mock-control">
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>AQI mock value: {aqi}</div>
                      <input type="range" min={0} max={500} value={aqi || 145} onChange={e => setAqi(+e.target.value)} style={{ width: '100%', accentColor: '#8b5cf6' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Live log panel */}
          <div className="log-panel">
            <div className="log-header">
              <div className="log-title">Live Claim Log</div>
              <div className="live-badge" style={{ fontSize: '0.7rem' }}>
                <span className="pulse-dot" />
                Active
              </div>
            </div>
            <div className="log-list" ref={logRef}>
              {firingLog.length === 0 ? (
                <div className="empty-log">
                  Hit ▶ Simulate on any trigger<br />to see the full zero-touch<br />claim flow in real time.
                </div>
              ) : (
                firingLog.map(l => {
                  let borderColor = 'rgba(255,255,255,0.1)';
                  let bgColor = 'rgba(255,255,255,0.03)';
                  if (l.type === 'success') { borderColor = '#3cb371'; bgColor = 'rgba(34,197,94,0.08)'; }
                  else if (l.type === 'trigger') { borderColor = '#b8860b'; bgColor = 'rgba(255,87,34,0.08)'; }
                  else if (l.type === 'calc') { borderColor = '#daa520'; bgColor = 'rgba(245,158,11,0.08)'; }
                  return (
                    <div key={l.id} className="log-entry" style={{ borderLeftColor: borderColor, background: bgColor }}>
                      <div style={{ color: l.type === 'success' ? '#4ade80' : l.type === 'trigger' ? '#ff7043' : l.type === 'calc' ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}>
                        {l.msg}
                      </div>
                      <div className="log-time">{l.time}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}