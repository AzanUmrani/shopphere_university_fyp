import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  MoreVertical,
  Download,
  Ban,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingNumber?: string;
}

const CreatorOrdersFilter: React.FC = () => {
  const { status } = useParams<{ status?: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
      },
      items: [
        {
          id: "1",
          name: "Wireless Headphones",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop",
          quantity: 1,
          price: 79.99,
        },
      ],
      total: 79.99,
      status: "pending",
      paymentStatus: "paid",
      createdAt: "2024-08-10",
      updatedAt: "2024-08-10",
      shippingAddress: "123 Main St, New York, NY 10001",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
      },
      items: [
        {
          id: "2",
          name: "Smart Watch",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
          quantity: 1,
          price: 299.99,
        },
      ],
      total: 299.99,
      status: "processing",
      paymentStatus: "paid",
      createdAt: "2024-08-11",
      updatedAt: "2024-08-11",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
      },
      items: [
        {
          id: "3",
          name: "Power Bank",
          image:
            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=60&h=60&fit=crop",
          quantity: 2,
          price: 39.99,
        },
      ],
      total: 79.98,
      status: "shipped",
      paymentStatus: "paid",
      createdAt: "2024-08-09",
      updatedAt: "2024-08-12",
      shippingAddress: "789 Pine St, Chicago, IL 60601",
      trackingNumber: "1Z999AA1234567890",
    },
  ];

  useEffect(() => {
    let filteredOrders = mockOrders;
    if (status && status !== "all") {
      filteredOrders = mockOrders.filter((order) => order.status === status);
    }
    setOrders(filteredOrders);
  }, [status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "shipped":
        return "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPageTitle = () => {
    switch (status) {
      case "pending":
        return "Pending Orders";
      case "processing":
        return "Processing Orders";
      case "shipped":
        return "Shipped Orders";
      case "delivered":
        return "Delivered Orders";
      case "cancelled":
        return "Cancelled Orders";
      default:
        return "All Orders";
    }
  };

  //   const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
  //     setOrders(
  //       orders.map((order) =>
  //         order.id === orderId
  //           ? {
  //               ...order,
  //               status: newStatus,
  //               updatedAt: new Date().toISOString().split("T")[0],
  //             }
  //           : order
  //       )
  //     );
  //   };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : order
      )
    );
    setActiveDropdown(null);
  };

  const viewOrderDetails = (orderId: string) => {
    console.log("View order details:", orderId);
    setActiveDropdown(null);
  };

  // Modal handlers
  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setActiveDropdown(null);
  };

  const confirmCancelOrder = () => {
    if (selectedOrderId) {
      updateOrderStatus(selectedOrderId, "cancelled");
    }
    setShowCancelModal(false);
    setSelectedOrderId(null);
  };

  const cancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const statusCounts = {
    all: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
    cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredOrders.length} orders found
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {[
            { key: "all", label: "All Orders", count: statusCounts.all },
            { key: "pending", label: "Pending", count: statusCounts.pending },
            {
              key: "processing",
              label: "Processing",
              count: statusCounts.processing,
            },
            { key: "shipped", label: "Shipped", count: statusCounts.shipped },
            {
              key: "delivered",
              label: "Delivered",
              count: statusCounts.delivered,
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: statusCounts.cancelled,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                (status || "all") === tab.key
                  ? "border-secondary-500 text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/20"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => {
                // In a real app, this would use router navigation
                window.history.replaceState(
                  null,
                  "",
                  `/creator/orders${tab.key !== "all" ? "/" + tab.key : ""}`
                );
                window.location.reload();
              }}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search orders by number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleOrderSelection(order.id)}
                  className="mt-1 rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </h3>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      <span className="font-medium">Customer:</span>{" "}
                      {order.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.customer.email}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.trackingNumber && (
                      <p>
                        <span className="font-medium">Tracking:</span>{" "}
                        {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewOrderDetails(order.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(
                          activeDropdown === order.id ? null : order.id
                        );
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {activeDropdown === order.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewOrderDetails(order.id);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "processing");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={order.status === "processing"}
                        >
                          <Package className="w-4 h-4" />
                          <span>Mark as Processing</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "shipped");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={
                            order.status === "shipped" ||
                            order.status === "delivered"
                          }
                        >
                          <Truck className="w-4 h-4" />
                          <span>Mark as Shipped</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "delivered");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          disabled={order.status === "delivered"}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Delivered</span>
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.id);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={
                            order.status === "cancelled" ||
                            order.status === "delivered"
                          }
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Cancel Order</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : `No ${status || "all"} orders to display`}
          </p>
        </Card>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cancel Order
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel this order? This action will
                notify the customer and may trigger an automatic refund if
                payment has been processed.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Keep Order
                </Button>
                <Button
                  onClick={confirmCancelOrder}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorOrdersFilter;
