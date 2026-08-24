"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, FileText, Folder, Play, ChevronRight } from "lucide-react";
import { SanityImageReference } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";

export interface LessonVideoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title: string;
  summary?: string;
  lessonLabel?: string;
  moduleLabel?: string;
  timestamp?: string;
  startSeconds?: number;
  thumbnail?: SanityImageReference | string;
  course?: {
    title: string;
    slug?: { current: string } | string;
    icon?: string;
    coverImage?: SanityImageReference;
  };
  lessonSlug?: string;
  courseSlug?: string;
  ctaText?: string;
  onWatch?: () => void;
}

export function LessonVideoCard({
  badgeText = "VIDEO",
  title = "Data Fetching in Server Components",
  summary = "Learn how to fetch data on the server using async/await and Next.js best practices for better performance.",
  lessonLabel = "Lesson 5.1",
  moduleLabel = "Data Fetching & Caching",
  timestamp = "12:45",
  startSeconds = 0,
  thumbnail,
  course = { title: "Next.js for Production" },
  lessonSlug = "nextjs-app-router-in-depth-fetching-in-server-components",
  ctaText,
  onWatch,
  className,
  ...props
}: LessonVideoCardProps) {
  const watchText = ctaText || `Watch from ${timestamp}`;
  const targetUrl = `/lessons/${lessonSlug}${startSeconds > 0 ? `?start=${Math.floor(startSeconds)}` : ""}`;

  // Helper for topic badge / course initial
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
      {/* Left Column: Video Preview with Play Button & Timestamp Pill */}
      <Link
        href={targetUrl}
        className="relative w-full md:w-[280px] lg:w-[320px] aspect-video shrink-0 rounded-[12px] overflow-hidden bg-neutral-950 flex items-center justify-center group-hover:opacity-95 transition-opacity select-none"
      >
        {/* Poster / Thumbnail or stylized graphic */}
        {thumbnail ? (
          typeof thumbnail === "string" ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : thumbnail.asset ? (
            <Image
              src={urlFor(thumbnail).width(640).height(360).url()}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
            {isNext && (
              <span className="text-white/20 font-serif text-5xl font-bold">N</span>
            )}
            {isReact && (
              <span className="text-sky-500/20 font-sans text-5xl font-bold">⚛</span>
            )}
            {isNode && (
              <span className="text-emerald-500/20 font-sans text-5xl font-bold">JS</span>
            )}
            {isJs && !isNode && (
              <span className="text-amber-500/20 font-sans text-5xl font-bold">JS</span>
            )}
          </div>
        )}

        {/* Centered Play Button */}
        <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 group-hover:bg-white text-neutral-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
          <Play className="w-5 h-5 fill-current ml-0.5 text-neutral-900" />
        </div>

        {/* Bottom-right Timestamp Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-[6px] bg-black/80 backdrop-blur-xs text-white text-[12px] font-mono font-medium tracking-tight">
          {timestamp}
        </div>
      </Link>

      {/* Right Column: Information & Actions */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top Line: Course Tag & VIDEO Badge */}
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

            <Badge variant="video" className="shrink-0">
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
        </div>

        {/* Bottom Line: Lesson / Module breadcrumb & Watch CTA */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-[13px] font-sans">
          <div className="flex items-center gap-2 text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" />
              <span>{lessonLabel}</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
              <Folder className="w-3.5 h-3.5 text-neutral-400 stroke-[2]" />
              <span>{moduleLabel}</span>
            </span>
          </div>

          <Link
            href={targetUrl}
            onClick={(e) => {
              if (onWatch) {
                e.preventDefault();
                onWatch();
              }
            }}
            className="flex items-center gap-1.5 text-primary-500 font-semibold hover:text-[#EA580C] transition-colors"
          >
            <PlayCircle className="w-4 h-4 stroke-[2]" />
            <span>{watchText}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
