import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import BrokerDashboard from './pages/BrokerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={
        <PrivateRoute role="user">
          <UserDashboard />
        </PrivateRoute>
      } />
      <Route path="/broker" element={
        <PrivateRoute role="broker">
          <BrokerDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      } />
    </Routes>
  )
}