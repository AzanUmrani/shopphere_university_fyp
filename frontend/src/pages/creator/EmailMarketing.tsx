import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const EmailMarketing = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          EmailMarketing
        </h1>
        <Badge className="bg-primary-100 text-primary-800">Feature Page</Badge>
      </div>

      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          EmailMarketing Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This feature is ready for implementation
        </p>
        <div className="text-primary-600 font-medium">
          Professional EmailMarketing Management
        </div>
      </Card>
    </div>
  );
};

export default EmailMarketing;
