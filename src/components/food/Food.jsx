import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Check, RefreshCw, Plus, ChevronRight, ShoppingCart, ClipboardList, Search, BookOpen, Ban, Coffee, UtensilsCrossed, X, Clock, Apple, Minus } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { Card, Pill as Tag, Button, Sheet, Stepper } from "../shared/UI";
import { resolveDayPlan, targetsForDay, mealsForSlot, STAPLES, DRINKS, DAY_KEYS, mealComponents, SUBSTITUTIONS, MEAL_PLAN } from "../../data/meals";
import { QUICK_CATEGORIES, QUICK_FOODS, SIZE_PRESETS, DRINK_VESSELS, searchQuickFoods, computeQuickMacros } from "../../data/quickfoods";
import { PREP_TASKS } from "../../data/workouts";
import { sumMacros, todayKey, haptic, todayISO } from "../../lib/utils";

// Map the current clock time to the most sensible meal slot for an extra.
function slotForNow(d = new Date()) {
  const h = d.getHours();
  if (h < 10) return "Breakfast";
  if (h < 12) return "Snack";
  if (h < 15) return "Lunch";
  if (h < 17) return "Pre-gym";
  if (h < 19) return "Snack";
  if (h < 22) return "Dinner";
  return "Snack";
}

// Weighted distance between two macro profiles. Protein matters most, then
// calories, then carbs/fat. Lower is closer.
function macroDist(a, t) {
  return Math.abs((a.p || 0) - (t.p || 0)) * 3
    + Math.abs((a.kcal || 0) - (t.kcal || 0)) * 0.1
    + Math.abs((a.c || 0) - (t.c || 0))
    + Math.abs((a.f || 0) - (t.f || 0));
}

