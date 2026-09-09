import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addChallenge } from '../store/slices/challengeSlice';
import ChallengeForm from '../components/challenges/ChallengeForm';
import { toast } from 'react-toastify';

export default function CreateChallenge() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.challenges);

  const handleSubmit = async (data) => {
    const res = await dispatch(addChallenge(data));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Challenge created successfully!');
      navigate('/challenges');
    } else {
      toast.error(res.payload || 'Failed to create challenge');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Challenge</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/challenges')}>← Back</button>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        <ChallengeForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Challenge" />
      </div>
    </div>
  );
}
