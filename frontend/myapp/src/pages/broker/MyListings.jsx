import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyListings() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMyRooms(); }, []);

  const fetchMyRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms/broker/myrooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(rooms.filter(r => r._id !== id));
      alert('Room deleted successfully!');
    } catch (err) { alert('Failed to delete room'); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Room Rental</h1>
        <button onClick={() => navigate('/broker')} className="text-blue-500 hover:underline">← Back to Dashboard</button>
      </nav>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Listings</h2>
          <button onClick={() => navigate('/broker/add-room')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+ Add New Room</button>
        </div>
        {loading ? <p className="text-gray-500">Loading...</p> : rooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No rooms listed yet</p>
            <button onClick={() => navigate('/broker/add-room')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Your First Room</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rooms.map(room => (
              <div key={room._id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{room.title}</h3>
                  <p className="text-gray-500 text-sm">{room.city} • {room.type} • ₹{room.price}/month</p>
                  <p className="text-gray-400 text-sm mt-1">{room.amenities.join(', ')}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${room.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {room.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <button onClick={() => handleDelete(room._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}