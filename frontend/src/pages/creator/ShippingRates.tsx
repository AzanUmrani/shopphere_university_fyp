import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaShippingFast,
  FaTimes,
  FaBalanceScale,
  FaShoppingCart,
  FaGlobeAmericas,
  FaChartPie,
} from "react-icons/fa";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

type RateType =
  | "Flat Rate"
  | "Price Based"
  | "Weight Based"
  | "Item Based"
  | "Free Shipping";
type RateStatus = "Active" | "Inactive";

interface ShippingRate {
  id: string;
  zoneName: string;
  type: RateType;
  condition: string;
  minConditionValue?: number;
  maxConditionValue?: number;
  cost: number;
  isTaxable: boolean;
  status: RateStatus;
}

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ShippingRates: React.FC = () => {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([
    {
      id: "sr001",
      zoneName: "United States",
      type: "Flat Rate",
      condition: "Any Order",
      cost: 7.99,
      isTaxable: true,
      status: "Active",
    },
    {
      id: "sr002",
      zoneName: "United States",
      type: "Price Based",
      condition: "$50.01 - $100.00",
      minConditionValue: 50.01,
      maxConditionValue: 100.0,
      cost: 5.99,
      isTaxable: true,
      status: "Active",
    },
    {
      id: "sr003",
      zoneName: "United States",
      type: "Free Shipping",
      condition: "Orders over $100.00",
      minConditionValue: 100.01,
      cost: 0.0,
      isTaxable: false,
      status: "Active",
    },
    {
      id: "sr004",
      zoneName: "Canada",
      type: "Weight Based",
      condition: "0 - 2 kg",
      minConditionValue: 0,
      maxConditionValue: 2,
      cost: 12.5,
      isTaxable: true,
      status: "Active",
    },
    {
      id: "sr005",
      zoneName: "Europe Zone 1",
      type: "Flat Rate",
      condition: "Any Order",
      cost: 14.99,
      isTaxable: true,
      status: "Inactive",
    },
    {
      id: "sr006",
      zoneName: "International",
      type: "Item Based",
      condition: "1 - 3 Items",
      minConditionValue: 1,
      maxConditionValue: 3,
      cost: 25.0,
      isTaxable: true,
      status: "Active",
    },

    // --- New Entries ---
    {
      id: "sr007",
      zoneName: "Asia Pacific",
      type: "Weight Based",
      condition: "2.01 - 5 kg",
      minConditionValue: 2.01,
      maxConditionValue: 5,
      cost: 18.75,
      isTaxable: true,
      status: "Active",
    },
    {
      id: "sr008",
      zoneName: "Middle East",
      type: "Flat Rate",
      condition: "Any Order",
      cost: 22.0,
      isTaxable: false,
      status: "Active",
    },
    {
      id: "sr009",
      zoneName: "Australia",
      type: "Free Shipping",
      condition: "Orders over $200.00",
      minConditionValue: 200.01,
      cost: 0.0,
      isTaxable: false,
      status: "Active",
    },
    {
      id: "sr010",
      zoneName: "Africa",
      type: "Item Based",
      condition: "4 - 10 Items",
      minConditionValue: 4,
      maxConditionValue: 10,
      cost: 30.0,
      isTaxable: true,
      status: "Inactive",
    },
    {
      id: "sr011",
      zoneName: "South America",
      type: "Price Based",
      condition: "$100.01 - $300.00",
      minConditionValue: 100.01,
      maxConditionValue: 300.0,
      cost: 15.5,
      isTaxable: true,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);

  const [zoneName, setZoneName] = useState("");
  const [rateType, setRateType] = useState<RateType>("Flat Rate");
  const [minCondition, setMinCondition] = useState<string>("");
  const [maxCondition, setMaxCondition] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [isTaxable, setIsTaxable] = useState(true);
  const [status, setStatus] = useState<RateStatus>("Active");

  const generateConditionString = (
    type: RateType,
    min?: number | "",
    max?: number | ""
  ) => {
    switch (type) {
      case "Flat Rate":
        return "Any Order";
      case "Free Shipping":
        return min ? `Orders over $${(min as number).toFixed(2)}` : "N/A";
      case "Price Based":
        if (min && max)
          return `$${(min as number).toFixed(2)} - $${(max as number).toFixed(
            2
          )}`;
        if (min) return `Over $${(min as number).toFixed(2)}`;
        if (max) return `Up to $${(max as number).toFixed(2)}`;
        return "Price based";
      case "Weight Based":
        if (min && max)
          return `${(min as number).toFixed(2)} - ${(max as number).toFixed(
            2
          )} kg`;
        if (min) return `Over ${(min as number).toFixed(2)} kg`;
        if (max) return `Up to ${(max as number).toFixed(2)} kg`;
        return "Weight based";
      case "Item Based":
        if (min && max) return `${min} - ${max} Items`;
        if (min) return `Over ${min} Items`;
        if (max) return `Up to ${max} Items`;
        return "Item based";
      default:
        return "N/A";
    }
  };

  const handleAddRate = () => {
    setEditingRate(null);
    setZoneName("");
    setRateType("Flat Rate");
    setMinCondition("");
    setMaxCondition("");
    setCost("");
    setIsTaxable(true);
    setStatus("Active");
    setShowModal(true);
  };

  const handleEditRate = (rate: ShippingRate) => {
    setEditingRate(rate);
    setZoneName(rate.zoneName);
    setRateType(rate.type);
    setMinCondition(rate.minConditionValue?.toString() || "");
    setMaxCondition(rate.maxConditionValue?.toString() || "");
    setCost(rate.cost?.toString() || "");
    setIsTaxable(rate.isTaxable);
    setStatus(rate.status);
    setShowModal(true);
  };

  const handleDeleteRate = (id: string) => {
    if (window.confirm("Delete this rate?"))
      setShippingRates(shippingRates.filter((r) => r.id !== id));
  };

  const handleSubmitRate = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Clean parsing
    const formattedCost =
      cost === "" ? 0 : typeof cost === "string" ? parseFloat(cost) : cost;
    const formattedMin =
      minCondition === ""
        ? undefined
        : typeof minCondition === "string"
        ? parseFloat(minCondition)
        : minCondition;
    const formattedMax =
      maxCondition === ""
        ? undefined
        : typeof maxCondition === "string"
        ? parseFloat(maxCondition)
        : maxCondition;

    const newRate: ShippingRate = {
      id: editingRate ? editingRate.id : `sr${Date.now()}`,
      zoneName,
      type: rateType,
      minConditionValue: formattedMin,
      maxConditionValue: formattedMax,
      condition: generateConditionString(rateType, formattedMin, formattedMax),
      cost: formattedCost,
      isTaxable,
      status,
    };

    setShippingRates(
      editingRate
        ? shippingRates.map((r) => (r.id === newRate.id ? newRate : r))
        : [...shippingRates, newRate]
    );

    setShowModal(false);
  };

  const rateTypeDistribution = shippingRates.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<RateType, number>);
  const pieChartData = Object.entries(rateTypeDistribution).map(
    ([type, val]) => ({ name: type, value: val })
  );

  return (
    <div className="space-y-4 p-3 bg-gray-50 dark:bg-gray-900 min-h-screen dark:text-white">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
        <FaDollarSign className="text-secondary-600 text-2xl" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Shipping Rates
        </h1>
        <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
          Feature
        </Badge>
      </div>

      {/* Chart & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-3 lg:col-span-1">
          <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
            <FaChartPie /> Rate Distribution
          </h3>

          {shippingRates.length > 0 ? (
            <div className="flex items-center justify-center gap-4">
              {/* Pie Chart */}
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={false} // no inside labels
                    >
                      {pieChartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend on the side */}
              <div className="flex flex-col gap-2 text-xs">
                {pieChartData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-gray-700">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm pt-8">No data</p>
          )}
        </Card>

        <Card className="p-3 lg:col-span-2 flex flex-col justify-between">
          <h3 className="text-md font-semibold mb-2">Quick Insights</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary-50 p-2 rounded text-sm">
              <FaGlobeAmericas className="inline mr-1" /> Zones:{" "}
              {new Set(shippingRates.map((r) => r.zoneName)).size}
            </div>
            <div className="bg-teal-50 p-2 rounded text-sm">
              <FaShippingFast className="inline mr-1" /> Active:{" "}
              {shippingRates.filter((r) => r.status === "Active").length}
            </div>
          </div>
          <button
            onClick={handleAddRate}
            className="mt-3 px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
          >
            <FaPlus /> Add Rate
          </button>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-3">
        <h3 className="text-md font-semibold mb-2">Defined Rates</h3>
        {shippingRates.length === 0 ? (
          <p className="text-sm text-center text-gray-500 py-4">
            No rates yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-xs">
                <tr>
                  {[
                    "Zone",
                    "Type",
                    "Condition",
                    "Cost",
                    "Taxable",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate) => (
                  <tr key={rate.id} className="border-t">
                    <td className="px-3 py-2">{rate.zoneName}</td>
                    <td className="px-3 py-2 flex items-center gap-1">
                      {rate.type === "Flat Rate" && (
                        <FaDollarSign className="text-primary-500" />
                      )}
                      {rate.type === "Price Based" && (
                        <FaShoppingCart className="text-green-500" />
                      )}
                      {rate.type === "Weight Based" && (
                        <FaBalanceScale className="text-yellow-500" />
                      )}
                      {rate.type === "Item Based" && (
                        <FaShoppingCart className="text-red-500" />
                      )}
                      {rate.type === "Free Shipping" && (
                        <FaShippingFast className="text-teal-500" />
                      )}
                      {rate.type}
                    </td>
                    <td className="px-3 py-2">{rate.condition}</td>
                    <td className="px-3 py-2">
                      {rate.cost > 0 ? `$${rate.cost.toFixed(2)}` : "FREE"}
                    </td>
                    <td className="px-3 py-2">
                      {rate.isTaxable ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Yes
                        </Badge>
                      ) : (
                        <Badge>No</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">{rate.status}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEditRate(rate)}
                        className="text-primary-600 text-xs"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRate(rate.id)}
                        className="text-red-600 text-xs"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {editingRate ? "Edit Rate" : "Add Rate"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmitRate} className="space-y-3 text-sm">
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="Zone name"
                className="w-full border p-2 rounded"
                required
              />
              <select
                value={rateType}
                onChange={(e) => {
                  const newType = e.target.value as RateType;
                  setRateType(newType);
                  // Clear condition values when switching to types that don't need them
                  if (newType === "Flat Rate") {
                    setMinCondition("");
                    setMaxCondition("");
                  } else if (newType === "Free Shipping") {
                    setMaxCondition("");
                  }
                }}
                className="w-full border p-2 rounded"
              >
                <option>Flat Rate</option>
                <option>Price Based</option>
                <option>Weight Based</option>
                <option>Item Based</option>
                <option>Free Shipping</option>
              </select>
              {(rateType === "Price Based" ||
                rateType === "Weight Based" ||
                rateType === "Item Based") && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minCondition}
                    onChange={(e) => setMinCondition(e.target.value)}
                    placeholder={
                      rateType === "Price Based"
                        ? "Min Price"
                        : rateType === "Weight Based"
                        ? "Min Weight"
                        : "Min Items"
                    }
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={maxCondition}
                    onChange={(e) => setMaxCondition(e.target.value)}
                    placeholder={
                      rateType === "Price Based"
                        ? "Max Price"
                        : rateType === "Weight Based"
                        ? "Max Weight"
                        : "Max Items"
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
              {rateType === "Free Shipping" && (
                <input
                  type="number"
                  value={minCondition}
                  onChange={(e) => setMinCondition(e.target.value)}
                  placeholder="Min Order Value"
                  className="w-full border p-2 rounded"
                />
              )}
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Cost"
                className="w-full border p-2 rounded"
              />
              <div className="flex items-center gap-2">
                <label>Taxable?</label>
                <input
                  type="checkbox"
                  checked={isTaxable}
                  onChange={(e) => setIsTaxable(e.target.checked)}
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RateStatus)}
                className="w-full border p-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-primary-600 text-white rounded"
                >
                  {editingRate ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingRates;
