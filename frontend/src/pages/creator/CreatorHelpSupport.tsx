import { useState, useEffect } from "react";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Mail,
  Globe,
  Play,
  Bookmark,
  ThumbsUp,
  Tag,
  Plus,
  Eye,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  views: number;
  lastUpdated: string;
  isExpanded?: boolean;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number;
  views: number;
  helpful: number;
  lastUpdated: string;
  tags: string[];
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  videoUrl: string;
  transcript?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
  createdAt: string;
  lastUpdated: string;
  responses: number;
}

const CreatorHelpSupport = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Mock FAQ data
    const mockFAQs: FAQ[] = [
      {
        id: "1",
        question: "How do I add products to my store?",
        answer:
          "To add products, go to Creator Dashboard > Products > Add Product. Fill in the product details including name, description, price, and images. You can also set inventory levels, shipping options, and SEO settings.",
        category: "Products",
        tags: ["products", "add", "inventory"],
        helpful: 245,
        views: 1890,
        lastUpdated: "2024-02-10",
      },
      {
        id: "2",
        question: "How do I process refunds and returns?",
        answer:
          "Navigate to Orders section, find the specific order, and click 'Process Refund'. You can issue full or partial refunds. For returns, create a return label and update the order status. The system will automatically notify the customer.",
        category: "Orders",
        tags: ["refunds", "returns", "orders"],
        helpful: 189,
        views: 1456,
        lastUpdated: "2024-02-08",
      },
      {
        id: "3",
        question: "What are the payment processing fees?",
        answer:
          "We charge 2.9% + $0.30 per transaction for credit card payments. PayPal transactions are 2.9% + $0.30. International cards have an additional 1.5% fee. Enterprise plans have reduced rates starting at 2.4%.",
        category: "Payments",
        tags: ["fees", "payments", "pricing"],
        helpful: 567,
        views: 3245,
        lastUpdated: "2024-02-12",
      },
      {
        id: "4",
        question: "How do I set up shipping rules?",
        answer:
          "Go to Settings > Shipping to configure your shipping zones, rates, and rules. You can set up flat rates, calculated shipping, or free shipping thresholds. Different rules can be applied based on product weight, destination, or order value.",
        category: "Shipping",
        tags: ["shipping", "rules", "setup"],
        helpful: 298,
        views: 2134,
        lastUpdated: "2024-02-09",
      },
      {
        id: "5",
        question: "Can I customize my store design?",
        answer:
          "Yes! Use our theme editor to customize colors, fonts, and layout. Pro and Enterprise plans offer additional customization options including custom CSS and HTML editing. You can also install third-party themes from our marketplace.",
        category: "Design",
        tags: ["design", "customization", "themes"],
        helpful: 423,
        views: 2987,
        lastUpdated: "2024-02-11",
      },
    ];

    const mockArticles: Article[] = [
      {
        id: "1",
        title: "Getting Started with Your Creator Dashboard",
        summary:
          "A comprehensive guide to understanding and navigating your creator dashboard for the first time.",
        content: "Complete guide content here...",
        category: "Getting Started",
        difficulty: "beginner",
        readTime: 5,
        views: 4521,
        helpful: 389,
        lastUpdated: "2024-02-10",
        tags: ["dashboard", "beginner", "setup"],
      },
      {
        id: "2",
        title: "Advanced Product Catalog Management",
        summary:
          "Learn how to efficiently manage large product catalogs, bulk operations, and inventory automation.",
        content: "Advanced guide content here...",
        category: "Products",
        difficulty: "advanced",
        readTime: 12,
        views: 2156,
        helpful: 198,
        lastUpdated: "2024-02-08",
        tags: ["products", "advanced", "catalog", "bulk"],
      },
      {
        id: "3",
        title: "SEO Optimization for Your Store",
        summary:
          "Best practices for optimizing your store for search engines and improving organic visibility.",
        content: "SEO guide content here...",
        category: "Marketing",
        difficulty: "intermediate",
        readTime: 8,
        views: 3287,
        helpful: 267,
        lastUpdated: "2024-02-09",
        tags: ["seo", "marketing", "optimization"],
      },
    ];

    const mockVideos: VideoTutorial[] = [
      {
        id: "1",
        title: "Store Setup Walkthrough",
        description:
          "Complete walkthrough of setting up your first store from scratch.",
        duration: "15:42",
        views: 8945,
        category: "Getting Started",
        difficulty: "beginner",
        thumbnail: "/api/placeholder/320/180",
        videoUrl: "#",
        transcript: "Video transcript content...",
      },
      {
        id: "2",
        title: "Advanced Analytics Deep Dive",
        description:
          "Understanding your store analytics and using data to make informed decisions.",
        duration: "23:18",
        views: 3456,
        category: "Analytics",
        difficulty: "advanced",
        thumbnail: "/api/placeholder/320/180",
        videoUrl: "#",
      },
      {
        id: "3",
        title: "Marketing Campaign Creation",
        description:
          "Step-by-step guide to creating effective marketing campaigns.",
        duration: "18:30",
        views: 5632,
        category: "Marketing",
        difficulty: "intermediate",
        thumbnail: "/api/placeholder/320/180",
        videoUrl: "#",
      },
    ];

    const mockTickets: SupportTicket[] = [
      {
        id: "1",
        subject: "Payment gateway integration issue",
        status: "in-progress",
        priority: "high",
        category: "Technical",
        createdAt: "2024-02-10T10:30:00Z",
        lastUpdated: "2024-02-11T14:20:00Z",
        responses: 3,
      },
      {
        id: "2",
        subject: "Bulk product upload not working",
        status: "resolved",
        priority: "normal",
        category: "Products",
        createdAt: "2024-02-08T09:15:00Z",
        lastUpdated: "2024-02-09T16:45:00Z",
        responses: 5,
      },
    ];

    setFaqs(mockFAQs);
    setArticles(mockArticles);
    setVideos(mockVideos);
    setTickets(mockTickets);
  }, []);

  const categories = [
    "Getting Started",
    "Products",
    "Orders",
    "Payments",
    "Shipping",
    "Marketing",
    "Analytics",
    "Design",
    "Technical",
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "normal":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Help & Support
            </h1>
            <HelpCircle className="w-6 h-6 text-primary-500" />
            <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Free Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers, tutorials, and get help with your store
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Book className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button
            onClick={() => console.log("Contact support")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit overflow-x-auto">
        {["overview", "faq", "articles", "videos", "support"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("faq")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quick answers to common questions
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("articles")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Knowledge Base
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    In-depth guides and tutorials
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("videos")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Video Tutorials
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Step-by-step video guides
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("support")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Contact Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get personal assistance
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Popular Articles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Articles
            </h3>
            <div className="space-y-4">
              {articles.slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {article.readTime} min read •{" "}
                        {article.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Live Chat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get instant help from our support team
              </p>
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                Start Chat
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Email Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Send us a detailed message
              </p>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Community Forum
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Connect with other creators
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Forum
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredFAQs.length} questions found
              </p>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {faq.views.toLocaleString()} views
                        </span>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">
                            {faq.helpful}
                          </span>
                        </div>
                      </div>
                    </div>
                    {faq.isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {faq.isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="pt-4">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>

                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last updated:{" "}
                            {new Date(faq.lastUpdated).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful ({faq.helpful})
                            </Button>
                            <Button size="sm" variant="outline">
                              <Bookmark className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">{article.helpful}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {video.title}
                    </h3>
                    <Badge className={getDifficultyColor(video.difficulty)}>
                      {video.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views.toLocaleString()}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Support Tickets */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Support Tickets
                </h3>
                <Button onClick={() => console.log("New ticket")} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {ticket.subject}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>#{ticket.id}</span>
                        <Badge variant="secondary" className="text-xs">
                          {ticket.category}
                        </Badge>
                        <span>{ticket.responses} responses</span>
                      </div>
                      <span>
                        {new Date(ticket.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                {tickets.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No support tickets yet</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Live Chat
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Available 24/7 for instant support
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-primary-600 hover:bg-primary-700"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Email Support
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      support@platform.com
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Community Forum
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connect with other creators
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Forum
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorHelpSupport;
