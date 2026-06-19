import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import * as Sheets from "../lib/sheets";
import { CONFIG } from "../lib/config";
import { todayISO, todayKey } from "../lib/utils";
import { DEFAULT_REMINDERS } from "../lib/notifications";
import { SUPPLEMENTS } from "../data/workouts";
import { DAILY_TARGETS } from "../data/meals";

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

const LOCAL_KEY = "zor_local_state";
const QUEUE_KEY = "zor_sync_queue";

// Keep only the last N days of logs in localStorage to avoid bloat.
const LOCAL_DAYS = 30;

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  } catch {
    return {};
  }
}
function saveLocal(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("localStorage full", e);
  }
}
function cutoffISO() {
  const d = new Date();
  d.setDate(d.getDate() - LOCAL_DAYS);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_SCHEDULE = {
  Mon: "Push A", Tue: "Pull A", Wed: "Legs + Abs",
  Thu: "Push B", Fri: "Rest", Sat: "Pull B", Sun: "Rest",
};

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [onboarded, setOnboarded] = useState(false);
  const [hasUnsynced, setHasUnsynced] = useState(false);

  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [sessions, setSessions] = useState([]); // session summaries: date, name, duration, volume, rpe, notes
  const [prs, setPRs] = useState([]);
  const [bodyStats, setBodyStats] = useState([]);
  const [suppLog, setSuppLog] = useState([]);
  const [prepLog, setPrepLog] = useState([]);

  const [supplements, setSupplements] = useState(SUPPLEMENTS.map((s) => ({ ...s, state: "coming" })));
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [units, setUnits] = useState("lbs");
  const [accent, setAccent] = useState("#C9A84C");
  const [mealOverrides, setMealOverrides] = useState({});       // { "Wed-Lunch": {meal object} }
  const [bannedMeals, setBannedMeals] = useState([]);            // meal ids never to show
  const [exerciseOverrides, setExerciseOverrides] = useState({});// { exId: "New Exercise Name" }
  const [targets, setTargets] = useState(DAILY_TARGETS);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [gymTime, setGymTime] = useState({ weekday: "18:00", weekend: "17:00" });
  const [quietHours, setQuietHours] = useState({ on: false, start: "22:30", end: "06:30" });

  const queueRef = useRef(JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"));

  // ── Init ──
  useEffect(() => {
    const local = loadLocal();
    if (local.onboarded) setOnboarded(true);
    if (local.supplements) setSupplements(local.supplements);
    if (local.reminders) setReminders(local.reminders);
    if (local.units) setUnits(local.units);
    if (local.accent) setAccent(local.accent);
    if (local.mealOverrides) setMealOverrides(local.mealOverrides);
    if (local.bannedMeals) setBannedMeals(local.bannedMeals);
    if (local.exerciseOverrides) setExerciseOverrides(local.exerciseOverrides);
    if (local.targets) setTargets(local.targets);
    if (local.schedule) setSchedule(local.schedule);
    if (local.gymTime) setGymTime(local.gymTime);
    if (local.quietHours) setQuietHours(local.quietHours);
    if (local.meals) setMeals(local.meals);
    if (local.workouts) setWorkouts(local.workouts);
    if (local.sessions) setSessions(local.sessions);
    if (local.prs) setPRs(local.prs);
    if (local.bodyStats) setBodyStats(local.bodyStats);
    if (local.suppLog) setSuppLog(local.suppLog);
    if (local.prepLog) setPrepLog(local.prepLog);
    setHasUnsynced(queueRef.current.length > 0);

    (async () => {
      try {
        await Sheets.initGoogle();
        if (Sheets.isSignedIn()) {
          setSignedIn(true);
          await fullSync();
        }
      } catch (e) {
        console.warn("Google init failed", e);
      } finally {
        setReady(true);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // Persist local snapshot (trimmed to last 30 days for logs)
  useEffect(() => {
    const cut = cutoffISO();
    saveLocal({
      onboarded, supplements, reminders, units, accent,
      mealOverrides, bannedMeals, exerciseOverrides, targets, schedule, gymTime, quietHours,
      meals: meals.filter((m) => m.date >= cut),
      workouts: workouts.filter((w) => w.date >= cut),
      sessions: sessions.filter((s) => s.date >= cut),
      prs, bodyStats,
      suppLog: suppLog.filter((s) => s.date >= cut),
      prepLog: prepLog.filter((p) => p.date >= cut),
    });
  }, [onboarded, supplements, reminders, units, accent, mealOverrides, bannedMeals, exerciseOverrides, targets, schedule, gymTime, quietHours, meals, workouts, sessions, prs, bodyStats, suppLog, prepLog]);

  // ── Sync queue ──
  const persistQueue = () => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queueRef.current));
    setHasUnsynced(queueRef.current.length > 0);
  };

  const flushQueue = useCallback(async () => {
    if (!Sheets.isSignedIn() || !queueRef.current.length) return;
    const pending = [...queueRef.current];
    queueRef.current = [];
    persistQueue();
    for (const item of pending) {
      try {
        if (item.op === "append") await Sheets.appendRow(item.tab, item.row);
        else if (item.op === "overwrite") await Sheets.overwriteTab(item.tab, item.rows);
        else if (item.op === "setting") await Sheets.saveSetting(item.key, item.value);
      } catch (e) {
        queueRef.current.push(item);
        persistQueue();
        throw e;
      }
    }
  }, []);

  const enqueue = useCallback((item) => {
    queueRef.current.push(item);
    persistQueue();
    flushQueue().catch(() => {});
  }, [flushQueue]);

  // ── Full sync ──
  const fullSync = useCallback(async () => {
    if (!Sheets.isSignedIn()) return;
    setSyncing(true);
    try {
      await Sheets.ensureTabs();
      await flushQueue();
      const [dm, wk, ss, pr, bs, sl, pl, settings] = await Promise.all([
        Sheets.readTab("Daily_Meals"),
        Sheets.readTab("Workouts"),
        Sheets.readTab("Sessions"),
        Sheets.readTab("PRs"),
        Sheets.readTab("Body_Stats"),
        Sheets.readTab("Supplement_Log"),
        Sheets.readTab("Prep_Log"),
        Sheets.loadSettings(),
      ]);
      setMeals(dm);
      setWorkouts(wk);
      setSessions(ss);
      setPRs(pr);
      setBodyStats(bs);
      setSuppLog(sl);
      setPrepLog(pl);
      if (settings.supplements) setSupplements(settings.supplements);
      if (settings.reminders) setReminders(settings.reminders);
      if (settings.units) setUnits(settings.units);
      if (settings.accent) setAccent(settings.accent);
      if (settings.mealOverrides) setMealOverrides(settings.mealOverrides);
      if (settings.bannedMeals) setBannedMeals(settings.bannedMeals);
      if (settings.exerciseOverrides) setExerciseOverrides(settings.exerciseOverrides);
      if (settings.targets) setTargets(settings.targets);
      if (settings.schedule) setSchedule(settings.schedule);
      if (settings.gymTime) setGymTime(settings.gymTime);
      if (settings.quietHours) setQuietHours(settings.quietHours);
      if (settings.onboarded) setOnboarded(true);
      setLastSync(new Date());
    } catch (e) {
      console.warn("Sync error", e);
    } finally {
      setSyncing(false);
    }
  }, [flushQueue]);

  const connect = useCallback(async () => {
    await Sheets.signIn();
    setSignedIn(true);
    await fullSync();
  }, [fullSync]);

  const disconnect = useCallback(() => {
    Sheets.signOut();
    setSignedIn(false);
  }, []);

  // ── Meal actions ──
  // Meals are keyed by date+slot; we rewrite the whole Daily_Meals tab on
  // changes so unlogging actually removes rows (not just appends).
  const syncMeals = useCallback((nextMeals) => {
    enqueue({ op: "overwrite", tab: "Daily_Meals", rows: nextMeals });
  }, [enqueue]);

  const logMeal = useCallback((meal, status = "logged", dateISO) => {
    const date = dateISO || todayISO();
    setMeals((m) => {
      const next = [...m.filter((x) => !(x.date === date && x.slot === meal.slot)), {
        date, slot: meal.slot, meal: meal.name,
        protein: meal.macros.p, carbs: meal.macros.c, fat: meal.macros.f,
        fiber: meal.macros.fiber, kcal: meal.macros.kcal, status,
      }];
      syncMeals(next);
      return next;
    });
  }, [syncMeals]);

  const unlogMeal = useCallback((dateISO, slot) => {
    const date = dateISO || todayISO();
    setMeals((m) => {
      const next = m.filter((x) => !(x.date === date && x.slot === slot));
      syncMeals(next);
      return next;
    });
  }, [syncMeals]);

  const logCustomMeal = useCallback((slot, name, macros, dateISO) => {
    const date = dateISO || todayISO();
    setMeals((m) => {
      const next = [...m.filter((x) => !(x.date === date && x.slot === slot)), {
        date, slot, meal: name,
        protein: macros.p, carbs: macros.c, fat: macros.f,
        fiber: macros.fiber || 0, kcal: macros.kcal, status: "custom",
      }];
      syncMeals(next);
      return next;
    });
  }, [syncMeals]);

  // Permanently swap / ban a planned meal
  const overrideMeal = useCallback((dayKey, slot, newMeal) => {
    const next = { ...mealOverrides, [`${dayKey}-${slot}`]: newMeal };
    setMealOverrides(next);
    enqueue({ op: "setting", key: "mealOverrides", value: next });
  }, [mealOverrides, enqueue]);

  const banMeal = useCallback((mealId) => {
    const next = [...bannedMeals, mealId];
    setBannedMeals(next);
    enqueue({ op: "setting", key: "bannedMeals", value: next });
  }, [bannedMeals, enqueue]);

  // ── Workout actions ──
  const logSet = useCallback((session, exercise, setNum, weight, reps, unit, isPR, isWarmup) => {
    const row = {
      date: todayISO(), session, exercise, set: setNum,
      weight, reps, unit, pr: isPR ? "yes" : "", warmup: isWarmup ? "yes" : "",
    };
    setWorkouts((w) => [...w, row]);
    enqueue({ op: "append", tab: "Workouts", row });
    if (isPR && !isWarmup) {
      const prRow = { date: todayISO(), exercise, weight, reps, est1rm: Math.round(weight * (1 + reps / 30)) };
      setPRs((p) => [...p, prRow]);
      enqueue({ op: "append", tab: "PRs", row: prRow });
    }
  }, [enqueue]);

  const logSession = useCallback((summary) => {
    const row = { date: todayISO(), ...summary };
    setSessions((s) => [...s, row]);
    enqueue({ op: "append", tab: "Sessions", row });
  }, [enqueue]);

  const updateExerciseOverride = useCallback((exId, newName) => {
    const next = { ...exerciseOverrides, [exId]: newName };
    setExerciseOverrides(next);
    enqueue({ op: "setting", key: "exerciseOverrides", value: next });
  }, [exerciseOverrides, enqueue]);

  // ── Other logs ──
  const logBodyStat = useCallback((stat) => {
    const row = { date: todayISO(), ...stat };
    setBodyStats((b) => [...b, row]);
    enqueue({ op: "append", tab: "Body_Stats", row });
  }, [enqueue]);

  const logSupplement = useCallback((suppName) => {
    const row = { date: todayISO(), supplement: suppName, time: new Date().toLocaleTimeString() };
    setSuppLog((s) => [...s, row]);
    enqueue({ op: "append", tab: "Supplement_Log", row });
  }, [enqueue]);

  const unlogSupplement = useCallback((suppName) => {
    const date = todayISO();
    setSuppLog((s) => {
      const next = s.filter((x) => !(x.date === date && x.supplement === suppName));
      enqueue({ op: "overwrite", tab: "Supplement_Log", rows: next });
      return next;
    });
  }, [enqueue]);

  const logPrep = useCallback((task) => {
    const row = { date: todayISO(), task, completed: "yes" };
    setPrepLog((p) => [...p, row]);
    enqueue({ op: "append", tab: "Prep_Log", row });
  }, [enqueue]);

  // ── Settings persistence ──
  const persistSetting = useCallback((key, value) => {
    enqueue({ op: "setting", key, value });
  }, [enqueue]);

  const updateSupplements = useCallback((next) => { setSupplements(next); persistSetting("supplements", next); }, [persistSetting]);
  const updateReminders = useCallback((next) => { setReminders(next); persistSetting("reminders", next); }, [persistSetting]);
  const updateTargets = useCallback((next) => { setTargets(next); persistSetting("targets", next); }, [persistSetting]);
  const updateSchedule = useCallback((next) => { setSchedule(next); persistSetting("schedule", next); }, [persistSetting]);
  const updateGymTime = useCallback((next) => { setGymTime(next); persistSetting("gymTime", next); }, [persistSetting]);
  const updateQuietHours = useCallback((next) => { setQuietHours(next); persistSetting("quietHours", next); }, [persistSetting]);

  const finishOnboarding = useCallback((supps) => {
    setOnboarded(true);
    if (supps) setSupplements(supps);
    persistSetting("onboarded", true);
    if (supps) persistSetting("supplements", supps);
  }, [persistSetting]);

  const clearAllData = useCallback(async () => {
    setMeals([]); setWorkouts([]); setSessions([]); setPRs([]);
    setBodyStats([]); setSuppLog([]); setPrepLog([]);
    localStorage.removeItem(LOCAL_KEY);
    localStorage.removeItem(QUEUE_KEY);
    queueRef.current = [];
    setHasUnsynced(false);
    if (Sheets.isSignedIn()) {
      const tabs = ["Daily_Meals", "Workouts", "Sessions", "Body_Stats", "Supplement_Log", "Prep_Log", "PRs"];
      await Promise.all(tabs.map((t) => Sheets.overwriteTab(t, [])));
    }
  }, []);

  useEffect(() => {
    const on = () => flushQueue().catch(() => {});
    window.addEventListener("online", on);
    return () => window.removeEventListener("online", on);
  }, [flushQueue]);

  const value = {
    ready, signedIn, syncing, lastSync, onboarded, hasUnsynced,
    meals, workouts, sessions, prs, bodyStats, suppLog, prepLog,
    supplements, reminders, units, accent, mealOverrides, bannedMeals,
    exerciseOverrides, targets, schedule, gymTime, quietHours,
    connect, disconnect, fullSync, clearAllData,
    logMeal, unlogMeal, logCustomMeal, overrideMeal, banMeal,
    logSet, logSession, updateExerciseOverride,
    logBodyStat, logSupplement, unlogSupplement, logPrep,
    updateSupplements, updateReminders, updateTargets, updateSchedule,
    updateGymTime, updateQuietHours, finishOnboarding,
    setUnits: (u) => { setUnits(u); persistSetting("units", u); },
    setAccent: (a) => { setAccent(a); persistSetting("accent", a); },
    todayKey: todayKey(),
    todayISO: todayISO(),
    userName: CONFIG.USER_NAME,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
