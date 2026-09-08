import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySubmissions } from '../store/slices/submissionSlice';

export default function RecentActivity() {
  const dispatch = useDispatch();
  const submissions = useSelector((s) => s.submissions.list.slice(0, 5));

  useEffect(() => { dispatch(fetchMySubmissions()); }, [dispatch]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Recent Submissions</h3>
      {submissions.length === 0 ? (
        <p style={styles.empty}>No submissions yet.</p>
      ) : (
        <ul style={styles.list}>
          {submissions.map((s, i) => (
            <li key={s.id || i} style={styles.item}>
              <span style={styles.challenge}>{s.challengeTitle || `Challenge #${s.challengeId}`}</span>
              <span style={{ ...styles.verdict, color: s.verdict === 'ACCEPTED' ? '#a6e3a1' : '#f38ba8' }}>{s.verdict}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { background: '#1e1e2e', borderRadius: '10px', padding: '20px', minWidth: '300px' },
  title: { color: '#cba6f7', marginBottom: '12px' },
  empty: { color: '#a6adc8' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #313244' },
  challenge: { color: '#cdd6f4' },
  verdict: { fontWeight: 'bold', fontSize: '0.85rem' },
};
