import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";

export interface LessonVideoCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title?: string;
  summary?: string;
  lessonLabel?: string;
  timestamp?: string;
  ctaText?: string;
  onWatch?: () => void;
}

export function LessonVideoCard({
  badgeText = "VIDEO",
  title = "Data Fetching in Server Components",
  summary = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonLabel = "Lesson 5.1",
  timestamp = "12:45",
  ctaText,
  onWatch,
  className,
  ...props
}: LessonVideoCardProps) {
  const watchText = ctaText || `Watch from ${timestamp}`;

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
          <Badge variant="video">{badgeText}</Badge>
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
          <span>{lessonLabel}</span>
          <span className="mx-2">•</span>
          <span>{timestamp}</span>
        </div>

        <div
          onClick={(e) => {
            if (onWatch) {
              e.stopPropagation();
              onWatch();
            }
          }}
          className="flex items-center gap-1.5 text-primary-500 font-medium hover:text-[#EA580C] transition-colors"
        >
          <PlayCircle className="w-4 h-4 stroke-[2]" />
          <span>{watchText}</span>
        </div>
      </div>
    </div>
  );
}
