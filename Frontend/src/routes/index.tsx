import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import BookingPage from '../pages/client/BookingPage'
import AppointmentsPage from '../pages/client/AppointmentsPage'


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/client/agendar" element={<BookingPage />} />
        <Route path="/client/agendamentos" element={<AppointmentsPage />} />
      </Routes>
    </BrowserRouter>
  )
}