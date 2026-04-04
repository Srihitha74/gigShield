import React, { useState, useEffect } from 'react'
import Registration from './components/Registration.jsx'
import Dashboard from './components/Dashboard.jsx'
import PolicyManagement from './components/PolicyManagement.jsx'
import ClaimsManagement from './components/ClaimsManagement.jsx'
import TriggerMonitor from './components/TriggerMonitor.jsx'
import Nav from './components/Nav.jsx'

export default function App() {
  const [worker, setWorker] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')
  const [policy, setPolicy] = useState(null)
  const [claims, setClaims] = useState([])
  const [triggerAlert, setTriggerAlert] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gs_worker')
    const savedPolicy = localStorage.getItem('gs_policy')
    const savedClaims = localStorage.getItem('gs_claims')
    if (saved) setWorker(JSON.parse(saved))
    if (savedPolicy) setPolicy(JSON.parse(savedPolicy))
    if (savedClaims) setClaims(JSON.parse(savedClaims))
  }, [])

  const saveWorker = (w) => {
    const withId = { ...w, id: 'GS' + Date.now().toString().slice(-6), registered: true }
    setWorker(withId)
    localStorage.setItem('gs_worker', JSON.stringify(withId))
  }

  const savePolicy = (p) => {
    setPolicy(p)
    localStorage.setItem('gs_policy', JSON.stringify(p))
  }

  const addClaim = (c) => {
    const updated = [c, ...claims]
    setClaims(updated)
    localStorage.setItem('gs_claims', JSON.stringify(updated))
  }

  const updateWorker = (updates) => {
    const updated = { ...worker, ...updates }
    setWorker(updated)
    localStorage.setItem('gs_worker', JSON.stringify(updated))
  }

  // Not registered yet — show registration
  if (!worker || !worker.registered) {
    return <Registration onComplete={saveWorker} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f1a' }}>
      <Nav activePage={activePage} setActivePage={setActivePage} worker={worker} triggerAlert={triggerAlert} />
      <div style={{ paddingTop: '64px' }}>
        {activePage === 'dashboard' && (
          <Dashboard worker={worker} policy={policy} claims={claims} setActivePage={setActivePage} />
        )}
        {activePage === 'policy' && (
          <PolicyManagement worker={worker} policy={policy} onSavePolicy={savePolicy} updateWorker={updateWorker} />
        )}
        {activePage === 'claims' && (
          <ClaimsManagement worker={worker} policy={policy} claims={claims} addClaim={addClaim} />
        )}
        {activePage === 'triggers' && (
          <TriggerMonitor worker={worker} policy={policy} addClaim={addClaim} setTriggerAlert={setTriggerAlert} />
        )}
      </div>
    </div>
  )
}