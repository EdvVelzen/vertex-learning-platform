import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title?: string;
  summary?: string;
  moduleLabel?: string;
  ctaText?: string;
  onView?: () => void;
}

export function LessonCard({
  badgeText = "LESSON",
  title = "Data Fetching & Caching",
  summary = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  ctaText = "View lesson",
  onView,
  className,
  ...props
}: LessonCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-[16px] p-6 shadow-sm flex flex-col justify-between transition-shadow duration-200 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        <div>
          <Badge variant="lesson">{badgeText}</Badge>
        </div>

        <h3 className="font-semibold text-neutral-900 text-[18px] leading-[24px] font-sans tracking-tight">
          {title}
        </h3>

        <p className="text-neutral-500 text-[14px] leading-[20px] font-sans line-clamp-2">
          {summary}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[13px] font-sans">
        <div className="text-neutral-500 font-medium">
          <span>{moduleLabel}</span>
        </div>

        <div
          onClick={(e) => {
            if (onView) {
              e.stopPropagation();
              onView();
            }
          }}
          className="flex items-center gap-1.5 text-primary-500 font-medium hover:text-[#EA580C] transition-colors"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
