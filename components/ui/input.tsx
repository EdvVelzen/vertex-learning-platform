import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  shortcut?: string;
  isSearch?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, shortcut, isSearch, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {isSearch ? (
          <Search className="absolute left-4 w-5 h-5 text-neutral-500 pointer-events-none stroke-[2]" />
        ) : icon ? (
          <div className="absolute left-4 flex items-center pointer-events-none text-neutral-500">
            {icon}
          </div>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full h-[44px] bg-white border border-neutral-200 rounded-[12px] text-neutral-900 text-[14px] placeholder:text-neutral-500 font-sans transition-all duration-150",
            "focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400",
            (isSearch || icon) ? "pl-11" : "pl-4",
            shortcut ? "pr-14" : "pr-4",
            className
          )}
          {...props}
        />

        {shortcut && (
          <div className="absolute right-3.5 flex items-center gap-0.5 px-2 py-0.5 rounded-md border border-neutral-200 bg-neutral-100/60 text-neutral-500 text-[12px] font-medium pointer-events-none select-none">
            {shortcut}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
