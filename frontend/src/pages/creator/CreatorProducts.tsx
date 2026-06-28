import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Grid,
  List,
  Download,
  Upload,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { fetchCreatorProducts } from "../../store/slices/creatorSlice";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";

// Mock products data
const mockProducts = [
  {
    id: "prod-1",
    name: "Premium Wireless Headphones",
    sku: "PWH-001",
    image: "/api/placeholder/300/300",
    category: "Electronics",
    price: 299.99,
    cost: 150.0,
    profit: 149.99,
    margin: 50.0,
    stock: 45,
    status: "active" as const,
    visibility: "public" as const,
    sales: 123,
    views: 2450,
    rating: 4.8,
    reviews: 89,
    createdAt: "2024-01-15",
    lastUpdated: "2024-02-01",
    trending: 15.5,
  },
  {
    id: "prod-2",
    name: "Smart Watch Series X",
    sku: "SWX-002",
    image: "/api/placeholder/300/300",
    category: "Electronics",
    price: 199.99,
    cost: 120.0,
    profit: 79.99,
    margin: 40.0,
    stock: 8,
    status: "active" as const,
    visibility: "public" as const,
    sales: 89,
    views: 1850,
    rating: 4.6,
    reviews: 67,
    createdAt: "2024-01-20",
    lastUpdated: "2024-01-25",
    trending: -5.2,
  },
  {
    id: "prod-3",
    name: "Bluetooth Speaker Pro",
    sku: "BSP-003",
    image: "/api/placeholder/300/300",
    category: "Electronics",
    price: 89.99,
    cost: 45.0,
    profit: 44.99,
    margin: 50.0,
    stock: 0,
    status: "out_of_stock" as const,
    visibility: "public" as const,
    sales: 156,
    views: 3200,
    rating: 4.9,
    reviews: 124,
    createdAt: "2024-01-10",
    lastUpdated: "2024-02-05",
    trending: 8.7,
  },
  {
    id: "prod-4",
    name: "Laptop Stand Adjustable",
    sku: "LSA-004",
    image: "/api/placeholder/300/300",
    category: "Accessories",
    price: 49.99,
    cost: 25.0,
    profit: 24.99,
    margin: 50.0,
    stock: 125,
    status: "active" as const,
    visibility: "public" as const,
    sales: 78,
    views: 1120,
    rating: 4.4,
    reviews: 43,
    createdAt: "2024-01-25",
    lastUpdated: "2024-01-30",
    trending: 12.3,
  },
  {
    id: "prod-5",
    name: "Wireless Phone Charger",
    sku: "WPC-005",
    image: "/api/placeholder/300/300",
    category: "Electronics",
    price: 24.99,
    cost: 12.0,
    profit: 12.99,
    margin: 52.0,
    stock: 234,
    status: "draft" as const,
    visibility: "private" as const,
    sales: 0,
    views: 0,
    rating: 0,
    reviews: 0,
    createdAt: "2024-02-01",
    lastUpdated: "2024-02-03",
    trending: 0,
  },
];

