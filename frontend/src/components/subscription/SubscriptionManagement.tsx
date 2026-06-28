import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Star,
  Clock,
  AlertTriangle,
  Settings,
  Download,
  X,
} from "lucide-react";

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status:
    | "active"
    | "inactive"
    | "canceled"
    | "past_due"
    | "unpaid"
    | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  cancelAtPeriodEnd: boolean;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="success">Active</Badge>;
    case "trialing":
      return <Badge variant="info">Trial</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "canceling":
      return <Badge variant="danger">Canceling</Badge>;
    case "canceled":
      return <Badge variant="danger">Canceled</Badge>;
    case "past_due":
      return <Badge variant="danger">Past Due</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const SubscriptionManagement: React.FC = () => {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "sub_1",
      planId: "plan_1",
      planName: "Creator Pro",
      status: "active",
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-02-01",
      price: 29.99,
      billingPeriod: "monthly",
      cancelAtPeriodEnd: false,
      creator: {
        id: "creator_1",
        name: "John Doe",
        email: "john@example.com",
      },
    },
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async (_subscriptionId: string) => {
    setLoading(true);
    try {
      // Cancel subscription logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async (_subscriptionId: string) => {
    setLoading(true);
    try {
      // Reactivate subscription logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (subscriptionId: string) => {
    // Download invoice logic here
    console.log("Downloading invoice for subscription:", subscriptionId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Subscription Management
        </h1>
        <p className="text-gray-600">
          Manage your active subscriptions and billing information
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No active subscriptions
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any active subscriptions at the moment.
          </p>
          <Button variant="primary">Browse Creator Plans</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => {
            const isActive = subscription.status === "active";
            const nextBilling = new Date(subscription.currentPeriodEnd);

            return (
              <Card key={subscription.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {subscription.planName}
                        </h3>
                        <p className="text-gray-600">
                          by {subscription.creator.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(subscription.status)}
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        ${subscription.price}
                        <span className="text-sm font-normal text-gray-600">
                          /
                          {subscription.billingPeriod === "monthly"
                            ? "month"
                            : "year"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Next billing date
                        </p>
                        <p className="text-sm text-gray-600">
                          {nextBilling.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Payment method
                        </p>
                        <p className="text-sm text-gray-600">
                          •••• •••• •••• 4242
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Total paid
                        </p>
                        <p className="text-sm text-gray-600">$89.97</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleDownloadInvoice(subscription.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>

                    <Button variant="secondary">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Plan
                    </Button>

                    {isActive ? (
                      subscription.cancelAtPeriodEnd ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleReactivateSubscription(subscription.id)
                          }
                          disabled={loading}
                        >
                          Reactivate Subscription
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={() => setShowCancelModal(true)}
                          disabled={loading}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel Subscription
                        </Button>
                      )
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>This subscription is not active</span>
                      </div>
                    )}
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-orange-500 mr-2" />
                        <p className="text-sm text-orange-800">
                          Your subscription will be canceled at the end of the
                          current billing period (
                          {nextBilling.toLocaleDateString()}).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Subscription
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll continue
              to have access until the end of your current billing period.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="danger"
                onClick={() => handleCancelSubscription(subscriptions[0]?.id)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Canceling..." : "Yes, Cancel"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="flex-1"
              >
                Keep Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
