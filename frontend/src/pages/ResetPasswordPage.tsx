import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Check if form is complete and passwords match
  const isFormComplete =
    password?.trim() &&
    confirmPassword?.trim() &&
    password === confirmPassword &&
    validatePassword(password) === true;
  const isValidToken = token && token.length > 10;

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock token expiration check (20% chance)
      if (Math.random() < 0.2) {
        setIsExpired(true);
        return;
      }

      console.log(
        "Password reset successful for:",
        email,
        "New password:",
        data.password,
      );
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function validatePassword(value: string) {
    const requirements = [
      { test: value.length >= 8, message: "At least 8 characters" },
      { test: /[A-Z]/.test(value), message: "One uppercase letter" },
      { test: /[a-z]/.test(value), message: "One lowercase letter" },
      { test: /\d/.test(value), message: "One number" },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        message: "One special character",
      },
    ];

    const failedRequirement = requirements.find((req) => !req.test);
    return failedRequirement ? failedRequirement.message : true;
  }

  // Invalid or missing token
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl flex items-center justify-center mb-5">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-900">
              Invalid Reset Link
            </h2>
            <p className="mt-4 text-gray-600">
              This password reset link is invalid or malformed.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="px-8 py-8 text-center">
            <div className="space-y-4">
              <Link to="/forgot-password">
                <Button variant="primary" fullWidth>
                  Request New Reset Link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Expired token
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl flex items-center justify-center mb-5">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-amber-900">Link Expired</h2>
            <p className="mt-4 text-gray-600">
              This password reset link has expired for security reasons.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="px-8 py-8 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                Reset links expire after 15 minutes to keep your account secure.
              </p>
            </div>
            <div className="space-y-4">
              <Link to="/forgot-password">
                <Button variant="primary" fullWidth>
                  Request New Reset Link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800/30 rounded-2xl flex items-center justify-center mb-5">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-900">
              Password Updated!
            </h2>
            <p className="mt-4 text-gray-600">
              Your password has been successfully updated.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="px-8 py-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                All Set!
              </h3>
              <p className="text-sm text-green-700">
                You can now sign in with your new password. You'll be redirected
                to the login page automatically.
              </p>
            </div>
            <Link to="/login">
              <Button
                variant="primary"
                fullWidth
                variant="primary"
              >
                Continue to Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 rounded-xl flex items-center justify-center mb-5">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Password
          </h2>
          <p className="mt-4 text-gray-600">
            {email && `Resetting password for ${email}`}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-8 py-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                fullWidth
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword,
                })}
              />

              {password && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-600 mb-2">
                    Password strength:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center ${
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      8+ characters
                    </div>
                    <div
                      className={`flex items-center ${
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uppercase
                    </div>
                    <div
                      className={`flex items-center ${
                        /[a-z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Lowercase
                    </div>
                    <div
                      className={`flex items-center ${
                        /\d/.test(password) ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Number
                    </div>
                    <div
                      className={`flex items-center ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Special char
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                fullWidth
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-primary-900">
                    Security Tips
                  </h3>
                  <ul className="text-sm text-primary-700 mt-1 space-y-1">
                    <li>• Use a unique password you haven't used before</li>
                    <li>• Consider using a password manager</li>
                    <li>• Don't share your password with anyone</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!isFormComplete}
            >
              {isFormComplete
                ? isLoading
                  ? "Updating Password..."
                  : "Update Password"
                : "↑ Passwords must match"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
