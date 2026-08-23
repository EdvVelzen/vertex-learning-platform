import React from "react";
import { cn } from "@/lib/utils";
import { BarChart2, Clock, BookOpen } from "lucide-react";

export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  summary?: string;
  level?: string;
  duration?: string;
  moduleCount?: number | string;
  iconText?: string;
  iconBg?: string;
  icon?: React.ReactNode;
}

export function CourseCard({
  title = "Next.js for Production",
  summary = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  moduleCount = "12 modules",
  iconText = "N",
  iconBg = "bg-black",
  icon,
  className,
  ...props
}: CourseCardProps) {
  const displayModules =
    typeof moduleCount === "number" ? `${moduleCount} modules` : moduleCount;

  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-[16px] p-6 shadow-sm flex flex-col justify-between transition-shadow duration-200 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="shrink-0">{icon}</div>
        ) : (
          <div
            className={cn(
              "w-12 h-12 rounded-[12px] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm",
              iconBg
            )}
          >
            {iconText}
          </div>
        )}

        <div className="space-y-1.5 flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 text-[18px] leading-[24px] font-sans tracking-tight">
            {title}
          </h3>
          <p className="text-neutral-500 text-[14px] leading-[20px] font-sans line-clamp-2">
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-4 text-neutral-500 text-[13px] font-sans">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{displayModules}</span>
        </div>
      </div>
    </div>
  );
}
