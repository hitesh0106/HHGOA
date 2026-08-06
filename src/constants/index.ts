import type { FaqItem, FeatureItem, ExampleItem } from "@/types";

/**
 * Central application configuration. Single source of truth for tunable
 * constants so the rest of the app stays declarative.
 */
export const APP_CONFIG = {
  name: "HH Goa 2026 Builder Generator",
  shortName: "HH Goa 2026",
  edition: "Goa · 2026",
  hashtag: "FrameInGoa",
  shareText:
    "Excited to build at HH Goa 2026 🚀\n\nJust created my Builder Identity.\n\n#FrameInGoa",
  downloadFileName: "hh-goa-builder-card.png",
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
  storageKey: "hh-goa-2026:draft:v1",
  /** Twitter / X username for the share intent target (used in via param). */
  twitterHandle: "hhgoa",
} as const;

/** Twitter share URL with prefilled text. */
export function buildTwitterShareUrl(text: string): string {
  const params = new URLSearchParams({
    text,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * 100+ unique, original Builder Titles. Carefully curated to feel fresh,
 * non-repetitive, and aligned with the HH Goa builder/hacker/startup vibe.
 * The generator pulls from this list without immediately repeating.
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

/** Feature cards rendered under the hero. */
export const FEATURES: readonly FeatureItem[] = [
  {
    icon: "zap",
    title: "Lightning Fast",
    description:
      "Everything renders locally in your browser. No upload round-trip, no waiting — your card is ready in under a second.",
  },
  {
    icon: "smartphone",
    title: "Mobile First",
    description:
      "Built for one-handed use. Drag to crop, pinch to zoom, then download straight from your phone camera roll flow.",
  },
  {
    icon: "user-x",
    title: "No Login",
    description:
      "No accounts, no email walls, no tracking pixels. Open the page, upload a photo, and walk away with a polished PNG.",
  },
  {
    icon: "download",
    title: "Instant Download",
    description:
      "Export a retina-ready 1080×1080 PNG. Optimised for X, Instagram, LinkedIn and the HH Goa community thread.",
  },
] as const;

/** Frequently asked questions for the FAQ accordion. */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    q: "Is this an official HH Goa product?",
    a: "No. This is an independent Builder Identity generator inspired by the HH Goa 2026 builder/hacker/startup festival mood. The palette, layout, illustration style and typography are original creations made for this project.",
  },
  {
    q: "Where does my photo go?",
    a: "Nowhere. Your photo is processed entirely in your browser. It is never uploaded to any server, never stored in any database, and never leaves your device. Closing the tab wipes everything except the optional local draft you choose to remember.",
  },
  {
    q: "What image formats can I upload?",
    a: "JPG, JPEG, PNG, WEBP and HEIC are all supported. HEIC files from iPhones are automatically converted in-browser using heic2any, so you can shoot directly from your camera and drop the file in.",
  },
  {
    q: "What resolution do I get?",
    a: "Every export is a 1080×1080 PNG at retina quality. That is the sweet spot for X, Instagram and LinkedIn previews — sharp on mobile, clean on retina displays, with no compression artifacts.",
  },
  {
    q: "Can I generate a different Builder Title?",
    a: "Yes. There are 100+ original Builder Titles in the pool. Hit the refresh button as many times as you like — the generator never repeats the previous title, so every click feels fresh.",
  },
  {
    q: "How do I share my card on X?",
    a: "Hit the Share to X button. It opens a pre-filled tweet with the text 'Excited to build at HH Goa 2026 🚀 — Just created my Builder Identity.' and the #FrameInGoa hashtag. Attach the PNG you just downloaded and post.",
  },
  {
    q: "Will it remember my details?",
    a: "Only if you let it. We optionally persist your name, role, last Builder Title and a tiny thumbnail of your photo to localStorage on your device. Clear your browser storage or hit the reset button to wipe everything instantly.",
  },
  {
    q: "Does it work offline?",
    a: "After the first load the app is cached and works without a network. Image processing, cropping, title generation and PNG export are all client-side. The only network call is the initial page load.",
  },
] as const;

/** Example cards shown in the Examples section. */
export const EXAMPLES: readonly ExampleItem[] = [
  {
    id: "ex-1",
    name: "Aria Mehra",
    role: "AI · LLM Tooling",
    builderTitle: "Prompt Engineer",
    initials: "AM",
    gradient: "from-emerald to-gold",
  },
  {
    id: "ex-2",
    name: "Devansh Kothari",
    role: "Cloud · Kubernetes",
    builderTitle: "Cloud Native Builder",
    initials: "DK",
    gradient: "from-emerald-deep to-emerald-soft",
  },
  {
    id: "ex-3",
    name: "Ishita Rao",
    role: "Frontend · Motion",
    builderTitle: "Frontend Crafter",
    initials: "IR",
    gradient: "from-coral to-gold",
  },
  {
    id: "ex-4",
    name: "Kabir Nadar",
    role: "DevOps · Platform",
    builderTitle: "Infrastructure Hacker",
    initials: "KN",
    gradient: "from-gold-deep to-emerald",
  },
  {
    id: "ex-5",
    name: "Sana Fernandes",
    role: "ML · Evaluation",
    builderTitle: "Eval Engineer",
    initials: "SF",
    gradient: "from-emerald-soft to-coral",
  },
  {
    id: "ex-6",
    name: "Rey Coutinho",
    role: "Product · Growth",
    builderTitle: "Builder of Tomorrow",
    initials: "RC",
    gradient: "from-coral-deep to-gold-deep",
  },
] as const;

/** Smooth cubic-bezier presets reused across Framer Motion variants. */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  spring: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const,
} as const;
