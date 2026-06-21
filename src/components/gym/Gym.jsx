import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Moon, ChevronRight, Info, Check, Trophy, TrendingUp,
  Calculator, Play, X, Flame, Pause, SkipForward, RefreshCw,
  ArrowLeftRight, Clock, Search, Plus, Timer, Footprints, Save,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";
import { useStore } from "../../hooks/useStore";
import { Card, Button, Stepper, Sheet, Pill as Tag, EmptyState } from "../shared/UI";
import { getExerciseGif } from "../../lib/exerciseGifs";
import { PROGRAM, WARMUPS } from "../../data/workouts";
import {
  ALL_EXERCISE_NAMES, LIBRARY, buildExercise, groupForMuscle, exercisesForGroup, libraryGroups,
} from "../../data/exerciseLibrary";
import { todayKey, isRestDay, haptic, epley1rm, weightStep, toDisplayWeight, toStoredWeight } from "../../lib/utils";

export default function Gym() {
  const store = useStore();
  const dk = todayKey();
  const scheduledRest = isRestDay(dk);
  const [mode, setMode] = useState("overview");
  const [pickedDay, setPickedDay] = useState(null);
  const activeKey = pickedDay || (scheduledRest ? null : dk);
  const session = activeKey ? PROGRAM[activeKey] : null;

  const [resumeDismissed, setResumeDismissed] = useState(false);
  const canResume = store.activeSession && !resumeDismissed && mode === "overview";

  const daysSinceLast = useMemo(() => {
    if (!store.sessions.length) return null;
    const last = store.sessions[store.sessions.length - 1];
    return Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000);
  }, [store.sessions]);

  if (mode === "session" && session) {
    return (
      <SessionRunner
        session={session}
        dayKey={activeKey}
        deload={daysSinceLast != null && daysSinceLast >= 10}
        resume={store.activeSession && store.activeSession.dayKey === activeKey ? store.activeSession : null}
        onExit={() => { setMode("overview"); setPickedDay(null); store.saveActiveSession(null); }}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-28 safe-top">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl font-bold">Gym</h1>
        <button onClick={() => setMode(mode === "progress" ? "overview" : "progress")} className={`text-xs px-3 py-1.5 rounded-btn border ${mode === "progress" ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>
          {mode === "progress" ? "Today" : "Progress"}
        </button>
      </div>

      {canResume && (
        <Card className="p-3.5 mb-3 border-gold/40 bg-gold/5">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Resume {store.activeSession.sessionName}?</p>
              <p className="text-[11px] text-ink-dim">You have an unfinished session from earlier.</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" className="flex-1 text-xs py-2" onClick={() => { setResumeDismissed(true); store.saveActiveSession(null); }}>Discard</Button>
            <Button className="flex-1 text-xs py-2" onClick={() => { setPickedDay(store.activeSession.dayKey); setMode("session"); }}>Resume</Button>
          </div>
        </Card>
      )}

      {daysSinceLast != null && daysSinceLast >= 10 && mode === "overview" && (
        <Card className="p-3 mb-3 border-warn/30 bg-warn/5">
          <p className="text-xs text-warn">It's been {daysSinceLast} days since your last session. Start ~10% lighter today to ease back in and avoid injury.</p>
        </Card>
      )}

      {mode === "progress" ? (
        <Progress />
      ) : !session ? (
        <RestDayView onPick={(k) => { haptic("medium"); setPickedDay(k); setMode("session"); }} />
      ) : (
        <SessionOverview
          session={session}
          activeKey={activeKey}
          onStart={() => { haptic("medium"); setMode("session"); }}
          onSwitch={(k) => { haptic("light"); setPickedDay(k); }}
        />
      )}
    </div>
  );
}

function RestDayView({ onPick }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <Moon className="w-10 h-10 text-ink-dim mb-3" strokeWidth={1.5} />
      <p className="font-display text-lg font-semibold">Rest Day</p>
      <p className="text-xs text-ink-dim mt-1 max-w-[240px]">Recovery is when muscle grows. Want to train anyway? Pick a session.</p>
      <div className="grid grid-cols-1 gap-2 mt-5 w-full">
        {Object.entries(PROGRAM).map(([k, s]) => (
          <button key={k} onClick={() => onPick(k)} className="p-3 rounded-btn bg-surface-2 border border-line text-left flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-[10px] text-ink-dim">{s.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-faint" />
          </button>
        ))}
      </div>
    </Card>
  );
}

function SessionOverview({ session, activeKey, onStart, onSwitch }) {
  const store = useStore();
  const [showWarmup, setShowWarmup] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const [preview, setPreview] = useState(null);
  const warmup = WARMUPS[session.warmup] || [];

  return (
    <div>
      <Card className="p-5 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-btn bg-gold/15 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-gold" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl font-bold">{session.name}</p>
            <p className="text-xs text-ink-dim">{session.sub}</p>
          </div>
          <button onClick={() => setShowSwitch(true)} className="text-[11px] text-gold flex items-center gap-1">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Switch
          </button>
        </div>
        <div className="flex gap-2 text-[11px] text-ink-dim mb-4">
          <span>{session.exercises.length} exercises</span><span>·</span>
          <span>~{Math.round(session.exercises.length * 9 + (session.cardio ? session.cardio.durationMin : 0))} min</span>
          {session.cardio && <><span>·</span><span>+ cardio</span></>}
        </div>
        <Button className="w-full" onClick={onStart}><Play className="inline w-4 h-4 mr-1" /> Start Session</Button>
      </Card>

      <Card className="p-4 mb-3">
        <button onClick={() => setShowWarmup(!showWarmup)} className="w-full flex items-center justify-between">
          <span className="font-display font-semibold text-sm">Warm-up (5 min)</span>
          <ChevronRight className={`w-4 h-4 text-ink-faint transition-transform ${showWarmup ? "rotate-90" : ""}`} />
        </button>
        {showWarmup && (
          <div className="mt-3 space-y-1.5">
            {warmup.map((w, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-ink-dim"><span className="w-1 h-1 rounded-full bg-gold" /> {w}</div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-[11px] text-ink-dim uppercase tracking-wide mb-2 px-1">Today's Exercises · tap to preview</p>
      <div className="space-y-2">
        {session.exercises.map((ex, i) => (
          <Card key={ex.id} onClick={() => { haptic("light"); setPreview(ex); }} className="p-3 flex items-center gap-3">
            <span className="font-display text-lg font-bold text-ink-faint tabular w-6">{i + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{ex.name}</p>
              <p className="text-[10px] text-ink-dim">{ex.sets} × {ex.reps}{ex.repsUnit || ""} · {ex.muscle}</p>
            </div>
            <Info className="w-4 h-4 text-ink-faint" />
          </Card>
        ))}
        {session.cardio && (
          <Card className="p-3 flex items-center gap-3 border-gold/20">
            <Flame className="w-5 h-5 text-gold ml-1" />
            <div><p className="text-sm font-medium">{session.cardio.name}</p><p className="text-[10px] text-ink-dim">{session.cardio.detail}</p></div>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {showSwitch && (
          <Sheet open onClose={() => setShowSwitch(false)} title="Switch session">
            <div className="space-y-2">
              <p className="text-xs text-ink-dim mb-2">Pick a different session to run today.</p>
              {Object.entries(PROGRAM).map(([k, s]) => (
                <Card key={k} onClick={() => { onSwitch(k); setShowSwitch(false); }} className={`p-3 flex items-center justify-between ${k === activeKey ? "border-gold/40" : ""}`}>
                  <div><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-ink-dim">{s.sub}</p></div>
                  {k === activeKey && <Check className="w-4 h-4 text-gold" />}
                </Card>
              ))}
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <Sheet open onClose={() => setPreview(null)} title={preview.name}>
            <FormGuide ex={preview} units={store.units} />
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionRunner({ session, dayKey, deload, resume, onExit }) {
  const store = useStore();
  const [exList, setExList] = useState(resume?.exList || session.exercises);
  const [exIdx, setExIdx] = useState(resume?.exIdx || 0);
  const [setIdx, setSetIdx] = useState(0);
  const [completed, setCompleted] = useState(resume?.completed || {});
  const [showForm, setShowForm] = useState(false);
  const [showPlate, setShowPlate] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const [showCardio, setShowCardio] = useState(false);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isWarmupSet, setIsWarmupSet] = useState(false);
  const [restEditorOpen, setRestEditor] = useState(false);
  const [doneExercises, setDoneExercises] = useState(resume?.doneExercises || {});
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [cardioDone, setCardioDone] = useState(false);

  const ex = exList[exIdx];
  const startTimeRef = useRef(resume?.startTime || Date.now());
  const pausedAccumRef = useRef(resume?.pausedAccum || 0);
  const pauseStartRef = useRef(null);

  const exUnit = store.exerciseUnits[ex?.id] || store.units;

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const pausedNow = pauseStartRef.current ? now - pauseStartRef.current : 0;
      setElapsed(Math.floor((now - startTimeRef.current - pausedAccumRef.current - pausedNow) / 1000));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [paused]);

  const overload = useMemo(() => {
    if (!ex) return { suggested: 0, msg: "" };
    const sets = store.workouts.filter((w) => w.exercise === ex.name && w.warmup !== "yes" && w.unit !== "cardio");
    if (!sets.length) return { suggested: deload ? Math.round(ex.start * 0.9) : ex.start, msg: deload ? "Easing back in, start light." : "First time, start moderate and focus on form." };
    const byDate = {};
    sets.forEach((s) => { (byDate[s.date] = byDate[s.date] || []).push(s); });
    const dates = Object.keys(byDate).sort().slice(-3);
    const lastSets = byDate[dates[dates.length - 1]];
    const lastMaxW = Math.max(...lastSets.map((s) => Number(s.weight) || 0));
    const hitAllReps = lastSets.every((s) => Number(s.reps) >= ex.reps);
    const incLb = ex.kind === "compound" ? 5 : 2.5;
    if (deload) return { suggested: Math.round(lastMaxW * 0.9), msg: "Back from a break, 10% lighter today." };
    const maxes = dates.map((d) => Math.max(...byDate[d].map((s) => Number(s.weight) || 0)));
    const stuck = maxes.length === 3 && maxes.every((m) => m === maxes[0]);
    if (stuck) return { suggested: lastMaxW + incLb, msg: "Stuck 3 sessions here. Push the weight up today." };
    if (hitAllReps) return { suggested: lastMaxW + incLb, msg: "Hit all reps last time. Try going up." };
    return { suggested: lastMaxW, msg: "Missed some reps last time. Nail this weight first." };
  }, [ex, store.workouts, deload]);

  const lastBest = useMemo(() => {
    if (!ex) return null;
    const sets = store.workouts.filter((w) => w.exercise === ex.name && w.warmup !== "yes" && w.unit !== "cardio");
    if (!sets.length) return null;
    const maxW = Math.max(...sets.map((s) => Number(s.weight) || 0));
    const at = sets.find((s) => Number(s.weight) === maxW);
    return { weight: maxW, reps: Number(at?.reps) || 0 };
  }, [ex, store.workouts]);

  const step = weightStep(ex?.kind, exUnit);
  const [weight, setWeight] = useState(toDisplayWeight(overload.suggested, exUnit));
  const [reps, setReps] = useState(ex?.reps || 10);
  const [restTime, setRestTime] = useState(ex?.rest || store.appPrefs.defaultRestSec);

  useEffect(() => {
    if (!ex) return;
    setWeight(toDisplayWeight(overload.suggested, exUnit));
    setReps(ex.reps);
    setRestTime(ex.rest || store.appPrefs.defaultRestSec);
    setSetIdx(0);
    setIsWarmupSet(false);
    // eslint-disable-next-line
  }, [exIdx, exUnit]);

  useEffect(() => {
    if (finished) return;
    store.saveActiveSession({
      dayKey, sessionName: session.name, exList, exIdx, completed, doneExercises,
      startTime: startTimeRef.current, pausedAccum: pausedAccumRef.current, ts: Date.now(),
    });
    // eslint-disable-next-line
  }, [exIdx, completed, doneExercises, finished]);

  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);
  const restEndRef = useRef(null);
  const warnedRef = useRef(false);

  // Keep the screen awake during the workout if enabled and supported.
  useEffect(() => {
    if (!store.appPrefs.keepScreenAwake || !("wakeLock" in navigator)) return;
    let lock = null;
    let released = false;
    const acquire = async () => {
      try { lock = await navigator.wakeLock.request("screen"); } catch { /* ignore */ }
    };
    acquire();
    const onVis = () => { if (document.visibilityState === "visible" && !released) acquire(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVis);
      if (lock) lock.release().catch(() => {});
    };
  }, [store.appPrefs.keepScreenAwake]);

  const startRest = (secs) => {
    if (!store.appPrefs.autoStartRest) return;
    setResting(true);
    warnedRef.current = false;
    restEndRef.current = Date.now() + secs * 1000;
    setRestLeft(secs);
  };

  useEffect(() => {
    if (!resting) return;
    const tick = () => {
      const left = Math.max(0, Math.round((restEndRef.current - Date.now()) / 1000));
      setRestLeft(left);
      if (left <= 10 && left > 0 && !warnedRef.current) { warnedRef.current = true; haptic("light"); }
      if (left <= 0) { setResting(false); haptic("heavy"); }
    };
    const iv = setInterval(tick, 250);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", onVis); };
  }, [resting]);

  const pushSet = (record) => setCompleted((c) => ({ ...c, [ex.id]: [...(c[ex.id] || []), record] }));

  const logSet = () => {
    const storedW = isWarmupSet ? 0 : toStoredWeight(weight, exUnit);
    const isPR = !isWarmupSet && ex.kind !== "bodyweight" && lastBest && storedW > lastBest.weight;
    const unit = ex.kind === "bodyweight" && ex.repsUnit === "sec" ? "sec" : exUnit;
    store.logSet(session.name, ex.name, setIdx + 1, storedW, reps, unit, isPR, isWarmupSet);
    pushSet({ weight: storedW, dispWeight: isWarmupSet ? 0 : weight, dispUnit: exUnit, reps, isPR, warmup: isWarmupSet });
    if (isPR) haptic("pr"); else haptic("medium");

    const realSetsLogged = (completed[ex.id] || []).filter((s) => !s.warmup).length + (isWarmupSet ? 0 : 1);
    if (!isWarmupSet && realSetsLogged >= ex.sets) {
      haptic("exerciseDone");
      markDoneAndAdvance();
    } else {
      if (!isWarmupSet) setSetIdx(setIdx + 1);
      if (reps >= ex.reps && !isWarmupSet && ex.kind !== "bodyweight") setWeight(weight + step);
      setIsWarmupSet(false);
      startRest(restTime);
    }
  };

  const skipSet = () => {
    haptic("light");
    pushSet({ skipped: true });
    if (setIdx + 1 < ex.sets) setSetIdx(setIdx + 1);
    else markDoneAndAdvance();
  };

  const markDoneAndAdvance = () => {
    const nextDone = { ...doneExercises, [ex.id]: true };
    setDoneExercises(nextDone);
    advanceFrom(exIdx, nextDone);
  };

  const advanceFrom = (fromIdx, doneMap) => {
    const n = exList.length;
    for (let off = 1; off <= n; off++) {
      const i = (fromIdx + off) % n;
      if (!doneMap[exList[i].id]) { setExIdx(i); startRest(restTime); return; }
    }
    if (session.cardio && !cardioDone) { setShowCardio(true); return; }
    finishSession();
  };

  const goNextExercise = () => {
    const n = exList.length;
    for (let off = 1; off <= n; off++) {
      const i = (exIdx + off) % n;
      if (!doneExercises[exList[i].id] && i !== exIdx) { setExIdx(i); startRest(restTime); return; }
    }
    const remaining = exList.filter((e) => !doneExercises[e.id] && e.id !== ex.id);
    if (remaining.length === 0) {
      if (session.cardio && !cardioDone) setShowCardio(true);
      else requestEnd();
    }
  };

  const skipExercise = () => { haptic("light"); goNextExercise(); };

  const swapExercise = (nameOrEx) => {
    haptic("medium");
    const newEx = typeof nameOrEx === "string"
      ? { ...buildExercise(nameOrEx, ex.id), sets: ex.sets }
      : nameOrEx;
    setExList((list) => list.map((e, i) => (i === exIdx ? newEx : e)));
    setShowSwap(false);
  };

  const togglePause = () => {
    haptic("light");
    if (!paused) { pauseStartRef.current = Date.now(); }
    else if (pauseStartRef.current) {
      const delta = Date.now() - pauseStartRef.current;
      pausedAccumRef.current += delta;
      if (resting && restEndRef.current) restEndRef.current += delta;
      pauseStartRef.current = null;
    }
    setPaused(!paused);
  };

  const requestEnd = () => {
    haptic("medium"); setResting(false);
    if (store.appPrefs.confirmEndWorkout) setConfirmEnd(true);
    else finishSession();
  };

  const finishSession = () => { setResting(false); haptic("success"); setFinished(true); };

  const logCardioAndContinue = (data) => {
    store.logCardio(session.name, session.cardio.name, data.minutes, data.speed, data.incline, data.distance);
    setCardioDone(true);
    setShowCardio(false);
    haptic("exerciseDone");
    const allStrengthDone = exList.every((e) => doneExercises[e.id]);
    if (allStrengthDone) finishSession();
  };

  if (finished) {
    const durationMin = Math.round((Date.now() - startTimeRef.current - pausedAccumRef.current) / 60000);
    return <SessionComplete session={session} completed={completed} durationMin={durationMin} onExit={onExit} />;
  }

  const realSets = (completed[ex.id] || []).filter((s) => !s.warmup && !s.skipped).length;
  const isBodyweight = ex.kind === "bodyweight";
  const repsLabel = ex.repsUnit === "sec" ? "seconds" : ex.repsUnit === "/side" ? "reps/side" : "reps";
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom">
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={onExit} className="p-2 -ml-2"><X className="w-5 h-5 text-ink-dim" /></button>
        <button onClick={() => setShowJump(true)} className="text-center">
          <p className="font-display font-semibold text-sm">{session.name}</p>
          <p className="text-[10px] text-ink-dim">Exercise {exIdx + 1} of {exList.length} · tap to jump</p>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={togglePause} className="p-2">{paused ? <Play className="w-4 h-4 text-gold" /> : <Pause className="w-4 h-4 text-ink-dim" />}</button>
          <button onClick={requestEnd} className="text-[11px] text-gold px-1">End</button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-1">
        <Clock className="w-3 h-3 text-ink-faint" />
        <span className="font-display text-sm font-semibold tabular text-ink-dim">{mm}:{ss}</span>
        {paused && <span className="text-[10px] text-gold ml-1">paused</span>}
      </div>

      <div className="flex gap-1 px-4 mt-2">
        {exList.map((e, i) => (
          <button key={e.id} onClick={() => { haptic("light"); setExIdx(i); }} className={`h-1.5 flex-1 rounded-full ${doneExercises[e.id] ? "bg-gold" : i === exIdx ? "bg-gold/50" : "bg-line"}`} />
        ))}
        {session.cardio && <span className={`h-1.5 flex-1 rounded-full ${cardioDone ? "bg-gold" : "bg-line"}`} />}
      </div>

      <AnimatePresence>
        {confirmEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center px-8">
            <p className="font-display text-2xl font-bold mb-2 text-center">End session?</p>
            <p className="text-ink-dim text-sm mb-8 text-center">
              {Object.keys(doneExercises).length} of {exList.length} exercises done.
              {Object.keys(doneExercises).length < exList.length ? " You still have exercises left." : " Everything's done."}
            </p>
            <div className="flex gap-3 w-full max-w-[300px]">
              <Button variant="ghost" className="flex-1" onClick={() => { haptic("light"); setConfirmEnd(false); }}>Keep going</Button>
              <Button variant="danger" className="flex-1" onClick={() => { setConfirmEnd(false); finishSession(); }}>End now</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center">
            <Pause className="w-12 h-12 text-gold mb-4" />
            <p className="font-display text-2xl font-bold mb-1">Paused</p>
            <p className="text-ink-dim text-sm mb-8">Timer stopped. Take your time.</p>
            <Button onClick={togglePause}><Play className="inline w-4 h-4 mr-1" /> Resume</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resting && !paused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center">
            <p className="text-ink-dim text-sm mb-2">Rest</p>
            <p className={`font-display text-7xl font-bold tabular ${restLeft <= 10 ? "text-warn" : "text-gold"}`}>{restLeft}</p>
            <p className="text-ink-faint text-xs mt-2">Next: {exList[exIdx]?.name} · Set {setIdx + 1}</p>
            <div className="flex gap-2 mt-8">
              <button onClick={() => { restEndRef.current += 15000; setRestLeft((t) => t + 15); }} className="text-sm text-ink-dim border border-line rounded-btn px-4 py-2">+15s</button>
              <button onClick={() => setResting(false)} className="text-sm text-gold border border-gold/40 rounded-btn px-5 py-2">Skip rest</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-5 pb-40 pt-2">
        <motion.div key={exIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="text-center mb-1 mt-2"><Tag color="gold">{ex.muscle}</Tag></div>
          <h2 className="font-display text-2xl font-bold text-center leading-tight mb-1">{ex.name}</h2>
          <p className="text-center text-xs text-ink-dim mb-2">{ex.machine}</p>

          <div className="flex justify-center gap-1.5 my-3">
            {Array.from({ length: ex.sets }).map((_, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${i < realSets ? "bg-gold text-bg" : i === setIdx ? "border-2 border-gold text-gold" : "border border-line text-ink-faint"}`}>
                {i < realSets ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-gold mb-1">{overload.msg}</p>
          {lastBest && <p className="text-center text-[11px] text-ink-dim mb-3">Last time: <span className="text-ink">{toDisplayWeight(lastBest.weight, exUnit)} {exUnit} × {lastBest.reps}</span></p>}

          {!isBodyweight && (
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-[10px] text-ink-dim uppercase tracking-wide">Weight ({exUnit})</p>
                <button onClick={() => { haptic("light"); store.setExerciseUnit(ex.id, exUnit === "lbs" ? "kg" : "lbs"); }} className="text-[10px] text-gold border border-gold/30 rounded-full px-2 py-0.5">
                  {exUnit === "lbs" ? "use kg" : "use lbs"}
                </button>
              </div>
              <Stepper value={weight} onChange={setWeight} step={step} />
            </div>
          )}
          <div className="mb-3">
            <p className="text-center text-[10px] text-ink-dim uppercase tracking-wide mb-1">{repsLabel}</p>
            <Stepper value={reps} onChange={setReps} step={ex.repsUnit === "sec" ? 5 : 1} />
          </div>

          <button onClick={() => setIsWarmupSet(!isWarmupSet)} className="flex items-center justify-center gap-2 w-full mb-3 text-[11px] text-ink-dim">
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isWarmupSet ? "bg-gold border-gold" : "border-line"}`}>{isWarmupSet && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}</div>
            Mark as warm-up set (won't count toward volume or PRs)
          </button>

          <Button className="w-full text-base py-4" onClick={logSet}>{isWarmupSet ? "Log Warm-up" : `Log Set ${setIdx + 1}`}</Button>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button onClick={skipSet} className="text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn"><SkipForward className="w-3.5 h-3.5" /> Skip set</button>
            <button onClick={skipExercise} className="text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn"><SkipForward className="w-3.5 h-3.5" /> Skip exercise</button>
            <button onClick={() => setShowForm(true)} className="text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn"><Info className="w-3.5 h-3.5" /> How to</button>
            <button onClick={() => setShowSwap(true)} className="text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn"><ArrowLeftRight className="w-3.5 h-3.5" /> Swap</button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setRestEditor(true)} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn">
              <Timer className="w-3.5 h-3.5" /> Rest: {restTime}s
            </button>
            {ex.kind === "compound" && !isBodyweight && (
              <button onClick={() => setShowPlate(true)} className="flex-1 text-[11px] text-ink-dim flex items-center justify-center gap-1 py-2 border border-line rounded-btn"><Calculator className="w-3.5 h-3.5" /> Plates</button>
            )}
          </div>

          {session.cardio && !cardioDone && (
            <button onClick={() => setShowCardio(true)} className="w-full mt-3 text-[11px] text-gold flex items-center justify-center gap-1 py-2.5 border border-gold/30 rounded-btn bg-gold/5">
              <Footprints className="w-3.5 h-3.5" /> Do cardio: {session.cardio.name}
            </button>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && <Sheet open onClose={() => setShowForm(false)} title={ex.name}><FormGuide ex={ex} units={exUnit} /></Sheet>}
      </AnimatePresence>
      <AnimatePresence>
        {showPlate && <Sheet open onClose={() => setShowPlate(false)} title="Plate Calculator"><PlateCalc target={weight} unit={exUnit} /></Sheet>}
      </AnimatePresence>
      <AnimatePresence>
        {showSwap && <Sheet open onClose={() => setShowSwap(false)} title="Swap exercise"><ExerciseSwap ex={ex} onSwap={swapExercise} /></Sheet>}
      </AnimatePresence>
      <AnimatePresence>
        {restEditorOpen && (
          <Sheet open onClose={() => setRestEditor(false)} title="Rest time">
            <Stepper value={restTime} onChange={setRestTime} step={15} suffix="seconds" />
            <Button className="w-full mt-4" onClick={() => setRestEditor(false)}>Done</Button>
          </Sheet>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCardio && session.cardio && (
          <Sheet open onClose={() => setShowCardio(false)} title={session.cardio.name}>
            <CardioRunner cardio={session.cardio} onDone={logCardioAndContinue} onSkip={() => { setCardioDone(true); setShowCardio(false); const allDone = exList.every((e) => doneExercises[e.id]); if (allDone) finishSession(); }} />
          </Sheet>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showJump && (
          <Sheet open onClose={() => setShowJump(false)} title="Jump to exercise">
            <div className="space-y-1.5">
              {exList.map((e, i) => (
                <button key={e.id} onClick={() => { setExIdx(i); setShowJump(false); }} className={`w-full text-left p-3 rounded-btn flex items-center gap-3 ${i === exIdx ? "bg-surface-2 border border-gold/40" : "bg-surface-2"}`}>
                  <span className="font-display font-bold text-ink-faint w-5">{i + 1}</span>
                  <span className="text-sm flex-1">{e.name}</span>
                  {doneExercises[e.id] && <Check className="w-4 h-4 text-gold" />}
                </button>
              ))}
              {session.cardio && (
                <div className={`w-full text-left p-3 rounded-btn flex items-center gap-3 ${cardioDone ? "bg-surface-2 border border-gold/40" : "bg-surface-2"}`}>
                  <Footprints className="w-4 h-4 text-gold" />
                  <span className="text-sm flex-1">{session.cardio.name}</span>
                  {cardioDone && <Check className="w-4 h-4 text-gold" />}
                </div>
              )}
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardioRunner({ cardio, onDone, onSkip }) {
  const [speed, setSpeed] = useState(cardio.speed || 3.5);
  const [incline, setIncline] = useState(cardio.incline || 10);
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const targetSec = (cardio.durationMin || 15) * 60;
  const startRef = useRef(null);
  const accumRef = useRef(0);
  const speedUnit = cardio.speedUnit || "mph";

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const iv = setInterval(() => {
      setSecs(accumRef.current + Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => { accumRef.current += Math.floor((Date.now() - startRef.current) / 1000); clearInterval(iv); };
  }, [running]);

  const distance = +(speed * (secs / 3600)).toFixed(2);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = Math.min(100, Math.round((secs / targetSec) * 100));

  return (
    <div>
      <p className="text-xs text-ink-dim mb-3">{cardio.mode === "run" ? "Run" : "Walk"} target: {cardio.durationMin} min. Adjust speed and incline anytime, even mid-run.</p>

      <Card className="p-5 mb-3 text-center">
        <p className="font-display text-6xl font-bold tabular text-gold">{mm}:{ss}</p>
        <div className="h-1.5 bg-line rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-ink-dim mt-2">{pct}% of target · ~{distance} mi</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-center text-[10px] text-ink-dim uppercase tracking-wide mb-1">Speed ({speedUnit})</p>
          <Stepper value={speed} onChange={setSpeed} step={0.1} />
        </div>
        <div>
          <p className="text-center text-[10px] text-ink-dim uppercase tracking-wide mb-1">Incline (%)</p>
          <Stepper value={incline} onChange={setIncline} step={0.5} />
        </div>
      </div>

      {!running ? (
        <Button className="w-full" onClick={() => { haptic("medium"); setRunning(true); }}><Play className="inline w-4 h-4 mr-1" /> {secs > 0 ? "Resume" : "Start"} cardio</Button>
      ) : (
        <Button variant="ghost" className="w-full" onClick={() => { haptic("light"); setRunning(false); }}><Pause className="inline w-4 h-4 mr-1" /> Pause</Button>
      )}

      <div className="flex gap-2 mt-3">
        <Button variant="ghost" className="flex-1 text-xs" onClick={onSkip}>Skip cardio</Button>
        <Button className="flex-1 text-xs" disabled={secs < 10} onClick={() => { setRunning(false); onDone({ minutes: +(secs / 60).toFixed(1), speed, incline, distance }); }}>
          <Check className="inline w-4 h-4 mr-1" /> Done
        </Button>
      </div>
    </div>
  );
}

function ExerciseSwap({ ex, onSwap }) {
  const [tab, setTab] = useState("same");
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState("");
  const [group, setGroup] = useState("All");

  const sameList = useMemo(() => {
    const g = groupForMuscle(ex.muscleGroup || ex.muscle);
    return exercisesForGroup(g).filter((n) => n !== ex.name);
  }, [ex]);

  const allFiltered = useMemo(() => {
    let list = ALL_EXERCISE_NAMES.filter((n) => n !== ex.name);
    if (group !== "All") list = exercisesForGroup(group).filter((n) => n !== ex.name);
    if (q.trim()) list = ALL_EXERCISE_NAMES.filter((n) => n !== ex.name && n.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [q, group, ex]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {[["same", "Same muscle"], ["all", "All exercises"], ["custom", "Custom"]].map(([id, label]) => (
          <button key={id} onClick={() => { haptic("light"); setTab(id); }}
            className={`flex-1 py-2 rounded-btn text-xs font-medium border ${tab === id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "same" && (
        <div className="space-y-2">
          {sameList.length === 0 && <p className="text-xs text-ink-dim">No library matches. Try All exercises or Custom.</p>}
          {sameList.map((alt) => (
            <Card key={alt} onClick={() => onSwap(alt)} className="p-3 flex items-center justify-between">
              <span className="text-sm">{alt}</span><ArrowLeftRight className="w-4 h-4 text-ink-faint" />
            </Card>
          ))}
        </div>
      )}

      {tab === "all" && (
        <div>
          <div className="flex items-center gap-2 bg-surface-2 rounded-btn px-3 py-2 mb-2">
            <Search className="w-4 h-4 text-ink-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any exercise..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          {!q.trim() && (
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
              {["All", ...libraryGroups()].map((g) => (
                <button key={g} onClick={() => setGroup(g)} className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-btn border ${group === g ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{g}</button>
              ))}
            </div>
          )}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
            {allFiltered.map((n) => (
              <button key={n} onClick={() => onSwap(n)} className="w-full text-left p-2.5 rounded-btn bg-surface-2 flex items-center justify-between">
                <span className="text-sm">{n}</span><ArrowLeftRight className="w-3.5 h-3.5 text-ink-faint" />
              </button>
            ))}
            {allFiltered.length === 0 && <p className="text-xs text-ink-dim py-4 text-center">No matches.</p>}
          </div>
        </div>
      )}

      {tab === "custom" && (
        <div>
          <p className="text-xs text-ink-dim mb-2">Type any exercise name. You'll log sets, reps and weight normally.</p>
          <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. Smith Machine Press" className="w-full bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none mb-3" />
          <Button className="w-full" disabled={!custom.trim()} onClick={() => onSwap(custom.trim())}>Swap to this</Button>
        </div>
      )}
    </div>
  );
}

