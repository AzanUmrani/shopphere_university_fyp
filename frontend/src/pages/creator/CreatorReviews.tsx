import { useState } from "react";
import {
  Star,
  Search,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Flag,
  Reply,
  Award,
  AlertTriangle,
  MoreVertical,
  Eye,
  ThumbsDown,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock review data
const reviews = [
  {
    id: "REV-001",
    customerName: "Sarah Johnson",
    customerAvatar: "SJ",
    productName: "Premium Wireless Headphones",
    rating: 5,
    title: "Excellent sound quality!",
    content:
      "These headphones exceeded my expectations. The sound quality is crystal clear and the noise cancellation works perfectly. Highly recommended for music lovers!",
    date: "2024-02-10",
    verified: true,
    helpful: 12,
    notHelpful: 1,
    replied: true,
    flagged: false,
    images: ["image1.jpg", "image2.jpg"],
    orderValue: 299.99,
  },
  {
    id: "REV-002",
    customerName: "Mike Chen",
    customerAvatar: "MC",
    productName: "Smart Fitness Tracker",
    rating: 4,
    title: "Great features but battery could be better",
    content:
      "Love all the health tracking features and the app integration is smooth. Only complaint is the battery life isn't as long as advertised.",
    date: "2024-02-09",
    verified: true,
    helpful: 8,
    notHelpful: 3,
    replied: false,
    flagged: false,
    images: [],
    orderValue: 199.99,
  },
  {
    id: "REV-003",
    customerName: "Emily Rodriguez",
    customerAvatar: "ER",
    productName: "Organic Skincare Set",
    rating: 5,
    title: "Amazing results!",
    content:
      "I've been using this skincare set for 3 weeks and already see improvements in my skin texture. The products feel luxurious and smell amazing.",
    date: "2024-02-08",
    verified: true,
    helpful: 15,
    notHelpful: 0,
    replied: true,
    flagged: false,
    images: ["before.jpg", "after.jpg"],
    orderValue: 89.99,
  },
  {
    id: "REV-004",
    customerName: "Alex Thompson",
    customerAvatar: "AT",
    productName: "Gaming Mechanical Keyboard",
    rating: 2,
    title: "Not as described",
    content:
      "The keyboard feels cheap and some keys stick. The RGB lighting is also inconsistent. Expected better quality for the price.",
    date: "2024-02-07",
    verified: true,
    helpful: 5,
    notHelpful: 8,
    replied: false,
    flagged: true,
    images: [],
    orderValue: 149.99,
  },
  {
    id: "REV-005",
    customerName: "Lisa Parker",
    customerAvatar: "LP",
    productName: "Yoga Mat Premium",
    rating: 5,
    title: "Perfect for my daily practice",
    content:
      "Excellent grip and cushioning. The mat stays in place during intense sessions and is easy to clean. Worth every penny!",
    date: "2024-02-06",
    verified: true,
    helpful: 9,
    notHelpful: 1,
    replied: true,
    flagged: false,
    images: ["yoga1.jpg"],
    orderValue: 79.99,
  },
];

const reviewStats = [
  { rating: 5, count: 234, percentage: 68 },
  { rating: 4, count: 67, percentage: 19 },
  { rating: 3, count: 23, percentage: 7 },
  { rating: 2, count: 12, percentage: 4 },
  { rating: 1, count: 8, percentage: 2 },
];

const reviewTrends = [
  { month: "Sep", reviews: 45, avgRating: 4.2 },
  { month: "Oct", reviews: 52, avgRating: 4.3 },
  { month: "Nov", reviews: 67, avgRating: 4.5 },
  { month: "Dec", reviews: 89, avgRating: 4.4 },
  { month: "Jan", reviews: 123, avgRating: 4.6 },
  { month: "Feb", reviews: 87, avgRating: 4.5 },
];

const CreatorReviews = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "verified" && review.verified) ||
      (selectedFilter === "flagged" && review.flagged) ||
      (selectedFilter === "unreplied" && !review.replied) ||
      selectedFilter === String(review.rating);

    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const unrepliedCount = reviews.filter((review) => !review.replied).length;
  const flaggedCount = reviews.filter((review) => review.flagged).length;

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCustomerAvatar = (_name: string, avatar: string) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-pink-500 flex items-center justify-center text-white font-semibold">
      {avatar}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Reviews
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and respond to customer feedback
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Review Flagged ({flaggedCount})
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Reviews
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalReviews}
              </p>
              <p className="text-sm text-gray-500 mt-2">+12 this week</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <div className="flex items-center mt-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex ml-2 mt-1">
                  {getStarRating(Math.floor(averageRating))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Out of 5 stars</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Needs Reply
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {unrepliedCount}
              </p>
              <p className="text-sm text-gray-500 mt-2">Pending responses</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Reply className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Response Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {(
                  ((totalReviews - unrepliedCount) / totalReviews) *
                  100
                ).toFixed(0)}
                %
              </p>
              <p className="text-sm text-gray-500 mt-2">Of all reviews</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Review Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Review Trends
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Rating Distribution
          </h3>
          <div className="space-y-4">
            {reviewStats.map((stat) => (
              <div key={stat.rating} className="flex items-center space-x-3 dark:text-white">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm font-medium">{stat.rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
              <option value="verified">Verified Only</option>
              <option value="unreplied">Needs Reply</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {getCustomerAvatar(review.customerName, review.customerAvatar)}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.customerName}
                    </h4>
                    {review.verified && (
                      <Badge variant="success" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {review.flagged && (
                      <Badge variant="danger" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {review.productName}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{getStarRating(review.rating)}</div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                {review.title}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.content}
              </p>
            </div>

            {review.images.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((_image, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {review.helpful}
                  </Button>
                  <Button size="sm" variant="outline">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {review.notHelpful}
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  Order Value: ${review.orderValue}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {!review.replied && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-secondary-600 to-pink-600"
                    onClick={() => {
                      setSelectedReview(review.id);
                      setShowReplyModal(true);
                    }}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                )}
                {review.replied && <Badge variant="success">Replied</Badge>}
                <Button size="sm" variant="outline">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {review.replied && (
              <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                    You
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      Your Response
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Thank you for your honest feedback! We're glad you enjoyed
                      the product. Your review helps other customers make
                      informed decisions.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(review.date)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reply to Review</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Reply functionality will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowReplyModal(false)}>
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorReviews;
