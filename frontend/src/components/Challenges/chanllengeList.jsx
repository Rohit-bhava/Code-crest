import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChallenges, removeChallenge } from '../store/slices/challengeSlice';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';
import { toast } from 'react-toastify';

const PAGE_SIZE = 5;

export default function ChallengeList({ onAdd }) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.challenges);
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchChallenges()); }, [dispatch]);

  const handleDelete = async (id) => {
    const res = await dispatch(removeChallenge(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Challenge deleted');
    else toast.error(res.payload);
  };

  const paginated = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Challenges</h2>
        <button style={styles.addBtn} onClick={onAdd}>+ Add Challenge</button>
      </div>
      {loading ? <p style={styles.msg}>Loading...</p> : paginated.length === 0 ? <EmptyState message="No challenges found." /> : (
        <table style={styles.table}>
          <thead>
            <tr>{['Title', 'Difficulty', 'Domain', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} style={styles.row}>
                <td style={styles.td}>{c.title}</td>
                <td style={{ ...styles.td, color: c.difficulty === 'EASY' ? '#a6e3a1' : c.difficulty === 'MEDIUM' ? '#f9e2af' : '#f38ba8' }}>{c.difficulty}</td>
                <td style={styles.td}>{c.domain}</td>
                <td style={styles.td}><button style={styles.delBtn} onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={Math.ceil(list.length / PAGE_SIZE)} onPageChange={setPage} />
    </div>
  );
}

const styles = {
  container: { padding: '24px', background: '#13131a', minHeight: '100vh', color: '#cdd6f4' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#cba6f7' },
  addBtn: { background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  msg: { color: '#a6adc8' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#313244', padding: '10px 16px', textAlign: 'left', color: '#cba6f7' },
  td: { padding: '10px 16px', borderBottom: '1px solid #313244' },
  row: { background: '#1e1e2e' },
  delBtn: { background: '#f38ba8', color: '#1e1e2e', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
};
