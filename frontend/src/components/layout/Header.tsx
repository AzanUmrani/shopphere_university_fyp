import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Menu,
  X,
  LogOut,
  Package,
  Settings,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { authService } from "../../services/auth";
import { CartDropdown } from "../cart";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import ThemeToggle from "../ui/ThemeToggle";
import Avatar from "../ui/Avatar";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      setUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      setUserMenuOpen(false);
      navigate("/");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchModalOpen(false);
    }
  };

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img
                src="/shopsphere-logo.svg"
                alt="ShopSphere logo"
                className="w-9 h-9 rounded-lg bg-white/10"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 via-pink-600 to-primary-600 bg-clip-text text-transparent tracking-tight">
                  ShopSphere
                </span>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-0.5">
                  Premium Collection
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 dark:focus:border-primary-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-150"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/products"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Products
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.1rem] h-4 flex items-center justify-center text-[10px] border-2 border-white dark:border-gray-900"
                >
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <CartDropdown />

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Avatar
                    src={user?.avatar}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    size="md"
                    debug={true}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Profile Settings
                    </Link>
                    {user?.role === "creator" ? (
                      <Link
                        to="/creator/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-l-2 border-primary-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-3" />
                        Creator Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/become-creator"
                        className="flex items-center px-4 py-2.5 text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-l-2 border-primary-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Sparkles className="h-4 w-4 mr-3" />
                        Become a Creator
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-3 text-gray-400" />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-1">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile: Search + Menu */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              onClick={openSearchModal}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/products"
              className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors font-medium"
              onClick={toggleMobileMenu}
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                {user?.role === "creator" ? (
                  <Link
                    to="/creator/dashboard"
                    className="block px-3 py-2.5 text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border-l-2 border-primary-500 pl-4"
                    onClick={toggleMobileMenu}
                  >
                    Creator Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/become-creator"
                    className="block px-3 py-2.5 text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border-l-2 border-primary-500 pl-4"
                    onClick={toggleMobileMenu}
                  >
                    Become a Creator
                  </Link>
                )}
                <Link
                  to="/wishlist"
                  className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2.5 text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* Search Modal for Mobile */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setSearchModalOpen(false)}>
          <div className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                autoFocus
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
