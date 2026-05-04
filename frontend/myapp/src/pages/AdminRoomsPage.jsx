import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoomsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchRooms();
    fetchStats();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data.rooms);
    } catch (err) {
      console.log('Error fetching rooms:', err);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(rooms.filter(r => r._id !== roomId));
      alert('✅ Room deleted successfully');
    } catch (err) {
      console.log('Error deleting room:', err);
      alert('❌ Failed to delete room');
    }
  };

  const toggleAvailability = async (roomId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/rooms/${roomId}/availability`,
        { isAvailable: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRooms();
      alert('✅ Room status updated');
    } catch (err) {
      console.log('Error updating room:', err);
      alert('❌ Failed to update room');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏠 Rooms Management</h1>
          <button 
            onClick={() => navigate('/admin')} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Rooms</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.rooms?.total || 0}
                </p>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.rooms?.available || 0}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unavailable</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rooms?.unavailable || 0}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">All Rooms</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">🔄 Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No rooms found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">City</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Broker</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800 max-w-xs truncate">
                        {room.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {room.city}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-bold">
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        ₹{room.price}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {room.broker?.name}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAvailability(room._id, room.isAvailable)}
                          className={`px-3 py-1 rounded-full text-sm font-bold transition ${
                            room.isAvailable
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {room.isAvailable ? '✅ Available' : '❌ Unavailable'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}