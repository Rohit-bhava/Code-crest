import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { EASY: '#10b981', MEDIUM: '#f59e0b', HARD: '#ef4444' };

export default function DomainChart({ challenges }) {
  const items = Array.isArray(challenges) ? challenges : (challenges?.items ?? challenges?.list ?? []);
  const data = ['EASY', 'MEDIUM', 'HARD']
    .map((d) => ({ name: d, value: items.filter((c) => c.difficulty === d).length }))
    .filter((d) => d.value > 0);

  return (
    <div className="card" style={{ flex: 1, minWidth: 280 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#1e293b' }}>Challenges by Difficulty</h3>
      {data.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>No challenge data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {data.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
