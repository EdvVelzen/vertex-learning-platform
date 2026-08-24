"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, Play } from "lucide-react";
import { CourseDetail, LessonDetail, Module } from "@/sanity/lib/types";
import { formatDuration } from "@/lib/formatters";
import { CourseIcon } from "@/components/course/course-icon";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  course?: LessonDetail["course"] | CourseDetail | null;
  currentLessonSlug: string;
  currentLessonId?: string;
  className?: string;
}

export function LessonSidebar({
  course,
  currentLessonSlug,
  currentLessonId,
  className,
}: LessonSidebarProps) {
  const modules: Module[] = course?.modules || [];

  // Find which module contains the current lesson
  let foundModuleIndex = -1;
  modules.forEach((mod, modIdx) => {
    if (
      mod.lessons?.some(
        (l) => l.slug?.current === currentLessonSlug || l._id === currentLessonId
      )
    ) {
      foundModuleIndex = modIdx;
    }
  });

  const activeModuleIndex = foundModuleIndex >= 0 ? foundModuleIndex : 0;

  // Initialize expanded state for modules (default to expanding current active module)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    [activeModuleIndex]: true,
  });

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const courseHref = course?.slug?.current
    ? `/courses/${course.slug.current}`
    : "/courses";

  return (
    <aside
      className={cn(
        "w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-6 lg:border-r lg:border-neutral-200/80 lg:pr-6",
        className
      )}
    >
      {/* 1. Back to Course */}
      <Link
        href={courseHref}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-600 hover:text-primary-500 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 stroke-[2]" />
        <span>Back to course</span>
      </Link>

      {/* 2. Course Summary Header Card */}
      {course && (
        <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-200/70">
          <CourseIcon course={course} size="sm" className="w-11 h-11 rounded-[10px]" />
          <div className="min-w-0 flex-1">
            <h2 className="font-sans font-semibold text-[15px] text-neutral-900 leading-tight truncate">
              {course.title}
            </h2>
            <div className="mt-1 flex items-center justify-between text-[12px] text-neutral-500 font-sans">
              <span>35% complete</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1 mt-1 overflow-hidden">
              <div className="bg-primary-500 h-full rounded-full w-[35%]" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Module Selector Header */}
      <div className="flex items-center justify-between py-1 text-neutral-800 text-[14px] font-semibold font-sans">
        <span>
          Module {activeModuleIndex + 1} of {modules.length || 1}
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-400 stroke-[2]" />
      </div>

      {/* 4. Module Accordion List */}
      <div className="space-y-1">
        {modules.map((mod, modIdx) => {
          const isCurrentModule = modIdx === activeModuleIndex;
          const isExpanded = !!expandedModules[modIdx];
          const isCompleted = modIdx < activeModuleIndex; // Previous modules marked completed per design
          const moduleDuration =
            mod.moduleDuration ||
            mod.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0) ||
            0;

          return (
            <div key={mod._key || modIdx} className="rounded-[10px] overflow-hidden">
              {/* Module Header Item */}
              <button
                type="button"
                onClick={() => toggleModule(modIdx)}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 rounded-[10px] text-left transition-colors cursor-pointer select-none",
                  isCurrentModule
                    ? "bg-[#FFF7ED]/70 hover:bg-[#FFF7ED]"
                    : "hover:bg-neutral-100/70"
                )}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Module Number Badge */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[12px] shrink-0 font-medium",
                      isCurrentModule
                        ? "bg-[#EA580C] text-white font-semibold shadow-sm"
                        : "bg-white border border-neutral-200/90 text-neutral-700"
                    )}
                  >
                    {modIdx + 1}
                  </div>

                  {/* Module Title & Duration */}
                  <div className="min-w-0">
                    <h3
                      className={cn(
                        "text-[13px] font-sans truncate leading-tight",
                        isCurrentModule
                          ? "font-semibold text-neutral-900"
                          : "font-medium text-neutral-800"
                      )}
                    >
                      {mod.title}
                    </h3>
                    {moduleDuration > 0 && (
                      <p className="text-[12px] text-neutral-400 font-sans mt-0.5">
                        {formatDuration(moduleDuration)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Completed checkmark or Expand chevron */}
                <div className="shrink-0 ml-2">
                  {isCompleted && !isExpanded ? (
                    <CheckCircle2 className="w-5 h-5 text-[#EA580C] fill-[#FFEEE5]" />
                  ) : isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 stroke-[2]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 stroke-[2]" />
                  )}
                </div>
              </button>

              {/* Sub-Lessons Tree List */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <div className="ml-6 pl-4 border-l border-neutral-200 py-2 space-y-3">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isLessonActive =
                      lesson.slug?.current === currentLessonSlug ||
                      lesson._id === currentLessonId;
                    const lessonHref = lesson.slug?.current
                      ? `/lessons/${lesson.slug.current}`
                      : "#";

                    return (
                      <div key={lesson._id || lessonIdx} className="relative flex items-center justify-between">
                        {/* Tree node dot */}
                        {isLessonActive ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] -ml-[21.5px] mr-3 shrink-0 ring-4 ring-[#FFF7ED]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-neutral-300 bg-white -ml-[20px] mr-3 shrink-0" />
                        )}

                        <div className="min-w-0 flex-1">
                          {isLessonActive ? (
                            <div>
                              <p className="text-[13px] font-semibold text-neutral-900 leading-tight">
                                {lesson.title}
                              </p>
                              <p className="text-[12px] text-[#EA580C] font-medium mt-0.5">
                                Now playing
                              </p>
                            </div>
                          ) : (
                            <Link
                              href={lessonHref}
                              className="group block text-[13px] text-neutral-600 hover:text-neutral-900 font-medium leading-tight transition-colors truncate"
                            >
                              <span className="truncate">{lesson.title}</span>
                              {lesson.duration && lesson.duration > 0 && (
                                <p className="text-[12px] text-neutral-400 group-hover:text-neutral-500 font-normal mt-0.5">
                                  {formatDuration(lesson.duration)}
                                </p>
                              )}
                            </Link>
                          )}
                        </div>

                        {/* Active Play Icon on Right */}
                        {isLessonActive && (
                          <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 ml-2 shadow-sm">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
