import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddRoom() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    type: '1BHK', city: '', address: '',
    lat: '', lng: '', amenities: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const roomData = {
        ...form,
        price: Number(form.price),
        lat: Number(form.lat),
        lng: Number(form.lng),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(a => a)
      };

      const res = await axios.post('http://localhost:5000/api/rooms', roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        await axios.post(`http://localhost:5000/api/rooms/${res.data._id}/images`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert('Room added successfully!');
      navigate('/broker');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Room Rental</h1>
        <button onClick={() => navigate('/broker')} className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </button>
      </nav>
      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Add New Room</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow p-6">
          <input className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400" placeholder="Room Title" onChange={e => setForm({...form, title: e.target.value})} />
          <textarea className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400" placeholder="Description" rows={3} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input className="border p-2 rounded outline-none focus:border-blue-400" placeholder="Price (₹)" type="number" onChange={e => setForm({...form, price: e.target.value})} />
            <select className="border p-2 rounded outline-none focus:border-blue-400" onChange={e => setForm({...form, type: e.target.value})}>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="PG">PG</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
          <input className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400" placeholder="City" onChange={e => setForm({...form, city: e.target.value})} />
          <input className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400" placeholder="Full Address" onChange={e => setForm({...form, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input className="border p-2 rounded outline-none focus:border-blue-400" placeholder="Latitude (e.g. 16.8524)" onChange={e => setForm({...form, lat: e.target.value})} />
            <input className="border p-2 rounded outline-none focus:border-blue-400" placeholder="Longitude (e.g. 74.5815)" onChange={e => setForm({...form, lng: e.target.value})} />
          </div>
          <input className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400" placeholder="Amenities (comma separated: WiFi, AC, Parking)" onChange={e => setForm({...form, amenities: e.target.value})} />
          <input className="w-full border p-2 rounded mb-4" type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} />
          {images.length > 0 && <p className="text-green-600 text-sm mb-4">{images.length} image(s) selected</p>}
          <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            {loading ? 'Adding Room...' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  );
}