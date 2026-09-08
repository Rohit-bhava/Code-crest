import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChallenge } from '../store/slices/challengeSlice';
import { toast } from 'react-toastify';

const INITIAL = { title: '', description: '', difficulty: 'EASY', domain: '', points: '' };

export default function ChallengeForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.challenges);
  const [form, setForm] = useState(INITIAL);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(addChallenge({ ...form, points: Number(form.points) }));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Challenge created!'); onClose(); }
    else toast.error(res.payload);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>New Challenge</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.textarea} required />
          <select name="difficulty" value={form.difficulty} onChange={handleChange} style={styles.input}>
            {['EASY', 'MEDIUM', 'HARD'].map(d => <option key={d}>{d}</option>)}
          </select>
          <input name="domain" placeholder="Domain (e.g. Arrays)" value={form.domain} onChange={handleChange} style={styles.input} required />
          <input name="points" type="number" placeholder="Points" value={form.points} onChange={handleChange} style={styles.input} required />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { background: '#1e1e2e', padding: '32px', borderRadius: '12px', width: '420px' },
  title: { color: '#cba6f7', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4' },
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4', minHeight: '80px', resize: 'vertical' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 16px', background: '#45475a', color: '#cdd6f4', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
