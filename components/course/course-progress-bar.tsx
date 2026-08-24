"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CourseProgressBarProps {
  progressPercentage?: number;
  continueHref?: string;
}

export function CourseProgressBar({
  progressPercentage = 35,
  continueHref = "#",
}: CourseProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div className="w-full mt-16 mb-12">
      <div className="bg-white border border-neutral-200/90 rounded-[16px] p-5 sm:px-8 sm:py-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Label & Status */}
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <span className="text-[12px] text-neutral-500 font-sans tracking-wider uppercase font-medium">
            Your Progress
          </span>
          <div className="text-[15px] font-sans mt-0.5">
            <span className="font-bold text-neutral-900">{clampedProgress}%</span>{" "}
            <span className="text-neutral-500">complete</span>
          </div>
        </div>

        {/* Middle: Progress Bar Track */}
        <div className="flex-1 w-full max-w-[420px] mx-auto sm:mx-4">
          <div className="w-full bg-neutral-200/80 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        {/* Right: Continue Learning Button */}
        <div className="shrink-0">
          <Link href={continueHref}>
            <Button
              variant="primary"
              size="md"
              className="h-[44px] px-6 text-[15px] rounded-[12px] font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
