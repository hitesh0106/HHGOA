import type { BadgeDefinition, BuilderLevel, LevelDefinition } from "@/types";

/**
 * Central application configuration. Single source of truth for tunable
 * constants so the rest of the app stays declarative.
 */
export const APP_CONFIG = {
  name: "HH Goa 2026 Builder ID",
  shortName: "HH Goa 2026",
  edition: "Goa · 2026",
  hashtag: "FrameInGoa",
  shareText:
    "Built my HH Goa Builder ID 🚀\n\n#FrameInGoa",
  downloadFileName: "hh-goa-builder-id.png",
  outputSize: 1080,
  /** Maximum upload size in bytes (12 MB). */
  maxUploadBytes: 12 * 1024 * 1024,
  /** Allowed MIME types in the file picker. */
  acceptedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ] as const,
  /** Allowed file extensions for the picker accept attr (lowercase, with dot). */
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"] as const,
  /** localStorage key for the persisted draft. */
  storageKey: "hh-goa-2026:builder-id-draft:v2",
  /** Twitter / X username used in the share intent `via` param. */
  twitterHandle: "hhgoa",
} as const;

/** Twitter share URL with prefilled text. */
export function buildTwitterShareUrl(text: string): string {
  const params = new URLSearchParams({
    text,
    hashtags: APP_CONFIG.hashtag,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * 100+ unique, original Builder Titles. Hand-crafted for the HH Goa
 * builder/hacker/startup vibe. The generator pulls from this list without
 * immediately repeating.
 */
export const BUILDER_TITLES: readonly string[] = [
  "AI Explorer",
  "Cloud Architect",
  "DevOps Ninja",
  "Startup Hacker",
  "Prompt Engineer",
  "Code Wizard",
  "Infrastructure Hacker",
  "Builder of Tomorrow",
  "Open Source Hero",
  "Full Stack Builder",
  "Automation Architect",
  "Cloud Native Builder",
  "ML Explorer",
  "Frontend Crafter",
  "Backend Architect",
  "Product Engineer",
  "Systems Sculptor",
  "Data Cartographer",
  "Edge Computing Pioneer",
  "Reliability Engineer",
  "Platform Builder",
  "Design Engineer",
  "DX Craftsperson",
  "WebGL Voyager",
  "Shader Alchemist",
  "Embedded Dreamer",
  "Kernel Tinkerer",
  "Protocol Designer",
  "API Strategist",
  "Database Whisperer",
  "Streaming Systems Lead",
  "Realtime Architect",
  "Search Engineer",
  "Recommendation Crafter",
  "Privacy Engineer",
  "Security Strategist",
  "Cryptography Tinkerer",
  "Zero Trust Builder",
  "DevEx Advocate",
  "Developer Relations Pilot",
  "Hackathon Veteran",
  "Indie Hacker",
  "Studio Founder",
  "Growth Engineer",
  "Lifecycle Crafter",
  "Onboarding Architect",
  "Pricing Hacker",
  "Brand Technologist",
  "Community Builder",
  "Education Engineer",
  "Docs Cartographer",
  "Knowledge Architect",
  "Workflow Automator",
  "No Code Pioneer",
  "Low Code Strategist",
  "Visual Builder",
  "Creative Technologist",
  "Generative Artist",
  "Synthetic Media Maker",
  "Voice UX Crafter",
  "Conversational Designer",
  "Multimodal Engineer",
  "On-Device ML Hacker",
  "Federated Learning Lead",
  "Eval Engineer",
  "LLM Toolsmith",
  "Agent Architect",
  "RAG Strategist",
  "Vector DB Engineer",
  "Embeddings Crafter",
  "Fine Tune Pilot",
  "Inference Optimizer",
  "Model Compiler",
  "Quantization Hacker",
  "Silicon Whisperer",
  "GPU Scheduler",
  "Distributed Systems Lead",
  "Consensus Engineer",
  "Edge Cache Strategist",
  "CDN Architect",
  "Observability Builder",
  "Telemetry Crafter",
  "Incident Commander",
  "SRE Pathfinder",
  "Chaos Engineer",
  "Performance Hunter",
  "Core Web Vitals Lead",
  "Accessibility Advocate",
  "Inclusive Designer",
  "Motion Engineer",
  "3D Web Architect",
  "Spatial Computing Builder",
  "XR Pioneer",
  "Metaverse Cartographer",
  "Game Backend Builder",
  "Multiplayer Engineer",
  "Physics Simulator",
  "Procedural Generation Lead",
  "Pixel Crafter",
  "Typeface Hacker",
  "Type System Architect",
  "DSL Designer",
  "Compiler Engineer",
  "Runtime Builder",
  "Sandbox Architect",
  "WASM Voyager",
  "Container Crafter",
  "Orchestrator Pilot",
  "GitOps Strategist",
  "Infrastructure as Code Lead",
  "Policy Engineer",
  "FinOps Architect",
  "Carbon Aware Builder",
  "Sustainable Engineer",
  "Future of Work Hacker",
] as const;

/** Builder levels with rarity styling (used for the badge colour + QR accent). */
export const BUILDER_LEVELS: Record<BuilderLevel, LevelDefinition> = {
  bronze: {
    id: "bronze",
    label: "Bronze",
    gradient: ["#C97A3A", "#8A4F22"],
    hex: "#C97A3A",
    glow: "0 0 24px rgba(201, 122, 58, 0.45)",
    rarity: "Builder",
  },
  silver: {
    id: "silver",
    label: "Silver",
    gradient: ["#C9CDD2", "#7C828A"],
    hex: "#9CA3AF",
    glow: "0 0 24px rgba(156, 163, 175, 0.45)",
    rarity: "Maker",
  },
  gold: {
    id: "gold",
    label: "Gold",
    gradient: ["#F5C04A", "#C9881C"],
    hex: "#E8A93A",
    glow: "0 0 28px rgba(232, 169, 58, 0.55)",
    rarity: "Architect",
  },
  platinum: {
    id: "platinum",
    label: "Platinum",
    gradient: ["#7AE7C7", "#1E8E73"],
    hex: "#46C7A6",
    glow: "0 0 32px rgba(70, 199, 166, 0.55)",
    rarity: "Founding Builder",
  },
} as const;

/** Ordered list of levels (lowest → highest). */
export const BUILDER_LEVEL_ORDER: BuilderLevel[] = ["bronze", "silver", "gold", "platinum"];

/** Random fun badges — the user gets one randomly per card. */
export const FUN_BADGES: readonly BadgeDefinition[] = [
  { id: "cloud-wizard", label: "Cloud Wizard", emoji: "☁️" },
  { id: "bug-hunter", label: "Bug Hunter", emoji: "🐛" },
  { id: "prompt-engineer", label: "Prompt Engineer", emoji: "✨" },
  { id: "pixel-crafter", label: "Pixel Crafter", emoji: "🎨" },
  { id: "night-builder", label: "Night Builder", emoji: "🌙" },
  { id: "coffee-compiler", label: "Coffee Compiler", emoji: "☕" },
  { id: "open-source-hero", label: "Open Source Hero", emoji: "🦸" },
  { id: "ship-it", label: "Ship It Sergeant", emoji: "🚀" },
  { id: "regex-ranger", label: "Regex Ranger", emoji: "🤠" },
  { id: "type-tamer", label: "Type Tamer", emoji: "🧬" },
  { id: "cache-crusher", label: "Cache Crusher", emoji: "💾" },
  { id: "logician", label: "Bit Whisperer", emoji: "0️⃣" },
] as const;

/** Common stacks shown as quick-pick chips. */
export const STACK_SUGGESTIONS: readonly string[] = [
  "Full Stack",
  "Frontend",
  "Backend",
  "AI / ML",
  "DevOps",
  "Mobile",
  "Design + Dev",
  "Web3",
  "Data",
  "Hardware",
] as const;

/** Smooth cubic-bezier presets reused across Framer Motion variants. */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  spring: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const,
  springSoft: { type: "spring", stiffness: 180, damping: 22, mass: 1 } as const,
} as const;

/**
 * Generate a unique Builder ID number (8 hex chars). Deterministic per
 * name+title+badge+timestamp seed so it's stable during a session but
 * feels unique per builder.
 */
export function generateBuilderId(seed: string): string {
  // Simple FNV-1a hash → first 8 hex chars
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Mix in current time for additional entropy
  hash ^= Date.now() & 0xffffffff;
  hash = Math.imul(hash, 0x01000193);
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `HHG-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}
