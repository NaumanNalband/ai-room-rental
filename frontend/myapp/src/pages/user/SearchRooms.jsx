import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SearchRooms() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nlpQuery, setNlpQuery] = useState('');
  const [filters, setFilters] = useState({ city: '', type: '', minPrice: '', maxPrice: '' });
  const [nlpFilters, setNlpFilters] = useState(null);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRooms();
    fetchWishlistCount();
  }, []);

  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchWishlistCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ids = new Set(res.data.wishlist.map(w => w.room._id));
      setWishlistItems(ids);
    } catch (err) {
      console.log('Error fetching wishlist:', err);
    }
  };

  const handleNlpSearch = async () => {
    if (!nlpQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/rooms/search/nlp', {
        query: nlpQuery
      });
      setRooms(res.data.rooms);
      setNlpFilters(res.data.filters);
    } catch (err) {
      console.log(err);
      alert('Search failed. Try again!');
    }
    setLoading(false);
  };

  const handleFilterSearch = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/rooms?';
      if (filters.city) url += `city=${filters.city}&`;
      if (filters.type) url += `type=${filters.type}&`;
      if (filters.minPrice) url += `minPrice=${filters.minPrice}&`;
      if (filters.maxPrice) url += `maxPrice=${filters.maxPrice}&`;
      const res = await axios.get(url);
      setRooms(res.data);
      setNlpFilters(null);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setNlpQuery('');
    setFilters({ city: '', type: '', minPrice: '', maxPrice: '' });
    setNlpFilters(null);
    fetchAllRooms();
  };

  const toggleWishlist = async (roomId) => {
    try {
      if (wishlistItems.has(roomId)) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistItems(prev => new Set([...prev].filter(id => id !== roomId)));
      } else {
        // Add to wishlist
        await axios.post('http://localhost:5000/api/wishlist', 
          { room_id: roomId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems(prev => new Set([...prev, roomId]));
      }
    } catch (err) {
      console.log('Wishlist error:', err);
      alert('Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏠 AI Room Rental</h1>
          <button 
            onClick={() => navigate('/user')} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Find Your Perfect Room 🏡</h2>
          <p className="text-gray-600 mt-2">Search using AI or manual filters</p>
        </div>

        {/* NLP Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-bold text-gray-800">AI-Powered Search</h3>
            <p className="text-sm text-gray-600 ml-auto">Type in plain English</p>
          </div>
          
          <div className="flex gap-3 mb-4">
            <input
              className="flex-1 border-2 border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="e.g., cheap 2bhk in Sangli with wifi and AC"
              value={nlpQuery}
              onChange={e => setNlpQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNlpSearch()}
            />
            <button
              onClick={handleNlpSearch}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-semibold"
            >
              {loading ? '🔄' : '🔍'} Search
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              ↻ Reset
            </button>
          </div>

          {/* NLP Filters Display */}
          {nlpFilters && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-bold text-blue-600 mb-2">✨ AI Extracted Filters:</p>
              <div className="flex flex-wrap gap-2">
                {nlpFilters.city && (
                  <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    📍 {nlpFilters.city}
                  </span>
                )}
                {nlpFilters.type && (
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    🏠 {nlpFilters.type}
                  </span>
                )}
                {nlpFilters.minPrice && (
                  <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                    ₹ From ₹{nlpFilters.minPrice}
                  </span>
                )}
                {nlpFilters.maxPrice && (
                  <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    ₹ Up to ₹{nlpFilters.maxPrice}
                  </span>
                )}
                {nlpFilters.amenities?.length > 0 && (
                  <span className="inline-block bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                    ⭐ {nlpFilters.amenities.join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Manual Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔧</span>
            <h3 className="text-lg font-bold text-gray-800">Manual Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg outline-none focus:border-blue-500 transition"
                placeholder="e.g., Sangli"
                value={filters.city}
                onChange={e => setFilters({...filters, city: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg outline-none focus:border-blue-500 transition"
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="PG">PG</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
              <input
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg outline-none focus:border-blue-500 transition"
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={e => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
              <input
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg outline-none focus:border-blue-500 transition"
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={e => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>

          <button
            onClick={handleFilterSearch}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-semibold"
          >
            Apply Filters
          </button>
        </div>

        {/* Room Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">🔄 Searching for amazing rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">🔍 No rooms found. Try a different search!</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 font-semibold mb-6">
              ✨ {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {room.images?.length > 0 ? (
                      <img
                        src={room.images[0]}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏠
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white rounded-lg shadow-lg px-3 py-1">
                      <p className="font-bold text-blue-600 text-lg">₹{room.price}</p>
                      <p className="text-xs text-gray-600">/month</p>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(room._id);
                      }}
                      className="absolute top-3 left-3 text-3xl hover:scale-125 transition"
                    >
                      {wishlistItems.has(room._id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 
                      className="text-lg font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/room/${room._id}`)}
                    >
                      {room.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <span>📍</span>
                      <span>{room.city}</span>
                      <span>•</span>
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                        {room.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.amenities.slice(0, 3).join(', ')}
                    </p>

                    <div className="border-t pt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Broker</p>
                        <p className="font-semibold text-gray-800">{room.broker?.name}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/room/${room._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}