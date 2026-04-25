import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input
          className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400"
          placeholder="Full Name"
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <input
          className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400"
          placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input
          className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400"
          type="password"
          placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <select
          className="w-full border p-2 rounded mb-4 outline-none focus:border-blue-400"
          onChange={e => setForm({...form, role: e.target.value})}
        >
          <option value="user">User</option>
          <option value="broker">Broker</option>
        </select>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm mt-4">
          Already have account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}