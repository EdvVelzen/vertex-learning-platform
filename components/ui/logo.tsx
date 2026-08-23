import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  className,
  ...props
}: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn("flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      {/* Vertex Faceted V Brand Icon */}
      <svg
        className={cn(iconSizes[size], "shrink-0")}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L18 30L18 17L12 6H4Z"
          fill="#EA580C"
        />
        <path
          d="M32 6L18 30L18 17L24 6H32Z"
          fill="#FB923C"
        />
        <path
          d="M12 6L18 17L24 6H12Z"
          fill="#F97316"
        />
      </svg>

      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-neutral-900 font-sans",
            textSizes[size]
          )}
        >
          Vertex
        </span>
      )}
    </div>
  );
}
