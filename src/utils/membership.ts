export type MembershipLevel = {
  /** Arabic display label */
  label: string;
  /** Emoji icon for badge */
  icon: string;
  /** Text / icon color */
  color: string;
  /** Chip background color */
  bg: string;
  /** Minimum streak days to reach this tier */
  minDays: number;
};

/**
 * Tiers sorted descending — find() returns the first qualifying tier.
 * All colors are pulled from the existing design system.
 */
const LEVELS: MembershipLevel[] = [
  //  180+ days — Champion (purple — distinct & premium)
  { minDays: 180, label: "بطل",      icon: "👑", color: "#7E57C2", bg: "rgba(126,87,194,0.13)"  },
  //  90–179 days — Premium (amber/gold — aspirational, already the legacy "عضو مميز" color)
  { minDays: 90,  label: "عضو مميز", icon: "⭐", color: "#D97706", bg: "rgba(217,119,6,0.13)"   },
  //  30–89 days — Committed (teal — primary brand color)
  { minDays: 30,  label: "ملتزم",    icon: "🔥", color: "#0D9488", bg: "rgba(13,148,136,0.13)"  },
  //  7–29 days — Active (blue — calm, encouraging)
  { minDays: 7,   label: "نشيط",     icon: "⚡", color: "#5B8CBF", bg: "rgba(91,140,191,0.13)"  },
  //  0–6 days — Beginner (warm gray — neutral, welcoming)
  { minDays: 0,   label: "مبتدئ",    icon: "🌱", color: "#78716C", bg: "rgba(120,113,108,0.13)" },
];

/**
 * Returns the membership level for a given streak count.
 * Handles null / undefined / 0 gracefully — always returns مبتدئ as fallback.
 */
export function getMembershipLevel(currentStreak: number | null | undefined): MembershipLevel {
  const streak = currentStreak ?? 0;
  return LEVELS.find(level => streak >= level.minDays) ?? LEVELS[LEVELS.length - 1];
}
