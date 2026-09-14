import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Spinner } from '@/components/ui/Spinner';

import { Home } from '@/pages/Home';
import { Rooms } from '@/pages/Rooms';
import { RoomDetail } from '@/pages/RoomDetail';
import { BookRoom } from '@/pages/BookRoom';
import { MyBookings } from '@/pages/MyBookings';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ManageRooms } from '@/pages/admin/ManageRooms';
import { Settings } from '@/pages/admin/Settings';
import { Issues } from '@/pages/admin/Issues';
import { RoomDashboard } from '@/pages/RoomDashboard';
import { FloorPlan } from '@/pages/FloorPlan';

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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
