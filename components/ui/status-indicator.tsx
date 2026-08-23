import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

export type StatusType = "in-progress" | "completed" | "now-playing" | "locked";

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label?: string;
  showLabel?: boolean;
}

export function StatusIndicator({
  status,
  label,
  showLabel = true,
  className,
  ...props
}: StatusIndicatorProps) {
  const configs = {
    "in-progress": {
      defaultLabel: "In Progress",
      icon: (
        <svg
          className="w-4 h-4 text-primary-500 shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="10" cy="10" r="7" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
        </svg>
      ),
      textColor: "text-neutral-900",
    },
    completed: {
      defaultLabel: "Completed",
      icon: <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 stroke-[2]" />,
      textColor: "text-neutral-900",
    },
    "now-playing": {
      defaultLabel: "Now Playing",
      icon: (
        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      ),
      textColor: "text-neutral-900",
    },
    locked: {
      defaultLabel: "Locked",
      icon: <Lock className="w-4 h-4 text-neutral-500 shrink-0 stroke-[2]" />,
      textColor: "text-neutral-500",
    },
  };

  const config = configs[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      className={cn("inline-flex items-center gap-2 text-[14px] font-sans font-medium", className)}
      {...props}
    >
      {config.icon}
      {showLabel && <span className={config.textColor}>{displayLabel}</span>}
    </div>
  );
}
