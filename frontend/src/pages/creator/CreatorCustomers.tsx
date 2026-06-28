import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Crown,
  Shield,
  Eye,
  Edit,
  MoreHorizontal,
  Plus,
  UserPlus,
  Send,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
} from "lucide-react"; // Ensure Lucide React is installed
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button"; // Assuming a Button component
import Badge from "../../components/ui/Badge"; // Assuming a Badge component

// Define interfaces for better type safety
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  joinDate: string;
  lastActivity: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  status: "active" | "inactive" | "vip" | "blocked";
  segment: string;
  tags: string[];
  avatar?: string;
  notes?: string;
}

const CreatorCustomers: React.FC = () => {
  // Explicitly define as React.FC
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    Customer["status"] | "all"
  >("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof Customer>("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const itemsPerPage = 8; // Reduced items per page for a slightly tighter feel

  // Mock customer data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: "1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        location: { city: "New York", state: "NY", country: "USA" },
        joinDate: "2024-01-15",
        lastActivity: "2024-02-10",
        totalOrders: 12,
        totalSpent: 2450.0,
        averageOrderValue: 204.17,
        lifetimeValue: 2450.0,
        status: "vip",
        segment: "High-Value",
        tags: ["loyal", "fashion"],
        notes: "Prefers premium products, responds well to email campaigns",
      },
      {
        id: "2",
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@techcorp.com",
        phone: "+1 (555) 987-6543",
        location: { city: "San Francisco", state: "CA", country: "USA" },
        joinDate: "2024-02-01",
        lastActivity: "2024-02-09",
        totalOrders: 8,
        totalSpent: 1820.0,
        averageOrderValue: 227.5,
        lifetimeValue: 1820.0,
        status: "active",
        segment: "Regular",
        tags: ["tech", "bulk-buyer"],
        notes: "Business customer, prefers bulk orders",
      },
      {
        id: "3",
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@gmail.com",
        location: { city: "Austin", state: "TX", country: "USA" },
        joinDate: "2023-12-10",
        lastActivity: "2024-01-25",
        totalOrders: 5,
        totalSpent: 650.0,
        averageOrderValue: 130.0,
        lifetimeValue: 650.0,
        status: "inactive",
        segment: "At-Risk",
        tags: ["seasonal", "home-decor"],
        notes: "Haven't ordered in over 2 weeks, send re-engagement campaign",
      },
      {
        id: "4",
        firstName: "James",
        lastName: "Wilson",
        email: "james.w@example.com",
        phone: "+1 (555) 456-7890",
        location: { city: "Chicago", state: "IL", country: "USA" },
        joinDate: "2024-01-20",
        lastActivity: "2024-02-11",
        totalOrders: 15,
        totalSpent: 3200.0,
        averageOrderValue: 213.33,
        lifetimeValue: 3200.0,
        status: "vip",
        segment: "High-Value",
        tags: ["loyal", "frequent-buyer", "referrer"],
        notes: "Top customer, great referrer, provide exclusive offers",
      },
      {
        id: "5",
        firstName: "Lisa",
        lastName: "Rodriguez",
        email: "lisa.rodriguez@company.com",
        location: { city: "Miami", state: "FL", country: "USA" },
        joinDate: "2024-01-05",
        lastActivity: "2024-02-08",
        totalOrders: 3,
        totalSpent: 420.0,
        averageOrderValue: 140.0,
        lifetimeValue: 420.0,
        status: "active",
        segment: "New",
        tags: ["new-customer"],
        notes: "New customer, potential for growth",
      },
      {
        id: "6",
        firstName: "Robert",
        lastName: "Green",
        email: "rob.green@email.com",
        phone: "+1 (555) 111-2222",
        location: { city: "Seattle", state: "WA", country: "USA" },
        joinDate: "2023-11-01",
        lastActivity: "2024-02-15",
        totalOrders: 20,
        totalSpent: 4500.0,
        averageOrderValue: 225.0,
        lifetimeValue: 4500.0,
        status: "vip",
        segment: "High-Value",
        tags: ["tech-enthusiast", "reviewer"],
        notes:
          "Provided valuable feedback, actively engages with new products.",
      },
      {
        id: "7",
        firstName: "Patricia",
        lastName: "Jones",
        email: "patty.j@biz.net",
        location: { city: "Denver", state: "CO", country: "USA" },
        joinDate: "2024-01-28",
        lastActivity: "2024-02-12",
        totalOrders: 1,
        totalSpent: 85.0,
        averageOrderValue: 85.0,
        lifetimeValue: 85.0,
        status: "active",
        segment: "New",
        tags: ["first-time"],
        notes: "First purchase, follow up with welcome email.",
      },
      {
        id: "8",
        firstName: "David",
        lastName: "Lee",
        email: "dlee@marketing.com",
        phone: "+1 (555) 777-8888",
        location: { city: "Dallas", state: "TX", country: "USA" },
        joinDate: "2023-10-01",
        lastActivity: "2024-01-05",
        totalOrders: 10,
        totalSpent: 900.0,
        averageOrderValue: 90.0,
        lifetimeValue: 900.0,
        status: "inactive",
        segment: "At-Risk",
        tags: ["budget-conscious"],
        notes: "Often responds to discount offers.",
      },
      {
        id: "9",
        firstName: "Jessica",
        lastName: "Miller",
        email: "j.miller@artisan.com",
        location: { city: "Portland", state: "OR", country: "USA" },
        joinDate: "2024-02-18",
        lastActivity: "2024-02-28",
        totalOrders: 2,
        totalSpent: 110.0,
        averageOrderValue: 55.0,
        lifetimeValue: 110.0,
        status: "active",
        segment: "New",
        tags: ["handmade", "unique-finds"],
        notes: "Browses often, recently bought an artisan product.",
      },
      {
        id: "10",
        firstName: "Paul",
        lastName: "Martinez",
        email: "paulm@shop.net",
        phone: "+1 (555) 234-5678",
        location: { city: "Boston", state: "MA", country: "USA" },
        joinDate: "2023-09-01",
        lastActivity: "2023-12-20",
        totalOrders: 0,
        totalSpent: 0.0,
        averageOrderValue: 0.0,
        lifetimeValue: 0.0,
        status: "blocked",
        segment: "Blocked",
        tags: ["fraud"],
        notes: "Multiple suspicious orders, blocked.",
      },
      // Adding more for pagination testing
      {
        id: "11",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.g@test.com",
        location: { city: "Houston", state: "TX", country: "USA" },
        joinDate: "2023-08-10",
        lastActivity: "2024-02-20",
        totalOrders: 14,
        totalSpent: 2900.0,
        averageOrderValue: 207.14,
        lifetimeValue: 2900.0,
        status: "vip",
        segment: "High-Value",
        tags: ["tech", "loyal"],
        notes: "",
      },
      {
        id: "12",
        firstName: "Chris",
        lastName: "Brown",
        email: "chrisb@sample.com",
        location: { city: "London", state: "England", country: "UK" },
        joinDate: "2024-01-01",
        lastActivity: "2024-02-25",
        totalOrders: 7,
        totalSpent: 1200.0,
        averageOrderValue: 171.43,
        lifetimeValue: 1200.0,
        status: "active",
        segment: "Regular",
        tags: [],
        notes: "",
      },
      {
        id: "13",
        firstName: "Anna",
        lastName: "Smith",
        email: "anna.s@domain.com",
        location: { city: "Berlin", state: "Berlin", country: "Germany" },
        joinDate: "2023-12-05",
        lastActivity: "2024-01-15",
        totalOrders: 3,
        totalSpent: 300.0,
        averageOrderValue: 100.0,
        lifetimeValue: 300.0,
        status: "inactive",
        segment: "At-Risk",
        tags: [],
        notes: "",
      },
      {
        id: "14",
        firstName: "Alex",
        lastName: "Gomez",
        email: "alexg@example.org",
        location: { city: "Sydney", state: "NSW", country: "Australia" },
        joinDate: "2024-02-14",
        lastActivity: "2024-02-29",
        totalOrders: 2,
        totalSpent: 400.0,
        averageOrderValue: 200.0,
        lifetimeValue: 400.0,
        status: "active",
        segment: "New",
        tags: ["international"],
        notes: "",
      },
      {
        id: "15",
        firstName: "Emily",
        lastName: "Clark",
        email: "emily.c@email.net",
        location: { city: "Paris", state: "Ile-de-France", country: "France" },
        joinDate: "2023-07-22",
        lastActivity: "2024-01-10",
        totalOrders: 9,
        totalSpent: 750.0,
        averageOrderValue: 83.33,
        lifetimeValue: 750.0,
        status: "inactive",
        segment: "At-Risk",
        tags: [],
        notes: "",
      },
    ];

    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.location.state
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.location.country
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        selectedFilter === "all" || customer.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    // Sort customers
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // Fallback for unsupported types or null/undefined
      return 0;
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort/search change
  }, [customers, searchTerm, selectedFilter, sortBy, sortOrder]);

  const getStatusIcon = (status: Customer["status"]) => {
    // Use Customer['status'] for type safety
    switch (status) {
      case "vip":
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case "active":
        return <Users className="w-3 h-3 text-green-500" />;
      case "inactive":
        return <Users className="w-3 h-3 text-gray-400" />;
      case "blocked":
        return <Shield className="w-3 h-3 text-red-500" />;
      default:
        return <Users className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Customer["status"]) => {
    // Use Customer['status'] for type safety
    switch (status) {
      case "vip":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200";
    }
  };

  const handleSort = (field: keyof Customer) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc"); // Default to desc when changing sort field
    }
  };

  const getSortIcon = (field: keyof Customer) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="w-3 h-3 ml-1" />
    ) : (
      <SortDesc className="w-3 h-3 ml-1" />
    );
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Update counts for filters based on current `customers` state
  const filters = [
    { value: "all", label: "All Customers", count: customers.length },
    {
      value: "active",
      label: "Active",
      count: customers.filter((c) => c.status === "active").length,
    },
    {
      value: "vip",
      label: "VIP",
      count: customers.filter((c) => c.status === "vip").length,
    },
    {
      value: "inactive",
      label: "Inactive",
      count: customers.filter((c) => c.status === "inactive").length,
    },
    {
      value: "blocked",
      label: "Blocked",
      count: customers.filter((c) => c.status === "blocked").length,
    },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomers(paginatedCustomers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (
    e: React.ChangeEvent<HTMLInputElement>,
    customerId: string
  ) => {
    if (e.target.checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    }
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col w-full sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Customers
              </h1>
              <Crown className="w-5 h-5 text-yellow-500" />
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 text-xs shadow-sm">
                Pro
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your customer relationships and segments
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="px-3 py-1.5 text-xs">
              <Download className="w-3 h-3 mr-1.5" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-secondary-600 hover:bg-secondary-700 px-3 py-1.5 text-xs"
              onClick={() => console.log("Add Customer")}
            >
              <UserPlus className="w-3 h-3 mr-1.5" />
              Add Customer
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="p-4  bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Total Customers
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {customers.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  VIP Customers
                </p>
                <p className="text-xl font-bold text-yellow-600 mt-1">
                  {customers.filter((c) => c.status === "vip").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-md flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Avg. LTV
                </p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  $
                  {customers.length > 0
                    ? (
                        customers.reduce((sum, c) => sum + c.lifetimeValue, 0) /
                        customers.length
                      ).toFixed(0)
                    : "0"}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-xl font-bold text-secondary-600 mt-1">
                  $
                  {customers
                    .reduce((sum, c) => sum + c.totalSpent, 0)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                </p>
              </div>
              <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-md flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-secondary-600" />
              </div>
            </div>
          </Card>
        </div>
        {/* Filters and Search */}
        <Card className="p-4 w-full mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative my-0.5 ">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-3/4 pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-200"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setSelectedFilter(
                      filter.value as Customer["status"] | "all"
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                    selectedFilter === filter.value
                      ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 shadow-inner"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </Card>
        {/* Customer Table */}
        <Card className="overflow-hidden mt-6 w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto ">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedCustomers.length > 0 &&
                        selectedCustomers.length === paginatedCustomers.length
                      }
                      // Partially checked state
                      // indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < paginatedCustomers.length} // Might need custom component for this
                      className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500 w-3 h-3.5"
                    />
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap transition-colors duration-150"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center">
                      Customer {getSortIcon("firstName")}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Contact Info
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap transition-colors duration-150"
                    onClick={() => handleSort("totalOrders")}
                  >
                    <div className="flex items-center">
                      Orders {getSortIcon("totalOrders")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap transition-colors duration-150"
                    onClick={() => handleSort("lifetimeValue")}
                  >
                    <div className="flex items-center">
                      LTV {getSortIcon("lifetimeValue")}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(e, customer.id)}
                        className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500 w-3.5 h-3.5"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                          {customer.firstName[0]}
                          {customer.lastName[0]}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="space-y-1">
                        {customer.phone && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {customer.location.city}, {customer.location.state}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="space-y-1">
                        <div className="font-medium text-center">
                          {customer.totalOrders}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          ${customer.averageOrderValue.toFixed(0)} avg
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      $
                      {customer.lifetimeValue.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(customer.status)}
                        <Badge
                          className={`ml-1.5 text-xs ${getStatusColor(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1.5">
                        <Button
                          variant="outline"
                          size="icon-sm" // Smaller icon button
                          onClick={() => setSelectedCustomer(customer)}
                          className="w-7 h-7"
                          aria-label={`View details for ${customer.firstName} ${customer.lastName}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="w-7 h-7"
                          aria-label={`Email ${customer.firstName}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="w-7 h-7"
                          aria-label={`More options for ${customer.firstName}`}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <div className="text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCustomers.length
                  )}{" "}
                  of {filteredCustomers.length} customers
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1.5 text-xs"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {/* Render up to 3 pages centered around current page if many pages */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded text-xs transition-colors duration-150 ${
                              currentPage === page
                                ? "bg-secondary-600 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-1 text-gray-500 text-xs"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 py-1.5 text-xs"
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <Card className="p-3 bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800 shadow-md mt-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                {selectedCustomers.length} customer
                {selectedCustomers.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 py-1.5 text-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 py-1.5 text-xs"
                >
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                  Add Tags
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 py-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export Selected
                </Button>
              </div>
            </div>
          </Card>
        )}
        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 transform transition-all scale-95 duration-200 ease-out sm:scale-100">
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Customer Details
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    aria-label="Close customer details"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Customer Info */}
                  <div className="lg:col-span-1">
                    <Card className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-xs border border-gray-100 dark:border-gray-600">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shrink-0">
                          {selectedCustomer.firstName[0]}
                          {selectedCustomer.lastName[0]}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedCustomer.firstName}{" "}
                          {selectedCustomer.lastName}
                        </h3>
                        <div className="flex items-center justify-center mt-1">
                          {getStatusIcon(selectedCustomer.status)}
                          <Badge
                            className={`ml-1.5 text-xs ${getStatusColor(
                              selectedCustomer.status
                            )}`}
                          >
                            {selectedCustomer.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        {selectedCustomer.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                            <span>{selectedCustomer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                          <span>
                            {selectedCustomer.location.city},{" "}
                            {selectedCustomer.location.state},{" "}
                            {selectedCustomer.location.country}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                          <span>
                            Joined{" "}
                            {new Date(
                              selectedCustomer.joinDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedCustomer.lastActivity && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                            <span>
                              Last activity: {selectedCustomer.lastActivity}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4 border-t border-gray-100 dark:border-gray-600 pt-3">
                        {selectedCustomer.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 text-xs font-medium"
                          >
                            <Tag className="w-3 h-3 mr-1 text-gray-500" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Stats and Activity */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Card className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 shadow-xs border border-gray-100 dark:border-gray-600">
                        <div className="text-xl font-bold text-secondary-600">
                          {selectedCustomer.totalOrders}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total Orders
                        </div>
                      </Card>
                      <Card className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 shadow-xs border border-gray-100 dark:border-gray-600">
                        <div className="text-xl font-bold text-green-600">
                          $
                          {selectedCustomer.totalSpent.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total Spent
                        </div>
                      </Card>
                      <Card className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 shadow-xs border border-gray-100 dark:border-gray-600">
                        <div className="text-xl font-bold text-primary-600">
                          ${selectedCustomer.averageOrderValue.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Avg Order Value
                        </div>
                      </Card>
                      <Card className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 shadow-xs border border-gray-100 dark:border-gray-600">
                        <div className="text-xl font-bold text-orange-600">
                          $
                          {selectedCustomer.lifetimeValue.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Lifetime Value
                        </div>
                      </Card>
                    </div>

                    {/* Notes */}
                    {selectedCustomer.notes && (
                      <Card className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-xs border border-gray-100 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-md flex items-center space-x-2">
                          <Edit className="w-4 h-4 text-secondary-500" />
                          <span>Notes</span>
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {selectedCustomer.notes}
                        </p>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="sm"
                        className="bg-secondary-600 hover:bg-secondary-700 px-3 py-1.5 text-xs"
                        aria-label={`Send email to ${selectedCustomer.firstName}`}
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Send Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 py-1.5 text-xs"
                        aria-label={`Edit ${selectedCustomer.firstName}'s details`}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Edit Customer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 py-1.5 text-xs"
                        aria-label={`View orders from ${selectedCustomer.firstName}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                        View Orders
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 py-1.5 text-xs"
                        aria-label={`Add a new note for ${selectedCustomer.firstName}`}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorCustomers;
