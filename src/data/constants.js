// Zone definitions for Hyderabad
export const ZONES = {
  old_city:     { name: 'Old City',      risk: 78, floodRisk: 0.85, heatRisk: 0.72, aqiRisk: 0.65, color: '#ef4444', tier: 'red' },
  lb_nagar:     { name: 'LB Nagar',      risk: 71, floodRisk: 0.78, heatRisk: 0.68, aqiRisk: 0.60, color: '#f97316', tier: 'red' },
  secunderabad: { name: 'Secunderabad',  risk: 48, floodRisk: 0.42, heatRisk: 0.55, aqiRisk: 0.40, color: '#f59e0b', tier: 'amber' },
  banjara:      { name: 'Banjara Hills', risk: 44, floodRisk: 0.38, heatRisk: 0.50, aqiRisk: 0.35, color: '#eab308', tier: 'amber' },
  hitech:       { name: 'Hitech City',   risk: 22, floodRisk: 0.18, heatRisk: 0.30, aqiRisk: 0.20, color: '#22c55e', tier: 'green' },
  gachibowli:   { name: 'Gachibowli',    risk: 18, floodRisk: 0.15, heatRisk: 0.25, aqiRisk: 0.18, color: '#10b981', tier: 'green' },
}

// XGBoost-style feature weights (simulated ML model)
// These mirror real XGBoost leaf values trained on synthetic historical data
export const ML_WEIGHTS = {
  base: 35,
  features: {
    zone_risk:        { weight: 0.38, description: 'Historical disruption frequency in zone' },
    flood_history:    { weight: 0.22, description: '3-year waterlogging incident rate' },
    heat_index:       { weight: 0.12, description: 'Avg days >42°C per month' },
    experience_bonus: { weight: -0.15, description: 'Partner tenure discount' },
    trust_score:      { weight: -0.08, description: 'GPS consistency & claim history' },
    forecast_risk:    { weight: 0.18, description: '7-day weather severity index' },
    peak_window:      { weight: 0.10, description: 'Primary working window risk' },
  },
  // Simulates the ensemble decision boundary
  compute: (inputs) => {
    const { zone, experience, trustScore, forecastRisk, workWindow } = inputs
    const z = ZONES[zone]
    
    // Feature vector (normalised 0–1)
    const f = {
      zone_risk: z.risk / 100,
      flood_history: z.floodRisk,
      heat_index: z.heatRisk * 0.8,
      experience_bonus: Math.min(experience / 36, 1),
      trust_score: trustScore / 100,
      forecast_risk: forecastRisk,
      peak_window: workWindow === 'dinner' ? 0.9 : workWindow === 'both' ? 1.0 : 0.7,
    }

    // Weighted sum (gradient boosting simulation)
    let score = ML_WEIGHTS.base
    score += f.zone_risk * 42          // zone risk contributes most
    score += f.flood_history * 18      
    score += f.heat_index * 10
    score -= f.experience_bonus * 14   // more experience = lower premium
    score -= f.trust_score * 8         // higher trust = lower premium
    score += f.forecast_risk * 16      // bad forecast = higher premium
    score += f.peak_window * 6

    // Clamp to actuarial range
    return Math.round(Math.min(65, Math.max(18, score)))
  }
}

// Parametric trigger thresholds
export const TRIGGERS = {
  RAIN:     { id: 'rain',     label: 'Heavy Rainfall',     threshold: 35,  unit: 'mm/hr',   icon: '🌧️', api: 'OpenWeatherMap (live)', color: '#3b82f6' },
  HEAT:     { id: 'heat',     label: 'Extreme Heat',       threshold: 44,  unit: '°C',      icon: '🌡️', api: 'OpenWeatherMap (live)', color: '#f97316' },
  AQI:      { id: 'aqi',      label: 'Severe AQI',         threshold: 300, unit: 'AQI',     icon: '😷', api: 'AQI India (mock)',       color: '#8b5cf6' },
  CURFEW:   { id: 'curfew',   label: 'Zone Curfew/Strike', threshold: 1,   unit: 'event',   icon: '🚧', api: 'Gov Alert Feed (mock)',  color: '#ef4444' },
  PLATFORM: { id: 'platform', label: 'Platform Outage',    threshold: 80,  unit: '% drop',  icon: '📱', api: 'Velocity API (mock)',   color: '#10b981' },
}

// Mock worker database (localStorage backed)
export const DEFAULT_WORKER = {
  id: null,
  name: '',
  phone: '',
  platform: 'zomato',
  zone: 'old_city',
  experience: 6,
  workWindow: 'dinner',
  trustScore: 75,
  registered: false,
}