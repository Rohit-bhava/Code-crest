import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#a6e3a1', '#f9e2af', '#f38ba8'];

export default function DomainChart() {
  const challenges = useSelector((s) => s.challenges.list);

  const data = ['EASY', 'MEDIUM', 'HARD'].map((d) => ({
    name: d,
    value: challenges.filter((c) => c.difficulty === d).length,
  })).filter((d) => d.value > 0);

  if (!data.length) return <p style={{ color: '#a6adc8' }}>No challenge data yet.</p>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Challenges by Difficulty</h3>
      <PieChart width={300} height={250}>
        <Pie data={data} cx={140} cy={110} outerRadius={90} dataKey="value" label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

const styles = {
  container: { background: '#1e1e2e', borderRadius: '10px', padding: '20px', display: 'inline-block' },
  title: { color: '#cba6f7', marginBottom: '12px' },
};
