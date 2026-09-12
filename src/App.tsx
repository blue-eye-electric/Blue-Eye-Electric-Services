import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import HomePage from "./pages/home";
import Footer from "./organisms/Footer";
import ProtectedRoute from "./route/ProtectedRoute";
import PageLoader from "./atoms/PageLoader";

const ElectricianLoginPage = lazy(
  () => import("./pages/electrician/ElectricianLoginPage"),
);
const ElectricianDashboardPage = lazy(
  () => import("./pages/electrician/ElectricianDashboardPage"),
);
const ElectricianRegistrationPage = lazy(
  () => import("./pages/electrician/ElectricianRegistrationPage"),
);
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminProjectPage = lazy(() => import("./pages/admin/AdminProjectPage"));
const AdminElectricianPage = lazy(
  () => import("./pages/admin/AdminElectricianPage"),
);
const AdminElectricianDetailPage = lazy(
  () =>
    import("./pages/admin/AdminElectricianDetailPage/AdminElectricianDetailPage"),
);
const AdminServiceAreaPage = lazy(
  () => import("./pages/admin/AdminServiceAreaPage"),
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Existing home page */}
            <Route path="/" element={<HomePage />} />

            {/* Electrician */}
            <Route
              path="/electrician"
              element={<ElectricianRegistrationPage />}
            />
            <Route
              path="/electrician/login"
              element={<ElectricianLoginPage />}
            />
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
              path="/admin/project"
              element={
                <ProtectedRoute role="admin">
                  <AdminProjectPage />
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
            <Route
              path="/admin/serviceArea"
              element={
                <ProtectedRoute role="admin">
                  <AdminServiceAreaPage />
                </ProtectedRoute>
              }
            />

            {/* Unknown route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
