import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<h1 className="p-8 text-2xl">User Dashboard — Coming Day 6</h1>} />
      <Route path="/broker" element={<h1 className="p-8 text-2xl">Broker Dashboard — Coming Day 6</h1>} />
      <Route path="/admin" element={<h1 className="p-8 text-2xl">Admin Dashboard — Coming Day 6</h1>} />
    </Routes>
  )
}