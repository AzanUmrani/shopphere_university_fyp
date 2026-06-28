import { useState } from "react";
import {
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  Check,
  Lock,
  Shield,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  cardType?: "visa" | "mastercard" | "amex" | "discover";
  lastFour: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  isDefault: boolean;
  nickname?: string;
}

interface CardForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  nickname: string;
}

const UserPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [formData, setFormData] = useState<CardForm>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    nickname: "",
  });

  // Mock data initialization
  useState(() => {
    setPaymentMethods([
      {
        id: "1",
        type: "card",
        cardType: "visa",
        lastFour: "4242",
        expiryMonth: 12,
        expiryYear: 2026,
        holderName: "John Doe",
        isDefault: true,
        nickname: "Personal Visa",
      },
      {
        id: "2",
        type: "card",
        cardType: "mastercard",
        lastFour: "5555",
        expiryMonth: 8,
        expiryYear: 2025,
        holderName: "John Doe",
        isDefault: false,
        nickname: "Work Card",
      },
    ]);
  });

  const getCardIcon = (cardType?: string) => {
    const icons = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
    };
    return icons[cardType as keyof typeof icons] || "💳";
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.match(/^4/)) return "visa";
    if (number.match(/^5[1-5]/)) return "mastercard";
    if (number.match(/^3[47]/)) return "amex";
    if (number.match(/^6/)) return "discover";
    return "unknown";
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      cardType: getCardBrand(formData.cardNumber) as PaymentMethod["cardType"],
      lastFour: formData.cardNumber.slice(-4),
      expiryMonth: parseInt(formData.expiryMonth),
      expiryYear: parseInt(formData.expiryYear),
      holderName: formData.holderName,
      isDefault: paymentMethods.length === 0,
      nickname: formData.nickname || undefined,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
      nickname: "",
    });
    setIsAddingNew(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== id)
    );
  };

  const isFormValid = () => {
    return (
      formData.cardNumber.replace(/\s/g, "").length >= 13 &&
      formData.expiryMonth &&
      formData.expiryYear &&
      formData.cvv.length >= 3 &&
      formData.holderName.trim()
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Methods
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved payment methods
          </p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-1">
              Your payment information is secure
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              We use industry-standard encryption to protect your payment
              details. Your card information is never stored on our servers.
            </p>
          </div>
        </div>
      </Card>

      {/* Add New Payment Method Form */}
      {isAddingNew && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Add New Card</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Number
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
                  {getCardIcon(getCardBrand(formData.cardNumber))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Month
                </label>
                <select
                  value={formData.expiryMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryMonth: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Year
                </label>
                <select
                  value={formData.expiryYear}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryYear: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() + i}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVV
                </label>
                <div className="relative">
                  <Input
                    type={showCVV ? "text" : "password"}
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCVV(!showCVV)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCVV ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Input
              type="text"
              placeholder="Cardholder Name"
              value={formData.holderName}
              onChange={(e) =>
                setFormData({ ...formData, holderName: e.target.value })
              }
            />

            <Input
              type="text"
              placeholder="Card Nickname (Optional)"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
            />

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setFormData({
                    cardNumber: "",
                    expiryMonth: "",
                    expiryYear: "",
                    cvv: "",
                    holderName: "",
                    nickname: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPaymentMethod}
                disabled={!isFormValid()}
              >
                Add Card
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-6 relative">
            {method.isDefault && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Default
                </span>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gradient-to-r from-secondary-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                <CreditCard className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {method.cardType} ending in {method.lastFour}
                  </h3>
                  {method.nickname && (
                    <span className="text-sm text-gray-500">
                      ({method.nickname})
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {method.holderName && <p>{method.holderName}</p>}
                  {method.expiryMonth && method.expiryYear && (
                    <p className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      console.log("Edit payment method:", method.id)
                    }
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(method.id)}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && !isAddingNew && (
        <Card className="p-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No payment methods
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add a payment method to make checkout faster and easier.
          </p>
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Payment Method
          </Button>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="p-4 border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Security Information
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• All payment information is encrypted and secure</li>
              <li>• We never store your full card number or CVV</li>
              <li>• You can remove payment methods at any time</li>
              <li>
                • Transactions are processed through secure payment gateways
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserPaymentMethods;
