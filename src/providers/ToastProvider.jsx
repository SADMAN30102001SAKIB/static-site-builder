"use client";

import { createContext, useState } from "react";
import Toast from "@/components/ui/Toast";

// Create toast context
export const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant, duration };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  };

  const dismiss = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toast toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}
