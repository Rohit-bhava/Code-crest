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

export default function ChallengeList({ challenges, loading, onPageChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { totalPages = 0, currentPage = 0, list, items } = useSelector((s) => s.challenges);
  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const canEdit = role === 'ADMIN';

  const storeData = Array.isArray(list) && list.length > 0 ? list : (Array.isArray(items) ? items : []);
  const resolvedItems = Array.isArray(challenges) && challenges.length > 0 ? challenges : storeData;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this challenge?')) return;
    const res = await dispatch(removeChallenge(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Challenge deleted');
    else toast.error(res.payload || 'Failed to delete');
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!resolvedItems.length && totalPages <= 1) return <EmptyState icon="💻" title="No challenges found" message="Check back later or create one." />;

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
            {resolvedItems.map((c, i) => (
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
