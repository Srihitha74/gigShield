import React, { useState } from 'react';
import { ZONES, TRIGGERS } from '../data/constants.js';

const mockClaims = [
  { id: 'CLM001', trigger: 'Heavy Rainfall', icon: '🌧️', amount: 472, status: 'paid', date: '18 Mar 2026', zone: 'Old City', duration: 2.5, peerEarnings: 295, fraudScore: 0.08, method: 'Income Mirror', time: '19:42' },
  { id: 'CLM002', trigger: 'Extreme Heat',   icon: '🌡️', amount: 324, status: 'paid', date: '12 Mar 2026', zone: 'Old City', duration: 2.0, peerEarnings: 270, fraudScore: 0.12, method: 'Income Mirror', time: '14:15' },
  { id: 'CLM003', trigger: 'Severe AQI',     icon: '😷', amount: 0,   status: 'flagged', date: '05 Mar 2026', zone: 'Old City', duration: 1.5, peerEarnings: 280, fraudScore: 0.68, method: 'Under review', time: '10:30' },
];

export default function ClaimsManagement({ worker, policy, claims, addClaim }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showIncomeModal, setShowIncomeModal] = useState(null);
  const allClaims = [...mockClaims, ...claims];
  const filtered = activeTab === 'all' ? allClaims : allClaims.filter(c => c.status === activeTab);

  return (
    <>
      <style>{`
        /* ----- GLOBAL RESET & FONTS ----- */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .claims-dashboard {
          --bg-gradient: radial-gradient(circle at 10% 20%, rgba(12, 12, 24, 1) 0%, rgba(8, 8, 18, 1) 100%);
          --card-bg: rgba(20, 20, 35, 0.8);
          --card-border: rgba(184, 134, 11, 0.1);
          --glow-primary: rgba(60, 179, 113, 0.3);
          --glow-flagged: rgba(220, 20, 60, 0.3);
          --accent-blue: #4a90d9;
          --accent-orange: #daa520;
          --text-primary: #e8d5b7;
          --text-secondary: rgba(255, 255, 255, 0.55);
          --text-muted: rgba(255, 255, 255, 0.3);
          --transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .claims-dashboard {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-gradient);
          border-radius: 2rem;
          backdrop-filter: blur(2px);
          color: var(--text-primary);
          position: relative;
          overflow: hidden;
        }

        /* animated grain overlay */
        .claims-dashboard::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=');
          background-repeat: repeat;
          opacity: 0.2;
          pointer-events: none;
        }

        /* typography */
        .claims-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.25rem;
        }
        .claims-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          border-left: 2px solid var(--accent-orange);
          padding-left: 0.75rem;
          margin-top: 0.25rem;
        }

        /* summary cards grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1rem;
          margin: 2rem 0 1.8rem;
        }
        .stat-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.2rem;
          transition: var(--transition);
        }
        .stat-card:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -8px rgba(0,0,0,0.4);
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-family: 'Cinzel', serif;
          font-size: 1.7rem;
          font-weight: 800;
          line-height: 1.2;
        }

        /* tabs */
        .tabs-container {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          padding: 0.3rem;
          border-radius: 2rem;
          width: fit-content;
          margin-bottom: 1.5rem;
        }
        .tab-btn {
          padding: 0.5rem 1.2rem;
          border-radius: 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .tab-btn.active {
          background: white;
          color: #0a0e1c;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .tab-btn:not(.active):hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }

        /* claim card */
        .claim-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.2rem;
          margin-bottom: 0.8rem;
          transition: var(--transition);
          cursor: pointer;
        }
        .claim-card:hover {
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
          box-shadow: 0 20px 30px -15px rgba(0,0,0,0.5);
        }
        .claim-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }
        .claim-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.05);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .claim-info h4 {
          font-weight: 600;
          margin: 0 0 4px;
          font-size: 1rem;
        }
        .claim-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .claim-amount {
          text-align: right;
        }
        .amount-value {
          font-family: 'Cinzel', serif;
          font-size: 1.3rem;
          font-weight: 800;
        }
        .status-badge {
          padding: 0.2rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .status-paid { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
        .status-flagged { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
        .status-pending { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; }
        .status-rejected { background: rgba(107,114,128,0.2); border: 1px solid rgba(107,114,128,0.3); color: #9ca3af; }

        /* fraud bar */
        .fraud-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .fraud-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          margin-bottom: 0.4rem;
          color: var(--text-muted);
        }
        .fraud-bar-bg {
          height: 5px;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .fraud-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.4s ease;
        }
        .fraud-note {
          font-size: 0.65rem;
          margin-top: 0.3rem;
          color: var(--text-muted);
        }

        /* modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        .modal-card {
          background: #11131f;
          border-radius: 1.5rem;
          padding: 1.5rem;
          max-width: 460px;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 30px 40px -20px black;
        }
        .modal-row {
          display: flex;
          justify-content: space-between;
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .payout-value {
          font-family: 'Cinzel', serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #3cb371;
        }
        .close-modal {
          width: 100%;
          margin-top: 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.7rem;
          border-radius: 1rem;
          color: #ccc;
          cursor: pointer;
          transition: 0.2s;
        }
        .close-modal:hover {
          background: rgba(255,255,255,0.12);
        }

        @media (max-width: 640px) {
          .claims-dashboard { padding: 1rem; margin: 0.5rem; }
          .stat-value { font-size: 1.3rem; }
        }
      `}</style>

      <div className="claims-dashboard">
        <div className="claims-title">Claims Management</div>
        <div className="claims-sub">Zero‑touch · auto‑filed on disruption · Income Mirror payouts</div>

        {/* summary stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total paid out</div>
            <div className="stat-value" style={{ color: '#3cb371' }}>
              ₹{allClaims.filter(c=>c.status==='paid').reduce((s,c)=>s+c.amount,0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Claims approved</div>
            <div className="stat-value" style={{ color: '#4a90d9' }}>{allClaims.filter(c=>c.status==='paid').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Fraud flagged</div>
            <div className="stat-value" style={{ color: '#dc143c' }}>{allClaims.filter(c=>c.status==='flagged').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg payout time</div>
            <div className="stat-value" style={{ color: '#daa520' }}>83 sec</div>
          </div>
        </div>

        {/* tabs */}
        <div className="tabs-container">
          {['all', 'paid', 'pending', 'flagged'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab-btn ${activeTab === t ? 'active' : ''}`}>
              {t}
            </button>
          ))}
        </div>

        {/* claims list */}
        <div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
              No claims yet. Claims auto-file when a disruption trigger fires.
            </div>
          )}
          {filtered.map(c => {
            let fraudColor = '#3cb371';
            if (c.fraudScore > 0.55) fraudColor = '#dc143c';
            else if (c.fraudScore > 0.3) fraudColor = '#daa520';
            
            return (
              <div key={c.id} className="claim-card" onClick={() => setShowIncomeModal(c)}>
                <div className="claim-header">
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <div className="claim-icon">{c.icon}</div>
                    <div className="claim-info">
                      <h4>{c.trigger}</h4>
                      <div className="claim-meta">{c.date} at {c.time} · {c.zone} · {c.duration}h disruption</div>
                      <div className="claim-meta" style={{ fontSize: '0.65rem' }}>ID: {c.id}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <div className="claim-amount">
                      <div className="amount-value" style={{ color: c.status === 'paid' ? '#3cb371' : '#f0ede6' }}>
                        {c.status === 'paid' ? `₹${c.amount.toLocaleString('en-IN')}` : c.status === 'flagged' ? 'Flagged' : 'Pending'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>via {c.method}</div>
                    </div>
                    <div className={`status-badge status-${c.status}`}>{c.status}</div>
                  </div>
                </div>
                <div className="fraud-section">
                  <div className="fraud-header">
                    <span>Fraud probability score (GNN)</span>
                    <span style={{ fontWeight: 600, color: fraudColor }}>{(c.fraudScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="fraud-bar-bg">
                    <div className="fraud-bar-fill" style={{ width: `${c.fraudScore * 100}%`, background: fraudColor }} />
                  </div>
                  <div className="fraud-note">
                    {c.fraudScore < 0.55 ? '✓ Auto-approved — below 0.55 threshold' : c.fraudScore < 0.72 ? '⚠ Flagged for manual review (0.55–0.72)' : '✗ Auto-rejected — above 0.72 threshold'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Income Mirror Modal */}
        {showIncomeModal && (
          <div className="modal-overlay" onClick={() => setShowIncomeModal(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.2rem' }}>Income Mirror Calculation</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                Claim {showIncomeModal.id} · {showIncomeModal.date}
              </div>
              <div>
                <div className="modal-row"><span>Disruption trigger</span><span>{showIncomeModal.trigger}</span></div>
                <div className="modal-row"><span>Duration</span><span>{showIncomeModal.duration} hours</span></div>
                <div className="modal-row"><span>Peer workers queried</span><span>23 workers</span></div>
                <div className="modal-row"><span>Peer median earnings/hr</span><span>₹{showIncomeModal.peerEarnings}/hr</span></div>
                <div className="modal-row"><span>Ghost earnings (peer × hours)</span><span>₹{Math.round(showIncomeModal.peerEarnings * showIncomeModal.duration).toLocaleString('en-IN')}</span></div>
                <div className="modal-row"><span>Coverage ratio</span><span>80%</span></div>
                <div className="modal-row" style={{ marginTop: '0.5rem', borderBottom: 'none' }}>
                  <span style={{ fontWeight: 700 }}>Your payout</span>
                  <span className="payout-value">₹{showIncomeModal.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="close-modal" onClick={() => setShowIncomeModal(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}