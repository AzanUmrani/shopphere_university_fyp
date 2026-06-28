import { useState, useEffect } from "react";
import { CheckCircle, DollarSign, Star, Eye } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const CompletedOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Mock completed orders
    const mockOrders = [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: { name: "John Doe", email: "john@email.com" },
        total: 299.99,
        completedAt: "2024-02-10T15:30:00Z",
        items: [{ name: "Product 1", quantity: 2, price: 149.99 }],
      },
    ];
    setOrders(mockOrders);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Completed Orders
        </h1>
        <CheckCircle className="w-6 h-6 text-green-500" />
        <Badge className="bg-green-100 text-green-800">
          {orders.length} Completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {orders.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Completed Orders</p>
        </Card>

        <Card className="p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
        </Card>

        <Card className="p-6 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            4.8
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Avg Rating</p>
        </Card>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed on{" "}
                  {new Date(order.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompletedOrders;
