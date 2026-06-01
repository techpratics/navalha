import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import BookingPage from '../pages/client/BookingPage'
import AppointmentsPage from '../pages/client/AppointmentsPage'
import SchedulePage from '../pages/professional/SchedulePage'
import ClientsPage from '../pages/professional/ClientsPage'
import ClientRegistrationPage from '../pages/admin/ClientRegistrationPage'
import AdminClientsPage from '../pages/admin/AdminClientsPage'
import ProfessionalRegistrationPage from '../pages/admin/ProfessionalRegistrationPage'
import AdminProfessionalsPage from '../pages/admin/AdminProfessionalsPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Client Routes */}
        <Route path="/client/agendar" element={<BookingPage />} />
        <Route path="/client/agendamentos" element={<AppointmentsPage />} />
        
        {/* Professional Routes */}
        <Route path="/professional/agenda" element={<SchedulePage />} />
        <Route path="/professional/clientes" element={<ClientsPage />} />

        {/* Admin Routes */}
        <Route path="/admin/cadastro-cliente" element={<ClientRegistrationPage />} />
        <Route path="/admin/clientes" element={<AdminClientsPage />} />
        <Route path="/admin/cadastro-profissional" element={<ProfessionalRegistrationPage />} />
        <Route path="/admin/profissionais" element={<AdminProfessionalsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
