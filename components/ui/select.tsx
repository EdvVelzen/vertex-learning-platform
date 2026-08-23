import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, children, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            "w-full h-[44px] bg-white border border-neutral-200 rounded-[12px] text-neutral-900 text-[14px] font-sans px-4 pr-10 appearance-none cursor-pointer transition-all duration-150",
            "focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-3.5 w-4 h-4 text-neutral-700 pointer-events-none stroke-[2]" />
      </div>
    );
  }
);

Select.displayName = "Select";
