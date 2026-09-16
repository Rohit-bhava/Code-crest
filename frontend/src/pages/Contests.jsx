import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchContests } from '../store/slices/contestSlice';
import ContestList from '../components/contests/ContestList';

export default function Contests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((s) => s.contests);
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => { dispatch(fetchContests()); }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Contests</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/contests/create')}>
            + New Contest
          </button>
        )}
      </div>
      <ContestList contests={list} loading={loading} />
    </div>
  );
}
