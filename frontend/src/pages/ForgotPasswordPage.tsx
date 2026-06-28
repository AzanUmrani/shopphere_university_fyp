import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<ForgotPasswordFormData>();

  const emailValue = watch("email");
  const isFormComplete = emailValue?.trim();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      console.log("Password reset requested for:", data.email);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              We've sent a reset link to <strong className="text-gray-700 dark:text-gray-300">{getValues("email")}</strong>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="px-8 py-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="space-y-5">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Next Steps</h3>
                </div>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-none">
                  <li>1. Check your email inbox and spam folder</li>
                  <li>2. Click the reset link within 15 minutes</li>
                  <li>3. Create a new secure password</li>
                  <li>4. Sign in with your new credentials</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" fullWidth>
                  Try Different Email
                </Button>
                <Link to="/login">
                  <Button variant="primary" fullWidth>
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to Login
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-8 py-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              fullWidth
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your email address"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-300">Security Notice</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    The reset link expires in 15 minutes. Check your spam folder.
                  </p>
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
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Login
            </Link>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Contact Support
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
