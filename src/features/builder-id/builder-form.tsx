"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Shuffle, User, Briefcase, AtSign } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  twitter: z
    .string()
    .max(30, "Twitter handle should be under 30 characters.")
    .optional(),
});

interface BuilderFormProps {
  initialName?: string;
  initialRole?: string;
  initialTitle?: string;
  initialTwitter?: string;
  onChange: (values: { name: string; role: string; builderTitle: string; twitter?: string }) => void;
  className?: string;
}

export function BuilderForm({
  initialName = "",
  initialRole = "",
  initialTitle,
  initialTwitter = "",
  onChange,
  className,
}: BuilderFormProps) {
  const [currentRole, setCurrentRole] = React.useState(initialRole);
  const { title, setTitle, regenerate } = useBuilderTitle(initialTitle, currentRole);
  const [spinKey, setSpinKey] = React.useState(0);
  const lastRoleRef = React.useRef(initialRole);

  const form = useForm<z.infer<typeof builderSchema>>({
    resolver: zodResolver(builderSchema),
    mode: "onChange",
    defaultValues: {
      name: initialName,
      role: initialRole,
      twitter: initialTwitter,
    },
  });

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = form.watch((values) => {
      const newRole = (values.role as string) ?? "";
      if (newRole !== lastRoleRef.current && newRole.trim().length > 0) {
        lastRoleRef.current = newRole;
        setCurrentRole(newRole);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const titleRef = React.useRef(title);
  titleRef.current = title;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    const sub = form.watch((values) => {
      onChangeRef.current({
        name: (values.name as string) ?? "",
        role: (values.role as string) ?? "",
        twitter: (values.twitter as string) ?? "",
        builderTitle: titleRef.current,
      });
    });
    return () => sub.unsubscribe();
  }, [form]);

  React.useEffect(() => {
    onChangeRef.current({
      name: form.getValues("name") ?? "",
      role: form.getValues("role") ?? "",
      twitter: form.getValues("twitter") ?? "",
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
              <FormLabel className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1c3529]">
                <User className="h-3.5 w-3.5 text-[#1c3529]" />
                Builder Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Alex Mehra"
                  autoComplete="name"
                  maxLength={40}
                  className="h-11 rounded-xl border-2 border-[#1c3529] bg-[#FFFFFF] font-mono text-sm text-[#1c3529] placeholder:text-[#1c3529]/50 shadow-[2px_2px_0px_#1c3529] focus-visible:ring-0 focus-visible:border-[#d9a726]"
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
              <FormLabel className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1c3529]">
                <Briefcase className="h-3.5 w-3.5 text-[#1c3529]" />
                Stack / Role
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. AI · PyTorch"
                  maxLength={48}
                  className="h-11 rounded-xl border-2 border-[#1c3529] bg-[#FFFFFF] font-mono text-sm text-[#1c3529] placeholder:text-[#1c3529]/50 shadow-[2px_2px_0px_#1c3529] focus-visible:ring-0 focus-visible:border-[#d9a726]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1c3529]">
                <AtSign className="h-3.5 w-3.5 text-[#C85A32]" />
                Twitter / X Handle
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. @alex_builds"
                  maxLength={30}
                  className="h-11 rounded-xl border-2 border-[#1c3529] bg-[#FFFFFF] font-mono text-sm text-[#1c3529] placeholder:text-[#1c3529]/50 shadow-[2px_2px_0px_#1c3529] focus-visible:ring-0 focus-visible:border-[#d9a726]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c3529]">
              Builder Title
            </span>
            <button
              type="button"
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1c3529] bg-[#e04b77] px-3 py-1 font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#1c3529] hover:bg-[#c0325e]"
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
              className="relative flex items-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#d9a726] px-4 py-3 shadow-[3px_3px_0px_#1c3529]"
            >
              <RefreshCw className="h-4 w-4 shrink-0 text-[#1c3529]" />
              <input
                value={title}
                onChange={(e) => handleSetTitle(e.target.value)}
                className="w-full bg-transparent font-serif text-lg font-bold text-[#1c3529] outline-none"
                aria-label="Builder Title (editable)"
                maxLength={48}
              />
            </motion.div>
          </AnimatePresence>

          <p className="font-mono text-[11px] text-[#1c3529]/80">
            Tap Generate another to roll from 100+ titles · Or type your own
          </p>
        </div>
      </form>
    </Form>
  );
}
