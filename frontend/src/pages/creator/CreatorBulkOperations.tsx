import { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  Package,
  DollarSign,
  Crown,
  AlertTriangle,
  Eye,
  Search,
  Save,
  Target,
  TrendingUp,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface BulkProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "draft";
  image: string;
  selected: boolean;
  hasChanges?: boolean;
}

interface BulkOperation {
  id: string;
  type:
    | "priceUpdate"
    | "stockUpdate"
    | "categoryChange"
    | "statusChange"
    | "delete";
  name: string;
  description: string;
  icon: any;
  color: string;
}

const CreatorBulkOperations = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<BulkProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // Mock product data
  useEffect(() => {
    const mockProducts: BulkProduct[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        sku: "WBH-001",
        price: 99.99,
        salePrice: 79.99,
        stock: 45,
        category: "Electronics",
        status: "active",
        image: "/api/placeholder/60/60",
        selected: false,
      },
      {
        id: "2",
        name: "Premium Leather Wallet",
        sku: "PLW-002",
        price: 49.99,
        stock: 23,
        category: "Accessories",
        status: "active",
        image: "/api/placeholder/60/60",
        selected: false,
      },
      {
        id: "3",
        name: "Smart Fitness Watch",
        sku: "SFW-003",
        price: 199.99,
        stock: 0,
        category: "Electronics",
        status: "inactive",
        image: "/api/placeholder/60/60",
        selected: false,
      },
      {
        id: "4",
        name: "Organic Cotton T-Shirt",
        sku: "OCT-004",
        price: 24.99,
        stock: 150,
        category: "Clothing",
        status: "active",
        image: "/api/placeholder/60/60",
        selected: false,
      },
      {
        id: "5",
        name: "Stainless Steel Water Bottle",
        sku: "SSW-005",
        price: 29.99,
        salePrice: 19.99,
        stock: 67,
        category: "Home & Garden",
        status: "active",
        image: "/api/placeholder/60/60",
        selected: false,
      },
    ];
    setProducts(mockProducts);
  }, []);

  const bulkOperations: BulkOperation[] = [
    {
      id: "priceUpdate",
      type: "priceUpdate",
      name: "Update Prices",
      description: "Bulk update product prices and sale prices",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "stockUpdate",
      type: "stockUpdate",
      name: "Update Stock",
      description: "Bulk update inventory quantities",
      icon: Package,
      color: "text-primary-600",
    },
    {
      id: "categoryChange",
      type: "categoryChange",
      name: "Change Categories",
      description: "Move products to different categories",
      icon: Target,
      color: "text-secondary-600",
    },
    {
      id: "statusChange",
      type: "statusChange",
      name: "Change Status",
      description: "Activate, deactivate, or draft products",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      id: "delete",
      type: "delete",
      name: "Delete Products",
      description: "Permanently remove selected products",
      icon: Trash2,
      color: "text-red-600",
    },
  ];

  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Home & Garden",
    "Books",
    "Sports",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkAction = (operationType: string) => {
    setBulkAction(operationType);
    setShowBulkPanel(true);
  };

  const applyBulkChanges = () => {
    // Here you would apply the bulk changes
    console.log("Applying bulk changes:", {
      bulkAction,
      selectedProducts,
      pendingChanges,
    });
    setShowBulkPanel(false);
    setBulkAction("");
    setSelectedProducts([]);
    setPendingChanges([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Bulk Operations
            </h1>
            <Edit className="w-6 h-6 text-primary-500" />
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pro Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Efficiently manage multiple products at once
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
            <FileText className="w-4 h-4 mr-2" />
            Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["products", "import", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Products
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {lowStockProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Bulk Actions Panel */}
          {selectedProducts.length > 0 && (
            <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-primary-700 dark:text-primary-300">
                    {selectedProducts.length} product
                    {selectedProducts.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {bulkOperations.map((operation) => {
                    const Icon = operation.icon;
                    return (
                      <Button
                        key={operation.id}
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction(operation.type)}
                        className="flex items-center space-x-1"
                      >
                        <Icon className={`w-4 h-4 ${operation.color}`} />
                        <span>{operation.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        selectedProducts.includes(product.id)
                          ? "bg-primary-50 dark:bg-primary-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            {product.hasChanges && (
                              <Badge className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs">
                                Modified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <span className="font-medium">${product.price}</span>
                          {product.salePrice && (
                            <div className="text-xs text-green-600">
                              Sale: ${product.salePrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span
                          className={
                            product.stock < 10 ? "text-orange-600" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "import" && (
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Import Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a CSV file to bulk import or update your products
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Guidelines
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Use our CSV template for best results</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Maximum file size: 10MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Supported formats: CSV, Excel (.xlsx)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Existing products will be updated by SKU match</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Bulk Operations
            </h3>
            <div className="space-y-4">
              {[
                {
                  id: "1",
                  operation: "Price Update",
                  date: "2024-02-10 14:30",
                  products: 25,
                  status: "completed",
                  user: "Admin",
                },
                {
                  id: "2",
                  operation: "Stock Update",
                  date: "2024-02-09 09:15",
                  products: 40,
                  status: "completed",
                  user: "Admin",
                },
                {
                  id: "3",
                  operation: "Category Change",
                  date: "2024-02-08 16:45",
                  products: 12,
                  status: "failed",
                  user: "Admin",
                },
              ].map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        op.status === "completed"
                          ? "bg-green-500"
                          : op.status === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {op.operation}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {op.products} products • {op.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        op.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : op.status === "failed"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {op.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bulk{" "}
                  {bulkOperations.find((op) => op.type === bulkAction)?.name}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    You are about to modify {selectedProducts.length} products.
                    This action cannot be undone.
                  </p>
                </div>

                {bulkAction === "priceUpdate" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price Action
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="increase">Increase by amount</option>
                        <option value="decrease">Decrease by amount</option>
                        <option value="increasePercent">
                          Increase by percentage
                        </option>
                        <option value="decreasePercent">
                          Decrease by percentage
                        </option>
                        <option value="setPrice">Set fixed price</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount/Percentage
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount or percentage"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {bulkAction === "statusChange" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkPanel(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyBulkChanges}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorBulkOperations;
