import React, { useState } from 'react';

const INITIAL = { name: '', description: '', startTime: '', endTime: '' };

export default function ContestForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    if (onClose) onClose();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Create New Contest</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Contest Name" value={form.name} onChange={handleChange} style={styles.input} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.textarea} />
        <label style={styles.label}>Start Time</label>
        <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} style={styles.input} required />
        <label style={styles.label}>End Time</label>
        <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} style={styles.input} required />
        <div style={styles.actions}>
          {onClose && <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>}
          <button type="submit" style={styles.submitBtn}>Create Contest</button>
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
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4', minHeight: '70px', resize: 'vertical' },
  label: { color: '#a6adc8', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 16px', background: '#45475a', color: '#cdd6f4', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
