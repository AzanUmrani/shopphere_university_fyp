// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   CheckCircle,
//   Package,
//   Calendar,
//   Truck,
//   Download,
//   ArrowRight,
// } from "lucide-react";
// import { useEffect } from "react";
// import Button from "../components/ui/Button";
// import Card from "../components/ui/Card";

// const CheckoutSuccessPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get order details from navigation state
//   const orderData = location.state as {
//     orderNumber: string;
//     total: number;
//     shippingMethod: string;
//     estimatedDelivery: string;
//   } | null;

//   useEffect(() => {
//     // Redirect to home if no order data
//     if (!orderData) {
//       navigate("/", { replace: true });
//     }
//   }, [orderData, navigate]);

//   if (!orderData) {
//     return null;
//   }

//   const { orderNumber, total, shippingMethod, estimatedDelivery } = orderData;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-pink-50 to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
//               <CheckCircle className="w-12 h-12 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
//             <p className="text-emerald-100 text-lg">
//               Thank you for your purchase. Your order has been successfully
//               placed.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Order Summary */}
//         <Card className="p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl mb-8">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//               Order Details
//             </h2>
//             <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full border border-emerald-200 dark:border-emerald-800">
//               <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
//               <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
//                 Order #{orderNumber}
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* Order Total */}
//             <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-pink-50 dark:from-secondary-900/10 dark:to-pink-900/10 rounded-xl border border-secondary-200/50 dark:border-secondary-800/30">
//               <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <span className="text-white font-bold text-lg">$</span>
//               </div>
//               <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">Order Total</h3>
//               <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
//                 ${total.toFixed(2)}
//               </p>
//             </div>

//             {/* Shipping Method */}
//             <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-50 dark:from-primary-900/10 dark:to-primary-900/10 rounded-xl border border-primary-200/50 dark:border-primary-800/30">
//               <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <Truck className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">Shipping</h3>
//               <p className="text-primary-600 dark:text-primary-400 font-medium capitalize">
//                 {shippingMethod === "standard"
//                   ? "Standard Shipping"
//                   : shippingMethod === "express"
//                   ? "Express Shipping"
//                   : "Overnight Shipping"}
//               </p>
//             </div>

//             {/* Estimated Delivery */}
//             <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
//               <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <Calendar className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">
//                 Estimated Delivery
//               </h3>
//               <p className="text-emerald-600 dark:text-emerald-400 font-medium">
//                 {estimatedDelivery}
//               </p>
//             </div>
//           </div>

//           {/* What's Next */}
//           <div className="bg-gradient-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 rounded-xl p-6 border border-primary-200/50 dark:border-primary-800/30">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               What happens next?
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-start">
//                 <div className="w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
//                   <span className="text-xs font-bold">1</span>
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-900 dark:text-gray-100">
//                     Order Confirmation
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm">
//                     You'll receive an email confirmation shortly with your order
//                     details.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <div className="w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
//                   <span className="text-xs font-bold">2</span>
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-900 dark:text-gray-100">Processing</p>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm">
//                     We'll prepare your order for shipment within 1-2 business
//                     days.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <div className="w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
//                   <span className="text-xs font-bold">3</span>
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-900 dark:text-gray-100">Shipment Tracking</p>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm">
//                     You'll receive tracking information once your order ships.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button
//             onClick={() => navigate("/products")}
//             className="bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 text-white"
//           >
//             Continue Shopping
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </Button>

//           <Button
//             variant="outline"
//             onClick={() => window.print()}
//             className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//           >
//             <Download className="w-5 h-5 mr-2" />
//             Print Receipt
//           </Button>
//         </div>

//         {/* Support Info */}
//         <div className="mt-12 text-center">
//           <Card className="p-6 bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl border border-white/30 dark:border-white/10">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//               Need Help?
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">
//               Our customer support team is here to assist you with any questions
//               about your order.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/contact")}
//                 className="border-secondary-200 dark:border-secondary-900/50 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20"
//               >
//                 Contact Support
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/faq")}
//                 className="border-primary-200 dark:border-primary-900/50 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
//               >
//                 View FAQ
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutSuccessPage;

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { clearCartAsync } from '../store/slices/cartSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // 1. Clear the cart as soon as the user lands here
    dispatch(clearCartAsync());
    
    // 2. Optional: You could fetch session details from backend here 
    // to show an order summary if you wanted to.
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-200">
      <Card className="max-w-lg w-full p-8 md:p-10 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your order has been confirmed and is being processed.
          {sessionId && (
            <span className="block mt-1.5 text-xs font-mono text-gray-400 dark:text-gray-500">
              Ref: {sessionId.substring(0, 12)}...
            </span>
          )}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
            <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">Fast Shipping</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">3–5 business days</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
            <Download className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">Digital Receipt</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sent to your email</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            View Order Status
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;
