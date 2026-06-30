import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';
import PatientListPage   from './pages/PatientListPage';
import PatientFormPage   from './pages/PatientFormPage';
import PatientDetailPage from './pages/PatientDetailPage';
import BillingPage       from './pages/BillingPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected Routes (with Sidebar + Navbar) ── */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"          element={<DashboardPage />} />
            <Route path="/patients"           element={<PatientListPage />} />
            <Route path="/patients/new"       element={<PatientFormPage />} />
            <Route path="/patients/:id"       element={<PatientDetailPage />} />
            <Route path="/patients/:id/edit"  element={<PatientFormPage />} />
            <Route path="/billing"            element={<BillingPage />} />

            {/* ── Stub routes (sidebar links) ── */}
            <Route path="/analytics" element={
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <h2>Analytics</h2>
                <p style={{ marginTop: 8 }}>Coming soon — analytics dashboard.</p>
              </div>
            } />
            <Route path="/settings" element={
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <h2>Settings</h2>
                <p style={{ marginTop: 8 }}>Settings panel coming soon.</p>
              </div>
            } />
            <Route path="/help" element={
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <h2>Help &amp; Support</h2>
                <p style={{ marginTop: 8 }}>Documentation and support resources coming soon.</p>
              </div>
            } />
          </Route>

          {/* ── 404 fallback ── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
