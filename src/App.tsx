import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// Dashboard layout
import DashboardLayout from './layouts/DashboardLayout'

// Admin pages
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import PatientsPage from './pages/dashboard/admin/PatientsPage'
import DoctorsPage from './pages/dashboard/admin/DoctorsPage'
import BillingPage from './pages/dashboard/admin/BillingPage'
import AnalyticsPage from './pages/dashboard/admin/AnalyticsPage'
import SettingsPage from './pages/dashboard/admin/SettingsPage'

// Doctor pages
import DoctorDashboard from './pages/dashboard/doctor/DoctorDashboard'
import DoctorAppointments from './pages/dashboard/doctor/DoctorAppointments'
import DoctorPatients from './pages/dashboard/doctor/DoctorPatients'
import DoctorPrescriptions from './pages/dashboard/doctor/DoctorPrescriptions'

// Receptionist pages
import ReceptionistDashboard from './pages/dashboard/receptionist/ReceptionistDashboard'
import QueueManagement from './pages/dashboard/receptionist/QueueManagement'
import AppointmentBooking from './pages/dashboard/receptionist/AppointmentBooking'
import RegisterPatient from './pages/dashboard/receptionist/RegisterPatient'

// Patient pages
import PatientDashboard from './pages/dashboard/patient/PatientDashboard'
import PatientHistory from './pages/dashboard/patient/PatientHistory'
import PatientBills from './pages/dashboard/patient/PatientBills'
import PharmacyDashboard from './pages/dashboard/pharmacy/PharmacyDashboard'

// Shared pages
import AppointmentsPage from './pages/dashboard/shared/AppointmentsPage'
import AIAssistant from './pages/dashboard/shared/AIAssistant'
import EmergencyWallet from './pages/dashboard/shared/EmergencyWallet'
import NotFoundPage from './pages/public/NotFoundPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function RoleRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function DashboardRedirect() {
  const { user } = useAuthStore()
  const roleMap: Record<string, string> = {
    admin: '/dashboard/admin',
    doctor: '/dashboard/doctor',
    receptionist: '/dashboard/receptionist',
    patient: '/dashboard/patient',
    pharmacy: '/dashboard/pharmacy',
  }
  return <Navigate to={roleMap[user?.role || 'patient'] || '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardRedirect />} />

          {/* Admin */}
          <Route path="admin" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="admin/patients" element={<RoleRoute allowedRoles={['admin']}><PatientsPage /></RoleRoute>} />
          <Route path="admin/doctors" element={<RoleRoute allowedRoles={['admin']}><DoctorsPage /></RoleRoute>} />
          <Route path="admin/billing" element={<RoleRoute allowedRoles={['admin']}><BillingPage /></RoleRoute>} />
          <Route path="admin/analytics" element={<RoleRoute allowedRoles={['admin']}><AnalyticsPage /></RoleRoute>} />
          <Route path="admin/settings" element={<RoleRoute allowedRoles={['admin']}><SettingsPage /></RoleRoute>} />

          {/* Doctor */}
          <Route path="doctor" element={<RoleRoute allowedRoles={['doctor']}><DoctorDashboard /></RoleRoute>} />
          <Route path="doctor/appointments" element={<RoleRoute allowedRoles={['doctor']}><DoctorAppointments /></RoleRoute>} />
          <Route path="doctor/patients" element={<RoleRoute allowedRoles={['doctor']}><DoctorPatients /></RoleRoute>} />
          <Route path="doctor/prescriptions" element={<RoleRoute allowedRoles={['doctor']}><DoctorPrescriptions /></RoleRoute>} />

          {/* Receptionist */}
          <Route path="receptionist" element={<RoleRoute allowedRoles={['receptionist']}><ReceptionistDashboard /></RoleRoute>} />
          <Route path="receptionist/queue" element={<RoleRoute allowedRoles={['receptionist']}><QueueManagement /></RoleRoute>} />
          <Route path="receptionist/book" element={<RoleRoute allowedRoles={['receptionist']}><AppointmentBooking /></RoleRoute>} />
          <Route path="receptionist/register-patient" element={<RoleRoute allowedRoles={['receptionist']}><RegisterPatient /></RoleRoute>} />

          {/* Patient */}
          <Route path="patient" element={<RoleRoute allowedRoles={['patient']}><PatientDashboard /></RoleRoute>} />
          <Route path="patient/history" element={<RoleRoute allowedRoles={['patient']}><PatientHistory /></RoleRoute>} />
          <Route path="patient/bills" element={<RoleRoute allowedRoles={['patient']}><PatientBills /></RoleRoute>} />

          {/* Pharmacy */}
          <Route path="pharmacy" element={<RoleRoute allowedRoles={['pharmacy']}><PharmacyDashboard /></RoleRoute>} />
          <Route path="pharmacy/prescriptions" element={<RoleRoute allowedRoles={['pharmacy']}><PharmacyDashboard /></RoleRoute>} />

          {/* Shared */}
          <Route path="appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="emergency-wallet" element={<ProtectedRoute><EmergencyWallet /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
