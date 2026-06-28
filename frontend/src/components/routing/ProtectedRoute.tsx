import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresRole?: "admin" | "creator" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = true,
  requiresRole,
}) => {
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires specific role and user doesn't have it
  if (requiresRole && user?.role !== requiresRole) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
