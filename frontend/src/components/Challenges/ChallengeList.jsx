import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 5;

export default function ChallengeList({ onAdd, onEdit }) {
  const { items = [], loading, totalPages = 0 } = useSelector((s) => s.challenges);
  const [page, setPage] = useState(1);

  const computedTotal = totalPages || Math.ceil(items.length / PAGE_SIZE);
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Challenges</h2>
        {onAdd && <button style={styles.addBtn} onClick={onAdd}>+ Add Challenge</button>}
      </div>
      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={styles.msg}>No challenges found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {['Title', 'Difficulty', 'Points', 'Actions'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} style={styles.row}>
                <td style={styles.td}>{c.title}</td>
                <td style={{ ...styles.td, color: c.difficulty === 'EASY' ? '#a6e3a1' : c.difficulty === 'MEDIUM' ? '#f9e2af' : '#f38ba8' }}>
                  {c.difficulty}
                </td>
                <td style={styles.td}>{c.basePoints}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => onEdit && onEdit(c)}>Edit</button>
                  <button style={styles.delBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={styles.pagination}>
        <button style={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
        <span style={styles.pageInfo}>{page} / {computedTotal || 1}</span>
        <button style={styles.pageBtn} onClick={() => setPage((p) => p + 1)} disabled={page >= computedTotal}>{'>'}</button>
      </div>
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
  editBtn: { background: '#89b4fa', color: '#1e1e2e', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  delBtn: { background: '#f38ba8', color: '#1e1e2e', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  pagination: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '20px' },
  pageBtn: { padding: '6px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  pageInfo: { color: '#cdd6f4' },
};
