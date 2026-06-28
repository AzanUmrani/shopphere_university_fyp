import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  FaGlobe, // Icon for shipping zones
  FaPlus, // Icon for add new
  FaEdit, // Icon for edit
  FaTrashAlt, // Icon for delete
  FaShippingFast, // Icon for shipping method
  FaTimes, // Icon for closing modal
} from "react-icons/fa";

// Define interfaces for better type safety
interface ShippingMethod {
  type: "Flat Rate" | "Free Shipping" | "Per Item" | "Weight Based";
  cost?: number;
  minOrder?: number;
}

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  methods: ShippingMethod[];
  status: "Active" | "Inactive";
}

const ShippingZones: React.FC = () => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: "sz001",
      name: "North America",
      regions: ["United States", "Canada", "Mexico"],
      methods: [{ type: "Flat Rate", cost: 10.0 }],
      status: "Active",
    },
    {
      id: "sz002",
      name: "Europe (Zone 1)",
      regions: ["Germany", "France", "Spain", "Italy"],
      methods: [
        { type: "Flat Rate", cost: 15.5 },
        { type: "Free Shipping", minOrder: 100 },
      ],
      status: "Active",
    },
    {
      id: "sz003",
      name: "Rest of World",
      regions: ["Australia", "Japan", "Brazil", "India"],
      methods: [{ type: "Weight Based" }],
      status: "Inactive",
    },
    {
      id: "sz004",
      name: "United Kingdom",
      regions: ["England", "Scotland", "Wales", "Northern Ireland"],
      methods: [
        { type: "Flat Rate", cost: 8.0 },
        { type: "Weight Based", cost: 20.0 },
      ],
      status: "Active",
    },
    {
      id: "sz005",
      name: "Middle East",
      regions: ["UAE", "Saudi Arabia", "Qatar", "Kuwait"],
      methods: [
        { type: "Flat Rate", cost: 12.0 },
        { type: "Free Shipping", minOrder: 150 },
      ],
      status: "Active",
    },
    {
      id: "sz006",
      name: "South Asia",
      regions: ["Pakistan", "Bangladesh", "Sri Lanka", "Nepal"],
      methods: [{ type: "Flat Rate", cost: 7.0 }, { type: "Weight Based" }],
      status: "Active",
    },
    {
      id: "sz007",
      name: "Africa (Zone 1)",
      regions: ["South Africa", "Nigeria", "Kenya", "Egypt"],
      methods: [{ type: "Weight Based" }, { type: "Flat Rate", cost: 25.0 }],
      status: "Inactive",
    },
    {
      id: "sz008",
      name: "Southeast Asia",
      regions: ["Thailand", "Vietnam", "Philippines", "Malaysia"],
      methods: [
        { type: "Flat Rate", cost: 9.5 },
        { type: "Free Shipping", minOrder: 120 },
      ],
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

  const [zoneName, setZoneName] = useState("");
  const [regionsInput, setRegionsInput] = useState("");
  const [methodType, setMethodType] =
    useState<ShippingMethod["type"]>("Flat Rate");
  const [methodCost, setMethodCost] = useState<number | "">("");
  const [methodMinOrder, setMethodMinOrder] = useState<number | "">("");
  const [zoneStatus, setZoneStatus] = useState<"Active" | "Inactive">("Active");

  const handleAddZone = () => {
    setEditingZone(null);
    setZoneName("");
    setRegionsInput("");
    setMethodType("Flat Rate");
    setMethodCost("");
    setMethodMinOrder("");
    setZoneStatus("Active");
    setShowModal(true);
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setRegionsInput(zone.regions.join(", "));
    if (zone.methods.length > 0) {
      setMethodType(zone.methods[0].type);
      setMethodCost(zone.methods[0].cost || "");
      setMethodMinOrder(zone.methods[0].minOrder || "");
    }
    setZoneStatus(zone.status);
    setShowModal(true);
  };

  const handleDeleteZone = (id: string) => {
    if (window.confirm("Are you sure you want to delete this shipping zone?")) {
      setShippingZones(shippingZones.filter((zone) => zone.id !== id));
    }
  };

  const handleSubmitZone = (e: React.FormEvent) => {
    e.preventDefault();

    const newMethod: ShippingMethod = { type: methodType };
    if (methodType === "Flat Rate" && methodCost !== "") {
      newMethod.cost =
        typeof methodCost === "number"
          ? methodCost
          : parseFloat(String(methodCost));
    }
    if (methodType === "Free Shipping" && methodMinOrder !== "") {
      newMethod.minOrder =
        typeof methodMinOrder === "number"
          ? methodMinOrder
          : parseFloat(String(methodMinOrder));
    }

    const newZone: ShippingZone = {
      id: editingZone ? editingZone.id : `sz${Date.now()}`,
      name: zoneName,
      regions: regionsInput
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      methods: [newMethod],
      status: zoneStatus,
    };

    if (editingZone) {
      setShippingZones(
        shippingZones.map((zone) => (zone.id === newZone.id ? newZone : zone))
      );
    } else {
      setShippingZones([...shippingZones, newZone]);
    }

    setShowModal(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* NARROWER PAGE CONTAINER */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-6">
          <FaGlobe className="text-primary-600 text-2xl md:text-3xl" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Shipping Zones
          </h1>
          <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
            Feature Page
          </Badge>
        </div>

        {/* Main Dashboard Card */}
        <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Shipping Zones Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Manage your shipping regions, methods, and rates efficiently.
          </p>
          <div className="text-primary-600 dark:text-primary-400 font-medium text-sm">
            Professional Shipping Zone Management
          </div>
        </Card>

        {/* Shipping Zones List */}
        <Card className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configured Shipping Zones
            </h3>
            <button
              onClick={handleAddZone}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              <FaPlus className="mr-2 -ml-1 text-base" />
              Add Zone
            </button>
          </div>

          {shippingZones.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
              No shipping zones configured yet. Click "Add Zone" to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Zone Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Regions
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Methods
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {shippingZones.map((zone) => (
                    <tr key={zone.id}>
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                        {zone.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        {zone.regions.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        {zone.methods.map((method, i) => (
                          <div key={i} className="flex items-center">
                            <FaShippingFast className="mr-1 text-xs" />
                            <span>
                              {method.type}
                              {method.cost !== undefined &&
                                ` ($${method.cost.toFixed(2)})`}
                              {method.minOrder !== undefined &&
                                ` (Min: $${method.minOrder.toFixed(2)})`}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          className={`${
                            zone.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {zone.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-600"
                        >
                          <FaEdit className="inline-block mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                        >
                          <FaTrashAlt className="inline-block mr-1" /> Delete
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingZone ? "Edit Shipping Zone" : "Add Shipping Zone"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleSubmitZone} className="space-y-4 text-sm">
                <div>
                  <label
                    htmlFor="zoneName"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Zone Name
                  </label>
                  <input
                    type="text"
                    id="zoneName"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="regionsInput"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Regions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="regionsInput"
                    value={regionsInput}
                    onChange={(e) => setRegionsInput(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="methodType"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Shipping Method
                  </label>
                  <select
                    id="methodType"
                    value={methodType}
                    onChange={(e) =>
                      setMethodType(e.target.value as ShippingMethod["type"])
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Flat Rate">Flat Rate</option>
                    <option value="Free Shipping">Free Shipping</option>
                    <option value="Per Item">Per Item</option>
                    <option value="Weight Based">Weight Based</option>
                  </select>
                </div>

                {methodType === "Flat Rate" && (
                  <div>
                    <label
                      htmlFor="methodCost"
                      className="block font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cost
                    </label>
                    <input
                      type="number"
                      id="methodCost"
                      value={methodCost}
                      onChange={(e) =>
                        setMethodCost(parseFloat(e.target.value) || "")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. 5.00"
                      step="0.01"
                      required
                    />
                  </div>
                )}

                {methodType === "Free Shipping" && (
                  <div>
                    <label
                      htmlFor="methodMinOrder"
                      className="block font-medium text-gray-700 dark:text-gray-300"
                    >
                      Minimum Order (optional)
                    </label>
                    <input
                      type="number"
                      id="methodMinOrder"
                      value={methodMinOrder}
                      onChange={(e) =>
                        setMethodMinOrder(parseFloat(e.target.value) || "")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. 100.00"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="zoneStatus"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </label>
                  <select
                    id="zoneStatus"
                    value={zoneStatus}
                    onChange={(e) =>
                      setZoneStatus(e.target.value as "Active" | "Inactive")
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    {editingZone ? "Save Changes" : "Add Zone"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingZones;
