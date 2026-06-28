import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Edit,
  RotateCcw,
  Ban,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { fetchCreatorOrders } from "../../store/slices/creatorSlice";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    orderNumber: "#ORD-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1-555-0123",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        productName: "Premium Wireless Headphones",
        quantity: 1,
        price: 299.99,
        image: "/api/placeholder/80/80",
      },
    ],
    subtotal: 299.99,
    tax: 24.0,
    shipping: 9.99,
    total: 333.98,
    status: "pending",
    fulfillmentStatus: "pending",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    shippingAddress: {
      firstName: "John",
      lastName: "Smith",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1-555-0123",
    },
    createdAt: "2024-02-10T10:30:00Z",
    updatedAt: "2024-02-10T10:30:00Z",
    commission: 15.0,
    creatorEarnings: 284.99,
    platformFee: 15.0,
    processingFee: 4.99,
    trackingNumber: null,
    estimatedDelivery: "2024-02-15T00:00:00Z",
    notes: "Customer requested expedited processing",
  },
  {
    id: "ORD-002",
    orderNumber: "#ORD-002",
    customerId: "CUST-002",
    customerName: "Emma Wilson",
    customerEmail: "emma.wilson@email.com",
    customerPhone: "+1-555-0124",
    items: [
      {
        id: "item-2",
        productId: "prod-2",
        productName: "Smart Watch Series X",
        quantity: 1,
        price: 199.99,
        image: "/api/placeholder/80/80",
      },
      {
        id: "item-3",
        productId: "prod-4",
        productName: "Laptop Stand Adjustable",
        quantity: 2,
        price: 49.99,
        image: "/api/placeholder/80/80",
      },
    ],
    subtotal: 299.97,
    tax: 24.0,
    shipping: 0.0,
    total: 323.97,
    status: "processing",
    fulfillmentStatus: "processing",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    shippingAddress: {
      firstName: "Emma",
      lastName: "Wilson",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
      phone: "+1-555-0124",
    },
    createdAt: "2024-02-09T14:20:00Z",
    updatedAt: "2024-02-10T09:15:00Z",
    commission: 16.2,
    creatorEarnings: 278.77,
    platformFee: 16.2,
    processingFee: 4.85,
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-02-14T00:00:00Z",
    notes: null,
  },
  {
    id: "ORD-003",
    orderNumber: "#ORD-003",
    customerId: "CUST-003",
    customerName: "Michael Brown",
    customerEmail: "michael.brown@email.com",
    customerPhone: "+1-555-0125",
    items: [
      {
        id: "item-4",
        productId: "prod-1",
        productName: "Premium Wireless Headphones",
        quantity: 2,
        price: 299.99,
        image: "/api/placeholder/80/80",
      },
    ],
    subtotal: 599.98,
    tax: 48.0,
    shipping: 0.0,
    total: 647.98,
    status: "shipped",
    fulfillmentStatus: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    shippingAddress: {
      firstName: "Michael",
      lastName: "Brown",
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      phone: "+1-555-0125",
    },
    createdAt: "2024-02-08T16:45:00Z",
    updatedAt: "2024-02-09T11:30:00Z",
    commission: 32.4,
    creatorEarnings: 567.58,
    platformFee: 32.4,
    processingFee: 9.72,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-02-13T00:00:00Z",
    notes: "Express shipping requested",
  },
  {
    id: "ORD-004",
    orderNumber: "#ORD-004",
    customerId: "CUST-004",
    customerName: "Sarah Davis",
    customerEmail: "sarah.davis@email.com",
    customerPhone: "+1-555-0126",
    items: [
      {
        id: "item-5",
        productId: "prod-3",
        productName: "Bluetooth Speaker Pro",
        quantity: 1,
        price: 89.99,
        image: "/api/placeholder/80/80",
      },
    ],
    subtotal: 89.99,
    tax: 7.2,
    shipping: 5.99,
    total: 103.18,
    status: "delivered",
    fulfillmentStatus: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay",
    shippingAddress: {
      firstName: "Sarah",
      lastName: "Davis",
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
      phone: "+1-555-0126",
    },
    createdAt: "2024-02-05T12:00:00Z",
    updatedAt: "2024-02-08T16:00:00Z",
    commission: 4.5,
    creatorEarnings: 84.49,
    platformFee: 4.5,
    processingFee: 1.55,
    trackingNumber: "TRK456789123",
    estimatedDelivery: "2024-02-10T00:00:00Z",
    notes: null,
  },
];

