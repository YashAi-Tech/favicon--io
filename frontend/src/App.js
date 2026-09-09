import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Platform from "./components/Platform";
import TrustedBrands from "./components/TrustedBrands";
import CustomerStories from "./components/CustomerStories";
import Stats from "./components/Stats";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import { Toaster } from "./components/ui/toaster";

const Landing = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <TrustedBrands />
      <Showcase />
      <Platform />
      <CustomerStories />
      <Stats />
      <FinalCTA />
    </main>
    <Footer />
  </>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-neutral-400" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRouter() {
  const location = useLocation();
  // Handle Google OAuth callback (session_id in URL fragment) before anything else
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/build/:projectId" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
