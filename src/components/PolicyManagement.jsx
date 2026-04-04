import React, { useState } from 'react';
import { ZONES, ML_WEIGHTS, TRIGGERS } from '../data/constants.js';

export default function PolicyManagement({ worker, policy, onSavePolicy, updateWorker }) {
  const [zone, setZone] = useState(worker.zone);
  const [window_, setWindow] = useState(worker.workWindow);
  const [experience, setExperience] = useState(worker.experience);
  const [forecastRisk, setForecastRisk] = useState(0.55);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const premium = ML_WEIGHTS.compute({ zone, experience, trustScore: worker.trustScore || 72, forecastRisk, workWindow: window_ });
  const z = ZONES[zone];
  const maxPayout = z.tier === 'red' ? 1100 : z.tier === 'amber' ? 1200 : 1350;

  const features = [
    { name: 'Zone risk score', raw: z.risk / 100, contribution: +(z.risk * 0.42).toFixed(1), color: z.color, desc: `${z.name} — ${z.tier} risk` },
    { name: 'Flood history', raw: z.floodRisk, contribution: +(z.floodRisk * 18).toFixed(1), color: '#4a90d9', desc: `${Math.round(z.floodRisk * 100)}% waterlog probability` },
    { name: 'Heat exposure', raw: z.heatRisk, contribution: +(z.heatRisk * 10).toFixed(1), color: '#f97316', desc: `Avg ${Math.round(z.heatRisk * 8)} days >44°C/month` },
    { name: 'Experience discount', raw: Math.min(experience / 36, 1), contribution: -(Math.min(experience / 36, 1) * 14).toFixed(1), color: '#3cb371', desc: `${experience} months on platform` },
    { name: 'Forecast risk index', raw: forecastRisk, contribution: +(forecastRisk * 16).toFixed(1), color: '#daa520', desc: `${Math.round(forecastRisk * 100)}% disruption probability next 7 days` },
    { name: 'Peak window', raw: window_ === 'both' ? 1 : window_ === 'dinner' ? 0.9 : 0.7, contribution: +(({ both: 1, dinner: 0.9, lunch: 0.7, allday: 0.7 }[window_]) * 6).toFixed(1), color: '#8b5cf6', desc: window_ },
  ];

  const activateCoverage = () => {
    setPurchasing(true);
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
      };
      onSavePolicy(p);
      updateWorker({ zone, workWindow: window_, experience });
      setPurchasing(false);
      setPurchased(true);
    }, 1800);
  };

  if (purchased) {
    return (
      <>
        <style>{`
          .success-container {
            max-width: 640px;
            margin: 2rem auto;
            padding: 2rem 1.5rem;
          }
          .success-card {
            background: linear-gradient(135deg, #16a34a, #15803d);
            border-radius: 1.5rem;
            padding: 2.5rem;
            text-align: center;
            box-shadow: 0 25px 35px -12px rgba(0,0,0,0.5);
          }
          .success-icon {
            font-size: 3.5rem;
            margin-bottom: 0.8rem;
          }
          .success-title {
            font-family: 'Cinzel', serif;
            font-size: 1.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 0.5rem;
          }
          .success-sub {
            color: rgba(255,255,255,0.85);
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }
          .success-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .success-item {
            background: rgba(255,255,255,0.12);
            border-radius: 0.75rem;
            padding: 0.8rem;
          }
          .success-label {
            font-size: 0.68rem;
            text-transform: uppercase;
            color: rgba(255,255,255,0.6);
            margin-bottom: 0.2rem;
          }
          .success-value {
            font-weight: 700;
            color: white;
          }
        `}</style>
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <div className="success-title">Coverage Active!</div>
            <div className="success-sub">₹{premium} deducted via UPI · Policy valid for 7 days</div>
            <div className="success-grid">
              {[
                ['Weekly Premium', `₹${premium}`],
                ['Max Payout', `₹${maxPayout.toLocaleString('en-IN')}`],
                ['Zone', z.name],
                ['Mutual Aid Pool', `₹${Math.round(premium * 0.08)} added`],
              ].map(([k, v]) => (
                <div key={k} className="success-item">
                  <div className="success-label">{k}</div>
                  <div className="success-value">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* ----- Policy Management Styles (unique glass system) ----- */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .policy-root {
          --bg-radial: radial-gradient(circle at 10% 20%, rgba(12, 12, 24, 1) 0%, rgba(8, 8, 18, 1) 100%);
          --card-bg: rgba(20, 20, 35, 0.8);
          --card-border: rgba(184, 134, 11, 0.1);
          --accent-primary: #b8860b;
          --accent-success: #3cb371;
          --accent-blue: #4a90d9;
          --accent-amber: #daa520;
          --text-main: #e8d5b7;
          --text-muted: rgba(232, 213, 183, 0.5);
          --text-dim: rgba(232, 213, 183, 0.3);
          --transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .policy-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-radial);
          border-radius: 2rem;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }

        /* grain texture */
        .policy-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjYiIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=');
          background-repeat: repeat;
          opacity: 0.2;
          pointer-events: none;
        }

        .policy-header {
          margin-bottom: 1.8rem;
        }
        .policy-title {
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
        .policy-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          border-left: 2px solid var(--accent-primary);
          padding-left: 0.75rem;
        }

        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 780px) {
          .two-col-grid { grid-template-columns: 1fr; }
          .policy-container { padding: 1rem; }
        }

        .form-card, .premium-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.5rem;
          transition: var(--transition);
        }
        .form-card:hover, .premium-card:hover {
          border-color: rgba(255,255,255,0.15);
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          color: white;
          margin-bottom: 1.2rem;
          font-size: 0.95rem;
        }

        .input-group {
          margin-bottom: 1.2rem;
        }
        .input-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--text-dim);
          display: block;
          margin-bottom: 0.5rem;
        }
        .select-input, .range-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: #1a1f35;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 0.7rem;
          color: #f0ede6;
          font-size: 0.85rem;
          outline: none;
          transition: var(--transition);
        }
        .select-input:focus, .range-input:focus {
          border-color: rgba(255,87,34,0.5);
        }
        .range-input {
          padding: 0;
          accent-color: #b8860b;
        }
        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-dim);
          margin-top: 0.25rem;
        }

        .triggers-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .trigger-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.05);
          border-radius: 0.6rem;
          padding: 0.3rem 0.7rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .premium-amount {
          font-family: 'Cinzel', serif;
          font-size: 3rem;
          font-weight: 800;
          color: #b8860b;
          line-height: 1;
        }
        .premium-sub {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .max-payout-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin: 1rem 0;
        }
        .zone-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.04);
          border-radius: 0.8rem;
          margin: 1rem 0;
        }
        .zone-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .btn-toggle {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.6rem;
          color: var(--text-muted);
          padding: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          transition: var(--transition);
        }
        .btn-toggle:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
        }
        .feature-item {
          margin-bottom: 0.75rem;
        }
        .feature-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 0.2rem;
        }
        .feature-bar-bg {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .feature-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s;
        }
        .feature-desc {
          font-size: 0.65rem;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }
        .btn-activate {
          width: 100%;
          padding: 0.8rem;
          background: #b8860b;
          border: none;
          border-radius: 2rem;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 0.5rem;
        }
        .btn-activate:disabled {
          background: rgba(255,87,34,0.5);
          cursor: wait;
        }
        .btn-activate:not(:disabled):hover {
          background: #ff784e;
          transform: scale(1.01);
          box-shadow: 0 6px 14px rgba(255,87,34,0.3);
        }
        .mutual-note {
          font-size: 0.7rem;
          text-align: center;
          color: var(--text-dim);
          margin-top: 0.5rem;
        }
        .active-policy-card {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 1rem;
          padding: 1rem;
          margin-top: 1rem;
        }
      `}</style>

      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-title">Insurance Policy Management</div>
          <div className="policy-sub">AI-powered weekly premium · Updates in real time as you adjust inputs</div>
        </div>

        <div className="two-col-grid">
          {/* Left: inputs */}
          <div className="form-card">
            <div className="section-title">Adjust Coverage Parameters</div>

            <div className="input-group">
              <label className="input-label">Delivery zone</label>
              <select className="select-input" value={zone} onChange={e => setZone(e.target.value)}>
                {Object.entries(ZONES).map(([k, z]) => <option key={k} value={k}>{z.name}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Primary working window</label>
              <select className="select-input" value={window_} onChange={e => setWindow(e.target.value)}>
                <option value="dinner">Dinner rush (6–10 PM)</option>
                <option value="lunch">Lunch rush (12–3 PM)</option>
                <option value="both">Both lunch + dinner</option>
                <option value="allday">All day</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Platform experience — {experience} months</label>
              <input type="range" className="range-input" min={1} max={36} value={experience} onChange={e => setExperience(+e.target.value)} />
              <div className="range-labels"><span>New</span><span>3 years</span></div>
            </div>

            <div className="input-group">
              <label className="input-label">7-day forecast risk — {Math.round(forecastRisk * 100)}%</label>
              <input type="range" className="range-input" min={0} max={100} value={Math.round(forecastRisk * 100)} onChange={e => setForecastRisk(e.target.value / 100)} />
              <div className="range-labels"><span>Calm</span><span>Severe</span></div>
            </div>

            <div>
              <label className="input-label">Triggers covered by this policy</label>
              <div className="triggers-container">
                {Object.values(TRIGGERS).map(t => (
                  <div key={t.id} className="trigger-badge">
                    <span>{t.icon}</span>{t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: premium card */}
          <div>
            <div className="premium-card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                XGBoost Model Output
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <div className="premium-amount">₹{premium}</div>
                <div className="premium-sub">/week</div>
              </div>
              <div className="max-payout-row">
                <span className="premium-sub">Max payout</span>
                <span style={{ color: '#3cb371', fontWeight: 600 }}>₹{maxPayout.toLocaleString('en-IN')}</span>
              </div>

              <div className="zone-badge">
                <div className="zone-dot" style={{ background: z.color }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{z.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Risk score: {z.risk}/100 · {z.tier === 'red' ? 'High' : z.tier === 'amber' ? 'Medium' : 'Low'} risk zone</div>
                </div>
              </div>

              <button className="btn-toggle" onClick={() => setShowBreakdown(!showBreakdown)}>
                {showBreakdown ? '▲' : '▼'} {showBreakdown ? 'Hide' : 'Show'} AI feature breakdown
              </button>

              {showBreakdown && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>Base rate: ₹35 &nbsp;+&nbsp; feature contributions</div>
                  {features.map(f => (
                    <div key={f.name} className="feature-item">
                      <div className="feature-header">
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{f.name}</span>
                        <span style={{ fontWeight: 600, color: +f.contribution < 0 ? '#3cb371' : f.color }}>
                          {+f.contribution > 0 ? '+' : ''}{f.contribution}
                        </span>
                      </div>
                      <div className="feature-bar-bg">
                        <div className="feature-bar-fill" style={{ width: `${Math.abs(f.raw) * 100}%`, background: f.color }} />
                      </div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn-activate" onClick={activateCoverage} disabled={purchasing}>
                {purchasing ? 'Processing UPI payment...' : `Activate — Pay ₹${premium} →`}
              </button>
              <div className="mutual-note">
                Mutual Aid Pool contribution: ₹{Math.round(premium * 0.08)} &nbsp;·&nbsp; No lock-in
              </div>
            </div>

            {policy && (
              <div className="active-policy-card">
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3cb371', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Current Active Policy
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  Week {policy.weekNumber} &nbsp;·&nbsp; ₹{policy.premium}/week<br />
                  Activated: {new Date(policy.activatedAt).toLocaleDateString('en-IN')}<br />
                  Expires: {new Date(policy.expiresAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}