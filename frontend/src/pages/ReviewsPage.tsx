import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Package,
  MessageCircle,
} from "lucide-react";
import { mockProducts } from "../utils/mockData";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt?: string;
}

interface ReviewForm {
  rating: number;
  title: string;
  content: string;
  images: File[];
  recommend: boolean;
}

const ReviewsPage = () => {
  const { productId, orderId } = useParams<{
    productId?: string;
    orderId?: string;
  }>();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    title: "",
    content: "",
    images: [],
    recommend: true,
  });
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: "1",
      userId: "user1",
      userName: "Sarah Johnson",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face",
      productId: productId || "1",
      orderId: "ORD-001",
      rating: 5,
      title: "Absolutely perfect!",
      content:
        "This product exceeded my expectations. The quality is outstanding and it arrived exactly as described. I've been using it for 2 weeks now and couldn't be happier. Highly recommend to anyone considering this purchase.",
      images: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      ],
      verified: true,
      helpful: 12,
      notHelpful: 1,
      createdAt: "2025-01-20",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Mike Chen",
      productId: productId || "1",
      orderId: "ORD-002",
      rating: 4,
      title: "Great value for money",
      content:
        "Really impressed with the build quality. Setup was straightforward and it works exactly as advertised. Only minor complaint is the packaging could be better.",
      verified: true,
      helpful: 8,
      notHelpful: 0,
      createdAt: "2025-01-18",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Emily Davis",
      userAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      productId: productId || "1",
      orderId: "ORD-003",
      rating: 3,
      title: "Good but not great",
      content:
        "It's a decent product for the price. Works as expected but nothing exceptional. Customer service was helpful when I had questions.",
      verified: true,
      helpful: 5,
      notHelpful: 2,
      createdAt: "2025-01-15",
    },
  ];

  useEffect(() => {
    if (productId) {
      const foundProduct = mockProducts.find((p) => p.id === productId);
      setProduct(foundProduct);
      setReviews(mockReviews.filter((r) => r.productId === productId));
    }
  }, [productId]);

  // Check if review form is complete
  const isReviewFormComplete =
    reviewForm.rating > 0 &&
    reviewForm.title?.trim() &&
    reviewForm.content?.trim();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReviewFormComplete) {
      alert("Please fill in all required fields (Rating, Title, Content)");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      productId: productId || "",
      orderId: orderId || "",
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      verified: true,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setReviewForm({
      rating: 0,
      title: "",
      content: "",
      images: [],
      recommend: true,
    });
    alert("Review submitted successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReviewForm({ ...reviewForm, images: [...reviewForm.images, ...files] });
  };

  const removeImage = (index: number) => {
    const newImages = reviewForm.images.filter((_, i) => i !== index);
    setReviewForm({ ...reviewForm, images: newImages });
  };

  const filteredAndSortedReviews = reviews
    .filter(
      (review) =>
        filterRating === "all" || review.rating.toString() === filterRating
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === rating).length / reviews.length) *
          100
        : 0,
  }));

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-pink-50 to-primary-50 flex items-center justify-center">
        <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn't find the product you're trying to review.
          </p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-pink-50 to-primary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 via-pink-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Product Reviews</h1>
              <p className="text-secondary-100">
                Share your experience and help other customers
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-300 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-secondary-200">
                  {reviews.length} reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info & Review Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  {orderId && (
                    <p className="text-xs text-gray-500">Order: {orderId}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Rating
                  </span>
                  <span className="text-sm text-gray-600">
                    {reviews.length} reviews
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600 w-8">
                        {rating} ★
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write Review Button */}
              {!showReviewForm && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-gradient-to-r from-secondary-500 to-pink-500 hover:from-secondary-600 hover:to-pink-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              )}
            </Card>

            {/* Filters */}
            <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
              <h3 className="font-semibold text-gray-900 mb-4">
                Filter Reviews
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Rating
                  </label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Reviews List & Review Form */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showReviewForm && (
              <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Write Your Review
                </h3>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, rating: star })
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewForm.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 hover:text-yellow-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      placeholder="Give your review a title"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          content: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      placeholder="Share your experience with this product. What did you like or dislike? How would you use it?"
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-secondary-400 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload photos to help other customers
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg cursor-pointer hover:bg-secondary-200 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </label>
                    </div>

                    {reviewForm.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {reviewForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reviewForm.recommend}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            recommend: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I would recommend this product to others
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-4 flex-col sm:flex-row">
                    {isReviewFormComplete ? (
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-secondary-500 to-pink-500 hover:from-secondary-600 hover:to-pink-600 text-white transform hover:scale-[1.02] transition-all"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse text-center">
                        ↑ Fill all required fields to continue
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredAndSortedReviews.length === 0 ? (
                <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Reviews Found
                  </h3>
                  <p className="text-gray-600">
                    {filterRating !== "all"
                      ? `No reviews with ${filterRating} stars found.`
                      : "Be the first to review this product!"}
                  </p>
                </Card>
              ) : (
                filteredAndSortedReviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-pink-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            {review.verified && (
                              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <h5 className="font-medium text-gray-900">
                            {review.title}
                          </h5>
                        </div>

                        <div className="mb-4">
                          <p
                            className={`text-gray-700 leading-relaxed ${
                              expandedReview === review.id ? "" : "line-clamp-3"
                            }`}
                          >
                            {review.content}
                          </p>
                          {review.content.length > 200 && (
                            <button
                              onClick={() =>
                                setExpandedReview(
                                  expandedReview === review.id
                                    ? null
                                    : review.id
                                )
                              }
                              className="text-secondary-600 hover:text-secondary-700 text-sm font-medium mt-2"
                            >
                              {expandedReview === review.id ? (
                                <>
                                  Show Less{" "}
                                  <ChevronUp className="w-4 h-4 inline" />
                                </>
                              ) : (
                                <>
                                  Read More{" "}
                                  <ChevronDown className="w-4 h-4 inline" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">
                                Helpful ({review.helpful})
                              </span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-sm">
                                Not Helpful ({review.notHelpful})
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            <span>Order: {review.orderId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
