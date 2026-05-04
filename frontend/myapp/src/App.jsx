import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import BrokerDashboard from './pages/BrokerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AddRoom from './pages/broker/AddRoom'
import MyListings from './pages/broker/MyListings'
import SearchRooms from './pages/user/SearchRooms'
import RoomDetail from './pages/user/RoomDetail'
import PrivateRoute from './components/PrivateRoute'
import Wishlist from './pages/user/Wishlist';
import MyInquiries from './pages/user/MyInquiries';
import Profile from './pages/user/Profile';
import BrokerInquiries from './pages/broker/BrokerInquiries';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminRoomsPage from './pages/AdminRoomsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute role="user"><SearchRooms /></PrivateRoute>} />
      <Route path="/room/:id" element={<PrivateRoute role="user"><RoomDetail /></PrivateRoute>} />
      <Route path="/broker" element={<PrivateRoute role="broker"><BrokerDashboard /></PrivateRoute>} />
      <Route path="/broker/add-room" element={<PrivateRoute role="broker"><AddRoom /></PrivateRoute>} />
      <Route path="/broker/my-listings" element={<PrivateRoute role="broker"><MyListings /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/wishlist" element={<PrivateRoute role="user"><Wishlist /></PrivateRoute>} />
      <Route path="/inquiries" element={<PrivateRoute role="user"><MyInquiries /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute role="user"><Profile /></PrivateRoute>} />
      <Route path="/broker/inquiries" element={<PrivateRoute role="broker"><BrokerInquiries /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsersPage /></PrivateRoute>} />
      <Route path="/admin/rooms" element={<PrivateRoute role="admin"><AdminRoomsPage /></PrivateRoute>} />
    </Routes>
  )
}