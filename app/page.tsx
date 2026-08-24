import React from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { FEATURED_COURSES_QUERY } from "@/sanity/lib/queries";
import { CourseSummary } from "@/sanity/lib/types";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/cards/course-card";
import { CourseIcon } from "@/components/course/course-icon";
import { HeroSearch } from "@/components/home/hero-search";
import { ArrowRight, Star } from "lucide-react";
import { formatDuration, formatLevel } from "@/lib/formatters";

export default async function HomePage() {
  const fetchedCourses = await client.fetch<CourseSummary[]>(FEATURED_COURSES_QUERY);
  // Display top 3 courses for the home showcase
  const courses = (fetchedCourses || []).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-12">
          {/* Hero Section */}
          <section className="text-center flex flex-col items-center max-w-3xl mx-auto space-y-5">
            {/* Intelligent Learning Pill */}
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5] border border-primary-200/80 text-[#EA580C] text-[11px] font-bold tracking-widest uppercase font-sans">
                INTELLIGENT LEARNING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[44px] sm:text-[56px] md:text-[64px] leading-[1.08] font-bold text-neutral-900 tracking-tight">
              Search your learning
              <br />
              in plain English.
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-500 text-[15px] sm:text-[17px] leading-[26px] max-w-[540px] pt-1">
              Vertex understands what you want to learn and
              <br className="hidden sm:inline" /> finds the exact lessons across
              all your courses.
            </p>

            {/* Primary CTA Button */}
            <div className="pt-3">
              <Link href="/courses">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-[46px] px-6 text-[15px] rounded-[12px] font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
                </Button>
              </Link>
            </div>

            {/* Interactive Search Input Bar */}
            <HeroSearch />
          </section>

          {/* All Courses Section */}
          <section className="mt-20 pt-8 border-t border-neutral-200/80">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-neutral-900">
                All Courses
              </h2>
              <Link
                href="/courses"
                className="text-primary-500 hover:text-[#EA580C] text-[14px] font-medium flex items-center gap-1.5 transition-colors group"
              >
                <span>View all courses</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2]" />
              </Link>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const courseHref = `/courses/${course.slug.current}`;
                const displayLevel = formatLevel(course.level);
                const displayDuration = formatDuration(course.totalDuration);
                const displayModules = `${course.moduleCount || 0} modules`;

                return (
                  <Link key={course._id} href={courseHref} className="block">
                    <CourseCard
                      orientation="vertical"
                      title={course.title}
                      summary={course.summary}
                      level={displayLevel}
                      duration={displayDuration}
                      moduleCount={displayModules}
                      icon={<CourseIcon course={course} />}
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Weekly Updates Divider Notice */}
          <div className="mt-20 mb-12 flex items-center justify-center max-w-2xl mx-auto px-4">
            <div className="flex-1 h-px bg-neutral-200/90" />
            <div className="flex items-center gap-2.5 px-4 text-neutral-600 text-[14px] font-sans shrink-0">
              <Star className="w-4 h-4 text-primary-500 stroke-[1.8] fill-transparent" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="flex-1 h-px bg-neutral-200/90" />
          </div>
        </div>

        {/* Warm Atmosphere Bottom Graphic (Equalizer Bars) */}
        <div className="w-full mt-auto relative overflow-hidden pointer-events-none flex items-end justify-center">
          <div className="w-full h-36 sm:h-44 md:h-52 flex items-end justify-center gap-2 sm:gap-3 px-4 max-w-[1440px]">
            {[
              "h-12 opacity-30",
              "h-20 opacity-40",
              "h-32 opacity-60",
              "h-24 opacity-50",
              "h-16 opacity-35",
              "h-28 opacity-55",
              "h-40 opacity-75",
              "h-48 opacity-90",
              "h-36 opacity-70",
              "h-20 opacity-45",
              "h-14 opacity-30",
              "h-24 opacity-50",
              "h-44 opacity-85",
              "h-52 opacity-100",
              "h-36 opacity-70",
              "h-20 opacity-40",
              "h-28 opacity-55",
              "h-44 opacity-80",
              "h-32 opacity-60",
              "h-16 opacity-35",
            ].map((barStyle, idx) => (
              <div
                key={idx}
                className={`flex-1 max-w-[56px] rounded-t-[8px] bg-gradient-to-t from-[#FB923C]/50 via-[#FED7AA]/30 to-transparent transition-all duration-300 ${barStyle}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}