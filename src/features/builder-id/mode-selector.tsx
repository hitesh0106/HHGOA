"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratorMode } from "@/types";

interface ModeSelectorProps {
  value: GeneratorMode;
  onChange: (mode: GeneratorMode) => void;
  className?: string;
}

interface ModeOption {
  id: GeneratorMode;
  label: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
}

const MODES: ModeOption[] = [
  {
    id: "builder-id",
    label: "Solo Pass",
    badge: "1 Hacker",
    description: "Official 1-person expedition pass with your photo, stack & AI title",
    icon: User,
  },
  {
    id: "team-frame",
    label: "Team Pass",
    badge: "2–3 Hackers",
    description: "Official team pass combining 2 or 3 hackers into one expedition frame",
    icon: Users,
  },
];

export function ModeSelector({ value, onChange, className }: ModeSelectorProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}
      role="radiogroup"
      aria-label="Choose generation mode"
    >
      {MODES.map((mode) => {
        const selected = value === mode.id;
        const Icon = mode.icon;
        return (
          <motion.button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mode.id)}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border-2 border-[#1c3529] p-4 text-left shadow-[4px_4px_0px_#1c3529] transition-all duration-200 outline-none",
              selected
                ? "bg-[#d9a726] text-[#1c3529]"
                : "bg-[#FCF9F2] text-[#1c3529] hover:bg-[#FFFFFF]"
            )}
          >
            <div className="flex w-full items-start justify-between gap-2">
              <div
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-[#1c3529] transition-all duration-200",
                  selected
                    ? "bg-[#1c3529] text-[#f3f6f1]"
                    : "bg-[#FCF9F2] text-[#1c3529]"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>

              <div className="flex items-center gap-1.5">
                {mode.badge && (
                  <span className="rounded-md border border-[#1c3529] bg-[#1c3529]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1c3529]">
                    {mode.badge}
                  </span>
                )}
                {selected && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#1c3529] bg-[#e04b77] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex-1">
              <h3 className="font-serif text-xl font-black text-[#1c3529]">
                {mode.label}
              </h3>
              <p className="mt-1 font-mono text-xs font-bold leading-relaxed text-[#1c3529]/85 line-clamp-2">
                {mode.description}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1 font-mono text-xs font-bold text-[#1c3529]">
              <span>{selected ? "SELECTED" : "SELECT MODE"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