const CreatorOrders = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.creator);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCreatorOrders({ limit: 10 }));
  }, [dispatch]);

  // Use mock data for now
  const displayOrders = mockOrders;

  const filteredOrders = displayOrders.filter((order) => {
    if (
      searchQuery &&
      !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedStatus !== "all" && order.status !== selectedStatus) {
      return false;
    }
    if (
      selectedPaymentStatus !== "all" &&
      order.paymentStatus !== selectedPaymentStatus
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "processing":
        return <Badge variant="info">Processing</Badge>;
      case "shipped":
        return <Badge variant="primary">Shipped</Badge>;
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      case "returned":
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Dropdown action handlers
  const handleViewOrder = (orderId: string) => {
    const order = displayOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
    setActiveDropdown(null);
  };

  const handleUpdateStatus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowUpdateStatusModal(true);
    setActiveDropdown(null);
  };

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setActiveDropdown(null);
  };

  const handleRefundOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowRefundModal(true);
    setActiveDropdown(null);
  };

  // Confirm actions
  const confirmCancel = () => {
    console.log("Cancelling order:", selectedOrderId);
    // In a real app, this would cancel the order
    setShowCancelModal(false);
    setSelectedOrderId(null);
  };

  const confirmRefund = () => {
    console.log("Refunding order:", selectedOrderId);
    // In a real app, this would process refund
    setShowRefundModal(false);
    setSelectedOrderId(null);
  };

  const confirmUpdateStatus = () => {
    console.log("Updating order status:", selectedOrderId);
    // In a real app, this would update order status
    setShowUpdateStatusModal(false);
    setSelectedOrderId(null);
  };

  const cancelModal = () => {
    setShowCancelModal(false);
    setShowRefundModal(false);
    setShowUpdateStatusModal(false);
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

  const OrderDetailsModal = ({
    order,
    onClose,
  }: {
    order: any;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <p className="text-gray-600">{order.orderNumber}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.customerName}
                    </p>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Mail className="w-4 h-4 mr-1" />
                      {order.customerEmail}
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.customerPhone}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="w-4 h-4 mr-1" />
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${item.price * item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Status */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Order Status:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <Badge
                      variant={
                        order.paymentStatus === "paid" ? "success" : "warning"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="text-gray-600 text-sm">Tracking Number:</p>
                      <p className="font-mono text-sm font-medium">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>${order.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>${order.shipping}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${order.total}</span>
                  </div>
                  <hr />
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>-${order.platformFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>-${order.processingFee}</span>
                    </div>
                    <div className="flex justify-between font-medium text-green-600">
                      <span>Your Earnings:</span>
                      <span>${order.creatorEarnings}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={
                      order.status === "delivered" ||
                      order.status === "cancelled"
                    }
                  >
                    Update Status
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Print Invoice
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Contact Customer
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track your customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayOrders.filter((o) => o.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending Orders
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayOrders.filter((o) => o.status === "processing").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Processing
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayOrders.filter((o) => o.status === "shipped").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shipped
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayOrders.filter((o) => o.status === "delivered").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Delivered
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers..."
              className="w-full sm:w-80"
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-5 py-2 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-3 py-2 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Payment Pending</option>
              <option value="failed">Payment Failed</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Order
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Payment
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Total
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Earnings
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        order.paymentStatus === "paid" ? "success" : "warning"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4 font-semibold text-gray-900 dark:text-white">
                    ${order.total}
                  </td>
                  <td className="p-4 font-semibold text-green-600">
                    ${order.creatorEarnings}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <div className="relative">
                        <Button
                          size="sm"
                          variant="outline"
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
                                handleViewOrder(order.id);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(order.id);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Update Status</span>
                            </button>

                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRefundOrder(order.id);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Process Refund</span>
                            </button>

                            {order.status !== "cancelled" &&
                              order.status !== "delivered" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelOrder(order.id);
                                  }}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Ban className="w-4 h-4" />
                                  <span>Cancel Order</span>
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading.orders && (
        <Card className="p-12 text-center bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedStatus !== "all"
              ? "Try adjusting your search or filters."
              : "Orders will appear here when customers make purchases."}
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
                  onClick={confirmCancel}
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

      {/* Refund Order Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Process Refund
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will initiate a refund for this order. The customer will be
                notified and the refund will be processed according to your
                refund policy.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRefund}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Process Refund
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Update Order Status
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmUpdateStatus}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorOrders;