function ExerciseGif({ name }) {
  const url = getExerciseGif(name);
  if (!url) return null;
  return (
    <div className="mb-4 mx-auto w-full max-w-[260px]">
      <div className="rounded-2xl overflow-hidden border-2 border-gold/40 bg-white">
        <img src={url} alt={name} className="w-full h-auto block" loading="lazy"
          onError={(e) => { e.currentTarget.parentElement.parentElement.style.display = "none"; }} />
      </div>
      <p className="text-[9px] text-ink-faint text-center mt-1">Demonstration · loops automatically</p>
    </div>
  );
}

function FormGuide({ ex, units }) {
  return (
    <div>
      <ExerciseGif name={ex.name} />
      {ex.steps?.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-gold uppercase tracking-wide mb-2 font-semibold">Step by step</p>
          <div className="space-y-2">
            {ex.steps.map((s, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="font-display text-sm font-bold text-gold tabular flex-shrink-0">{i + 1}</span>
                <p className="text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {ex.mistakes?.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-danger uppercase tracking-wide mb-2 font-semibold">Common mistakes</p>
          <div className="space-y-1">
            {ex.mistakes.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-ink-dim"><X className="w-3 h-3 text-danger flex-shrink-0" /> {m}</div>
            ))}
          </div>
        </div>
      )}
      {ex.breathing && (
        <div className="p-3 bg-surface-2 rounded-card mb-3">
          <p className="text-[11px] text-ink-dim"><span className="text-gold">Breathing:</span> {ex.breathing}</p>
        </div>
      )}
      <div className="p-3 bg-surface-2 rounded-card">
        <p className="text-[11px] text-ink-dim">Target: <span className="text-ink">{ex.sets} sets × {ex.reps}{ex.repsUnit || " reps"}</span> · Rest {ex.rest}s</p>
      </div>
    </div>
  );
}

