import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addContest } from '../store/slices/contestSlice';
import ContestForm from '../components/contests/ContestForm';
import { toast } from 'react-toastify';

export default function CreateContest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.contests);

  const handleSubmit = async (data) => {
    const res = await dispatch(addContest(data));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Contest created successfully!');
      navigate('/contests');
    } else {
      toast.error(res.payload || 'Failed to create contest');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Contest</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/contests')}>← Back</button>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        <ContestForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Contest" />
      </div>
    </div>
  );
}
