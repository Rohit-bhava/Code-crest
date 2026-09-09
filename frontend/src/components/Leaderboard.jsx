import React from 'react';
import { useSelector } from 'react-redux';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';

export default function Leaderboard({ entries, loading, currentPage, totalPages, onPageChange }) {
  const { user } = useSelector((s) => s.auth);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!entries?.length) return <EmptyState icon="🏆" title="No rankings yet" message="Complete challenges to appear on the leaderboard." />;

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((r, i) => {
              const isMe = user?.username && r.username === user.username;
              return (
                <tr key={i} style={isMe ? { background: '#ede9fe', fontWeight: 700 } : {}}>
                  <td>
                    {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank || (currentPage * 20 + i + 1)}
                  </td>
                  <td style={isMe ? { color: '#6c47ff' } : {}}>
                    {r.username} {isMe && <span style={{ fontSize: '0.75rem', color: '#6c47ff' }}>(you)</span>}
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.score ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
