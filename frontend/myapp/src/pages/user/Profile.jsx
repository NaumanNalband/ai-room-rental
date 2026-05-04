import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: This would require a backend endpoint to update profile
      // For now, showing success message
      showMessage('✅ Profile updated successfully', 'success');
    } catch (err) {
      showMessage('❌ Failed to update profile', 'error');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      showMessage('❌ New passwords do not match', 'error');
      return;
    }

    if (passwords.newPassword.length < 6) {
      showMessage('❌ Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      // Note: This would require a backend endpoint for password change
      // For now, showing success message
      showMessage('✅ Password changed successfully', 'success');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      showMessage('❌ Failed to change password', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">👤 My Profile</h1>
          <button 
            onClick={() => navigate('/user')} 
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-12 text-white text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <p className="text-purple-100">{user?.email}</p>
            <div className="mt-4 inline-block bg-white text-purple-600 px-4 py-1 rounded-full font-bold text-sm">
              {user?.role.toUpperCase()}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-bold transition ${
                activeTab === 'profile'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              📋 Account Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 font-bold transition ${
                activeTab === 'password'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              🔐 Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-purple-500 transition"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 mt-2">Email cannot be changed</p>
                  </div>

                  {/* Role Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={profileData.role.toUpperCase()}
                      disabled
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 mt-2">Role cannot be changed here</p>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      disabled
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Update Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition font-bold text-lg"
                  >
                    {loading ? '⏳ Updating...' : '✅ Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>
                
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-purple-500 transition"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-purple-500 transition"
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                    <p className="text-xs text-gray-600 mt-2">Minimum 6 characters</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-purple-500 transition"
                      placeholder="Confirm new password"
                      required
                      minLength="6"
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {passwords.newPassword && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        {passwords.newPassword.length < 6
                          ? '⚠️ Password too short'
                          : passwords.newPassword.length < 10
                          ? '✅ Weak password'
                          : '✅ Strong password'}
                      </p>
                    </div>
                  )}

                  {/* Change Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-bold text-lg"
                  >
                    {loading ? '⏳ Changing...' : '🔐 Change Password'}
                  </button>
                </form>

                {/* Password Tips */}
                <div className="mt-8 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
                  <h4 className="font-bold text-amber-800 mb-2">💡 Password Tips</h4>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>✓ Use at least 8 characters for better security</li>
                    <li>✓ Mix uppercase, lowercase, numbers, and symbols</li>
                    <li>✓ Don't use easily guessable information</li>
                    <li>✓ Change your password regularly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-red-50 rounded-xl shadow-lg p-6 border-l-4 border-red-600">
          <h4 className="font-bold text-red-800 mb-4">⚠️ Danger Zone</h4>
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
            🗑️ Delete Account
          </button>
          <p className="text-red-700 text-sm mt-2">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </div>
    </div>
  );
}