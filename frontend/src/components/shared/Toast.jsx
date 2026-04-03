import { useState, useCallback, useEffect } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';

let toastId = 0;
let addToastFn = null;

export function showToast(message, type = 'success') {
  if (addToastFn) addToastFn({ id: ++toastId, message, type });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToastFn = useCallback((toast) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium
            bg-gray-800 text-gray-100 shadow-md
            transition-all duration-200 ease-out animate-slide-in"
        >
          {toast.type === 'error' ? (
            <CircleX size={14} className="text-red-400 shrink-0" />
          ) : (
            <CircleCheck size={14} className="text-green-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
