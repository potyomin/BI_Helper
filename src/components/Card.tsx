import type { HTMLAttributes, PropsWithChildren } from "react";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const Card = ({ children, className = "", ...props }: CardProps) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-soft ${className}`} {...props}>
    {children}
  </div>
);

export default Card;

