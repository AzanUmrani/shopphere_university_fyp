import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEllipsisH,
  FaGift,
  FaPercent,
  FaTag,
  FaTimes,
} from "react-icons/fa";

// --- Type Definitions ---
interface Coupon {
  id: string;
  name: string;
  code: string;
  status: "Active" | "Scheduled" | "Expired";
  discount: string;
  type: "Percentage" | "Fixed";
  usage: number;
  limit: number;
  createdAt: string;
}

interface Discount {
  id: string;
  title: string;
  description: string;
  percent: number;
  status: "Active" | "Draft" | "Ended";
  startDate: string;
  endDate: string;
  products: number;
}

// --- Sample Data ---
const initialCoupons: Coupon[] = [
  {
    id: "c1",
    name: "Summer Sale",
    code: "SUMMER25",
    status: "Active",
    discount: "25%",
    type: "Percentage",
    usage: 120,
    limit: 500,
    createdAt: "2025-07-01",
  },
  {
    id: "c2",
    name: "First Order",
    code: "WELCOME50",
    status: "Scheduled",
    discount: "50%",
    type: "Percentage",
    usage: 0,
    limit: 100,
    createdAt: "2025-08-20",
  },
  {
    id: "c3",
    name: "Second Order",
    code: "WELCOME100",
    status: "Active",
    discount: "70%",
    type: "Percentage",
    usage: 0,
    limit: 100,
    createdAt: "2025-08-20",
  },
  {
    id: "c4",
    name: "Flash Order",
    code: "Winter Sale",
    status: "Scheduled",
    discount: "30%",
    type: "Percentage",
    usage: 0,
    limit: 100,
    createdAt: "2025-08-20",
  },
];

const initialDiscounts: Discount[] = [
  {
    id: "d1",
    title: "Black Friday Mega Sale",
    description: "Huge discounts on all electronics!",
    percent: 80,
    status: "Active",
    startDate: "2025-08-25",
    endDate: "2025-09-10",
    products: 320,
  },
  {
    id: "d2",
    title: "New Year Sale",
    description: "Start the year with amazing offers.",
    percent: 60,
    status: "Draft",
    startDate: "2025-12-28",
    endDate: "2026-01-05",
    products: 150,
  },
  {
    id: "d3",
    title: "Eid Mega Sale",
    description: "Huge discounts on all electronics!",
    percent: 40,
    status: "Active",
    startDate: "2025-08-25",
    endDate: "2025-09-10",
    products: 320,
  },
  {
    id: "d4",
    title: "Mega Sale",
    description: "Start the year with amazing offers.",
    percent: 50,
    status: "Draft",
    startDate: "2025-12-28",
    endDate: "2026-01-05",
    products: 150,
  },
];

// --- Main Component ---
const DiscountsCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"coupon" | "discount">("coupon");
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // --- Filtering ---
  const filteredCoupons = coupons.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiscounts = discounts.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  // --- Status Badge ---
  const statusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Scheduled":
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Expired":
      case "Ended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // --- Handlers ---
  const handleOpenModal = (type: "coupon" | "discount", item: any = null) => {
    setModalType(type);
    setEditItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (modalType === "coupon") {
      if (editItem) {
        // update
        setCoupons((prev) =>
          prev.map((c) => (c.id === editItem.id ? { ...formData } : c))
        );
      } else {
        // add new
        setCoupons((prev) => [
          ...prev,
          {
            ...formData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
    } else {
      if (editItem) {
        setDiscounts((prev) =>
          prev.map((d) => (d.id === editItem.id ? { ...formData } : d))
        );
      } else {
        setDiscounts((prev) => [
          ...prev,
          { ...formData, id: Date.now().toString() },
        ]);
      }
    }
    handleCloseModal();
  };

  const handleDelete = (type: "coupon" | "discount", id: string) => {
    if (type === "coupon") {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
          <FaGift className="text-pink-500" /> Discounts & Coupons
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal("coupon")}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <FaPlus /> New Coupon
          </button>
          <button
            onClick={() => handleOpenModal("discount")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <FaPlus /> New Discount
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2 mb-6 border border-transparent dark:border-gray-700 transition-all">
        <FaSearch className="text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search coupons or discounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-transparent border-none placeholder-gray-400 outline-none focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Coupons Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8 border border-transparent dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 px-4 py-3">
          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <FaTag className="text-orange-500" /> Coupons
          </h2>
          <FaEllipsisH className="text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{coupon.name}</td>
                  <td className="p-3 font-mono">{coupon.code}</td>
                  <td className="p-3">{coupon.discount}</td>
                  <td className="p-3">{coupon.usage}/{coupon.limit}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(coupon.status)}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="p-3">{coupon.createdAt}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleOpenModal("coupon", coupon)} className="text-primary-600 dark:text-primary-400 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete("coupon", coupon.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discounts Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-transparent dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 px-4 py-3">
          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <FaPercent className="text-green-500" /> Discounts
          </h2>
          <FaEllipsisH className="text-gray-500 cursor-pointer" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4">
          {filteredDiscounts.map((discount) => (
            <div key={discount.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700/20 transition-all">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{discount.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(discount.status)}`}>
                  {discount.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{discount.description}</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-2">{discount.percent}% OFF</p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {discount.startDate} → {discount.endDate}
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Products: {discount.products}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal("discount", discount)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete("discount", discount.id)} className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-transparent dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {editItem ? "Edit" : "Add"} {modalType === "coupon" ? "Coupon" : "Discount"}
            </h2>

            <div className="space-y-4">
              {modalType === "coupon" ? (
                <>
                  <input type="text" placeholder="Name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="text" placeholder="Code" value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="text" placeholder="Discount (e.g. 10% or $5)" value={formData.discount || ""} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="number" placeholder="Usage Limit" value={formData.limit || ""} onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                </>
              ) : (
                <>
                  <input type="text" placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="text" placeholder="Description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="number" placeholder="Percent Off" value={formData.percent || ""} onChange={(e) => setFormData({ ...formData, percent: Number(e.target.value) })} 
                    className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Start Date" value={formData.startDate || ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                      className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="text" placeholder="End Date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
                      className="w-full border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsCoupons;
