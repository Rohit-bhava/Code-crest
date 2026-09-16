import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;
  const isAdmin = role === 'ADMIN';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand">
          ⚡ CodeCrest
        </Link>

        {isAuthenticated && (
          <>
            <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              ☰
            </button>
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/challenges" className={`nav-link ${isActive('/challenges') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Challenges</Link>
              {isAdmin && (
                <Link to="/challenges/create" className={`nav-link ${isActive('/challenges/create') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>+ Challenge</Link>
              )}
              <Link to="/contests" className={`nav-link ${isActive('/contests') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contests</Link>
              {isAdmin && (
                <Link to="/contests/create" className={`nav-link ${isActive('/contests/create') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>+ Contest</Link>
              )}
              <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
              <Link to="/submissions" className={`nav-link ${isActive('/submissions') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Submissions</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Profile</Link>
            </div>
            <div className="navbar-right">
              <span className="navbar-user">👤 {user?.username || 'User'}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .navbar {
          background: #1e1b4b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          position: sticky; top: 0; z-index: 100;
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 8px;
          padding: 0 24px; height: 60px;
        }
        .navbar-brand {
          color: #a78bfa; font-weight: 800; font-size: 1.25rem;
          text-decoration: none; margin-right: 16px; white-space: nowrap;
        }
        .navbar-links {
          display: flex; align-items: center; gap: 4px; flex: 1;
        }
        .nav-link {
          color: #c4b5fd; text-decoration: none; padding: 6px 10px;
          border-radius: 6px; font-size: 0.88rem; font-weight: 500;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { background: rgba(167,139,250,0.15); color: #fff; }
        .nav-link.active { background: rgba(167,139,250,0.2); color: #fff; }
        .navbar-right {
          display: flex; align-items: center; gap: 10px; margin-left: auto;
        }
        .navbar-user { color: #a78bfa; font-size: 0.88rem; white-space: nowrap; }
        .navbar-toggle { display: none; background: none; border: none; color: #a78bfa; font-size: 1.4rem; }
        @media (max-width: 900px) {
          .navbar-toggle { display: block; margin-left: auto; }
          .navbar-links {
            display: none; flex-direction: column; align-items: flex-start;
            position: absolute; top: 60px; left: 0; right: 0;
            background: #1e1b4b; padding: 12px 24px; gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .navbar-links.open { display: flex; }
          .navbar-right { display: none; }
        }
      `}</style>
    </nav>
  );
}
