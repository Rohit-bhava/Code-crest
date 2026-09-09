import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, fetchContestRankings } from '../store/slices/rankingSlice';
import { fetchContests } from '../store/slices/contestSlice';
import Leaderboard from '../components/Leaderboard';

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, loading, currentPage, totalPages } = useSelector((s) => s.ranking);
  const contestState = useSelector((s) => s.contests);
  const contests = Array.isArray(contestState.list) ? contestState.list : (contestState.list?.items ?? contestState.list?.content ?? []);
  const [contestId, setContestId] = useState('');

  useEffect(() => {
    dispatch(fetchContests());
    dispatch(fetchLeaderboard(0));
  }, [dispatch]);

  const handlePageChange = (page) => {
    if (contestId) dispatch(fetchContestRankings({ contestId: Number(contestId), page }));
    else dispatch(fetchLeaderboard(page));
  };

  const handleContestChange = (e) => {
    const val = e.target.value;
    setContestId(val);
    if (val) dispatch(fetchContestRankings({ contestId: Number(val), page: 0 }));
    else dispatch(fetchLeaderboard(0));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>Filter by Contest:</label>
          <select className="form-control" value={contestId} onChange={handleContestChange} style={{ width: 220 }}>
            <option value="">Global Rankings</option>
            {contests.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card">
        <Leaderboard
          entries={leaderboard}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
