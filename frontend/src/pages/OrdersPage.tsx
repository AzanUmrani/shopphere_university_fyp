import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Download,
  ArrowRight,
  Search,
  RotateCcw,
  MessageCircle,
  Calendar,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  canReview: boolean;
}

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2025-001234",
      date: "2025-01-20",
      status: "delivered",
      total: 299.98,
      deliveredDate: "2025-01-25",
      canReview: true,
      items: [
        {
          id: "1",
          productId: "1",
          name: "Premium Wireless Headphones",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
          price: 199.99,
          quantity: 1,
        },
        {
          id: "2",
          productId: "2",
          name: "Smart Fitness Watch",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
          price: 99.99,
          quantity: 1,
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      trackingNumber: "1Z999AA1234567890",
    },
    {
      id: "2",
      orderNumber: "ORD-2025-001235",
      date: "2025-01-28",
      status: "shipped",
      total: 149.99,
      estimatedDelivery: "2025-02-05",
      canReview: false,
      items: [
        {
          id: "3",
          productId: "3",
          name: "Organic Cotton T-Shirt",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
          price: 29.99,
          quantity: 5,
          variant: "Blue, Size M",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      trackingNumber: "1Z999AA1234567891",
    },
    {
      id: "3",
      orderNumber: "ORD-2025-001236",
      date: "2025-02-01",
      status: "processing",
      total: 79.99,
      estimatedDelivery: "2025-02-08",
      canReview: false,
      items: [
        {
          id: "4",
          productId: "4",
          name: "Wireless Charging Pad",
          image:
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
          price: 79.99,
          quantity: 1,
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-primary-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-secondary-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <RotateCcw className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50";
      case "processing":
        return "bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50";
      case "shipped":
        return "bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-400 dark:border-secondary-800/50";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const orderStats = {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
    canReview: mockOrders.filter((o) => o.canReview).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Orders</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Track your purchases and leave reviews
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{orderStats.total}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{orderStats.canReview}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Ready to Review</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", count: orderStats.total },
                { id: "pending", label: "Pending", count: orderStats.pending },
                { id: "processing", label: "Processing", count: orderStats.processing },
                { id: "shipped", label: "Shipped", count: orderStats.shipped },
                { id: "delivered", label: "Delivered", count: orderStats.delivered },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
              No Orders Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {searchTerm
                ? "No orders match your search criteria."
                : "You haven't placed any orders yet."}
            </p>
            <Link to="/products">
              <Button size="sm">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Ordered: {new Date(order.date).toLocaleDateString()}
                        </div>
                        {order.deliveredDate && (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            Delivered:{" "}
                            {new Date(order.deliveredDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.variant}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price.toFixed(2)} each</span>
                        </div>
                      </div>

                      {order.canReview && order.status === "delivered" && (
                        <Link to={`/reviews/${item.productId}/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Star className="w-3.5 h-3.5 mr-1" />
                            Write Review
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {order.trackingNumber && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Truck className="w-4 h-4 mr-1 text-secondary-500" />
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                    {order.estimatedDelivery &&
                      order.status !== "delivered" && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1 text-primary-500" />
                          Est. Delivery:{" "}
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Invoice
                    </Button>
                    {order.status === "delivered" && order.canReview && (
                      <Link
                        to={`/reviews/${order.items[0].productId}/${order.id}`}
                        className="w-full md:w-auto"
                      >
                        <Button size="sm" className="w-full">
                          <MessageCircle className="w-3.5 h-3.5 mr-1" />
                          Leave Reviews
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mt-8 text-center">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
            Need Help with Your Order?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/support">
              <Button size="sm">
                Contact Support
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link to="/help-center">
              <Button size="sm" variant="outline">
                Visit Help Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
