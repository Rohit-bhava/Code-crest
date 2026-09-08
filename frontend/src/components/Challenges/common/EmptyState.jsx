import React from 'react';

export default function EmptyState({ message = 'No data found.' }) {
  return (
    <div style={styles.container}>
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: '48px 0' },
  text: { color: '#a6adc8', fontSize: '1rem' },
};
