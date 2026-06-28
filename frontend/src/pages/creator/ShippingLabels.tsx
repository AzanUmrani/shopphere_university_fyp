import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  FaTruck,
  FaPlus,
  FaPrint,
  FaTimesCircle,
  FaFilePdf,
  FaSyncAlt,
  FaShippingFast, // Using as a generic carrier logo placeholder
  FaCog,
  FaLink, // For connected integration
  FaUnlink, // For disconnected integration
  FaClock, // For pending integration
  FaCheck, // For API Key saved feedback
  FaTimes, // For closing modals
} from "react-icons/fa";

// Define interfaces for better type safety
interface ShippingLabel {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  labelUrl: string;
  status: "Generated" | "Printed" | "Voided" | "Failed";
  dateGenerated: string;
}

interface CarrierIntegration {
  name: string;
  status: "Connected" | "Disconnected" | "Pending";
  apiKey: string; // Placeholder for API key or credentials
  logoIcon: React.ElementType; // To render an icon directly
}

const ShippingLabels: React.FC = () => {
  // State for shipping labels
  const [labels, setLabels] = useState<ShippingLabel[]>([
    {
      id: "LBL001",
      orderId: "ORD-1001",
      carrier: "USPS",
      trackingNumber: "9400100000000000000001",
      labelUrl: "#", // Placeholder for PDF download
      status: "Printed",
      dateGenerated: "2025-08-20 10:30",
    },
    {
      id: "LBL002",
      orderId: "ORD-1002",
      carrier: "FedEx",
      trackingNumber: "794001000000000000002",
      labelUrl: "#",
      status: "Generated",
      dateGenerated: "2025-08-28 14:15",
    },
    {
      id: "LBL003",
      orderId: "ORD-1003",
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      labelUrl: "#",
      status: "Failed",
      dateGenerated: "2025-08-29 09:00",
    },
    {
      id: "LBL004",
      orderId: "ORD-1004",
      carrier: "DHL",
      trackingNumber: "JD0146000045423872",
      labelUrl: "#",
      status: "Printed",
      dateGenerated: "2025-08-29 11:45",
    },
    {
      id: "LBL005",
      orderId: "ORD-1005",
      carrier: "USPS",
      trackingNumber: "9400100000000000000005",
      labelUrl: "#",
      status: "Generated",
      dateGenerated: "2025-08-29 13:20",
    },
    {
      id: "LBL006",
      orderId: "ORD-1006",
      carrier: "Canada Post",
      trackingNumber: "CX123456789CA",
      labelUrl: "#",
      status: "Printed",
      dateGenerated: "2025-08-29 14:10",
    },
    {
      id: "LBL007",
      orderId: "ORD-1007",
      carrier: "Royal Mail",
      trackingNumber: "RM123456789GB",
      labelUrl: "#",
      status: "Generated",
      dateGenerated: "2025-08-29 15:05",
    },
    {
      id: "LBL008",
      orderId: "ORD-1008",
      carrier: "FedEx",
      trackingNumber: "794001000000000000008",
      labelUrl: "#",
      status: "Failed",
      dateGenerated: "2025-08-29 16:40",
    },
  ]);

  // State for current order ID to generate label
  const [currentOrderId, setCurrentOrderId] = useState<string>("");

  // State for carrier integrations (now mutable)
  const [carrierIntegrations, setCarrierIntegrations] = useState<
    CarrierIntegration[]
  >([
    {
      name: "USPS",
      status: "Connected",
      apiKey: "usps_api_key_123",
      logoIcon: FaShippingFast,
    },
    {
      name: "FedEx",
      status: "Connected",
      apiKey: "fedex_api_key_456",
      logoIcon: FaShippingFast,
    },
    {
      name: "UPS",
      status: "Disconnected",
      apiKey: "",
      logoIcon: FaShippingFast,
    },
    {
      name: "DHL",
      status: "Pending",
      apiKey: "dhl_temp_key_789",
      logoIcon: FaShippingFast,
    },
  ]);

  // State for "Manage Integrations" modal
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [editingIntegration, setEditingIntegration] =
    useState<CarrierIntegration | null>(null);
  const [tempApiKey, setTempApiKey] = useState("");
  const [apiKeySavedFeedback, setApiKeySavedFeedback] = useState("");

  // Handlers for Shipping Labels
  const handleGenerateLabel = () => {
    if (!currentOrderId.trim()) {
      alert("Please enter an Order ID.");
      return;
    }

    // Check if there's any connected carrier to generate a label
    const connectedCarriers = carrierIntegrations.filter(
      (c) => c.status === "Connected"
    );
    if (connectedCarriers.length === 0) {
      alert(
        "No shipping carriers are connected. Please connect a carrier to generate labels."
      );
      return;
    }

    const randomCarrier =
      connectedCarriers[Math.floor(Math.random() * connectedCarriers.length)];

    const newLabel: ShippingLabel = {
      id: `LBL-${Date.now()}`,
      orderId: currentOrderId,
      carrier: randomCarrier.name, // Use a connected carrier
      trackingNumber: Math.random().toString(36).substring(2, 15).toUpperCase(),
      labelUrl: "#",
      status: "Generated",
      dateGenerated: new Date().toLocaleString(),
    };

    setLabels((prevLabels) => [newLabel, ...prevLabels]);
    setCurrentOrderId("");
    alert(
      `Label for Order ID ${currentOrderId} generated! (via ${randomCarrier.name})`
    );
  };

  const handleUpdateLabelStatus = (
    id: string,
    newStatus: ShippingLabel["status"]
  ) => {
    setLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.id === id
          ? {
              ...label,
              status: newStatus,
              dateGenerated: new Date().toLocaleString(),
            }
          : label
      )
    );
  };

  // Function to render status badges for shipping labels
  const renderLabelStatusBadge = (status: ShippingLabel["status"]) => {
    let className =
      "py-0.5 px-2 rounded-full text-[11px] font-medium min-w-[70px] text-center";
    switch (status) {
      case "Generated":
        className +=
          " bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300";
        break;
      case "Printed":
        className +=
          " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        break;
      case "Voided":
        className +=
          " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        break;
      case "Failed":
        className +=
          " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        break;
    }
    return <span className={className}>{status}</span>;
  };

  // Handlers for Carrier Integrations Modal
  const openIntegrationsModal = () => {
    setEditingIntegration(null);
    setShowIntegrationsModal(true);
  };

  const handleConnectIntegration = (carrier: CarrierIntegration) => {
    setEditingIntegration(carrier);
    setTempApiKey(carrier.apiKey || ""); // Pre-fill if exists
    setApiKeySavedFeedback("");
  };

  const handleSaveIntegrationSettings = () => {
    if (!editingIntegration) return;

    // Simulate API key validation/saving
    if (tempApiKey.trim() === "") {
      alert("API Key cannot be empty for connection.");
      return;
    }

    const updatedIntegrations = carrierIntegrations.map((c) =>
      c.name === editingIntegration.name
        ? { ...c, apiKey: tempApiKey.trim(), status: "Connected" as const }
        : c
    );
    setCarrierIntegrations(updatedIntegrations);
    setApiKeySavedFeedback("API Key saved and connected!"); // Provide feedback
    // Keep the modal open briefly to show feedback, then close
    setTimeout(() => {
      setShowIntegrationsModal(false);
      setEditingIntegration(null);
    }, 1500);
  };

  const handleDisconnectIntegration = (carrierName: string) => {
    setCarrierIntegrations((prevIntegrations) =>
      prevIntegrations.map((c) =>
        c.name === carrierName
          ? { ...c, status: "Disconnected", apiKey: "" }
          : c
      )
    );
    // If we're currently editing this carrier, clear that as well
    if (editingIntegration && editingIntegration.name === carrierName) {
      setEditingIntegration(null);
      setTempApiKey("");
      setApiKeySavedFeedback("");
    }
    alert(`${carrierName} disconnected successfully.`);
  };

  const renderIntegrationStatusBadge = (
    status: CarrierIntegration["status"]
  ) => {
    let className =
      "flex items-center space-x-1 py-0.5 px-2 rounded-full text-xs font-medium";
    let icon;
    let text = status;

    switch (status) {
      case "Connected":
        className +=
          " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        icon = <FaLink className="text-green-500" />;
        break;
      case "Disconnected":
        className +=
          " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        icon = <FaUnlink className="text-red-500" />;
        break;
      case "Pending":
        className +=
          " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 animate-pulse";
        icon = <FaClock className="text-yellow-500" />;
        break;
    }
    return (
      <Badge className={className}>
        {icon} <span>{text}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-5 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <FaTruck className="text-primary-600 text-2xl" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Shipping Labels
          </h1>
          <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-xs shadow-sm">
            Feature
          </Badge>
        </div>

        {/* Overview */}
        <Card className="w-full p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Label Creation & Management
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-base leading-relaxed text-center max-w-3xl mx-auto">
            Generate, print, and manage shipping labels efficiently across
            multiple carriers.
          </p>

          {/* Bottom Row */}
          <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 text-base font-medium">
            <FaPrint className="text-lg" />
            <span>Automate Your Shipping</span>
          </div>
        </Card>

        {/* Grid for Generate Label & Integrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {/* Generate Label */}
          <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-1">
              <FaPlus className="text-green-600 text-sm" />
              <span>Generate New Shipping Label</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-xs">
              Enter an order ID to instantly create a new shipping label.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm p-2 transition-colors duration-200"
                placeholder="Order ID (e.g., ORD-1234)"
                value={currentOrderId}
                onChange={(e) => setCurrentOrderId(e.target.value)}
                aria-label="Order ID"
              />
              <button
                onClick={handleGenerateLabel}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-sm transition-colors duration-200"
                aria-label="Generate Shipping Label"
              >
                <FaPlus className="mr-1 text-xs" /> Generate
              </button>
            </div>
          </Card>

          {/* Carrier Integrations Summary */}
          <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-1">
              <FaCog className="text-gray-500 text-sm" />
              <span>Carrier Integrations</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {carrierIntegrations.map((integration, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center space-x-1">
                    <integration.logoIcon className="text-sm text-primary-500" />
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  {renderIntegrationStatusBadge(integration.status)}
                </li>
              ))}
            </ul>
            <button
              onClick={openIntegrationsModal}
              className="mt-4 w-full text-xs py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-sm transition-colors duration-200"
              aria-label="Manage Carrier Integrations"
            >
              Manage Integrations
            </button>
          </Card>
        </div>

        {/* Recent Labels Table */}
        <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Recent Shipping Labels
          </h3>
          {labels.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
              No shipping labels generated yet.
            </p>
          ) : (
            <div className="overflow-x-auto  border border-gray-200 dark:border-gray-700 rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[
                      "Order ID",
                      "Carrier",
                      "Tracking",
                      "Status",
                      "Generated",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {labels.map((label) => (
                    <tr
                      key={label.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
                        {label.orderId}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {label.carrier}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {label.trackingNumber}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {renderLabelStatusBadge(label.status)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600 dark:text-gray-400 text-xs">
                        {label.dateGenerated}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-xs space-x-2 flex items-center justify-end">
                        <a
                          href={label.labelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600 flex items-center group"
                          title="Download Label PDF"
                          download
                        >
                          <FaFilePdf className="mr-1 group-hover:scale-105 transition-transform duration-150" />{" "}
                          <span className="hidden sm:inline">PDF</span>
                        </a>
                        <button
                          onClick={() =>
                            handleUpdateLabelStatus(label.id, "Printed")
                          }
                          disabled={
                            label.status === "Printed" ||
                            label.status === "Voided"
                          }
                          className={`${
                            label.status === "Printed" ||
                            label.status === "Voided"
                              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                              : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-600"
                          } flex items-center ml-2 transition-colors duration-150`}
                          title="Mark as Printed"
                          aria-label={`Mark label ${label.id} as Printed`}
                        >
                          <FaPrint className="mr-1" />{" "}
                          <span className="hidden sm:inline">Print</span>
                        </button>
                        {label.status !== "Voided" &&
                          label.status !== "Failed" && (
                            <button
                              onClick={() =>
                                handleUpdateLabelStatus(label.id, "Voided")
                              }
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600 flex items-center ml-2 transition-colors duration-150"
                              title="Void Label"
                              aria-label={`Void label ${label.id}`}
                            >
                              <FaTimesCircle className="mr-1" />{" "}
                              <span className="hidden sm:inline">Void</span>
                            </button>
                          )}
                        {label.status === "Failed" && (
                          <button
                            onClick={() =>
                              handleUpdateLabelStatus(label.id, "Generated")
                            }
                            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-600 flex items-center ml-2 transition-colors duration-150"
                            title="Retry Label Generation"
                            aria-label={`Retry label generation for ${label.id}`}
                          >
                            <FaSyncAlt className="mr-1" />{" "}
                            <span className="hidden sm:inline">Retry</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Carrier Integrations Management Modal */}
      {showIntegrationsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl p-6 transform transition-all scale-95 duration-200 ease-out sm:scale-100">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <FaCog className="text-primary-600" />
                <span>Manage Carrier Integrations</span>
              </h3>
              <button
                onClick={() => {
                  setShowIntegrationsModal(false);
                  setEditingIntegration(null);
                  setApiKeySavedFeedback("");
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                aria-label="Close integration settings"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {" "}
              {/* Added max-height and overflow for scroll */}
              {carrierIntegrations.map((carrier, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0 w-full sm:w-auto">
                    <carrier.logoIcon className="text-xl text-primary-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {carrier.name}
                    </span>
                    {renderIntegrationStatusBadge(carrier.status)}
                  </div>
                  <div className="flex space-x-2 text-sm">
                    {carrier.status === "Connected" ? (
                      <button
                        onClick={() =>
                          handleDisconnectIntegration(carrier.name)
                        }
                        className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors duration-200"
                        aria-label={`Disconnect ${carrier.name}`}
                      >
                        <FaUnlink className="mr-1" /> Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectIntegration(carrier)}
                        className="flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 transition-colors duration-200"
                        aria-label={`Connect or configure ${carrier.name}`}
                      >
                        <FaLink className="mr-1" />{" "}
                        {carrier.status === "Pending" ? "Configure" : "Connect"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {editingIntegration && (
              <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 transition-all duration-300 ease-in-out">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {editingIntegration.status === "Connected"
                    ? "Edit API Key"
                    : `Connect ${editingIntegration.name}`}
                </h4>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  API Key for {editingIntegration.name}
                </label>
                <input
                  type="password" // Use type password for API keys
                  id="apiKey"
                  value={tempApiKey}
                  onChange={(e) => {
                    setTempApiKey(e.target.value);
                    setApiKeySavedFeedback(""); // Clear feedback on input change
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white p-2.5 transition-colors duration-200"
                  placeholder="Enter API Key"
                  required
                  aria-label={`API Key for ${editingIntegration.name}`}
                />
                {apiKeySavedFeedback && (
                  <p className="mt-2 text-green-600 dark:text-green-400 text-sm flex items-center animate-fade-in">
                    <FaCheck className="mr-1" /> {apiKeySavedFeedback}
                  </p>
                )}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIntegration(null);
                      setApiKeySavedFeedback("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveIntegrationSettings}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingLabels;
