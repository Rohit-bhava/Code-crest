import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const res = await dispatch(registerUser(form));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Registered! Please login.');
        setIsRegister(false);
      } else toast.error(res.payload);
    } else {
      const res = await dispatch(loginUser({ username: form.username, password: form.password }));
      if (res.meta.requestStatus === 'fulfilled') navigate('/dashboard');
      else toast.error(res.payload);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={styles.input} required />
          {isRegister && <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} required />}
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} required />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn} disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}</button>
        </form>
        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span style={styles.link} onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Login' : 'Register'}</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#13131a' },
  card: { background: '#1e1e2e', padding: '40px', borderRadius: '12px', width: '360px' },
  title: { color: '#cdd6f4', marginBottom: '24px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#313244', color: '#cdd6f4', fontSize: '0.95rem' },
  btn: { padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#f38ba8', fontSize: '0.85rem' },
  toggle: { color: '#a6adc8', textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' },
  link: { color: '#7c3aed', cursor: 'pointer', fontWeight: 'bold' },
};
