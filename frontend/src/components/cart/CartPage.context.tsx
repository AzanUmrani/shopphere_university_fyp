// import React from "react";
// import { useCart } from "../../contexts/CartContext";

// const CartPage: React.FC = () => {
//   // Instead of destructuring, get the entire context first
//   let cartContext;
//   try {
//     cartContext = useCart();
//   } catch (error) {
//     console.error("Failed to get cart context:", error);
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <div className="text-red-600 text-xl font-semibold mb-4">
//               Cart Temporarily Unavailable
//             </div>
//             <p className="text-gray-600">
//               We're having trouble loading your cart. Please try refreshing the page.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//             >
//               Refresh Page
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cartContext) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <p className="text-gray-600">Loading cart...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { state } = cartContext;

//   // Safe access to async functions with error handling
//   const handleQuantityChange = async (itemId: string, newQuantity: number) => {
//     try {
//       if (newQuantity <= 0) {
//         if (cartContext.removeFromCart) {
//           await cartContext.removeFromCart(itemId);
//         }
//       } else {
//         if (cartContext.updateCartItem) {
//           await cartContext.updateCartItem(itemId, newQuantity);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to update cart item:", error);
//       alert("Failed to update cart. Please try again.");
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       if (window.confirm("Are you sure you want to clear your cart?")) {
//         if (cartContext.clearCart) {
//           await cartContext.clearCart();
//         }
//       }
//     } catch (error) {
//       console.error("Failed to clear cart:", error);
//       alert("Failed to clear cart. Please try again.");
//     }
//   };

//   const handleCheckout = () => {
//     alert("Checkout functionality will be implemented here");
//   };

//   // Safe state access
//   const cartState = state || {
//     loading: false,
//     error: null,
//     cart: { items: [], totalAmount: 0, itemCount: 0, id: null }
//   };

//   if (cartState.loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading your cart...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cartState.error) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <div className="text-red-600 text-xl font-semibold mb-4">
//               Error Loading Cart
//             </div>
//             <p className="text-gray-600 mb-4">{cartState.error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const cart = cartState.cart || { items: [], totalAmount: 0, itemCount: 0, id: null };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//           <p className="mt-2 text-gray-600">
//             {cart.items.length > 0
//               ? `${cart.itemCount} ${cart.itemCount === 1 ? "item" : "items"} in your cart`
//               : "Your cart is empty"}
//           </p>
//         </div>

//         {cart.items.length === 0 ? (
//           /* Empty Cart */
//           <div className="text-center py-12">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 5l-1 5h10l1-5M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
//               />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
//             <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
//             <div className="mt-6">
//               <a
//                 href="/products"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//               >
//                 Continue Shopping
//               </a>
//             </div>
//           </div>
//         ) : (
//           <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
//             {/* Cart Items */}
//             <div className="lg:col-span-8">
//               <div className="bg-white shadow rounded-lg">
//                 <div className="px-4 py-6 sm:px-6">
//                   <div className="flow-root">
//                     <ul role="list" className="-my-6 divide-y divide-gray-200">
//                       {cart.items.map((item) => (
//                         <li key={item.id} className="py-6 flex">
//                           <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
//                             <img
//                               src={item.product?.images?.[0]?.url || "/placeholder-product.svg"}
//                               alt={item.product?.images?.[0]?.alt || item.product?.name}
//                               className="w-full h-full object-center object-cover"
//                             />
//                           </div>

//                           <div className="ml-4 flex-1 flex flex-col">
//                             <div>
//                               <div className="flex justify-between text-base font-medium text-gray-900">
//                                 <h3>{item.product?.name}</h3>
//                                 <p className="ml-4">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
//                               </div>
//                               <p className="mt-1 text-sm text-gray-500">
//                                 ${(item.product?.price || 0).toFixed(2)} each
//                               </p>
//                             </div>
//                             <div className="flex-1 flex items-end justify-between text-sm">
//                               <div className="flex items-center">
//                                 <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-500">
//                                   Qty
//                                 </label>
//                                 <select
//                                   id={`quantity-${item.id}`}
//                                   value={item.quantity}
//                                   onChange={(e) =>
//                                     handleQuantityChange(item.id, parseInt(e.target.value))
//                                   }
//                                   className="rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
//                                 >
//                                   {[...Array(10)].map((_, i) => (
//                                     <option key={i + 1} value={i + 1}>
//                                       {i + 1}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>

//                               <div className="flex">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(item.id, 0)}
//                                   className="font-medium text-primary-600 hover:text-primary-500"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Cart Actions */}
//                 <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
//                   <button
//                     onClick={handleClearCart}
//                     className="text-sm font-medium text-red-600 hover:text-red-500"
//                   >
//                     Clear Cart
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="mt-16 lg:mt-0 lg:col-span-4">
//               <div className="bg-white shadow rounded-lg">
//                 <div className="px-4 py-6 sm:px-6">
//                   <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

//                   <div className="mt-6 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <dt className="text-sm text-gray-600">Subtotal</dt>
//                       <dd className="text-sm font-medium text-gray-900">
//                         ${cart.totalAmount.toFixed(2)}
//                       </dd>
//                     </div>
//                     <div className="flex items-center justify-between border-t border-gray-200 pt-4">
//                       <dt className="text-base font-medium text-gray-900">Order total</dt>
//                       <dd className="text-base font-medium text-gray-900">
//                         ${cart.totalAmount.toFixed(2)}
//                       </dd>
//                     </div>
//                   </div>

//                   <div className="mt-6">
//                     <button
//                       onClick={handleCheckout}
//                       className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500"
//                     >
//                       Checkout
//                     </button>
//                   </div>

//                   <div className="mt-6 text-sm text-center">
//                     <a
//                       href="/products"
//                       className="text-primary-600 font-medium hover:text-primary-500"
//                     >
//                       Continue Shopping
//                       <span aria-hidden="true"> →</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;
