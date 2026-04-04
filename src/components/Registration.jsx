import React, { useState } from 'react';
import { ZONES, ML_WEIGHTS } from '../data/constants.js';

export default function Registration({ onComplete }) {
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', platform: 'zomato',
    zone: 'old_city', experience: 6, workWindow: 'dinner',
    dailyHours: 8,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const premium = ML_WEIGHTS.compute({
    zone: form.zone,
    experience: form.experience,
    trustScore: 72,
    forecastRisk: 0.55,
    workWindow: form.workWindow,
  });

  const zone = ZONES[form.zone];
  const monthlyLoss = Math.round(zone.risk * 24);

  const sendOtp = () => {
    if (form.phone.length >= 10) { setOtpSent(true); setStep(1); }
  };

  const verifyOtp = () => {
    if (otp === '123456' || otp.length === 6) setStep(2);
  };

  const steps = ['Mobile Login', 'Verify OTP', 'Your Profile', 'Get Covered'];

  return (
    <>
      <style>{`
        /* ----- Registration Page (unique glass design) ----- */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .reg-page {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, rgba(5, 7, 20, 1) 0%, rgba(2, 4, 15, 1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .reg-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjYiIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=');
          background-repeat: repeat;
          opacity: 0.2;
          pointer-events: none;
        }

        .reg-card {
          width: 100%;
          max-width: 500px;
          background: rgba(18, 22, 45, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.8rem;
          overflow: hidden;
          box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.2s;
        }

        /* Stepper */
        .stepper {
          background: rgba(8, 10, 25, 0.6);
          padding: 1rem 1.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          transition: all 0.2s;
        }
        .step-line {
          flex: 1;
          height: 1.5px;
          background: rgba(255, 255, 255, 0.08);
          transition: background 0.2s;
        }
        .step-line.active {
          background: #b8860b;
        }

        /* Header & Body */
        .reg-header {
          padding: 1.8rem 2rem 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .reg-body {
          padding: 1.8rem 2rem 2rem;
        }
        .step-badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #b8860b;
          margin-bottom: 0.5rem;
        }
        .reg-title {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.3rem;
        }
        .reg-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Form elements */
        .input-group {
          margin-bottom: 1.2rem;
        }
        .input-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          margin-bottom: 0.4rem;
        }
        .input-field, .select-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.9rem;
          color: #f0ede6;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus, .select-field:focus {
          border-color: #b8860b;
          background: rgba(255, 87, 34, 0.05);
        }
        .select-field {
          background: #1a1f35;
          cursor: pointer;
        }
        .row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }
        .btn-primary {
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
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-primary:hover {
          background: #ff784e;
          transform: scale(1.01);
          box-shadow: 0 6px 14px rgba(255, 87, 34, 0.3);
        }
        .btn-secondary {
          width: 100%;
          padding: 0.7rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 2rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.6rem;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .demo-box {
          background: rgba(255, 87, 34, 0.08);
          border: 1px solid rgba(255, 87, 34, 0.2);
          border-radius: 0.9rem;
          padding: 0.7rem 1rem;
          margin-bottom: 1.2rem;
          font-size: 0.75rem;
          color: rgba(255, 165, 0, 0.9);
        }
        .otp-input {
          text-align: center;
          letter-spacing: 8px;
          font-size: 1.2rem;
          font-weight: 600;
        }
        .insight-card {
          background: rgba(255, 87, 34, 0.07);
          border: 1px solid rgba(255, 87, 34, 0.15);
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          margin: 1rem 0;
        }
        .premium-breakdown {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 1.2rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 1.2rem;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }
        .feature-tile {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 0.8rem;
          padding: 0.7rem;
        }
        .feature-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 0.2rem;
        }
        .feature-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        .total-premium {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.7rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 500px) {
          .reg-header, .reg-body { padding: 1.2rem; }
          .stepper { padding: 0.8rem 1rem; }
          .row-2col { grid-template-columns: 1fr; gap: 0.5rem; }
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-card">
          {/* Stepper */}
          <div className="stepper">
            <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1rem', color: '#e8d5b7', marginRight: '0.8rem' }}>
              Gig<span style={{ color: '#b8860b' }}>Shield</span>
            </div>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="step-dot" style={{
                  background: i < step ? '#b8860b' : i === step ? 'rgba(184, 134, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: i === step ? '2px solid #b8860b' : '2px solid transparent',
                  color: i <= step ? '#b8860b' : 'rgba(255,255,255,0.3)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < 3 && <div className={`step-line ${i < step ? 'active' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 0: Phone */}
          {step === 0 && (
            <>
              <div className="reg-header">
                <div className="step-badge">Step 1 — Login</div>
                <div className="reg-title">Welcome to GigShield</div>
                <div className="reg-desc">Income protection for delivery partners</div>
              </div>
              <div className="reg-body">
                <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.3rem' }}>🛡️</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    Pay ₹18–₹65/week. Get up to ₹1,350 back<br />automatically when disruptions hit your zone.
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Mobile number</label>
                  <input className="input-field" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <button className="btn-primary" onClick={sendOtp}>Send OTP →</button>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '0.8rem' }}>
                  ✓ No password needed &nbsp;·&nbsp; ✓ Free to try
                </div>
              </div>
            </>
          )}

          {/* Step 1: OTP + Name */}
          {step === 1 && (
            <>
              <div className="reg-header">
                <div className="step-badge">Step 2 — Verify</div>
                <div className="reg-title">Verify your number</div>
                <div className="reg-desc">OTP sent to {form.phone || '+91 98765 43210'}</div>
              </div>
              <div className="reg-body">
                <div className="demo-box">
                  Demo OTP: <strong style={{ color: '#b8860b', letterSpacing: '2px' }}>123456</strong>
                </div>
                <div className="input-group">
                  <label className="input-label">Enter 6-digit OTP</label>
                  <input className="input-field otp-input" type="text" maxLength={6} placeholder="••••••"
                    value={otp} onChange={e => setOtp(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Your full name</label>
                  <input className="input-field" type="text" placeholder="Ramesh Kumar"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Primary platform</label>
                  <select className="select-field" value={form.platform} onChange={e => set('platform', e.target.value)}>
                    <option value="zomato">Zomato</option>
                    <option value="swiggy">Swiggy</option>
                    <option value="both">Both Zomato & Swiggy</option>
                  </select>
                </div>
                <button className="btn-primary" onClick={verifyOtp}>Continue →</button>
                <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
              </div>
            </>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <>
              <div className="reg-header">
                <div className="step-badge">Step 3 — Profile</div>
                <div className="reg-title">Your delivery profile</div>
                <div className="reg-desc">Used by our AI to calculate your exact weekly premium</div>
              </div>
              <div className="reg-body">
                <div className="input-group">
                  <label className="input-label">Primary delivery zone — Hyderabad</label>
                  <select className="select-field" value={form.zone} onChange={e => set('zone', e.target.value)}>
                    {Object.entries(ZONES).map(([k, z]) => (
                      <option key={k} value={k}>{z.name} — {z.tier === 'red' ? 'High' : z.tier === 'amber' ? 'Medium' : 'Low'} Risk</option>
                    ))}
                  </select>
                </div>
                <div className="row-2col">
                  <div className="input-group">
                    <label className="input-label">Months on platform</label>
                    <select className="select-field" value={form.experience} onChange={e => set('experience', +e.target.value)}>
                      <option value={1}>Less than 3 months</option>
                      <option value={6}>3–12 months</option>
                      <option value={18}>1–2 years</option>
                      <option value={30}>2+ years</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Working window</label>
                    <select className="select-field" value={form.workWindow} onChange={e => set('workWindow', e.target.value)}>
                      <option value="dinner">Dinner rush</option>
                      <option value="lunch">Lunch rush</option>
                      <option value="both">Both</option>
                      <option value="allday">All day</option>
                    </select>
                  </div>
                </div>
                <div className="insight-card">
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#b8860b', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    ⚡ AI Risk Insight
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                    Workers in <strong style={{ color: 'white' }}>{zone.name}</strong> lost an avg of{' '}
                    <strong style={{ color: '#b8860b' }}>₹{monthlyLoss.toLocaleString('en-IN')}/month</strong> to disruptions in the last 90 days.
                    Your estimated weekly risk: <strong style={{ color: 'white' }}>₹{Math.round(monthlyLoss / 4)}</strong>.
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setStep(3)}>See my plan →</button>
                <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              </div>
            </>
          )}

          {/* Step 3: Premium & Purchase */}
          {step === 3 && (
            <>
              <div className="reg-header">
                <div className="step-badge">Step 4 — Activate</div>
                <div className="reg-title">Your weekly plan</div>
                <div className="reg-desc">
                  XGBoost model calculated · {zone.name} · {zone.tier === 'red' ? 'High' : zone.tier === 'amber' ? 'Medium' : 'Low'} Risk Zone
                </div>
              </div>
              <div className="reg-body">
                <div className="premium-breakdown">
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                    ML Premium Breakdown
                  </div>
                  {[
                    ['Base rate', 35, '#666'],
                    [`Zone risk (${zone.name})`, Math.round(zone.risk * 0.42), zone.color],
                    ['Flood history weight', Math.round(zone.floodRisk * 18), '#4a90d9'],
                    ['Experience discount', -Math.round(Math.min(form.experience / 36, 1) * 14), '#3cb371'],
                    ['Forecast risk index', Math.round(0.55 * 16), '#daa520'],
                  ].map(([label, val, color]) => (
                    <div key={label} className="breakdown-row">
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color }}>{val > 0 ? '+' : ''}{val}</span>
                    </div>
                  ))}
                  <div className="total-premium">
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Weekly Premium</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 800, color: '#b8860b' }}>₹{premium}</span>
                  </div>
                </div>

                <div className="feature-grid">
                  {[
                    ['Max weekly payout', zone.tier === 'red' ? '₹1,100' : zone.tier === 'amber' ? '₹1,200' : '₹1,350'],
                    ['5 triggers active', 'Rain · Heat · AQI · Curfew · Platform'],
                    ['Payout speed', '< 90 seconds'],
                    ['Coverage scope', 'Income loss only'],
                  ].map(([k, v]) => (
                    <div key={k} className="feature-tile">
                      <div className="feature-label">{k}</div>
                      <div className="feature-value">{v}</div>
                    </div>
                  ))}
                </div>

                <button className="btn-primary" onClick={() => {
                  onComplete({
                    ...form,
                    premium,
                    weeklyPayout: zone.tier === 'red' ? 1100 : zone.tier === 'amber' ? 1200 : 1350,
                    trustScore: 72,
                    mutualPool: Math.round(premium * 0.08),
                  });
                }}>
                  Pay ₹{premium} via UPI — Activate →
                </button>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '0.7rem' }}>
                  ✓ No lock-in &nbsp;·&nbsp; ✓ Income loss only &nbsp;·&nbsp; ✓ Cancel anytime
                </div>
                <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}