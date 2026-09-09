import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInContest, removeContest } from '../../store/slices/contestSlice';
import EmptyState from '../common/EmptyState';
import { toast } from 'react-toastify';

const statusClass = (s) => {
  if (s === 'ACTIVE') return 'badge badge-active';
  if (s === 'COMPLETED') return 'badge badge-completed';
  return 'badge badge-upcoming';
};

const fmt = (dt) => dt ? new Date(dt).toLocaleString() : '—';

export default function ContestList({ contests, loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const role = user?.role;
  const isAdmin = role === 'PLATFORM_ADMIN';
  const isContestant = role === 'CONTESTANT';

  const handleEnroll = async (id) => {
    const res = await dispatch(enrollInContest(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Enrolled successfully!');
    else toast.error(res.payload || 'Failed to enroll');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contest?')) return;
    const res = await dispatch(removeContest(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Contest deleted');
    else toast.error(res.payload || 'Failed to delete');
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!contests?.length) return <EmptyState icon="🏁" title="No contests available" message="Check back later." />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {contests.map((c) => (
        <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{c.title}</h3>
            <span className={statusClass(c.status)}>{c.status}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            <div>🕐 Start: {fmt(c.startTime)}</div>
            <div>🕐 End: {fmt(c.endTime)}</div>
            {c.capacity && <div>👥 Capacity: {c.capacity}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/contests/${c.id}`)}>Details</button>
            {isContestant && c.status !== 'COMPLETED' && (
              <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(c.id)}>Enroll</button>
            )}
            {isAdmin && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/contests/edit/${c.id}`)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