function PlateCalc({ target, unit }) {
  const store = useStore();
  const barWeight = unit === "lbs" ? 45 : 20;
  const plates = unit === "lbs" ? [45, 35, 25, 10, 5, 2.5] : [20, 15, 10, 5, 2.5, 1.25];
  const perSide = (target - barWeight) / 2;
  let remaining = perSide;
  const used = [];
  if (perSide > 0) for (const p of plates) while (remaining >= p) { used.push(p); remaining -= p; }
  const key = `${target}${unit}`;
  const saved = store.plateMemory[key];

  return (
    <div>
      <p className="text-sm text-ink-dim mb-3">For <span className="text-gold font-semibold">{target} {unit}</span> total (bar = {barWeight} {unit}):</p>
      {perSide <= 0 ? <p className="text-sm">Just the bar, or use dumbbells.</p> : (
        <>
          <p className="text-xs text-ink-dim mb-2">Per side:</p>
          <div className="flex flex-wrap gap-2">{used.map((p, i) => <span key={i} className="font-display font-bold bg-gold/15 text-gold px-3 py-2 rounded-btn tabular">{p}</span>)}</div>
          {remaining > 0 && <p className="text-[11px] text-warn mt-2">+{Math.round(remaining * 100) / 100} {unit} leftover</p>}
          <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => { haptic("light"); store.savePlateSetup(key, used); }}>
            <Save className="inline w-3.5 h-3.5 mr-1" /> {saved ? "Saved setup updated" : "Remember this setup"}
          </Button>
          {saved && <p className="text-[10px] text-ink-faint text-center mt-2">Saved: {saved.join(", ")} per side</p>}
        </>
      )}
    </div>
  );
}

