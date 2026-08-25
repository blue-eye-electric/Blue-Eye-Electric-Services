import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home";
import ElectricianLoginPage from "./pages/electrician/ElectricianLoginPage";
import ElectricianDashboardPage from "./pages/electrician/ElectricianDashboardPage";
import ElectricianRegistrationPage from "./pages/electrician/ElectricianRegistrationPage";
import Footer from "./organisms/Footer";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminElectricianPage from "./pages/admin/AdminElectricianPage";
import AdminElectricianDetailPage from "./pages/admin/AdminElectricianDetailPage/AdminElectricianDetailPage";
import ProtectedRoute from "./organisms/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />
      <div className="flex min-h-dvh flex-col">
        <Routes>
          {/* Existing home page */}
          <Route path="/" element={<HomePage />} />

          {/* Electrician */}
          <Route
            path="/electrician"
            element={<ElectricianRegistrationPage />}
          />
          <Route path="/electrician/login" element={<ElectricianLoginPage />} />
          <Route
            path="/electrician/dashboard"
            element={
              <ProtectedRoute role="electrician">
                <ElectricianDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/electricians"
            element={
              <ProtectedRoute role="admin">
                <AdminElectricianPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/electricians/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminElectricianDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
