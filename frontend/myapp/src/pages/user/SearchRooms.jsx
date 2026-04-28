import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nlpQuery, setNlpQuery] = useState('');
  const [filters, setFilters] = useState({ city: '', type: '', minPrice: '', maxPrice: '' });
  const [nlpFilters, setNlpFilters] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRooms();
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Room Rental</h1>
        <button onClick={() => navigate('/user')} className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Search Rooms</h2>

        {/* NLP Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <p className="text-sm font-semibold text-blue-600 mb-2">🤖 AI Search — type in plain English</p>
          <div className="flex gap-2">
            <input
              className="flex-1 border p-2 rounded outline-none focus:border-blue-400"
              placeholder="e.g. cheap 2bhk in Sangli with wifi"
              value={nlpQuery}
              onChange={e => setNlpQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNlpSearch()}
            />
            <button
              onClick={handleNlpSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
          {nlpFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="text-xs text-gray-500 w-full">AI extracted:</p>
              {nlpFilters.city && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">City: {nlpFilters.city}</span>}
              {nlpFilters.type && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Type: {nlpFilters.type}</span>}
              {nlpFilters.maxPrice && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded">Max Price: ₹{nlpFilters.maxPrice}</span>}
              {nlpFilters.amenities?.length > 0 && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Amenities: {nlpFilters.amenities.join(', ')}</span>}
            </div>
          )}
        </div>

        {/* Manual Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">Manual Filters</p>
          <div className="grid grid-cols-4 gap-3">
            <input
              className="border p-2 rounded outline-none focus:border-blue-400 text-sm"
              placeholder="City"
              value={filters.city}
              onChange={e => setFilters({...filters, city: e.target.value})}
            />
            <select
              className="border p-2 rounded outline-none focus:border-blue-400 text-sm"
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
            <input
              className="border p-2 rounded outline-none focus:border-blue-400 text-sm"
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={e => setFilters({...filters, minPrice: e.target.value})}
            />
            <input
              className="border p-2 rounded outline-none focus:border-blue-400 text-sm"
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={e => setFilters({...filters, maxPrice: e.target.value})}
            />
          </div>
          <button
            onClick={handleFilterSearch}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Apply Filters
          </button>
        </div>

        {/* Room Results */}
        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No rooms found. Try a different search!</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">{rooms.length} room(s) found</p>
            <div className="grid grid-cols-2 gap-4">
              {rooms.map(room => (
                <div
                  key={room._id}
                  onClick={() => navigate(`/room/${room._id}`)}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition"
                >
                  {room.images?.length > 0 && (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{room.title}</h3>
                  <p className="text-gray-500 text-sm">{room.city} • {room.type}</p>
                  <p className="text-blue-600 font-semibold mt-1">₹{room.price}/month</p>
                  <p className="text-gray-400 text-xs mt-1">{room.amenities.join(', ')}</p>
                  <p className="text-gray-400 text-xs mt-1">Broker: {room.broker?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}