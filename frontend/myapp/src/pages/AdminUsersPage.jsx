import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.log('Error fetching users:', err);
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

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
      alert('✅ User deleted successfully');
    } catch (err) {
      console.log('Error deleting user:', err);
      alert('❌ Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'user': return 'bg-blue-100 text-blue-600';
      case 'broker': return 'bg-green-100 text-green-600';
      case 'admin': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">👥 Admin Panel</h1>
          <button 
            onClick={() => navigate('/admin')} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.users?.total || 0}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Brokers</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.users?.brokers || 0}
                </p>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Regular Users</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.users?.regular || 0}
                </p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">🔄 Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(user._id)}
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