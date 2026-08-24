"use client";

import React, { useState } from "react";
import { PortableText, PortableTextComponents } from "next-sanity";
import {
  Clock,
  BarChart3,
  Users,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  FileText,
  Link2,
  FileCode,
} from "lucide-react";
import { LessonDetail } from "@/sanity/lib/types";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { VideoEmbed } from "@/components/lesson/video-embed";
import {
  formatDuration,
  formatLevel,
  formatStudentCount,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  lesson: LessonDetail;
  startSeconds?: number;
}

// Custom Portable Text styling
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-neutral-700 text-[15px] leading-[26px] mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-[20px] font-bold text-neutral-900 mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans font-bold text-[17px] text-neutral-900 mt-5 mb-2">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 text-[15px] mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1.5 text-neutral-700 text-[15px] mb-4">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noindex nofollow" : undefined}
          className="text-primary-500 hover:text-[#EA580C] underline font-medium"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-neutral-100 text-[#EA580C] px-1.5 py-0.5 rounded font-mono text-[13px]">
        {children}
      </code>
    ),
  },
};

export function LessonContent({ lesson, startSeconds = 0 }: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [personalNotes, setPersonalNotes] = useState("");

  const course = lesson.course;

  // Calculate module index and lesson index within the module
  let currentModuleTitle = "Course Module";
  let moduleNumber = 1;
  let lessonNumber = 1;

  if (course?.modules) {
    course.modules.forEach((mod, mIdx) => {
      const lIdx = mod.lessons?.findIndex(
        (l) => l.slug?.current === lesson.slug?.current || l._id === lesson._id
      );
      if (lIdx !== undefined && lIdx >= 0) {
        currentModuleTitle = mod.title;
        moduleNumber = mIdx + 1;
        lessonNumber = lIdx + 1;
      }
    });
  }

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "All Courses", href: "/courses" },
    ...(course
      ? [
          {
            label: course.title,
            href: `/courses/${course.slug?.current || ""}`,
          },
        ]
      : []),
    { label: currentModuleTitle },
    { label: lesson.title },
  ];

  // Default key points if none authored
  const keyPoints =
    lesson.keyPoints && lesson.keyPoints.length > 0
      ? lesson.keyPoints
      : [
          "Understand the different data fetching methods in Next.js",
          "Learn how caching works in Server Components",
          "Implement revalidation and cache control",
          "Optimize performance with advanced caching strategies",
        ];

  // Default resources if none authored
  const resources =
    lesson.resources && lesson.resources.length > 0
      ? lesson.resources
      : [
          {
            _key: "res-1",
            type: "docs" as const,
            title: "Next.js Data Fetching Documentation",
            description: "Official Next.js docs on data fetching methods.",
            url: "https://nextjs.org/docs",
          },
          {
            _key: "res-2",
            type: "pdf" as const,
            title: "Caching and Revalidation Guide",
            description: "Deep dive into Next.js caching strategies.",
            url: "https://nextjs.org/docs/app/building-your-application/caching",
          },
          {
            _key: "res-3",
            type: "repo" as const,
            title: "Example Repository",
            description: "Explore the source code for this lesson.",
            url: "https://github.com/vercel/next.js",
          },
        ];

  const getResourceIcon = (type?: string) => {
    switch (type) {
      case "repo":
        return (
          <svg className="w-5 h-5 text-neutral-800 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        );
      case "docs":
      case "pdf":
        return <FileText className="w-5 h-5 text-[#D97706]" />;
      case "asset":
        return <FileCode className="w-5 h-5 text-blue-600" />;
      default:
        return <Link2 className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getResourceIconBg = (type?: string) => {
    switch (type) {
      case "repo":
        return "bg-neutral-100";
      case "docs":
      case "pdf":
        return "bg-[#FEF3C7]/70";
      case "asset":
        return "bg-blue-50";
      default:
        return "bg-neutral-100";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 2. Header & Action Row */}
      <div className="space-y-3">
        {/* Lesson Badge */}
        <div>
          <Badge
            variant="popular"
            size="md"
            className="bg-[#FFEEE5] text-[#EA580C] font-bold text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-[5px]"
          >
            LESSON {moduleNumber}.{lessonNumber}
          </Badge>
        </div>

        {/* Title & Bookmark Button */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-serif text-[32px] sm:text-[38px] lg:text-[42px] font-bold text-neutral-900 leading-[1.15] tracking-tight">
            {lesson.title}
          </h1>

          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
            className={cn(
              "w-10 h-10 rounded-[10px] border flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-sm",
              isBookmarked
                ? "bg-primary-50/50 border-primary-300 text-primary-600"
                : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
            )}
          >
            <Bookmark
              className={cn(
                "w-5 h-5 stroke-[2] transition-colors",
                isBookmarked ? "fill-primary-500 text-primary-500" : ""
              )}
            />
          </button>
        </div>

        {/* Short Summary */}
        <p className="text-neutral-600 text-[15px] sm:text-[16px] leading-[26px]">
          Learn how Next.js handles data fetching and caching in both Server and
          Client Components.
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-neutral-600 text-[14px] font-sans pt-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>{formatDuration(lesson.duration || 5280)}</span>
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>{formatLevel(course?.level || "Intermediate")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400 stroke-[2]" />
            <span>
              {formatStudentCount(lesson.studentCount || 3426)} students
            </span>
          </div>
        </div>
      </div>

      {/* 3. Video Player Container */}
      <VideoEmbed
        videoUrl={lesson.videoUrl}
        thumbnail={lesson.thumbnail}
        title={lesson.title}
        startSeconds={startSeconds}
      />

      {/* 4. Tabs Header */}
      <div className="border-b border-neutral-200/80 pt-4">
        <div className="flex items-center gap-8 text-[15px] font-sans">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={cn(
              "pb-3 font-semibold transition-colors cursor-pointer relative",
              activeTab === "content"
                ? "text-[#EA580C]"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <span>Lesson Content</span>
            {activeTab === "content" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EA580C] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={cn(
              "pb-3 font-semibold transition-colors cursor-pointer relative",
              activeTab === "notes"
                ? "text-[#EA580C]"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <span>Notes</span>
            {activeTab === "notes" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EA580C] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 5. Tab Body */}
      {activeTab === "content" ? (
        <div className="space-y-8 pt-2">
          {/* Overview Section */}
          <div>
            <h2 className="font-serif text-[22px] font-bold text-neutral-900 mb-3">
              Overview
            </h2>

            {lesson.notes && lesson.notes.length > 0 ? (
              <PortableText
                value={lesson.notes}
                components={portableTextComponents}
              />
            ) : (
              <p className="text-neutral-700 text-[15px] leading-[26px]">
                In this lesson, you&apos;ll learn how Next.js handles data fetching
                and caching in both Server and Client Components. We&apos;ll explore
                different caching strategies and revalidation techniques to build
                fast and scalable applications.
              </p>
            )}
          </div>

          {/* In this lesson you will Section */}
          <div>
            <h3 className="font-sans font-bold text-[16px] text-neutral-900 mb-4">
              In this lesson you will:
            </h3>
            <ul className="space-y-3">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5 stroke-[2]" />
                  <span className="text-neutral-700 text-[15px] leading-[24px]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tip Callout Box */}
          <div className="rounded-[16px] border border-[#FED7AA] bg-[#FFF9F5] p-5 sm:p-6 flex items-start gap-4 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0 text-[#EA580C]">
              <Lightbulb className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-neutral-900 text-[15px] leading-tight">
                Pro Tip
              </h4>
              <p className="text-neutral-700 text-[14px] leading-[22px] mt-1.5">
                {lesson.proTip ||
                  "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests."}
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h2 className="font-serif text-[22px] font-bold text-neutral-900 mb-4">
              Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((res, idx) => {
                const icon = getResourceIcon(res.type);
                const iconBg = getResourceIconBg(res.type);

                return (
                  <a
                    key={res._key || idx}
                    href={res.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-neutral-200/90 rounded-[14px] p-5 bg-white hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-9 h-9 rounded-[8px] ${iconBg} flex items-center justify-center shrink-0`}
                        >
                          {icon}
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#EA580C] transition-colors shrink-0" />
                      </div>

                      <div>
                        <h3 className="font-sans font-semibold text-neutral-900 text-[14px] leading-[20px] group-hover:text-primary-600 transition-colors line-clamp-1">
                          {res.title}
                        </h3>
                        {res.description && (
                          <p className="text-neutral-500 text-[13px] leading-[18px] mt-1 line-clamp-2">
                            {res.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Presentational Notes Tab */
        <div className="pt-2 space-y-4">
          <h2 className="font-serif text-[22px] font-bold text-neutral-900 mb-2">
            Personal Notes
          </h2>
          <p className="text-neutral-500 text-[14px]">
            Capture private thoughts and key takeaways for this lesson. Notes are saved to your browser session.
          </p>
          <textarea
            rows={8}
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            placeholder="Type your notes here..."
            className="w-full p-4 rounded-[12px] border border-neutral-200 bg-white text-neutral-800 text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert("Note saved.")}
              className="px-4 py-2 bg-primary-500 hover:bg-[#EA580C] text-white text-[14px] font-medium rounded-[8px] transition-colors cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
