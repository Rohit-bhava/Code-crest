import React from 'react';
import { Link } from 'react-router-dom';

const verdictClass = (v) => {
  if (!v) return '';
  if (v === 'ACCEPTED') return 'badge badge-accepted';
  if (v === 'WRONG_ANSWER') return 'badge badge-wrong';
  if (v === 'TIME_LIMIT_EXCEEDED') return 'badge badge-tle';
  return 'badge badge-runtime';
};

export default function RecentActivity({ submissions }) {
  const recent = (submissions || []).slice(0, 5);

  return (
    <div className="card" style={{ flex: 1, minWidth: 280 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Recent Submissions</h3>
        <Link to="/submissions" style={{ fontSize: '0.82rem', color: '#6c47ff' }}>View all →</Link>
      </div>
      {recent.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>No submissions yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {recent.map((s, i) => (
            <li key={s.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                {s.challenge?.title || `Challenge #${s.challenge?.id || '?'}`}
              </span>
              <span className={verdictClass(s.verdict)}>{s.verdict || '—'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
