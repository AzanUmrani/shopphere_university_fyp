import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Save,
  Eye,
  Edit2,
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  Star,
  Package,
  DollarSign,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  image?: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  tags: string[];
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  images: ProductImage[];
  variants: ProductVariant[];
  status: "draft" | "active" | "archived";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  totalSales: number;
  totalViews: number;
  rating: number;
  reviewCount: number;
}

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Mock product data
  const mockProduct: Product = {
    id: id || "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    shortDescription: "Premium wireless headphones with noise cancellation",
    category: "Electronics",
    subcategory: "Audio",
    brand: "TechSound",
    tags: ["wireless", "bluetooth", "noise-cancellation", "premium"],
    price: 79.99,
    comparePrice: 99.99,
    sku: "WBH-001",
    stock: 45,
    lowStockThreshold: 10,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        alt: "Wireless Headphones - Main View",
        isMain: true,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
        alt: "Wireless Headphones - Side View",
        isMain: false,
      },
    ],
    variants: [
      {
        id: "1",
        name: "Black",
        price: 79.99,
        comparePrice: 99.99,
        sku: "WBH-001-BK",
        stock: 25,
      },
      {
        id: "2",
        name: "White",
        price: 79.99,
        comparePrice: 99.99,
        sku: "WBH-001-WH",
        stock: 20,
      },
    ],
    status: "active",
    featured: true,
    seoTitle: "Wireless Bluetooth Headphones - Premium Audio Experience",
    seoDescription:
      "Experience crystal-clear sound with our premium wireless Bluetooth headphones featuring active noise cancellation.",
    createdAt: "2024-07-15",
    updatedAt: "2024-08-12",
    totalSales: 125,
    totalViews: 2847,
    rating: 4.8,
    reviewCount: 42,
  };

  useEffect(() => {
    // In a real app, fetch product by ID
    setProduct(mockProduct);
  }, [id]);

  useEffect(() => {
    // Check if we're on the analytics route and set the active tab
    if (location.pathname.endsWith("/analytics")) {
      setActiveTab("analytics");
    }
  }, [location.pathname]);

  const handleSave = () => {
    // In a real app, save product changes
    console.log("Saving product changes...", product);
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    // In a real app, handle image upload
    console.log("Handle image upload");
  };

  const updateProduct = (field: keyof Product, value: any) => {
    if (product) {
      setProduct({ ...product, [field]: value });
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General Info" },
    { id: "images", label: "Images" },
    { id: "variants", label: "Variants" },
    { id: "seo", label: "SEO" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/creator/products")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              SKU: {product.sku} • Created{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge
            className={`${
              product.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : product.status === "draft"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {product.status}
          </Badge>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-secondary-600 hover:bg-secondary-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-secondary-600 hover:bg-secondary-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.totalSales}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Sales
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.rating}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rating ({product.reviewCount})
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.stock}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In Stock
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-secondary-500 text-secondary-600 dark:text-secondary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Name
                    </label>
                    <Input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Short Description
                    </label>
                    <Input
                      type="text"
                      value={product.shortDescription}
                      onChange={(e) =>
                        updateProduct("shortDescription", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <Input
                        type="text"
                        value={product.category}
                        onChange={(e) =>
                          updateProduct("category", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand
                      </label>
                      <Input
                        type="text"
                        value={product.brand}
                        onChange={(e) => updateProduct("brand", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price ($)
                      </label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          updateProduct("price", parseFloat(e.target.value))
                        }
                        disabled={!isEditing}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Compare Price ($)
                      </label>
                      <Input
                        type="number"
                        value={product.comparePrice || ""}
                        onChange={(e) =>
                          updateProduct(
                            "comparePrice",
                            parseFloat(e.target.value) || undefined
                          )
                        }
                        disabled={!isEditing}
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SKU
                      </label>
                      <Input
                        type="text"
                        value={product.sku}
                        onChange={(e) => updateProduct("sku", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock Quantity
                      </label>
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          updateProduct("stock", parseInt(e.target.value))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={product.status}
                      onChange={(e) => updateProduct("status", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct("description", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h3>
                {isEditing && (
                  <Button
                    onClick={handleImageUpload}
                    className="bg-secondary-600 hover:bg-secondary-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {image.isMain && (
                      <Badge className="absolute top-2 left-2 bg-primary-100 text-primary-800">
                        Main
                      </Badge>
                    )}
                    {isEditing && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 bg-white"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div
                    onClick={handleImageUpload}
                    className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-secondary-500 transition-colors"
                  >
                    <div className="text-center">
                      <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add Image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Metrics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Views:
                      </span>
                      <span className="font-medium">
                        {product.totalViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Sales:
                      </span>
                      <span className="font-medium">{product.totalSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversion Rate:
                      </span>
                      <span className="font-medium">
                        {(
                          (product.totalSales / product.totalViews) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Customer Reviews
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-lg font-semibold">
                        {product.rating}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === "variants" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Variants
                </h3>
                <Button className="bg-secondary-600 hover:bg-secondary-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              <div className="grid gap-4">
                {product.variants.map((variant) => (
                  <Card key={variant.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-3">
                          {variant.image && (
                            <img
                              src={variant.image}
                              alt={variant.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {variant.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              SKU: {variant.sku}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${variant.price.toFixed(2)}
                          </span>
                        </div>
                        {variant.comparePrice && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Compare at:
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${variant.comparePrice.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Stock:
                          </span>
                          <span
                            className={`font-semibold ${
                              variant.stock > 10
                                ? "text-green-600 dark:text-green-400"
                                : variant.stock > 0
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {variant.stock} units
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {product.variants.length === 0 && (
                <Card className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No variants created
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create product variants to offer different options like
                    size, color, or material.
                  </p>
                  <Button className="bg-secondary-600 hover:bg-secondary-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Variant
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Search Engine Optimization
                </h3>
              </div>

              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Page Title & Description
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SEO Title
                    </label>
                    <Input
                      type="text"
                      value={product.seoTitle}
                      onChange={(e) =>
                        updateProduct("seoTitle", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Enter SEO-optimized title"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        This will appear as the page title in search results
                      </span>
                      <span
                        className={
                          product.seoTitle.length > 60
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      >
                        {product.seoTitle.length}/60
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={product.seoDescription}
                      onChange={(e) =>
                        updateProduct("seoDescription", e.target.value)
                      }
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Write a compelling description for search engines"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        This will appear as the description in search results
                      </span>
                      <span
                        className={
                          product.seoDescription.length > 160
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      >
                        {product.seoDescription.length}/160
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Search Engine Preview
                </h4>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-2">
                    <div className="text-sm text-primary-600 dark:text-primary-400">
                      https://shopsphere.com/products/{product.id}
                    </div>
                    <div className="text-lg text-secondary-600 dark:text-secondary-400 font-medium">
                      {product.seoTitle || product.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {product.seoDescription || product.shortDescription}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductEditPage;
