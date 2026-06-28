// import { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";
// import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

// type ToastType = "success" | "error" | "warning" | "info";

// interface Toast {
//   id: string;
//   type: ToastType;
//   title: string;
//   message?: string;
// }

// interface ToastContextType {
//   toasts: Toast[];
//   showToast: (type: ToastType, title: string, message?: string) => void;
//   removeToast: (id: string) => void;
// }

// const ToastContext = createContext<ToastContextType | undefined>(undefined);

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error("useToast must be used within a ToastProvider");
//   }
//   return context;
// };

// const ToastIcon = ({ type }: { type: ToastType }) => {
//   switch (type) {
//     case "success":
//       return <CheckCircle className="w-5 h-5 text-green-500" />;
//     case "error":
//       return <XCircle className="w-5 h-5 text-red-500" />;
//     case "warning":
//       return <AlertCircle className="w-5 h-5 text-yellow-500" />;
//     case "info":
//       return <Info className="w-5 h-5 text-primary-500" />;
//     default:
//       return <Info className="w-5 h-5 text-gray-500" />;
//   }
// };

// const ToastItem = ({
//   toast,
//   onRemove,
// }: {
//   toast: Toast;
//   onRemove: (id: string) => void;
// }) => {
//   const bgColor = {
//     success: "bg-green-50 border-green-200",
//     error: "bg-red-50 border-red-200",
//     warning: "bg-yellow-50 border-yellow-200",
//     info: "bg-primary-50 border-primary-200",
//   };

//   return (
//     <div
//       className={`${
//         bgColor[toast.type]
//       } border rounded-lg p-4 shadow-lg mb-3 animate-slide-in-right max-w-sm`}
//     >
//       <div className="flex items-start">
//         <ToastIcon type={toast.type} />
//         <div className="ml-3 flex-1">
//           <p className="text-sm font-medium text-gray-900">{toast.title}</p>
//           {toast.message && (
//             <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
//           )}
//         </div>
//         <button
//           onClick={() => onRemove(toast.id)}
//           className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export const ToastProvider = ({ children }: { children: ReactNode }) => {
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const showToast = (type: ToastType, title: string, message?: string) => {
//     const id = Date.now().toString();
//     const newToast: Toast = { id, type, title, message };

//     setToasts((prev) => [...prev, newToast]);

//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       removeToast(id);
//     }, 5000);
//   };

//   const removeToast = (id: string) => {
//     setToasts((prev) => prev.filter((toast) => toast.id !== id));
//   };

//   return (
//     <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
//       {children}

//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };

// // Add animation styles to your CSS
// const toastStyles = `
// @keyframes slide-in-right {
//   from {
//     opacity: 0;
//     transform: translateX(100%);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// }

// .animate-slide-in-right {
//   animation: slide-in-right 0.3s ease-out;
// }
// `;

// // Inject styles
// if (typeof document !== "undefined") {
//   const styleElement = document.createElement("style");
//   styleElement.textContent = toastStyles;
//   document.head.appendChild(styleElement);
// }
