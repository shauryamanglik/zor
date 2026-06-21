import { DAY_KEYS } from "../data/meals";

export function todayKey(d = new Date()) {
  return DAY_KEYS[d.getDay()];
}

export function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function prettyDate(d = new Date()) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function haptic(type = "light") {
  if (!("vibrate" in navigator)) return;
  const map = {
    light: 8,
    medium: 18,
    heavy: [25, 30, 25],
    success: [12, 40, 12],
    pr: [15, 50, 15, 50, 40],
    exerciseDone: [20, 40, 20],
    warn: [10, 30, 10],
  };
  navigator.vibrate(map[type] || 8);
}

export function sumMacros(meals) {
  return meals.reduce(
    (a, m) => ({
      p: a.p + (Number(m.protein ?? m.macros?.p) || 0),
      c: a.c + (Number(m.carbs ?? m.macros?.c) || 0),
      f: a.f + (Number(m.fat ?? m.macros?.f) || 0),
      fiber: a.fiber + (Number(m.fiber ?? m.macros?.fiber) || 0),
      kcal: a.kcal + (Number(m.kcal ?? m.macros?.kcal) || 0),
    }),
    { p: 0, c: 0, f: 0, fiber: 0, kcal: 0 }
  );
}

export function epley1rm(weight, reps) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

// ── Unit conversion ──────────────────────────────────────────────────
const LB_PER_KG = 2.2046226218;

export function lbsToKg(lbs) {
  return Math.round((lbs / LB_PER_KG) * 10) / 10;
}
export function kgToLbs(kg) {
  return Math.round(kg * LB_PER_KG);
}

// Convert a stored value (always kept in lbs internally) to the display unit.
export function toDisplayWeight(lbs, units) {
  if (units === "kg") return lbsToKg(lbs);
  return Math.round(lbs);
}
// Convert a display-unit value back to lbs for storage.
export function toStoredWeight(val, units) {
  if (units === "kg") return kgToLbs(val);
  return Math.round(val);
}

// The natural increment for a movement, expressed in the DISPLAY unit.
// lbs: compound +5, isolation +2.5, micro +1.
// kg:  compound +2.5, isolation +1.25, micro +0.5 - the real plate jumps.
export function weightStep(kind, units) {
  if (units === "kg") {
    if (kind === "compound") return 2.5;
    if (kind === "isolation") return 1.25;
    return 0.5;
  }
  if (kind === "compound") return 5;
  if (kind === "isolation") return 2.5;
  return 1;
}

export function isRestDay(dayKey) {
  return dayKey === "Fri" || dayKey === "Sun";
}

// Carb-cycling targets: gym days higher carb, rest days lower.
export function targetsForDay(base, dayKey) {
  if (isRestDay(dayKey)) {
    return { ...base, c: Math.round(base.c * 0.8), kcal: base.kcal - 150 };
  }
  return { ...base, c: Math.round(base.c * 1.14), kcal: base.kcal + 100 };
}

export function overloadAdvice(history, targetReps, kind) {
  if (!history || !history.length) return null;
  const last = history[history.length - 1];
  const daysSince = (Date.now() - new Date(last.date).getTime()) / 86400000;
  if (daysSince > 10) {
    return { msg: "Back after a break - start ~10% lighter and build up.", suggest: Math.round(last.weight * 0.9) };
  }
  const recent = history.slice(-3);
  const allHitReps = recent.every((s) => s.reps >= targetReps);
  const sameWeight = recent.length >= 2 && recent.every((s) => s.weight === last.weight);
  const step = kind === "compound" ? 5 : 2.5;
  if (allHitReps && sameWeight && recent.length >= 2) {
    return { msg: `You've hit all reps ${recent.length} sessions straight. Add ${step}.`, suggest: last.weight + step };
  }
  if (last.reps >= targetReps) {
    return { msg: `Hit your reps last time. Try +${step}.`, suggest: last.weight + step };
  }
  if (last.reps < targetReps - 2) {
    return { msg: "Stay at this weight and nail the reps.", suggest: last.weight };
  }
  return { msg: "Match or beat last session.", suggest: last.weight };
}

// ── Accent color ─────────────────────────────────────────────────────
// Recolors the whole app at runtime by setting CSS variables that the
// Tailwind `gold` token references (see tailwind.config.js). Stored value is
// the hex; we derive RGB triplets plus a dimmer and softer shade.
export function applyAccent(hex) {
  const { r, g, b } = hexToRgb(hex);
  const root = document.documentElement;
  root.style.setProperty("--accent-rgb", `${r} ${g} ${b}`);
  const dim = mix({ r, g, b }, { r: 0, g: 0, b: 0 }, 0.45);
  const soft = mix({ r, g, b }, { r: 255, g: 255, b: 255 }, 0.35);
  root.style.setProperty("--accent-dim-rgb", `${dim.r} ${dim.g} ${dim.b}`);
  root.style.setProperty("--accent-soft-rgb", `${soft.r} ${soft.g} ${soft.b}`);
  // Plain hex versions for SVG gradients / inline styles.
  root.style.setProperty("--zor-accent", hex);
  root.style.setProperty("--accent-dim", rgbToHex(dim));
  root.style.setProperty("--accent-soft", rgbToHex(soft));
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function mix(a, b, t) {
  return {
    r: Math.round(a.r * (1 - t) + b.r * t),
    g: Math.round(a.g * (1 - t) + b.g * t),
    b: Math.round(a.b * (1 - t) + b.b * t),
  };
}
