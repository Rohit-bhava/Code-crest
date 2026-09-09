import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallenges } from '../store/slices/challengeSlice';
import { fetchContests } from '../store/slices/contestSlice';
import { fetchMySubmissions } from '../store/slices/submissionSlice';
import { getMyProfile } from '../services/profileService';
import StatCards from '../components/dashboard/StatCards';
import DomainChart from '../components/dashboard/DomainChart';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: challenges } = useSelector((s) => s.challenges);
  const { list: contests } = useSelector((s) => s.contests);
  const { list: submissions } = useSelector((s) => s.submissions);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    dispatch(fetchChallenges());
    dispatch(fetchContests());
    dispatch(fetchMySubmissions());
    getMyProfile().then((r) => setProfile(r.data)).catch(() => {});
  }, [dispatch]);

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>
          Welcome back, {user?.username || 'Coder'}! 👋
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>Here's your performance overview.</p>
      </div>

      <StatCards
        profile={profile}
        challengeCount={challenges.length}
        contestCount={contests.length}
      />

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <DomainChart challenges={challenges} />
        <RecentActivity submissions={submissions} />
      </div>
    </div>
  );
}
