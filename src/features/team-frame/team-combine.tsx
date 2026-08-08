"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  UserCheck,
  School,
  IdCard,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  findBuilderById,
  getCurrentUserBuilder,
  getAllSavedBuilders,
} from "@/lib/builder-registry";
import type { SavedBuilderProfile } from "@/lib/builder-registry";
import type { TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface TeamCombineProps {
  members: TeamMember[];
  teamName: string;
  college: string;
  onChangeMembers: (members: TeamMember[]) => void;
  onChangeTeamInfo: (info: { teamName: string; college: string }) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
  className?: string;
}

/**
 * Redefined Team Frame Flow — "Combine Builder IDs".
 *
 * Removes repetitive photo uploading and teammate forms.
 * Allows adding existing individual Builder IDs by code (e.g. HH26-HITESH-X7K2)
 * or via quick shortcut buttons.
 */
export function TeamCombine({
  members,
  teamName,
  college,
  onChangeMembers,
  onChangeTeamInfo,
  onGenerate,
  isGenerating,
  hasGenerated,
  className,
}: TeamCombineProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [foundBuilder, setFoundBuilder] = React.useState<SavedBuilderProfile | null>(null);
  const [currentUser, setCurrentUser] = React.useState<SavedBuilderProfile | null>(null);

  // Check for current user's generated Builder ID on mount
  React.useEffect(() => {
    const curr = getCurrentUserBuilder();
    if (curr) setCurrentUser(curr);
  }, []);

  // Handle Search for a Builder ID
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const result = findBuilderById(searchQuery);
    if (result) {
      setFoundBuilder(result);
      toast.success(`Builder Found: ${result.name}`);
    } else {
      setFoundBuilder(null);
      toast.error(`Builder ID "${searchQuery}" not found`, {
        description: "Check the ID code or try a sample code below.",
      });
    }
  };

  // Add a Builder Profile to Team
  const handleAddBuilderToTeam = (builder: SavedBuilderProfile) => {
    if (members.length >= 3) {
      toast.error("Maximum 3 team members allowed.");
      return;
    }
    if (members.some((m) => m.builderId === builder.builderId || m.name === builder.name)) {
      toast.error(`${builder.name} is already in the team.`);
      return;
    }

    const newMember: TeamMember = {
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      builderId: builder.builderId,
      name: builder.name,
      role: builder.role,
      builderTitle: builder.builderTitle,
      avatarUrl: builder.avatarUrl,
      isConfirmed: true,
    };

    const updated = [...members, newMember];
    onChangeMembers(updated);
    setFoundBuilder(null);
    setSearchQuery("");
    toast.success(`Added ${builder.name} to Team!`);
  };

  // Remove a member from Team
  const handleRemoveMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    onChangeMembers(updated);
    toast.info("Member removed from team.");
  };

  // Sample quick add shortcuts
  const sampleBuilders = getAllSavedBuilders();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald">
          <Users className="h-4 w-4" />
          <span>Combine Builder IDs</span>
        </div>
        <h3 className="mt-1 font-serif text-2xl font-bold text-emerald-deep">
          Build Your Team Frame
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Every teammate should have their own Builder ID. Enter their Builder ID code to combine them into an official HH Goa Team Frame.
        </p>

        {/* Current User Quick Add Shortcut */}
        {currentUser && !members.some((m) => m.builderId === currentUser.builderId || m.name === currentUser.name) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-between rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/15 via-gold/5 to-emerald/10 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-emerald-deep font-serif font-bold">
                ✓
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-deep">
                  Your Builder ID: {currentUser.builderId}
                </p>
                <p className="text-sm font-bold text-emerald-deep">
                  {currentUser.name} ({currentUser.role})
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleAddBuilderToTeam(currentUser)}
              className="h-10 rounded-xl bg-emerald px-4 text-xs font-bold text-ivory shadow-sm hover:bg-emerald-deep"
            >
              <UserCheck className="mr-1.5 h-3.5 w-3.5" />
              + Add Yourself
            </Button>
          </motion.div>
        )}
      </div>

      {/* Find Builder Input */}
      <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4">
        <h4 className="font-serif text-base font-bold text-emerald-deep flex items-center gap-2">
          <Search className="h-4 w-4 text-emerald" />
          Add Teammate Builder ID
        </h4>

        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter Builder ID Code (e.g. HH26-ALEX-9K82)"
            className="h-12 rounded-2xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
          />
          <Button
            type="button"
            onClick={handleSearch}
            className="h-12 rounded-2xl bg-emerald px-6 font-bold text-ivory hover:bg-emerald-deep"
          >
            Find Builder
          </Button>
        </div>

        {/* Builder Found Preview */}
        <AnimatePresence>
          {foundBuilder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex items-center justify-between rounded-2xl border border-gold/50 bg-gradient-to-br from-gold/15 to-emerald/10 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald font-serif font-bold text-ivory text-xl shadow-sm">
                  {foundBuilder.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold">
                      ✓ BUILDER FOUND
                    </span>
                    <span className="text-xs text-muted-foreground">• {foundBuilder.builderId}</span>
                  </div>
                  <p className="text-base font-bold text-emerald-deep">{foundBuilder.name}</p>
                  <p className="text-xs text-emerald-soft font-semibold">{foundBuilder.role} · ⚡ {foundBuilder.builderTitle}</p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleAddBuilderToTeam(foundBuilder)}
                className="h-10 rounded-xl bg-gold px-4 text-xs font-bold text-emerald-deep shadow-sm hover:bg-gold/80"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add to Team
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Sample Shortcuts for instant testing */}
        <div className="mt-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Sample Builders (Click to test):
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleBuilders.map((b) => {
              const isAdded = members.some((m) => m.builderId === b.builderId || m.name === b.name);
              return (
                <button
                  key={b.builderId}
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAddBuilderToTeam(b)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                    isAdded
                      ? "border-emerald/20 bg-emerald/10 text-emerald/50 opacity-60 cursor-not-allowed"
                      : "border-emerald/25 bg-card text-emerald-deep hover:border-gold hover:bg-gold/10"
                  )}
                >
                  <IdCard className="h-3 w-3 text-gold" />
                  {b.name} ({b.builderId})
                  {isAdded ? " ✓ Added" : " +"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Added Team Members List */}
      <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-deep">
            Team Members ({members.length} of 3)
          </h4>
          <span className={cn("text-xs font-extrabold uppercase tracking-wider", members.length >= 2 ? "text-emerald" : "text-amber-600")}>
            {members.length >= 2 ? "✓ Valid Team (2-3 Members)" : "Add at least 2 members"}
          </span>
        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald/25 p-8 text-center text-muted-foreground text-sm">
            No Builder IDs added yet. Search a Builder ID above or click "+ Add Yourself".
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m, idx) => (
              <div
                key={m.id || idx}
                className="flex items-center justify-between rounded-2xl border border-emerald/15 bg-card/80 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-deep text-ivory font-serif font-bold text-sm shadow-sm">
                    {m.name.charAt(0) || `M${idx + 1}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald">
                        MEMBER {idx + 1}
                      </span>
                      {m.builderId && (
                        <span className="text-[10px] text-muted-foreground">({m.builderId})</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-emerald-deep">{m.name || `Teammate ${idx + 1}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.role || "Builder"} · ⚡ {m.builderTitle || "AI Builder"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(idx)}
                  className="h-8 text-xs text-muted-foreground hover:text-coral-deep"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Details (Required once 2+ members exist) */}
      {members.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4"
        >
          <h4 className="font-serif text-base font-bold text-emerald-deep flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald" />
            Team Information
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
              Team Name *
            </label>
            <Input
              value={teamName}
              onChange={(e) => onChangeTeamInfo({ teamName: e.target.value, college })}
              placeholder="e.g. Neural Ninjas"
              maxLength={40}
              className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
              <School className="h-3 w-3 text-emerald-soft" />
              College / University (Optional)
            </label>
            <Input
              value={college}
              onChange={(e) => onChangeTeamInfo({ teamName, college: e.target.value })}
              placeholder="e.g. BITS Pilani"
              maxLength={48}
              className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
            />
          </div>

          <div className="mt-2">
            <Button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !teamName.trim()}
              className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-bold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg"
            >
              <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Generate Team Frame ({members.length} Members) 🎉
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
