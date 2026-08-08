"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, User, Briefcase, Users, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateBuilderTitle } from "@/lib/title-generator";
import type { TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface TeamFormProps {
  teamName: string;
  teamTagline: string;
  college: string;
  members: TeamMember[];
  onChange: (values: {
    teamName: string;
    teamTagline: string;
    college: string;
    members: TeamMember[];
  }) => void;
  className?: string;
}

/**
 * Team Form for Team Name, College/Tagline, and individual member details.
 * Features an AI Title Generator button for every member!
 */
export function TeamForm({
  teamName: initialTeamName,
  teamTagline: initialTeamTagline,
  college: initialCollege,
  members: initialMembers,
  onChange,
  className,
}: TeamFormProps) {
  const [teamName, setTeamName] = React.useState(initialTeamName || "");
  const [teamTagline, setTeamTagline] = React.useState(initialTeamTagline || "");
  const [college, setCollege] = React.useState(initialCollege || "");
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers);

  // Sync internal state if initialMembers changes length
  React.useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers.length]);

  const notifyChange = React.useCallback(
    (
      tn: string,
      tt: string,
      col: string,
      mList: TeamMember[]
    ) => {
      onChange({
        teamName: tn,
        teamTagline: tt,
        college: col,
        members: mList,
      });
    },
    [onChange]
  );

  const handleTeamNameChange = (val: string) => {
    setTeamName(val);
    notifyChange(val, teamTagline, college, members);
  };

  const handleTaglineChange = (val: string) => {
    setTeamTagline(val);
    notifyChange(teamName, val, college, members);
  };

  const handleCollegeChange = (val: string) => {
    setCollege(val);
    notifyChange(teamName, teamTagline, val, members);
  };

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        const nextM = { ...m, [field]: value };
        // If role changed, auto-generate title if title is empty
        if (field === "role" && value.trim() && !m.builderTitle) {
          nextM.builderTitle = generateBuilderTitle(value);
        }
        return nextM;
      }
      return m;
    });
    setMembers(updated);
    notifyChange(teamName, teamTagline, college, updated);
  };

  const handleRegenerateMemberTitle = (id: string) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        const newTitle = generateBuilderTitle(m.role || "Builder", m.builderTitle);
        return { ...m, builderTitle: newTitle };
      }
      return m;
    });
    setMembers(updated);
    notifyChange(teamName, teamTagline, college, updated);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={(e) => e.preventDefault()}>
      {/* ============ TEAM INFO SECTION ============ */}
      <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-emerald-deep flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald" />
          Team Information
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
            Team Name
          </label>
          <Input
            value={teamName}
            onChange={(e) => handleTeamNameChange(e.target.value)}
            placeholder="e.g. Neural Ninjas"
            maxLength={40}
            className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
              Team Tagline (Optional)
            </label>
            <Input
              value={teamTagline}
              onChange={(e) => handleTaglineChange(e.target.value)}
              placeholder="e.g. Shipping AI @ HH Goa"
              maxLength={48}
              className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
              <School className="h-3 w-3 text-emerald-soft" />
              College / University
            </label>
            <Input
              value={college}
              onChange={(e) => handleCollegeChange(e.target.value)}
              placeholder="e.g. BITS Pilani"
              maxLength={48}
              className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* ============ TEAM MEMBERS SECTION ============ */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-emerald-deep flex items-center gap-2">
          <User className="h-4 w-4 text-emerald" />
          Teammate Details ({members.length} Members)
        </h3>

        {members.map((m, idx) => (
          <div
            key={m.id || idx}
            className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-sm">
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-emerald font-bold text-xs text-ivory">
                    T{idx + 1}
                  </div>
                )}
              </div>
              <h4 className="font-serif text-base font-bold text-emerald-deep">
                Teammate {idx + 1} Details
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
                  <User className="h-3 w-3 text-emerald-soft" />
                  Name
                </label>
                <Input
                  value={m.name || ""}
                  onChange={(e) => handleMemberChange(m.id, "name", e.target.value)}
                  placeholder={`e.g. Teammate ${idx + 1} Name`}
                  maxLength={36}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-emerald-soft" />
                  Stack / Role
                </label>
                <Input
                  value={m.role || ""}
                  onChange={(e) => handleMemberChange(m.id, "role", e.target.value)}
                  placeholder="e.g. AI · PyTorch"
                  maxLength={40}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </div>
            </div>

            {/* AI Builder Title for Member */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
                  Builder Title
                </span>
                <button
                  type="button"
                  onClick={() => handleRegenerateMemberTitle(m.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-deep transition-all hover:bg-emerald/20"
                >
                  <Shuffle className="h-3 w-3" />
                  Generate Another
                </button>
              </div>

              <div className="relative flex items-center gap-2 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/10 via-coral-soft/5 to-emerald-soft/5 px-3 py-2">
                <input
                  value={m.builderTitle || ""}
                  onChange={(e) => handleMemberChange(m.id, "builderTitle", e.target.value)}
                  placeholder="Title (e.g. Prompt Architect)"
                  className="w-full bg-transparent font-serif text-sm font-bold text-emerald-deep outline-none"
                  maxLength={40}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
