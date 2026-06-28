import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Tag,
  Package,
  TrendingUp,
  Eye,
  ChevronRight,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  totalSales: number;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

const ProductCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parentId: "",
  });

  // Mock data
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Electronics",
      description: "Electronic devices and gadgets",
      productCount: 25,
      totalSales: 15000,
      imageUrl:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop",
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Clothing",
      description: "Apparel and fashion items",
      productCount: 42,
      totalSales: 22000,
      imageUrl:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop",
      isActive: true,
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Home & Garden",
      description: "Home decor and garden supplies",
      productCount: 18,
      totalSales: 8500,
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
      isActive: true,
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      name: "Sports & Fitness",
      description: "Sports equipment and fitness gear",
      productCount: 12,
      totalSales: 6200,
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      isActive: false,
      createdAt: "2024-02-10",
    },
  ];

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleSaveCategory = () => {
    if (newCategory.name.trim()) {
      const category: Category = {
        id: Date.now().toString(),
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        productCount: 0,
        totalSales: 0,
        parentId: newCategory.parentId || undefined,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories([...categories, category]);
      setNewCategory({ name: "", description: "", parentId: "" });
      setShowAddModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewCategory({ name: "", description: "", parentId: "" });
  };

  const handleEditCategory = (category: Category) => {
    // In a real app, open edit modal or navigate to edit page
    console.log("Edit category functionality to be implemented", category);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (
      category &&
      window.confirm(
        `Are you sure you want to delete "${category.name}" category? This action cannot be undone.`
      )
    ) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Product Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your products into categories for better management
          </p>
        </div>
        <Button
          onClick={handleAddCategory}
          className="bg-secondary-600 hover:bg-secondary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Categories
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Products
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $
                {categories
                  .reduce((sum, cat) => sum + cat.totalSales, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Sales
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 bg-white/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      );
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  {selectedCategory === category.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                          setSelectedCategory(null);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryStatus(category.id);
                          setSelectedCategory(null);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>
                          {category.isActive ? "Deactivate" : "Activate"}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                          setSelectedCategory(null);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute top-2 left-2">
                <Badge
                  className={`${
                    category.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {category.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Products:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.productCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Sales:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${category.totalSales.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Created:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first category to get started"}
          </p>
          <Button
            onClick={handleAddCategory}
            className="bg-secondary-600 hover:bg-secondary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Card>
      )}

      {/* Click outside to close dropdown */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setSelectedCategory(null)}
        />
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Category
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <Input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter category description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={newCategory.parentId}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        parentId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">None</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  disabled={!newCategory.name.trim()}
                  className="flex-1 bg-secondary-600 hover:bg-secondary-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
