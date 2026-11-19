import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CursorProvider, CustomCursor } from '@/context/CursorContext';
import { AppShell } from '@/components/layout/AppShell';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { AssetsPage } from '@/pages/assets/AssetsPage';
import { ScansPage } from '@/pages/scans/ScansPage';
import { OrganizationPage } from '@/pages/organization/OrganizationPage';
import { IntelligencePage } from '@/pages/intelligence/IntelligencePage';
import { LoadingState } from '@/components/ui/EmptyState';

// Protected route guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-bg-primary"><LoadingState message="Authenticating…" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Public-only route guard (redirects to dashboard if already logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-bg-primary"><LoadingState message="Loading…" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      {/* Protected — wrapped in AppShell */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell><DashboardPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/assets" element={
        <ProtectedRoute>
          <AppShell><AssetsPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/scans" element={
        <ProtectedRoute>
          <AppShell><ScansPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/organization" element={
        <ProtectedRoute>
          <AppShell><OrganizationPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/intelligence" element={
        <ProtectedRoute>
          <AppShell><IntelligencePage /></AppShell>
        </ProtectedRoute>
      } />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CursorProvider>
          <CustomCursor />
          <AppRoutes />
        </CursorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
