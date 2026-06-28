import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  FaSearch,
  FaChartLine,
  FaLaptopCode,
  FaLink,
  FaTags,
  FaTimes,
} from "react-icons/fa";

// ✅ Simple Reusable Modal
const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}> = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    </div>
  );
};

const SEOTools: React.FC = () => {
  // ✅ Modal state
  const [openModal, setOpenModal] = useState<
    "keywords" | "audit" | "backlinks" | "optimization" | null
  >(null);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <FaSearch className="text-primary-600 text-3xl md:text-4xl" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          SEO Tools
        </h1>
        <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
          Feature Page
        </Badge>
      </div>

      {/* Dashboard Card */}
      <Card className="p-8 text-center bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SEO Tools Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This feature is ready for implementation, offering comprehensive SEO
          utilities.
        </p>
        <div className="text-primary-600 dark:text-primary-400 font-medium">
          Professional SEO Management & Analytics
        </div>
      </Card>

      {/* Keyword Research */}
      <Card className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaChartLine className="text-green-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Keyword Research
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Discover high-ranking keywords and analyze their search volume and
          competition.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
            <span>"Best products 2025"</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              High Volume
            </Badge>
          </div>
          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
            <span>"E-commerce solutions"</span>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              Medium Comp.
            </Badge>
          </div>
          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
            <span>"Online store builder"</span>
            <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              Low Volume
            </Badge>
          </div>
        </div>
        <button
          onClick={() => setOpenModal("keywords")}
          className="mt-6 w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          View All Keywords
        </button>
      </Card>

      {/* Site Audit */}
      <Card className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaLaptopCode className="text-red-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Site Audit & Health
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Get insights into your website's SEO performance and identify issues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Overall Score: <span className="text-green-500">85/100</span>
            </h4>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Critical Issues: <span className="text-red-500">3</span>
            </h4>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Warnings: <span className="text-yellow-500">7</span>
            </h4>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Pages Indexed: <span className="text-primary-500">1,234</span>
            </h4>
          </div>
        </div>
        <button
          onClick={() => setOpenModal("audit")}
          className="mt-6 w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          Run Full Audit
        </button>
      </Card>

      {/* Backlink Analysis */}
      <Card className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaLink className="text-secondary-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Backlink Analysis
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Monitor your backlink profile and identify new opportunities.
        </p>
        <button
          onClick={() => setOpenModal("backlinks")}
          className="mt-6 w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none"
        >
          Explore Backlinks
        </button>
      </Card>

      {/* Content & Meta Tags */}
      <Card className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaTags className="text-yellow-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Content & Meta Tags Optimization
          </h3>
        </div>
        <button
          onClick={() => setOpenModal("optimization")}
          className="mt-6 w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
        >
          Save Optimization
        </button>
      </Card>

      {/* ✅ Modals */}
      <Modal
        title="All Keywords"
        isOpen={openModal === "keywords"}
        onClose={() => setOpenModal(null)}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>Best products 2025 – High Volume</li>
          <li>E-commerce solutions – Medium Competition</li>
          <li>Online store builder – Low Volume</li>
          <li>SEO tools online – Medium Volume</li>
          <li>Marketing automation – High Volume</li>
        </ul>
      </Modal>

      <Modal
        title="Full Site Audit Results"
        isOpen={openModal === "audit"}
        onClose={() => setOpenModal(null)}
      >
        <p className="mb-2">✔ 85% overall SEO health</p>
        <p className="mb-2">
          ❌ 3 critical issues (fix broken links, add H1 tags)
        </p>
        <p className="mb-2">
          ⚠ 7 warnings (optimize images, reduce duplicate content)
        </p>
        <p>📄 1,234 pages indexed</p>
      </Modal>

      <Modal
        title="Backlink Analysis"
        isOpen={openModal === "backlinks"}
        onClose={() => setOpenModal(null)}
      >
        <p>
          Total Backlinks: <span className="font-bold">1,500</span>
        </p>
        <p>
          Referring Domains: <span className="font-bold">150</span>
        </p>
        <p className="text-green-600">+25 new backlinks last 30 days</p>
        <p className="text-red-600">-5 lost backlinks last 30 days</p>
      </Modal>

      <Modal
        title="Optimization Saved"
        isOpen={openModal === "optimization"}
        onClose={() => setOpenModal(null)}
      >
        <p className="text-green-600 font-semibold">
          ✅ Your meta title & description have been saved successfully!
        </p>
      </Modal>
    </div>
  );
};

export default SEOTools;
