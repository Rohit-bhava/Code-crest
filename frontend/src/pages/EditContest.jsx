import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchContestById, editContest, clearSelected } from '../store/slices/contestSlice';
import ContestForm from '../components/contests/ContestForm';
import { toast } from 'react-toastify';

export default function EditContest() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector((s) => s.contests);

  useEffect(() => {
    dispatch(fetchContestById(id));
    return () => dispatch(clearSelected());
  }, [id, dispatch]);

  const handleSubmit = async (data) => {
    const res = await dispatch(editContest({ id: Number(id), data }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Contest updated!');
      navigate('/contests');
    } else {
      toast.error(res.payload || 'Failed to update contest');
    }
  };

  if (loading && !selected) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Edit Contest</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/contests')}>← Back</button>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        {selected && (
          <ContestForm initial={selected} onSubmit={handleSubmit} loading={loading} submitLabel="Update Contest" />
        )}
      </div>
    </div>
  );
}
