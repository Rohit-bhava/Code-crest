import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySubmissions, fetchAllSubmissions } from '../store/slices/submissionSlice';
import EmptyState from '../components/common/EmptyState';

const verdictClass = (v) => {
  if (v === 'ACCEPTED') return 'badge badge-accepted';
  if (v === 'WRONG_ANSWER') return 'badge badge-wrong';
  if (v === 'TIME_LIMIT_EXCEEDED') return 'badge badge-tle';
  return 'badge badge-runtime';
};

const fmt = (dt) => dt ? new Date(dt).toLocaleString() : '—';

export default function Submissions() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.submissions);
  const { user } = useSelector((s) => s.auth);
  const isContestant = user?.role === 'CONTESTANT';

  useEffect(() => {
    if (isContestant) dispatch(fetchMySubmissions());
    else dispatch(fetchAllSubmissions(0));
  }, [dispatch, isContestant]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Submissions</h1>
        <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
          {isContestant ? 'Your submission history' : 'All submissions'}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {!list?.length ? (
          <EmptyState icon="📝" title="No submissions yet" message="Submit a solution to a challenge to see it here." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Challenge</th>
                  <th>Contest</th>
                  <th>Verdict</th>
                  <th>Points</th>
                  <th>Exec Time</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s, i) => (
                  <tr key={s.id || i}>
                    <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: '#1e293b' }}>
                      {s.challenge?.title || `Challenge #${s.challenge?.id || '?'}`}
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {s.contest?.title || '—'}
                    </td>
                    <td>
                      {s.verdict ? (
                        <span className={verdictClass(s.verdict)}>{s.verdict.replace(/_/g, ' ')}</span>
                      ) : '—'}
                    </td>
                    <td style={{ fontWeight: 600, color: s.pointsEarned > 0 ? '#10b981' : '#94a3b8' }}>
                      {s.pointsEarned ?? 0}
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {s.executionTimeMs != null ? `${s.executionTimeMs}ms` : '—'}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{fmt(s.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