function SessionComplete({ session, completed, durationMin, onExit }) {
  const store = useStore();
  const askReview = store.appPrefs.askReviewAfterWorkout;
  const allSets = Object.values(completed).flat().filter((s) => !s.skipped && !s.warmup);
  const totalVolume = allSets.reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0);
  const prs = allSets.filter((s) => s.isPR);
  const [rpe, setRpe] = useState(7);
  const [notes, setNotes] = useState("");
  const [logWeight, setLogWeight] = useState("");
  const [saved, setSaved] = useState(false);
  const [showReview, setShowReview] = useState(askReview);

  const volDisplay = store.units === "kg" ? Math.round(totalVolume / 2.2046) : Math.round(totalVolume);

  const save = () => {
    haptic("success");
    store.logSession({ name: session.name, durationMin, volume: Math.round(totalVolume), rpe: showReview ? rpe : "", notes });
    if (logWeight) store.logBodyStat({ weight: logWeight, chest: "", waist: "", arms: "", notes: "post-session" });
    setSaved(true);
    setTimeout(onExit, 600);
  };

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom">
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-28">
        <div className="flex flex-col items-center text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
            <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mb-4"><Check className="w-10 h-10 text-gold" strokeWidth={2.5} /></div>
          </motion.div>
          <h1 className="font-display text-3xl font-bold mb-1">Session Complete</h1>
          <p className="text-ink-dim text-sm">{session.name} · Strong work, {store.userName}.</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-3 text-center"><p className="font-display text-xl font-bold text-gold tabular">{durationMin}</p><p className="text-[10px] text-ink-dim">Minutes</p></Card>
          <Card className="p-3 text-center"><p className="font-display text-xl font-bold text-gold tabular">{volDisplay.toLocaleString()}</p><p className="text-[10px] text-ink-dim">Volume {store.units}</p></Card>
          <Card className="p-3 text-center"><p className="font-display text-xl font-bold text-gold tabular">{prs.length}</p><p className="text-[10px] text-ink-dim">PRs</p></Card>
        </div>

        {prs.length > 0 && (
          <Card className="p-4 mb-4 border-gold/30">
            <div className="flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-gold" /><span className="font-display font-semibold text-sm">New PRs</span></div>
            {prs.map((p, i) => <p key={i} className="text-xs text-gold tabular">{toDisplayWeight(p.weight, store.units)} {store.units} × {p.reps}</p>)}
          </Card>
        )}

        {!showReview ? (
          <Card className="p-4 mb-3 flex items-center justify-between" onClick={() => setShowReview(true)}>
            <p className="text-sm text-ink-dim">Add effort rating & notes (optional)</p>
            <Plus className="w-4 h-4 text-gold" />
          </Card>
        ) : (
          <>
            <Card className="p-4 mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-sm">How hard was today?</p>
                <button onClick={() => setShowReview(false)} className="text-[10px] text-ink-faint">skip</button>
              </div>
              <p className="text-[11px] text-ink-dim mb-3">RPE {rpe} · {rpe <= 4 ? "Easy" : rpe <= 6 ? "Moderate" : rpe <= 8 ? "Hard" : "Max effort"}</p>
              <input type="range" min="1" max="10" value={rpe} onChange={(e) => setRpe(Number(e.target.value))} className="w-full accent-gold" />
            </Card>
            <Card className="p-4 mb-3">
              <p className="font-display font-semibold text-sm mb-2">Notes (optional)</p>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Felt strong, bad sleep, etc." rows={2} className="w-full bg-surface-2 rounded-btn px-3 py-2 text-sm outline-none resize-none" />
            </Card>
          </>
        )}

        <Card className="p-4 mb-4">
          <p className="font-display font-semibold text-sm mb-2">Log weight now? (optional)</p>
          <input value={logWeight} onChange={(e) => setLogWeight(e.target.value)} type="number" inputMode="decimal" placeholder={`Body weight (${store.units})`} className="w-full bg-surface-2 rounded-btn px-3 py-2.5 text-sm outline-none" />
        </Card>
      </div>

      <div className="px-6 pb-6 pt-3 bg-bg border-t border-line safe-bottom">
        <Button className="w-full" onClick={save} disabled={saved}>{saved ? "Saved" : "Save & Finish"}</Button>
      </div>
    </div>
  );
}

