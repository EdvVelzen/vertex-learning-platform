import React from "react";
import Image from "next/image";
import { CourseSummary, SanityImageReference } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";

interface CourseIconProps {
  course?: {
    title?: string;
    slug?: { current: string };
    coverImage?: SanityImageReference;
  } | CourseSummary;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CourseIcon({ course, size = "md", className }: CourseIconProps) {
  if (!course) return null;

  const sizeClasses = {
    sm: "w-10 h-10 rounded-[10px] text-xl",
    md: "w-14 h-14 rounded-[14px] text-2xl",
    lg: "w-20 h-20 rounded-[18px] text-3xl",
  }[size];

  // 1. Sanity cover image takes top priority
  if (course.coverImage?.asset) {
    const pxSize = size === "sm" ? 80 : size === "md" ? 112 : 160;
    return (
      <div
        className={`relative shrink-0 overflow-hidden shadow-sm bg-neutral-100 ${sizeClasses} ${className || ""}`}
      >
        <Image
          src={urlFor(course.coverImage).width(pxSize).height(pxSize).url()}
          alt={course.title || "Course thumbnail"}
          width={pxSize / 2}
          height={pxSize / 2}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 2. Fallbacks based on technology / topic
  const slug = course.slug?.current?.toLowerCase() || "";
  const title = course.title?.toLowerCase() || "";

  if (slug.includes("nextjs") || title.includes("next.js") || title.includes("react")) {
    return (
      <div
        className={`bg-black flex items-center justify-center text-white font-serif font-bold shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        N
      </div>
    );
  }

  if (
    slug.includes("docker") ||
    slug.includes("kubernetes") ||
    slug.includes("devops") ||
    title.includes("docker")
  ) {
    return (
      <div
        className={`bg-[#E0F2FE] flex items-center justify-center shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        <svg
          className={size === "sm" ? "w-7 h-7" : size === "lg" ? "w-14 h-14" : "w-10 h-10"}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="11" y="18" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <rect x="16" y="18" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <rect x="21" y="18" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <rect x="16" y="13.5" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <rect x="21" y="13.5" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <rect x="21" y="9" width="4" height="3.6" rx="0.5" fill="#0284C7" />
          <path
            d="M5 27C6.5 23.5 10 22.5 14 22.5H28C35 22.5 39 26 40.5 29C41.7 31.2 41 34 38.5 35C36 36 33 36 28 36C17 36 8 35 5 27Z"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <path
            d="M40 29C43 27.5 45 25 45.5 23C44.3 24.4 42 25.6 39.6 26.4"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="34.5" cy="28" r="1.2" fill="#0F172A" />
          <path
            d="M30 21C30.4 19 32 18.4 33 18.8"
            stroke="#0284C7"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (slug.includes("typescript") || title.includes("typescript")) {
    return (
      <div
        className={`bg-[#3178C6] flex items-center justify-center text-white font-sans font-bold tracking-tight shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        TS
      </div>
    );
  }

  if (slug.includes("ai") || slug.includes("llm") || slug.includes("rag")) {
    return (
      <div
        className={`bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] font-sans font-bold tracking-tight shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        AI
      </div>
    );
  }

  if (slug.includes("python") || title.includes("python")) {
    return (
      <div
        className={`bg-[#FEF3C7] flex items-center justify-center text-[#D97706] font-sans font-bold tracking-tight shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        Py
      </div>
    );
  }

  if (slug.includes("postgres") || slug.includes("sql") || title.includes("postgresql")) {
    return (
      <div
        className={`bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5] font-sans font-bold tracking-tight shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
      >
        PG
      </div>
    );
  }

  return (
    <div
      className={`bg-neutral-900 flex items-center justify-center text-white font-serif font-bold shadow-sm select-none shrink-0 ${sizeClasses} ${className || ""}`}
    >
      {course.title ? course.title.charAt(0) : "C"}
    </div>
  );
}
