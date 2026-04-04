import React from 'react';

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'policy',    label: 'My Policy',  icon: '◈' },
  { id: 'claims',    label: 'Claims',     icon: '◎' },
  { id: 'triggers',  label: 'Live Monitor', icon: '◉' },
];

export default function Nav({ activePage, setActivePage, worker, triggerAlert }) {
  return (
    <>
      <style>{`
        .nav-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: linear-gradient(90deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          font-family: 'Poppins', system-ui, sans-serif;
        }

        .logo {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: 0.08em;
          color: #e8d5b7;
          text-transform: uppercase;
        }
        .logo-accent {
          color: #b8860b;
        }
        .phase-badge {
          background: linear-gradient(135deg, #b8860b, #daa520);
          border: none;
          border-radius: 3rem;
          padding: 0.2rem 0.6rem;
          font-size: 0.6rem;
          font-weight: 600;
          color: #0d0d1a;
          margin-left: 0.75rem;
          letter-spacing: 0.1em;
        }

        .nav-links {
          display: flex;
          gap: 0.6rem;
        }
        .nav-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 0.5rem;
          padding: 0.5rem 1.2rem;
          cursor: pointer;
          color: #a0a0a0;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Poppins', sans-serif;
        }
        .nav-btn i {
          font-style: normal;
          font-size: 0.95rem;
        }
        .nav-btn.active {
          background: linear-gradient(135deg, #b8860b 0%, #cd950c 100%);
          border-color: #daa520;
          color: #0d0d1a;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(184, 134, 11, 0.3);
        }
        .nav-btn:not(.active):hover {
          background: rgba(184, 134, 11, 0.1);
          border-color: #b8860b;
          color: #e8d5b7;
        }
        .trigger-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff4757;
          margin-left: 0.3rem;
          animation: pulse-alert 1.2s infinite;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8860b, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          fontFamily: "'Cinzel', serif";
          font-weight: 700;
          font-size: 0.85rem;
          color: #0d0d1a;
          border: 2px solid #daa520;
        }
        .user-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: #c0c0c0;
          font-family: 'Poppins', sans-serif;
        }

        @keyframes pulse-alert {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @media (max-width: 680px) {
          .nav-root { padding: 0 1rem; }
          .nav-btn { padding: 0.4rem 0.7rem; font-size: 0.7rem; }
          .logo { font-size: 1.1rem; }
          .user-name { display: none; }
          .phase-badge { display: none; }
        }
      `}</style>

      <nav className="nav-root">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="logo">
            we<span className="logo-accent">ForRiders</span>
          </div>
          <div className="phase-badge">INSURE</div>
        </div>

        <div className="nav-links">
          {pages.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className={`nav-btn ${activePage === p.id ? 'active' : ''}`}
            >
              <i>{p.icon}</i>
              {p.label}
              {p.id === 'triggers' && triggerAlert && (
                <span className="trigger-dot" />
              )}
            </button>
          ))}
        </div>

        <div className="user-section">
          <div className="avatar">
            {worker?.name?.charAt(0)?.toUpperCase() || 'G'}
          </div>
          <div className="user-name">
            {worker?.name?.split(' ')[0] || 'User'}
          </div>
        </div>
      </nav>
    </>
  );
}