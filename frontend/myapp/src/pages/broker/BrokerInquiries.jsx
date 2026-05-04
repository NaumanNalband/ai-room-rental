import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function BrokerInquiries() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inquiries/broker/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data);
    } catch (err) {
      console.log('Error fetching inquiries:', err);
    }
    setLoading(false);
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Please type a reply');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/inquiries/${selectedInquiry._id}/status`,
        { status: 'replied' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReplyText('');
      setSelectedInquiry(null);
      fetchInquiries();
      alert('✅ Reply sent successfully!');
    } catch (err) {
      console.log('Error replying:', err);
      alert('Failed to send reply');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">💬 Inquiries</h1>
          <button 
            onClick={() => navigate('/broker')} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Messages from Users
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">🔄 Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">📭 No inquiries yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inquiries List */}
            <div className="lg:col-span-1 space-y-4">
              {inquiries.map(inquiry => (
                <div
                  key={inquiry._id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`rounded-lg shadow-lg p-4 cursor-pointer transition transform hover:scale-105 ${
                    selectedInquiry?._id === inquiry._id
                      ? 'bg-orange-200 border-2 border-orange-600'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {inquiry.user?.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(inquiry.status)}`}>
                      {getStatusEmoji(inquiry.status)} {inquiry.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-2">
                    Room: {inquiry.room?.title}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {inquiry.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Inquiry Details */}
            <div className="lg:col-span-2">
              {selectedInquiry ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedInquiry.user?.name}'s Inquiry
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-gray-600 text-sm">Room Interested In:</p>
                      <p className="font-bold text-gray-800">
                        {selectedInquiry.room?.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">From User:</p>
                      <p className="font-bold text-gray-800">
                        {selectedInquiry.user?.name}
                      </p>
                      <p className="text-gray-600">
                        📧 {selectedInquiry.user?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Status:</p>
                      <span className={`inline-block px-3 py-1 rounded-full font-bold ${getStatusColor(selectedInquiry.status)}`}>
                        {getStatusEmoji(selectedInquiry.status)} {selectedInquiry.status.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Sent:</p>
                      <p className="text-gray-800">
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm mb-2">Message:</p>
                    <p className="text-gray-800 text-base">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  {selectedInquiry.status === 'pending' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reply to User:
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 transition h-24 resize-none"
                        placeholder="Type your reply here..."
                      />
                      <button
                        onClick={handleReply}
                        className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-bold"
                      >
                        ✉️ Send Reply
                      </button>
                    </div>
                  )}

                  {selectedInquiry.status === 'replied' && (
                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                      <p className="text-green-700 font-bold">
                        ✅ You've already replied to this inquiry
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <p className="text-gray-600">Select an inquiry to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}