import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const Textarea = ({ label, error, className = "", ...props }: TextareaProps) => (
  <label className="block w-full">
    {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
    <textarea
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${error ? "border-rose-300" : "border-slate-200"} ${className}`}
      {...props}
    />
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default Textarea;

