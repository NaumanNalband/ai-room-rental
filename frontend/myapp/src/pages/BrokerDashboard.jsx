import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BrokerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    roomsCount: 0, 
    inquiriesCount: 0,
    availableRooms: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [myRooms, inquiries] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms/broker/myrooms', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/inquiries/broker/inquiries', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const availableCount = myRooms.data.filter(r => r.isAvailable).length;
      setStats({
        roomsCount: myRooms.data.length,
        inquiriesCount: inquiries.data.length,
        availableRooms: availableCount
      });
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">🏠 AI Room Rental</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">👤 {user?.name}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 🎉
          </h2>
          <p className="text-gray-600">
            Manage your listings and connect with interested renters
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.roomsCount}
                </p>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Rooms</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.availableRooms}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inquiries Received</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.inquiriesCount}
                </p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Room Card */}
          <div
            onClick={() => navigate('/broker/add-room')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-white">
              <p className="text-5xl mb-4">🏠</p>
              <h3 className="text-2xl font-bold mb-2">Add New Room</h3>
              <p className="text-green-100 mb-4">
                List a new property and reach more renters
              </p>
              <div className="inline-block bg-white text-green-600 font-bold px-4 py-2 rounded-lg">
                Get Started →
              </div>
            </div>
          </div>

          {/* My Listings Card */}
          <div
            onClick={() => navigate('/broker/my-listings')}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-white">
              <p className="text-5xl mb-4">📋</p>
              <h3 className="text-2xl font-bold mb-2">My Listings</h3>
              <p className="text-blue-100 mb-4">
                Manage and update your {stats.roomsCount} room{stats.roomsCount !== 1 ? 's' : ''}
              </p>
              <div className="inline-block bg-white text-blue-600 font-bold px-4 py-2 rounded-lg">
                View Listings →
              </div>
            </div>
          </div>

          {/* Inquiries Card */}
          <div
            onClick={() => navigate('/broker/inquiries')}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="text-white">
              <p className="text-5xl mb-4">💬</p>
              <h3 className="text-2xl font-bold mb-2">Inquiries</h3>
              <p className="text-orange-100 mb-4">
                {stats.inquiriesCount} message{stats.inquiriesCount !== 1 ? 's' : ''} from interested users
              </p>
              <div className="inline-block bg-white text-orange-600 font-bold px-4 py-2 rounded-lg">
                View Messages →
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Broker Features 🚀
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span className="text-3xl">📸</span>
              <div>
                <h4 className="font-bold text-gray-800">Upload Room Images</h4>
                <p className="text-gray-600">
                  Add up to 5 high-quality images per listing
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h4 className="font-bold text-gray-800">Location Details</h4>
                <p className="text-gray-600">
                  Specify exact location with coordinates
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">⭐</span>
              <div>
                <h4 className="font-bold text-gray-800">Amenities Listing</h4>
                <p className="text-gray-600">
                  Highlight WiFi, AC, parking, and more
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">💰</span>
              <div>
                <h4 className="font-bold text-gray-800">Flexible Pricing</h4>
                <p className="text-gray-600">
                  Set monthly rent and update anytime
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">💬</span>
              <div>
                <h4 className="font-bold text-gray-800">Direct Messages</h4>
                <p className="text-gray-600">
                  Communicate directly with interested users
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">📊</span>
              <div>
                <h4 className="font-bold text-gray-800">Room Analytics</h4>
                <p className="text-gray-600">
                  Track views and inquiries for your listings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-l-4 border-green-600">
          <h4 className="font-bold text-green-800 mb-2">💡 Pro Tips</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>✓ Upload clear, well-lit photos for better visibility</li>
            <li>✓ Keep your room availability updated</li>
            <li>✓ Respond to inquiries promptly to get more bookings</li>
            <li>✓ List all amenities to attract the right renters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}