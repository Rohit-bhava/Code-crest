import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchChallengeById, editChallenge, clearSelected } from '../store/slices/challengeSlice';
import ChallengeForm from '../components/Challenges/ChallengeForm';
import { toast } from 'react-toastify';

export default function EditChallenge() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector((s) => s.challenges);

  useEffect(() => {
    dispatch(fetchChallengeById(id));
    return () => dispatch(clearSelected());
  }, [id, dispatch]);

  const handleSubmit = async (data) => {
    const res = await dispatch(editChallenge({ id: Number(id), data }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Challenge updated!');
      navigate('/challenges');
    } else {
      toast.error(res.payload || 'Failed to update challenge');
    }
  };

  if (loading && !selected) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Edit Challenge</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/challenges')}>← Back</button>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        {selected && (
          <ChallengeForm
            initial={selected}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/challenges')}
            loading={loading}
            submitLabel="Update Challenge"
          />
        )}
      </div>
    </div>
  );
}
