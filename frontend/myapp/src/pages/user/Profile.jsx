import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>👤 Profile</h1>
          <button 
            onClick={() => navigate('/user')}
            style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Back
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* User Card */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👤</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '0.5rem' }}>{user?.name || 'User'}</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{user?.email || 'email@example.com'}</p>
            <span style={{ display: 'inline-block', background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              {user?.role?.toUpperCase() || 'USER'}
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setTab('info')}
              style={{
                padding: '0.75rem 1rem',
                background: tab === 'info' ? '#4f46e5' : 'transparent',
                color: tab === 'info' ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px 4px 0 0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Account Info
            </button>
            <button
              onClick={() => setTab('password')}
              style={{
                padding: '0.75rem 1rem',
                background: tab === 'password' ? '#4f46e5' : 'transparent',
                color: tab === 'password' ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px 4px 0 0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Change Password
            </button>
          </div>

          {/* Content */}
          {tab === 'info' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>Edit Account Information</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Name</label>
                  <input type="text" defaultValue={user?.name} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Email</label>
                  <input type="email" value={user?.email} disabled style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', background: '#f9fafb', boxSizing: 'border-box' }} />
                </div>
                <button 
                  onClick={() => alert('✅ Profile updated!')}
                  style={{ padding: '10px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>Change Password</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Current Password</label>
                  <input type="password" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>New Password</label>
                  <input type="password" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Confirm Password</label>
                  <input type="password" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <button 
                  onClick={() => alert('✅ Password changed!')}
                  style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}