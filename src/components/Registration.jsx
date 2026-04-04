import React, { useState } from 'react'
import { ZONES, ML_WEIGHTS } from '../data/constants.js'

const S = {
  page: { minHeight:'100vh', background:'#0d0f1a', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  card: { background:'#13172b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'24px', width:'100%', maxWidth:'460px', overflow:'hidden' },
  header: { background:'linear-gradient(135deg,#1a1f35 0%,#0f1225 100%)', padding:'28px 32px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  body: { padding:'28px 32px 32px' },
  label: { fontSize:'0.78rem', fontWeight:600, color:'rgba(255,255,255,0.55)', marginBottom:'7px', display:'block', letterSpacing:'0.3px', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#f0ede6', fontSize:'0.92rem', outline:'none', transition:'border .2s' },
  select: { width:'100%', padding:'12px 16px', background:'#1a1f35', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#f0ede6', fontSize:'0.92rem', outline:'none' },
  btn: { width:'100%', padding:'14px', background:'#ff5722', color:'#fff', border:'none', borderRadius:'30px', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', transition:'all .2s', marginTop:'8px' },
  btnGhost: { width:'100%', padding:'12px', background:'transparent', color:'rgba(255,255,255,0.45)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'30px', fontSize:'0.85rem', cursor:'pointer', marginTop:'8px' },
  field: { marginBottom:'18px' },
  row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
}

export default function Registration({ onComplete }) {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', platform: 'zomato',
    zone: 'old_city', experience: 6, workWindow: 'dinner',
    dailyHours: 8,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const premium = ML_WEIGHTS.compute({
    zone: form.zone,
    experience: form.experience,
    trustScore: 72,
    forecastRisk: 0.55,
    workWindow: form.workWindow,
  })

  const zone = ZONES[form.zone]
  const dailyEarn = form.dailyHours * 90
  const monthlyLoss = Math.round(zone.risk * 24)

  const sendOtp = () => {
    if (form.phone.length >= 10) { setOtpSent(true); setStep(1) }
  }

  const verifyOtp = () => {
    if (otp === '123456' || otp.length === 6) setStep(2)
  }

  const steps = ['Mobile Login', 'Verify OTP', 'Your Profile', 'Get Covered']

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Progress */}
        <div style={{ background:'#0d0f1a', padding:'16px 32px', display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#fff', marginRight:'12px' }}>
            Gig<span style={{ color:'#ff5722' }}>Shield</span>
          </div>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{
                width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: i < step ? '#ff5722' : i === step ? 'rgba(255,87,34,0.2)' : 'rgba(255,255,255,0.05)',
                border: i === step ? '2px solid #ff5722' : '2px solid transparent',
                fontSize:'0.7rem', fontWeight:700,
                color: i <= step ? '#ff5722' : 'rgba(255,255,255,0.3)',
              }}>{i < step ? '✓' : i + 1}</div>
              {i < 3 && <div style={{ flex:1, height:'1px', background: i < step ? '#ff5722' : 'rgba(255,255,255,0.08)' }}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Phone */}
        {step === 0 && (
          <>
            <div style={S.header}>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,87,34,0.8)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'8px' }}>Step 1 — Login</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'6px' }}>Welcome to GigShield</div>
              <div style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.45)' }}>Income protection for Zomato & Swiggy partners</div>
            </div>
            <div style={S.body}>
              <div style={{ textAlign:'center', padding:'12px 0 24px' }}>
                <div style={{ fontSize:'3rem', marginBottom:'8px' }}>🛡️</div>
                <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.4)', lineHeight:'1.7' }}>
                  Pay ₹18–₹65/week. Get up to ₹1,350 back<br/>automatically when disruptions hit your zone.
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Mobile number</label>
                <input style={S.input} type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => set('phone', e.target.value)}
                  onFocus={e => e.target.style.borderColor='#ff5722'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>
              <button style={S.btn} onClick={sendOtp}>Send OTP →</button>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:'12px' }}>
                ✓ No password needed &nbsp;·&nbsp; ✓ Free to try
              </div>
            </div>
          </>
        )}

        {/* Step 1: OTP */}
        {step === 1 && (
          <>
            <div style={S.header}>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,87,34,0.8)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'8px' }}>Step 2 — Verify</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'6px' }}>Verify your number</div>
              <div style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.45)' }}>OTP sent to {form.phone || '+91 98765 43210'}</div>
            </div>
            <div style={S.body}>
              <div style={{ background:'rgba(255,87,34,0.08)', border:'1px solid rgba(255,87,34,0.2)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', fontSize:'0.8rem', color:'rgba(255,165,0,0.9)' }}>
                Demo OTP: <strong style={{ color:'#ff5722', letterSpacing:'4px' }}>123456</strong>
              </div>
              <div style={S.field}>
                <label style={S.label}>Enter 6-digit OTP</label>
                <input style={{ ...S.input, textAlign:'center', letterSpacing:'10px', fontSize:'1.4rem' }}
                  type="text" maxLength={6} placeholder="••••••"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  onFocus={e => e.target.style.borderColor='#ff5722'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>
              <div style={S.field}>
                <label style={S.label}>Your full name</label>
                <input style={S.input} type="text" placeholder="Ramesh Kumar"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor='#ff5722'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>
              <div style={S.field}>
                <label style={S.label}>Primary platform</label>
                <select style={S.select} value={form.platform} onChange={e => set('platform', e.target.value)}>
                  <option value="zomato">Zomato</option>
                  <option value="swiggy">Swiggy</option>
                  <option value="both">Both Zomato & Swiggy</option>
                </select>
              </div>
              <button style={S.btn} onClick={verifyOtp}>Continue →</button>
              <button style={S.btnGhost} onClick={() => setStep(0)}>← Back</button>
            </div>
          </>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <>
            <div style={S.header}>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,87,34,0.8)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'8px' }}>Step 3 — Profile</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'6px' }}>Your delivery profile</div>
              <div style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.45)' }}>Used by our AI to calculate your exact weekly premium</div>
            </div>
            <div style={S.body}>
              <div style={S.field}>
                <label style={S.label}>Primary delivery zone — Hyderabad</label>
                <select style={S.select} value={form.zone} onChange={e => set('zone', e.target.value)}>
                  {Object.entries(ZONES).map(([k, z]) => (
                    <option key={k} value={k}>{z.name} — {z.tier === 'red' ? 'High' : z.tier === 'amber' ? 'Medium' : 'Low'} Risk</option>
                  ))}
                </select>
              </div>
              <div style={S.row}>
                <div style={S.field}>
                  <label style={S.label}>Months on platform</label>
                  <select style={S.select} value={form.experience} onChange={e => set('experience', +e.target.value)}>
                    <option value={1}>Less than 3 months</option>
                    <option value={6}>3–12 months</option>
                    <option value={18}>1–2 years</option>
                    <option value={30}>2+ years</option>
                  </select>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Working window</label>
                  <select style={S.select} value={form.workWindow} onChange={e => set('workWindow', e.target.value)}>
                    <option value="dinner">Dinner rush</option>
                    <option value="lunch">Lunch rush</option>
                    <option value="both">Both</option>
                    <option value="allday">All day</option>
                  </select>
                </div>
              </div>
              {/* AI Insight box */}
              <div style={{ background:'rgba(255,87,34,0.07)', border:'1px solid rgba(255,87,34,0.2)', borderRadius:'12px', padding:'14px 16px', marginBottom:'8px' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#ff5722', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>⚡ AI Risk Insight</div>
                <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.7)', lineHeight:'1.6' }}>
                  Workers in <strong style={{ color:'#fff' }}>{zone.name}</strong> lost an avg of{' '}
                  <strong style={{ color:'#ff5722' }}>₹{monthlyLoss.toLocaleString('en-IN')}/month</strong> to disruptions in the last 90 days.
                  Your estimated weekly risk: <strong style={{ color:'#fff' }}>₹{Math.round(monthlyLoss / 4)}</strong>.
                </div>
              </div>
              <button style={S.btn} onClick={() => setStep(3)}>See my plan →</button>
              <button style={S.btnGhost} onClick={() => setStep(1)}>← Back</button>
            </div>
          </>
        )}

        {/* Step 3: Policy purchase */}
        {step === 3 && (
          <>
            <div style={S.header}>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,87,34,0.8)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'8px' }}>Step 4 — Activate</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'6px' }}>Your weekly plan</div>
              <div style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.45)' }}>XGBoost model calculated · {zone.name} · {zone.tier === 'red' ? 'High' : zone.tier === 'amber' ? 'Medium' : 'Low'} Risk Zone</div>
            </div>
            <div style={S.body}>
              {/* ML Feature breakdown */}
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'16px', padding:'20px', marginBottom:'20px', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'14px' }}>ML Premium Breakdown</div>
                {[
                  ['Base rate', 35, '#666'],
                  [`Zone risk (${zone.name})`, Math.round(zone.risk * 0.42), zone.color],
                  ['Flood history weight', Math.round(zone.floodRisk * 18), '#3b82f6'],
                  ['Experience discount', -Math.round(Math.min(form.experience / 36, 1) * 14), '#22c55e'],
                  ['Forecast risk index', Math.round(0.55 * 16), '#f59e0b'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                    <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)' }}>{label}</span>
                    <span style={{ fontSize:'0.82rem', fontWeight:600, color }}>{val > 0 ? '+' : ''}{val}</span>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(255,255,255,0.8)' }}>Weekly Premium</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'1.6rem', fontWeight:800, color:'#ff5722' }}>₹{premium}</span>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'18px' }}>
                {[
                  ['Max weekly payout', zone.tier === 'red' ? '₹1,100' : zone.tier === 'amber' ? '₹1,200' : '₹1,350'],
                  ['5 triggers active', 'Rain · Heat · AQI · Curfew · Platform'],
                  ['Payout speed', '< 90 seconds'],
                  ['Coverage scope', 'Income loss only'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'12px' }}>
                    <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>{k}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#fff' }}>{v}</div>
                  </div>
                ))}
              </div>

              <button style={S.btn} onClick={() => {
                onComplete({
                  ...form,
                  premium,
                  weeklyPayout: zone.tier === 'red' ? 1100 : zone.tier === 'amber' ? 1200 : 1350,
                  trustScore: 72,
                  mutualPool: Math.round(premium * 0.08),
                })
              }}>
                Pay ₹{premium} via UPI — Activate →
              </button>
              <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)', textAlign:'center', marginTop:'10px' }}>
                ✓ No lock-in &nbsp;·&nbsp; ✓ Income loss only &nbsp;·&nbsp; ✓ Cancel anytime
              </div>
              <button style={S.btnGhost} onClick={() => setStep(2)}>← Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}