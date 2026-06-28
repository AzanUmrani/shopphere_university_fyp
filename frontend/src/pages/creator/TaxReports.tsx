import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  FaFileInvoiceDollar,
  FaClipboardList,
  FaCalendarTimes,
  FaCheckCircle,
  FaPlus,
  FaDownload,
  FaEye,
  FaTimes,
} from "react-icons/fa";

// Types
interface TaxReport {
  id: string;
  type: string;
  period: string;
  amount: number;
  dueDate: string;
  status: "Filed" | "Pending" | "Overdue";
}

// Sample Data
const initialTaxReports: TaxReport[] = [
  {
    id: "TR001",
    type: "Income Tax",
    period: "2023",
    amount: 15200,
    dueDate: "2024-04-15",
    status: "Filed",
  },
  {
    id: "TR002",
    type: "Sales Tax",
    period: "Q4 2023",
    amount: 3100,
    dueDate: "2024-01-31",
    status: "Filed",
  },
  {
    id: "TR003",
    type: "Property Tax",
    period: "2024",
    amount: 2400,
    dueDate: "2024-09-30",
    status: "Pending",
  },
  {
    id: "TR004",
    type: "Payroll Tax",
    period: "Jan 2024",
    amount: 950,
    dueDate: "2024-02-15",
    status: "Filed",
  },
  {
    id: "TR005",
    type: "Capital Gains Tax",
    period: "2023",
    amount: 7200,
    dueDate: "2024-07-31",
    status: "Pending",
  },
  {
    id: "TR006",
    type: "Corporate Tax",
    period: "FY 2023",
    amount: 25000,
    dueDate: "2024-03-31",
    status: "Filed",
  },
  {
    id: "TR007",
    type: "Sales Tax",
    period: "Q1 2024",
    amount: 2800,
    dueDate: "2024-04-30",
    status: "Pending",
  },
  {
    id: "TR008",
    type: "Income Tax",
    period: "2021",
    amount: 14000,
    dueDate: "2022-04-15",
    status: "Overdue",
  },
];

// Utility: Download JSON file
const downloadReport = (report: TaxReport) => {
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const TaxReports: React.FC = () => {
  const [reports, setReports] = useState<TaxReport[]>(initialTaxReports);
  const [searchTerm] = useState<string>("");
  const [filterStatus] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<TaxReport | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New report form state
  const [newReport, setNewReport] = useState<TaxReport>({
    id: "",
    type: "",
    period: "",
    amount: 0,
    dueDate: "",
    status: "Pending",
  });

  // Summary stats
  const totalReports = reports.length;
  const filedReports = reports.filter((r) => r.status === "Filed").length;
  const pendingReports = reports.filter((r) => r.status === "Pending").length;
  const overdueReports = reports.filter((r) => r.status === "Overdue").length;

  // Filter
  const filteredReports = reports.filter((report) => {
    const matchesSearchTerm =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  // Add Report
  const handleAddReport = () => {
    if (
      !newReport.id ||
      !newReport.type ||
      !newReport.period ||
      !newReport.dueDate
    ) {
      alert("Please fill all required fields");
      return;
    }
    setReports([...reports, newReport]);
    setNewReport({
      id: "",
      type: "",
      period: "",
      amount: 0,
      dueDate: "",
      status: "Pending",
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800 min-h-screen dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaFileInvoiceDollar className="text-primary-600 dark:text-primary-400" />
          Tax Reports Management
        </h1>
        <button
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Add Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-semibold">{totalReports}</p>
          </div>
          <FaClipboardList className="text-3xl text-primary-500" />
        </Card>
        <Card className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Filed</p>
            <p className="text-2xl font-semibold">{filedReports}</p>
          </div>
          <FaCheckCircle className="text-3xl text-green-500" />
        </Card>
        <Card className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-semibold">{pendingReports}</p>
          </div>
          <FaFileInvoiceDollar className="text-3xl text-yellow-500" />
        </Card>
        <Card className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-semibold">{overdueReports}</p>
          </div>
          <FaCalendarTimes className="text-3xl text-red-500" />
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm">ID</th>
                <th className="px-4 py-2 text-left text-sm">Type</th>
                <th className="px-4 py-2 text-left text-sm">Period</th>
                <th className="px-4 py-2 text-left text-sm">Amount</th>
                <th className="px-4 py-2 text-left text-sm">Due Date</th>
                <th className="px-4 py-2 text-left text-sm">Status</th>
                <th className="px-4 py-2 text-right text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{report.id}</td>
                  <td className="px-4 py-2">{report.type}</td>
                  <td className="px-4 py-2">{report.period}</td>
                  <td className="px-4 py-2">
                    ${report.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(report.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      className={
                        report.status === "Filed"
                          ? "bg-green-100 text-green-800"
                          : report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-primary-600 hover:underline mr-3"
                    >
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button
                      onClick={() => downloadReport(report)}
                      className="text-green-600 hover:underline"
                    >
                      <FaDownload className="inline mr-1" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal for View Report */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Report Details</h2>
            <p>
              <strong>ID:</strong> {selectedReport.id}
            </p>
            <p>
              <strong>Type:</strong> {selectedReport.type}
            </p>
            <p>
              <strong>Period:</strong> {selectedReport.period}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedReport.amount.toLocaleString()}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(selectedReport.dueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
          </div>
        </div>
      )}

      {/* Modal for Add Report */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Report</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Report ID"
                value={newReport.id}
                onChange={(e) =>
                  setNewReport({ ...newReport, id: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Type"
                value={newReport.type}
                onChange={(e) =>
                  setNewReport({ ...newReport, type: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Period"
                value={newReport.period}
                onChange={(e) =>
                  setNewReport({ ...newReport, period: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newReport.amount}
                onChange={(e) =>
                  setNewReport({ ...newReport, amount: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={newReport.dueDate}
                onChange={(e) =>
                  setNewReport({ ...newReport, dueDate: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={newReport.status}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    status: e.target.value as "Filed" | "Pending" | "Overdue",
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Filed">Filed</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>

              <button
                onClick={handleAddReport}
                className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
              >
                Add Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxReports;
