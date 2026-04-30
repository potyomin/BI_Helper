import { CheckCircle2, X } from "lucide-react";
import type { ToastMessage } from "../types";

type ToastProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

const Toast = ({ toasts, onDismiss }: ToastProps) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 shadow-soft"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {toast.message}
          </span>
          <button
            type="button"
            className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;

