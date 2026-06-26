import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import BookingPage from '../pages/client/BookingPage'
import AppointmentsPage from '../pages/client/AppointmentsPage'
import SchedulePage from '../pages/professional/SchedulePage'
import ClientsPage from '../pages/professional/ClientsPage'
import ClientRegistrationPage from '../pages/admin/ClientRegistrationPage'
import AdminClientsPage from '../pages/admin/AdminClientsPage'
import ProfessionalRegistrationPage from '../pages/admin/ProfessionalRegistrationPage'
import AdminProfessionalsPage from '../pages/admin/AdminProfessionalsPage'
import AdminSchedulePage from '../pages/admin/AdminSchedulePage'  
import AdminProfessionalsSchedulePage from '../pages/admin/AdminProfessionalsSchedulePage'
import AdminReportsPage from '../pages/admin/AdminReportsPage'
import AdminServicesPage from '../pages/admin/AdminServicesPage'
import AvailabilityPage from '../pages/professional/AvailabilityPage'

const PrivateRoute = ({ allowedRole }: { allowedRole: string }) => {
  const token = localStorage.getItem('@Navalha:token');
  const userStr = localStorage.getItem('@Navalha:user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== allowedRole) {
    if (user.role === 'CLIENTE') return <Navigate to="/client/agendar" replace />;
    if (user.role === 'PROFISSIONAL') return <Navigate to="/professional/agenda" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/profissionais" replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const token = localStorage.getItem('@Navalha:token');
  const userStr = localStorage.getItem('@Navalha:user');

  if (token && userStr) {
    const user = JSON.parse(userStr);
    if (user.role === 'CLIENTE') return <Navigate to="/client/agendar" replace />;
    if (user.role === 'PROFISSIONAL') return <Navigate to="/professional/agenda" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/profissionais" replace />;
  }

  return <Outlet />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz agora tenta renderizar a PublicRoute, que vai redirecionar automaticamente se ele já tiver token */}
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        
        {/* Rotas Protegidas do Cliente */}
        <Route element={<PrivateRoute allowedRole="CLIENTE" />}>
          <Route path="/client/agendar" element={<BookingPage />} />
          <Route path="/client/agendamentos" element={<AppointmentsPage />} />
        </Route>
        
        {/* Rotas Protegidas do Profissional */}
        <Route element={<PrivateRoute allowedRole="PROFISSIONAL" />}>
          <Route path="/professional/agenda" element={<SchedulePage />} />
          <Route path="/professional/clientes" element={<ClientsPage />} />
          <Route path="/professional/disponibilidade" element={<AvailabilityPage />} />
        </Route>

        {/* Rotas Protegidas do Admin */}
        <Route element={<PrivateRoute allowedRole="ADMIN" />}>
          <Route path="/admin/cadastro-cliente" element={<ClientRegistrationPage />} />
          <Route path="/admin/clientes" element={<AdminClientsPage />} />
          <Route path="/admin/cadastro-profissional" element={<ProfessionalRegistrationPage />} />
          <Route path="/admin/profissionais" element={<AdminProfessionalsPage />} />
          <Route path="/admin/agenda" element={<AdminSchedulePage />} />
          <Route path="/admin/agenda-profissionais" element={<AdminProfessionalsSchedulePage />} />
          <Route path="/admin/relatorios" element={<AdminReportsPage />} />
          <Route path="/admin/servicos" element={<AdminServicesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}