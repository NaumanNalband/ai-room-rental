import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoomDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleInquiry = async () => {
    if (!message.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        room: id,
        broker: room.broker._id,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSent(true);
      setMessage('');
    } catch (err) {
      alert('Inquiry feature coming on Day 13!');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!room) return <div className="p-8 text-center">Room not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Room Rental</h1>
        <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">
          ← Back
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        {/* Images */}
        {room.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {room.images.map((img, i) => (
              <img key={i} src={img} alt={room.title} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Room Details */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h2 className="text-2xl font-bold mb-2">{room.title}</h2>
              <p className="text-gray-500 mb-2">{room.address}, {room.city}</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">₹{room.price}<span className="text-sm text-gray-400">/month</span></p>
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">{room.type}</span>
                <span className={`px-3 py-1 rounded text-sm ${room.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {room.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div>
                <p className="font-semibold mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Broker */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">Contact Broker</h3>
              <p className="text-gray-600 text-sm mb-1">👤 {room.broker?.name}</p>
              <p className="text-gray-500 text-sm mb-4">📧 {room.broker?.email}</p>
              {sent ? (
                <div className="bg-green-100 text-green-600 p-3 rounded text-sm">
                  ✅ Inquiry sent successfully!
                </div>
              ) : (
                <>
                  <textarea
                    className="w-full border p-2 rounded mb-3 text-sm outline-none focus:border-blue-400"
                    placeholder="Write your message..."
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button
                    onClick={handleInquiry}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                  >
                    Send Inquiry
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}