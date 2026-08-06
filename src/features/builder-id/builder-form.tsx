"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Shuffle, User, Briefcase } from "lucide-react";
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
import { cn } from "@/lib/utils";

const builderSchema = z.object({
  name: z
    .string()
    .min(1, "Your name keeps the card personal.")
    .max(40, "Let's keep it under 40 characters."),
  role: z
    .string()
    .min(1, "Tell us what you build.")
    .max(48, "Let's keep it under 48 characters."),
});

interface BuilderFormProps {
  initialName?: string;
  initialRole?: string;
  initialTitle?: string;
  onChange: (values: { name: string; role: string; builderTitle: string }) => void;
  className?: string;
}

/**
 * Builder ID form. Controlled by React Hook Form + Zod. Every keystroke is
 * forwarded to the parent via onChange so the live preview updates instantly.
 */
export function BuilderForm({
  initialName = "",
  initialRole = "",
  initialTitle,
  onChange,
  className,
}: BuilderFormProps) {
  const { title, setTitle, regenerate } = useBuilderTitle(initialTitle);
  const [spinKey, setSpinKey] = React.useState(0);

  const form = useForm<z.infer<typeof builderSchema>>({
    resolver: zodResolver(builderSchema),
    mode: "onChange",
    defaultValues: {
      name: initialName,
      role: initialRole,
    },
  });

  // Keep a ref to the latest title + onChange so the watch subscription
  // doesn't need to re-subscribe on every title change (avoids cascading
  // renders that would otherwise reset the parent's hasGenerated state).
  const titleRef = React.useRef(title);
  titleRef.current = title;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Forward changes upward. We subscribe with form.watch once.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = form.watch((values) => {
      onChangeRef.current({
        name: (values.name as string) ?? "",
        role: (values.role as string) ?? "",
        builderTitle: titleRef.current,
      });
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Whenever the title changes (including refresh), bubble it up.
  React.useEffect(() => {
    onChangeRef.current({
      name: form.getValues("name") ?? "",
      role: form.getValues("role") ?? "",
      builderTitle: title,
    });
  }, [title, form]);

  const handleRegenerate = React.useCallback(() => {
    setSpinKey((k) => k + 1);
    regenerate();
  }, [regenerate]);

  const handleSetTitle = React.useCallback((next: string) => {
    setTitle(next);
  }, [setTitle]);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-5", className)}
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
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
                  placeholder="e.g. AI · LLM Tooling"
                  maxLength={48}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-deep">
              Builder Title
            </span>
            <button
              type="button"
              onClick={handleRegenerate}
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
              className="relative flex items-center gap-2 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/12 via-coral-soft/8 to-emerald-soft/8 px-4 py-3 shadow-tropical"
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
              <input
                value={title}
                onChange={(e) => handleSetTitle(e.target.value)}
                className="w-full bg-transparent font-serif text-lg text-emerald-deep outline-none"
                aria-label="Builder Title (editable)"
                maxLength={48}
              />
            </motion.div>
          </AnimatePresence>

          <p className="text-xs text-muted-foreground">
            Tap{" "}
            <button
              type="button"
              onClick={handleRegenerate}
              className="font-medium text-emerald underline-offset-2 hover:underline"
            >
              Generate another
            </button>{" "}
            to roll from 100+ original titles · Or type your own
          </p>
        </div>
      </form>
    </Form>
  );
}
