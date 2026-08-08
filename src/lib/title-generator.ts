/**
 * Stack-aware Builder Title generator.
 *
 * Generates creative, event-worthy titles based on the user's stack/role.
 * Each click produces a different title while staying relevant to the same
 * stack. Titles are 2-4 words, fun, and avoid generic terms like
 * "Developer" or "Engineer".
 */

/** Title pool keyed by stack keyword. Lowercased keys for matching. */
const TITLE_POOLS: Record<string, string[]> = {
  devops: [
    "Pipeline Commander",
    "Cloud Orchestrator",
    "Deployment Wizard",
    "Infrastructure Architect",
    "Release Conductor",
    "Automation Strategist",
    "Container Whisperer",
    "Site Reliability Pilot",
    "Platform Choreographer",
    "Zero Downtime Architect",
  ],
  frontend: [
    "Pixel Crafter",
    "UI Visionary",
    "Motion Architect",
    "Component Sculptor",
    "Design Engineer",
    "Interface Cartographer",
    "WebGL Voyager",
    "Accessibility Advocate",
    "Render Optimizer",
    "Visual Systems Lead",
  ],
  backend: [
    "API Whisperer",
    "System Weaver",
    "Database Architect",
    "Service Composer",
    "Latency Hunter",
    "Schema Sculptor",
    "Protocol Designer",
    "Concurrency Crafter",
    "Data Plumber Extraordinaire",
    "Microservices Maestro",
  ],
  ai: [
    "Prompt Architect",
    "Neural Explorer",
    "Model Whisperer",
    "Eval Engineer",
    "Agent Strategist",
    "Inference Optimizer",
    "Token Cartographer",
    "Embedding Crafter",
    "Fine Tune Pilot",
    "Multimodal Pioneer",
  ],
  ml: [
    "Model Whisperer",
    "Data Cartographer",
    "Feature Sculptor",
    "Training Pipeline Lead",
    "Inference Architect",
    "Eval Engineer",
    "Neural Explorer",
    "Quantization Hacker",
    "On-Device ML Pilot",
    "Recommendation Crafter",
  ],
  cloud: [
    "Cloud Pathfinder",
    "Infrastructure Pilot",
    "Platform Builder",
    "Edge Computing Pioneer",
    "Multi Cloud Strategist",
    "Serverless Architect",
    "Container Orchestrator",
    "Cloud Native Builder",
    "FinOps Strategist",
    "Zero Trust Engineer",
  ],
  fullstack: [
    "Full Stack Builder",
    "Product Engineer",
    "End to End Architect",
    "Studio Founder",
    "Indie Hacker",
    "DX Craftsperson",
    "Ship It Sergeant",
    "Builder of Tomorrow",
    "Stack Agnostic Pilot",
    "Vertical Slicer",
  ],
  full: [
    "Full Stack Builder",
    "Product Engineer",
    "End to End Architect",
    "Studio Founder",
    "Indie Hacker",
    "DX Craftsperson",
    "Ship It Sergeant",
    "Builder of Tomorrow",
    "Stack Agnostic Pilot",
    "Vertical Slicer",
  ],
  mobile: [
    "Mobile Crafter",
    "App Architect",
    "Pocket Interface Designer",
    "Cross Platform Pilot",
    "Native Whisperer",
    "Touch Flow Engineer",
    "Offline First Builder",
    "Mobile Performance Hunter",
    "Device Cartographer",
    "Reactive UI Sculptor",
  ],
  web3: [
    "On Chain Architect",
    "Smart Contract Crafter",
    "Token Economist",
    "Protocol Designer",
    "Decentralized Builder",
    "Wallet UX Pilot",
    "Consensus Explorer",
    "DAO Strategist",
    "L2 Voyager",
    "Zero Knowledge Tinkerer",
  ],
  data: [
    "Data Cartographer",
    "Pipeline Architect",
    "Insight Crafter",
    "Warehouse Builder",
    "Stream Processing Lead",
    "Analytics Strategist",
    "ETL Choreographer",
    "Data Quality Pilot",
    "Lake House Architect",
    "Realtime Data Weaver",
  ],
  design: [
    "Design Engineer",
    "Pixel Crafter",
    "UI Visionary",
    "Motion Architect",
    "Brand Technologist",
    "Visual Systems Lead",
    "Creative Technologist",
    "Interaction Sculptor",
    "Accessibility Advocate",
    "Design Ops Pilot",
  ],
  hardware: [
    "Silicon Whisperer",
    "Embedded Dreamer",
    "Kernel Tinkerer",
    "Firmware Architect",
    "Edge Device Builder",
    "IoT Crafter",
    "Robotics Pilot",
    "Sensor Strategist",
    "Board Architect",
    "Realtime Systems Lead",
  ],
  security: [
    "Security Strategist",
    "Zero Trust Builder",
    "Cryptography Tinkerer",
    "Threat Hunter",
    "AppSec Architect",
    "Identity Engineer",
    "Pen Test Pilot",
    "SOC Crafter",
    "Privacy Engineer",
    "Bug Bounty Hunter",
  ],
};

/** Fallback pool for stacks that don't match any keyword. */
const FALLBACK_POOL: string[] = [
  "Builder of Tomorrow",
  "Code Wizard",
  "Startup Hacker",
  "Product Engineer",
  "Open Source Hero",
  "Builder of Tomorrow",
  "DX Craftsperson",
  "Ship It Sergeant",
  "Creative Technologist",
  "Studio Founder",
];

/**
 * Detect which stack pool to use based on the role string.
 * Returns the matching pool (or fallback).
 */
function detectPool(role: string): string[] {
  const r = role.toLowerCase();
  for (const keyword of Object.keys(TITLE_POOLS)) {
    if (r.includes(keyword)) {
      return TITLE_POOLS[keyword];
    }
  }
  return FALLBACK_POOL;
}

/**
 * Pick a random item from an array, optionally avoiding a previous value.
 */
function pickRandom<T>(items: readonly T[], avoid?: T): T {
  if (items.length === 0) throw new Error("pickRandom: empty array");
  if (items.length === 1) return items[0];
  let pick = items[Math.floor(Math.random() * items.length)];
  let guard = 0;
  while (avoid !== undefined && pick === avoid && guard < 12) {
    pick = items[Math.floor(Math.random() * items.length)];
    guard++;
  }
  return pick;
}

/**
 * Generate a creative Builder Title based on the stack/role.
 *
 * @param role The user's stack/role string (e.g. "DevOps", "Frontend · AI")
 * @param avoid Optional previous title to avoid repeating.
 * @returns A 2-4 word creative title.
 */
export function generateBuilderTitle(role: string, avoid?: string): string {
  const pool = detectPool(role);
  return pickRandom(pool, avoid);
}

/**
 * Generate a unique builder title based on name + role seed.
 * This is deterministic per seed so the same input always produces the
 * same title (used for the share link encoding).
 */
export function generateSeededTitle(name: string, role: string): string {
  const pool = detectPool(role);
  // Simple hash from name+role → index
  const seed = `${name}|${role}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}
