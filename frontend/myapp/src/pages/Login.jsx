import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'broker') navigate('/broker');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
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
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm mt-4">
          No account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}