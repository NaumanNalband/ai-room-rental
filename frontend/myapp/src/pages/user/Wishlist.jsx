import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Wishlist() {
  const { token, API_URL } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.log('Error fetching wishlist:', err);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (roomId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(w => w.room._id !== roomId));
    } catch (err) {
      console.log('Error removing from wishlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">❤️ My Wishlist</h1>
          <button 
            onClick={() => navigate('/user')} 
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Your Saved Rooms
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">🔄 Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">💔 Your wishlist is empty</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(item => (
              <div
                key={item.room._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {item.room.images && item.room.images[0] ? (
                    <img
                      src={item.room.images[0]}
                      alt={item.room.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🏠
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold text-pink-600">
                    ₹{item.room.price}/mo
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {item.room.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    📍 {item.room.city} • {item.room.type}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.room.amenities.slice(0, 2).join(', ')}
                  </p>
                  {item.room.broker && (
                    <p className="text-gray-700 text-sm font-semibold mb-3">
                      👤 {item.room.broker.name}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/room/${item.room._id}`)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.room._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}