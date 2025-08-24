import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import Home from "./pages/home/Home"
import Signin1 from "./pages/auth/Signup"
import Login5 from "./pages/auth/Login"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/dashboard/Dashboard"
import Components from "./pages/dashboard/Components"
import AddComponent from "./pages/dashboard/AddComponent"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/signup" element={
        <PublicRoute key="signup">
          <Signin1 />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute key="login">
          <Login5 />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute key="dashboard-layout">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="components" element={<Components />} />
        <Route path="components/add" element={<AddComponent />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App