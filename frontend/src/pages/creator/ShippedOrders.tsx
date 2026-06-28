import { useState, useEffect } from "react";
import {
  Truck,
  Package,
  User,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Download,
  Search,
  ExternalLink,
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
  shippedAt: string;
  estimatedDelivery: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber: string;
  carrier: string;
  trackingUrl?: string;
}

const ShippedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock shipped orders data
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-006",
        customer: {
          name: "Jennifer Lee",
          email: "jennifer.lee@email.com",
          phone: "+1 (555) 345-6789",
        },
        items: [
          {
            id: "1",
            name: "Designer Handbag",
            quantity: 1,
            price: 459.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 459.99,
        status: "shipped",
        createdAt: "2024-02-12T08:20:00Z",
        shippedAt: "2024-02-13T15:30:00Z",
        estimatedDelivery: "2024-02-16T18:00:00Z",
        shippingAddress: {
          street: "987 Oak Lane",
          city: "Miami",
          state: "FL",
          zipCode: "33101",
          country: "USA",
        },
        trackingNumber: "1Z999E1206001234567",
        carrier: "UPS",
        trackingUrl:
          "https://www.ups.com/track?loc=en_US&tracknum=1Z999E1206001234567",
      },
      {
        id: "2",
        orderNumber: "ORD-2024-007",
        customer: {
          name: "Robert Kim",
          email: "robert.kim@email.com",
        },
        items: [
          {
            id: "2",
            name: "Gaming Headset",
            quantity: 1,
            price: 149.99,
            image: "/api/placeholder/60/60",
          },
          {
            id: "3",
            name: "Mouse Pad",
            quantity: 1,
            price: 29.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 179.98,
        status: "shipped",
        createdAt: "2024-02-11T14:15:00Z",
        shippedAt: "2024-02-12T10:45:00Z",
        estimatedDelivery: "2024-02-15T16:00:00Z",
        shippingAddress: {
          street: "456 Cedar St",
          city: "Portland",
          state: "OR",
          zipCode: "97201",
          country: "USA",
        },
        trackingNumber: "9400109699939920002749",
        carrier: "USPS",
        trackingUrl:
          "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400109699939920002749",
      },
      {
        id: "3",
        orderNumber: "ORD-2024-008",
        customer: {
          name: "Amanda Foster",
          email: "amanda.foster@email.com",
          phone: "+1 (555) 456-7890",
        },
        items: [
          {
            id: "4",
            name: "Yoga Mat Premium",
            quantity: 1,
            price: 89.99,
            image: "/api/placeholder/60/60",
          },
          {
            id: "5",
            name: "Water Bottle",
            quantity: 2,
            price: 24.99,
            image: "/api/placeholder/60/60",
          },
        ],
        total: 139.97,
        status: "shipped",
        createdAt: "2024-02-10T11:30:00Z",
        shippedAt: "2024-02-11T09:15:00Z",
        estimatedDelivery: "2024-02-14T17:00:00Z",
        shippingAddress: {
          street: "123 Wellness Ave",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
          country: "USA",
        },
        trackingNumber: "1234567890",
        carrier: "FedEx",
        trackingUrl:
          "https://www.fedex.com/apps/fedextrack/?tracknumbers=1234567890",
      },
    ];
    setOrders(mockOrders);
  }, []);

  const handleMarkAsDelivered = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
  };

  const getDaysInTransit = (shippedDate: string) => {
    const shipped = new Date(shippedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - shipped.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDeliveryOverdue = (estimatedDelivery: string) => {
    return new Date(estimatedDelivery) < new Date();
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
              Shipped Orders
            </h1>
            <Truck className="w-6 h-6 text-primary-500" />
            <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {orders.length} Orders
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Orders currently in transit to customers
          </p>
        </div>

        <div className="flex items-center space-x-2">
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
              placeholder="Search orders or tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Truck className="w-5 h-5 text-primary-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {orders.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Shipped Value
          </p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(
                orders.reduce(
                  (sum, order) => sum + getDaysInTransit(order.shippedAt),
                  0
                ) / orders.length
              )}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Days in Transit
          </p>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => {
          const daysInTransit = getDaysInTransit(order.shippedAt);
          const overdue = isDeliveryOverdue(order.estimatedDelivery);

          return (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shipped {new Date(order.shippedAt).toLocaleDateString()}(
                      {daysInTransit} days ago)
                    </p>
                  </div>
                  <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    <Truck className="w-3 h-3 mr-1" />
                    In Transit
                  </Badge>
                  {overdue && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Overdue
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsDelivered(order.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Delivered
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer & Shipping Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Shipping Information
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
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Est. Delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Tracking Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {order.carrier}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-mono">
                        {order.trackingNumber}
                      </span>
                    </div>
                    {order.trackingUrl && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(order.trackingUrl, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
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
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover text-xs dark:text-white"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-primary-800 dark:text-primary-300">
                      Package in Transit
                    </span>
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">
                    {overdue
                      ? "Delivery Overdue"
                      : `Arriving in ${Math.ceil(
                          (new Date(order.estimatedDelivery).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-primary-200 dark:bg-primary-800 rounded-full h-2">
                    <div
                      className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                      style={{ width: overdue ? "100%" : "60%" }}
                    />
                  </div>
                </div>
              </div>
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

export default ShippedOrders;
