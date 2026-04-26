import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Room Rental</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-blue-600">Search Rooms</h3>
            <p className="text-gray-500 text-sm mt-2">Find rooms near you</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-blue-600">AI Recommendations</h3>
            <p className="text-gray-500 text-sm mt-2">Rooms picked for you</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-blue-600">My Wishlist</h3>
            <p className="text-gray-500 text-sm mt-2">Saved rooms</p>
          </div>
        </div>
      </div>
    </div>
  );
}