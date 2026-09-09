import React, { useState, useEffect } from 'react';

const INITIAL = { title: '', description: '', difficulty: 'EASY', basePoints: '', timeLimitMs: '' };

export default function ChallengeForm({ initial, onSubmit, loading, submitLabel = 'Create Challenge' }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        difficulty: initial.difficulty || 'EASY',
        basePoints: initial.basePoints ?? '',
        timeLimitMs: initial.timeLimitMs ?? '',
      });
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.difficulty) e.difficulty = 'Difficulty is required';
    if (!form.basePoints || Number(form.basePoints) <= 0) e.basePoints = 'Base points must be positive';
    if (!form.timeLimitMs || Number(form.timeLimitMs) <= 0) e.timeLimitMs = 'Time limit must be positive';
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
      description: form.description.trim(),
      difficulty: form.difficulty,
      basePoints: Number(form.basePoints),
      timeLimitMs: Number(form.timeLimitMs),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input name="title" className={`form-control ${errors.title ? 'error' : ''}`} value={form.title} onChange={handleChange} placeholder="Challenge title" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea name="description" required className={`form-control ${errors.description ? 'error' : ''}`} value={form.description} onChange={handleChange} placeholder="Problem statement..." rows={5} />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Difficulty *</label>
          <select name="difficulty" className="form-control" value={form.difficulty} onChange={handleChange}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Base Points *</label>
          <input name="basePoints" type="number" min="1" className={`form-control ${errors.basePoints ? 'error' : ''}`} value={form.basePoints} onChange={handleChange} placeholder="e.g. 100" />
          {errors.basePoints && <span className="form-error">{errors.basePoints}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Time Limit (ms) *</label>
          <input name="timeLimitMs" type="number" min="1" className={`form-control ${errors.timeLimitMs ? 'error' : ''}`} value={form.timeLimitMs} onChange={handleChange} placeholder="e.g. 2000" />
          {errors.timeLimitMs && <span className="form-error">{errors.timeLimitMs}</span>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
