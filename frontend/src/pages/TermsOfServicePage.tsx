import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Mail,
} from "lucide-react";
import Card from "../components/ui/Card";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#f8fafc_100%)] dark:bg-[linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-600 to-pink-600 shadow-lg shadow-secondary-500/20">
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using our services.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: August 2, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Agreement */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Agreement to Terms
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
                By accessing and using ShopSphere's website, mobile application,
              or services, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the
              above, please do not use this service.
            </p>
          </Card>

          {/* Use License */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Use License</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Permission is granted to temporarily download one copy of the
                materials on ShopSphere's website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6">
                <li>• modify or copy the materials</li>
                <li>
                  • use the materials for any commercial purpose or for any
                  public display (commercial or non-commercial)
                </li>
                <li>
                  • attempt to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  • remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by ShopSphere at any
                time.
              </p>
            </div>
          </Card>

          {/* User Accounts */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              User Accounts
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Creation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of our service, you may be required
                  to create an account. You must provide accurate, complete, and
                  current information and keep your account information updated.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Security
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for safeguarding the password and for all
                  activities that occur under your account. You agree to
                  immediately notify us of any unauthorized use of your account.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Important</h4>
                    <p className="text-sm text-yellow-700">
                      We reserve the right to terminate accounts that violate
                      these terms or engage in fraudulent activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Purchases and Payments */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Purchases and Payments
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions, prices,
                  and availability. However, we do not warrant that product
                  descriptions or other content is accurate, complete, reliable,
                  current, or error-free.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pricing
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  All prices are subject to change without notice. We reserve
                  the right to modify or discontinue products at any time. In
                  case of pricing errors, we reserve the right to cancel orders.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Processing
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  By placing an order, you represent and warrant that you have
                  the legal right to use the payment method provided. We use
                  secure third-party payment processors to handle transactions.
                </p>
              </div>
            </div>
          </Card>

          {/* Shipping and Returns */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Shipping and Returns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Shipping Policy
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Standard shipping: 5-7 business days</li>
                  <li>• Express shipping: 2-3 business days</li>
                  <li>• Overnight shipping: Next business day</li>
                  <li>• Free shipping on orders over $100</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Return Policy
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 30-day return window</li>
                  <li>• Items must be unused and in original packaging</li>
                  <li>• Return shipping fees may apply</li>
                  <li>• Refunds processed within 3-5 business days</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Prohibited Uses */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Prohibited Uses
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You may not use our service:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• For any unlawful purpose</li>
                  <li>• To transmit viruses or malicious code</li>
                  <li>• To impersonate others</li>
                  <li>• To spam or send unsolicited messages</li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• To collect user information</li>
                  <li>• To violate intellectual property rights</li>
                  <li>• To disrupt or interfere with our services</li>
                  <li>• To engage in fraudulent activities</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Disclaimer
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The information on this website is provided on an "as is" basis.
                To the fullest extent permitted by law, this Company excludes
                all representations, warranties, conditions and terms whether
                express or implied.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Limitation of Liability
                </h4>
                <p className="text-sm text-gray-700">
                  In no event shall ShopSphere or its suppliers be liable for
                  any damages (including, without limitation, damages for loss
                  of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on
                  ShopSphere's website.
                </p>
              </div>
            </div>
          </Card>

          {/* Changes to Terms */}
          <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
                ShopSphere may revise these terms of service at any time without
              notice. By using this website, you are agreeing to be bound by the
              then current version of these terms of service.
            </p>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 bg-gradient-to-r from-secondary-50 to-pink-50 border border-secondary-200/50 shadow-xl">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-secondary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Questions About Terms?
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> legal@shopsphere.com
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

export default TermsOfServicePage;
