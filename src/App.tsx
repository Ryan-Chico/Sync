import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorFallback } from '@/components/ui/ErrorFallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const Home = lazy(() => import('@/pages/Home'));
const Rooms = lazy(() => import('@/pages/Rooms'));
const RoomDetail = lazy(() => import('@/pages/RoomDetail'));
const BookRoom = lazy(() => import('@/pages/BookRoom'));
const MyBookings = lazy(() => import('@/pages/MyBookings'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageRooms = lazy(() => import('@/pages/admin/ManageRooms'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const Issues = lazy(() => import('@/pages/admin/Issues'));
const RoomDashboard = lazy(() => import('@/pages/RoomDashboard'));
const FloorPlan = lazy(() => import('@/pages/FloorPlan'));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />

        <Route
          path="/book/:roomId"
          element={
            <ProtectedRoute>
              <BookRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoomDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/floor-plan"
          element={
            <ProtectedRoute>
              <FloorPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute requireAdmin>
              <ManageRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requireAdmin>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute requireAdmin>
              <Issues />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppRoutes />
              </ErrorBoundary>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
