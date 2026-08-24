"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LessonSummary, CourseDetail, LessonDetail } from "@/sanity/lib/types";
import { formatDuration } from "@/lib/formatters";

interface LessonNavigationProps {
  course?: LessonDetail["course"] | CourseDetail | null;
  currentLessonSlug: string;
  currentLessonId?: string;
}

export function LessonNavigation({
  course,
  currentLessonSlug,
  currentLessonId,
}: LessonNavigationProps) {
  // Flatten all lessons across modules in sequential order
  const allLessons: LessonSummary[] = [];
  course?.modules?.forEach((m) => {
    if (m.lessons) {
      allLessons.push(...m.lessons);
    }
  });

  const currentIndex = allLessons.findIndex(
    (l) => l.slug?.current === currentLessonSlug || l._id === currentLessonId
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const courseHref = course?.slug?.current
    ? `/courses/${course.slug.current}`
    : "/courses";

  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-12 pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6"
    >
      {/* 1. Previous Lesson */}
      {prevLesson ? (
        <div className="flex items-center gap-4">
          <Link
            href={`/lessons/${prevLesson.slug?.current || ""}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-800 font-medium text-[14px] shadow-sm transition-all duration-150 cursor-pointer shrink-0 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 stroke-[2]" />
            <span>Previous Lesson</span>
          </Link>

          <div className="hidden md:block min-w-0">
            <p className="text-[13px] font-medium text-neutral-700 truncate leading-tight">
              {prevLesson.title}
            </p>
            {prevLesson.duration && prevLesson.duration > 0 && (
              <p className="text-[12px] text-neutral-400 font-sans mt-0.5">
                {formatDuration(prevLesson.duration)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-600 font-medium text-[14px] shadow-sm transition-all duration-150 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 stroke-[2]" />
          <span>Course Overview</span>
        </Link>
      )}

      {/* 2. Next Lesson */}
      {nextLesson ? (
        <div className="flex items-center justify-end gap-4 ml-auto">
          <div className="hidden md:block text-right min-w-0">
            <p className="text-[13px] font-medium text-neutral-700 truncate leading-tight">
              {nextLesson.title}
            </p>
            {nextLesson.duration && nextLesson.duration > 0 && (
              <p className="text-[12px] text-neutral-400 font-sans mt-0.5">
                {formatDuration(nextLesson.duration)}
              </p>
            )}
          </div>

          <Link
            href={`/lessons/${nextLesson.slug?.current || ""}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium text-[14px] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer shrink-0 group"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2]" />
          </Link>
        </div>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium text-[14px] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer ml-auto group"
        >
          <span>Complete Course</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2]" />
        </Link>
      )}
    </nav>
  );
}
