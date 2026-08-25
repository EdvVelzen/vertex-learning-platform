import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "video" | "lesson" | "popular" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-2.5 py-1 text-[11px] tracking-wide",
  };

  const variantStyles = {
    video: "bg-[#FFEEE5] text-[#EA580C] font-semibold uppercase",
    lesson: "bg-[#EEF2FF] text-[#4F46E5] font-semibold uppercase",
    popular: "bg-[#FFEEE5] text-[#F97316] font-semibold uppercase",
    neutral: "bg-neutral-100 text-neutral-700 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] font-sans select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
