import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One symbol (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', password: '', bio: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const passwordValid = rules.every((r) => r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!passwordValid) return;
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ CodeCrest</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join CodeCrest and start competing!</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input name="username" className="form-control" value={form.username} onChange={handleChange} placeholder="Choose a username" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} placeholder="Choose a password" required />
            {submitted && !passwordValid && (
              <ul style={styles.ruleList}>
                {rules.map((r) => (
                  <li key={r.label} style={{ color: r.test(form.password) ? '#10b981' : '#ef4444', fontSize: '0.78rem', marginTop: 3 }}>
                    {r.test(form.password) ? '✓' : '✗'} {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea name="bio" className="form-control" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself (optional)" rows={3} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6c47ff', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f6fb' },
  card: { background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  logo: { color: '#6c47ff', fontWeight: 800, fontSize: '1.4rem', textAlign: 'center', marginBottom: 20 },
  title: { margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', textAlign: 'center' },
  sub: { margin: '0 0 24px', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: '0.9rem' },
  ruleList: { listStyle: 'none', padding: '6px 0 0', margin: 0 },
};
