import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "md" | "lg" | "sm";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      disabled,
      children,
      icon,
      iconPosition = "right",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[12px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2";

    const sizeStyles = {
      sm: "h-9 px-3 text-[13px] gap-1.5",
      md: "h-[44px] px-3 text-[14px] gap-2",
      lg: "h-[44px] px-4 text-[15px] gap-2",
    };

    const variantStyles = {
      primary: cn(
        "bg-primary-500 text-white shadow-sm",
        "hover:bg-[#EA580C]",
        "active:bg-[#C2410C]",
        "disabled:bg-[#FED7AA] disabled:text-white/90 disabled:cursor-not-allowed disabled:shadow-none"
      ),
      secondary: cn(
        "bg-white border border-primary-500 text-primary-500",
        "hover:bg-primary-100/40 hover:border-[#EA580C] hover:text-[#EA580C]",
        "active:bg-primary-100/70",
        "disabled:border-[#FED7AA] disabled:text-[#FED7AA] disabled:bg-white disabled:cursor-not-allowed"
      ),
      tertiary: cn(
        "bg-white border border-neutral-200 text-neutral-700",
        "hover:bg-neutral-100 hover:text-neutral-900 hover:border-neutral-300",
        "active:bg-neutral-200/70",
        "disabled:border-neutral-200/60 disabled:text-neutral-300 disabled:bg-white disabled:cursor-not-allowed"
      ),
      text: cn(
        "bg-transparent text-primary-500 p-0 h-auto font-medium",
        "hover:text-[#EA580C]",
        "active:text-[#C2410C]",
        "disabled:text-[#FED7AA] disabled:cursor-not-allowed"
      ),
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variant !== "text" && sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