export default function Food() {
  const store = useStore();
  const [day, setDay] = useState(todayKey());
  const [view, setView] = useState("plan");
  const [recipeMeal, setRecipeMeal] = useState(null);
  const [swapMeal, setSwapMeal] = useState(null);
  const [customSlot, setCustomSlot] = useState(null);
  const [partialMeal, setPartialMeal] = useState(null);
  const [cheatMeal, setCheatMeal] = useState(null);
  const [quickAdd, setQuickAdd] = useState(false);

  const plan = resolveDayPlan(day, store.mealOverrides);
  const targets = targetsForDay(day, store.targets);
  // Date for the selected day in the current week
  const selectedDate = useMemo(() => dateForDayKey(day), [day]);
  const loggedForDay = store.meals.filter((m) => m.date === selectedDate);
  const totals = sumMacros(loggedForDay);
  const isToday = day === todayKey();

  return (
    <div className="px-4 pt-4 pb-28 safe-top">
      <h1 className="font-display text-2xl font-bold mb-3">Food</h1>

      <div className="flex gap-2 mb-4">
        {[{ id: "plan", label: "Plan", icon: BookOpen }, { id: "grocery", label: "Grocery", icon: ShoppingCart }, { id: "prep", label: "Prep", icon: ClipboardList }].map((v) => (
          <button key={v.id} onClick={() => { haptic("light"); setView(v.id); }} className={`flex-1 py-2 rounded-btn text-xs font-medium flex items-center justify-center gap-1.5 border ${view === v.id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>
            <v.icon className="w-3.5 h-3.5" /> {v.label}
          </button>
        ))}
      </div>

      {view === "plan" && (
        <>
          <div className="flex gap-1.5 mb-4">
            {DAY_KEYS.map((d) => (
              <button key={d} onClick={() => { haptic("light"); setDay(d); }} className={`flex-1 py-2 rounded-btn text-xs font-semibold ${d === day ? "bg-gold text-bg" : d === todayKey() ? "bg-surface-2 text-gold border border-gold/30" : "bg-surface text-ink-dim border border-line"}`}>{d[0]}</button>
            ))}
          </div>

          <div className="space-y-2.5">
            {plan.map((m) => {
              const logged = loggedForDay.find((x) => x.slot === m.slot && !x.extraId);
              const slotExtras = loggedForDay.filter((x) => x.slot === m.slot && x.extraId);
              return (
                <div key={m.id}>
                  <MealCard
                    meal={m} logged={logged} isToday={isToday}
                    onLog={() => { haptic("success"); store.logMeal(m); }}
                    onUnlog={() => { haptic("light"); store.unlogMeal(selectedDate, m.slot); }}
                    onSwap={() => setSwapMeal(m)}
                    onRecipe={() => setRecipeMeal(m)}
                    onCustom={() => setCustomSlot(m.slot)}
                    onPartial={() => setPartialMeal(m)}
                    onCheat={() => setCheatMeal(m)}
                    onBan={() => { haptic("medium"); store.banMeal(m.id); }}
                  />
                  {slotExtras.map((x) => (
                    <div key={x.extraId} className="flex items-center gap-2 mt-1.5 ml-3 pl-3 border-l-2 border-gold/30">
                      <Apple className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-ink truncate">{x.meal}</p>
                        <p className="text-[9px] text-ink-dim">{x.time ? x.time + " · " : ""}{Math.round(x.kcal)} kcal · {x.protein}p</p>
                      </div>
                      <button onClick={() => { haptic("light"); store.unlogExtra(x.extraId, selectedDate); }} className="p-1 text-ink-faint active:text-danger"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <Card className="p-4 mt-4">
            <p className="font-display font-semibold text-sm mb-1">{isToday ? "Today's Totals" : `${day} Totals`}</p>
            <p className="text-[10px] text-gold mb-3">{day === "Fri" || day === "Sun" ? "Rest day target" : "Training day target"}</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <Macro label="Protein" v={totals.p} t={targets.p} />
              <Macro label="Carbs" v={totals.c} t={targets.c} />
              <Macro label="Fat" v={totals.f} t={targets.f} />
              <Macro label="Fiber" v={totals.fiber} t={targets.fiber} />
            </div>
            {isToday && <ProteinPace p={totals.p} target={targets.p} name={store.userName} />}
          </Card>
        </>
      )}

      {view === "grocery" && <Grocery />}
      {view === "prep" && <Prep />}

      <AnimatePresence>
        {recipeMeal && <Sheet open onClose={() => setRecipeMeal(null)} title={recipeMeal.name}><RecipeView meal={recipeMeal} /></Sheet>}
        {swapMeal && (
          <Sheet open onClose={() => setSwapMeal(null)} title={`Swap ${swapMeal.slot}`}>
            <SwapView meal={swapMeal} bannedIds={store.bannedMeals}
              onPickOnce={(alt) => { haptic("success"); store.logMeal({ ...alt, slot: swapMeal.slot }, "swapped"); setSwapMeal(null); }}
              onPickPermanent={(alt) => { haptic("medium"); store.overrideMeal(day, swapMeal.slot, alt); setSwapMeal(null); }}
            />
          </Sheet>
        )}
        {partialMeal && (
          <Sheet open onClose={() => setPartialMeal(null)} title={`Adjust ${partialMeal.name}`}>
            <PartialLog meal={partialMeal} onLog={(macros, note) => { haptic("success"); store.logCustomMeal(partialMeal.slot, `${partialMeal.name} (${note})`, macros); setPartialMeal(null); }} />
          </Sheet>
        )}
        {cheatMeal && (
          <Sheet open onClose={() => setCheatMeal(null)} title="Log cheat meal">
            <CheatLog onLog={(name, kcal, p) => { haptic("success"); store.logCustomMeal("Dinner", name || "Cheat meal", { p: p || 0, c: 0, f: 0, fiber: 0, kcal: kcal || 0 }); setCheatMeal(null); }} />
          </Sheet>
        )}
        {customSlot && (
          <Sheet open onClose={() => setCustomSlot(null)} title="Log food">
            <CustomLog onLog={(name, macros) => { haptic("success"); store.logCustomMeal(customSlot, name, macros); setCustomSlot(null); }} recentMeals={recentCustom(store.meals)} />
          </Sheet>
        )}
        {quickAdd && (
          <Sheet open onClose={() => setQuickAdd(false)} title="Quick add">
            <QuickAdd onLog={(slot, name, macros) => {
              haptic("success");
              store.logExtra(slot, name, macros);
              setQuickAdd(false);
            }} />
          </Sheet>
        )}
      </AnimatePresence>

      {/* Floating quick-add button: log a fruit, snack or drink anytime */}
      {view === "plan" && (
        <button
          onClick={() => { haptic("light"); setQuickAdd(true); }}
          className="fixed right-4 bottom-28 z-30 w-14 h-14 rounded-full bg-gold text-bg shadow-lg flex items-center justify-center active:scale-90 transition"
          style={{ boxShadow: "0 6px 20px rgba(201,168,76,0.4)" }}
          aria-label="Quick add food"
        >
          <Plus className="w-6 h-6" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

function dateForDayKey(dk) {
  const today = new Date();
  const todayIdx = today.getDay();
  const targetIdx = DAY_KEYS.indexOf(dk);
  const diff = targetIdx - todayIdx;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function recentCustom(meals) {
  const seen = new Set();
  const out = [];
  meals.slice().reverse().forEach((m) => {
    if (m.status === "custom" && !seen.has(m.meal)) { seen.add(m.meal); out.push(m); }
  });
  return out.slice(0, 6);
}

function MealCard({ meal, logged, isToday, onLog, onUnlog, onSwap, onRecipe, onCustom, onPartial, onCheat, onBan }) {
  const [menu, setMenu] = useState(false);
  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2" onClick={onRecipe}>
          <p className="text-[10px] text-ink-dim uppercase tracking-wide">{meal.slot}</p>
          <p className="font-medium text-sm mt-0.5 leading-tight">{logged?.status === "swapped" || logged?.status === "custom" ? logged.meal : meal.name}</p>
          {meal.isCheat ? <Tag color="gold">Cheat meal — enjoy it</Tag> : (
            <div className="flex gap-2 mt-1.5">
              <span className="text-[11px] text-gold tabular font-semibold">{(logged?.protein ?? meal.macros.p)}P</span>
              <span className="text-[11px] text-ink-dim tabular">{(logged?.carbs ?? meal.macros.c)}C</span>
              <span className="text-[11px] text-ink-dim tabular">{(logged?.fat ?? meal.macros.f)}F</span>
              <span className="text-[11px] text-ink-dim tabular">{(logged?.kcal ?? meal.macros.kcal)} kcal</span>
            </div>
          )}
        </div>
        {logged ? (
          <button onClick={onUnlog} className="flex flex-col items-center active:scale-90 transition">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center"><Check className="w-4 h-4 text-bg" strokeWidth={3} /></div>
            <span className="text-[9px] text-gold mt-1">{logged.status}</span>
          </button>
        ) : isToday && !meal.isCheat ? (
          <button onClick={onLog} className="w-8 h-8 rounded-full border-2 border-line flex items-center justify-center active:scale-90 active:border-gold transition"><Check className="w-4 h-4 text-ink-faint" /></button>
        ) : meal.isCheat && isToday ? (
          <button onClick={onCheat} className="text-[11px] text-gold border border-gold/30 rounded-btn px-2 py-1">Log</button>
        ) : null}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-line">
        <button onClick={onRecipe} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-1"><BookOpen className="w-3 h-3" /> Recipe</button>
        <button onClick={onSwap} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-1 border-l border-line"><RefreshCw className="w-3 h-3" /> Swap</button>
        {isToday && <button onClick={onPartial} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-1 border-l border-line"><UtensilsCrossed className="w-3 h-3" /> Ate part</button>}
        <button onClick={() => setMenu(!menu)} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-1 border-l border-line"><Plus className="w-3 h-3" /> More</button>
      </div>
      {menu && (
        <div className="mt-2 pt-2 border-t border-line flex gap-2">
          <button onClick={onCustom} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-1.5 bg-surface-2 rounded-btn"><Search className="w-3 h-3" /> Log something else</button>
          <button onClick={onBan} className="flex-1 text-[11px] text-danger flex items-center justify-center gap-1 py-1.5 bg-danger/10 rounded-btn"><Ban className="w-3 h-3" /> Never show this</button>
        </div>
      )}
    </Card>
  );
}

function Macro({ label, v, t }) {
  const pct = Math.min(100, Math.round((v / t) * 100));
  const hit = pct >= 90;
  return (
    <div>
      <p className={`font-display text-lg font-bold tabular ${hit ? "text-success" : "text-ink"}`}>{Math.round(v)}</p>
      <p className="text-[9px] text-ink-dim">{label}</p>
      <div className="h-1 bg-line rounded-full mt-1 overflow-hidden"><div className={`h-full rounded-full ${hit ? "bg-success" : "bg-gold"}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function ProteinPace({ p, target, name }) {
  const remaining = Math.max(0, target - p);
  const h = new Date().getHours();
  if (remaining === 0) return <p className="text-[11px] text-success mt-3 text-center">Protein target hit. Strong work, {name}.</p>;
  const expectedByNow = h < 10 ? 0.25 : h < 14 ? 0.5 : h < 19 ? 0.75 : 0.95;
  const behind = p < target * expectedByNow;
  return <p className={`text-[11px] mt-3 text-center ${behind ? "text-warn" : "text-ink-dim"}`}>{behind ? "Behind pace — " : ""}{Math.round(remaining)}g protein to go, {name}.</p>;
}

function RecipeView({ meal }) {
  const store = useStore();
  const key = `recipe-step-${meal.id}`;
  const [step, setStep] = useState(() => Number(sessionStorage.getItem(key)) || 0);
  const setAndSave = (s) => { setStep(s); sessionStorage.setItem(key, String(s)); };
  return (
    <div>
      {meal.ingredients?.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-2">Ingredients</p>
          <div className="flex flex-wrap gap-1.5">{meal.ingredients.map((i, x) => <span key={x} className="text-[11px] bg-surface-2 px-2 py-1 rounded-full text-ink-dim">{i}</span>)}</div>
        </div>
      )}
      <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-2">Steps</p>
      <div className="bg-surface-2 rounded-card p-4 min-h-[120px] flex flex-col">
        <div className="flex items-center gap-2 mb-3"><span className="font-display text-3xl font-bold text-gold tabular">{step + 1}</span><span className="text-[11px] text-ink-faint">/ {meal.recipe.length}</span></div>
        <p className="text-sm leading-relaxed flex-1">{meal.recipe[step]}</p>
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="ghost" className="flex-1" onClick={() => setAndSave(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
        <Button className="flex-1" onClick={() => setAndSave(Math.min(meal.recipe.length - 1, step + 1))} disabled={step === meal.recipe.length - 1}>Next Step</Button>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
        <div><p className="font-display font-bold text-gold tabular">{meal.macros.p}</p><p className="text-[9px] text-ink-dim">Protein</p></div>
        <div><p className="font-display font-bold tabular">{meal.macros.c}</p><p className="text-[9px] text-ink-dim">Carbs</p></div>
        <div><p className="font-display font-bold tabular">{meal.macros.f}</p><p className="text-[9px] text-ink-dim">Fat</p></div>
        <div><p className="font-display font-bold tabular">{meal.macros.kcal}</p><p className="text-[9px] text-ink-dim">Kcal</p></div>
      </div>
    </div>
  );
}

function SwapView({ meal, bannedIds, onPickOnce, onPickPermanent }) {
  const [scope, setScope] = useState("slot"); // slot | all
  const [q, setQ] = useState("");
  const [sortByMacros, setSortByMacros] = useState(false);

  const sameSlot = mealsForSlot(meal.slot, bannedIds).filter((a) => a.id !== meal.id);

  // All meals across every slot, deduped by name, minus banned and cheat/rest
  const allMeals = useMemo(() => {
    const out = [];
    Object.values(MEAL_PLAN).forEach((day) =>
      day.forEach((m) => {
        if (!m.isCheat && !m.isRest && m.id !== meal.id && !bannedIds.includes(m.id) && !out.find((x) => x.name === m.name)) out.push(m);
      })
    );
    return out;
  }, [meal.id, bannedIds]);

  const list = useMemo(() => {
    let base = (scope === "slot" ? sameSlot : allMeals).filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
    if (sortByMacros) {
      const t = meal.macros;
      base = [...base].sort((a, b) => macroDist(a.macros, t) - macroDist(b.macros, t));
    }
    return base;
  }, [scope, sameSlot, allMeals, q, sortByMacros, meal.macros]);

  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-dim mb-1">Swap {meal.slot}. "Just today" logs it now. "Always" replaces it permanently.</p>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { haptic("light"); setScope("slot"); }} className={`flex-1 py-2 rounded-btn text-xs font-medium border ${scope === "slot" ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>Same slot</button>
        <button onClick={() => { haptic("light"); setScope("all"); }} className={`flex-1 py-2 rounded-btn text-xs font-medium border ${scope === "all" ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>Any meal</button>
      </div>
      <button onClick={() => { haptic("light"); setSortByMacros(!sortByMacros); }} className={`w-full py-2 rounded-btn text-[11px] font-medium border mb-1 ${sortByMacros ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>
        {sortByMacros ? "✓ Sorted by closest macros" : "Sort by closest macros"}
      </button>
      {scope === "all" && (
        <div className="flex items-center gap-2 bg-surface-2 rounded-btn px-3 py-2 mb-1">
          <Search className="w-4 h-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any meal…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      )}
      {list.map((a) => (
        <Card key={a.id} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium">{a.name}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] text-ink-faint uppercase">{a.slot}</span>
                <span className="text-[11px] text-gold tabular">{a.macros.p}P</span>
                <span className="text-[11px] text-ink-dim tabular">{a.macros.c}C</span>
                <span className="text-[11px] text-ink-dim tabular">{a.macros.kcal} kcal</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onPickOnce(a)} className="flex-1 text-[11px] text-gold border border-gold/30 rounded-btn py-1.5">Just today</button>
            <button onClick={() => onPickPermanent(a)} className="flex-1 text-[11px] text-ink-dim border border-line rounded-btn py-1.5">Always</button>
          </div>
        </Card>
      ))}
      {list.length === 0 && <p className="text-xs text-ink-faint text-center py-4">No matches.</p>}
    </div>
  );
}

function PartialLog({ meal, onLog }) {
  const components = mealComponents(meal.id);

  // Fallback: meal has no component breakdown — simple all-or-nothing per ingredient (proportional, labeled honestly)
  if (!components) {
    const ingredients = meal.ingredients || [];
    const [inc, setInc] = useState(ingredients.reduce((a, i) => ({ ...a, [i]: true }), {}));
    const ratio = ingredients.length ? Object.values(inc).filter(Boolean).length / ingredients.length : 1;
    const adj = { p: Math.round(meal.macros.p * ratio), c: Math.round(meal.macros.c * ratio), f: Math.round(meal.macros.f * ratio), fiber: Math.round((meal.macros.fiber || 0) * ratio), kcal: Math.round(meal.macros.kcal * ratio) };
    return (
      <div>
        <p className="text-xs text-ink-dim mb-3">Uncheck what you skipped (rough estimate for this meal).</p>
        <div className="space-y-1.5 mb-4">
          {ingredients.map((i) => (
            <button key={i} onClick={() => setInc((s) => ({ ...s, [i]: !s[i] }))} className="w-full flex items-center justify-between p-2.5 rounded-btn bg-surface-2">
              <span className={`text-sm ${inc[i] ? "" : "text-ink-faint line-through"}`}>{i}</span>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${inc[i] ? "bg-gold border-gold" : "border-line"}`}>{inc[i] && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
            </button>
          ))}
        </div>
        <Button className="w-full" onClick={() => onLog(adj, "partial")}>Log this</Button>
      </div>
    );
  }

  // Accurate path: each component carries its own real macros. Sum only what's checked.
  const [inc, setInc] = useState(components.reduce((a, _, idx) => ({ ...a, [idx]: true }), {}));
  const total = components.reduce((acc, c, idx) => {
    if (!inc[idx]) return acc;
    return { p: acc.p + c.p, c: acc.c + c.c, f: acc.f + c.f, fiber: acc.fiber + (c.fiber || 0), kcal: acc.kcal + c.kcal };
  }, { p: 0, c: 0, f: 0, fiber: 0, kcal: 0 });
  const r = (n) => Math.round(n);

  return (
    <div>
      <p className="text-xs text-ink-dim mb-3">Check exactly what you ate. Each part keeps its own real macros — no proportional guessing.</p>
      <div className="space-y-1.5 mb-4">
        {components.map((c, idx) => (
          <button key={idx} onClick={() => { haptic("light"); setInc((s) => ({ ...s, [idx]: !s[idx] })); }} className="w-full flex items-center justify-between p-2.5 rounded-btn bg-surface-2">
            <div className="text-left">
              <span className={`text-sm ${inc[idx] ? "" : "text-ink-faint line-through"}`}>{c.name}</span>
              <span className="text-[10px] text-ink-dim block">{c.p}P · {c.c}C · {c.f}F · {c.kcal}kcal</span>
            </div>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${inc[idx] ? "bg-gold border-gold" : "border-line"}`}>{inc[idx] && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center mb-4">
        <div><p className="font-display font-bold text-gold tabular">{r(total.p)}</p><p className="text-[9px] text-ink-dim">Protein</p></div>
        <div><p className="font-display font-bold tabular">{r(total.c)}</p><p className="text-[9px] text-ink-dim">Carbs</p></div>
        <div><p className="font-display font-bold tabular">{r(total.f)}</p><p className="text-[9px] text-ink-dim">Fat</p></div>
        <div><p className="font-display font-bold tabular">{r(total.kcal)}</p><p className="text-[9px] text-ink-dim">Kcal</p></div>
      </div>
      <Button className="w-full" onClick={() => onLog({ p: r(total.p), c: r(total.c), f: r(total.f), fiber: r(total.fiber), kcal: r(total.kcal) }, "adjusted")}>Log what I ate</Button>
    </div>
  );
}

function CheatLog({ onLog }) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [p, setP] = useState("");
  return (
    <div>
      <p className="text-xs text-ink-dim mb-3">Just the basics. No macro breakdown needed — enjoy it, then log roughly.</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What did you eat? (e.g. pizza night)" className="w-full bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none mb-2" />
      <div className="flex gap-2 mb-4">
        <input value={kcal} onChange={(e) => setKcal(e.target.value)} type="number" inputMode="numeric" placeholder="Rough calories" className="flex-1 bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
        <input value={p} onChange={(e) => setP(e.target.value)} type="number" inputMode="numeric" placeholder="Protein (optional)" className="flex-1 bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
      </div>
      <Button className="w-full" onClick={() => onLog(name, Number(kcal), Number(p))}>Log it, no guilt</Button>
    </div>
  );
}

function CustomLog({ onLog, recentMeals }) {
  const [tab, setTab] = useState("search"); // search | drinks | out
  const [q, setQ] = useState("");
  const [portions, setPortions] = useState({});
  const results = STAPLES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  const [outName, setOutName] = useState("");
  const [outKcal, setOutKcal] = useState("");
  const [outP, setOutP] = useState("");

  const logStaple = (s) => {
    const mult = portions[s.name] || 1;
    onLog(`${s.name}${mult !== 1 ? ` ×${mult}` : ""}`, { p: Math.round(s.p * mult), c: Math.round(s.c * mult), f: Math.round(s.f * mult), fiber: Math.round((s.fiber || 0) * mult), kcal: Math.round(s.kcal * mult) });
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {[["search", "Foods"], ["drinks", "Drinks"], ["out", "Eating out"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-1.5 rounded-btn text-[11px] font-medium border ${tab === id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{label}</button>
        ))}
      </div>

      {tab === "search" && (
        <>
          {recentMeals?.length > 0 && !q && (
            <div className="mb-3">
              <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-1.5">Recent</p>
              <div className="space-y-1.5">
                {recentMeals.map((m, i) => (
                  <button key={i} onClick={() => onLog(m.meal, { p: Number(m.protein), c: Number(m.carbs), f: Number(m.fat), fiber: Number(m.fiber), kcal: Number(m.kcal) })} className="w-full text-left p-2.5 rounded-btn bg-surface-2 flex items-center justify-between">
                    <span className="text-sm">{m.meal}</span><span className="text-[11px] text-gold tabular">{m.protein}P · {m.kcal}kcal</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 bg-surface-2 rounded-btn px-3 py-2 mb-3">
            <Search className="w-4 h-4 text-ink-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search foods…" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {results.map((s) => {
              const mult = portions[s.name] || 1;
              return (
                <div key={s.name} className="p-2.5 rounded-btn bg-surface-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{s.name}</span>
                    <span className="text-[11px] text-gold tabular">{Math.round(s.p * mult)}P · {Math.round(s.kcal * mult)}kcal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <button onClick={() => setPortions((p) => ({ ...p, [s.name]: Math.max(0.5, mult - 0.5) }))} className="w-7 h-7 rounded bg-surface border border-line text-gold">−</button>
                      <span className="text-xs tabular w-8 text-center">{mult}×</span>
                      <button onClick={() => setPortions((p) => ({ ...p, [s.name]: mult + 0.5 }))} className="w-7 h-7 rounded bg-surface border border-line text-gold">+</button>
                    </div>
                    <button onClick={() => logStaple(s)} className="text-[11px] text-bg bg-gold rounded-btn px-3 py-1.5 font-medium">Log</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "drinks" && (
        <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
          {DRINKS.map((d) => (
            <button key={d.name} onClick={() => onLog(d.name, d)} className="w-full text-left p-2.5 rounded-btn bg-surface-2 flex items-center justify-between">
              <span className="text-sm flex items-center gap-2"><Coffee className="w-3.5 h-3.5 text-ink-faint" /> {d.name}</span>
              <span className="text-[11px] text-gold tabular">{d.p}P · {d.kcal}kcal</span>
            </button>
          ))}
        </div>
      )}

      {tab === "out" && (
        <div>
          <p className="text-xs text-ink-dim mb-3">Ate out? Just name it and rough numbers. No detail you won't know.</p>
          <input value={outName} onChange={(e) => setOutName(e.target.value)} placeholder="Restaurant / dish" className="w-full bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none mb-2" />
          <div className="flex gap-2 mb-4">
            <input value={outKcal} onChange={(e) => setOutKcal(e.target.value)} type="number" inputMode="numeric" placeholder="Rough calories" className="flex-1 bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
            <input value={outP} onChange={(e) => setOutP(e.target.value)} type="number" inputMode="numeric" placeholder="Protein (opt)" className="flex-1 bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
          </div>
          <Button className="w-full" disabled={!outName} onClick={() => onLog(outName, { p: Number(outP) || 0, c: 0, f: 0, fiber: 0, kcal: Number(outKcal) || 0 })}>Log meal</Button>
        </div>
      )}
    </div>
  );
}

function Grocery() {
  const store = useStore();
  // Dynamic: build from this week's resolved plan ingredients + coming-soon supplements
  const categories = useMemo(() => {
    const cats = {
      Protein: new Set(["Paneer 400-500g", "Eggs (18)", "Greek yogurt (2 tubs)", "Orgain protein", "Fairlife (3-4 bottles)", "Chickpeas (4 cans)", "Masoor dal (dry)"]),
      "Dairy / Fat": new Set(["Walnuts", "Almonds", "Ground flax", "Olive oil", "Butter"]),
      Carbs: new Set(["Ezekiel bread (2 loaves)", "Frozen paranthas", "Quinoa", "Brown rice", "Bananas (7)"]),
      Vegetables: new Set(["Spinach", "Mushrooms", "Bell peppers (3)", "Onions (3lb)", "Tomatoes (6-8)", "Cucumber (3-4)", "Carrots", "Broccoli", "Green chilies", "Ginger-garlic paste"]),
      Fruit: new Set(["Mixed berries (frozen)", "Apples (3)", "Oranges (2-3)"]),
      Pantry: new Set(["Chole masala", "Garam masala", "Chaat masala", "Kashmiri chili", "Amchur", "Besan", "Tamarind chutney", "Mint chutney", "Schezwan sauce", "Soy sauce", "Sriracha", "Crushed tomatoes", "Cinnamon"]),
      Supplements: new Set(store.supplements.filter((s) => s.state === "coming").map((s) => s.name)),
    };
    return Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, [...v]]));
  }, [store.supplements]);

  const [checked, setChecked] = useState({});
  const toggle = (item) => { haptic("light"); setChecked((c) => ({ ...c, [item]: !c[item] })); };

  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-dim">Auto-built from your weekly plan. Coming-soon supplements included.</p>
      {Object.entries(categories).map(([cat, items]) => items.length > 0 && (
        <div key={cat}>
          <p className="text-[11px] text-gold uppercase tracking-wide mb-2 font-semibold">{cat}</p>
          <Card className="divide-y divide-line">
            {items.map((item) => (
              <button key={item} onClick={() => toggle(item)} className="w-full flex items-center justify-between p-3">
                <span className={`text-sm ${checked[item] ? "text-ink-faint line-through" : "text-ink"}`}>{item}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked[item] ? "bg-gold border-gold" : "border-line"}`}>{checked[item] && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
              </button>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function Prep() {
  const store = useStore();
  const isSunday = todayKey() === "Sun";
  const doneToday = store.prepLog.filter((p) => p.date === store.todayISO).map((p) => p.task);
  const [done, setDone] = useState({});
  const [expanded, setExpanded] = useState(null);

  const toggle = (task) => { haptic("success"); setDone((d) => ({ ...d, [task.id]: !d[task.id] })); if (!done[task.id]) store.logPrep(task.task); };

  return (
    <div className="space-y-2.5">
      {!isSunday && <Card className="p-3 bg-surface-2/50"><p className="text-xs text-ink-dim">Prep is a Sunday ritual — run it any day. ~95 min, mostly passive, powers your whole week.</p></Card>}
      {PREP_TASKS.map((t) => {
        const isDone = done[t.id] || doneToday.includes(t.task);
        const isOpen = expanded === t.id;
        return (
          <Card key={t.id} className="p-3.5">
            <div className="flex items-start gap-3">
              <button onClick={() => toggle(t)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isDone ? "bg-gold border-gold" : "border-line"}`}>{isDone && <Check className="w-3.5 h-3.5 text-bg" strokeWidth={3} />}</button>
              <div className="flex-1" onClick={() => setExpanded(isOpen ? null : t.id)}>
                <div className="flex items-center justify-between">
                  <p className={`font-medium text-sm ${isDone ? "text-ink-faint line-through" : ""}`}>{t.task}</p>
                  <span className="text-[10px] text-ink-faint flex items-center gap-1"><Clock className="w-3 h-3" />{t.time}m</span>
                </div>
                <p className="text-[11px] text-gold mt-0.5">{t.qty}</p>
                <p className="text-[10px] text-ink-dim mt-1">Covers: {t.covers}</p>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-line">
                    <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-2">Steps</p>
                    <div className="space-y-1.5">
                      {t.steps.map((s, i) => (
                        <div key={i} className="flex gap-2"><span className="font-display text-xs font-bold text-gold tabular flex-shrink-0">{i + 1}</span><p className="text-xs leading-relaxed">{s}</p></div>
                      ))}
                    </div>
                    <div className="mt-3 p-2.5 bg-surface-2 rounded-btn"><p className="text-[10px] text-ink-dim"><span className="text-gold">Freshness:</span> {t.freshness}</p></div>
                  </div>
                )}
                {!isOpen && <p className="text-[10px] text-ink-faint mt-1">Tap for recipe</p>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── Quick Add: log a fruit, snack, drink, or extra with smart quantity ──
function QuickAdd({ onLog }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => searchQuickFoods(q, cat), [q, cat]);

  if (selected) {
    return <QuickAddDetail food={selected} onBack={() => setSelected(null)} onLog={onLog} />;
  }

  return (
    <div>
      <div className="flex items-center gap-2 bg-surface-2 rounded-btn px-3 py-2 mb-3">
        <Search className="w-4 h-4 text-ink-faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fruit, snack, drink..." className="flex-1 bg-transparent text-sm outline-none" autoFocus />
      </div>

      {!q.trim() && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
          {[{ id: "all", label: "All" }, ...QUICK_CATEGORIES].map((c) => (
            <button key={c.id} onClick={() => { haptic("light"); setCat(c.id); }} className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-btn border ${cat === c.id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{c.label}</button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-ink-faint mb-2">Lands in the slot that matches the time you log it. You can change it before saving.</p>

      <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
        {results.map((f) => (
          <button key={f.id} onClick={() => { haptic("light"); setSelected(f); }} className="w-full text-left p-3 rounded-btn bg-surface-2 flex items-center justify-between">
            <div>
              <p className="text-sm">{f.name}</p>
              <p className="text-[10px] text-ink-dim">{f.macros.kcal} kcal · {f.macros.p}p / {f.macros.c}c / {f.macros.f}f per {f.unit}</p>
            </div>
            <Plus className="w-4 h-4 text-gold flex-shrink-0" />
          </button>
        ))}
        {results.length === 0 && <p className="text-xs text-ink-dim text-center py-6">No matches. Try the Custom tab on a meal to log anything by hand.</p>}
      </div>
    </div>
  );
}

function QuickAddDetail({ food, onBack, onLog }) {
  const [count, setCount] = useState(1);
  const [sizeId, setSizeId] = useState(() => {
    if (food.unitType === "size") return (SIZE_PRESETS[food.sizeSet] || SIZE_PRESETS.default)[1].id;
    if (food.unitType === "glass") return DRINK_VESSELS[0].id;
    if (food.unitType === "count" && food.sizeSet) return (SIZE_PRESETS[food.sizeSet])[1].id;
    return null;
  });
  const [zeroSugar, setZeroSugar] = useState(!!food.homemadeSweet);
  const [slot, setSlot] = useState(slotForNow());

  // Resolve the active size multiplier.
  let sizeMult = 1;
  let sizeOptions = null;
  if (food.unitType === "size") { sizeOptions = SIZE_PRESETS[food.sizeSet] || SIZE_PRESETS.default; sizeMult = sizeOptions.find((s) => s.id === sizeId)?.mult ?? 1; }
  else if (food.unitType === "glass") { sizeOptions = DRINK_VESSELS; sizeMult = DRINK_VESSELS.find((s) => s.id === sizeId)?.mult ?? 1; }
  else if (food.unitType === "count" && food.sizeSet) { sizeOptions = SIZE_PRESETS[food.sizeSet]; sizeMult = sizeOptions.find((s) => s.id === sizeId)?.mult ?? 1; }

  const macros = computeQuickMacros(food, count, sizeMult, zeroSugar);
  const countStep = food.unitType === "serving" ? 0.5 : 1;

  const SLOTS = ["Breakfast", "Lunch", "Pre-gym", "Dinner", "Snack"];

  // Build a readable logged name, e.g. "2 plums (large)" or "Lemonade (glass)".
  const sizeLabel = sizeOptions?.find((s) => s.id === sizeId)?.label;
  const name = (() => {
    const base = food.name;
    const qtyTxt = food.unitType === "count" ? `${count} ${count === 1 ? food.unit : food.unit + "s"}` : `${count}× ${food.unit}`;
    const extras = [];
    if (sizeLabel && food.unitType !== "count") extras.push(sizeLabel);
    if (sizeLabel && food.unitType === "count") extras.push(sizeLabel);
    if (zeroSugar && food.homemadeSweet) extras.push("monk fruit");
    return `${base} · ${qtyTxt}${extras.length ? ` (${extras.join(", ")})` : ""}`;
  })();

  return (
    <div>
      <button onClick={onBack} className="text-[11px] text-gold mb-3 flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to search</button>

      <p className="font-display text-lg font-semibold mb-1">{food.name}</p>
      <p className="text-[11px] text-ink-dim mb-4">Per {food.unit}: {food.macros.kcal} kcal · {food.macros.p}p / {food.macros.c}c / {food.macros.f}f</p>

      {/* Quantity */}
      <p className="text-center text-[10px] text-ink-dim uppercase tracking-wide mb-1">
        {food.unitType === "count" ? `How many ${food.unit}s?` : "Quantity"}
      </p>
      <Stepper value={count} onChange={(v) => setCount(Math.max(countStep, v))} step={countStep} suffix={food.unitType === "count" ? food.unit + (count === 1 ? "" : "s") : food.unit} />

      {/* Size / vessel options */}
      {sizeOptions && (
        <div className="mt-4">
          <p className="text-[10px] text-ink-dim uppercase tracking-wide mb-2">{food.unitType === "glass" ? "Vessel" : "Size"}</p>
          <div className="flex gap-2 flex-wrap">
            {sizeOptions.map((s) => (
              <button key={s.id} onClick={() => { haptic("light"); setSizeId(s.id); }} className={`text-xs px-3 py-2 rounded-btn border ${sizeId === s.id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{s.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Homemade zero-sugar toggle */}
      {food.homemadeSweet && (
        <button onClick={() => { haptic("light"); setZeroSugar(!zeroSugar); }} className="flex items-center gap-2 w-full mt-4 text-[11px] text-ink-dim">
          <div className={`w-4 h-4 rounded border flex items-center justify-center ${zeroSugar ? "bg-gold border-gold" : "border-line"}`}>{zeroSugar && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
          Made at home with monk fruit / erythritol (no sugar)
        </button>
      )}

      {/* Slot picker */}
      <div className="mt-4">
        <p className="text-[10px] text-ink-dim uppercase tracking-wide mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Log to</p>
        <div className="flex gap-1.5 flex-wrap">
          {SLOTS.map((s) => (
            <button key={s} onClick={() => { haptic("light"); setSlot(s); }} className={`text-[11px] px-3 py-1.5 rounded-btn border ${slot === s ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Macro preview */}
      <div className="grid grid-cols-4 gap-2 mt-5 mb-4">
        {[["P", macros.p], ["C", macros.c], ["F", macros.f], ["kcal", macros.kcal]].map(([l, v]) => (
          <div key={l} className="bg-surface-2 rounded-btn py-2 text-center">
            <p className="font-display font-bold text-gold tabular text-sm">{v}</p>
            <p className="text-[9px] text-ink-dim">{l}</p>
          </div>
        ))}
      </div>

      <Button className="w-full" onClick={() => onLog(slot, name, macros)}>
        Log to {slot}
      </Button>
    </div>
  );
}
