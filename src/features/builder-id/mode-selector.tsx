"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CircleUser, IdCard, ArrowRight } from "lucide-react";
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
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  ring: string;
}

const MODES: ModeOption[] = [
  {
    id: "profile-frame",
    label: "Profile Frame",
    description: "Circular avatar with palm decorations and premium border",
    icon: CircleUser,
    accent: "from-gold/20 via-coral-soft/20 to-emerald-soft/20",
    ring: "ring-gold/60",
  },
  {
    id: "builder-id",
    label: "Builder ID",
    description: "Modern identity card with name, role and Builder Title",
    icon: IdCard,
    accent: "from-emerald-soft/20 via-gold/15 to-coral-soft/15",
    ring: "ring-emerald/60",
  },
];

/**
 * Two-card mode picker. Big tap targets, clear iconography, animated
 * selection ring. Keyboard accessible (Tab + Enter/Space).
 */
export function ModeSelector({ value, onChange, className }: ModeSelectorProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
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
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            className={cn(
              "group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border p-5 sm:p-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4",
              "bg-gradient-to-br",
              mode.accent,
              selected
                ? `border-transparent ring-2 ring-offset-2 ring-offset-background ${mode.ring} shadow-tropical-lg`
                : "border-emerald/15 bg-card hover:border-emerald/30 hover:shadow-tropical"
            )}
          >
            {/* Decorative corner */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity",
                selected
                  ? "bg-gold/40 opacity-100"
                  : "bg-emerald-soft/30 opacity-0 group-hover:opacity-100"
              )}
            />

            <div className="flex w-full items-start justify-between gap-3">
              <div
                className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300",
                  selected
                    ? "bg-gradient-to-br from-emerald to-emerald-deep text-ivory shadow-tropical"
                    : "bg-emerald/10 text-emerald-deep group-hover:bg-emerald/20"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>

              {selected && (
                <motion.span
                  layoutId="mode-check"
                  className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-deep"
                >
                  Selected
                </motion.span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-lg sm:text-xl text-emerald-deep">
                {mode.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode.description}
              </p>
            </div>

            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold transition-colors",
                selected ? "text-emerald" : "text-muted-foreground group-hover:text-emerald-deep"
              )}
            >
              {selected ? "Active" : "Select"}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
