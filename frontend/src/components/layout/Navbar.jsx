import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav role="navigation" style={styles.nav}>
      <Link to="/" style={styles.brand}>CodeCrest</Link>
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/challenges" style={styles.link}>Challenges</Link>
            <Link to="/contests" style={styles.link}>Contests</Link>
            <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1e1e2e', color: '#fff' },
  brand: { color: '#7c3aed', fontWeight: 'bold', fontSize: '1.4rem', textDecoration: 'none' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#cdd6f4', textDecoration: 'none', fontSize: '0.95rem' },
  btn: { background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' },
};
