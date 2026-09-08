import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={styles.container}>
      <button style={styles.btn} onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</button>
      <span style={styles.info}>{page} / {totalPages}</span>
      <button style={styles.btn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '20px' },
  btn: { padding: '6px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  info: { color: '#cdd6f4' },
};
