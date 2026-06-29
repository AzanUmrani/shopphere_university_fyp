import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../hooks/redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUser,
} from "../store/slices/authSlice";
import { checkCreatorStatus } from "../store/slices/creatorSlice";
import { authService } from "../services/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const isFormFilled = emailValue?.trim() && passwordValue?.trim();

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    dispatch(loginStart());
    try {
      console.log("google response:", credentialResponse);
      let profile: any = null;
      if (credentialResponse.credential) {
        const token = credentialResponse.credential;
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid Google authentication token format");
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload: string;
        try {
          jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
        } catch {
          throw new Error("Failed to decode Google authentication token");
        }
        profile = JSON.parse(jsonPayload);
      } else if ((credentialResponse as any).access_token) {
        const accessToken = (credentialResponse as any).access_token;
        const profileResp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!profileResp.ok) throw new Error("Failed to fetch Google profile");
        profile = await profileResp.json();
      } else {
        throw new Error("Google authentication returned no credential. Please try again.");
      }
      if (!profile || !profile.sub || !profile.email) throw new Error("Missing required Google authentication data");
      const response = await authService.googleLogin({
        id: profile.sub,
        email: profile.email,
        name: profile.name || "Google User",
        picture: profile.picture,
      });
      if (response.success && response.data) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        try {
          const creatorStatus: any = await dispatch(checkCreatorStatus()).unwrap();
          if (creatorStatus.isCreator && creatorStatus.role === "creator") {
            dispatch(updateUser({ role: "creator" }));
          }
        } catch (error) {
          console.log("Creator status check skipped:", error);
        }
        navigate("/");
      } else {
        throw new Error(response.message || "Google login failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed";
      dispatch(loginFailure(errorMessage));
      setError("email", { message: errorMessage });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      const errorMessage = "Google login failed";
      dispatch(loginFailure(errorMessage));
      setError("email", { message: errorMessage });
      setIsGoogleLoading(false);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    dispatch(loginStart());
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      if (response.success && response.data) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        try {
          const creatorStatus: any = await dispatch(checkCreatorStatus()).unwrap();
          if (creatorStatus.isCreator && creatorStatus.role === "creator") {
            dispatch(updateUser({ role: "creator" }));
          }
        } catch (error) {
          console.log("Creator status check skipped:", error);
        }
        navigate("/");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      dispatch(loginFailure(errorMessage));
      setError("email", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.16),_transparent_30%),linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#eef2ff_100%)] px-4 py-12 transition-colors duration-200 dark:bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.2),_transparent_30%),linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#111827_100%)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-0 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary-200/40 blur-3xl dark:bg-secondary-900/20" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="group mb-8 flex items-center justify-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-600 via-pink-600 to-primary-600 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-secondary-600 via-pink-600 to-primary-600 bg-clip-text text-transparent">
            ShopSphere
          </span>
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue shopping, track orders, and enjoy a faster checkout experience.
          </p>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-[28px] border border-white/70 bg-white/90 px-8 py-8 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.30)] backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-900/90">
          <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50/80 p-3 text-sm text-primary-700 dark:border-primary-900/40 dark:bg-primary-950/40 dark:text-primary-300">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="h-4 w-4" />
              Secure, fast, and personalized checkout
            </div>
          </div>
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={isGoogleLoading}
              className="flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Google
            </button>

            <button className="flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              fullWidth
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  {...register("rememberMe")}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {isFormFilled && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mt-2"
              >
                {!isLoading && (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
