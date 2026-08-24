import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { COURSES_QUERY } from "@/sanity/lib/queries";
import { CourseSummary } from "@/sanity/lib/types";
import { Navbar } from "@/components/ui/navbar";
import { CourseCard } from "@/components/cards/course-card";
import { CourseIcon } from "@/components/course/course-icon";
import { formatDuration, formatLevel } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "All Courses — Vertex",
  description: "Browse all courses available on Vertex.",
};

export default async function CoursesCatalogPage() {
  const courses = await client.fetch<CourseSummary[]>(COURSES_QUERY);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Header Navigation */}
      <Navbar activeHref="/courses" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-20">
        <div className="mb-10">
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-neutral-900">
            All Courses
          </h1>
          <p className="text-neutral-500 text-[15px] sm:text-[16px] mt-2 max-w-xl">
            Explore our comprehensive curriculum of hands-on courses taught by industry experts.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(courses || []).map((course) => {
            const courseHref = `/courses/${course.slug.current}`;

            return (
              <Link key={course._id} href={courseHref} className="block">
                <CourseCard
                  orientation="vertical"
                  title={course.title}
                  summary={course.summary}
                  level={formatLevel(course.level)}
                  duration={formatDuration(course.totalDuration)}
                  moduleCount={`${course.moduleCount || 0} modules`}
                  icon={<CourseIcon course={course} />}
                />
              </Link>
            );
          })}
        </div>
      </main>

      {/* Warm Atmosphere Bottom Graphic */}
      <div className="w-full mt-auto relative overflow-hidden pointer-events-none flex items-end justify-center">
        <div className="w-full h-28 sm:h-36 flex items-end justify-center gap-2 sm:gap-3 px-4 max-w-[1440px]">
          {[
            "h-10 opacity-30",
            "h-16 opacity-40",
            "h-24 opacity-60",
            "h-20 opacity-50",
            "h-12 opacity-35",
            "h-22 opacity-55",
            "h-32 opacity-75",
            "h-40 opacity-90",
            "h-28 opacity-70",
            "h-16 opacity-45",
            "h-12 opacity-30",
            "h-20 opacity-50",
            "h-36 opacity-85",
            "h-44 opacity-100",
            "h-28 opacity-70",
            "h-16 opacity-40",
            "h-24 opacity-55",
            "h-36 opacity-80",
            "h-24 opacity-60",
            "h-12 opacity-35",
          ].map((barStyle, idx) => (
            <div
              key={idx}
              className={`flex-1 max-w-[56px] rounded-t-[8px] bg-gradient-to-t from-[#FB923C]/50 via-[#FED7AA]/30 to-transparent transition-all duration-300 ${barStyle}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
