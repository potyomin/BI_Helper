import {
  createElement,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Toast from "../components/Toast";
import { createId } from "../utils/constants";
import type { ToastMessage } from "../types";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string) => {
    const id = createId();
    setToasts((current) => [...current, { id, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 1600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return createElement(
    ToastContext.Provider,
    { value },
    children,
    createElement(Toast, { toasts, onDismiss: dismissToast })
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
