"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Shuffle,
  User,
  Briefcase,
  GraduationCap,
  Github,
  Twitter,
  Award,
  Sparkles,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBuilderTitle } from "@/hooks/use-builder-title";
import {
  BUILDER_LEVELS,
  BUILDER_LEVEL_ORDER,
  FUN_BADGES,
  STACK_SUGGESTIONS,
} from "@/constants";
import { pickRandom, cn } from "@/lib/utils";
import type { BuilderFormValues, BuilderLevel } from "@/types";

const builderSchema = z.object({
  name: z
    .string()
    .min(1, "Your name keeps the card personal.")
    .max(40, "Let's keep it under 40 characters."),
  role: z
    .string()
    .min(1, "Tell us what you build.")
    .max(48, "Let's keep it under 48 characters."),
  college: z
    .string()
    .max(60, "Let's keep it under 60 characters.")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .max(40, "Let's keep it under 40 characters.")
    .optional()
    .or(z.literal("")),
  xHandle: z
    .string()
    .max(30, "Let's keep it under 30 characters.")
    .optional()
    .or(z.literal("")),
});

interface BuilderFormProps {
  initial: Partial<BuilderFormValues>;
  onChange: (values: BuilderFormValues) => void;
  className?: string;
}

/**
 * Builder ID form. Controlled by React Hook Form + Zod. Every keystroke is
 * forwarded to the parent via onChange so the live preview updates instantly.
 * Includes Builder Level picker (4 levels), random fun badge with refresh,
 * and quick-pick stack chips.
 */
