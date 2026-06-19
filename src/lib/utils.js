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
  const map = { light: 8, medium: 18, heavy: [25, 30, 25], success: [12, 40, 12] };
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

export function lbsToKg(lbs) {
  return Math.round(lbs * 0.4536 * 10) / 10;
}
export function kgToLbs(kg) {
  return Math.round(kg / 0.4536);
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

// Smart progressive overload using last few sessions of an exercise.
// history = array of {weight, reps, date} for one exercise, newest last.
export function overloadAdvice(history, targetReps, kind) {
  if (!history || !history.length) return null;
  const last = history[history.length - 1];
  const daysSince = (Date.now() - new Date(last.date).getTime()) / 86400000;
  if (daysSince > 10) {
    return { msg: "Back after a break — start ~10% lighter and build up.", suggest: Math.round(last.weight * 0.9) };
  }
  // Look at the last up-to-3 top sets
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
