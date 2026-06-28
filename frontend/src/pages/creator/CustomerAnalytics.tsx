import { useState } from "react";
import { Users, BarChart3, MapPin, Calendar, Eye } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const CustomerAnalytics = () => {
  const [customerData] = useState({
    totalCustomers: 1248,
    newCustomers: 89,
    returningCustomers: 756,
    averageLifetimeValue: 425.5,
    topLocations: [
      { city: "New York", customers: 184 },
      { city: "Los Angeles", customers: 156 },
      { city: "Chicago", customers: 132 },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Customer Analytics
        </h1>
        <Users className="w-6 h-6 text-primary-500" />
        <Badge className="bg-primary-100 text-primary-800">Pro Feature</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {customerData.totalCustomers.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Customers</p>
        </Card>

        <Card className="p-6 text-center">
          <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {customerData.newCustomers}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">New This Month</p>
        </Card>

        <Card className="p-6 text-center">
          <BarChart3 className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {customerData.returningCustomers}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Returning Customers
          </p>
        </Card>

        <Card className="p-6 text-center">
          <Eye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${customerData.averageLifetimeValue.toFixed(2)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Avg Lifetime Value</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Customer Locations
        </h3>
        <div className="space-y-3">
          {customerData.topLocations.map((location, index) => (
            <div
              key={location.city}
              className="flex items-center justify-between dark:text-white"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  #{index + 1} {location.city}
                </span>
              </div>
              <span className="text-primary-600 font-bold">
                {location.customers} customers
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerAnalytics;
