import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import { isLoggedIn } from "./services/authService";

// Protected route — redirect to login if not authenticated
function Protected({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public only — redirect to home if already logged in
function PublicOnly({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — login & register */}
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

        {/* Protected routes — require login */}
        <Route path="/" element={<Protected><Navbar /><Home /></Protected>} />
        <Route path="/rooms" element={<Protected><Navbar /><Rooms /></Protected>} />
        <Route path="/property/:id" element={<Protected><Navbar /><PropertyDetails /></Protected>} />
        <Route path="/add-property" element={<Protected><Navbar /><AddProperty /></Protected>} />
        <Route path="/dashboard" element={<Protected><Navbar /><Dashboard /></Protected>} />
        <Route path="/payment/:id" element={<Protected><Navbar /><Payment /></Protected>} />
        <Route path="/admin" element={<Protected><Navbar /><Admin /></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
