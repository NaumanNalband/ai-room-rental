import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MyInquiries() {
  const { token, API_URL } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/inquiries/user/my-inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data);
    } catch (err) {
      console.log('Error fetching inquiries:', err);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'replied': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'replied': return '✅';
      case 'closed': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">💬 My Inquiries</h1>
          <button 
            onClick={() => navigate('/user')} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Messages to Brokers
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">🔄 Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">📭 No inquiries sent yet</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Find Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <div
                key={inquiry._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {inquiry.room?.title || 'Room'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      📍 {inquiry.room?.city}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(inquiry.status)}`}>
                    {getStatusEmoji(inquiry.status)} {inquiry.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Your Message:</strong> {inquiry.message}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      👤 Broker: {inquiry.broker?.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      📧 {inquiry.broker?.email}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Sent: {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/room/${inquiry.room._id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                  >
                    View Room →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}