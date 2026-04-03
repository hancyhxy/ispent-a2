import { useState, useCallback, useEffect } from 'react';

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
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="polite"
          className={`px-4 py-3 rounded-2xl text-sm font-medium text-white shadow-lg
            transition-all duration-200 ease-out animate-slide-in
            ${toast.type === 'error' ? 'bg-error' : 'bg-primary'}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
