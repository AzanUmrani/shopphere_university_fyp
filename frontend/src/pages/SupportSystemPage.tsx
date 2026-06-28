import { useState } from "react";
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Upload,
  Tag,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Card from "../components/ui/Card";

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created: string;
  lastUpdate: string;
  category: string;
}

const SupportSystemPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    attachments: [],
  });

  const supportMethods = [
    {
      title: "Live Chat",
      description:
        "Get instant help from our AI chatbot or connect with a human agent",
      icon: MessageCircle,
      availability: "24/7 Available",
      color: "from-green-500 to-green-600",
      responseTime: "Instant response",
      action: "Start Chat",
      recommended: true,
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      icon: Phone,
      availability: "Mon-Fri 9AM-6PM EST",
      color: "from-primary-500 to-primary-600",
      responseTime: "Average wait: 2 mins",
      action: "Call +1 (555) 123-4567",
    },
    {
      title: "Email Support",
      description: "Send detailed inquiries and get comprehensive responses",
      icon: Mail,
      availability: "24/7 Monitored",
      color: "from-secondary-500 to-secondary-600",
      responseTime: "Within 4 hours",
      action: "Send Email",
    },
    {
      title: "Support Ticket",
      description: "Create a ticket for complex issues that need tracking",
      icon: Tag,
      availability: "24/7 Submission",
      color: "from-orange-500 to-orange-600",
      responseTime: "Within 24 hours",
      action: "Create Ticket",
    },
  ];

  const sampleTickets: SupportTicket[] = [
    {
      id: "TKT-001234",
      subject: "Unable to process payment",
      status: "in-progress",
      priority: "high",
      created: "2025-01-15",
      lastUpdate: "2025-01-16",
      category: "Payment Issues",
    },
    {
      id: "TKT-001235",
      subject: "Product not delivered",
      status: "open",
      priority: "medium",
      created: "2025-01-14",
      lastUpdate: "2025-01-14",
      category: "Shipping",
    },
    {
      id: "TKT-001236",
      subject: "Account access problems",
      status: "resolved",
      priority: "low",
      created: "2025-01-12",
      lastUpdate: "2025-01-13",
      category: "Account",
    },
  ];

  const categories = [
    "Order Issues",
    "Payment Problems",
    "Shipping & Delivery",
    "Returns & Refunds",
    "Account Access",
    "Technical Issues",
    "Product Questions",
    "Other",
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { value: "high", label: "High", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400" },
    { value: "urgent", label: "Urgent", color: "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-primary-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Check if form is complete
  const isTicketFormComplete =
    ticketForm.subject?.trim() &&
    ticketForm.category &&
    ticketForm.description?.trim();

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTicketFormComplete) {
      alert("Please fill in all required fields (Subject, Category, Description)");
      return;
    }
    console.log("Ticket submitted:", ticketForm);
    alert(
      "Support ticket created successfully! You will receive a confirmation email shortly."
    );
    setTicketForm({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
      attachments: [],
    });
  };

  const tabs = [
    { id: "overview", label: "Support Overview", icon: Headphones },
    { id: "tickets", label: "My Tickets", icon: Tag },
    { id: "create", label: "Create Ticket", icon: Send },
    { id: "contact", label: "Contact Options", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-pink-50 to-primary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 via-pink-600 to-primary-600 dark:from-secondary-900 dark:via-fuchsia-900 dark:to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Support Center</h1>
            <p className="text-secondary-100 dark:text-secondary-200/80 text-lg max-w-2xl mx-auto">
              Get the help you need with our comprehensive support system. We're
              here 24/7 to assist you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-t-2xl">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-secondary-500 text-secondary-600 dark:text-secondary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Choose Your Support Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`relative p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group ${
                      method.recommended ? "ring-2 ring-secondary-200 dark:ring-secondary-900/50" : ""
                    }`}
                  >
                    {method.recommended && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-gradient-to-r from-secondary-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {method.availability}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {method.responseTime}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {method.description}
                    </p>

                    <button className="w-full bg-gradient-to-r from-secondary-500 to-pink-500 text-white py-2 px-4 rounded-xl font-medium hover:from-secondary-600 hover:to-pink-600 transition-all duration-200">
                      {method.action}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  &lt; 2 mins
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Average Response Time</p>
              </Card>

              <Card className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</h3>
                <p className="text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
              </Card>

              <Card className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl text-center">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">98%</h3>
                <p className="text-gray-600 dark:text-gray-400">Issues Resolved</p>
              </Card>
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === "tickets" && (
          <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Support Tickets
              </h2>
              <button
                onClick={() => setActiveTab("create")}
                className="bg-gradient-to-r from-secondary-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:from-secondary-600 hover:to-pink-600 transition-all duration-200"
              >
                Create New Ticket
              </button>
            </div>

            <div className="space-y-4">
              {sampleTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {ticket.subject}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ticket ID: {ticket.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          priorities.find((p) => p.value === ticket.priority)
                            ?.color
                        }`}
                      >
                        {ticket.priority.charAt(0).toUpperCase() +
                          ticket.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium dark:text-gray-300">Status:</span>
                      <p className="capitalize">
                        {ticket.status.replace("-", " ")}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium dark:text-gray-300">Category:</span>
                      <p>{ticket.category}</p>
                    </div>
                    <div>
                      <span className="font-medium dark:text-gray-300">Created:</span>
                      <p>{ticket.created}</p>
                    </div>
                    <div>
                      <span className="font-medium dark:text-gray-300">Last Update:</span>
                      <p>{ticket.lastUpdate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-medium text-sm">
                      View Details
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Create Ticket Tab */}
        {activeTab === "create" && (
          <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Create Support Ticket
            </h2>

            <form onSubmit={handleSubmitTicket} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:text-white placeholder:dark:text-gray-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:text-white"
                  >
                    <option value="" className="dark:bg-slate-900">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="dark:bg-slate-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorities.map((priority) => (
                    <label key={priority.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={ticketForm.priority === priority.value}
                        onChange={(e) =>
                          setTicketForm({
                            ...ticketForm,
                            priority: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          ticketForm.priority === priority.value
                            ? `border-secondary-500 ${priority.color}`
                            : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-600"
                        }`}
                      >
                        {priority.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:text-white placeholder:dark:text-gray-500"
                  placeholder="Please provide detailed information..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-secondary-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drop files here or{" "}
                    <button
                      type="button"
                      className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Supported formats: JPG, PNG, PDF, DOC (Max 10MB)
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700 gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                  You'll receive email updates about your ticket progress.
                </p>
                {isTicketFormComplete ? (
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-secondary-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-secondary-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Submit Ticket
                  </button>
                ) : (
                  <div className="w-full md:w-auto text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    ↑ Fill all required fields to continue
                  </div>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* Contact Options Tab */}
        {activeTab === "contact" && (
          <div className="space-y-8">
            <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Email Support
                  </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">support@shopsphere.com</p>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Available 24/7</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Instant responses</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-r from-secondary-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 border border-secondary-200/50 dark:border-secondary-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Emergency Support
              </h2>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500 mr-3" />
                  <h3 className="font-semibold text-red-900 dark:text-red-400">
                    Critical Issues
                  </h3>
                </div>
                <p className="text-red-700 dark:text-red-400/80 mb-4">
                  For account security breaches, payment fraud, or other urgent
                  matters:
                </p>
                <div className="space-y-2">
                  <p className="text-red-700 dark:text-red-400">
                    <strong className="dark:text-red-500">Emergency Hotline:</strong> +1 (555) 911-HELP
                  </p>
                  <p className="text-red-700 dark:text-red-400">
                    <strong className="dark:text-red-500">Priority Email:</strong> emergency@shopsphere.com
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-500/80">
                    Available 24/7 with immediate response guarantee
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportSystemPage;
