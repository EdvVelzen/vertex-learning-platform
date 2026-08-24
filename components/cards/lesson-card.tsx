"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, ChevronRight, Check } from "lucide-react";
import { SanityImageReference } from "@/sanity/lib/types";

export interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title: string;
  summary?: string;
  moduleLabel?: string;
  keyPoints?: string[];
  course?: {
    title: string;
    slug?: { current: string } | string;
    icon?: string;
    coverImage?: SanityImageReference;
  };
  lessonSlug?: string;
  courseSlug?: string;
  ctaText?: string;
  onView?: () => void;
}

export function LessonCard({
  badgeText = "LESSON",
  title = "Data Fetching & Caching",
  summary = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  keyPoints = [
    "Fetching strategies",
    "Caching techniques",
    "Revalidation methods",
  ],
  course = { title: "Next.js for Production" },
  lessonSlug = "nextjs-app-router-in-depth-caching-and-revalidation",
  ctaText = "View lesson",
  onView,
  className,
  ...props
}: LessonCardProps) {
  const targetUrl = `/lessons/${lessonSlug}`;

  const courseTitle = course?.title || "Vertex";
  const firstLetter = courseTitle.charAt(0);
  const isNext = courseTitle.toLowerCase().includes("next");
  const isReact = courseTitle.toLowerCase().includes("react");
  const isNode = courseTitle.toLowerCase().includes("node");
  const isJs = courseTitle.toLowerCase().includes("javascript");

  return (
    <div
      className={cn(
        "group bg-white border border-neutral-200/90 rounded-[16px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col md:flex-row gap-5 sm:gap-6",
        className
      )}
      {...props}
    >
      {/* Left Column: Key Points / Takeaway Preview Box */}
      <Link
        href={targetUrl}
        className="w-full md:w-[280px] lg:w-[320px] shrink-0 rounded-[12px] bg-[#F8FAFC] border border-neutral-100 p-4 sm:p-5 relative flex flex-col justify-between min-h-[140px] group-hover:bg-[#F1F5F9] transition-colors select-none"
      >
        <div>
          {/* Top Icon */}
          <div className="text-neutral-400 mb-3">
            {isReact ? (
              <span className="text-sky-500 text-lg">⚛</span>
            ) : (
              <FileText className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
            )}
          </div>

          {/* Key Bullet Points */}
          <ul className="space-y-2 text-[13px] text-neutral-600 font-sans leading-snug">
            {keyPoints.slice(0, 3).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">•</span>
                <span className="line-clamp-1">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Checkmark Circle */}
        <div className="self-end mt-2 w-6 h-6 rounded-full bg-neutral-200/80 text-neutral-500 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </Link>

      {/* Right Column: Information & Actions */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top Line: Course Tag & LESSON Badge */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-5 h-5 rounded-[4px] flex items-center justify-center text-[11px] font-bold shrink-0",
                  isNext
                    ? "bg-black text-white font-serif"
                    : isReact
                    ? "bg-sky-500 text-white"
                    : isNode
                    ? "bg-emerald-600 text-white"
                    : isJs
                    ? "bg-amber-400 text-neutral-900"
                    : "bg-neutral-800 text-white"
                )}
              >
                {isNext ? "N" : isReact ? "⚛" : isNode ? "JS" : isJs ? "JS" : firstLetter}
              </div>
              <span className="text-[13px] font-medium text-neutral-600 truncate font-sans">
                {courseTitle}
              </span>
            </div>

            <Badge variant="lesson" className="shrink-0">
              {badgeText}
            </Badge>
          </div>

          {/* Title */}
          <Link href={targetUrl} className="block group-hover:text-primary-500 transition-colors">
            <h3 className="font-semibold text-neutral-900 text-[18px] sm:text-[19px] leading-[26px] font-sans tracking-tight">
              {title}
            </h3>
          </Link>

          {/* Description */}
          {summary && (
            <p className="text-neutral-500 text-[14px] leading-[21px] font-sans line-clamp-2 mt-1.5">
              {summary}
            </p>
          )}

          {/* Module Label */}
          {moduleLabel && (
            <div className="mt-2 text-[13px] text-neutral-500 font-medium font-sans">
              {moduleLabel}
            </div>
          )}
        </div>

        {/* Bottom Line: Action */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-end text-[13px] font-sans">
          <Link
            href={targetUrl}
            onClick={(e) => {
              if (onView) {
                e.preventDefault();
                onView();
              }
            }}
            className="flex items-center gap-1.5 text-primary-500 font-semibold hover:text-[#EA580C] transition-colors"
          >
            <span>{ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
