import React from 'react';
import { ZONES } from '../data/constants.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
  { week: 'W1', earned: 4800, protected: 0 },
  { week: 'W2', earned: 3200, protected: 1100 },
  { week: 'W3', earned: 4600, protected: 0 },
  { week: 'W4', earned: 2800, protected: 980 },
  { week: 'W5', earned: 4750, protected: 0 },
  { week: 'W6', earned: 4900, protected: 0 },
];

export default function Dashboard({ worker, policy, claims, setActivePage }) {
  const zone = ZONES[worker.zone];
  const totalProtected = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const activeClaims = claims.filter(c => c.status === 'pending').length;
  const paidClaims = claims.filter(c => c.status === 'paid').length;
  const hasPolicy = !!policy;

  return (
    <>
      <style>{`
        /* ----- GLOBAL RESET & FONTS (dashboard) ----- */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .dashboard-root {
          --bg-dark: radial-gradient(circle at 10% 30%, rgba(12, 12, 24, 1) 0%, rgba(8, 8, 18, 1) 100%);
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

        .dashboard-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-dark);
          border-radius: 2rem;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }

        /* animated grain texture */
        .dashboard-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjYiIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=');
          background-repeat: repeat;
          opacity: 0.25;
          pointer-events: none;
        }

        /* typography */
        .greeting-title {
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
        .worker-meta {
          font-size: 0.85rem;
          color: var(--text-muted);
          border-left: 2px solid var(--accent-primary);
          padding-left: 0.75rem;
          margin-top: 0.2rem;
        }

        /* policy banners */
        .policy-banner {
          border-radius: 1.2rem;
          padding: 1.2rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          backdrop-filter: blur(8px);
          transition: var(--transition);
        }
        .policy-banner.inactive {
          background: linear-gradient(135deg, rgba(255,87,34,0.12), rgba(255,87,34,0.02));
          border: 1px solid rgba(255,87,34,0.3);
        }
        .policy-banner.active {
          background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.02));
          border: 1px solid rgba(34,197,94,0.3);
        }
        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3cb371;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        .btn-primary {
          background: #b8860b;
          border: none;
          border-radius: 2rem;
          padding: 0.7rem 1.5rem;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: white;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-primary:hover {
          background: #ff784e;
          transform: scale(1.02);
          box-shadow: 0 6px 14px rgba(255,87,34,0.3);
        }
        .btn-link {
          background: transparent;
          border: none;
          color: #b8860b;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-link:hover {
          color: #ff8c66;
          transform: translateX(4px);
        }

        /* stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
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
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.4);
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-family: 'Cinzel', serif;
          font-size: 1.7rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0.2rem;
        }
        .stat-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* chart card */
        .chart-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;
        }
        .legend {
          display: flex;
          gap: 1.2rem;
          font-size: 0.7rem;
        }
        .legend-dot {
          width: 10px;
          height: 3px;
          border-radius: 2px;
          display: inline-block;
          margin-right: 0.3rem;
        }

        /* recent claims list */
        .recent-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 1.2rem;
          padding: 1.5rem;
        }
        .claim-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .claim-item:last-child {
          border-bottom: none;
        }

        @media (max-width: 640px) {
          .dashboard-container { padding: 1rem; margin: 0.5rem; }
          .stat-value { font-size: 1.4rem; }
          .greeting-title { font-size: 1.4rem; }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Welcome section */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div className="greeting-title">Good evening, {worker.name?.split(' ')[0]} 👋</div>
          <div className="worker-meta">
            Worker ID: {worker.id} &nbsp;·&nbsp; {zone.name} &nbsp;·&nbsp;
            <span style={{ color: zone.color }}>
              {zone.tier === 'red' ? 'High' : zone.tier === 'amber' ? 'Medium' : 'Low'} Risk Zone
            </span>
          </div>
        </div>

        {/* Policy status banner */}
        {!hasPolicy ? (
          <div className="policy-banner inactive">
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                No active coverage this week
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Workers in {zone.name} lost avg ₹{Math.round(zone.risk * 24).toLocaleString('en-IN')}/month without protection
              </div>
            </div>
            <button onClick={() => setActivePage('policy')} className="btn-primary">
              Activate Cover →
            </button>
          </div>
        ) : (
          <div className="policy-banner active">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="pulse-dot" />
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                  Coverage Active — Week {policy.weekNumber || 1}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  5 triggers monitoring · Income Mirror enabled · Payout in &lt;90s
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', fontWeight: 800, color: '#3cb371' }}>
                ₹{policy.premium}/wk
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Max payout: ₹{policy.maxPayout?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="stats-grid">
          {[
            { label: 'Total Earnings Protected', value: `₹${totalProtected.toLocaleString('en-IN')}`, sub: 'via Income Mirror payouts', color: '#3cb371' },
            { label: 'Claims Paid', value: paidClaims, sub: 'automatic payouts', color: '#4a90d9' },
            { label: 'Pending Claims', value: activeClaims, sub: 'under review', color: '#daa520' },
            { label: 'Trust Score', value: worker.trustScore || 72, sub: 'out of 100', color: (worker.trustScore || 72) >= 90 ? '#3cb371' : (worker.trustScore || 72) >= 70 ? '#daa520' : '#ef4444' },
            { label: 'Zone Risk Score', value: zone.risk, sub: zone.name, color: zone.color },
            { label: 'Mutual Aid Pool', value: `₹${((worker.mutualPool || 0) * (policy ? 1 : 0)).toLocaleString('en-IN')}`, sub: '8% of your premiums', color: '#8b5cf6' },
          ].map(c => (
            <div key={c.label} className="stat-card">
              <div className="stat-label">{c.label}</div>
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Earnings chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, marginBottom: '2px' }}>Weekly Earnings vs Protected Income</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Orange = GigShield payout received during disruption weeks</div>
            </div>
            <div className="legend">
              <div><span className="legend-dot" style={{ background: '#4a90d9' }}></span>Earnings</div>
              <div><span className="legend-dot" style={{ background: '#b8860b' }}></span>GigShield payout</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={earningsData}>
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.75rem' }} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n === 'earned' ? 'Earnings' : 'Payout']} />
              <Area type="monotone" dataKey="earned" stroke="#4a90d9" fill="rgba(59,130,246,0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="protected" stroke="#b8860b" fill="rgba(184, 134, 11, 0.12)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent claims */}
        {claims.length > 0 && (
          <div className="recent-card">
            <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, marginBottom: '1rem' }}>Recent Claims</div>
            {claims.slice(0, 3).map(c => (
              <div key={c.id} className="claim-item">
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.trigger}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#3cb371' }}>₹{c.amount?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.7rem', color: c.status === 'paid' ? '#3cb371' : '#daa520', textTransform: 'uppercase' }}>{c.status}</div>
                </div>
              </div>
            ))}
            <button onClick={() => setActivePage('claims')} className="btn-link" style={{ marginTop: '0.8rem' }}>
              View all claims →
            </button>
          </div>
        )}
      </div>
    </>
  );
}