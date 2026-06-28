import { TrendingUp, Target } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const ConversionAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Conversion Analytics
        </h1>
        <Target className="w-6 h-6 text-secondary-500" />
        <Badge className="bg-secondary-100 text-secondary-800">
          Enterprise Feature
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            3.2%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Overall Conversion</p>
        </Card>

        <Card className="p-6 text-center">
          <Target className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            12.5%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Add to Cart Rate</p>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            68%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Checkout Completion
          </p>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Advanced Conversion Funnel
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Track your customer journey from page visit to purchase
        </p>
        <div className="text-secondary-600 font-medium">Coming Soon</div>
      </Card>
    </div>
  );
};

export default ConversionAnalytics;
