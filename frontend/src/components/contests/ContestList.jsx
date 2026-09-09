import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests, joinContestAction } from '../store/slices/contestslice';
import { toast } from 'react-toastify';

export default function ContestList({ onAdd }) {
  const dispatch = useDispatch();
  const { list: items = [], loading } = useSelector((s) => s.contests);

  useEffect(() => { dispatch(fetchContests()); }, [dispatch]);

  const handleJoin = async (id) => {
    const res = await dispatch(joinContestAction(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Joined contest!');
    else toast.error(res.payload);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Programming Contests</h2>
        {onAdd && <button style={styles.addBtn} onClick={onAdd}>+ Create Contest</button>}
      </div>
      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={styles.msg}>No contests available.</p>
      ) : (
        <div style={styles.grid}>
          {items.map((c) => (
            <div key={c.id} style={styles.card}>
              <h3 style={styles.name}>{c.name}</h3>
              <p style={styles.info}>Status: <span style={{ color: c.status === 'ACTIVE' ? '#a6e3a1' : '#f9e2af' }}>{c.status}</span></p>
              <p style={styles.info}>Start: {c.startTime ? new Date(c.startTime).toLocaleString() : '-'}</p>
              <p style={styles.info}>End: {c.endTime ? new Date(c.endTime).toLocaleString() : '-'}</p>
              <button style={styles.joinBtn} onClick={() => handleJoin(c.id)}>Join</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px', background: '#13131a', minHeight: '100vh', color: '#cdd6f4' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#cba6f7' },
  addBtn: { background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  msg: { color: '#a6adc8' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#1e1e2e', borderRadius: '10px', padding: '20px' },
  name: { color: '#cba6f7', marginBottom: '8px' },
  info: { color: '#a6adc8', fontSize: '0.9rem', margin: '4px 0' },
  joinBtn: { marginTop: '12px', background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' },
};
