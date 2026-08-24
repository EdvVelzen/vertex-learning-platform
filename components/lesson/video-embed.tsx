"use client";

import React from "react";
import Image from "next/image";
import { SanityImageReference } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";

interface VideoEmbedProps {
  videoUrl?: string | null;
  thumbnail?: SanityImageReference | null;
  title?: string;
  startSeconds?: number;
  className?: string;
}

/**
 * Helper to parse provider video URLs and convert to embed format with start timestamp
 */
function getEmbedUrl(url: string, startSeconds?: number): string | null {
  if (!url) return null;

  try {
    // 1. YouTube
    const ytWatchMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    );
    if (ytWatchMatch && ytWatchMatch[1]) {
      const videoId = ytWatchMatch[1];
      const startParam = startSeconds && startSeconds > 0 ? `&start=${Math.floor(startSeconds)}` : "";
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${startParam}`;
    }

    // 2. Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const timeHash = startSeconds && startSeconds > 0 ? `#t=${Math.floor(startSeconds)}s` : "";
      return `https://player.vimeo.com/video/${videoId}?dnt=1&app_id=122963${timeHash}`;
    }

    // 3. Bunny Stream
    const bunnyMatch = url.match(
      /(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/
    );
    if (bunnyMatch && bunnyMatch[1] && bunnyMatch[2]) {
      const libraryId = bunnyMatch[1];
      const videoId = bunnyMatch[2];
      const startParam = startSeconds && startSeconds > 0 ? `&start=${Math.floor(startSeconds)}` : "";
      return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false${startParam}`;
    }

    // If it's already an embed iframe URL
    if (url.includes("/embed/")) {
      const separator = url.includes("?") ? "&" : "?";
      const startParam = startSeconds && startSeconds > 0 ? `${separator}start=${Math.floor(startSeconds)}` : "";
      return `${url}${startParam}`;
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
  }

  return null;
}

export function VideoEmbed({
  videoUrl,
  thumbnail,
  title = "Lesson Video",
  startSeconds = 0,
  className = "",
}: VideoEmbedProps) {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl, startSeconds) : null;

  return (
    <div
      className={`relative w-full aspect-video rounded-[16px] overflow-hidden bg-black shadow-md border border-neutral-900 ${className}`}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : thumbnail?.asset ? (
        <div className="relative w-full h-full">
          <Image
            src={urlFor(thumbnail).width(1280).height(720).url()}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback stylization matching design */
        <div className="w-full h-full bg-black flex items-center justify-center p-8 relative select-none">
          <svg
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-32 sm:w-40 sm:h-40"
          >
            <mask
              id="maskLessonVideo"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="180"
              height="180"
              style={{ maskType: "alpha" }}
            >
              <circle cx="90" cy="90" r="90" fill="black" />
            </mask>
            <g mask="url(#maskLessonVideo)">
              <path
                d="M149.508 157.438L69.6055 54.125H53.5V125.875H66.1953V70.2188L139.734 165.176C143.156 162.809 146.426 160.223 149.508 157.438Z"
                fill="url(#paint0_linear_vid)"
              />
              <rect
                x="113.805"
                y="54.125"
                width="12.6953"
                height="71.75"
                fill="url(#paint1_linear_vid)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_vid"
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
                id="paint1_linear_vid"
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
      )}
    </div>
  );
}
