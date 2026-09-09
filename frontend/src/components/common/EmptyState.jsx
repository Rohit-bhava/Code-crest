import React from 'react';

export default function EmptyState({ icon = '📭', title = 'Nothing here yet', message = '' }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>{icon}</div>
      <p style={styles.title}>{title}</p>
      {message && <p style={styles.msg}>{message}</p>}
    </div>
  );
}

const styles = {
  wrap: { textAlign: 'center', padding: '60px 20px', color: '#94a3b8' },
  icon: { fontSize: '3rem', marginBottom: '12px' },
  title: { fontSize: '1.1rem', fontWeight: 600, color: '#64748b', margin: '0 0 6px' },
  msg: { fontSize: '0.9rem', margin: 0 },
};