export function BuilderForm({ initial, onChange, className }: BuilderFormProps) {
  const { title, setTitle, regenerate } = useBuilderTitle(initial.builderTitle);
  const [spinKey, setSpinKey] = React.useState(0);
  const [badgeSpinKey, setBadgeSpinKey] = React.useState(0);

  const [builderLevel, setBuilderLevel] = React.useState<BuilderLevel>(
    initial.builderLevel ?? "gold"
  );
  const [badge, setBadge] = React.useState<string>(
    initial.badge ?? pickRandom(FUN_BADGES).label
  );
  const [badgeEmoji, setBadgeEmoji] = React.useState<string>(
    FUN_BADGES.find((b) => b.label === badge)?.emoji ?? pickRandom(FUN_BADGES).emoji
  );

  const form = useForm<z.infer<typeof builderSchema>>({
    resolver: zodResolver(builderSchema),
    mode: "onChange",
    defaultValues: {
      name: initial.name ?? "",
      role: initial.role ?? "",
      college: initial.college ?? "",
      github: initial.github ?? "",
      xHandle: initial.xHandle ?? "",
    },
  });

  // Stable refs so the watch subscription doesn't need to re-subscribe on
  // every title/level/badge change.
  const stateRef = React.useRef({ title, builderLevel, badge, badgeEmoji });
  stateRef.current = { title, builderLevel, badge, badgeEmoji };
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Subscribe to form field changes once.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = form.watch((values) => {
      onChangeRef.current({
        name: (values.name as string) ?? "",
        role: (values.role as string) ?? "",
        college: (values.college as string) ?? "",
        github: (values.github as string) ?? "",
        xHandle: (values.xHandle as string) ?? "",
        builderTitle: stateRef.current.title,
        builderLevel: stateRef.current.builderLevel,
        badge: stateRef.current.badge,
        badgeEmoji: stateRef.current.badgeEmoji,
      });
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Whenever title/level/badge changes, bubble up.
  React.useEffect(() => {
    onChangeRef.current({
      name: form.getValues("name") ?? "",
      role: form.getValues("role") ?? "",
      college: form.getValues("college") ?? "",
      github: form.getValues("github") ?? "",
      xHandle: form.getValues("xHandle") ?? "",
      builderTitle: title,
      builderLevel,
      badge,
      badgeEmoji,
    });
  }, [title, builderLevel, badge, badgeEmoji, form]);

  const handleRegenerateTitle = React.useCallback(() => {
    setSpinKey((k) => k + 1);
    regenerate();
  }, [regenerate]);

  const handleRegenerateBadge = React.useCallback(() => {
    setBadgeSpinKey((k) => k + 1);
    const next = pickRandom(FUN_BADGES, FUN_BADGES.find((b) => b.label === badge));
    setBadge(next.label);
    setBadgeEmoji(next.emoji);
  }, [badge]);

  const handleRoleChipClick = React.useCallback(
    (role: string) => {
      form.setValue("role", role, { shouldValidate: true, shouldDirty: true });
    },
    [form]
  );

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-5", className)}
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {/* Builder Title — large gradient pill at top */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-deep">
              Builder Title
            </span>
            <button
              type="button"
              onClick={handleRegenerateTitle}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-deep transition-all hover:bg-emerald/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="Generate another Builder Title"
            >
              <motion.span
                key={spinKey}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="inline-flex"
              >
                <Shuffle className="h-3.5 w-3.5" />
              </motion.span>
              Generate another
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="relative flex items-center gap-2 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/12 via-rose-soft/8 to-emerald-soft/8 px-4 py-3 shadow-luxe"
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent font-display text-lg text-emerald-deep outline-none"
                aria-label="Builder Title (editable)"
                maxLength={48}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
                <User className="h-3.5 w-3.5 text-emerald-soft" />
                Builder name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Aria Mehra"
                  autoComplete="name"
                  maxLength={40}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stack / Role with chips */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
                <Briefcase className="h-3.5 w-3.5 text-emerald-soft" />
                Stack / Role
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Full Stack · AI"
                  maxLength={48}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </FormControl>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {STACK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleRoleChipClick(s)}
                    className="rounded-full border border-emerald/15 bg-card px-2.5 py-1 text-xs font-medium text-emerald-deep transition-colors hover:border-emerald/40 hover:bg-emerald/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* College */}
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-soft" />
                College / Affiliation
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. IIT Bombay"
                  maxLength={60}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GitHub + X handle row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
                  <Github className="h-3.5 w-3.5 text-emerald-soft" />
                  GitHub
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="your-handle"
                    maxLength={40}
                    className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
                  <Twitter className="h-3.5 w-3.5 text-emerald-soft" />
                  X / 𝕏 Handle
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="@your-handle"
                    maxLength={30}
                    className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Builder Level — 4 segmented buttons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
            <Award className="h-3.5 w-3.5 text-emerald-soft" />
            Builder Level
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BUILDER_LEVEL_ORDER.map((lvlId) => {
              const lvl = BUILDER_LEVELS[lvlId];
              const active = builderLevel === lvlId;
              return (
                <motion.button
                  key={lvlId}
                  type="button"
                  onClick={() => setBuilderLevel(lvlId)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                    active
                      ? "border-transparent text-ivory shadow-luxe"
                      : "border-emerald/15 bg-card text-emerald-deep hover:border-emerald/30"
                  )}
                  style={
                    active
                      ? {
                          background: `linear-gradient(135deg, ${lvl.gradient[0]}, ${lvl.gradient[1]})`,
                          boxShadow: `0 8px 20px ${lvl.hex}55`,
                        }
                      : undefined
                  }
                  aria-pressed={active}
                >
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{
                      background: active
                        ? "rgba(255,255,255,0.3)"
                        : `linear-gradient(135deg, ${lvl.gradient[0]}, ${lvl.gradient[1]})`,
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-ivory" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {lvl.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Fun Badge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-deep">
              <Sparkles className="h-3.5 w-3.5 text-emerald-soft" />
              Fun Badge
            </span>
            <button
              type="button"
              onClick={handleRegenerateBadge}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald-deep transition-all hover:bg-emerald/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="Roll a new fun badge"
            >
              <motion.span
                key={badgeSpinKey}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="inline-flex"
              >
                <Shuffle className="h-3.5 w-3.5" />
              </motion.span>
              Roll badge
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={badge}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 rounded-xl border border-rose/30 bg-gradient-to-br from-rose-soft/12 via-gold/8 to-emerald-soft/8 px-4 py-3 shadow-luxe"
            >
              <span className="text-2xl">{badgeEmoji}</span>
              <span className="font-display text-base text-emerald-deep">{badge}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </form>
    </Form>
  );
}
