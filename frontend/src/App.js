import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import Login from './components/layout/Login';
import Leaderboard from './components/layout/Leaderboard';
import StatsCards from './components/dashboard/StartCards';
import DomainChart from './components/dashboard/DomainChart';
import RecentActivity from './components/dashboard/RecentActivity';
import ChallengeList from './components/Challenges/chanllengeList';
import ChallengeForm from './components/Challenges/challengesForm';
import ContestList from './components/contests/ContestList';
import ContestForm from './components/contests/ContestForm';

function PrivateRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/login" />;
}

function Dashboard() {
  return (
    <div style={{ padding: '24px', background: '#13131a', minHeight: '100vh' }}>
      <StatsCards />
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <DomainChart />
        <RecentActivity />
      </div>
    </div>
  );
}

function ChallengesPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <ChallengeList onAdd={() => setShowForm(true)} />
      {showForm && <ChallengeForm onClose={() => setShowForm(false)} />}
    </>
  );
}

function ContestsPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <ContestList onAdd={() => setShowForm(true)} />
      {showForm && <ContestForm onClose={() => setShowForm(false)} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/challenges" element={<PrivateRoute><ChallengesPage /></PrivateRoute>} />
        <Route path="/contests" element={<PrivateRoute><ContestsPage /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}
