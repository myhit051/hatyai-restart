import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted location for after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Check if user is verified (if you have email verification)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;