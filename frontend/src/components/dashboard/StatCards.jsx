import React from 'react';

export default function StatCards({ profile, challengeCount, contestCount }) {
  const cards = [
    { label: 'Total Points', value: profile?.totalPoints ?? 0, icon: '🏆', color: '#6c47ff' },
    { label: 'Global Rank', value: profile?.globalRank ? `#${profile.globalRank}` : '—', icon: '📊', color: '#10b981' },
    { label: 'Challenges', value: challengeCount, icon: '💻', color: '#f59e0b' },
    { label: 'Contests', value: contestCount, icon: '🏁', color: '#3b82f6' },
  ];

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <div className="stat-icon" style={{ color: c.color }}>{c.icon}</div>
          <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
      <style>{`
        .stat-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin-bottom:28px; }
        .stat-card { background:#fff; border-radius:12px; padding:20px; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
        .stat-icon { font-size:1.8rem; margin-bottom:8px; }
        .stat-value { font-size:1.8rem; font-weight:800; margin-bottom:4px; }
        .stat-label { font-size:0.82rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
      `}</style>
    </div>
  );
}
