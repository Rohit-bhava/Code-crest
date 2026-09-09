import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengeDetails from './pages/ChallengeDetails';
import CreateChallenge from './pages/CreateChallenge';
import EditChallenge from './pages/EditChallenge';
import Contests from './pages/Contests';
import ContestDetails from './pages/ContestDetails';
import CreateContest from './pages/CreateContest';
import EditContest from './pages/EditContest';
import LeaderboardPage from './pages/LeaderboardPage';
import Profile from './pages/Profile';
import Submissions from './pages/Submissions';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, roles }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} />
        <Route path="/challenges/create" element={<RoleRoute roles={['PROBLEM_SETTER','PLATFORM_ADMIN']}><CreateChallenge /></RoleRoute>} />
        <Route path="/challenges/edit/:id" element={<RoleRoute roles={['PROBLEM_SETTER','PLATFORM_ADMIN']}><EditChallenge /></RoleRoute>} />
        <Route path="/challenges/:id" element={<PrivateRoute><ChallengeDetails /></PrivateRoute>} />
        <Route path="/contests" element={<PrivateRoute><Contests /></PrivateRoute>} />
        <Route path="/contests/create" element={<RoleRoute roles={['PLATFORM_ADMIN']}><CreateContest /></RoleRoute>} />
        <Route path="/contests/edit/:id" element={<RoleRoute roles={['PLATFORM_ADMIN']}><EditContest /></RoleRoute>} />
        <Route path="/contests/:id" element={<PrivateRoute><ContestDetails /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/submissions" element={<PrivateRoute><Submissions /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}
