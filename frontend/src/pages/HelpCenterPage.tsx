import { useState } from "react";
import {
  Search,
  HelpCircle,
  Package,
  Truck,
  Shield,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Settings,
  User,
  ShoppingCart,
} from "lucide-react";
import Card from "../components/ui/Card";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen, color: "text-secondary-600 dark:text-secondary-400" },
    {
      id: "orders",
      name: "Orders & Payment",
      icon: ShoppingCart,
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      id: "shipping",
      name: "Shipping & Delivery",
      icon: Truck,
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "returns",
      name: "Returns & Refunds",
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      id: "account",
      name: "Account & Profile",
      icon: User,
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      id: "security",
      name: "Security & Privacy",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
    },
    {
      id: "technical",
      name: "Technical Support",
      icon: Settings,
      color: "text-gray-600 dark:text-gray-400",
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive a tracking number via email once your order ships. Use this number on our tracking page or the carrier's website for real-time updates.",
      category: "orders",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment system.",
      category: "orders",
    },
    {
      id: 3,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping arrives the next business day. Free shipping is available on orders over $100.",
      category: "shipping",
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in original packaging. Return shipping fees may apply unless the item was defective. Refunds are processed within 3-5 business days after we receive your return.",
      category: "returns",
    },
    {
      id: 5,
      question: "How do I change my shipping address?",
      answer:
        "You can update your shipping address in your account settings under 'Shipping Addresses'. If your order has already shipped, please contact customer service immediately as address changes may not be possible.",
      category: "shipping",
    },
    {
      id: 6,
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures to protect your personal information. We never share your data with third parties without your consent. Read our Privacy Policy for more details.",
      category: "security",
    },
    {
      id: 7,
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. If you don't see it, check your spam folder.",
      category: "account",
    },
    {
      id: 8,
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled within 1 hour of placement if they haven't been processed. After processing begins, cancellation may not be possible. Contact customer service immediately if you need to cancel an order.",
      category: "orders",
    },
    {
      id: 9,
      question: "Why is my website running slowly?",
      answer:
        "Slow performance can be caused by internet connection, browser cache, or high traffic. Try clearing your browser cache, disabling extensions, or using a different browser. Contact technical support if issues persist.",
      category: "technical",
    },
    {
      id: 10,
      question: "How do I update my account information?",
      answer:
        "Log into your account and go to 'Account Settings'. You can update your personal information, email address, phone number, and preferences. Changes are saved automatically.",
      category: "account",
    },
  ];

  const quickActions = [
    {
      title: "Track Your Order",
      description: "Get real-time updates on your shipment",
      icon: Package,
      color: "from-primary-500 to-primary-600",
      action: "Track Now",
    },
    {
      title: "Start a Return",
      description: "Easy returns within 30 days",
      icon: Package,
      color: "from-green-500 to-green-600",
      action: "Return Item",
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      color: "from-secondary-500 to-secondary-600",
      action: "Chat Now",
    },
    {
      title: "Manage Account",
      description: "Update your profile and settings",
      icon: User,
      color: "from-orange-500 to-orange-600",
      action: "Go to Account",
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Available 24/7 for immediate help",
      icon: MessageCircle,
      color: "text-green-600 dark:text-green-400",
      action: "Start Chat",
    },
    {
      title: "Phone Support",
      description: "Call us at +1 (555) 123-4567",
      icon: Phone,
      color: "text-primary-600 dark:text-primary-400",
      action: "Call Now",
    },
    {
      title: "Email Support",
      description: "support@shopsphere.com",
      icon: Mail,
      color: "text-secondary-600 dark:text-secondary-400",
      action: "Send Email",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#f8fafc_100%)] dark:bg-[linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 shadow-lg shadow-primary-500/20">
              <HelpCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Help Center</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions, tutorials, and get support when
              you need it.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white/90 py-4 pl-12 pr-6 text-gray-900 placeholder-gray-500 outline-none ring-0 focus:border-primary-400 dark:border-gray-700 dark:bg-gray-800/90 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {action.description}
                </p>
                <button className="text-secondary-600 dark:text-secondary-400 font-medium text-sm hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors">
                  {action.action} →
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl sticky top-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                      selectedCategory === category.id
                        ? "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-800/50"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <category.icon
                      className={`w-5 h-5 mr-3 ${category.color}`}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQ Section */}
            <Card className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No FAQs found matching your search.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white text-left">
                          {faq.question}
                        </h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-r from-secondary-50 to-pink-50 dark:from-secondary-900/10 dark:to-pink-900/10 border border-secondary-200/50 dark:border-secondary-800/30 shadow-xl">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-6 h-6 text-secondary-600 dark:text-secondary-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Still Need Help?
                </h2>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Can't find what you're looking for? Our support team is here to
                help you 24/7.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-white/10"
                  >
                    <div className="flex items-center mb-3">
                      <option.icon className={`w-5 h-5 ${option.color} mr-2`} />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {option.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {option.description}
                    </p>
                    <button className="text-secondary-600 dark:text-secondary-400 font-medium text-sm hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors">
                      {option.action} →
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                  <h4 className="font-semibold text-primary-900 dark:text-primary-200">Support Hours</h4>
                </div>
                <div className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                  <p>• Live Chat: 24/7 (AI-powered with human escalation)</p>
                  <p>• Phone Support: Mon-Fri 9AM-6PM EST</p>
                  <p>• Email Support: Responses within 24 hours</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
