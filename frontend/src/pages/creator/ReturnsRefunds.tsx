import { useState, useEffect } from "react";
import { RotateCcw, AlertTriangle, DollarSign, Eye } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const ReturnsRefunds = () => {
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    // Mock returns data
    const mockReturns = [
      {
        id: "1",
        orderNumber: "ORD-2024-009",
        customer: { name: "Jane Smith", email: "jane@email.com" },
        reason: "Product damaged during shipping",
        type: "return",
        status: "pending",
        requestDate: "2024-02-12T10:00:00Z",
        refundAmount: 129.99,
        items: [{ name: "Wireless Headphones", quantity: 1 }],
      },
    ];
    setReturns(mockReturns);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Returns & Refunds
        </h1>
        <RotateCcw className="w-6 h-6 text-orange-500" />
        <Badge className="bg-orange-100 text-orange-800">
          {returns.length} Requests
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <RotateCcw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {returns.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Return Requests</p>
        </Card>

        <Card className="p-6 text-center">
          <DollarSign className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            $
            {returns.reduce((sum, ret) => sum + ret.refundAmount, 0).toFixed(2)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Potential Refunds</p>
        </Card>

        <Card className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {returns.filter((r) => r.status === "pending").length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Pending Review</p>
        </Card>
      </div>

      <div className="space-y-4">
        {returns.map((returnRequest) => (
          <Card key={returnRequest.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {returnRequest.orderNumber}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requested on{" "}
                  {new Date(returnRequest.requestDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800">
                  {returnRequest.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Customer:
                </p>
                <p className="font-medium">{returnRequest.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Refund Amount:
                </p>
                <p className="font-bold text-red-600">
                  ${returnRequest.refundAmount.toFixed(2)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Reason:
                </p>
                <p className="text-sm">{returnRequest.reason}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReturnsRefunds;