function Progress() {
  const store = useStore();
  const [tab, setTab] = useState("strength");
  const exercises = useMemo(() => [...new Set(store.workouts.filter((w) => w.warmup !== "yes" && w.unit !== "cardio").map((w) => w.exercise))], [store.workouts]);
  const [selected, setSelected] = useState(exercises[0] || null);
  const [search, setSearch] = useState("");

  if (!store.workouts.length && !store.sessions.length) {
    return <EmptyState icon={TrendingUp} title="No sessions logged yet" sub="Your charts, PRs, and history appear here once you train." />;
  }

  const filtered = exercises.filter((e) => e.toLowerCase().includes(search.toLowerCase()));

  const chartData = useMemo(() => {
    if (!selected) return [];
    const byDate = {};
    store.workouts.filter((w) => w.exercise === selected && w.warmup !== "yes").forEach((w) => {
      const wt = Number(w.weight) || 0;
      if (!byDate[w.date] || wt > byDate[w.date]) byDate[w.date] = wt;
    });
    return Object.entries(byDate).map(([date, weight]) => ({ date: date.slice(5), weight: store.units === "kg" ? Math.round(weight / 2.2046) : weight }));
  }, [selected, store.workouts, store.units]);

  const maxes = useMemo(() => {
    const out = {};
    store.workouts.filter((w) => w.warmup !== "yes" && w.unit !== "cardio").forEach((w) => {
      const e1 = epley1rm(Number(w.weight) || 0, Number(w.reps) || 0);
      if (!out[w.exercise] || e1 > out[w.exercise]) out[w.exercise] = e1;
    });
    return Object.entries(out).sort((a, b) => b[1] - a[1]);
  }, [store.workouts]);

  const volumeByMuscle = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    const out = {};
    store.workouts.filter((w) => w.warmup !== "yes" && w.unit !== "cardio" && new Date(w.date).getTime() >= cutoff).forEach((w) => {
      let muscle = "Other";
      Object.values(PROGRAM).forEach((s) => s.exercises.forEach((e) => { if (e.name === w.exercise) muscle = e.muscle.split(" ")[0]; }));
      Object.entries(LIBRARY).forEach(([g, list]) => list.forEach((e) => { if (e.name === w.exercise) muscle = g; }));
      out[muscle] = (out[muscle] || 0) + (Number(w.weight) || 0) * (Number(w.reps) || 0);
    });
    return Object.entries(out).map(([muscle, vol]) => ({ muscle, vol: Math.round(store.units === "kg" ? vol / 2.2046 : vol) }));
  }, [store.workouts, store.units]);

  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {[["strength", "Strength"], ["maxes", "Maxes"], ["volume", "Volume"], ["history", "History"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2 rounded-btn text-[11px] font-medium border ${tab === id ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{label}</button>
        ))}
      </div>

      {tab === "strength" && (
        <>
          <div className="flex items-center gap-2 bg-surface-2 rounded-btn px-3 py-2 mb-3">
            <Search className="w-4 h-4 text-ink-faint" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find exercise..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {filtered.map((e) => (
              <button key={e} onClick={() => setSelected(e)} className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-btn border ${selected === e ? "bg-surface-2 border-gold/40 text-gold" : "border-line text-ink-dim"}`}>{e}</button>
            ))}
          </div>
          <Card className="p-4">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8A8A9A" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#8A8A9A" }} width={28} />
                  <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2D35", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="weight" stroke="var(--zor-accent, #C9A84C)" strokeWidth={2.5} dot={{ fill: "var(--zor-accent, #C9A84C)", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-xs text-ink-dim text-center py-8">Select an exercise.</p>}
          </Card>
        </>
      )}

      {tab === "maxes" && (
        <Card className="divide-y divide-line">
          {maxes.length ? maxes.map(([ex, e1]) => (
            <div key={ex} className="flex items-center justify-between p-3">
              <span className="text-sm">{ex}</span>
              <span className="text-xs text-gold tabular">~{store.units === "kg" ? Math.round(e1 / 2.2046) : e1} {store.units} 1RM</span>
            </div>
          )) : <p className="p-4 text-xs text-ink-dim">Log working sets to estimate your maxes.</p>}
        </Card>
      )}

      {tab === "volume" && (
        <Card className="p-4">
          <p className="font-display font-semibold text-sm mb-3">Volume by muscle, last 7 days</p>
          {volumeByMuscle.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeByMuscle}>
                <XAxis dataKey="muscle" tick={{ fontSize: 9, fill: "#8A8A9A" }} />
                <YAxis tick={{ fontSize: 10, fill: "#8A8A9A" }} width={36} />
                <Tooltip contentStyle={{ background: "#1C1F26", border: "1px solid #2A2D35", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="vol" fill="var(--zor-accent, #C9A84C)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-xs text-ink-dim text-center py-8">No volume logged in the last 7 days.</p>}
        </Card>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {store.sessions.length ? store.sessions.slice().reverse().map((s, i) => (
            <Card key={i} className="p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-[11px] text-ink-dim">{s.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gold tabular">{s.durationMin} min · {Number(s.volume).toLocaleString()} lbs</p>
                  {s.rpe && <p className="text-[10px] text-ink-dim">RPE {s.rpe}</p>}
                </div>
              </div>
              {s.notes && <p className="text-[11px] text-ink-dim mt-2 pt-2 border-t border-line italic">"{s.notes}"</p>}
            </Card>
          )) : <p className="text-xs text-ink-dim text-center py-8">No completed sessions yet.</p>}
        </div>
      )}
    </div>
  );
}
