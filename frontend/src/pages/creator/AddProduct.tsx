import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { useAppDispatch } from "../../hooks/redux";
import { createProduct } from "../../store/slices/creatorSlice";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    brand: "",
    sku: "",
    price: "",
    originalPrice: "",
    cost: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "cm",
    },
    tags: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string>,
    inventory: {
      quantity: "",
      lowStockThreshold: "",
      trackInventory: true,
    },
    shipping: {
      freeShipping: false,
      weight: "",
      packageType: "standard",
      processingTime: "1-2",
    },
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    status: "draft",
    visibility: "public",
  });

  const [images, setImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentSpec, setCurrentSpec] = useState({ key: "", value: "" });

  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Beauty & Personal Care",
    "Books",
    "Toys & Games",
  ];

  const handleInputChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      setProductForm((prev) => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof typeof prev] as Record<string, any>),
          [field]: value,
        },
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !productForm.tags.includes(currentTag.trim())) {
      setProductForm((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !productForm.features.includes(currentFeature.trim())
    ) {
      setProductForm((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setProductForm((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const addSpecification = () => {
    if (currentSpec.key.trim() && currentSpec.value.trim()) {
      setProductForm((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [currentSpec.key.trim()]: currentSpec.value.trim(),
        },
      }));
      setCurrentSpec({ key: "", value: "" });
    }
  };

  const removeSpecification = (keyToRemove: string) => {
    setProductForm((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[keyToRemove];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const handleSave = async (status: "draft" | "active") => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validate required fields
      const validationErrors: Record<string, string> = {};
      if (!productForm.name.trim()) {
        validationErrors.name = "Product name is required";
      }
      if (!productForm.description.trim()) {
        validationErrors.description = "Product description is required";
      }
      if (!productForm.price || parseFloat(productForm.price) <= 0) {
        validationErrors.price = "Valid price is required";
      }
      if (!productForm.brand.trim()) {
        validationErrors.brand = "Brand is required";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Prepare product data for API
      const productData = {
        name: productForm.name,
        description: productForm.description,
        shortDescription: productForm.shortDescription,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice
          ? parseFloat(productForm.originalPrice)
          : null,
        brand: productForm.brand,
        sku: productForm.sku || `PRD-${Date.now()}`, // Generate SKU if not provided
        weight: productForm.weight ? parseFloat(productForm.weight) : null,
        dimensions: {
          length: productForm.dimensions.length
            ? parseFloat(productForm.dimensions.length)
            : null,
          width: productForm.dimensions.width
            ? parseFloat(productForm.dimensions.width)
            : null,
          height: productForm.dimensions.height
            ? parseFloat(productForm.dimensions.height)
            : null,
          unit: productForm.dimensions.unit,
        },
        tags: productForm.tags,
        features: productForm.features,
        specifications: productForm.specifications,
        stockQuantity: productForm.inventory.quantity
          ? parseInt(productForm.inventory.quantity)
          : 0,
        inStock: true,
        isActive: status === "active",
        // TODO: Handle category mapping and images upload
        // categoryId: will need to implement category selection
        // images: will need to handle image uploads
      };

      // Dispatch the create product action
      const resultAction = await dispatch(createProduct(productData));

      if (createProduct.fulfilled.match(resultAction)) {
        // Success! Navigate back to products
        navigate("/creator/products");
      } else {
        // Handle error
        setErrors({
          general: resultAction.error?.message || "Failed to create product",
        });
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      setErrors({ general: error.message || "Failed to create product" });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfit = () => {
    const price = parseFloat(productForm.price) || 0;
    const cost = parseFloat(productForm.cost) || 0;
    return price - cost;
  };

  const calculateMargin = () => {
    const price = parseFloat(productForm.price) || 0;
    const profit = calculateProfit();
    return price > 0 ? (profit / price) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/creator/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Product
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create a new product for your store
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            onClick={() => handleSave("active")}
            className="bg-gradient-to-r from-secondary-600 to-pink-600"
            disabled={isLoading}
          >
            <Package className="w-4 h-4 mr-2" />
            {isLoading ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  value={productForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <Input
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  placeholder="Brief description for product listings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="Detailed product description..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <Input
                    value={productForm.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <Input
                    value={productForm.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Product SKU"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Product Images */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Product Images
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-secondary-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Image</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Upload up to 10 images. First image will be the main product
                image.
              </p>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Profitability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.originalPrice}
                  onChange={(e) =>
                    handleInputChange("originalPrice", e.target.value)
                  }
                  placeholder="0.00"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  placeholder="0.00"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  required
                />
              </div>
            </div>
            {productForm.price && productForm.cost && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Profit:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      ${calculateProfit().toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin:</span>
                    <span className="ml-2 font-semibold text-primary-600">
                      {calculateMargin().toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Tags and Features */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags & Features
            </h3>
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Tags
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productForm.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Features
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <Button onClick={addFeature} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {productForm.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{feature}</span>
                      <button onClick={() => removeFeature(feature)}>
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={currentSpec.key}
                    onChange={(e) =>
                      setCurrentSpec({ ...currentSpec, key: e.target.value })
                    }
                    placeholder="Spec name"
                  />
                  <Input
                    value={currentSpec.value}
                    onChange={(e) =>
                      setCurrentSpec({ ...currentSpec, value: e.target.value })
                    }
                    placeholder="Spec value"
                  />
                  <Button onClick={addSpecification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(productForm.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                        <button onClick={() => removeSpecification(key)}>
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              SEO Optimization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <Input
                  value={productForm.seo.title}
                  onChange={(e) =>
                    handleInputChange("title", e.target.value, "seo")
                  }
                  placeholder="SEO optimized title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {productForm.seo.title.length}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={productForm.seo.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value, "seo")
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="SEO meta description"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {productForm.seo.description.length}/160 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <Input
                  value={productForm.seo.keywords}
                  onChange={(e) =>
                    handleInputChange("keywords", e.target.value, "seo")
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={productForm.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  value={productForm.visibility}
                  onChange={(e) =>
                    handleInputChange("visibility", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center dark:text-white">
                  <input
                    type="checkbox"
                    checked={productForm.inventory.trackInventory}
                    onChange={(e) =>
                      handleInputChange(
                        "trackInventory",
                        e.target.checked,
                        "inventory"
                      )
                    }
                    className="h-4 w-4 text-secondary-600 rounded mr-2"
                  />
                  Track inventory
                </label>
              </div>
              {productForm.inventory.trackInventory && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      value={productForm.inventory.quantity}
                      onChange={(e) =>
                        handleInputChange(
                          "quantity",
                          e.target.value,
                          "inventory"
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Alert
                    </label>
                    <Input
                      type="number"
                      value={productForm.inventory.lowStockThreshold}
                      onChange={(e) =>
                        handleInputChange(
                          "lowStockThreshold",
                          e.target.value,
                          "inventory"
                        )
                      }
                      placeholder="5"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shipping
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center dark:text-white">
                  <input
                    type="checkbox"
                    checked={productForm.shipping.freeShipping}
                    onChange={(e) =>
                      handleInputChange(
                        "freeShipping",
                        e.target.checked,
                        "shipping"
                      )
                    }
                    className="h-4 w-4 text-secondary-600 rounded mr-2 "
                  />
                  Free shipping
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={productForm.shipping.weight}
                  onChange={(e) =>
                    handleInputChange("weight", e.target.value, "shipping")
                  }
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Time
                </label>
                <select
                  value={productForm.shipping.processingTime}
                  onChange={(e) =>
                    handleInputChange(
                      "processingTime",
                      e.target.value,
                      "shipping"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                >
                  <option value="1-2">1-2 business days</option>
                  <option value="3-5">3-5 business days</option>
                  <option value="1-2weeks">1-2 weeks</option>
                  <option value="3-4weeks">3-4 weeks</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
