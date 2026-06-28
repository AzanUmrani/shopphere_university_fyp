import { useState, useEffect } from "react";
import {
  Share2,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  TrendingUp,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Crown,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Users,
  Search,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface SocialPost {
  id: string;
  title: string;
  content: string;
  type: "text" | "image" | "video" | "carousel" | "story";
  platforms: ("instagram" | "twitter" | "facebook" | "youtube" | "linkedin")[];
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledFor?: string;
  publishedAt?: string;
  mediaUrls?: string[];
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    impressions: number;
    reach: number;
    saves?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SocialAccount {
  platform: "instagram" | "twitter" | "facebook" | "youtube" | "linkedin";
  username: string;
  isConnected: boolean;
  followers: number;
  engagement_rate: number;
  posts_count: number;
}

const CreatorSocialMedia = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");

  // Mock data
  useEffect(() => {
    const mockAccounts: SocialAccount[] = [
      {
        platform: "instagram",
        username: "@mystore",
        isConnected: true,
        followers: 15420,
        engagement_rate: 3.2,
        posts_count: 486,
      },
      {
        platform: "twitter",
        username: "@mystore_official",
        isConnected: true,
        followers: 8950,
        engagement_rate: 2.8,
        posts_count: 1250,
      },
      {
        platform: "facebook",
        username: "My Store Official",
        isConnected: true,
        followers: 22340,
        engagement_rate: 4.1,
        posts_count: 328,
      },
      {
        platform: "youtube",
        username: "My Store Channel",
        isConnected: false,
        followers: 0,
        engagement_rate: 0,
        posts_count: 0,
      },
      {
        platform: "linkedin",
        username: "My Store Company",
        isConnected: false,
        followers: 0,
        engagement_rate: 0,
        posts_count: 0,
      },
    ];

    const mockPosts: SocialPost[] = [
      {
        id: "1",
        title: "New Product Launch",
        content:
          "Exciting news! Our new summer collection is now available. Check out these amazing designs that will make your summer unforgettable! 🌞✨ #SummerCollection #NewLaunch #Fashion",
        type: "image",
        platforms: ["instagram", "facebook"],
        status: "published",
        publishedAt: "2024-02-10T10:00:00Z",
        mediaUrls: ["/api/placeholder/400/400"],
        hashtags: ["#SummerCollection", "#NewLaunch", "#Fashion"],
        engagement: {
          likes: 245,
          comments: 32,
          shares: 18,
          clicks: 89,
          impressions: 3450,
          reach: 2890,
          saves: 67,
        },
        createdAt: "2024-02-09T15:30:00Z",
        updatedAt: "2024-02-10T10:00:00Z",
      },
      {
        id: "2",
        title: "Behind the Scenes",
        content:
          "Take a look behind the scenes of our photoshoot! Our talented team working hard to bring you the best content. What's your favorite setup? 📸✨",
        type: "video",
        platforms: ["instagram", "twitter", "facebook"],
        status: "published",
        publishedAt: "2024-02-08T14:30:00Z",
        mediaUrls: ["/api/placeholder/400/300"],
        hashtags: ["#BehindTheScenes", "#Team", "#Photography"],
        engagement: {
          likes: 189,
          comments: 28,
          shares: 45,
          clicks: 156,
          impressions: 4200,
          reach: 3650,
          saves: 89,
        },
        createdAt: "2024-02-07T12:00:00Z",
        updatedAt: "2024-02-08T14:30:00Z",
      },
      {
        id: "3",
        title: "Customer Spotlight",
        content:
          "Customer spotlight! Thanks to @sarah_m for sharing her amazing style with our products. Tag us to be featured! 🌟 #CustomerSpotlight #Style",
        type: "image",
        platforms: ["instagram"],
        status: "scheduled",
        scheduledFor: "2024-02-15T16:00:00Z",
        mediaUrls: ["/api/placeholder/400/500"],
        hashtags: ["#CustomerSpotlight", "#Style", "#Community"],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
          impressions: 0,
          reach: 0,
          saves: 0,
        },
        createdAt: "2024-02-12T09:15:00Z",
        updatedAt: "2024-02-12T09:15:00Z",
      },
      {
        id: "4",
        title: "Tips Tuesday",
        content:
          "Tips Tuesday! Here are 5 styling tips to elevate your wardrobe this season. Save this post for later reference! 💫 Which tip will you try first?",
        type: "carousel",
        platforms: ["instagram", "facebook"],
        status: "draft",
        mediaUrls: [
          "/api/placeholder/400/400",
          "/api/placeholder/400/400",
          "/api/placeholder/400/400",
        ],
        hashtags: ["#TipsTuesday", "#StylingTips", "#Fashion"],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
          impressions: 0,
          reach: 0,
          saves: 0,
        },
        createdAt: "2024-02-11T11:45:00Z",
        updatedAt: "2024-02-11T11:45:00Z",
      },
      {
        id: "5",
        title: "Flash Sale Alert",
        content:
          "⚡ FLASH SALE ALERT! 24 hours only - 30% off selected items. Use code FLASH30 at checkout. Don't miss out! Link in bio 🔥 #FlashSale #Discount",
        type: "text",
        platforms: ["twitter", "facebook"],
        status: "published",
        publishedAt: "2024-02-06T09:00:00Z",
        hashtags: ["#FlashSale", "#Discount", "#LimitedTime"],
        engagement: {
          likes: 156,
          comments: 42,
          shares: 89,
          clicks: 234,
          impressions: 5600,
          reach: 4200,
        },
        createdAt: "2024-02-05T20:30:00Z",
        updatedAt: "2024-02-06T09:00:00Z",
      },
    ];

    setAccounts(mockAccounts);
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesPlatform =
      filterPlatform === "all" ||
      post.platforms.includes(filterPlatform as any);

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "twitter":
        return Twitter;
      case "facebook":
        return Facebook;
      case "youtube":
        return Youtube;
      case "linkedin":
        return Linkedin;
      default:
        return Share2;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "text-pink-600 bg-pink-100 dark:bg-pink-900/30";
      case "twitter":
        return "text-primary-600 bg-primary-100 dark:bg-primary-900/30";
      case "facebook":
        return "text-primary-700 bg-primary-100 dark:bg-primary-900/30";
      case "youtube":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "linkedin":
        return "text-primary-800 bg-primary-100 dark:bg-primary-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "scheduled":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "text":
        return FileText;
      case "carousel":
        return ImageIcon;
      case "story":
        return Clock;
      default:
        return FileText;
    }
  };

  const connectedAccounts = accounts.filter((acc) => acc.isConnected);
  const totalFollowers = connectedAccounts.reduce(
    (sum, acc) => sum + acc.followers,
    0
  );
  const averageEngagement =
    connectedAccounts.length > 0
      ? connectedAccounts.reduce((sum, acc) => sum + acc.engagement_rate, 0) /
        connectedAccounts.length
      : 0;
  const totalPosts = connectedAccounts.reduce(
    (sum, acc) => sum + acc.posts_count,
    0
  );
  const totalEngagement = posts.reduce(
    (sum, post) =>
      sum +
      post.engagement.likes +
      post.engagement.comments +
      post.engagement.shares,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Social Media
            </h1>
            <Share2 className="w-6 h-6 text-primary-500" />
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pro Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your social media presence across all platforms
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Content Calendar
          </Button>
          <Button
            onClick={() => console.log("Create post")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["overview", "posts", "accounts", "analytics", "scheduler"].map(
          (tab) => (
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
          )
        )}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Followers
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    {totalFollowers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Engagement
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {averageEngagement.toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {totalPosts.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Engagement
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalEngagement.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Connected Platforms */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connected Platforms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);
                const colorClass = getPlatformColor(account.platform);

                return (
                  <div
                    key={account.platform}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      account.isConnected
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {account.isConnected ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Connected
                        </Badge>
                      ) : (
                        <Button size="sm">Connect</Button>
                      )}
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                      {account.platform}
                    </h4>

                    {account.isConnected ? (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {account.username}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Followers:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {account.followers.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Engagement:</span>
                            <span className="font-medium text-green-600">
                              {account.engagement_rate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Posts:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {account.posts_count}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Connect to manage posts
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Posts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Posts Performance
            </h3>
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {post.platforms.map((platform) => {
                          const Icon = getPlatformIcon(platform);
                          return (
                            <Icon
                              key={platform}
                              className="w-4 h-4 text-gray-500"
                            />
                          );
                        })}
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-red-600">
                        {post.engagement.likes}
                      </p>
                      <p className="text-gray-500">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-primary-600">
                        {post.engagement.comments}
                      </p>
                      <p className="text-gray-500">Comments</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">
                        {post.engagement.shares}
                      </p>
                      <p className="text-gray-500">Shares</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-secondary-600">
                        {post.engagement.reach}
                      </p>
                      <p className="text-gray-500">Reach</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => {
              const TypeIcon = getTypeIcon(post.type);

              return (
                <Card
                  key={post.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {post.platforms.map((platform) => {
                            const Icon = getPlatformIcon(platform);
                            const colorClass = getPlatformColor(platform);
                            return (
                              <div
                                key={platform}
                                className={`w-6 h-6 rounded flex items-center justify-center ${colorClass}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPost(post)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-1 rounded-full"
                        >
                          {hashtag}
                        </span>
                      ))}
                      {post.hashtags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{post.hashtags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {post.status === "scheduled" && post.scheduledFor && (
                    <div className="flex items-center space-x-2 text-sm text-primary-600 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Scheduled for{" "}
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {post.status === "published" && (
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-red-600">
                          {post.engagement.likes}
                        </p>
                        <p className="text-gray-500 text-xs">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary-600">
                          {post.engagement.comments}
                        </p>
                        <p className="text-gray-500 text-xs">Comments</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-green-600">
                          {post.engagement.shares}
                        </p>
                        <p className="text-gray-500 text-xs">Shares</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-secondary-600">
                          {post.engagement.reach}
                        </p>
                        <p className="text-gray-500 text-xs">Reach</p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "accounts" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Social Media Accounts
            </h3>
            <div className="space-y-4">
              {accounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);
                const colorClass = getPlatformColor(account.platform);

                return (
                  <div
                    key={account.platform}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                          {account.platform}
                        </h4>
                        {account.isConnected ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.username}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Not connected
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {account.isConnected ? (
                        <>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {account.followers.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Followers
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">
                              {account.engagement_rate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Engagement
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-secondary-600">
                              {account.posts_count}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Posts
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button className="bg-primary-600 hover:bg-primary-700">
                          Connect Account
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">
                {posts
                  .reduce((sum, p) => sum + p.engagement.impressions, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Impressions
              </div>
            </Card>

            <Card className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {posts
                  .reduce((sum, p) => sum + p.engagement.reach, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Reach
              </div>
            </Card>

            <Card className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {posts.reduce((sum, p) => sum + p.engagement.likes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes
              </div>
            </Card>

            <Card className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary-600">
                {posts.reduce((sum, p) => sum + p.engagement.comments, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Comments
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Performance
            </h3>
            <div className="space-y-4">
              {connectedAccounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);
                const colorClass = getPlatformColor(account.platform);

                return (
                  <div
                    key={account.platform}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                          {account.platform}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {account.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-primary-600">
                          {account.followers.toLocaleString()}
                        </p>
                        <p className="text-gray-500">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-green-600">
                          {account.engagement_rate.toFixed(1)}%
                        </p>
                        <p className="text-gray-500">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-secondary-600">
                          {account.posts_count}
                        </p>
                        <p className="text-gray-500">Posts</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "scheduler" && (
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Content Scheduler
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Schedule your posts across all connected platforms
            </p>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Calendar className="w-4 h-4 mr-2" />
              Open Calendar View
            </Button>
          </Card>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedPost.title}
                    </h2>
                    <Badge className={getStatusColor(selectedPost.status)}>
                      {selectedPost.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Content
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {selectedPost.content}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Platforms
                  </h4>
                  <div className="flex items-center space-x-2">
                    {selectedPost.platforms.map((platform) => {
                      const Icon = getPlatformIcon(platform);
                      const colorClass = getPlatformColor(platform);
                      return (
                        <div
                          key={platform}
                          className={`w-8 h-8 rounded flex items-center justify-center ${colorClass}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedPost.hashtags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-3 py-1 rounded-full"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.status === "published" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Engagement Metrics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary-600">
                          {selectedPost.engagement.impressions.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Impressions</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedPost.engagement.reach.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {selectedPost.engagement.likes}
                        </div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-secondary-600">
                          {selectedPost.engagement.comments}
                        </div>
                        <div className="text-xs text-gray-500">Comments</div>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorSocialMedia;
