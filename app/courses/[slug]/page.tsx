import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { COURSE_BY_SLUG_QUERY, COURSE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { CourseDetail } from "@/sanity/lib/types";
import { Navbar } from "@/components/ui/navbar";
import { CourseHero } from "@/components/course/course-hero";
import { WhatYoullLearn } from "@/components/course/what-youll-learn";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { CourseProgressBar } from "@/components/course/course-progress-bar";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(COURSE_SLUGS_QUERY);
    const staticParams = (slugs || []).map((slug) => ({ slug }));

    const aliases = ["nextjs-for-production", "docker-essentials", "typescript-deep-dive"];
    aliases.forEach((alias) => {
      if (!slugs?.includes(alias)) {
        staticParams.push({ slug: alias });
      }
    });

    return staticParams;
  } catch (error) {
    console.error("Failed to generate static params for courses:", error);
    return [
      { slug: "nextjs-for-production" },
      { slug: "nextjs-app-router-in-depth" },
      { slug: "docker-essentials" },
      { slug: "typescript-deep-dive" },
    ];
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await client.fetch<CourseDetail | null>(COURSE_BY_SLUG_QUERY, {
    slug,
  });

  if (!course) {
    return {
      title: "Course Not Found — Vertex",
    };
  }

  return {
    title: `${course.title} — Vertex`,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await client.fetch<CourseDetail | null>(COURSE_BY_SLUG_QUERY, {
    slug,
  });

  if (!course) {
    notFound();
  }

  // Find first lesson for bottom continue CTA
  const firstLesson = course.modules?.[0]?.lessons?.[0];
  const continueHref = firstLesson?.slug?.current
    ? `/lessons/${firstLesson.slug.current}`
    : "#course-content";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Header Navigation */}
      <Navbar activeHref="/courses" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1140px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 sm:pt-12 pb-16">
        {/* Course Hero Section */}
        <CourseHero course={course} />

        {/* What You'll Learn Section */}
        <WhatYoullLearn outcomes={course.learningOutcomes} />

        {/* Course Content / Curriculum Section */}
        <CourseCurriculum
          modules={course.modules}
          totalDuration={course.totalDuration}
          moduleCount={course.moduleCount}
        />

        {/* Bottom Learner Progress Bar */}
        <CourseProgressBar
          progressPercentage={35}
          continueHref={continueHref}
        />
      </main>

      {/* Warm Atmosphere Bottom Graphic (Equalizer Bars) */}
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
