import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/dashboard');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ CodeCrest</div>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.sub}>Welcome back! Please sign in to continue.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" className="form-control" value={form.username} onChange={handleChange} placeholder="Enter username" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: 4 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6c47ff', fontWeight: 600 }}>Register</Link>
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
};
