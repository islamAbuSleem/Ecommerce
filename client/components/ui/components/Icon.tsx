import type { HTMLAttributes, ReactNode } from "react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<IconSize, string> = {
  xs: "text-[14px]",
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[32px]",
};

type Props = {
  size?: IconSize;
  filled?: boolean;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

export function Icon({ size = "md", filled = false, className = "", children, ...rest }: Props) {
  return (
    <span className={`material-symbols-outlined ${sizeClasses[size]}${filled ? " icon-filled" : ""}${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </span>
  );
}
