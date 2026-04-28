import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import BrokerDashboard from './pages/BrokerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AddRoom from './pages/broker/AddRoom'
import MyListings from './pages/broker/MyListings'
<<<<<<< HEAD
=======
import SearchRooms from './pages/user/SearchRooms'
import RoomDetail from './pages/user/RoomDetail'
>>>>>>> feature/user-ui
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
<<<<<<< HEAD
=======
      <Route path="/search" element={<PrivateRoute role="user"><SearchRooms /></PrivateRoute>} />
      <Route path="/room/:id" element={<PrivateRoute role="user"><RoomDetail /></PrivateRoute>} />
>>>>>>> feature/user-ui
      <Route path="/broker" element={<PrivateRoute role="broker"><BrokerDashboard /></PrivateRoute>} />
      <Route path="/broker/add-room" element={<PrivateRoute role="broker"><AddRoom /></PrivateRoute>} />
      <Route path="/broker/my-listings" element={<PrivateRoute role="broker"><MyListings /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
    </Routes>
  )
}