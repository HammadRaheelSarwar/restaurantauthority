import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import CertificationPage from './pages/public/CertificationPage';
import VerifyCertificatePage from './pages/public/VerifyCertificatePage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// App Pages
import DashboardPage from './pages/dashboards/DashboardPage';
import OrganizationsPage from './pages/organizations/OrganizationsPage';
import RestaurantsPage from './pages/restaurants/RestaurantsPage';
import LocationsPage from './pages/locations/LocationsPage';
import AssessmentsPage from './pages/assessments/AssessmentsPage';
import EquipmentPage from './pages/equipment/EquipmentPage';
import PanelsPage from './pages/electrical-panels/PanelsPage';
import IncidentsPage from './pages/incidents/IncidentsPage';
import CorrectiveActionsPage from './pages/corrective-actions/CorrectiveActionsPage';
import AnnualReviewsPage from './pages/annual-reviews/AnnualReviewsPage';
import CertificationsPage from './pages/certifications/CertificationsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AuditLogsPage from './pages/audit-logs/AuditLogsPage';
import SettingsPage from './pages/settings/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Corporate Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/certification" element={<CertificationPage />} />
              <Route path="/verify" element={<VerifyCertificatePage />} />
              <Route path="/verify/:code" element={<VerifyCertificatePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated SaaS Compliance Workspace */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/electrical-panels" element={<PanelsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/corrective-actions" element={<CorrectiveActionsPage />} />
              <Route path="/annual-reviews" element={<AnnualReviewsPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/courses" element={<CertificationsPage />} />
              <Route path="/exams" element={<CertificationsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