const CreatorProducts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.creator);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [products] = useState(mockProducts);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchCreatorProducts());
  }, [dispatch]);

  const categories = [
    "all",
    "Electronics",
    "Accessories",
    "Clothing",
    "Home & Kitchen",
  ];
  const statuses = ["all", "active", "draft", "inactive", "out_of_stock"];

  // Use mock data for now
  const displayProducts = products;

  const filteredProducts = displayProducts
    .filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== "all" && product.status !== selectedStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "sales":
          return b.sales - a.sales;
        case "stock":
          return b.stock - a.stock;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "inactive":
        return <Badge variant="danger">Inactive</Badge>;
      case "out_of_stock":
        return <Badge variant="danger">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "text-red-600", label: "Out of stock" };
    if (stock < 10) return { color: "text-yellow-600", label: "Low stock" };
    return { color: "text-green-600", label: "In stock" };
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id)
    );
  };

  // Dropdown action handlers
  const handleEditProduct = (productId: string) => {
    navigate(`/creator/products/${productId}`);
    setActiveDropdown(null);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/creator/products/${productId}/analytics`);
    setActiveDropdown(null);
  };

  const handleDuplicateProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowDuplicateModal(true);
    setActiveDropdown(null);
  };

  const handleArchiveProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowArchiveModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  // Confirm actions
  const confirmDuplicate = () => {
    console.log("Duplicating product:", selectedProductId);
    // In a real app, this would create a copy of the product
    setShowDuplicateModal(false);
    setSelectedProductId(null);
  };

  const confirmArchive = () => {
    console.log("Archiving product:", selectedProductId);
    // In a real app, this would archive/unarchive the product
    setShowArchiveModal(false);
    setSelectedProductId(null);
  };

  const confirmDelete = () => {
    console.log("Deleting product:", selectedProductId);
    // In a real app, this would delete the product
    setShowDeleteModal(false);
    setSelectedProductId(null);
  };

  const cancelModal = () => {
    setShowDeleteModal(false);
    setShowDuplicateModal(false);
    setShowArchiveModal(false);
    setSelectedProductId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const ProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card
          key={product.id}
          className="p-4 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl"
        >
          <div className="relative mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              {getStatusBadge(product.status)}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-secondary-600">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500">
                {product.sales} sales
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={getStockStatus(product.stock).color}>
                {product.stock} in stock
              </span>
              <div className="flex items-center">
                {product.trending > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : product.trending < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                ) : null}
                {product.trending !== 0 && (
                  <span
                    className={
                      product.trending > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {product.trending > 0 ? "+" : ""}
                    {product.trending}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/creator/products/${product.id}`)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(`/creator/products/${product.id}/analytics`)
                }
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Stats
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ProductList = () => (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Product
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                SKU
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Price
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Stock
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Sales
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Views
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Trend
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg dark:text-white text-xs" 
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {product.sku}
                </td>
                <td className="p-4">{getStatusBadge(product.status)}</td>
                <td className="p-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Margin: {product.margin}%
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={
                      getStockStatus(product.stock).color + " font-medium"
                    }
                  >
                    {product.stock}
                  </span>
                  {product.stock < 10 && product.stock > 0 && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 inline ml-1" />
                  )}
                </td>
                <td className="p-4 font-medium text-gray-900 dark:text-white">
                  {product.sales}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {product.views.toLocaleString()}
                </td>
                <td className="p-4">
                  {product.trending !== 0 && (
                    <div className="flex items-center">
                      {product.trending > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={
                          product.trending > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {product.trending > 0 ? "+" : ""}
                        {product.trending}%
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/creator/products/${product.id}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/creator/products/${product.id}/analytics`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(
                            activeDropdown === product.id ? null : product.id
                          );
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      {activeDropdown === product.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Product</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(product.id);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Analytics</span>
                          </button>

                          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateProduct(product.id);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Duplicate</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveProduct(product.id);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Archive className="w-4 h-4" />
                            <span>Archive</span>
                          </button>

                          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/creator/products/categories")}
          >
            <Package className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/creator/products/inventory")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Inventory
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => navigate("/creator/products/add")}
            className="bg-gradient-to-r from-secondary-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Products
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.filter((p) => p.status === "active").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Products
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  displayProducts.filter((p) => p.stock < 10 && p.stock > 0)
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayProducts.filter((p) => p.stock === 0).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or SKU..."
              className="w-full sm:w-80"
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="sales">Sort by Sales</option>
              <option value="stock">Sort by Stock</option>
              <option value="created">Sort by Date</option>
            </select>

            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <Button
                variant={viewMode === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none border-r-0"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-700 dark:text-secondary-300">
                {selectedProducts.length} product
                {selectedProducts.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Products Display */}
      {loading.products ? (
        <Card className="p-12 text-center bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ||
            selectedCategory !== "all" ||
            selectedStatus !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by adding your first product."}
          </p>
          <Button
            onClick={() => navigate("/creator/products/add")}
            className="bg-gradient-to-r from-secondary-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        <ProductGrid />
      ) : (
        <ProductList />
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {displayProducts.length}{" "}
            products
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary-600 text-white"
            >
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Product
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone and will permanently remove the product and all its
                associated data.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Confirmation Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Copy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Duplicate Product
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will create a copy of the product with "(Copy)" appended to
                the name. You can modify the duplicate afterwards.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDuplicate}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Archive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Archive Product
                </h2>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Archiving will hide this product from your active catalog but
                keep all data intact. You can restore it later from archived
                products.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={cancelModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmArchive}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProducts;
