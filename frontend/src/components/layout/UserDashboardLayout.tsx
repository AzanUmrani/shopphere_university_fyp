import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  MessageCircle,
  Star,
  MapPin,
  Shield,
  Truck,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { authService } from "../../services/auth";

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout API
      await authService.logout();
      // Clear Redux state
      dispatch(logout());
      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      dispatch(logout());
      navigate("/");
    }
  };

  const sidebarItems = [
    {
      group: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/user/dashboard",
          icon: Home,
        },
      ],
    },
    {
      group: "Account",
      items: [
        {
          label: "Profile",
          path: "/user/profile",
          icon: User,
        },
        {
          label: "Addresses",
          path: "/user/addresses",
          icon: MapPin,
        },
        {
          label: "Security",
          path: "/user/security",
          icon: Shield,
        },
      ],
    },
    {
      group: "Shopping",
      items: [
        {
          label: "Orders",
          path: "/user/orders",
          icon: Package,
        },
        {
          label: "Wishlist",
          path: "/user/wishlist",
          icon: Heart,
        },
        {
          label: "Reviews",
          path: "/user/reviews",
          icon: Star,
        },
        {
          label: "Returns",
          path: "/user/returns",
          icon: Truck,
        },
      ],
    },
    {
      group: "Communication",
      items: [
        {
          label: "Messages",
          path: "/user/messages",
          icon: MessageCircle,
        },
        {
          label: "Notifications",
          path: "/user/notifications",
          icon: Bell,
        },
      ],
    },
    {
      group: "Payment",
      items: [
        {
          label: "Payment Methods",
          path: "/user/payment-methods",
          icon: CreditCard,
        },
      ],
    },
    {
      group: "Support",
      items: [
        {
          label: "Help Center",
          path: "/user/help",
          icon: HelpCircle,
        },
        {
          label: "Settings",
          path: "/user/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-pink-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {user?.firstName || "User"} {user?.lastName || ""}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {sidebarItems.map((group) => (
            <div key={group.group} className="mb-8">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-secondary-100 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page Title - will be set by individual pages */}
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white lg:ml-0 ml-4">
                  User Dashboard
                </h1>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/cart"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white relative"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {/* Cart badge - you can add cart item count here */}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </NavLink>

                <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white relative">
                  <Bell className="w-6 h-6" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
