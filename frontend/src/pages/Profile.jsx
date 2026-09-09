import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMyProfile, updateProfile } from '../services/profileService';
import { toast } from 'react-toastify';

const statusClass = (s) => {
  if (s === 'ACTIVE') return 'badge badge-active';
  if (s === 'SUSPENDED') return 'badge badge-hard';
  return 'badge badge-upcoming';
};

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '' });
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((r) => {
        setProfile(r.data);
        setForm({ bio: r.data.bio || '' });
      })
      .catch((e) => {
        if (e.response?.status === 404) setNotFound(true);
        else toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile.id, { bio: form.bio });
      setProfile({ ...profile, bio: form.bio });
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (notFound) return (
    <div className="page">
      <div className="alert alert-info">
        Profile not found. This account may not have a contestant profile yet.
        Only contestants registered through the platform have profiles.
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 24 }}>My Profile</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              👤
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e293b' }}>{profile?.username || user?.username}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                Role: <strong>{user?.role?.replace('ROLE_', '') || '—'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Points</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6c47ff' }}>{profile?.totalPoints ?? 0}</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Rank</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                {profile?.globalRank ? `#${profile.globalRank}` : '—'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', marginRight: 8 }}>Account Status:</span>
            <span className={statusClass(profile?.accountStatus)}>{profile?.accountStatus || 'ACTIVE'}</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Bio</h3>
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  value={form.bio}
                  onChange={(e) => setForm({ bio: e.target.value })}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setForm({ bio: profile.bio || '' }); }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p style={{ color: profile?.bio ? '#334155' : '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              {profile?.bio || 'No bio added yet. Click Edit to add one.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
