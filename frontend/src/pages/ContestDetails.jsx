import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContestById, enrollInContest, clearSelected } from '../store/slices/contestSlice';
import { toast } from 'react-toastify';

const statusClass = (s) => {
  if (s === 'ACTIVE') return 'badge badge-active';
  if (s === 'COMPLETED') return 'badge badge-completed';
  return 'badge badge-upcoming';
};

const fmt = (dt) => dt ? new Date(dt).toLocaleString() : '—';

export default function ContestDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: contest, loading, error } = useSelector((s) => s.contests);
  const { user } = useSelector((s) => s.auth);
  const isContestant = user?.role === 'CONTESTANT';
  const isAdmin = user?.role === 'PLATFORM_ADMIN';

  useEffect(() => {
    dispatch(fetchContestById(id));
    return () => dispatch(clearSelected());
  }, [id, dispatch]);

  const handleEnroll = async () => {
    const res = await dispatch(enrollInContest(Number(id)));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Enrolled successfully!');
    else toast.error(res.payload || 'Failed to enroll');
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!contest) return null;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/contests')} style={{ marginBottom: 16 }}>
        ← Back to Contests
      </button>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>{contest.title}</h1>
          <span className={statusClass(contest.status)}>{contest.status}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ background: '#f8fafc' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Start Time</div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{fmt(contest.startTime)}</div>
          </div>
          <div className="card" style={{ background: '#f8fafc' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>End Time</div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{fmt(contest.endTime)}</div>
          </div>
          {contest.capacity && (
            <div className="card" style={{ background: '#f8fafc' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Capacity</div>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>{contest.capacity}</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isContestant && contest.status !== 'COMPLETED' && (
            <button className="btn btn-primary" onClick={handleEnroll}>Enroll in Contest</button>
          )}
          {isAdmin && (
            <button className="btn btn-secondary" onClick={() => navigate(`/contests/edit/${id}`)}>Edit Contest</button>
          )}
        </div>
      </div>
    </div>
  );
}
