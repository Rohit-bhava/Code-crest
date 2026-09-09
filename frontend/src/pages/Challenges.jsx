import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChallenges } from '../store/slices/challengeSlice';
import ChallengeList from '../components/challenges/ChallengeList';

export default function Challenges() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((s) => s.challenges);
  const { user } = useSelector((s) => s.auth);
  const role = user?.role;
  const canCreate = role === 'PROBLEM_SETTER' || role === 'PLATFORM_ADMIN';

  useEffect(() => { dispatch(fetchChallenges()); }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Challenges</h1>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => navigate('/challenges/create')}>
            + New Challenge
          </button>
        )}
      </div>
      <div className="card">
        <ChallengeList challenges={list} loading={loading} />
      </div>
    </div>
  );
}
