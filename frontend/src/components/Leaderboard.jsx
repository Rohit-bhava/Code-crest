import React from 'react';
import { useSelector } from 'react-redux';

export default function Leaderboard() {
  const { items = [], loading } = useSelector((s) => s.rankings || { items: [], loading: false });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Leaderboard</h2>
      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={styles.msg}>No rankings yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {['Rank', 'Username', 'Score', 'Solved'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={r.userId || i}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{r.username}</td>
                <td style={styles.td}>{r.totalScore}</td>
                <td style={styles.td}>{r.problemsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px', background: '#13131a', minHeight: '100vh', color: '#cdd6f4' },
  title: { marginBottom: '20px', color: '#cba6f7' },
  msg: { color: '#a6adc8' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#313244', padding: '10px 16px', textAlign: 'left', color: '#cba6f7' },
  td: { padding: '10px 16px' },
};
