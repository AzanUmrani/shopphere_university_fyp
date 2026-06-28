import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, User, Settings } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  fetchCreatorProfile,
  fetchDashboardStats,
  checkCreatorStatus,
} from "../../store/slices/creatorSlice";
import { updateUser } from "../../store/slices/authSlice";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import CreatorSidebar from "./CreatorSidebar";
import Badge from "../ui/Badge";

const CreatorLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const { profile, loading, error } = useAppSelector((state) => state.creator);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check creator status and sync role
    const verifyCreatorStatus = async () => {
      if (user) {
        try {
          const result = await dispatch(checkCreatorStatus()).unwrap();
          if (result.isCreator && result.role === "creator") {
            // Update user role in auth state if not already set
            if (user.role !== "creator") {
              dispatch(updateUser({ role: "creator" }));
            }
            setIsCheckingStatus(false);
          } else {
            // Not a creator, redirect
            navigate("/become-creator", { replace: true });
          }
        } catch (error) {
          console.error("Failed to verify creator status:", error);
          navigate("/become-creator", { replace: true });
        }
      } else {
        setIsCheckingStatus(false);
      }
    };

    verifyCreatorStatus();
  }, [dispatch, user, navigate]);

  useEffect(() => {
    // Fetch creator data when component mounts after status is verified
    if (!isCheckingStatus && user && user.role === "creator") {
      if (!profile) {
        dispatch(fetchCreatorProfile());
      }
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, profile, user, isCheckingStatus]);

  // Redirect to become creator page if fetching creator profile fails with 404
  useEffect(() => {
    if (error && error.includes("not found")) {
      navigate("/become-creator", { replace: true });
    }
  }, [error, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock notifications count
  const notificationsCount = 3;

  // Show loading state while checking creator status
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Verifying creator status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile?.businessName || "Creator Dashboard"}
              </h1>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 dark:text-white"
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 min-w-0">
                  {notificationsCount}
                </Badge>
              )}
            </Button>

            {/* Profile dropdown */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile?.businessName?.split(" ")[0] || "Seller"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {profile?.subscriptionPlan?.type || "Starter"} Plan
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/creator/settings")}
                className="p-2"
              >
                <Settings className="w-4 h-4 dark:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <CreatorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-0 transition-all duration-300">
          <div className="p-4 lg:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;
