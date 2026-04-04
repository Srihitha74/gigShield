import React from 'react'
import { ZONES } from '../data/constants.js'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const earningsData = [
  { week: 'W1', earned: 4800, protected: 0 },
  { week: 'W2', earned: 3200, protected: 1100 },
  { week: 'W3', earned: 4600, protected: 0 },
  { week: 'W4', earned: 2800, protected: 980 },
  { week: 'W5', earned: 4750, protected: 0 },
  { week: 'W6', earned: 4900, protected: 0 },
]

export default function Dashboard({ worker, policy, claims, setActivePage }) {
  const zone = ZONES[worker.zone]
  const totalProtected = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0)
  const activeClaims = claims.filter(c => c.status === 'pending').length
  const paidClaims = claims.filter(c => c.status === 'paid').length
  const hasPolicy = !!policy

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Welcome bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Good evening, {worker.name?.split(' ')[0]} 👋
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Worker ID: {worker.id} &nbsp;·&nbsp; {zone.name} &nbsp;·&nbsp;
          <span style={{ color: zone.color }}>{zone.tier === 'red' ? 'High' : zone.tier === 'amber' ? 'Medium' : 'Low'} Risk Zone</span>
        </div>
      </div>

      {/* Policy status banner */}
      {!hasPolicy ? (
        <div style={{
          background: 'linear-gradient(135deg,rgba(255,87,34,0.15),rgba(255,87,34,0.05))',
          border: '1px solid rgba(255,87,34,0.3)', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>No active coverage this week</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Workers in {zone.name} lost avg ₹{Math.round(zone.risk * 24).toLocaleString('en-IN')}/month without protection</div>
          </div>
          <button onClick={() => setActivePage('policy')} style={{
            background: '#ff5722', color: '#fff', border: 'none', borderRadius: '30px',
            padding: '11px 22px', fontFamily: 'Syne,sans-serif', fontWeight: 700,
            fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>Activate Cover →</button>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg,rgba(22,163,74,0.12),rgba(22,163,74,0.04))',
          border: '1px solid rgba(22,163,74,0.3)', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }}/>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Coverage Active — Week {policy.weekNumber || 1}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>5 triggers monitoring · Income Mirror enabled · Payout in &lt;90s</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>₹{policy.premium}/wk</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Max payout: ₹{policy.maxPayout?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Earnings Protected', value: `₹${totalProtected.toLocaleString('en-IN')}`, sub: 'via Income Mirror payouts', color: '#22c55e' },
          { label: 'Claims Paid', value: paidClaims, sub: 'automatic payouts', color: '#3b82f6' },
          { label: 'Pending Claims', value: activeClaims, sub: 'under review', color: '#f59e0b' },
          { label: 'Trust Score', value: worker.trustScore || 72, sub: 'out of 100', color: worker.trustScore >= 90 ? '#22c55e' : worker.trustScore >= 70 ? '#f59e0b' : '#ef4444' },
          { label: 'Zone Risk Score', value: zone.risk, sub: zone.name, color: zone.color },
          { label: 'Mutual Aid Pool', value: `₹${(worker.mutualPool || 0) * (policy ? 1 : 0)}`, sub: '8% of your premiums', color: '#8b5cf6' },
        ].map(c => (
          <div key={c.label} style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{c.label}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 800, color: c.color, lineHeight: 1, marginBottom: '4px' }}>{c.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Earnings chart */}
      <div style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Weekly Earnings vs Protected Income</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Orange = GigShield payout received during disruption weeks</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '3px', background: '#3b82f6', borderRadius: '2px' }}/><span style={{ color: 'rgba(255,255,255,0.4)' }}>Earnings</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '3px', background: '#ff5722', borderRadius: '2px' }}/><span style={{ color: 'rgba(255,255,255,0.4)' }}>GigShield payout</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={earningsData}>
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
            <Tooltip contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.8rem' }} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n === 'earned' ? 'Earnings' : 'Payout']} />
            <Area type="monotone" dataKey="earned" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} />
            <Area type="monotone" dataKey="protected" stroke="#ff5722" fill="rgba(255,87,34,0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent claims */}
      {claims.length > 0 && (
        <div style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Recent Claims</div>
          {claims.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{c.trigger}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{c.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#22c55e' }}>₹{c.amount?.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.7rem', color: c.status === 'paid' ? '#22c55e' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.status}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setActivePage('claims')} style={{ marginTop: '12px', background: 'transparent', border: 'none', color: '#ff5722', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            View all claims →
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.95)}}`}</style>
    </div>
  )
}