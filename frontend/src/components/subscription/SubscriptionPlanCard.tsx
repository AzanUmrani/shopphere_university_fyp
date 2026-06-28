import React, { useState } from 'react';
import { Check, Star, Users } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  maxSubscribers?: number;
  subscriberCount?: number;
  isActive: boolean;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSubscribed?: boolean;
  onSubscribe?: (planId: string) => void;
  loading?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  isSubscribed = false,
  onSubscribe,
  loading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const isPopular = plan.subscriberCount && plan.subscriberCount > 50;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative transition-all duration-300 bg-white rounded-lg border shadow-lg p-6 ${
        isHovered ? 'transform -translate-y-2 shadow-xl' : ''
      } ${isPopular ? 'border-secondary-500 border-2' : 'border-gray-200'}`}>
        
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm">{plan.description}</p>
          
          {/* Price */}
          <div className="mt-4">
            <div className="text-3xl font-bold text-secondary-600">
              {formatPrice(plan.price, plan.currency)}
            </div>
            <div className="text-gray-500 text-sm">
              per {plan.billingPeriod}
            </div>
          </div>

          {/* Subscriber Count */}
          {plan.subscriberCount !== undefined && (
            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {plan.subscriberCount} subscribers
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {plan.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
            {plan.features.length > 5 && (
              <li className="text-sm text-gray-500 ml-6">
                +{plan.features.length - 5} more features
              </li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {isSubscribed ? (
            <button
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 cursor-not-allowed"
              disabled
            >
              ✓ Already Subscribed
            </button>
          ) : (
            <button
              onClick={() => onSubscribe?.(plan.id)}
              className="w-full px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading || !plan.isActive}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          )}

          {!plan.isActive && (
            <p className="text-sm text-red-600 text-center">
              This plan is currently unavailable
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for displaying no plans available
const NoPlansAvailable: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Star className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No subscription plans available
      </h3>
      <p className="text-gray-600">
        Check back later for new subscription options.
      </p>
    </div>
  );
};

// Grid component for displaying multiple plans
interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  userSubscriptions?: string[];
  onSubscribe?: (planId: string) => void;
  loading?: boolean;
}

const SubscriptionPlansGrid: React.FC<SubscriptionPlansGridProps> = ({
  plans,
  userSubscriptions = [],
  onSubscribe,
  loading = false,
}) => {
  if (plans.length === 0) {
    return <NoPlansAvailable />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          isSubscribed={userSubscriptions.includes(plan.id)}
          onSubscribe={onSubscribe}
          loading={loading}
        />
      ))}
    </div>
  );
};

// Featured plan component for highlighting a specific plan
interface FeaturedPlanProps {
  plan: SubscriptionPlan;
  onSubscribe?: (planId: string) => void;
}

const FeaturedPlan: React.FC<FeaturedPlanProps> = ({ plan, onSubscribe }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative overflow-hidden border-2 border-primary-500 shadow-lg bg-white rounded-lg">
        <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm font-medium">
          Featured
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-gray-600">{plan.description}</p>

            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: plan.currency.toUpperCase(),
                }).format(plan.price)}
              </div>
              <div className="text-gray-600">
                per {plan.billingPeriod === 'monthly' ? 'month' : 'year'}
              </div>
            </div>

            <button
              onClick={() => onSubscribe?.(plan.id)}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-lg transition-colors"
            >
              Get Started Today
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-sm text-gray-500 ml-6">
                    +{plan.features.length - 5} more features
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Creator:</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {plan.creator.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{plan.creator.name}</p>
                  <p className="text-sm text-gray-600">{plan.creator.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SubscriptionPlanCard, SubscriptionPlansGrid, FeaturedPlan, NoPlansAvailable };
export default SubscriptionPlanCard;
