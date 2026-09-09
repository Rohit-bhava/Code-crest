import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChallengeById, submitSolution, clearSubmissionResult } from '../store/slices/challengeSlice';
import { toast } from 'react-toastify';

const diffClass = (d) => {
  if (d === 'EASY') return 'badge badge-easy';
  if (d === 'MEDIUM') return 'badge badge-medium';
  return 'badge badge-hard';
};

const verdictClass = (v) => {
  if (v === 'ACCEPTED') return 'badge badge-accepted';
  if (v === 'WRONG_ANSWER') return 'badge badge-wrong';
  if (v === 'TIME_LIMIT_EXCEEDED') return 'badge badge-tle';
  return 'badge badge-runtime';
};

export default function ChallengeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: challenge, loading, error, submissionResult } = useSelector((s) => s.challenges);
  const { user } = useSelector((s) => s.auth);
  const isContestant = user?.role === 'CONTESTANT';

  const [code, setCode] = useState('');
  const [contestId, setContestId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchChallengeById(id));
    return () => dispatch(clearSubmissionResult());
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) { toast.error('Please enter your solution code'); return; }
    setSubmitting(true);
    const payload = { sourceCode: code };
    if (contestId) payload.contestId = Number(contestId);
    const res = await dispatch(submitSolution({ id: Number(id), data: payload }));
    setSubmitting(false);
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`Submitted! Verdict: ${res.payload.verdict}`);
    } else {
      toast.error(res.payload || 'Submission failed');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!challenge) return null;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/challenges')} style={{ marginBottom: 16 }}>
        ← Back to Challenges
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>{challenge.title}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={diffClass(challenge.difficulty)}>{challenge.difficulty}</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>🏆 {challenge.basePoints} pts</span>
            {challenge.timeLimitMs && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>⏱ {challenge.timeLimitMs}ms</span>}
          </div>
        </div>
        <div style={{ color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{challenge.description}</div>
        {challenge.setter && (
          <p style={{ marginTop: 16, fontSize: '0.82rem', color: '#94a3b8' }}>
            Set by: {challenge.setter.username || challenge.setter.id}
          </p>
        )}
      </div>

      {isContestant && (
        <div className="card">
          <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: '#1e293b' }}>Submit Solution</h2>
          {submissionResult && (
            <div className={`alert ${submissionResult.verdict === 'ACCEPTED' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 16 }}>
              <strong>Verdict:</strong> <span className={verdictClass(submissionResult.verdict)}>{submissionResult.verdict}</span>
              {submissionResult.pointsEarned != null && <span style={{ marginLeft: 12 }}>Points: {submissionResult.pointsEarned}</span>}
              {submissionResult.executionTimeMs != null && <span style={{ marginLeft: 12 }}>Time: {submissionResult.executionTimeMs}ms</span>}
              {submissionResult.message && <div style={{ marginTop: 6 }}>{submissionResult.message}</div>}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Contest ID (optional)</label>
              <input type="number" className="form-control" value={contestId} onChange={(e) => setContestId(e.target.value)} placeholder="Leave blank for practice" style={{ maxWidth: 200 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Source Code *</label>
              <textarea
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your solution here..."
                rows={12}
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
