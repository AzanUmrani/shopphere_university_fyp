import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import Card from "../components/ui/Card";

const faqData = [
  {
    id: 1,
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. All orders are processed within 1-2 business days.",
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all items in their original condition. Items must be unused and in their original packaging. Return shipping is free for defective items.",
  },
  {
    id: 3,
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only ship within the United States. We're working on expanding our shipping options to international destinations in the near future.",
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly with the shipping carrier.",
  },
  {
    id: 5,
    question: "Are my payment details secure?",
    answer:
      "Yes, we use SSL encryption and secure payment processors to protect your payment information. We never store your credit card details on our servers.",
  },
  {
    id: 6,
    question: "Can I modify or cancel my order?",
    answer:
      "You can modify or cancel your order within 1 hour of placing it, as long as it hasn't been processed for shipping. Contact our support team for assistance.",
  },
  {
    id: 7,
    question: "Do you offer price matching?",
    answer:
      "We don't currently offer price matching, but we do run regular sales and promotions. Sign up for our newsletter to stay updated on deals and discounts.",
  },
  {
    id: 8,
    question: "How do I create an account?",
    answer:
      "Click the 'Register' link in the top navigation or at checkout. You'll need to provide your email address and create a password. Having an account makes checkout faster and allows you to track orders.",
  },
];

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-secondary-100 dark:text-secondary-200/80 text-lg">
              Find answers to common questions about our products and services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqData.map((faq) => (
            <Card
              key={faq.id}
              className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                {openItems.includes(faq.id) ? (
                  <ChevronUp className="w-5 h-5 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary-600 dark:text-secondary-400 flex-shrink-0" />
                )}
              </button>
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12">
          <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary-600 to-pink-600 dark:from-secondary-500 dark:to-pink-500 text-white font-medium rounded-xl hover:from-secondary-700 hover:to-pink-700 dark:hover:from-secondary-600 dark:hover:to-pink-600 transition-all shadow-lg hover:shadow-secondary-500/20"
            >
              Contact Support
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
