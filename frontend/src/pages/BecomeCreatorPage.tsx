import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { checkCreatorStatus } from "../store/slices/creatorSlice";
import { updateUser } from "../store/slices/authSlice";
import {
  Star,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Check,
  Award,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const BecomeCreatorPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already a creator
    const verifyCreatorStatus = async () => {
      if (user) {
        try {
          const result = await dispatch(checkCreatorStatus()).unwrap();
          if (result.isCreator) {
            // Update user role in auth state
            dispatch(updateUser({ role: "creator" }));
            // Redirect to creator dashboard
            navigate("/creator/dashboard", { replace: true });
          }
        } catch (error) {
          console.error("Failed to check creator status:", error);
        }
      }
    };

    verifyCreatorStatus();
  }, [dispatch, user, navigate]);

  const benefits = [
    {
      icon: DollarSign,
      title: "Unlimited Earning Potential",
      description:
        "Keep 85-90% of your sales revenue. No limits on your earnings.",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Get detailed insights on sales, customers, and performance metrics.",
    },
    {
      icon: Users,
      title: "Global Marketplace",
      description:
        "Reach millions of customers worldwide with our marketing tools.",
    },
    {
      icon: Shield,
      title: "Creator Protection",
      description:
        "24/7 support, fraud protection, and secure payment processing.",
    },
    {
      icon: Zap,
      title: "Easy Setup",
      description:
        "Get your store online in minutes with our guided setup process.",
    },
    {
      icon: Globe,
      title: "Multi-Channel Sales",
      description: "Sell on our platform, social media, and your own website.",
    },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      commission: "10%",
      features: [
        "Up to 50 products",
        "Basic analytics",
        "Standard support",
        "Mobile app access",
        "Payment processing",
      ],
      recommended: false,
    },
    {
      id: "pro",
      name: "Professional",
      price: "$29/month",
      commission: "7%",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Marketing tools",
        "API access",
        "Bulk operations",
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99/month",
      commission: "5%",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solutions",
        "Advanced reporting",
        "SLA guarantee",
        "Custom training",
      ],
      recommended: false,
    },
  ];

  const stats = [
    { label: "Active Creators", value: "50K+", icon: Users },
    { label: "Monthly Sales", value: "$2.5M+", icon: DollarSign },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Avg. Monthly Earnings", value: "$3,500", icon: Award },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Creator",
      avatar: "SJ",
      testimonial:
        "I've grown my monthly income to $8,000 within 6 months. The platform is incredibly user-friendly!",
      rating: 5,
      sales: "$45K total sales",
    },
    {
      name: "Mike Chen",
      role: "Electronics Creator",
      avatar: "MC",
      testimonial:
        "Amazing analytics and customer support. The marketing tools helped me reach new customers.",
      rating: 5,
      sales: "$32K total sales",
    },
    {
      name: "Emma Rodriguez",
      role: "Home & Garden",
      avatar: "ER",
      testimonial:
        "The setup process was so simple. I was selling within hours of joining the platform.",
      rating: 5,
      sales: "$18K total sales",
    },
  ];

  const handleStartJourney = () => {
    navigate("/creator/onboarding");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Start Your Creator Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful creators who are building thriving
              businesses on our platform. Turn your passion into profit with our
              comprehensive creator tools.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 flex items-center justify-center mb-3">
                    <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleStartJourney}
            size="lg"
            size="lg"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide everything you need to build, grow, and scale your
              online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 flex items-center justify-center mb-5">
                  <benefit.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our core
              features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 relative bg-white dark:bg-gray-900 border shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  plan.recommended
                    ? "border-primary-500 ring-2 ring-primary-500/30 scale-105"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.commission} commission rate
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleStartJourney}
                  className={`w-full ${
                    plan.recommended
                      ? ""
                      : "bg-gray-900 dark:bg-white dark:text-gray-900"
                  }`}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from creators who have built successful businesses on our
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.testimonial}"
                </p>

                <div className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {testimonial.sales}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gray-950 dark:bg-black border-none shadow-sm">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Selling?
            </h2>
            <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our creator community today and start building your online
              business. No setup fees, no hidden costs - just your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartJourney}
                size="lg"
                className="!bg-white !text-gray-900 hover:!bg-gray-100"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                className="!bg-white !text-black hover:!bg-gray-100"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BecomeCreatorPage;
