import React, { useState, useEffect } from 'react';

const INITIAL = { title: '', startTime: '', endTime: '', capacity: '', status: 'UPCOMING' };

const toInputDT = (dt) => {
  if (!dt) return '';
  try { return new Date(dt).toISOString().slice(0, 16); } catch { return ''; }
};

export default function ContestForm({ initial, onSubmit, loading, submitLabel = 'Save Contest' }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        startTime: toInputDT(initial.startTime),
        endTime: toInputDT(initial.endTime),
        capacity: initial.capacity ?? '',
        status: initial.status || 'UPCOMING',
      });
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.startTime) e.startTime = 'Start time is required';
    if (!form.endTime) e.endTime = 'End time is required';
    if (form.startTime && form.endTime && new Date(form.startTime) >= new Date(form.endTime))
      e.endTime = 'End time must be after start time';
    if (form.capacity && Number(form.capacity) <= 0) e.capacity = 'Capacity must be positive';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      capacity: form.capacity ? Number(form.capacity) : null,
      status: form.status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Contest</h2>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input name="title" className={`form-control ${errors.title ? 'error' : ''}`} value={form.title} onChange={handleChange} placeholder="Contest title" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Start Time *</label>
          <input name="startTime" type="datetime-local" className={`form-control ${errors.startTime ? 'error' : ''}`} value={form.startTime} onChange={handleChange} />
          {errors.startTime && <span className="form-error">{errors.startTime}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">End Time *</label>
          <input name="endTime" type="datetime-local" className={`form-control ${errors.endTime ? 'error' : ''}`} value={form.endTime} onChange={handleChange} />
          {errors.endTime && <span className="form-error">{errors.endTime}</span>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Capacity</label>
          <input name="capacity" type="number" min="1" className={`form-control ${errors.capacity ? 'error' : ''}`} value={form.capacity} onChange={handleChange} placeholder="Optional" />
          {errors.capacity && <span className="form-error">{errors.capacity}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" className="form-control" value={form.status} onChange={handleChange}>
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
