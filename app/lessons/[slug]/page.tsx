import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import {
  LESSON_BY_SLUG_QUERY,
  LESSON_SLUGS_QUERY,
  COURSE_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { LessonDetail, CourseDetail } from "@/sanity/lib/types";
import { Navbar } from "@/components/ui/navbar";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { LessonContent } from "@/components/lesson/lesson-content";
import { LessonNavigation } from "@/components/lesson/lesson-navigation";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(LESSON_SLUGS_QUERY);
    const staticParams = (slugs || []).map((slug) => ({ slug }));

    const aliases = [
      "nextjs-app-router-in-depth-caching-and-revalidation",
      "data-fetching-and-caching",
      "caching-and-revalidation",
      "fetching-in-server-components",
      "nextjs-app-router-in-depth-fetching-in-server-components",
      "nextjs-app-router-in-depth-server-components",
      "nextjs-app-router-in-depth-file-system-routing",
    ];

    aliases.forEach((alias) => {
      if (!slugs?.includes(alias)) {
        staticParams.push({ slug: alias });
      }
    });

    return staticParams;
  } catch (error) {
    console.error("Failed to generate static params for lessons:", error);
    return [
      { slug: "nextjs-app-router-in-depth-caching-and-revalidation" },
      { slug: "data-fetching-and-caching" },
      { slug: "caching-and-revalidation" },
    ];
  }
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await client.fetch<LessonDetail | null>(LESSON_BY_SLUG_QUERY, {
    lessonSlug: slug,
  });

  if (!lesson) {
    return {
      title: "Lesson Not Found — Vertex",
    };
  }

  const courseTitle = lesson.course?.title ? `${lesson.course.title} — ` : "";
  return {
    title: `${lesson.title} — ${courseTitle}Vertex`,
    description: `Watch ${lesson.title} on Vertex.`,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: LessonPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const startParam =
    resolvedSearchParams?.start ||
    resolvedSearchParams?.t ||
    resolvedSearchParams?.startSeconds;
  const startSeconds =
    typeof startParam === "string" ? parseFloat(startParam) || 0 : 0;

  const lesson = await client.fetch<LessonDetail | null>(LESSON_BY_SLUG_QUERY, {
    lessonSlug: slug,
  });

  if (!lesson) {
    notFound();
  }

  // Ensure course is populated if reverse reference missed it
  let course = lesson.course;
  if (!course) {
    // Fallback: fetch course
    const fallbackCourse = await client.fetch<CourseDetail | null>(
      COURSE_BY_SLUG_QUERY,
      { slug: "nextjs-app-router-in-depth" }
    );
    if (fallbackCourse) {
      course = fallbackCourse;
      lesson.course = fallbackCourse;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Header Navigation */}
      <Navbar activeHref="/courses" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* Left Column: Lesson Sidebar / Course Curriculum */}
          <LessonSidebar
            course={course}
            currentLessonSlug={lesson.slug?.current || slug}
            currentLessonId={lesson._id}
          />

          {/* Right Column: Lesson Main Content */}
          <div className="flex-1 min-w-0 w-full">
            <LessonContent lesson={lesson} startSeconds={startSeconds} />

            {/* Bottom Previous / Next Navigation */}
            <LessonNavigation
              course={course}
              currentLessonSlug={lesson.slug?.current || slug}
              currentLessonId={lesson._id}
            />
          </div>
        </div>
      </main>

      {/* Warm Atmospheric Equalizer Graphic at base */}
      <div className="w-full mt-auto relative overflow-hidden pointer-events-none flex items-end justify-center">
        <div className="w-full h-24 sm:h-32 flex items-end justify-center gap-2 sm:gap-3 px-4 max-w-[1440px]">
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
              className={`flex-1 max-w-[56px] rounded-t-[8px] bg-gradient-to-t from-[#FB923C]/40 via-[#FED7AA]/25 to-transparent transition-all duration-300 ${barStyle}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
