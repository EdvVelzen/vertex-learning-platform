import React from "react";
import { LearningOutcome } from "@/sanity/lib/types";
import {
  Layers,
  Database,
  Gauge,
  Cloud,
  ShieldCheck,
  Rocket,
  Sparkles,
  Puzzle,
  Code,
  Workflow,
} from "lucide-react";

interface WhatYoullLearnProps {
  outcomes?: LearningOutcome[];
}

function getOutcomeIcon(iconName?: string) {
  const iconProps = {
    className: "w-8 h-8 text-primary-500 stroke-[1.8] shrink-0",
  };

  switch (iconName?.toLowerCase()) {
    case "layers":
    case "stack":
      return <Layers {...iconProps} />;
    case "database":
    case "data":
    case "storage":
      return <Database {...iconProps} />;
    case "gauge":
    case "speed":
    case "performance":
    case "timer":
      return <Gauge {...iconProps} />;
    case "cloud":
    case "deployment":
    case "scale":
      return <Cloud {...iconProps} />;
    case "shield":
    case "security":
      return <ShieldCheck {...iconProps} />;
    case "rocket":
      return <Rocket {...iconProps} />;
    case "sparkles":
      return <Sparkles {...iconProps} />;
    case "puzzle":
      return <Puzzle {...iconProps} />;
    case "code":
      return <Code {...iconProps} />;
    case "workflow":
      return <Workflow {...iconProps} />;
    default:
      return <Layers {...iconProps} />;
  }
}

export function WhatYoullLearn({ outcomes }: WhatYoullLearnProps) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section className="w-full mt-12 sm:mt-16">
      <div className="border border-neutral-200/90 rounded-[16px] p-6 sm:p-8 bg-[#FCFCFD]/80">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-neutral-900 mb-6">
          What you&apos;ll learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {outcomes.map((outcome, idx) => (
            <div
              key={outcome._key || idx}
              className="bg-white border border-neutral-200/80 rounded-[12px] p-5 sm:p-6 flex items-start gap-4 shadow-sm hover:border-neutral-300 transition-colors"
            >
              <div className="pt-0.5">{getOutcomeIcon(outcome.icon)}</div>
              <div>
                <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-neutral-900 mb-1.5">
                  {outcome.title}
                </h3>
                {outcome.description && (
                  <p className="text-neutral-500 text-[14px] leading-[22px]">
                    {outcome.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
