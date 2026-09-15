import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeChallenge } from '../../store/slices/challengeSlice';
import EmptyState from '../common/EmptyState';
import { toast } from 'react-toastify';

const diffClass = (d) => {
  if (d === 'EASY') return 'badge badge-easy';
  if (d === 'MEDIUM') return 'badge badge-medium';
  return 'badge badge-hard';
};

export default function ChallengeList({ onPageChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const challengeState = useSelector((s) => s.challenges);
  const role = user?.role;
  const isAdmin = role === 'PLATFORM_ADMIN';

  const items = Array.isArray(challengeState?.items) ? challengeState.items
    : Array.isArray(challengeState?.list) ? challengeState.list
    : (challengeState?.items ?? challengeState?.content ?? challengeState?.list ?? []);
  const loading = challengeState?.loading ?? false;
  const totalPages = challengeState?.totalPages ?? 0;
  const currentPage = challengeState?.currentPage ?? 0;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this challenge?')) return;
    const res = await dispatch(removeChallenge(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Challenge deleted');
    else toast.error(res.payload || 'Failed to delete');
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!items.length && totalPages <= 1) return <EmptyState icon="💻" title="No challenges found" message="Check back later or create one." />;

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Points</th>
              <th>Time Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                <td>
                  <button
                    onClick={() => navigate(`/challenges/${c.id}`)}
                    style={{ background: 'none', border: 'none', color: '#6c47ff', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.93rem' }}
                  >
                    {c.title}
                  </button>
                </td>
                <td><span className={diffClass(c.difficulty)}>{c.difficulty}</span></td>
                <td>{c.basePoints}</td>
                <td>{c.timeLimitMs ? `${c.timeLimitMs}ms` : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/challenges/${c.id}`)}>View</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/challenges/edit/${c.id}`)}>Edit</button>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => onPageChange && onPageChange(currentPage - 1)} disabled={currentPage === 0}>&lt;</button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button onClick={() => onPageChange && onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>&gt;</button>
        </div>
      )}
    </>
  );
}
