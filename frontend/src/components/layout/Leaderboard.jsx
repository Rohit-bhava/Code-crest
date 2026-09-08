import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/slices/rankingSlice';

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector((s) => s.ranking);

  useEffect(() => { dispatch(fetchLeaderboard()); }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Global Leaderboard</h2>
      {loading ? <p style={styles.msg}>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{['Rank', 'Username', 'Score', 'Solved'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {leaderboard.map((r, i) => (
              <tr key={r.userId || i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
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
  rowEven: { background: '#1e1e2e' },
  rowOdd: { background: '#181825' },
};
