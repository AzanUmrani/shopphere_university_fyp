  import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Upload,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit2,
  RefreshCw,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  price: number;
  imageUrl?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
}

const ProductInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);

  // Mock data
  const mockInventory: InventoryItem[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      category: "Electronics",
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      lowStockThreshold: 10,
      price: 79.99,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop",
      status: "in_stock",
      lastUpdated: "2024-08-10",
    },
    {
      id: "2",
      name: "Smart Watch Series 5",
      sku: "SW-005",
      category: "Electronics",
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      lowStockThreshold: 10,
      price: 299.99,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
      status: "low_stock",
      lastUpdated: "2024-08-11",
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      sku: "OCT-100",
      category: "Clothing",
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      lowStockThreshold: 5,
      price: 24.99,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop",
      status: "out_of_stock",
      lastUpdated: "2024-08-09",
    },
    {
      id: "4",
      name: "Portable Power Bank",
      sku: "PPB-200",
      category: "Electronics",
      currentStock: 25,
      reservedStock: 3,
      availableStock: 22,
      lowStockThreshold: 8,
      price: 39.99,
      imageUrl:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=60&h=60&fit=crop",
      status: "in_stock",
      lastUpdated: "2024-08-12",
    },
  ];

  useEffect(() => {
    setInventory(mockInventory);
  }, []);

  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || item.status === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stock":
          return b.currentStock - a.currentStock;
        case "updated":
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        default:
          return 0;
      }
    });

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(
    (item) => item.status === "low_stock"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.status === "out_of_stock"
  ).length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.price,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === itemId) {
          const availableStock = newStock - item.reservedStock;
          let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";

          if (newStock === 0) {
            status = "out_of_stock";
          } else if (newStock <= item.lowStockThreshold) {
            status = "low_stock";
          }

          return {
            ...item,
            currentStock: newStock,
            availableStock,
            status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      })
    );
  };

  const openStockModal = (item: InventoryItem) => {
    setEditingItem(item);
    setNewStockValue(item.currentStock.toString());
    setShowStockModal(true);
  };

  const handleStockUpdate = () => {
    if (editingItem && newStockValue) {
      const stockNumber = parseInt(newStockValue);
      if (!isNaN(stockNumber) && stockNumber >= 0) {
        updateStock(editingItem.id, stockNumber);
        setShowStockModal(false);
        setEditingItem(null);
        setNewStockValue("");
      }
    }
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setEditingItem(null);
    setNewStockValue("");
  };

  const openViewModal = (item: InventoryItem) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Product Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage your product stock levels
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-secondary-600 hover:bg-secondary-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalItems}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Items
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockItems}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {outOfStockItems}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Value
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-6 py-2 border dark:text-white border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="all">All Products</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border dark:text-white border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.currentStock}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Reserved: {item.reservedStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.availableStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openStockModal(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewModal(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredInventory.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No inventory found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Your inventory will appear here"}
          </p>
        </Card>
      )}

      {/* Stock Update Modal */}
      {showStockModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Stock
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Product:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {editingItem.name}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Current Stock:{" "}
                <span className="font-medium">{editingItem.currentStock}</span>
              </p>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Stock Quantity
              </label>
              <Input
                type="number"
                value={newStockValue}
                onChange={(e) => setNewStockValue(e.target.value)}
                placeholder="Enter new stock quantity"
                min="0"
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeStockModal}>
                Cancel
              </Button>
              <Button
                onClick={handleStockUpdate}
                className="bg-secondary-600 hover:bg-secondary-700"
                disabled={
                  !newStockValue ||
                  isNaN(parseInt(newStockValue)) ||
                  parseInt(newStockValue) < 0
                }
              >
                Update Stock
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Details Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Item Details
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeViewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Image */}
                <div className="space-y-4">
                  {viewingItem.imageUrl && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={viewingItem.imageUrl}
                        alt={viewingItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(viewingItem.status)}>
                      {viewingItem.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated:{" "}
                      {new Date(viewingItem.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {viewingItem.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {viewingItem.sku}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Category: {viewingItem.category}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Stock
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {viewingItem.currentStock}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available Stock
                      </label>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {viewingItem.availableStock}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reserved Stock
                      </label>
                      <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        {viewingItem.reservedStock}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Low Stock Threshold
                      </label>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {viewingItem.lowStockThreshold}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price per Unit
                    </label>
                    <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                      ${viewingItem.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Value
                    </label>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      $
                      {(viewingItem.currentStock * viewingItem.price).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Stock Status
                </h4>
                <div className="flex items-center space-x-4">
                  {viewingItem.status === "out_of_stock" && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                  {viewingItem.status === "low_stock" && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Low Stock Warning
                      </span>
                    </div>
                  )}
                  {viewingItem.status === "in_stock" && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">In Stock</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => {
                    closeViewModal();
                    openStockModal(viewingItem);
                  }}
                  className="bg-secondary-600 hover:bg-secondary-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInventory;
