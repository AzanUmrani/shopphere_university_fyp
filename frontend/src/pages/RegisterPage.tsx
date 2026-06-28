import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../hooks/redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../store/slices/authSlice";
import { authService } from "../services/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<RegisterFormData>();

  const handleGoogleSignupSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    dispatch(registerStart());
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
        dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
        navigate("/");
      } else {
        throw new Error(response.message || "Google signup failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google signup failed";
      dispatch(registerFailure(errorMessage));
      setError("email", { message: errorMessage });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: handleGoogleSignupSuccess,
    onError: () => {
      const errorMessage = "Google signup failed";
      dispatch(registerFailure(errorMessage));
      setError("email", { message: errorMessage });
      setIsGoogleLoading(false);
    },
  });

  const handleFacebookSignup = () => {
    const errorMessage = "Facebook signup is not configured yet";
    dispatch(registerFailure(errorMessage));
    setError("email", { message: errorMessage });
  };

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const acceptTermsValue = watch("acceptTerms");

  const isFormFilled =
    firstNameValue?.trim() &&
    lastNameValue?.trim() &&
    emailValue?.trim() &&
    phoneValue?.trim() &&
    passwordValue?.trim() &&
    confirmPasswordValue?.trim() &&
    acceptTermsValue === true;

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    dispatch(registerStart());
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        newsletter: data.newsletter,
        acceptTerms: data.acceptTerms,
      });
      if (response.success && response.data) {
        dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
        navigate("/");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      dispatch(registerFailure(errorMessage));
      if (error instanceof Error && error.message.includes("email")) {
        setError("email", { message: "This email is already registered" });
      } else {
        setError("email", { message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (value: string) => {
    const requirements = [
      { test: value.length >= 8, message: "At least 8 characters" },
      { test: /[A-Z]/.test(value), message: "One uppercase letter" },
      { test: /[a-z]/.test(value), message: "One lowercase letter" },
      { test: /\d/.test(value), message: "One number" },
    ];
    const failedRequirement = requirements.find((req) => !req.test);
    return failedRequirement ? failedRequirement.message : true;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2.5 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary-600 via-pink-600 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-secondary-600 via-pink-600 to-primary-600 bg-clip-text text-transparent">
            ShopSphere
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-8 py-8">
          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => googleSignup()}
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

            <button
              type="button"
              onClick={handleFacebookSignup}
              className="flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
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
                or sign up with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                type="text"
                autoComplete="given-name"
                fullWidth
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              <Input
                label="Last name"
                type="text"
                autoComplete="family-name"
                fullWidth
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
            </div>

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
              label="Phone number"
              type="tel"
              autoComplete="tel"
              fullWidth
              leftIcon={<Phone className="w-4 h-4 text-gray-400" />}
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^[+]?[\d\s\-()]+$/, message: "Invalid phone number" },
              })}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
                  validate: validatePassword,
                })}
              />

              {password && (
                <div className="mt-2.5 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { test: password.length >= 8, label: "8+ characters" },
                      { test: /[A-Z]/.test(password), label: "Uppercase" },
                      { test: /[a-z]/.test(password), label: "Lowercase" },
                      { test: /\d/.test(password), label: "Number" },
                    ].map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-1.5 ${req.test ? "text-secondary-600 dark:text-secondary-400" : "text-gray-400 dark:text-gray-500"}`}
                      >
                        <Check className="w-3 h-3 flex-shrink-0" />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <input
                  id="accept-terms"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  {...register("acceptTerms", { required: "You must accept the terms and conditions" })}
                />
                <label htmlFor="accept-terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Privacy Policy
                  </a>
                  {errors.acceptTerms && (
                    <span className="block text-red-500 mt-0.5">{errors.acceptTerms.message}</span>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="newsletter"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  {...register("newsletter")}
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600 dark:text-gray-400">
                  Subscribe to newsletter for exclusive offers
                </label>
              </div>
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
                    Create account
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

export default RegisterPage;
