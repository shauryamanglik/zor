import { useMemo } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Dumbbell, Moon, Pill, Flame, ChevronRight, CalendarCheck, Check, Zap } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { Card, Ring } from "../shared/UI";
import { Pill as Tag } from "../shared/UI";
import { resolveDayPlan, targetsForDay } from "../../data/meals";
import { PROGRAM } from "../../data/workouts";
import { greeting, prettyDate, sumMacros, todayKey, isRestDay, haptic } from "../../lib/utils";

export default function Home({ setTab }) {
  const store = useStore();
  const { userName, meals, workouts, sessions, supplements, suppLog, accent } = store;
  const dk = todayKey();
  const isSunday = dk === "Sun";
  const rest = isRestDay(dk);

  const plan = resolveDayPlan(dk, store.mealOverrides);
  const targets = targetsForDay(dk, store.targets);
  const loggedToday = meals.filter((m) => m.date === store.todayISO);
  const totals = sumMacros(loggedToday);
  const session = rest ? null : PROGRAM[dk];

  const activeSupps = supplements.filter((s) => s.state === "active");
  const todaySuppLog = suppLog.filter((s) => s.date === store.todayISO).map((s) => s.supplement);

  const totalSessions = sessions.length;
  const proteinRemaining = Math.max(0, targets.p - totals.p);

  // Context-aware banner
  const banner = useMemo(() => {
    const h = new Date().getHours();
    const loggedSlots = loggedToday.map((m) => m.slot);
    if (isSunday && h >= 9 && h < 14) return { text: "Sunday prep powers your week. 7 tasks waiting.", action: () => setTab("food") };
    if (h >= 7 && h < 10 && !loggedSlots.includes("Breakfast")) return { text: `Breakfast time, ${userName}. Fuel up.`, action: () => setTab("food") };
    if (h >= 12 && h < 14 && !loggedSlots.includes("Lunch")) return { text: `Lunch time. ${plan.find((m) => m.slot === "Lunch")?.name || ""}`, action: () => setTab("food") };
    if (!rest && h >= 15 && h < 18 && !loggedSlots.includes("Pre-gym")) return { text: "Pre-gym shake soon. Gym's coming up.", action: () => setTab("food") };
    if (h >= 20 && proteinRemaining > 30) return { text: `${Math.round(proteinRemaining)}g protein left today, ${userName}. Don't fall short.`, action: () => setTab("food") };
    if (!rest && h >= 17 && h < 21) return { text: `${session?.name} today. Let's move.`, action: () => setTab("gym") };
    return null;
  }, [loggedToday, isSunday, rest, proteinRemaining, plan, session, userName, setTab]);

  // Weekly insight from last 7 days
  const insight = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    const recentSessions = sessions.filter((s) => new Date(s.date).getTime() >= cutoff);
    if (recentSessions.length >= 5) return `${recentSessions.length} sessions last week. Perfect work, ${userName}.`;
    if (recentSessions.length > 0) return `${recentSessions.length} sessions last week. Aim for 5.`;
    if (store.prs.length > 0) {
      const last = store.prs[store.prs.length - 1];
      return `Last PR: ${last.exercise} at ${last.weight} ${store.units}.`;
    }
    return "Log your first session to start tracking progress.";
  }, [sessions, store.prs, userName, store.units]);

  return (
    <div className="px-4 pt-4 pb-28 safe-top">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-ink-dim text-sm">{greeting()},</p>
          <h1 className="font-display text-3xl font-bold text-ink leading-tight">{userName}</h1>
          <p className="text-ink-faint text-xs mt-1">{prettyDate()}</p>
        </div>
        <button onClick={() => setTab("settings")} className="p-2 -mr-2"><SettingsIcon className="w-5 h-5 text-ink-dim" /></button>
      </div>

      {/* Context banner */}
      {banner && (
        <Card className="p-3.5 mb-3 border-gold/25 bg-gold/5" onClick={banner.action}>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-gold flex-shrink-0" />
            <p className="text-sm text-ink flex-1">{banner.text}</p>
            <ChevronRight className="w-4 h-4 text-ink-faint" />
          </div>
        </Card>
      )}

      {/* Macro rings with cycling label */}
      <Card className="p-4 mb-3" onClick={() => setTab("food")}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-display font-semibold text-sm">Today's Fuel</span>
          <span className="text-[11px] text-ink-dim tabular">{Math.round(totals.kcal)} / {targets.kcal} kcal</span>
        </div>
        <p className="text-[10px] text-gold mb-3">{rest ? "Rest day — lower carb target" : "Training day — higher carb target"}</p>
        <div className="flex justify-between">
          <Ring value={totals.p} max={targets.p} label="Protein" sub="g" color={accent} />
          <Ring value={totals.c} max={targets.c} label="Carbs" sub="g" color="#6BA4E0" />
          <Ring value={totals.f} max={targets.f} label="Fat" sub="g" color="#E0A84C" />
          <Ring value={totals.fiber} max={targets.fiber} label="Fiber" sub="g" color="#4CAF7D" />
        </div>
      </Card>

      {/* Session card */}
      {!isSunday && (rest ? (
        <Card className="p-4 mb-3 flex items-center gap-3">
          <div className="w-11 h-11 rounded-btn bg-surface-2 flex items-center justify-center"><Moon className="w-5 h-5 text-ink-dim" /></div>
          <div><p className="font-display font-semibold">Rest Day</p><p className="text-xs text-ink-dim">Recovery is when muscle grows.</p></div>
        </Card>
      ) : (
        <Card className="p-4 mb-3" onClick={() => setTab("gym")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-btn bg-gold/15 flex items-center justify-center"><Dumbbell className="w-5 h-5 text-gold" /></div>
              <div><p className="font-display font-semibold">{session.name}</p><p className="text-xs text-ink-dim">{session.sub}</p></div>
            </div>
            <ChevronRight className="w-5 h-5 text-ink-faint" />
          </div>
        </Card>
      ))}

      {isSunday && (
        <Card className="p-4 mb-3" onClick={() => setTab("food")}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-btn bg-gold/15 flex items-center justify-center"><CalendarCheck className="w-5 h-5 text-gold" /></div>
            <div><p className="font-display font-semibold">Sunday — Prep Day</p><p className="text-xs text-ink-dim">7 tasks power your whole week.</p></div>
          </div>
        </Card>
      )}

      {/* Meals strip with quick-log */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-display font-semibold text-sm">Today's Meals</span>
          <button onClick={() => setTab("food")} className="text-[11px] text-gold">View all</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {plan.map((m) => {
            const logged = loggedToday.find((x) => x.slot === m.slot);
            return (
              <div key={m.id} className={`min-w-[140px] p-3 rounded-card border ${logged ? "border-gold/40 bg-gold/5" : "border-line bg-surface"}`}>
                <p className="text-[10px] text-ink-dim uppercase tracking-wide">{m.slot}</p>
                <p className="text-xs font-medium mt-1 leading-tight line-clamp-2 h-8">{m.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gold tabular font-semibold">{m.macros.p}g</span>
                  {logged ? <Tag color="gold">Logged</Tag> : !m.isCheat && !m.isRest && (
                    <button onClick={() => { haptic("success"); store.logMeal(m); }} className="w-6 h-6 rounded-full border border-line flex items-center justify-center active:border-gold active:scale-90 transition">
                      <Check className="w-3.5 h-3.5 text-ink-faint" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplements */}
      <Card className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-3"><Pill className="w-4 h-4 text-gold" /><span className="font-display font-semibold text-sm">Supplements</span></div>
        {activeSupps.length === 0 ? (
          <p className="text-xs text-ink-dim">No active supplements yet. Add them in Settings.</p>
        ) : (
          <div className="space-y-2">
            {activeSupps.map((s) => {
              const taken = todaySuppLog.includes(s.name);
              return (
                <button key={s.id} onClick={() => taken ? store.unlogSupplement(s.name) : store.logSupplement(s.name)} className="w-full flex items-center justify-between py-1.5">
                  <span className={`text-sm ${taken ? "text-ink-faint line-through" : "text-ink"}`}>{s.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${taken ? "bg-gold border-gold" : "border-line"}`}>{taken && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Insight */}
      <Card className="p-4 mb-3 flex items-center gap-3">
        <Flame className="w-5 h-5 text-gold flex-shrink-0" />
        <p className="text-sm text-ink-dim flex-1">{insight}</p>
      </Card>

      {/* Stats */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><p className="font-display text-2xl font-bold text-gold tabular">{totalSessions}</p><p className="text-[10px] text-ink-dim">Sessions</p></div>
          <div><p className="font-display text-2xl font-bold text-gold tabular">{store.prs.length}</p><p className="text-[10px] text-ink-dim">PRs Set</p></div>
          <div><p className="font-display text-2xl font-bold text-gold tabular">{store.bodyStats.length}</p><p className="text-[10px] text-ink-dim">Weigh-ins</p></div>
        </div>
      </Card>
    </div>
  );
}
