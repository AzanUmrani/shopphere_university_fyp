// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Suspense, useEffect } from "react";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import { store } from "./store";
// import type { RootState } from "./store";
// import Layout from "./components/layout/Layout";
// import CreatorLayout from "./components/creator/CreatorLayout";
// import UserDashboardLayout from "./components/layout/UserDashboardLayout";
// import { routes } from "./config/routes";
// import { ToastContainer } from "./components/ui/ToastContainer";
// import { useAuthInit } from "./hooks/useAuthInit";
// import ErrorBoundary from "./components/ui/ErrorBoundary";
// import { updateAutoTheme } from "./store/slices/themeSlice";
// import webSocketService from "./services/websocket"; // Import for manual sync if needed

// const LoadingSpinner = () => (
//   <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-pink-50 to-primary-50 dark:from-gray-900 dark:via-secondary-900 dark:to-gray-900 flex items-center justify-center">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 dark:border-secondary-400"></div>
//   </div>
// );

// const AppContent = () => {
//   const dispatch = useDispatch();

//   const { theme, effectiveTheme } = useSelector((state: RootState) => state.theme);
//   const { token } = useSelector((state: RootState) => state.auth); // Grab token to monitor auth state

//   useAuthInit();

//   // WebSocket Connection Sync
//   // This replaces the logic that was previously inside your Context Provider
//   useEffect(() => {
//     if (token) {
//       webSocketService.updateAuthToken(token);
//     } else {
//       webSocketService.disconnect();
//     }
//   }, [token]);

//   // Theme Sync Logic
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove("light", "dark");
//     root.classList.add(effectiveTheme);

//     const metaThemeColor = document.querySelector('meta[name="theme-color"]');
//     if (metaThemeColor) {
//       metaThemeColor.setAttribute(
//         "content",
//         effectiveTheme === "dark" ? "#1f2937" : "#ffffff"
//       );
//     }
//   }, [effectiveTheme]);

//   // System Preference Listener
//   useEffect(() => {
//     if (theme === "auto") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       const handleChange = () => dispatch(updateAutoTheme());

//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }
//   }, [theme, dispatch]);

//   // Route Filtering
//   const creatorRoutes = routes.filter((route) => route.layout === "creator");
//   const userRoutes = routes.filter((route) => route.layout === "user");
//   const regularRoutes = routes.filter(
//     (route) => !route.layout || (route.layout !== "creator" && route.layout !== "user")
//   );

//   return (
//     <Router>
//       <ToastContainer />

//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//         <Suspense fallback={<LoadingSpinner />}>
//           <Routes>
//             {/* Regular routes */}
//             {regularRoutes.map(({ path, element: Component }) => (
//               <Route
//                 key={path}
//                 path={path}
//                 element={
//                   <Layout>
//                     <ErrorBoundary>
//                       {Component ? <Component /> : null}
//                     </ErrorBoundary>
//                   </Layout>
//                 }
//               />
//             ))}

//             {/* Creator Dashboard routes */}
//             <Route path="/creator/*" element={<CreatorLayout />}>
//               {creatorRoutes.map(({ path, element: Component }) => {
//                 const nestedPath = path.replace("/creator", "").replace(/^\//, "") || "index";
//                 return (
//                   <Route
//                     key={path}
//                     path={nestedPath}
//                     element={
//                       <ErrorBoundary>
//                         {Component ? <Component /> : null}
//                       </ErrorBoundary>
//                     }
//                   />
//                 );
//               })}
//             </Route>

//             {/* User Dashboard routes */}
//             <Route path="/user/*" element={<UserDashboardLayout />}>
//               {userRoutes.map(({ path, element: Component }) => {
//                 const nestedPath = path.replace("/user", "").replace(/^\//, "") || "dashboard";
//                 return (
//                   <Route
//                     key={path}
//                     path={nestedPath}
//                     element={
//                       <ErrorBoundary>
//                         {Component ? <Component /> : null}
//                       </ErrorBoundary>
//                     }
//                   />
//                 );
//               })}
//             </Route>
//           </Routes>
//         </Suspense>
//       </div>
//     </Router>
//   );
// };

// function App() {
//   return (
//     <ErrorBoundary>
//       <Provider store={store}>
//           <AppContent />
//       </Provider>
//     </ErrorBoundary>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store";
import type { RootState } from "./store";
import Layout from "./components/layout/Layout";
import CreatorLayout from "./components/creator/CreatorLayout";
import UserDashboardLayout from "./components/layout/UserDashboardLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ScrollToTop from "./components/routing/ScrollToTop";
import { routes } from "./config/routes";
import { ToastContainer } from "./components/ui/ToastContainer";
import { useAuthInit } from "./hooks/useAuthInit";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { updateAutoTheme } from "./store/slices/themeSlice";
import webSocketService from "./services/websocket";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
  </div>
);

const isLikelyJwt = (value: string): boolean => {
  const tokenParts = value.split(".");
  return tokenParts.length === 3 && tokenParts.every((part) => part.length > 0);
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { theme, effectiveTheme } = useSelector(
    (state: RootState) => state.theme,
  );
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useAuthInit();

  // Only connect sockets for authenticated users with a JWT token.
  useEffect(() => {
    const authToken = token || localStorage.getItem("authToken");

    if (isAuthenticated && authToken && isLikelyJwt(authToken)) {
      webSocketService.connect(authToken);
    } else {
      webSocketService.disconnect();

      if (authToken && !isLikelyJwt(authToken)) {
        console.warn(
          "Skipping WebSocket connection because auth token is not a valid JWT format.",
        );
      }
    }
  }, [token, isAuthenticated]);

  // --- Theme Logic ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => dispatch(updateAutoTheme());
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, dispatch]);

  const creatorRoutes = routes.filter((route) => route.layout === "creator");
  const userRoutes = routes.filter((route) => route.layout === "user");
  const regularRoutes = routes.filter(
    (route) =>
      !route.layout || (route.layout !== "creator" && route.layout !== "user"),
  );

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Regular routes */}
            {regularRoutes.map(({ path, element: Component, requiresAuth }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Layout>
                    <ErrorBoundary>
                      {requiresAuth ? (
                        <ProtectedRoute requiresAuth={requiresAuth}>
                          {Component ? <Component /> : null}
                        </ProtectedRoute>
                      ) : Component ? (
                        <Component />
                      ) : null}
                    </ErrorBoundary>
                  </Layout>
                }
              />
            ))}

            {/* Creator Dashboard routes - All require authentication and creator role */}
            <Route
              path="/creator/*"
              element={
                <ProtectedRoute requiresAuth={true}>
                  <CreatorLayout />
                </ProtectedRoute>
              }
            >
              {creatorRoutes.map(({ path, element: Component }) => (
                <Route
                  key={path}
                  path={
                    path.replace("/creator", "").replace(/^\//, "") || "index"
                  }
                  element={
                    <ErrorBoundary>
                      {Component ? <Component /> : null}
                    </ErrorBoundary>
                  }
                />
              ))}
            </Route>

            {/* User Dashboard routes - All require authentication */}
            <Route
              path="/user/*"
              element={
                <ProtectedRoute requiresAuth={true}>
                  <UserDashboardLayout />
                </ProtectedRoute>
              }
            >
              {userRoutes.map(({ path, element: Component }) => (
                <Route
                  key={path}
                  path={
                    path.replace("/user", "").replace(/^\//, "") || "dashboard"
                  }
                  element={
                    <ErrorBoundary>
                      {Component ? <Component /> : null}
                    </ErrorBoundary>
                  }
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
