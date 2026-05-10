import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout, API_URL } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'rooms') {
      fetchRooms();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.log('Error fetching users:', err);
    }
    setLoading(false);
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data.rooms);
    } catch (err) {
      console.log('Error fetching rooms:', err);
    }
    setLoading(false);
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      alert(`✅ User role changed to ${newRole.toUpperCase()}`);
    } catch (err) {
      console.log('Error changing role:', err);
      alert('❌ Failed to change role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      alert('✅ User deleted successfully');
    } catch (err) {
      console.log('Error deleting user:', err);
      alert('❌ Failed to delete user');
    }
  };

  const toggleRoomAvailability = async (roomId, currentStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/rooms/${roomId}/availability`,
        { isAvailable: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRooms();
      alert('✅ Room availability updated');
    } catch (err) {
      console.log('Error updating room:', err);
      alert('❌ Failed to update room');
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRooms();
      alert('✅ Room deleted successfully');
    } catch (err) {
      console.log('Error deleting room:', err);
      alert('❌ Failed to delete room');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'user':
        return 'bg-blue-100 text-blue-600';
      case 'broker':
        return 'bg-green-100 text-green-600';
      case 'admin':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">🔴 Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'dashboard'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'users'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => setActiveTab('brokers')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'brokers'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✅ Approve Brokers
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'rooms'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏠 Manage Listings
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {user?.name}! 👋
              </h2>
              <p className="text-gray-600">
                Manage users, approve brokers, and oversee all platform listings
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <p className="text-gray-600 text-sm">Total Listings</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.rooms?.total || 0}
                    </p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Inquiries</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.inquiries?.total || 0}
                    </p>
                  </div>
                  <div className="text-4xl">💬</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">👥 Manage All Users</h2>
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
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleColor(
                              u.role
                            )}`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
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
        )}

        {/* Approve Brokers Tab */}
        {activeTab === 'brokers' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">✅ Approve Brokers</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">🔄 Loading brokers...</p>
              </div>
            ) : users.filter((u) => u.role === 'user').length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No pending brokers</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Current Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => u.role === 'user')
                      .map((u) => (
                        <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-600">
                              USER
                            </span>
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() => changeUserRole(u._id, 'broker')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                            >
                              ✅ Approve as Broker
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Manage Listings Tab */}
        {activeTab === 'rooms' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">🏠 Manage All Listings</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">🔄 Loading listings...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No listings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Broker
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800 max-w-xs truncate">
                          {room.title}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{room.city}</td>
                        <td className="px-6 py-4 font-bold text-green-600">₹{room.price}</td>
                        <td className="px-6 py-4 text-gray-600">{room.broker?.name}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRoomAvailability(room._id, room.isAvailable)}
                            className={`px-3 py-1 rounded text-sm font-bold transition ${
                              room.isAvailable
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            {room.isAvailable ? '✅ Available' : '❌ Unavailable'}
                          </button>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => deleteRoom(room._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
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
        )}
      </div>
    </div>
  );
}