import React from "react";
import { cn } from "@/lib/utils";
import { BarChart2, Clock, FileText } from "lucide-react";

export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  summary?: string;
  level?: string;
  duration?: string;
  moduleCount?: number | string;
  iconText?: string;
  iconBg?: string;
  icon?: React.ReactNode;
  orientation?: "vertical" | "horizontal";
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
  orientation = "vertical",
  className,
  ...props
}: CourseCardProps) {
  const displayModules =
    typeof moduleCount === "number" ? `${moduleCount} modules` : moduleCount;

  const renderedIcon = icon ? (
    <div className="shrink-0">{icon}</div>
  ) : (
    <div
      className={cn(
        "w-14 h-14 rounded-[14px] flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-sm",
        iconBg
      )}
    >
      {iconText}
    </div>
  );

  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-[16px] p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-neutral-300 cursor-pointer group",
        className
      )}
      {...props}
    >
      {orientation === "vertical" ? (
        <div className="space-y-4">
          {renderedIcon}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-[18px] leading-[24px] font-sans tracking-tight group-hover:text-primary-500 transition-colors">
              {title}
            </h3>
            <p className="text-neutral-500 text-[14px] leading-[22px] font-sans">
              {summary}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {renderedIcon}
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 text-[18px] leading-[24px] font-sans tracking-tight group-hover:text-primary-500 transition-colors">
              {title}
            </h3>
            <p className="text-neutral-500 text-[14px] leading-[20px] font-sans line-clamp-2">
              {summary}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center gap-4 text-neutral-500 text-[13px] font-sans">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-neutral-500 stroke-[2]" />
          <span>{displayModules}</span>
        </div>
      </div>
    </div>
  );
}
