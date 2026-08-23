"use client";

import React from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { CourseCard } from "@/components/cards/course-card";
import { LessonVideoCard } from "@/components/cards/lesson-video-card";
import { LessonCard } from "@/components/cards/lesson-card";
import { ResourceCard } from "@/components/cards/resource-card";
import {
  Bell,
  Search,
  PlayCircle,
  FileText,
  Bookmark,
  BarChart2,
  Clock,
  User,
  ChevronRight,
  ExternalLink,
  Eye,
  LayoutGrid,
  Target,
  Accessibility,
} from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 py-12 px-6 sm:px-12 lg:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* Top Header & Section 01: Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-neutral-200/80 pb-12">
          {/* Brand Header */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" />
            <h1 className="text-display-1 font-serif text-neutral-900">
              Design System
            </h1>
            <p className="text-neutral-500 text-[15px] leading-[24px] max-w-sm font-sans">
              A unified design language for Vertex learning platform. Clean,
              modern and focused on clarity, consistency and intuitive learning
              experiences.
            </p>
            <div className="pt-4 text-[12px] font-semibold tracking-wider text-neutral-400 uppercase font-sans">
              VERSION 1.0 • MAY 2025
            </div>
          </div>

          {/* 01 COLORS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                01
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                COLORS
              </h2>
            </div>

            {/* Primary Colors */}
            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-700">
                Primary
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1.5">
                  <div className="h-16 rounded-[8px] bg-primary-500 shadow-xs" />
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Primary 500
                  </div>
                  <div className="text-[11px] text-neutral-500">#F97316</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-16 rounded-[8px] bg-primary-400 shadow-xs" />
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Primary 400
                  </div>
                  <div className="text-[11px] text-neutral-500">#FB923C</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-16 rounded-[8px] bg-primary-300 shadow-xs" />
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Primary 300
                  </div>
                  <div className="text-[11px] text-neutral-500">#FDBA74</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-16 rounded-[8px] bg-primary-200 shadow-xs" />
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Primary 200
                  </div>
                  <div className="text-[11px] text-neutral-500">#FED7AA</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-16 rounded-[8px] bg-primary-100 border border-primary-200/50 shadow-xs" />
                  <div className="text-[12px] font-semibold text-neutral-900">
                    Primary 100
                  </div>
                  <div className="text-[11px] text-neutral-500">#FFEEE5</div>
                </div>
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-2 pt-2">
              <div className="text-[13px] font-medium text-neutral-700">
                Neutral
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-900 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 900
                  </div>
                  <div className="text-[10px] text-neutral-500">#0F172A</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-700 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 700
                  </div>
                  <div className="text-[10px] text-neutral-500">#334155</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-500 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 500
                  </div>
                  <div className="text-[10px] text-neutral-500">#64748B</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-300 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 300
                  </div>
                  <div className="text-[10px] text-neutral-500">#CBD5E1</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-200 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 200
                  </div>
                  <div className="text-[10px] text-neutral-500">#E2E8F0</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-100 border border-neutral-200 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 100
                  </div>
                  <div className="text-[10px] text-neutral-500">#F1F5F9</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-neutral-50 border border-neutral-200 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    Neutral 50
                  </div>
                  <div className="text-[10px] text-neutral-500">#FAFAFC</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-14 rounded-[8px] bg-white border border-neutral-200 shadow-xs" />
                  <div className="text-[11px] font-semibold text-neutral-900">
                    White
                  </div>
                  <div className="text-[10px] text-neutral-500">#FFFFFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 02: Typography & Section 03: Type Scale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-neutral-200/80 pb-12">
          {/* 02 TYPOGRAPHY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                02
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                TYPOGRAPHY
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-baseline gap-6">
                <span className="font-serif text-5xl font-bold text-neutral-900">
                  Ag
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900">
                    Playfair Display
                  </h3>
                  <p className="text-[13px] text-neutral-500 mt-0.5">
                    Elegant • Readable • Timeless
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-6">
                <span className="font-sans text-5xl font-bold text-neutral-900">
                  Ag
                </span>
                <div>
                  <h3 className="font-sans text-xl font-bold text-neutral-900">
                    Inter
                  </h3>
                  <p className="text-[13px] text-neutral-500 mt-0.5">
                    Clean • Modern • Highly legible
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 03 TYPE SCALE */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                03
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                TYPE SCALE
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] font-sans">
                <thead>
                  <tr className="border-b border-neutral-200 text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                    <th className="pb-3">Style</th>
                    <th className="pb-3">Font</th>
                    <th className="pb-3">Size / Line Height</th>
                    <th className="pb-3">Weight</th>
                    <th className="pb-3">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  <tr>
                    <td className="py-2.5 font-serif font-bold text-lg text-neutral-900">
                      Display 1
                    </td>
                    <td className="py-2.5 text-neutral-500">Playfair Display</td>
                    <td className="py-2.5 font-mono text-[13px]">48 / 56</td>
                    <td className="py-2.5">Bold</td>
                    <td className="py-2.5 text-neutral-500">Page titles</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-serif font-bold text-base text-neutral-900">
                      Display 2
                    </td>
                    <td className="py-2.5 text-neutral-500">Playfair Display</td>
                    <td className="py-2.5 font-mono text-[13px]">36 / 44</td>
                    <td className="py-2.5">Bold</td>
                    <td className="py-2.5 text-neutral-500">Section titles</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-neutral-900">
                      Heading 1
                    </td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">28 / 36</td>
                    <td className="py-2.5">Semi Bold</td>
                    <td className="py-2.5 text-neutral-500">Card titles</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-neutral-900">
                      Heading 2
                    </td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">22 / 30</td>
                    <td className="py-2.5">Semi Bold</td>
                    <td className="py-2.5 text-neutral-500">Sub section</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-neutral-900">
                      Heading 3
                    </td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">18 / 26</td>
                    <td className="py-2.5">Medium</td>
                    <td className="py-2.5 text-neutral-500">Small titles</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-neutral-900">Body Large</td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">16 / 24</td>
                    <td className="py-2.5">Regular</td>
                    <td className="py-2.5 text-neutral-500">Body copy</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-neutral-900">Body</td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">14 / 20</td>
                    <td className="py-2.5">Regular</td>
                    <td className="py-2.5 text-neutral-500">Supporting text</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-neutral-900">Small</td>
                    <td className="py-2.5 text-neutral-500">Inter</td>
                    <td className="py-2.5 font-mono text-[13px]">12 / 16</td>
                    <td className="py-2.5">Regular</td>
                    <td className="py-2.5 text-neutral-500">Captions, meta</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 04: Spacing & Section 05: Radius & Shadows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-neutral-200/80 pb-12">
          {/* 04 SPACING SYSTEM */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                04
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                SPACING SYSTEM
              </h2>
            </div>
            <p className="text-[13px] text-neutral-500 font-sans">Base unit: 4px</p>

            <div className="flex flex-wrap items-end gap-3 pt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-1 bg-[#FDBA74] rounded-[2px]" />
                <span className="text-[11px] font-semibold text-neutral-900">4</span>
                <span className="text-[10px] text-neutral-400">(0.25rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-2 bg-[#FDBA74] rounded-[2px]" />
                <span className="text-[11px] font-semibold text-neutral-900">8</span>
                <span className="text-[10px] text-neutral-400">(0.5rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-3 bg-[#FDBA74] rounded-[3px]" />
                <span className="text-[11px] font-semibold text-neutral-900">12</span>
                <span className="text-[10px] text-neutral-400">(0.75rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-4 bg-[#FDBA74] rounded-[3px]" />
                <span className="text-[11px] font-semibold text-neutral-900">16</span>
                <span className="text-[10px] text-neutral-400">(1rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-6 bg-[#FDBA74] rounded-[4px]" />
                <span className="text-[11px] font-semibold text-neutral-900">24</span>
                <span className="text-[10px] text-neutral-400">(1.5rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-8 bg-[#FDBA74] rounded-[4px]" />
                <span className="text-[11px] font-semibold text-neutral-900">32</span>
                <span className="text-[10px] text-neutral-400">(2rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-10 bg-[#FDBA74] rounded-[4px]" />
                <span className="text-[11px] font-semibold text-neutral-900">40</span>
                <span className="text-[10px] text-neutral-400">(2.5rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-12 bg-[#FDBA74] rounded-[4px]" />
                <span className="text-[11px] font-semibold text-neutral-900">48</span>
                <span className="text-[10px] text-neutral-400">(3rem)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-[#FED7AA] rounded-[4px]" />
                <span className="text-[11px] font-semibold text-neutral-900">64</span>
                <span className="text-[10px] text-neutral-400">(4rem)</span>
              </div>
            </div>
          </div>

          {/* 05 RADIUS & SHADOWS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                05
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                RADIUS & SHADOWS
              </h2>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-700">Radius</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-[4px]" />
                  <span className="text-[11px] font-semibold text-neutral-900">4px</span>
                  <span className="text-[10px] text-neutral-400">(xs)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-[8px]" />
                  <span className="text-[11px] font-semibold text-neutral-900">8px</span>
                  <span className="text-[10px] text-neutral-400">(sm)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-[12px]" />
                  <span className="text-[11px] font-semibold text-neutral-900">12px</span>
                  <span className="text-[10px] text-neutral-400">(md)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-[16px]" />
                  <span className="text-[11px] font-semibold text-neutral-900">16px</span>
                  <span className="text-[10px] text-neutral-400">(lg)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-[24px]" />
                  <span className="text-[11px] font-semibold text-neutral-900">24px</span>
                  <span className="text-[10px] text-neutral-400">(xl)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white border border-neutral-200 rounded-full" />
                  <span className="text-[11px] font-semibold text-neutral-900">Full</span>
                  <span className="text-[10px] text-neutral-400">(circle)</span>
                </div>
              </div>
            </div>

            {/* Shadows */}
            <div className="space-y-2 pt-2">
              <div className="text-[13px] font-medium text-neutral-700">Shadows</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-[12px] border border-neutral-200/40 shadow-sm space-y-1">
                  <div className="font-semibold text-[13px] text-neutral-900">Sm</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    0 1px 2px 0<br />rgba(15, 23, 42, 0.05)
                  </div>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-neutral-200/40 shadow-md space-y-1">
                  <div className="font-semibold text-[13px] text-neutral-900">Md</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    0 4px 12px -2px<br />rgba(15, 23, 42, 0.08)
                  </div>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-neutral-200/40 shadow-lg space-y-1">
                  <div className="font-semibold text-[13px] text-neutral-900">Lg</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    0 12px 24px -4px<br />rgba(15, 23, 42, 0.10)
                  </div>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-neutral-200/40 shadow-xl space-y-1">
                  <div className="font-semibold text-[13px] text-neutral-900">Xl</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    0 20px 40px -8px<br />rgba(15, 23, 42, 0.12)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 06: Icons, Section 07: Buttons, Section 08: Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-neutral-200/80 pb-12">
          {/* 06 ICONS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                06
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                ICONS
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-[12px] font-medium text-neutral-500">
                  Outline Style
                </div>
                <div className="flex items-center gap-3 text-neutral-900">
                  <Bell className="w-5 h-5 stroke-[2]" />
                  <Search className="w-5 h-5 stroke-[2]" />
                  <PlayCircle className="w-5 h-5 stroke-[2]" />
                  <FileText className="w-5 h-5 stroke-[2]" />
                  <Bookmark className="w-5 h-5 stroke-[2]" />
                  <BarChart2 className="w-5 h-5 stroke-[2]" />
                  <Clock className="w-5 h-5 stroke-[2]" />
                  <User className="w-5 h-5 stroke-[2]" />
                  <ChevronRight className="w-5 h-5 stroke-[2]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[12px] font-medium text-neutral-500">
                  Filled Style
                </div>
                <div className="flex items-center gap-3 text-neutral-900">
                  <Bell className="w-5 h-5 fill-neutral-900" />
                  <Search className="w-5 h-5 stroke-[3]" />
                  <PlayCircle className="w-5 h-5 fill-neutral-900 text-white" />
                  <FileText className="w-5 h-5 fill-neutral-900" />
                  <Bookmark className="w-5 h-5 fill-neutral-900" />
                  <BarChart2 className="w-5 h-5 fill-neutral-900" />
                  <Clock className="w-5 h-5 fill-neutral-900" />
                  <User className="w-5 h-5 fill-neutral-900" />
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>

              <div className="pt-2 text-[12px] text-neutral-500 space-y-1">
                <div className="font-semibold text-neutral-700">Icon Specs</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>24x24px grid</li>
                  <li>2px stroke width (outline)</li>
                  <li>Rounded line caps</li>
                  <li>Consistent optical balance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 07 BUTTONS */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                07
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                BUTTONS
              </h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-[12px] font-semibold text-neutral-400 text-center uppercase tracking-wider">
                <div>Primary</div>
                <div>Secondary</div>
                <div>Tertiary</div>
                <div>Text</div>
              </div>

              {/* Default Row */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <Button variant="primary" size="md">
                  Get Started
                </Button>
                <Button variant="secondary" size="md">
                  Explore Courses
                </Button>
                <Button
                  variant="tertiary"
                  size="md"
                  icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  icon={<PlayCircle className="w-4 h-4 stroke-[2]" />}
                >
                  Watch Video
                </Button>
              </div>

              {/* Hover Simulation Row */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <button className="h-[44px] px-3 text-[14px] font-medium rounded-[12px] bg-[#EA580C] text-white">
                  Get Started
                </button>
                <button className="h-[44px] px-3 text-[14px] font-medium rounded-[12px] bg-primary-100/40 border border-[#EA580C] text-[#EA580C]">
                  Explore Courses
                </button>
                <button className="h-[44px] px-3 text-[14px] font-medium rounded-[12px] bg-neutral-100 border border-neutral-300 text-neutral-900 inline-flex items-center justify-center gap-2">
                  View Lesson
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
                </button>
                <button className="text-[14px] font-medium text-[#EA580C] inline-flex items-center justify-center gap-1.5">
                  Watch Video
                  <PlayCircle className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Disabled Row */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <Button variant="primary" size="md" disabled>
                  Get Started
                </Button>
                <Button variant="secondary" size="md" disabled>
                  Explore Courses
                </Button>
                <Button
                  variant="tertiary"
                  size="md"
                  disabled
                  icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  disabled
                  icon={<PlayCircle className="w-4 h-4 stroke-[2]" />}
                >
                  Watch Video
                </Button>
              </div>

              <div className="pt-2 text-[12px] text-neutral-500 space-y-1">
                <div className="font-semibold text-neutral-700">Button Specs</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Height: 44px (default)</li>
                  <li>Padding: 0 16px (lg), 0 12px (md)</li>
                  <li>Radius: 12px</li>
                  <li>Font: Inter Medium (14–16px)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 08 INPUTS */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                08
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                INPUTS
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-[12px] font-medium text-neutral-500">
                  Search / Text Input
                </div>
                <Input
                  isSearch
                  placeholder="Search anything..."
                  shortcut="⌘ K"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-[12px] font-medium text-neutral-500">
                  Select
                </div>
                <Select
                  options={[
                    { value: "relevant", label: "Most Relevant" },
                    { value: "newest", label: "Newest First" },
                    { value: "popular", label: "Most Popular" },
                  ]}
                />
              </div>

              <div className="pt-2 text-[12px] text-neutral-500 space-y-1">
                <div className="font-semibold text-neutral-700">Field Specs</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Height: 44px</li>
                  <li>Radius: 12px</li>
                  <li>Border: 1px solid #E2E8F0</li>
                  <li>Padding: 0 16px</li>
                  <li>Focus: Border color #FB923C</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 09: Badges, Section 10: Status, Section 11: Progress Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-neutral-200/80 pb-12">
          {/* 09 BADGES / TAGS */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                09
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                BADGES / TAGS
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="space-y-2">
                <div className="text-[12px] text-neutral-500">Video</div>
                <div>
                  <Badge variant="video">VIDEO</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[12px] text-neutral-500">Lesson</div>
                <div>
                  <Badge variant="lesson">LESSON</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[12px] text-neutral-500">Popular</div>
                <div>
                  <Badge variant="popular">POPULAR</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 10 STATUS / INDICATORS */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                10
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                STATUS / INDICATORS
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <StatusIndicator status="in-progress" />
              <StatusIndicator status="completed" />
              <StatusIndicator status="now-playing" />
              <StatusIndicator status="locked" />
            </div>
          </div>

          {/* 11 PROGRESS BAR */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary-500 tracking-wider">
                11
              </span>
              <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
                PROGRESS BAR
              </h2>
            </div>

            <div className="pt-3">
              <ProgressBar value={35} />
            </div>
          </div>
        </div>

        {/* Section 12: CARDS */}
        <div className="space-y-6 border-b border-neutral-200/80 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-primary-500 tracking-wider">
              12
            </span>
            <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
              CARDS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Course Card */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-neutral-500">
                Course Card
              </div>
              <CourseCard
                title="Next.js for Production"
                summary="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                moduleCount="12 modules"
              />
            </div>

            {/* Lesson Card (Video) */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-neutral-500">
                Lesson Card (Video)
              </div>
              <LessonVideoCard
                badgeText="VIDEO"
                title="Data Fetching in Server Components"
                summary="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonLabel="Lesson 5.1"
                timestamp="12:45"
              />
            </div>

            {/* Lesson Card (Lesson) */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-neutral-500">
                Lesson Card (Lesson)
              </div>
              <LessonCard
                badgeText="LESSON"
                title="Data Fetching & Caching"
                summary="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
                ctaText="View lesson"
              />
            </div>

            {/* Resource Card */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-neutral-500">
                Resource Card
              </div>
              <ResourceCard
                title="Caching and Revalidation Guide"
                summary="Deep dive into Next.js caching strategies."
                fileType="PDF"
                fileSize="1.2 MB"
              />
            </div>
          </div>
        </div>

        {/* Section 13: NAVIGATION */}
        <div className="space-y-6 border-b border-neutral-200/80 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-primary-500 tracking-wider">
              13
            </span>
            <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
              NAVIGATION
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Header Navigation */}
            <div className="lg:col-span-4 flex items-center gap-8">
              <Logo size="md" />
              <div className="flex items-center gap-6">
                <span className="text-[15px] font-sans font-semibold text-primary-500 cursor-pointer">
                  Courses
                </span>
                <span className="text-[15px] font-sans font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer">
                  My Learning
                </span>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="lg:col-span-5">
              <div className="text-[11px] text-neutral-400 mb-1">
                Breadcrumbs
              </div>
              <Breadcrumbs
                items={[
                  "All Courses",
                  "Next.js for Production",
                  "Data Fetching & Caching",
                ]}
              />
            </div>

            {/* Pagination */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-end">
              <div className="text-[11px] text-neutral-400 mb-1">
                Pagination
              </div>
              <Pagination currentPage={1} totalPages={8} />
            </div>
          </div>
        </div>

        {/* Section 14: PRINCIPLES */}
        <div className="space-y-6 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-primary-500 tracking-wider">
              14
            </span>
            <h2 className="text-[12px] font-bold tracking-wider uppercase text-neutral-900 font-sans">
              PRINCIPLES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                <Eye className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[15px] text-neutral-900 font-sans">
                  Clarity First
                </h3>
                <p className="text-[13px] text-neutral-500 leading-[18px] font-sans">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                <LayoutGrid className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[15px] text-neutral-900 font-sans">
                  Consistency
                </h3>
                <p className="text-[13px] text-neutral-500 leading-[18px] font-sans">
                  Use components and patterns consistently across the platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                <Target className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[15px] text-neutral-900 font-sans">
                  Focus & Calm
                </h3>
                <p className="text-[13px] text-neutral-500 leading-[18px] font-sans">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                <Accessibility className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[15px] text-neutral-900 font-sans">
                  Accessible
                </h3>
                <p className="text-[13px] text-neutral-500 leading-[18px] font-sans">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
