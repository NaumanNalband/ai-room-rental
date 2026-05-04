import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ wishlistCount: 0, inquiriesCount: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [wishlist, inquiries] = await Promise.all([
        axios.get('http://localhost:5000/api/wishlist/count', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/inquiries/user/my-inquiries', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats({
        wishlistCount: wishlist.data.count,
        inquiriesCount: inquiries.data.length
      });
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏠 AI Room Rental</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Find your perfect room with AI-powered recommendations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => navigate('/wishlist')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer hover:scale-105 transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Wishlist Items</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.wishlistCount}
                </p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/inquiries')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer hover:scale-105 transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Inquiries</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.inquiriesCount}
                </p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer hover:scale-105 transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Your Role</p>
                <p className="text-3xl font-bold text-purple-600 capitalize">
                  {user?.role}
                </p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/search')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition"
          >
            <div className="text-white">
              <p className="text-4xl mb-2">🔍</p>
              <h3 className="text-2xl font-bold mb-2">Search Rooms</h3>
              <p className="text-blue-100">
                Find amazing rooms using AI-powered search
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/wishlist')}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition"
          >
            <div className="text-white">
              <p className="text-4xl mb-2">❤️</p>
              <h3 className="text-2xl font-bold mb-2">My Wishlist</h3>
              <p className="text-pink-100">
                View and manage your saved favorite rooms
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/inquiries')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition"
          >
            <div className="text-white">
              <p className="text-4xl mb-2">💬</p>
              <h3 className="text-2xl font-bold mb-2">My Inquiries</h3>
              <p className="text-green-100">
                Track your messages to brokers
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/search')}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition"
          >
            <div className="text-white">
              <p className="text-4xl mb-2">⭐</p>
              <h3 className="text-2xl font-bold mb-2">Get AI Recommendations</h3>
              <p className="text-orange-100">
                Discover rooms tailored to your preferences
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Why Choose AI Room Rental? ✨
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span className="text-3xl">🤖</span>
              <div>
                <h4 className="font-bold text-gray-800">AI-Powered Search</h4>
                <p className="text-gray-600">
                  Natural language search finds rooms instantly
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">📊</span>
              <div>
                <h4 className="font-bold text-gray-800">Smart Recommendations</h4>
                <p className="text-gray-600">
                  ML algorithms learn your preferences
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">📸</span>
              <div>
                <h4 className="font-bold text-gray-800">Image Analysis</h4>
                <p className="text-gray-600">
                  Deep learning analyzes room quality
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">❤️</span>
              <div>
                <h4 className="font-bold text-gray-800">Save Favorites</h4>
                <p className="text-gray-600">
                  Build your wishlist of dream rooms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}