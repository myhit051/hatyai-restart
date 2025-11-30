import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyJobs from "./pages/MyJobs";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RepairDashboard from "./pages/RepairDashboard";
import WasteDashboard from "./pages/WasteDashboard";
import ResourceDashboard from "./pages/ResourceDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/repair" element={
            <ProtectedRoute>
              <RepairDashboard />
            </ProtectedRoute>
          } />
          <Route path="/waste" element={
            <ProtectedRoute>
              <WasteDashboard />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute>
              <ResourceDashboard />
            </ProtectedRoute>
          } />

          {/* Legacy Routes - Redirect or Update */}
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
