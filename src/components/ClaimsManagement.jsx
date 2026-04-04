import React, { useState } from 'react'
import { ZONES, TRIGGERS } from '../data/constants.js'

const mockClaims = [
  { id: 'CLM001', trigger: 'Heavy Rainfall', icon: '🌧️', amount: 472, status: 'paid', date: '18 Mar 2026', zone: 'Old City', duration: 2.5, peerEarnings: 295, fraudScore: 0.08, method: 'Income Mirror', time: '19:42' },
  { id: 'CLM002', trigger: 'Extreme Heat',   icon: '🌡️', amount: 324, status: 'paid', date: '12 Mar 2026', zone: 'Old City', duration: 2.0, peerEarnings: 270, fraudScore: 0.12, method: 'Income Mirror', time: '14:15' },
  { id: 'CLM003', trigger: 'Severe AQI',     icon: '😷', amount: 0,   status: 'flagged', date: '05 Mar 2026', zone: 'Old City', duration: 1.5, peerEarnings: 280, fraudScore: 0.68, method: 'Under review', time: '10:30' },
]

export default function ClaimsManagement({ worker, policy, claims, addClaim }) {
  const [activeTab, setActiveTab] = useState('all')
  const [showIncomeModal, setShowIncomeModal] = useState(null)
  const allClaims = [...mockClaims, ...claims]
  const filtered = activeTab === 'all' ? allClaims : allClaims.filter(c => c.status === activeTab)

  const statusColor = { paid: '#22c55e', pending: '#f59e0b', flagged: '#ef4444', rejected: '#6b7280' }
  const statusBg = { paid: 'rgba(22,163,74,0.1)', pending: 'rgba(245,158,11,0.1)', flagged: 'rgba(239,68,68,0.1)', rejected: 'rgba(107,114,128,0.1)' }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Claims Management</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Zero-touch · auto-filed on disruption · Income Mirror payouts</div>
        </div>
        {!policy && (
          <div style={{ background: 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.2)', borderRadius: '10px', padding: '10px 16px', fontSize: '0.8rem', color: 'rgba(255,165,0,0.8)' }}>
            ⚠ Activate a policy to enable auto-claims
          </div>
        )}
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total paid out', value: `₹${allClaims.filter(c=>c.status==='paid').reduce((s,c)=>s+c.amount,0).toLocaleString('en-IN')}`, color: '#22c55e' },
          { label: 'Claims approved', value: allClaims.filter(c=>c.status==='paid').length, color: '#3b82f6' },
          { label: 'Fraud flagged', value: allClaims.filter(c=>c.status==='flagged').length, color: '#ef4444' },
          { label: 'Avg payout time', value: '83 sec', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '20px' }}>
        {['all', 'paid', 'pending', 'flagged'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '7px 18px', borderRadius: '7px', border: 'none', cursor: 'pointer',
            background: activeTab === t ? '#fff' : 'transparent',
            color: activeTab === t ? '#0d0f1a' : 'rgba(255,255,255,0.4)',
            fontSize: '0.82rem', fontWeight: activeTab === t ? 600 : 400, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Claims list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
            No claims yet. Claims auto-file when a disruption trigger fires.
          </div>
        )}
        {filtered.map(c => (
          <div key={c.id} style={{ background: '#13172b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'border .2s' }}
            onClick={() => setShowIncomeModal(c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{c.trigger}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.date} at {c.time} · {c.zone} · {c.duration}h disruption</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>Claim ID: {c.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.3rem', fontWeight: 800, color: c.status === 'paid' ? '#22c55e' : '#f0ede6' }}>
                    {c.status === 'paid' ? `₹${c.amount.toLocaleString('en-IN')}` : c.status === 'flagged' ? 'Flagged' : 'Pending'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>via {c.method}</div>
                </div>
                <div style={{ background: statusBg[c.status], border: `1px solid ${statusColor[c.status]}40`, borderRadius: '20px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, color: statusColor[c.status], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {c.status}
                </div>
              </div>
            </div>

            {/* Fraud score bar */}
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>Fraud probability score (GNN)</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: c.fraudScore > 0.55 ? '#ef4444' : '#22c55e' }}>{(c.fraudScore * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${c.fraudScore * 100}%`, background: c.fraudScore > 0.55 ? '#ef4444' : c.fraudScore > 0.3 ? '#f59e0b' : '#22c55e', borderRadius: '2px', transition: 'width .5s' }}/>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
                {c.fraudScore < 0.55 ? '✓ Auto-approved — below 0.55 threshold' : c.fraudScore < 0.72 ? '⚠ Flagged for manual review (0.55–0.72)' : '✗ Auto-rejected — above 0.72 threshold'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Income Mirror Modal */}
      {showIncomeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}
          onClick={() => setShowIncomeModal(null)}>
          <div style={{ background: '#13172b', borderRadius: '20px', padding: '28px', maxWidth: '460px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Income Mirror Calculation</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Claim {showIncomeModal.id} · {showIncomeModal.date}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['Disruption trigger', showIncomeModal.trigger, '#fff'],
                ['Duration', `${showIncomeModal.duration} hours`, '#fff'],
                ['Peer workers queried (adjacent zones)', '23 workers', '#3b82f6'],
                ['Peer median earnings/hr', `₹${showIncomeModal.peerEarnings}/hr`, '#fff'],
                ['Ghost earnings (peer × hours)', `₹${showIncomeModal.peerEarnings} × ${showIncomeModal.duration} = ₹${Math.round(showIncomeModal.peerEarnings * showIncomeModal.duration).toLocaleString('en-IN')}`, '#f59e0b'],
                ['Coverage ratio', '80%', '#fff'],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: c }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 2px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Your payout</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>₹{showIncomeModal.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => setShowIncomeModal(null)} style={{ width: '100%', marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}