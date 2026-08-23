import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showLabel?: boolean;
  labelPosition?: "right" | "top";
}

export function ProgressBar({
  value,
  showLabel = true,
  labelPosition = "right",
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "w-full flex items-center gap-4 select-none",
        labelPosition === "top" && "flex-col items-start gap-2",
        className
      )}
      {...props}
    >
      <div className="flex-1 w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>

      {showLabel && (
        <div className="text-[13px] font-sans text-neutral-500 shrink-0 whitespace-nowrap">
          <span className="font-semibold text-neutral-900">{clampedValue}%</span>{" "}
          <span>complete</span>
        </div>
      )}
    </div>
  );
}
