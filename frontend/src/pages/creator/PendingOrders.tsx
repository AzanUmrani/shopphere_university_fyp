import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  User,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Check,
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
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

const PendingOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock pending orders data
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: {
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
        },
        items: [
          {
            id: "1",
            name: "Wireless Bluetooth Headphones",
            quantity: 1,
            price: 79.99,
            image: "/api/placeholder/60/60",
          },
          {
            id: "2",
            name: "Phone Case",
            quantity: 2,
            price: 24.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 129.97,
        status: "pending",
        createdAt: "2024-02-15T10:30:00Z",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        paymentMethod: "Credit Card",
        notes: "Please handle with care",
      },
      {
        id: "2",
        orderNumber: "ORD-2024-002",
        customer: {
          name: "Mike Chen",
          email: "mike.chen@email.com",
        },
        items: [
          {
            id: "3",
            name: "Smart Fitness Watch",
            quantity: 1,
            price: 199.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 199.99,
        status: "pending",
        createdAt: "2024-02-15T14:15:00Z",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
        paymentMethod: "PayPal",
      },
      {
        id: "3",
        orderNumber: "ORD-2024-003",
        customer: {
          name: "Emma Wilson",
          email: "emma.wilson@email.com",
          phone: "+1 (555) 987-6543",
        },
        items: [
          {
            id: "4",
            name: "Organic Cotton T-Shirt",
            quantity: 3,
            price: 24.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 74.97,
        status: "pending",
        createdAt: "2024-02-15T16:45:00Z",
        shippingAddress: {
          street: "789 Pine Rd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
        paymentMethod: "Credit Card",
      },
    ];
    setOrders(mockOrders);
  }, []);

  const handleProcessOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "processing" } : order
      )
    );
  };

  const handleBulkProcess = () => {
    setOrders(
      orders.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: "processing" }
          : order
      )
    );
    setSelectedOrders([]);
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
              Pending Orders
            </h1>
            <Clock className="w-6 h-6 text-orange-500" />
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {orders.length} Orders
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Orders waiting for processing and fulfillment
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedOrders.length > 0 && (
            <Button
              onClick={handleBulkProcess}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Process Selected ({selectedOrders.length})
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
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {orders.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pending Orders
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
            <Clock className="w-5 h-5 text-primary-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(
                orders.reduce(
                  (sum, order) =>
                    sum +
                    (Date.now() - new Date(order.createdAt).getTime()) /
                      (1000 * 60 * 60),
                  0
                ) / orders.length
              )}
              h
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Wait Time
          </p>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
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
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Pending
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleProcessOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Process
                </Button>
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
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {order.customer.email}
                    </span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {order.customer.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Order Items ({order.items.length})
                </h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
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
        ))}
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

export default PendingOrders;
