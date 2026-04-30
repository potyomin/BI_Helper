import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white border border-brand-500 hover:bg-brand-600 hover:border-brand-600",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
  ghost: "bg-transparent text-slate-600 border border-transparent hover:bg-slate-100",
  danger:
    "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300",
};

const Button = ({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;

