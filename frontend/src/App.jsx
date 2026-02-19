import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminAppointments from './pages/admin/AdminAppointments';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';

import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorsList from './pages/patient/DoctorsList';
import DoctorDetail from './pages/patient/DoctorDetail';
import PatientAppointments from './pages/patient/PatientAppointments';

const AppRoutes = () => {
  const { user } = useAuth();

  const defaultRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute roles={['admin']}><AdminDoctors /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} />

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/profile" element={<ProtectedRoute roles={['doctor']}><DoctorProfile /></ProtectedRoute>} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/doctors" element={<ProtectedRoute roles={['patient']}><DoctorsList /></ProtectedRoute>} />
      <Route path="/patient/doctors/:id" element={<ProtectedRoute roles={['patient']}><DoctorDetail /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientAppointments /></ProtectedRoute>} />

      <Route path="*" element={defaultRedirect()} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
