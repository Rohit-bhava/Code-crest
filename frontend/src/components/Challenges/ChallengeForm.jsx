import React, { useState } from 'react';

const INITIAL = { title: '', description: '', difficulty: 'EASY', domain: '', basePoints: '' };

export default function ChallengeForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, basePoints: Number(form.basePoints) });
    if (onClose) onClose();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>New Challenge</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.textarea} required />
        <select name="difficulty" value={form.difficulty} onChange={handleChange} style={styles.input}>
          {['EASY', 'MEDIUM', 'HARD'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <input name="domain" placeholder="Domain" value={form.domain} onChange={handleChange} style={styles.input} required />
        <input name="basePoints" type="number" min="0" max="1000" placeholder="Points" value={form.basePoints} onChange={handleChange} style={styles.input} required />
        <div style={styles.actions}>
          {onClose && <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>}
          <button type="submit" style={styles.submitBtn}>Create Challenge</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { background: '#1e1e2e', padding: '32px', borderRadius: '12px', width: '420px', margin: '0 auto' },
  title: { color: '#cba6f7', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4' },
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4', minHeight: '80px', resize: 'vertical' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 16px', background: '#45475a', color: '#cdd6f4', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
