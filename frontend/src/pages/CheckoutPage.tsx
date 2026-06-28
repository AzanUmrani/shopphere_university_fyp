import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  Package,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { CheckoutPromoAd } from "../components/ads/AdComponents";
import { addToast } from "../store/slices/toastSlice";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: "standard" | "express" | "overnight";
  saveInfo: boolean;
  newsletter: boolean;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      shippingMethod: "standard",
      country: "United States",
    },
  });

  const shippingMethod = watch("shippingMethod");

  const shippingCosts = {
    standard: 0,
    express: 15,
    overnight: 35,
  };

  const subtotal = total;
  const shipping = shippingCosts[shippingMethod];
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  const handleNextStep = async () => {
    const isStep1Valid = await trigger(["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async () => {
    setIsProcessing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

      const response = await fetch(`${apiUrl}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: items,
          shippingCost: shipping,
          taxAmount: tax,
          shippingName:
            shippingMethod.charAt(0).toUpperCase() +
            shippingMethod.slice(1) +
            " Shipping",
        }),
      });

      const session = await response.json();

      if (!response.ok || !session.url) {
        throw new Error(session.error || "Failed to create checkout session");
      }

      window.location.assign(session.url);
    } catch (error: any) {
      console.error("❌ [CHECKOUT] Error:", error.message);
      dispatch(
        addToast({
          type: "error",
          title: "Payment Error",
          message: error.message,
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Add some products to your cart before checkout.
          </p>
          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Shipping", icon: MapPin },
    { number: 2, title: "Review & Pay", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Checkout</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {items.length} item{items.length > 1 ? "s" : ""} in your order
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : isCompleted
                          ? "bg-secondary-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`mt-1.5 text-xs font-medium ${
                        isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mb-5 ${
                        isCompleted ? "bg-secondary-500" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 ? (
                <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name*"
                      fullWidth
                      {...register("firstName", { required: "Required" })}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Last Name*"
                      fullWidth
                      {...register("lastName", { required: "Required" })}
                      error={errors.lastName?.message}
                    />
                    <Input
                      label="Email*"
                      type="email"
                      fullWidth
                      {...register("email", { required: "Required" })}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Phone*"
                      type="tel"
                      fullWidth
                      {...register("phone", { required: "Required" })}
                      error={errors.phone?.message}
                    />
                  </div>
                  <div className="mt-4 space-y-4">
                    <Input
                      label="Street Address*"
                      fullWidth
                      {...register("address", { required: "Required" })}
                      error={errors.address?.message}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City*"
                        fullWidth
                        {...register("city", { required: "Required" })}
                        error={errors.city?.message}
                      />
                      <Input
                        label="State*"
                        fullWidth
                        {...register("state", { required: "Required" })}
                        error={errors.state?.message}
                      />
                      <Input
                        label="ZIP Code*"
                        fullWidth
                        {...register("zipCode", { required: "Required" })}
                        error={errors.zipCode?.message}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="button" onClick={handleNextStep}>
                      Review Order
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <Check className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    Review Order
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white flex-shrink-0">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" loading={isProcessing}>
                      {isProcessing ? "Redirecting..." : "Pay Now"}
                      <ShieldCheck className="ml-1.5 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <CheckoutPromoAd />
              <Card className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm sticky top-20">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? "text-secondary-600 dark:text-secondary-400" : "text-gray-900 dark:text-white"}`}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white text-base">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-900/30 rounded-xl">
                  <div className="flex items-center gap-2 text-secondary-700 dark:text-secondary-400">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">Secure 256-bit SSL Encryption</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
