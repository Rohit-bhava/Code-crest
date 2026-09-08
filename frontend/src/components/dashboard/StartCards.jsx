import React from 'react';
import { useSelector } from 'react-redux';

export default function StatsCards() {
  const challenges = useSelector((s) => s.challenges.list.length);
  const contests = useSelector((s) => s.contests.list.length);
  const submissions = useSelector((s) => s.submissions.list.length);

  const cards = [
    { label: 'Challenges', value: challenges, color: '#cba6f7' },
    { label: 'Contests', value: contests, color: '#89b4fa' },
    { label: 'Submissions', value: submissions, color: '#a6e3a1' },
  ];

  return (
    <div style={styles.row}>
      {cards.map((c) => (
        <div key={c.label} style={styles.card}>
          <p style={{ ...styles.value, color: c.color }}>{c.value}</p>
          <p style={styles.label}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
  card: { flex: 1, minWidth: '140px', background: '#1e1e2e', borderRadius: '10px', padding: '20px', textAlign: 'center' },
  value: { fontSize: '2rem', fontWeight: 'bold', margin: 0 },
  label: { color: '#a6adc8', margin: '4px 0 0' },
};
