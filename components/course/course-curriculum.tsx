"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Module } from "@/sanity/lib/types";
import { formatDuration } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

interface CourseCurriculumProps {
  modules?: Module[];
  totalDuration?: number;
  moduleCount?: number;
}

export function CourseCurriculum({
  modules = [],
  totalDuration,
  moduleCount,
}: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    0: false, // Default all collapsed matching design, or allow clicking
  });
  const [showAll, setShowAll] = useState(false);

  const displayCount = showAll ? modules.length : Math.min(6, modules.length);
  const visibleModules = modules.slice(0, displayCount);
  const hasMore = modules.length > 6;

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculatedModuleCount = moduleCount || modules.length;

  return (
    <section id="course-content" className="w-full mt-12 sm:mt-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-neutral-900">
          Course Content
        </h2>
        <div className="text-neutral-500 text-[14px] font-sans">
          <span>{calculatedModuleCount} modules</span>
          {totalDuration && totalDuration > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{formatDuration(totalDuration)}</span>
            </>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {visibleModules.map((mod, idx) => {
          const isExpanded = !!expandedModules[idx];
          const moduleDuration =
            mod.moduleDuration ||
            mod.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0) ||
            0;

          return (
            <div
              key={mod._key || idx}
              className="border border-neutral-200/90 rounded-[12px] bg-white hover:border-neutral-300 transition-colors overflow-hidden shadow-sm"
            >
              {/* Module Header Bar */}
              <button
                type="button"
                onClick={() => toggleModule(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer select-none focus:outline-none focus-visible:bg-neutral-50"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Number Badge */}
                  <div className="w-9 h-9 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-neutral-800 font-semibold flex items-center justify-center text-[14px] shrink-0">
                    {idx + 1}
                  </div>

                  {/* Title & Summary */}
                  <div className="min-w-0">
                    <h3 className="font-sans font-semibold text-[15px] sm:text-[16px] text-neutral-900">
                      {mod.title}
                    </h3>
                    {mod.summary && (
                      <p className="text-neutral-500 text-[13px] sm:text-[14px] mt-0.5 line-clamp-1">
                        {mod.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Duration & Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  {moduleDuration > 0 && (
                    <span className="text-neutral-600 text-[14px] font-medium hidden sm:inline">
                      {formatDuration(moduleDuration)}
                    </span>
                  )}
                  <div className="text-neutral-400">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 stroke-[2]" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Lesson Sub-List */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 divide-y divide-neutral-100/80">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const lessonHref = lesson.slug?.current
                      ? `/lessons/${lesson.slug.current}`
                      : "#";

                    return (
                      <Link
                        key={lesson._id || lessonIdx}
                        href={lessonHref}
                        className="flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-neutral-100/70 transition-colors group text-[14px]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Play className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors shrink-0" />
                          <span className="font-medium text-neutral-800 group-hover:text-neutral-900 truncate">
                            {idx + 1}.{lessonIdx + 1} {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          {lesson.isFreePreview && (
                            <Badge
                              variant="video"
                              size="sm"
                              className="bg-[#FFEEE5] text-[#EA580C] font-semibold text-[10px] uppercase px-2 py-0.5 rounded-[4px]"
                            >
                              Free Preview
                            </Badge>
                          )}
                          {lesson.duration && lesson.duration > 0 && (
                            <span className="text-neutral-500 text-[13px]">
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show All Modules Button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700 font-medium text-[14px] shadow-sm transition-all duration-150 cursor-pointer"
          >
            <span>
              {showAll
                ? "Show fewer modules"
                : `Show all ${modules.length} modules`}
            </span>
            {showAll ? (
              <ChevronUp className="w-4 h-4 text-neutral-500 stroke-[2]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-500 stroke-[2]" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
