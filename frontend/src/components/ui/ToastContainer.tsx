import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeToast } from '../../store/slices/toastSlice';
import type {  Toast } from '../../store/slices/toastSlice';

import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  // Correctly destructuring the array from the ToastState object
  const { toasts } = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => dispatch(removeToast(toast.id))} 
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // Auto-hide after 5s
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-primary-500" />,
  };

  return (
    <div className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-in slide-in-from-right transition-all">
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{toast.title}</p>
        {toast.message && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{toast.message}</p>}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
