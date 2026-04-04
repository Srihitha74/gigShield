import React from 'react'

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'policy',    label: 'My Policy',  icon: '◈' },
  { id: 'claims',    label: 'Claims',     icon: '◎' },
  { id: 'triggers',  label: 'Live Monitor', icon: '◉' },
]

export default function Nav({ activePage, setActivePage, worker, triggerAlert }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(13,15,26,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      height: '64px', display: 'flex', alignItems: 'center',
      padding: '0 24px', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem',
          color: '#fff', letterSpacing: '-0.5px',
        }}>
          Gig<span style={{ color: '#ff5722' }}>Shield</span>
        </div>
        <div style={{
          background: 'rgba(255,87,34,0.12)', border: '1px solid rgba(255,87,34,0.25)',
          borderRadius: '20px', padding: '2px 10px',
          fontSize: '0.68rem', fontWeight: 700, color: '#ff5722', letterSpacing: '0.5px',
        }}>PHASE 2</div>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {pages.map(p => (
          <button key={p.id} onClick={() => setActivePage(p.id)} style={{
            background: activePage === p.id ? 'rgba(255,87,34,0.15)' : 'transparent',
            border: activePage === p.id ? '1px solid rgba(255,87,34,0.3)' : '1px solid transparent',
            borderRadius: '8px', padding: '7px 14px', cursor: 'pointer',
            color: activePage === p.id ? '#ff5722' : 'rgba(255,255,255,0.5)',
            fontSize: '0.83rem', fontWeight: activePage === p.id ? 600 : 400,
            transition: 'all .2s', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontSize: '0.9rem' }}>{p.icon}</span>
            {p.label}
            {p.id === 'triggers' && triggerAlert && (
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#ef4444', display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}/>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'rgba(255,87,34,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#ff5722',
        }}>
          {worker?.name?.charAt(0)?.toUpperCase() || 'W'}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
          {worker?.name?.split(' ')[0] || 'Worker'}
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </nav>
  )
}