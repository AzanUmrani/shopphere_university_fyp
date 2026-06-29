import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react";
import Card from "../components/ui/Card";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#f8fafc_100%)] dark:bg-[linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 shadow-lg shadow-primary-500/20">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Your privacy is important to us. Learn how we protect and use your
              information.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: August 2, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Overview */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At ShopSphere, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, share, and protect your
              information when you use our website, mobile application, or
              services.
            </p>
          </Card>

          {/* Information We Collect */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-secondary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Personal Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Name, email address, phone number</li>
                  <li>• Billing and shipping addresses</li>
                  <li>
                    • Payment information (processed securely by our payment
                    partners)
                  </li>
                  <li>• Account preferences and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Usage Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Pages visited, products viewed, search queries</li>
                  <li>
                    • Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>• Cookies and similar tracking technologies</li>
                  <li>• Purchase history and preferences</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* How We Use Your Information */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Service Delivery
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Process and fulfill orders</li>
                  <li>• Provide customer support</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Handle returns and refunds</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Personalization</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Recommend products</li>
                  <li>• Customize your experience</li>
                  <li>• Send relevant promotions</li>
                  <li>• Improve our services</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Data Security */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Data Security
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Encryption
                  </h4>
                  <p className="text-sm text-emerald-700">
                    All data is encrypted using 256-bit SSL encryption
                  </p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    Secure Storage
                  </h4>
                  <p className="text-sm text-primary-700">
                    Data stored in secure, certified facilities
                  </p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                  <h4 className="font-semibold text-secondary-900 mb-2">
                    Access Control
                  </h4>
                  <p className="text-sm text-secondary-700">
                    Limited access on a need-to-know basis
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Regular Audits
                  </h4>
                  <p className="text-sm text-orange-700">
                    Security systems regularly tested and updated
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have the following rights regarding your personal
                information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Access</h4>
                    <p className="text-sm text-gray-700">
                      Request a copy of your personal data we hold
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Correction</h4>
                    <p className="text-sm text-gray-700">
                      Update or correct inaccurate information
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Deletion</h4>
                    <p className="text-sm text-gray-700">
                      Request deletion of your personal data
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Portability</h4>
                    <p className="text-sm text-gray-700">
                      Receive your data in a portable format
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Cookies */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookies and Tracking
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your
                experience:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Essential Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Required for basic site functionality and security
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Performance Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Help us understand how you use our site
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-gray-700">
                    Used to show you relevant advertisements
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Us */}
          <Card className="p-8 bg-gradient-to-r from-secondary-50 to-pink-50 border border-secondary-200/50 shadow-xl">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-secondary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Questions About Privacy?
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> privacy@shopsphere.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong> 123 Commerce Street, New York, NY
                10001
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
