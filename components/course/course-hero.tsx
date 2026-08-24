"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CourseDetail } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDuration,
  formatStudentCount,
  formatLevel,
} from "@/lib/formatters";
import {
  Clock,
  FileText,
  Users,
  BarChart3,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseHeroProps {
  course: CourseDetail;
}

export function CourseHero({ course }: CourseHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Find first lesson for "Continue Learning"
  const firstLesson = course.modules?.[0]?.lessons?.[0];
  const firstLessonSlug = firstLesson?.slug?.current;
  const continueHref = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : "#course-content";

  const isNextJsCourse =
    course.slug?.current?.includes("nextjs") ||
    course.title.toLowerCase().includes("next.js");

  return (
    <section className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: "All Courses", href: "/courses" },
            { label: course.title },
          ]}
        />
      </div>

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
        {/* Left Column: Course Cover / Brand Icon */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-[20px] bg-black flex items-center justify-center relative overflow-hidden shadow-md shrink-0 select-none">
          {course.coverImage?.asset ? (
            <Image
              src={urlFor(course.coverImage).width(640).height(640).url()}
              alt={course.title}
              width={320}
              height={320}
              className="w-full h-full object-cover rounded-[20px]"
              priority
            />
          ) : isNextJsCourse ? (
            <div className="w-full h-full bg-black flex items-center justify-center p-8">
              <svg
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <mask
                  id="mask0"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="180"
                  height="180"
                  style={{ maskType: "alpha" }}
                >
                  <circle cx="90" cy="90" r="90" fill="black" />
                </mask>
                <g mask="url(#mask0)">
                  <path
                    d="M149.508 157.438L69.6055 54.125H53.5V125.875H66.1953V70.2188L139.734 165.176C143.156 162.809 146.426 160.223 149.508 157.438Z"
                    fill="url(#paint0_linear)"
                  />
                  <rect
                    x="113.805"
                    y="54.125"
                    width="12.6953"
                    height="71.75"
                    fill="url(#paint1_linear)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="109"
                    y1="116.5"
                    x2="144.5"
                    y2="160.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="120.152"
                    y1="54.125"
                    x2="120.152"
                    y2="104.375"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center p-8 text-white font-serif font-bold text-5xl">
              {course.title.charAt(0)}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="flex-1 flex flex-col items-start pt-1">
          {/* Popular Badge */}
          {course.isPopular && (
            <div className="mb-4">
              <Badge
                variant="popular"
                size="md"
                className="bg-[#FFEEE5] text-[#EA580C] font-bold text-[11px] tracking-widest uppercase px-3 py-1 rounded-[6px]"
              >
                POPULAR
              </Badge>
            </div>
          )}

          {/* Course Title */}
          <h1 className="font-serif text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-neutral-900 leading-[1.12] tracking-tight mb-4">
            {course.title}
          </h1>

          {/* Course Summary */}
          <p className="text-neutral-600 text-[15px] sm:text-[16px] leading-[26px] mb-6 max-w-2xl">
            {course.summary}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 text-neutral-600 text-[14px] font-sans mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neutral-400 stroke-[2]" />
              <span>{formatLevel(course.level)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400 stroke-[2]" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400 stroke-[2]" />
              <span>{course.moduleCount || course.modules?.length || 0} modules</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-400 stroke-[2]" />
              <span>{formatStudentCount(course.studentCount)} students</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href={continueHref}>
              <Button
                variant="primary"
                size="lg"
                className="h-[46px] px-6 text-[15px] rounded-[12px] font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={cn(
                "h-[46px] px-5 rounded-[12px] border text-[15px] font-medium flex items-center gap-2 transition-all duration-150 shadow-sm cursor-pointer",
                isBookmarked
                  ? "bg-primary-50/50 border-primary-300 text-primary-600"
                  : "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50/80"
              )}
            >
              <Bookmark
                className={cn(
                  "w-4 h-4 transition-colors stroke-[2]",
                  isBookmarked
                    ? "fill-primary-500 text-primary-500"
                    : "text-neutral-600"
                )}
              />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
