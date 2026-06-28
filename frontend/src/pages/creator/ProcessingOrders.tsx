import { useState, useEffect } from "react";
import {
  Package,
  User,
  DollarSign,
  MapPin,
  Clock,
  Truck,
  Eye,
  Filter,
  Download,
  Search,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: string;
  createdAt: string;
  processingStarted: string;
  estimatedCompletion: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

const ProcessingOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock processing orders data
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-004",
        customer: {
          name: "David Rodriguez",
          email: "david.rodriguez@email.com",
          phone: "+1 (555) 234-5678",
        },
        items: [
          {
            id: "1",
            name: "Premium Leather Jacket",
            quantity: 1,
            price: 299.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 299.99,
        status: "processing",
        createdAt: "2024-02-14T09:15:00Z",
        processingStarted: "2024-02-14T14:30:00Z",
        estimatedCompletion: "2024-02-16T17:00:00Z",
        shippingAddress: {
          street: "321 Elm St",
          city: "Boston",
          state: "MA",
          zipCode: "02101",
          country: "USA",
        },
        paymentMethod: "Credit Card",
        notes: "Customer requested express processing",
      },
      {
        id: "2",
        orderNumber: "ORD-2024-005",
        customer: {
          name: "Lisa Thompson",
          email: "lisa.thompson@email.com",
        },
        items: [
          {
            id: "2",
            name: "Wireless Mouse",
            quantity: 2,
            price: 49.99,
            image: "/api/placeholder/60/60",
          },
          {
            id: "3",
            name: "Keyboard",
            quantity: 1,
            price: 129.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 229.97,
        status: "processing",
        createdAt: "2024-02-14T11:45:00Z",
        processingStarted: "2024-02-14T16:20:00Z",
        estimatedCompletion: "2024-02-15T12:00:00Z",
        shippingAddress: {
          street: "654 Maple Ave",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA",
        },
        paymentMethod: "PayPal",
        trackingNumber: "TRK-789456123",
      },
    ];
    setOrders(mockOrders);
  }, []);

  const handleMarkAsShipped = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "shipped", trackingNumber: `TRK-${Date.now()}` }
          : order
      )
    );
  };

  const handleBulkShip = () => {
    setOrders(
      orders.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: "shipped", trackingNumber: `TRK-${Date.now()}` }
          : order
      )
    );
    setSelectedOrders([]);
  };

  const getProcessingProgress = (order: Order) => {
    const started = new Date(order.processingStarted).getTime();
    const estimated = new Date(order.estimatedCompletion).getTime();
    const now = Date.now();
    const progress = ((now - started) / (estimated - started)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Processing Orders
            </h1>
            <Package className="w-6 h-6 text-primary-500" />
            <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {orders.length} Orders
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Orders currently being prepared and processed
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedOrders.length > 0 && (
            <Button
              onClick={handleBulkShip}
              className="bg-green-600 hover:bg-green-700"
            >
              <Truck className="w-4 h-4 mr-2" />
              Ship Selected ({selectedOrders.length})
            </Button>
          )}
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

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Package className="w-5 h-5 text-primary-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {orders.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Processing Orders
          </p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Value
          </p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(
                orders.reduce(
                  (sum, order) => sum + getProcessingProgress(order),
                  0
                ) / orders.length
              )}
              %
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Progress
          </p>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => {
          const progress = getProcessingProgress(order);
          const isReadyToShip = progress >= 95;

          return (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order.id]);
                      } else {
                        setSelectedOrders(
                          selectedOrders.filter((id) => id !== order.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Processing since{" "}
                      {new Date(order.processingStarted).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    Processing
                  </Badge>
                  {isReadyToShip && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Ready to Ship
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsShipped(order.id)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!isReadyToShip}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Ship
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Processing Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 95
                        ? "bg-green-500"
                        : progress >= 50
                        ? "bg-primary-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Started</span>
                  <span>
                    Est. Complete:{" "}
                    {new Date(order.estimatedCompletion).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {order.customer.name}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Tracking: {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover dark:text-white text-xs"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="font-bold text-lg text-green-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <p className="text-sm text-primary-800 dark:text-primary-300">
                    <strong>Note:</strong> {order.notes}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "primary" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProcessingOrders;
